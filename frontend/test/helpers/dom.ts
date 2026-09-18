import type { LitElement } from "lit";

const mountedElements = new Set<HTMLElement>();

export async function mount<T extends LitElement>(
  tagName: string,
  properties: Record<string, unknown> = {},
): Promise<T> {
  const element = document.createElement(tagName) as T;

  Object.assign(element, properties);

  document.body.append(element);
  mountedElements.add(element);

  await element.updateComplete;

  return element;
}

export function cleanupFixtures() {
  for (const element of mountedElements) {
    element.remove();
  }

  mountedElements.clear();

  document.body.innerHTML = "";
}

export async function update<T extends LitElement>(
  element: T,
  properties: Record<string, unknown> = {},
): Promise<T> {
  Object.assign(element, properties);

  await element.updateComplete;

  return element;
}

function rootOf(element: Element): ParentNode {
  return element.shadowRoot ?? element;
}

export function query<E extends Element>(
  element: Element,
  selector: string,
): E | null {
  return rootOf(element).querySelector<E>(selector);
}

export function queryRequired<E extends Element>(
  element: Element,
  selector: string,
): E {
  const found = query<E>(element, selector);

  if (!found) {
    throw new Error(
      `Expected to find "${selector}" in <${element.localName}> shadow root.`,
    );
  }

  return found;
}

export function queryAll<E extends Element>(
  element: Element,
  selector: string,
): E[] {
  return Array.from(rootOf(element).querySelectorAll<E>(selector));
}

export function text(node: Node | null): string {
  return (node?.textContent ?? "").replace(/\s+/g, " ").trim();
}

export function recordEvents<T = unknown>(
  target: EventTarget,
  type: string,
): CustomEvent<T>[] {
  const events: CustomEvent<T>[] = [];

  target.addEventListener(type, (event) => {
    events.push(event as CustomEvent<T>);
  });

  return events;
}

export function click(element: Element) {
  return element.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      composed: true,
      cancelable: true,
    }),
  );
}

export function typeInto(input: HTMLInputElement, value: string) {
  input.value = value;

  input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
}
