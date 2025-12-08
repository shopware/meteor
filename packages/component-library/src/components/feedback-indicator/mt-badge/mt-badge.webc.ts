const styles = `
.mt-badge {
  display: inline-flex;
  align-items: center;
  border-radius: var(--border-radius-round);
  flex-shrink: 0;
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary-default);
}

.mt-badge--size-s {
  height: var(--scale-size-20);
  padding: 0 var(--scale-size-8);
  gap: var(--scale-size-4);
  font-size: var(--font-size-2xs);
  line-height: var(--font-line-height-2xs);
}

.mt-badge--size-s .mt-badge__indicator {
  width: var(--scale-size-8);
  height: var(--scale-size-8);
}

.mt-badge--size-m {
  height: var(--scale-size-24);
  padding: 0 var(--scale-size-10);
  gap: var(--scale-size-4);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
}

.mt-badge--size-m .mt-badge__indicator {
  width: var(--scale-size-8);
  height: var(--scale-size-8);
}

.mt-badge--size-l {
  height: var(--scale-size-28);
  padding: 0 var(--scale-size-12);
  gap: var(--scale-size-6);
  font-size: var(--font-size-s);
  line-height: var(--font-line-height-s);
}

.mt-badge--size-l .mt-badge__indicator {
  width: var(--scale-size-10);
  height: var(--scale-size-10);
}

.mt-badge--variant-neutral {
  background-color: var(--color-background-secondary-default);
  border: 1px solid var(--color-border-primary-default);
}

.mt-badge--variant-neutral .mt-badge__indicator {
  background-color: var(--color-icon-primary-disabled);
}

.mt-badge--variant-info {
  background-color: var(--color-background-brand-default);
  border: 1px solid var(--color-border-brand-default);
}

.mt-badge--variant-info .mt-badge__indicator {
  background-color: var(--color-icon-brand-default);
}

.mt-badge--variant-attention {
  background-color: var(--color-background-attention-default);
  border: 1px solid var(--color-border-attention-default);
}

.mt-badge--variant-attention .mt-badge__indicator {
  background-color: var(--color-icon-attention-default);
}

.mt-badge--variant-critical {
  background-color: var(--color-background-critical-default);
  border: 1px solid var(--color-border-critical-default);
}

.mt-badge--variant-critical .mt-badge__indicator {
  background-color: var(--color-icon-critical-default);
}

.mt-badge--variant-positive {
  background-color: var(--color-background-positive-default);
  border: 1px solid var(--color-border-positive-default);
}

.mt-badge--variant-positive .mt-badge__indicator {
  background-color: var(--color-icon-positive-default);
}

.mt-badge__indicator {
  width: var(--scale-size-8);
  height: var(--scale-size-8);
  border-radius: var(--border-radius-l);
}
`;

class MtBadge extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "size", "status-indicator", "icon"];
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
    return this.getAttribute("variant") || "neutral";
  }

  private getSize(): string {
    const size = this.getAttribute("size")?.toLowerCase() || "s";
    return ["s", "m", "l"].includes(size) ? size : "s";
  }

  private getStatusIndicator(): boolean {
    return this.hasAttribute("status-indicator");
  }

  private getIcon(): string | null {
    return this.getAttribute("icon");
  }

  private getIconSize(): string {
    return this.getSize() === "l" ? "12" : "10";
  }

  private render() {
    const variant = this.getVariant();
    const size = this.getSize();
    const statusIndicator = this.getStatusIndicator();
    const icon = this.getIcon();
    const iconSize = this.getIconSize();

    const badgeClasses = [`mt-badge--variant-${variant}`, `mt-badge--size-${size}`].join(" ");

    let iconHtml = "";
    if (icon) {
      // Note: This assumes mt-icon web component exists or you'll need to handle icons differently
      iconHtml = `<mt-icon name="${icon}" size="${iconSize}"></mt-icon>`;
    }

    let indicatorHtml = "";
    if (statusIndicator) {
      indicatorHtml =
        '<span class="mt-badge__indicator" aria-hidden="true" data-testid="mt-badge__indicator"></span>';
    }

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <span class="mt-badge ${badgeClasses}">
        ${indicatorHtml}
        ${iconHtml}
        <slot></slot>
      </span>
    `;
  }
}

if (!customElements.get("mt-badge")) {
  customElements.define("mt-badge", MtBadge);
}

export default MtBadge;
