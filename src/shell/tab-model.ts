import { NEW_TAB_URL } from "./shell-url.ts";

export interface ShellTab {
  id: string;
  history: string[];
  historyIndex: number;
  generation: number;
}

export function createTab(id: string, url: string = NEW_TAB_URL): ShellTab {
  return { id, history: [url], historyIndex: 0, generation: 0 };
}

export function currentUrl(tab: ShellTab): string {
  return tab.history[tab.historyIndex] ?? NEW_TAB_URL;
}

export function canGoBack(tab: ShellTab): boolean {
  return tab.historyIndex > 0;
}

export function canGoForward(tab: ShellTab): boolean {
  return tab.historyIndex < tab.history.length - 1;
}

export function goBack(tab: ShellTab): ShellTab {
  return canGoBack(tab) ? { ...tab, historyIndex: tab.historyIndex - 1 } : tab;
}

export function goForward(tab: ShellTab): ShellTab {
  return canGoForward(tab)
    ? { ...tab, historyIndex: tab.historyIndex + 1 }
    : tab;
}

export function navigate(tab: ShellTab, url: string): ShellTab {
  if (currentUrl(tab) === url) {
    return tab;
  }

  const history = [...tab.history.slice(0, tab.historyIndex + 1), url];

  return { ...tab, history, historyIndex: history.length - 1 };
}

export function reload(tab: ShellTab): ShellTab {
  return { ...tab, generation: tab.generation + 1 };
}

export function paneKey(tab: ShellTab): string {
  return `${tab.id}::${currentUrl(tab)}::${tab.generation}`;
}

export function replaceTab(tabs: ShellTab[], updated: ShellTab): ShellTab[] {
  return tabs.map((tab) => (tab.id === updated.id ? updated : tab));
}

export function findTab(tabs: ShellTab[], tabId: string): ShellTab | undefined {
  return tabs.find((tab) => tab.id === tabId);
}

export interface CloseTabResult {
  tabs: ShellTab[];
  activeId: string | null;
}

export function closeTab(
  tabs: ShellTab[],
  tabId: string,
  activeId: string,
): CloseTabResult {
  const index = tabs.findIndex((tab) => tab.id === tabId);

  if (index === -1) {
    return { tabs, activeId };
  }

  const remaining = tabs.filter((tab) => tab.id !== tabId);

  if (remaining.length === 0) {
    return { tabs: remaining, activeId: null };
  }

  if (tabId !== activeId) {
    return { tabs: remaining, activeId };
  }

  const next = remaining[Math.min(index, remaining.length - 1)];

  return { tabs: remaining, activeId: next?.id ?? null };
}
