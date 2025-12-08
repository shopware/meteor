const styles = `
.mt-snackbar {
  width: 360px;
  position: fixed;
  bottom: var(--scale-size-16);
  right: var(--scale-size-16);
  z-index: 1600;
  pointer-events: none;
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

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

.mt-snackbar-notification--success {
  border-color: var(--color-border-positive-default);
}

.mt-snackbar-notification--error {
  border-color: var(--color-border-critical-default);
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

interface SnackbarData {
  id: string;
  message: string;
  variant?: "success" | "error" | "warning" | "progress";
}

class MtSnackbar extends HTMLElement {
  private snackbars: SnackbarData[] = [];
  private isHovered: boolean = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  disconnectedCallback() {
    this.detachEventListeners();
  }

  private attachEventListeners() {
    this.shadowRoot.addEventListener("mouseenter", () => {
      this.isHovered = true;
    });
    this.shadowRoot.addEventListener("mouseleave", () => {
      this.isHovered = false;
    });
  }

  private detachEventListeners() {
    // Cleanup if needed
  }

  // Public API to add snackbars
  public addSnackbar(
    message: string,
    variant?: "success" | "error" | "warning" | "progress",
  ): string {
    const id = `snackbar-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.snackbars.push({ id, message, variant });
    this.render();

    // Auto-remove after 5 seconds (unless it's progress)
    if (variant !== "progress") {
      setTimeout(() => {
        this.removeSnackbar(id);
      }, 5000);
    }

    return id;
  }

  public removeSnackbar(id: string) {
    this.snackbars = this.snackbars.filter((s) => s.id !== id);
    this.render();
  }

  public clearSnackbars() {
    this.snackbars = [];
    this.render();
  }

  private render() {
    const snackbarsHtml = this.snackbars
      .map((snackbar, index) => {
        const offset = index * 68;
        const variantClass = snackbar.variant
          ? `mt-snackbar-notification--${snackbar.variant}`
          : "";
        return `
          <div class="mt-snackbar-notification ${variantClass}" data-mounted="true" style="--offset: ${offset}px;">
            ${snackbar.message}
          </div>
        `;
      })
      .join("");

    this.shadowRoot!.innerHTML = `
      <style>${styles}</style>
      <div class="mt-snackbar">
        ${snackbarsHtml}
      </div>
    `;
  }
}

if (!customElements.get("mt-snackbar")) {
  customElements.define("mt-snackbar", MtSnackbar);
}

export default MtSnackbar;
