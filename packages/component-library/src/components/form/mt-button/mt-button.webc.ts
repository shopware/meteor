// Import needed to register the mt-loader custom element
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import MtLoader from "../../feedback-indicator/mt-loader/mt-loader.webc";

const styles = `
.mt-button {
  transition-property: color, background-color, border-color;
  transition-duration: 0.15s;
  transition-timing-function: ease-out;
  display: inline-grid;
  place-items: center;
  width: max-content;
  border-radius: var(--border-radius-button);
  padding: var(--scale-size-2) var(--scale-size-24);
  font-size: var(--font-size-xs);
  border: 1px solid transparent;
  outline: none;
  font-weight: var(--font-weight-semibold);
  font-family: var(--font-family-body);
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  position: relative;
}

.mt-button:focus-visible {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: var(--scale-size-2);
}

.mt-button:disabled,
.mt-button.mt-button--disabled {
  cursor: not-allowed;
}

.mt-button__content {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  column-gap: var(--scale-size-8);
}

.mt-button__content--hidden {
  visibility: hidden;
}

.mt-button--primary {
  background: var(--color-interaction-primary-default);
  color: var(--color-static-white);
  border-color: var(--color-interaction-primary-default);
}

.mt-button--primary .mt-icon {
  color: var(--color-static-white);
}

.mt-button--primary:hover,
.mt-button--primary:active {
  background: var(--color-interaction-primary-hover);
  border-color: var(--color-interaction-primary-hover);
}

.mt-button--primary:disabled,
.mt-button--primary.mt-button--disabled {
  background: var(--color-interaction-primary-disabled);
  border-color: var(--color-interaction-primary-disabled);
}

.mt-button--primary:disabled .mt-button__content,
.mt-button--primary.mt-button--disabled .mt-button__content {
  opacity: 0.4;
}

.mt-button--primary-ghost {
  background: transparent;
  border: 1px solid var(--color-border-brand-default);
  border-color: var(--color-border-brand-default);
  color: var(--color-text-brand-default);
}

.mt-button--primary-ghost:is(:hover, :active):not(:disabled) {
  background: var(--color-background-brand-default);
}

.mt-button--primary-ghost:disabled,
.mt-button--primary-ghost.mt-button--disabled {
  color: var(--color-text-brand-disabled);
  border-color: var(--color-border-brand-disabled);
  background: transparent;
}

.mt-button--primary-ghost:disabled .mt-icon,
.mt-button--primary-ghost.mt-button--disabled .mt-icon {
  color: var(--color-icon-brand-disabled);
}

.mt-button--primary-ghost .mt-icon {
  color: var(--color-icon-brand-default);
}

.mt-button--secondary {
  background: var(--color-interaction-secondary-default);
  border: 1px solid var(--color-border-primary-default);
  color: var(--color-text-primary-default);
}

.mt-button--secondary:is(:hover, :active) {
  background: var(--color-interaction-secondary-hover);
}

.mt-button--secondary:disabled,
.mt-button--secondary.mt-button--disabled {
  color: var(--color-text-primary-disabled);
  background: var(--color-interaction-secondary-disabled);
}

.mt-button--secondary:disabled .mt-icon,
.mt-button--secondary.mt-button--disabled .mt-icon {
  color: var(--color-icon-primary-disabled);
}

.mt-button--secondary .mt-icon {
  color: var(--color-icon-primary-default);
}

.mt-button--tertiary {
  background: transparent;
  border: 1px solid transparent;
  color: var(--color-text-primary-default);
}

.mt-button--tertiary:hover {
  background: var(--color-interaction-secondary-hover);
}

.mt-button--tertiary:active {
  background: var(--color-interaction-secondary-pressed);
}

.mt-button--tertiary:disabled,
.mt-button--tertiary.mt-button--disabled {
  color: var(--color-text-primary-disabled);
  background: transparent;
}

.mt-button--tertiary:disabled .mt-icon,
.mt-button--tertiary.mt-button--disabled .mt-icon {
  color: var(--color-icon-primary-disabled);
}

.mt-button--tertiary .mt-icon {
  color: var(--color-icon-primary-default);
}

.mt-button--critical {
  background: var(--color-interaction-critical-default);
  color: var(--color-static-white);
  border-color: var(--color-interaction-critical-default);
}

.mt-button--critical:is(:hover, :active) {
  background: var(--color-interaction-critical-hover);
  border-color: var(--color-interaction-critical-hover);
}

.mt-button--critical:disabled,
.mt-button--critical.mt-button--disabled {
  background: var(--color-interaction-critical-disabled);
  border-color: var(--color-interaction-critical-disabled);
}

.mt-button--critical:disabled .mt-icon,
.mt-button--critical.mt-button--disabled .mt-icon,
.mt-button--critical .mt-icon {
  color: var(--color-static-white);
}

.mt-button--critical:disabled .mt-button__content,
.mt-button--critical.mt-button--disabled .mt-button__content {
  opacity: 0.4;
}

.mt-button--critical-ghost {
  background: transparent;
  border: 1px solid var(--color-border-critical-default);
  color: var(--color-text-critical-default);
}

.mt-button--critical-ghost:is(:hover, :active):not(:disabled) {
  background-color: var(--color-background-critical-default);
}

.mt-button--critical-ghost:disabled,
.mt-button--critical-ghost.mt-button--disabled {
  color: var(--color-text-critical-disabled);
  border-color: var(--color-border-critical-disabled);
}

.mt-button--critical-ghost:disabled .mt-icon,
.mt-button--critical-ghost.mt-button--disabled .mt-icon {
  color: var(--color-icon-critical-disabled);
}

.mt-button--critical-ghost .mt-icon {
  color: var(--color-icon-critical-default);
}

.mt-button--action {
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  color: #000000;
}

.mt-button--action .mt-icon {
  color: #1a202c;
}

.mt-button--action:hover {
  background-color: #edf2f7;
  color: #4a5568;
}

.mt-button--action:disabled {
  background-color: #f7fafc;
  color: #a0aec0;
}

.mt-button--block {
  display: block;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mt-button--x-small {
  padding-left: var(--scale-size-10);
  padding-right: var(--scale-size-10);
  font-size: var(--font-size-2xs);
  min-height: 24px;
}

.mt-button--x-small.mt-button--square {
  width: var(--scale-size-24);
  height: var(--scale-size-24);
}

.mt-button--small {
  padding-left: 15px;
  padding-right: 15px;
  font-size: var(--font-size-2xs);
  min-height: 32px;
}

.mt-button--small.mt-button--square {
  width: var(--scale-size-32);
  height: var(--scale-size-32);
}

.mt-button--default {
  padding-inline: var(--scale-size-16);
  font-size: var(--font-size-xs);
  min-height: 2.5rem;
}

.mt-button--default.mt-button--square {
  width: var(--scale-size-40);
  height: var(--scale-size-40);
}

.mt-button--large {
  padding-left: var(--scale-size-28);
  padding-right: var(--scale-size-28);
  min-height: 3rem;
  font-size: var(--font-size-xs);
}

.mt-button--large.mt-button--square {
  width: var(--scale-size-48);
  height: var(--scale-size-48);
}

.mt-button--square {
  width: var(--scale-size-40);
  height: var(--scale-size-40);
  padding-left: 0;
  padding-right: 0;
  text-align: center;
}

.mt-button--square .mt-button__content {
  display: inline;
}

.mt-button__loader {
  border-radius: var(--border-radius-xs);
}
`;

