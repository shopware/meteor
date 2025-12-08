import MtBadge from "../mt-badge/mt-badge.webc";
import MtIcon from "../../icons-media/mt-icon/mt-icon.webc";

const styles = `
.mt-promo-badge {
  --mt-promo-badge-icon-color: var(--color-icon-primary-default);
}
`;

// Simple i18n helper
const translations: Record<string, Record<string, string>> = {
  en: {
    new: "New",
    beta: "Beta",
    shopwareAi: "Shopware AI",
  },
  de: {
    new: "Neu",
    beta: "Beta",
    shopwareAi: "Shopware AI",
  },
};

class MtPromoBadge extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "size"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private getVariant(): string {
    const variant = this.getAttribute("variant") || "new";
    const validVariants = ["new", "beta", "shopware-ai"];
    return validVariants.includes(variant) ? variant : "new";
  }

  private getSize(): string {
    const size = this.getAttribute("size")?.toLowerCase() || "s";
    return ["s", "m", "l"].includes(size) ? size : "s";
  }

  private getBadgeVariant(): string {
    const variant = this.getVariant();
    if (variant === "shopware-ai") return "neutral";
    if (variant === "beta") return "info";
    return "positive";
  }

  private getPromoText(): string {
    const variant = this.getVariant();
    const lang = document.documentElement.lang || "en";
    const langTranslations = translations[lang] || translations.en;

    if (variant === "shopware-ai") {
      return langTranslations.shopwareAi;
    }
    if (variant === "new") {
      return langTranslations.new;
    }
    return langTranslations.beta;
  }

  private getBadgeIcon(): string {
    const variant = this.getVariant();
    if (variant === "beta") return "solid-code";
    if (variant === "shopware-ai") return "solid-sparkles";
    return "solid-party-horn";
  }

  private getIconColor(): string {
    const variant = this.getVariant();
    return variant === "shopware-ai"
      ? "var(--color-icon-brand-default)"
      : "var(--color-icon-primary-default)";
  }

  private render() {
    const size = this.getSize();
    const badgeVariant = this.getBadgeVariant();
    const promoText = this.getPromoText();
    const badgeIcon = this.getBadgeIcon();
    const iconColor = this.getIconColor();

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <span class="mt-promo-badge" style="--mt-promo-badge-icon-color: ${iconColor};">
        <mt-badge variant="${badgeVariant}" size="${size}" icon="${badgeIcon}">
          ${promoText}
        </mt-badge>
      </span>
    `;
  }
}

if (!customElements.get("mt-promo-badge")) {
  customElements.define("mt-promo-badge", MtPromoBadge);
}

export default MtPromoBadge;
