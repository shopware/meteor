// eslint-disable-next-line @typescript-eslint/no-unused-vars
import MtIcon from "../../../icons-media/mt-icon/mt-icon.webc";

const styles = `
.mt-snackbar-notification {
  --y: translateY(100%);
  --lift: -1;
  position: absolute;
  transform: var(--y);
  bottom: var(--scale-size-0);
  right: var(--scale-size-0);
  opacity: 0;
  touch-action: none;
  pointer-events: auto;
  transition:
    transform 500ms cubic-bezier(0.16, 1, 0.3, 1),
    opacity 500ms cubic-bezier(0.16, 1, 0.3, 1),
    height 500ms cubic-bezier(0.16, 1, 0.3, 1);
  animation: slideInFromRight 0.5s cubic-bezier(0.66, 0, 0.34, 1);
  max-width: 360px;
  width: fit-content;
  padding: var(--scale-size-12);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-m);
  background: var(--color-elevation-surface-raised);
  box-shadow: 0px 8px 20px 0px var(--color-elevation-shadow-default);
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  color: var(--color-text-primary-default);
  margin-bottom: var(--scale-size-16);
}

.mt-snackbar-notification[data-mounted="true"] {
  --y: translateY(calc(var(--lift) * var(--offset)));
  opacity: 1;
}

.mt-snackbar-notification[data-removed="true"] {
  animation: slideOutToBottom 0.4s cubic-bezier(0.32, 0, 0.67, 0) forwards;
}

.mt-snackbar-notification__content {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--scale-size-12);
  align-items: center;
}

.mt-snackbar-notification__text-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.mt-snackbar-notification__symbol-container {
  flex-shrink: 0;
  margin-right: var(--scale-size-8);
}

.mt-snackbar-notification__icon {
  margin-bottom: 2px; /* Fix icon alignment */
}

.mt-snackbar-notification__message {
  word-wrap: break-word;
}

.mt-snackbar-notification--success .mt-snackbar-notification__icon {
  color: var(--color-icon-positive-default);
}

.mt-snackbar-notification--error .mt-snackbar-notification__icon {
  color: var(--color-icon-critical-default);
}

@keyframes slideInFromRight {
  0% {
    transform: translateX(100%) var(--y);
    opacity: 0;
  }
  100% {
    transform: translateX(0) var(--y);
    opacity: 1;
  }
}

@keyframes slideOutToBottom {
  0% {
    transform: translateY(0) var(--y);
    opacity: 1;
  }
  75% {
    opacity: 0;
  }
  100% {
    transform: translateY(100%) var(--y);
    opacity: 0;
  }
}
`;

interface SnackbarNotificationProps {
  id: string;
  message: string;
  variant?: "success" | "error" | "warning" | "progress";
  offset: number;
}

class MtSnackbarNotification extends HTMLElement {
  private mounted: boolean = false;
  private removed: boolean = false;
  private timeoutId?: number;

  static get observedAttributes() {
    return ["data-id", "data-message", "data-variant", "data-offset"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.mounted = true;
    this.render();
    this.startAutoRemove();
  }

  disconnectedCallback() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  attributeChangedCallback() {
    if (this.mounted && !this.removed) {
      this.render();
    }
  }

  private getProps(): SnackbarNotificationProps {
    return {
      id: this.getAttribute("data-id") || "",
      message: this.getAttribute("data-message") || "",
      variant:
        (this.getAttribute("data-variant") as SnackbarNotificationProps["variant"]) || undefined,
      offset: parseInt(this.getAttribute("data-offset") || "0", 10),
    };
  }

  private getIcon(): string | undefined {
    const props = this.getProps();
    switch (props.variant) {
      case "error":
        return "solid-exclamation-circle";
      case "success":
        return "solid-check-circle";
      default:
        return undefined;
    }
  }

  private startAutoRemove() {
    const props = this.getProps();
    if (props.variant !== "progress") {
      this.timeoutId = window.setTimeout(() => {
        this.remove();
      }, 5000);
    }
  }

  public remove() {
    if (this.removed) {
      return;
    }

    this.removed = true;
    this.setAttribute("data-removing", "true");

    const innerDiv = this.shadowRoot!.querySelector(".mt-snackbar-notification");
    if (innerDiv) {
      innerDiv.setAttribute("data-removed", "true");
    } else {
      this.render();
    }

    setTimeout(() => {
      // Only dispatch if we're still connected to the DOM
      if (this.isConnected) {
        this.dispatchEvent(
          new CustomEvent("remove-notification", {
            detail: { id: this.getProps().id },
            bubbles: true,
          }),
        );
      }
    }, 500);
  }

  private render() {
    const props = this.getProps();
    const variantClass = props.variant ? `mt-snackbar-notification--${props.variant}` : "";
    const icon = this.getIcon();

    let iconHtml = "";
    if (icon) {
      iconHtml = `
        <div class="mt-snackbar-notification__symbol-container">
          <mt-icon class="mt-snackbar-notification__icon" name="${icon}" size="16px" decorative></mt-icon>
        </div>
      `;
    }

    this.shadowRoot!.innerHTML = `
      <style>${styles}</style>
      <div
        class="mt-snackbar-notification ${variantClass}"
        data-mounted="${this.mounted}"
        data-removed="${this.removed}"
        style="--offset: ${props.offset}px;"
      >
        <div class="mt-snackbar-notification__content">
          <div class="mt-snackbar-notification__text-content">
            ${iconHtml}
            <div class="mt-snackbar-notification__message">
              ${this.escapeHtml(props.message)}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

if (!customElements.get("mt-snackbar-notification")) {
  customElements.define("mt-snackbar-notification", MtSnackbarNotification);
}

export default MtSnackbarNotification;