class MtButton extends HTMLElement {
  static get observedAttributes() {
    return ["disabled", "variant", "ghost", "size", "square", "block", "link", "is-loading", "is"];
  }

  private buttonElement: HTMLElement | null = null;

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

  private getDisabled(): boolean {
    const value = this.getAttribute("disabled");
    return value !== null && value !== "false" && value !== "";
  }

  private getVariant(): string {
    return this.getAttribute("variant") || "secondary";
  }

  private getGhost(): boolean {
    const value = this.getAttribute("ghost");
    return value !== null && value !== "false" && value !== "";
  }

  private getSize(): string {
    return this.getAttribute("size") || "small";
  }

  private getSquare(): boolean {
    const value = this.getAttribute("square");
    return value !== null && value !== "false" && value !== "";
  }

  private getBlock(): boolean {
    const value = this.getAttribute("block");
    return value !== null && value !== "false" && value !== "";
  }

  private getLink(): string | null {
    return this.getAttribute("link");
  }

  private getIsLoading(): boolean {
    const value = this.getAttribute("is-loading");
    return value !== null && value !== "false" && value !== "";
  }

  private getIs(): string {
    return this.getAttribute("is") || "button";
  }

  private getIconSize(): number {
    const size = this.getSize();
    if (size === "x-small") return 8;
    if (size === "large") return 12;
    return 10;
  }

