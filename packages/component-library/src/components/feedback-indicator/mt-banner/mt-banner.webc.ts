// Import needed to register the mt-icon custom element
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import MtIcon from "../../icons-media/mt-icon/mt-icon.webc";

const styles = `
.mt-banner {
  --mt-banner-close-button-size: var(--scale-size-40);

  border-width: 1px;
  padding: var(--scale-size-24);
  border-style: solid;
  border-radius: var(--border-radius-xs);
  margin: 0 auto var(--scale-size-20);
  display: flex;
  flex-direction: row;
  gap: var(--scale-size-16);
}

.mt-banner ul {
  padding: var(--scale-size-8) 0 var(--scale-size-8) var(--scale-size-20);
}

.mt-banner__title {
  margin-block-start: 0;
  margin-block-end: 0;
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-weight: var(--font-weight-bold);
}

.mt-banner__body {
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  gap: var(--scale-size-4);
}

.mt-banner__message {
  color: var(--color-text-primary-default);
}

.mt-banner__icon {
  width: var(--scale-size-20);
  height: var(--scale-size-20);
}

.mt-banner__close {
  width: var(--mt-banner-close-button-size);
  height: var(--mt-banner-close-button-size);
  border-radius: var(--border-radius-xs);
  margin-top: calc(var(--scale-size-8) * -1);
  margin-right: calc(var(--scale-size-8) * -1);
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mt-banner__close:focus-visible {
  outline: 2px solid var(--color-border-brand-default);
}

.mt-banner--info {
  border-color: var(--color-border-brand-default);
  background-color: var(--color-background-brand-default);
}

.mt-banner--info .mt-banner__icon,
.mt-banner--info .mt-banner__close {
  color: var(--color-icon-brand-default);
}

.mt-banner--attention {
  border-color: var(--color-border-attention-default);
  background-color: var(--color-background-attention-default);
}

.mt-banner--attention .mt-banner__icon,
.mt-banner--attention .mt-banner__close {
  color: var(--color-icon-attention-default);
}

.mt-banner--critical {
  border-color: var(--color-border-critical-default);
  background-color: var(--color-background-critical-default);
}

.mt-banner--critical .mt-banner__icon,
.mt-banner--critical .mt-banner__close {
  color: var(--color-icon-critical-default);
}

.mt-banner--positive {
  border-color: var(--color-border-positive-default);
  background-color: var(--color-background-positive-default);
}

.mt-banner--positive .mt-banner__icon,
.mt-banner--positive .mt-banner__close {
  color: var(--color-icon-positive-default);
}

.mt-banner--inherited {
  border-color: var(--color-border-accent-default);
  background-color: var(--color-background-accent-default);
}

.mt-banner--inherited .mt-banner__icon,
.mt-banner--inherited .mt-banner__close {
  color: var(--color-icon-accent-default);
}

.mt-banner--neutral {
  border-color: var(--color-border-primary-default);
  background-color: var(--color-background-secondary-default);
}

.mt-banner--neutral .mt-banner__icon,
.mt-banner--neutral .mt-banner__close {
  color: var(--color-icon-primary-default);
}
`;

class MtBanner extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "title", "hide-icon", "closable", "banner-index", "icon"];
  }

  private closeButton: HTMLButtonElement | null = null;

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

  attributeChangedCallback() {
    this.render();
    this.attachEventListeners();
  }

  private getVariant(): string {
    return this.getAttribute("variant") || "neutral";
  }

  private getTitle(): string {
    return this.getAttribute("title") || "";
  }

  private getHideIcon(): boolean {
    return this.hasAttribute("hide-icon");
  }

  private getClosable(): boolean {
    return this.hasAttribute("closable");
  }

  private getBannerIndex(): string | null {
    return this.getAttribute("banner-index");
  }

  private getIcon(): string | null {
    return this.getAttribute("icon");
  }

  private getBannerIcon(): string {
    const icon = this.getIcon();
    if (icon) return icon;

    const variant = this.getVariant();
    const iconConfig: Record<string, string> = {
      neutral: "solid-info-circle",
      info: "solid-info-circle",
      attention: "solid-exclamation-triangle",
      critical: "solid-exclamation-circle",
      positive: "solid-check-circle",
      inherited: "solid-link",
    };

    return iconConfig[variant] || "solid-info-circle";
  }

  private getCloseLabel(): string {
    // Simple i18n - could be enhanced
    const lang = document.documentElement.lang || "en";
    return lang === "de" ? "Schließen" : "Close";
  }

  private handleClose = () => {
    const bannerIndex = this.getBannerIndex();
    this.dispatchEvent(
      new CustomEvent("close", {
        detail: bannerIndex,
        bubbles: true,
        composed: true,
      }),
    );
  };

  private attachEventListeners() {
    if (this.closeButton) {
      this.closeButton.removeEventListener("click", this.handleClose);
    }
    this.closeButton = this.shadowRoot.querySelector(".mt-banner__close");
    if (this.closeButton) {
      this.closeButton.addEventListener("click", this.handleClose);
    }
  }

  private detachEventListeners() {
    if (this.closeButton) {
      this.closeButton.removeEventListener("click", this.handleClose);
    }
  }

  private render() {
    const variant = this.getVariant();
    const title = this.getTitle();
    const hideIcon = this.getHideIcon();
    const closable = this.getClosable();
    const bannerIcon = this.getBannerIcon();

    const classes = [
      "mt-banner",
      `mt-banner--${variant}`,
      hideIcon ? "" : "mt-banner--icon",
      closable ? "mt-banner--closable" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const bodyClasses = [
      "mt-banner__body",
      hideIcon ? "" : "mt-banner__body--icon",
      closable ? "mt-banner__body--closable" : "",
    ]
      .filter(Boolean)
      .join(" ");

    let iconHtml = "";
    if (!hideIcon) {
      // Note: This assumes mt-icon web component exists
      iconHtml = `<mt-icon size="var(--scale-size-20)" class="mt-banner__icon" name="${bannerIcon}" decorative></mt-icon>`;
    }

    let titleHtml = "";
    if (title) {
      titleHtml = `<h3 class="mt-banner__title">${title}</h3>`;
    }

    let closeButtonHtml = "";
    if (closable) {
      const closeLabel = this.getCloseLabel();
      closeButtonHtml = `
        <button class="mt-banner__close" aria-label="${closeLabel}">
          <mt-icon name="solid-times-s"></mt-icon>
        </button>
      `;
    }

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="${classes}" role="banner">
        ${iconHtml}
        <div class="${bodyClasses}">
          ${titleHtml}
          <div class="mt-banner__message">
            <slot></slot>
          </div>
        </div>
        ${closeButtonHtml}
      </div>
    `;
  }
}

if (!customElements.get("mt-banner")) {
  customElements.define("mt-banner", MtBanner);
}

export default MtBanner;
