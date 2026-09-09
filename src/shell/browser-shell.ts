import { LitElement, css, html, unsafeCSS, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import "./shell-tab-strip.ts";
import "./shell-toolbar.ts";
import "./shell-new-tab.ts";

import { generateThemeCSSVariables } from "../theme/colors.js";
import { LAYOUT_CONFIG, generateLayoutCSSVariables } from "../theme/layout.js";
import {
  getWidget,
  listWidgets,
  type WidgetDefinition,
} from "../widgets/widget-registry.ts";
import type { TabView } from "./shell-tab-strip.ts";
import {
  NEW_TAB_URL,
  isNewTabUrl,
  normalizeUrl,
  widgetIdFromUrl,
  widgetUrl,
} from "./shell-url.ts";
import {
  canGoBack,
  canGoForward,
  closeTab,
  createTab,
  currentUrl,
  findTab,
  goBack,
  goForward,
  navigate,
  paneKey,
  reload,
  replaceTab,
  type ShellTab,
} from "./tab-model.ts";

@customElement("browser-shell")
export class BrowserShell extends LitElement {
  @state()
  private tabs: ShellTab[] = [];

  @state()
  private activeTabId = "";

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100vh;
      height: 100svh;
      box-sizing: border-box;
      ${unsafeCSS(generateThemeCSSVariables())}
      ${unsafeCSS(generateLayoutCSSVariables())}
      background: var(--color-secondary);
      color: var(--color-text-primary);
      font-family: ${unsafeCSS(LAYOUT_CONFIG.fontFamily)};
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .shell {
      display: flex;
      flex-direction: column;

      width: 100%;
      height: 100%;
      min-height: 0;
    }

    .tab-bar {
      flex: 0 0 auto;

      background: var(--color-secondary);
    }

    .toolbar-bar {
      flex: 0 0 auto;

      border-bottom: 1px solid var(--color-border);

      background: var(--color-background);
    }

    .viewport {
      position: relative;

      flex: 1 1 auto;
      min-height: 0;

      overflow: auto;

      background: var(--color-background);
    }

    .pane {
      width: 100%;
      min-height: 100%;
    }

    .pane[hidden] {
      display: none;
    }
  `;

  connectedCallback() {
    super.connectedCallback();

    if (this.tabs.length === 0) {
      const first = createTab(this.nextTabId(), this.homeUrl());

      this.tabs = [first];
      this.activeTabId = first.id;
    }
  }

  /** Opens on the first registered widget, or the launcher when there is none. */
  private homeUrl(): string {
    const [first] = listWidgets();

    return first ? widgetUrl(first.id) : NEW_TAB_URL;
  }

  private nextTabId(): string {
    return crypto.randomUUID();
  }

  private get activeTab(): ShellTab | undefined {
    return findTab(this.tabs, this.activeTabId);
  }

  private widgetForUrl(url: string): WidgetDefinition | undefined {
    const widgetId = widgetIdFromUrl(url);

    return widgetId ? getWidget(widgetId) : undefined;
  }

  private titleForUrl(url: string): string {
    if (isNewTabUrl(url)) {
      return "New tab";
    }

    return this.widgetForUrl(url)?.title ?? "Address not found";
  }

  private iconForUrl(url: string): TemplateResult | null {
    return this.widgetForUrl(url)?.icon ?? null;
  }

  private updateActiveTab(change: (tab: ShellTab) => ShellTab) {
    const tab = this.activeTab;

    if (!tab) {
      return;
    }

    this.tabs = replaceTab(this.tabs, change(tab));
  }

  private handleTabSelect(event: CustomEvent<string>) {
    event.stopPropagation();

    this.activeTabId = event.detail;
  }

  private handleTabClose(event: CustomEvent<string>) {
    event.stopPropagation();

    const result = closeTab(this.tabs, event.detail, this.activeTabId);

    if (result.activeId === null) {
      const replacement = createTab(this.nextTabId(), NEW_TAB_URL);

      this.tabs = [replacement];
      this.activeTabId = replacement.id;

      return;
    }

    this.tabs = result.tabs;
    this.activeTabId = result.activeId;
  }

  private handleTabNew(event: Event) {
    event.stopPropagation();

    this.openTab(NEW_TAB_URL);
  }

  private openTab(url: string) {
    const tab = createTab(this.nextTabId(), url);

    this.tabs = [...this.tabs, tab];
    this.activeTabId = tab.id;
  }

  private handleNavigate(event: CustomEvent<string>) {
    event.stopPropagation();

    const url = normalizeUrl(event.detail);

    this.updateActiveTab((tab) => navigate(tab, url));
  }

  private handleBack(event: Event) {
    event.stopPropagation();

    this.updateActiveTab(goBack);
  }

  private handleForward(event: Event) {
    event.stopPropagation();

    this.updateActiveTab(goForward);
  }

  private handleReload(event: Event) {
    event.stopPropagation();

    this.updateActiveTab(reload);
  }

  private handleOpenWidget(tabId: string, event: CustomEvent<string>) {
    event.stopPropagation();

    const tab = findTab(this.tabs, tabId);

    if (!tab) {
      return;
    }

    this.tabs = replaceTab(this.tabs, navigate(tab, widgetUrl(event.detail)));
  }

  private notFoundMessage(url: string): string {
    return "No widget is registered at " + url + ". Try one of these instead.";
  }

  private get tabViews(): TabView[] {
    return this.tabs.map((tab) => {
      const url = currentUrl(tab);

      return {
        id: tab.id,
        title: this.titleForUrl(url),
        icon: this.iconForUrl(url),
        active: tab.id === this.activeTabId,
      };
    });
  }

  private renderPaneContent(tab: ShellTab): TemplateResult {
    const url = currentUrl(tab);

    const onOpenWidget = (event: Event) =>
      this.handleOpenWidget(tab.id, event as CustomEvent<string>);

    if (isNewTabUrl(url)) {
      return html`
        <shell-new-tab
          .widgets=${listWidgets()}
          @open-widget=${onOpenWidget}
        ></shell-new-tab>
      `;
    }

    const widget = this.widgetForUrl(url);

    if (!widget) {
      return html`
        <shell-new-tab
          heading="Address not found"
          message=${this.notFoundMessage(url)}
          .widgets=${listWidgets()}
          @open-widget=${onOpenWidget}
        ></shell-new-tab>
      `;
    }

    return widget.render();
  }

  private renderPane(tab: ShellTab): TemplateResult {
    return html`
      <div
        class="pane"
        role="tabpanel"
        aria-label=${this.titleForUrl(currentUrl(tab))}
        ?hidden=${tab.id !== this.activeTabId}
      >
        ${this.renderPaneContent(tab)}
      </div>
    `;
  }

  private get toolbarTemplate(): TemplateResult {
    const tab = this.activeTab;
    const url = tab ? currentUrl(tab) : "";

    return html`
      <shell-toolbar
        .url=${url}
        .canGoBack=${tab ? canGoBack(tab) : false}
        .canGoForward=${tab ? canGoForward(tab) : false}
        .resolved=${isNewTabUrl(url) || this.widgetForUrl(url) !== undefined}
        @navigate=${this.handleNavigate}
        @navigate-back=${this.handleBack}
        @navigate-forward=${this.handleForward}
        @reload=${this.handleReload}
      ></shell-toolbar>
    `;
  }

  private get template(): TemplateResult {
    return html`
      <div class="shell">
        <div class="tab-bar">
          <shell-tab-strip
            .tabs=${this.tabViews}
            @tab-select=${this.handleTabSelect}
            @tab-close=${this.handleTabClose}
            @tab-new=${this.handleTabNew}
          ></shell-tab-strip>
        </div>

        <div class="toolbar-bar">${this.toolbarTemplate}</div>

        <div class="viewport">
          ${repeat(
            this.tabs,
            (tab) => paneKey(tab),
            (tab) => this.renderPane(tab),
          )}
        </div>
      </div>
    `;
  }

  render() {
    return this.template;
  }
}
