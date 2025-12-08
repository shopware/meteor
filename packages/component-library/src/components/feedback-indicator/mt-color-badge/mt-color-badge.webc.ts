const styles = `
.mt-color-badge {
  display: inline-block;
  height: var(--scale-size-8);
  width: var(--scale-size-8);
  margin: 0 0 1px var(--scale-size-10);
  border-radius: 2px;
  background-color: #d1d9e0;
}

.mt-color-badge.is--rounded {
  border-radius: 100%;
}

.mt-color-badge.is--warning {
  background-color: #ff9800;
}

.mt-color-badge.is--critical,
.mt-color-badge.is--danger {
  background-color: #de294c;
}

.mt-color-badge.is--positive {
  background-color: #37d046;
}

.mt-color-badge.is--info {
  background-color: #189eff;
}

.mt-color-badge.has--text {
  height: auto;
  width: auto;
  padding: var(--scale-size-4) var(--scale-size-8);
  border-radius: 8px;
}

.mt-color-badge.has--text.is--warning {
  background-color: #fff3e0;
  color: #e65100;
}

.mt-color-badge.has--text.is--critical,
.mt-color-badge.has--text.is--danger {
  background-color: #fbe5ea;
  color: #c80f24;
}

.mt-color-badge.has--text.is--positive {
  background-color: #e7f9e9;
  color: #16b320;
}

.mt-color-badge.has--text.is--info {
  background-color: #e3f3ff;
  color: #0870ff;
}
`;

class MtColorBadge extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "color", "rounded", "has-text"];
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
    const variant = this.getAttribute("variant") || "default";
    const validVariants = ["default", "warning", "critical", "positive", "info"];
    return validVariants.includes(variant) ? variant : "default";
  }

  private getColor(): string {
    return this.getAttribute("color") || "";
  }

  private isRounded(): boolean {
    return this.hasAttribute("rounded");
  }

  private hasText(): boolean {
    return this.hasAttribute("has-text");
  }

  private getColorStyle(): string {
    const color = this.getColor();
    return color ? `background: ${color};` : "";
  }

  private getClasses(): string {
    const variant = this.getVariant();
    const classes = [`is--${variant}`];

    if (this.isRounded()) {
      classes.push("is--rounded");
    }

    if (this.hasText()) {
      classes.push("has--text");
    }

    return classes.join(" ");
  }

  private render() {
    const classes = this.getClasses();
    const colorStyle = this.getColorStyle();

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <span class="mt-color-badge ${classes}" style="${colorStyle}">
        <slot></slot>
      </span>
    `;
  }
}

if (!customElements.get("mt-color-badge")) {
  customElements.define("mt-color-badge", MtColorBadge);
}

export default MtColorBadge;
