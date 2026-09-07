export type ToastVariant = "success" | "error" | "info";

export type ToastPlacement =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToastHost extends HTMLElement {
  show?: (message: string, variant?: ToastVariant) => void;
}
