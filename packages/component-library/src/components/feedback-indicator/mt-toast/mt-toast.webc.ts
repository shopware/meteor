// Note: This is a simplified vanilla JS web component version
// The full implementation would require the toast notification component.
// This provides a basic structure that can be enhanced.

export interface Toast {
  id: number | string;
  msg: string;
  type: "informal" | "critical" | "positive";
  icon?: string;
  action?: {
    label: string;
    callback: () => void;
  };
  dismissible?: boolean;
}

const styles = `
.mt-toast {
  display: flex;
  position: fixed;
  justify-content: center;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
}

.mt-toast--bottom-left {
  flex: 1;
}

.mt-toast--bottom-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.mt-toast--bottom-center .mt-toast-notification {
  display: flex;
  z-index: 1600;
  position: absolute;
  height: 51px;
  color: white;
  text-align: center;
  box-shadow:
    0px 1px 3px 0px rgba(0, 0, 0, 0.1),
    0px 2px 1px 0px rgba(0, 0, 0, 0.06),
    0px 1px 1px 0px rgba(0, 0, 0, 0.08);
}

.mt-toast--bottom-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  padding-right: var(--scale-size-16);
}

.mt-toast--bottom-right .mt-toast-notification {
  display: flex;
  transition: all 0.7s ease;
  z-index: 1600;
  position: absolute;
  height: 51px;
  color: white;
  width: 376px;
  text-align: center;
  transform: translateY(0);
}

.mt-toast--expanded .mt-toast--bottom-right .mt-toast-notification:nth-child(n + 2) {
  transform: translateY(calc(var(--num) * -68px));
}

.mt-toast--collapsed .mt-toast--bottom-right .mt-toast-notification:nth-child(1) {
  z-index: 1599;
}

.mt-toast--collapsed .mt-toast--bottom-right .mt-toast-notification:nth-child(2) {
  transform: translateY(-33px) scale(0.95, 0.18);
}

.mt-toast--collapsed .mt-toast--bottom-right .mt-toast-notification:nth-child(3) {
  transform: translateY(-45px) scale(0.9, 0.18);
}

.mt-toast--collapsed .mt-toast--bottom-right .mt-toast-notification:nth-child(n + 4) {
  transform: translateY(-58px) scale(0.8, 0.1);
  opacity: 0;
}
`;

class MtToast extends HTMLElement {
  static get observedAttributes() {
    return ["toasts"];
  }

  private toasts: Toast[] = [];
  private isHovered: boolean = false;
  private hoverTimeoutId: number | undefined;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.parseToasts();
    this.render();
    this.attachEventListeners();
  }

  disconnectedCallback() {
    this.detachEventListeners();
  }

  attributeChangedCallback() {
    this.parseToasts();
    this.render();
  }

  private parseToasts() {
    const toastsAttr = this.getAttribute("toasts");
    if (toastsAttr) {
      try {
        this.toasts = JSON.parse(toastsAttr);
      } catch {
        this.toasts = [];
      }
    }
  }

  public setToasts(toasts: Toast[]) {
    this.toasts = toasts;
    this.setAttribute("toasts", JSON.stringify(toasts));
    this.render();
  }

  public addToast(toast: Toast) {
    this.toasts = [toast, ...this.toasts];
    this.setAttribute("toasts", JSON.stringify(this.toasts));
    this.render();
  }

  public removeToast(id: number | string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.setAttribute("toasts", JSON.stringify(this.toasts));
    this.dispatchEvent(
      new CustomEvent("remove-toast", {
        detail: id,
        bubbles: true,
        composed: true,
      }),
    );
    this.render();
  }

  private getQuickToast(): Toast | undefined {
    return this.toasts.find((t) => !t.action && t.type !== "critical" && !t.dismissible);
  }

  private getRightToasts(): Toast[] {
    return this.toasts.filter((t) => t.action || t.type === "critical" || t.dismissible);
  }

  private handleMouseEnter = () => {
    if (this.hoverTimeoutId) {
      window.clearTimeout(this.hoverTimeoutId);
    }
    this.isHovered = true;
    this.render();
  };

  private handleMouseLeave = () => {
    this.hoverTimeoutId = window.setTimeout(() => {
      this.isHovered = false;
      this.render();
    }, 500);
  };

  private attachEventListeners() {
    this.shadowRoot.addEventListener("mouseenter", this.handleMouseEnter);
    this.shadowRoot.addEventListener("mouseleave", this.handleMouseLeave);
  }

  private detachEventListeners() {
    this.shadowRoot.removeEventListener("mouseenter", this.handleMouseEnter);
    this.shadowRoot.removeEventListener("mouseleave", this.handleMouseLeave);
    if (this.hoverTimeoutId) {
      window.clearTimeout(this.hoverTimeoutId);
    }
  }

  private render() {
    const quickToast = this.getQuickToast();
    const rightToasts = this.getRightToasts();
    const classes = this.isHovered ? "mt-toast--expanded" : "mt-toast--collapsed";

    let quickToastHtml = "";
    if (quickToast) {
      quickToastHtml = `
        <div class="mt-toast-notification">
          ${quickToast.msg}
        </div>
      `;
    }

    const rightToastsHtml = rightToasts
      .map(
        (toast, index) => `
        <div class="mt-toast-notification" style="--num: ${index};">
          ${toast.msg}
          ${toast.action ? `<button>${toast.action.label}</button>` : ""}
        </div>
      `,
      )
      .join("");

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="mt-toast ${classes}">
        <div class="mt-toast--bottom-left"></div>
        <div class="mt-toast--bottom-center">
          ${quickToastHtml}
        </div>
        <div class="mt-toast--bottom-right">
          ${rightToastsHtml}
        </div>
      </div>
    `;
  }
}

if (!customElements.get("mt-toast")) {
  customElements.define("mt-toast", MtToast);
}

export default MtToast;
