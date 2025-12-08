const styles = `
.mt-loader {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 400;
  background: var(--color-background-tertiary-default);
  opacity: 0.8;
}

.mt-loader-element {
  position: relative;
  width: 100%;
  height: 100%;
}

.mt-loader-element div {
  position: absolute;
  width: 100%;
  height: 100%;
  border-style: solid;
  border-radius: 50%;
  border-color: var(--color-border-brand-default) transparent transparent transparent;
  animation: mt-loader-rotator 1.4s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.mt-loader-element div:nth-child(1) {
  animation-delay: -0.45s;
}

.mt-loader-element div:nth-child(2) {
  animation-delay: -0.3s;
}

.mt-loader-element div:nth-child(3) {
  animation-delay: -0.15s;
}

.mt-loader__container {
  display: grid;
  grid-auto-columns: auto;
  text-align: center;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes mt-loader-rotator {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
`;

class MtLoader extends HTMLElement {
  static get observedAttributes() {
    return ["size"];
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

  private getSize(): string {
    return this.getAttribute("size") || "50px";
  }

  private calculateBorderWidth(size: string): string {
    const numericSize = Number(size.replace("px", ""));

    let calculatedWidth;

    // Breakpoints for border width.
    if (numericSize <= 16) {
      calculatedWidth = numericSize / 6;
    } else if (numericSize <= 32) {
      calculatedWidth = numericSize / 8;
    } else {
      calculatedWidth = numericSize / 12;
    }

    return `${calculatedWidth}px`;
  }

  private render() {
    const size = this.getSize();
    const borderWidth = this.calculateBorderWidth(size);

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="mt-loader">
        <div class="mt-loader__container" style="width: ${size}; height: ${size};">
          <div class="mt-loader-element">
            <div style="border-width: ${borderWidth};"></div>
            <div style="border-width: ${borderWidth};"></div>
            <div style="border-width: ${borderWidth};"></div>
            <div style="border-width: ${borderWidth};"></div>
          </div>
        </div>
      </div>
    `;
  }
}

if (!customElements.get("mt-loader")) {
  customElements.define("mt-loader", MtLoader);
}

export default MtLoader;
