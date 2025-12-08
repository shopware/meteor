const styles = `
.mt-progress-bar {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: repeat(auto-fit, auto);
  row-gap: var(--scale-size-8);
}

.mt-progress-bar__progress-label {
  color: var(--color-text-secondary);
  justify-self: end;
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
}

.mt-progress-bar__label {
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-weight: var(--font-weight-medium);
}

.mt-progress-bar__track {
  border-radius: var(--border-radius-round);
  height: var(--scale-size-8);
  width: 100%;
  background: var(--color-background-tertiary-default);
  grid-column: 1 / 3;
}

.mt-progress-bar__fill {
  border-radius: var(--border-radius-round);
  height: 100%;
  background: var(--color-interaction-primary-default);
}

.mt-progress-bar__fill--with-error {
  background: var(--color-interaction-critical-default);
}

.mt-progress-bar__error {
  color: var(--color-text-critical-default);
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  margin-top: 0;
}
`;

class MtProgressBar extends HTMLElement {
  static get observedAttributes() {
    return ["label", "max-value", "value", "progress-label-type", "error"];
  }

  private _value: number = 0;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "value" && oldValue !== newValue) {
      this._value = Number(newValue) || 0;
    }
    this.render();
  }

  get value(): number {
    return this._value;
  }

  set value(val: number) {
    this._value = val;
    this.setAttribute("value", String(val));
    this.render();
  }

  private getLabel(): string {
    return this.getAttribute("label") || "";
  }

  private getMaxValue(): number {
    return Number(this.getAttribute("max-value")) || 100;
  }

  private getValue(): number {
    return this._value || Number(this.getAttribute("value")) || 0;
  }

  private getProgressLabelType(): string {
    return this.getAttribute("progress-label-type") || "percent";
  }

  private getError(): { detail: string; code: number } | null {
    const errorAttr = this.getAttribute("error");
    if (!errorAttr) return null;
    try {
      return JSON.parse(errorAttr);
    } catch {
      return null;
    }
  }

  private calculateFillWidth(): string {
    const value = this.getValue();
    const maxValue = this.getMaxValue();
    if (!value) return "0%";

    const percentage = Math.floor((value / maxValue) * 100);
    if (percentage > 100) return "100%";
    if (percentage < 0) return "0%";

    return `${percentage}%`;
  }

  private getProgressLabel(): string {
    const value = this.getValue();
    const maxValue = this.getMaxValue();
    const progressLabelType = this.getProgressLabelType();

    if (progressLabelType === "percent") {
      return this.calculateFillWidth();
    }

    return `${value} ${progressLabelType} / ${maxValue} ${progressLabelType}`;
  }

  private generateId(): string {
    return `mt-progress-bar-${Math.random().toString(36).substr(2, 9)}`;
  }

  private render() {
    const label = this.getLabel();
    const maxValue = this.getMaxValue();
    const value = this.getValue();
    const fillWidth = this.calculateFillWidth();
    const progressLabel = this.getProgressLabel();
    const error = this.getError();
    const id = this.generateId();

    const hasError = !!error;
    const fillClasses = hasError
      ? "mt-progress-bar__fill mt-progress-bar__fill--with-error"
      : "mt-progress-bar__fill";

    let labelHtml = "";
    let progressLabelHtml = "";
    if (label) {
      labelHtml = `<label class="mt-progress-bar__label" for="${id}">${label}</label>`;
      progressLabelHtml = `<span class="mt-progress-bar__progress-label" aria-hidden="true">${progressLabel}</span>`;
    }

    let errorHtml = "";
    if (error) {
      errorHtml = `<div class="mt-progress-bar__error">${error.detail}</div>`;
    }

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="mt-progress-bar">
        ${labelHtml}
        ${progressLabelHtml}
        <div
          class="mt-progress-bar__track"
          role="progressbar"
          aria-valuenow="${value}"
          aria-valuemax="${maxValue}"
          aria-valuemin="0"
          aria-labelledby="${id}"
        >
          <div class="${fillClasses}" style="width: ${fillWidth};"></div>
        </div>
        ${errorHtml}
      </div>
    `;
  }
}

if (!customElements.get("mt-progress-bar")) {
  customElements.define("mt-progress-bar", MtProgressBar);
}

export default MtProgressBar;