  private getButtonClasses(): string {
    const variant = this.getVariant();
    const ghost = this.getGhost();
    const size = this.getSize();
    const block = this.getBlock();
    const disabled = this.getDisabled();
    const square = this.getSquare();

    const allowGhostVariant = ghost && variant !== "secondary" && variant !== "tertiary";

    const classes = [
      "mt-button",
      variant ? `mt-button--${variant}${allowGhostVariant ? "-ghost" : ""}` : "",
      size ? `mt-button--${size}` : "",
      block ? "mt-button--block" : "",
      disabled ? "mt-button--disabled" : "",
      square ? "mt-button--square" : "",
    ].filter(Boolean);

    return classes.join(" ");
  }

  private handleClick = (e: Event) => {
    if (this.getDisabled() || this.getIsLoading()) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    }
    // Let the event bubble naturally
    return true;
  };

  private attachEventListeners() {
    if (this.buttonElement) {
      this.buttonElement.removeEventListener("click", this.handleClick);
    }
    this.buttonElement = this.shadowRoot!.querySelector(".mt-button") as HTMLElement;
    if (this.buttonElement) {
      this.buttonElement.addEventListener("click", this.handleClick);
    }
  }

  private detachEventListeners() {
    if (this.buttonElement) {
      this.buttonElement.removeEventListener("click", this.handleClick);
    }
  }

  private render() {
    const link = this.getLink();
    const disabled = this.getDisabled();
    const isLoading = this.getIsLoading();
    const classes = this.getButtonClasses();
    const is = this.getIs();

    // For link buttons, render as <a>
    if (link) {
      const href = disabled || isLoading ? "" : link;
      const tabindex = disabled || isLoading ? "-1" : "0";

      this.shadowRoot!.innerHTML = `
        <style>${styles}</style>
        <a
          href="${href}"
          target="_blank"
          rel="noopener"
          class="${classes}"
          tabindex="${tabindex}"
        >
          <span class="mt-button__content">
            <slot name="iconFront"></slot>
            <slot></slot>
            <slot name="iconBack"></slot>
          </span>
        </a>
      `;
    } else {
      // For regular buttons, render as button or custom element
      // Note: Custom elements via 'is' attribute are limited in web components
      // We'll use createElement for better control
      const buttonTag = is === "button" ? "button" : is;
      const disabledAttr = disabled && !isLoading ? "disabled" : "";
      const ariaDisabled = disabled && isLoading ? 'aria-disabled="true"' : "";

      // Escape the tag name for use in innerHTML (basic safety)
      const safeTag = buttonTag.replace(/[<>]/g, "");

      this.shadowRoot!.innerHTML = `
        <style>${styles}</style>
        <${safeTag}
          type="button"
          class="${classes}"
          ${disabledAttr}
          ${ariaDisabled}
        >
          ${isLoading ? `<mt-loader size="16px" class="mt-button__loader"></mt-loader>` : ""}
          <span class="mt-button__content ${isLoading ? "mt-button__content--hidden" : ""}">
            <slot name="iconFront"></slot>
            <slot></slot>
            <slot name="iconBack"></slot>
          </span>
        </${safeTag}>
      `;
    }

    // Re-attach event listeners after render
    this.attachEventListeners();
  }
}

if (!customElements.get("mt-button")) {
  customElements.define("mt-button", MtButton);
}

export default MtButton;
