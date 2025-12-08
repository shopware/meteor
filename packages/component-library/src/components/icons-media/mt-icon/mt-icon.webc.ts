const styles = `
.mt-icon {
  display: inline-block;
  vertical-align: middle;
  line-height: 0;
}

.mt-icon--custom-size > svg {
  width: 100% !important;
  height: 100% !important;
}

.mt-icon > svg {
  fill: currentColor;
  vertical-align: middle;
  width: 100%;
  height: 100%;
}

.mt-icon > svg path,
.mt-icon > svg use {
  fill: currentColor;
}
`;

interface IconInformation {
  mode: "solid" | "regular";
  name: string;
}

class MtIcon extends HTMLElement {
  static get observedAttributes() {
    return ["name", "color", "decorative", "size", "mode"];
  }

  private iconSvgData: string = "";
  private iconInfo: IconInformation | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.loadIcon();
  }

  attributeChangedCallback(name: string) {
    if (name === "name" || name === "mode") {
      this.loadIcon();
    } else {
      this.render();
    }
  }

  private getName(): string {
    return this.getAttribute("name") || "";
  }

  private getColor(): string | null {
    return this.getAttribute("color");
  }

  private getDecorative(): boolean {
    return this.hasAttribute("decorative");
  }

  private getSize(): string | null {
    return this.getAttribute("size");
  }

  private getMode(): "solid" | "regular" {
    const mode = this.getAttribute("mode");
    return mode === "solid" ? "solid" : "regular";
  }

  private parseIconInformation(): IconInformation {
    const name = this.getName();
    const mode = this.getMode();

    const isModeInNameIncluded = name.startsWith("solid-") || name.startsWith("regular-");

    if (isModeInNameIncluded) {
      const parts = name.split("-");
      return {
        mode: parts[0] as "solid" | "regular",
        name: parts.slice(1).join("-"),
      };
    }

    return {
      mode,
      name,
    };
  }

  private getIconPath(): string {
    if (!this.iconInfo) return "";
    return `/node_modules/@shopware-ag/meteor-icon-kit/icons/${this.iconInfo.mode}/${this.iconInfo.name}.svg`;
  }

  private async loadIcon(): Promise<void> {
    this.iconInfo = this.parseIconInformation();

    if (!this.iconInfo || !this.iconInfo.name) {
      this.iconSvgData = "";
      this.render();
      return;
    }

    const iconPath = this.getIconPath();

    try {
      // Try to fetch the SVG file
      const response = await fetch(iconPath);
      if (response.ok) {
        this.iconSvgData = await response.text();
      } else {
        this.handleFailedImport(`Failed to fetch icon: ${iconPath}`);
      }
    } catch (error) {
      this.handleFailedImport(`Error loading icon: ${error}`);
    }

    this.render();
  }

  private handleFailedImport(detail: string = ""): void {
    const iconName = this.iconInfo ? `${this.iconInfo.mode}-${this.iconInfo.name}` : "unknown";
    console.error(`The SVG file for the icon "${iconName}" could not be found and loaded.`);

    if (detail) {
      console.error(detail);
    }

    this.iconSvgData = `<svg id="meteor-icon-kit__${this.getName()}"></svg>`;
  }

  private getStyles(): string {
    const styles: Record<string, string> = {};

    const color = this.getColor();
    if (color) {
      styles.color = color;
    }

    const size = this.getSize();
    if (size) {
      let sizeValue = size;
      // Check if it's a number without unit
      if (!Number.isNaN(parseFloat(size)) && !Number.isNaN(Number(size) - 0)) {
        sizeValue = `${size}px`;
      }
      styles.width = sizeValue;
      styles.height = sizeValue;
    }

    // Check for inline styles
    const inlineStyle = this.getAttribute("style");
    if (inlineStyle) {
      inlineStyle.split(";").forEach((declaration) => {
        const [property, value] = declaration.split(":").map((s) => s.trim());
        if (property && value) {
          styles[property] = value;
        }
      });
    }

    return Object.entries(styles)
      .map(([key, value]) => `${key}: ${value}`)
      .join("; ");
  }

  private getClasses(): string {
    const classes = ["mt-icon", `icon--${this.getName()}`];

    const size = this.getSize();
    const inlineStyle = this.getAttribute("style");
    const hasCustomSize =
      !!size || (inlineStyle && (inlineStyle.includes("width") || inlineStyle.includes("height")));

    if (hasCustomSize) {
      classes.push("mt-icon--custom-size");
    }

    return classes.join(" ");
  }

  private render(): void {
    const decorative = this.getDecorative();
    const iconInfo = this.iconInfo || this.parseIconInformation();
    const testId = `mt-icon__${iconInfo.mode}-${iconInfo.name}`;
    const styleString = this.getStyles();
    const classes = this.getClasses();

    this.shadowRoot!.innerHTML = `
      <style>${styles}</style>
      <span
        class="${classes}"
        style="${styleString}"
        aria-hidden="${decorative}"
        data-testid="${testId}"
      >
        ${this.iconSvgData || `<svg id="meteor-icon-kit__${this.getName()}"></svg>`}
      </span>
    `;
  }
}

if (!customElements.get("mt-icon")) {
  customElements.define("mt-icon", MtIcon);
}

export default MtIcon;
