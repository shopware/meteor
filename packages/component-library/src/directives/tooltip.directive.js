import { createId } from '../utils/uuid';
import { hasOwnProperty } from '../utils/object';

const availableTooltipPlacements = [
  'top',
  'right',
  'bottom',
  'left',
];

const tooltipRegistry = new Map();

class Tooltip {
  /**
   * @param {object} obj
   * @param {string} obj.id
   * @param {string} obj.placement
   * @param {string} obj.message
   * @param {number|string} obj.width
   * @param {HTMLElement} obj.element - The original element the tooltip should appear on
   * @param {number} obj.showDelay
   * @param {number} obj.hideDelay
   * @param {boolean} obj.disabled
   * @param {string} obj.appearance
   * @param {boolean} obj.showOnDisabledElements
   */
  constructor({
    id = createId(),
    placement = 'top',
    message,
    width = 200,
    element,
    showDelay = 100,
    hideDelay = showDelay,
    disabled = false,
    appearance = 'dark',
    showOnDisabledElements = false,
    zIndex = null,
  }) {
    this._id = id;
    this._placement = Tooltip.validatePlacement(placement);
    this._message = Tooltip.validateMessage(message);
    this._width = Tooltip.validateWidth(width);
    this._parentDOMElement = element;
    this._showDelay = showDelay;
    this._hideDelay = hideDelay;
    this._disabled = disabled;
    this._appearance = appearance;
    this._showOnDisabledElements = showOnDisabledElements;
    this._zIndex = zIndex;

    // initialize tooltip variables
    this._isShown = false;
    this._state = false;
    this._DOMElement = null;
    this._parentDOMElementWrapper = null;
    this._actualTooltipPlacement = null;
  }

  /**
   * @returns {String}
   */
  get id() {
    return this._id;
  }

  /**
   * Initializes the tooltip.
   * Needs to be called after the parent DOM Element is inserted to the DOM.
   */
  init(node) {
    this._DOMElement = this.createDOMElement(node);

    if (this._showOnDisabledElements) {
      this._parentDOMElementWrapper = this.createParentDOMElementWrapper();
    }

    this.registerEvents();
  }

  /**
   * Updates the styles and/or text of the tooltip
   *
   * @param {object} obj
   * @param {string} obj.message
   * @param {string} obj.placement
   * @param {number} obj.width
   * @param {number} obj.showDelay
   * @param {number} obj.hideDelay
   * @param {boolean} obj.disabled
   * @param {string} obj.appearance
   * @param {boolean} obj.showOnDisabledElements
   */
  update({
    message,
    placement,
    width,
    showDelay,
    hideDelay,
    disabled,
    appearance,
    showOnDisabledElements,
    zIndex,
  }) {
    if (message && this._message !== message) {
      this._message = Tooltip.validateMessage(message);
      this._DOMElement.innerHTML = this._message;

      this.registerEvents();
    }

    if (width && this._width !== width) {
      this._width = Tooltip.validateWidth(width);
      this._DOMElement.style.width = `${this._width}px`;
    }

    if (placement && this._placement !== placement) {
      this._placement = Tooltip.validatePlacement(placement);
      this._placeTooltip();
    }

    if (showDelay && this._showDelay !== showDelay) {
      this._showDelay = showDelay;
    }

    if (hideDelay && this._hideDelay !== hideDelay) {
      this._hideDelay = hideDelay;
    }

    if (disabled !== undefined && this._disabled !== disabled) {
      this._disabled = disabled;
    }

    if (appearance && this._appearance !== appearance) {
      this._DOMElement.classList.remove(`sw-tooltip--${this._appearance}`);
      this._appearance = appearance;
      this._DOMElement.classList.add(`sw-tooltip--${this._appearance}`);
    }

    if (showOnDisabledElements !== undefined && this._showOnDisabledElements !== showOnDisabledElements) {
      this._showOnDisabledElements = showOnDisabledElements;
    }

    if (zIndex !== this._zIndex) {
      this._zIndex = zIndex;
    }
  }

  /**
   * Creates a wrapper around the original DOMElement.
   * This is needed because a disabled input field does not fire any mouse events and prevents the tooltip
   * therefore from working.
   * @returns {HTMLElement}
   */
  createParentDOMElementWrapper() {
    const element = document.createElement('div');
    element.classList.add('sw-tooltip--wrapper');

    this._parentDOMElement.parentNode.insertBefore(element, this._parentDOMElement);
    element.appendChild(this._parentDOMElement);

    return element;
  }

  /**
   * @returns {HTMLElement}
   */
  createDOMElement() {
    const element = document.createElement('div');
    element.innerHTML = this._message;
    element.style.width = `${this._width}px`;
    element.setAttribute('aria-hidden', 'false');
    element.setAttribute('aria-role', 'tooltip');
    element.setAttribute('aria-label', 'currently-opened-tooltip');
    element.classList.add('sw-tooltip');
    element.classList.add(`sw-tooltip--${this._appearance}`);
    element.style.zIndex = this._zIndex;

    return element;
  }

  registerEvents() {
    if (this._parentDOMElementWrapper) {
      this._parentDOMElementWrapper.addEventListener('mouseenter', this.onMouseToggle.bind(this));
      this._parentDOMElementWrapper.addEventListener('mouseleave', this.onMouseToggle.bind(this));
    } else {
      this._parentDOMElement.addEventListener('mouseenter', this.onMouseToggle.bind(this));
      this._parentDOMElement.addEventListener('mouseleave', this.onMouseToggle.bind(this));
    }
    this._DOMElement.addEventListener('mouseenter', this.onMouseToggle.bind(this));
    this._DOMElement.addEventListener('mouseleave', this.onMouseToggle.bind(this));
  }

  /**
   * Sets the state and triggers the toggle.
   *
   * @param {EventListenerObject} event
   */
  onMouseToggle(event) {
    this._state = (event.type === 'mouseenter');

    if (this._timeout) {
      clearTimeout(this._timeout);
    }

    this._timeout = setTimeout(this._toggle.bind(this), (this._state ? this._showDelay : this._hideDelay));
  }

  _toggle() {
    if (this._state && !this._isShown && this._doesParentExist()) {
      this.showTooltip();
      return;
    }

    if (!this._state && this._isShown) {
      this.hideTooltip();
    }
  }

  /**
   * Gets the parent element by tag name and tooltip id and returns true or false whether the element exists.
   * @returns {boolean}
   * @private
   */
  _doesParentExist() {
    const tooltipIdOfParentElement = this._parentDOMElement.getAttribute('tooltip-id');
    const htmlTagOfParentElement = this._parentDOMElement.tagName.toLowerCase();

    return !!document.querySelector(`${htmlTagOfParentElement}[tooltip-id="${tooltipIdOfParentElement}"]`);
  }

  /**
   * Appends the tooltip to the DOM and sets a suitable position
   */
  showTooltip() {
    if (this._disabled) {
      return;
    }
    document.body.appendChild(this._DOMElement);

    this._placeTooltip();
    this._isShown = true;
  }

  /**
   * Removes the tooltip from the DOM
   */
  hideTooltip() {
    if (this._disabled) {
      return;
    }
    this._DOMElement.remove();
    this._isShown = false;
  }

  _placeTooltip() {
    let possiblePlacements = availableTooltipPlacements;
    let placement = this._placement;
    possiblePlacements = possiblePlacements.filter((pos) => pos !== placement);

    // Remove previous placement class if it exists
    this._DOMElement.classList.remove(`sw-tooltip--${this._actualTooltipPlacement}`);

    // Set the tooltip to the desired place
    this._setDOMElementPosition(this._calculateTooltipPosition(placement));
    this._actualTooltipPlacement = placement;

    // Check if the tooltip is fully visible in viewport and change position if not
    while (!this._isElementInViewport(this._DOMElement)) {
      // The tooltip wont fit in any position
      if (possiblePlacements.length < 1) {
        this._actualTooltipPlacement = this._placement;
        this._setDOMElementPosition(this._calculateTooltipPosition(this._placement));
        break;
      }
      // try the next position in the possiblePositions array
      placement = possiblePlacements.shift();
      this._setDOMElementPosition(this._calculateTooltipPosition(placement));
      this._actualTooltipPlacement = placement;
    }

    this._DOMElement.classList.add(`sw-tooltip--${this._actualTooltipPlacement}`);
  }

  _setDOMElementPosition({ top, left }) {
    this._DOMElement.style.top = top;
    this._DOMElement.style.left = left;
  }

  _calculateTooltipPosition(placement) {
    const boundingBox = this._parentDOMElement.getBoundingClientRect();
    const secureOffset = 10;

    let top;
    let left;

    switch (placement) {
      case 'bottom':
        top = `${boundingBox.top + boundingBox.height + secureOffset}px`;
        left = `${boundingBox.left + (boundingBox.width / 2) - this._DOMElement.offsetWidth / 2}px`;
        break;
      case 'left':
        top = `${boundingBox.top + boundingBox.height / 2 - this._DOMElement.offsetHeight / 2}px`;
        left = `${boundingBox.left - secureOffset - this._DOMElement.offsetWidth}px`;
        break;
      case 'right':
        top = `${boundingBox.top + boundingBox.height / 2 - this._DOMElement.offsetHeight / 2}px`;
        left = `${boundingBox.right + secureOffset}px`;
        break;
      case 'top':
      default:
        top = `${boundingBox.top - this._DOMElement.offsetHeight - secureOffset}px`;
        left = `${boundingBox.left + (boundingBox.width / 2) - this._DOMElement.offsetWidth / 2}px`;
    }
    return { top, left };
  }

  _isElementInViewport(element) {
    // get position
    const boundingClientRect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    // calculate which borders are in viewport
    const visibleBorders = {
      top: boundingClientRect.top > 0,
      right: boundingClientRect.right < windowWidth,
      bottom: boundingClientRect.bottom < windowHeight,
      left: boundingClientRect.left > 0,
    };

    return visibleBorders.top && visibleBorders.right && visibleBorders.bottom && visibleBorders.left;
  }

  /**
   * @param {string} placement
   * @returns {string}
   */
  static validatePlacement(placement) {
    if (!availableTooltipPlacements.includes(placement)) {
      console.warn(
        'Tooltip Directive',
        `The modifier has to be one of these "${availableTooltipPlacements.join(',')}"`,
      );
      return 'top';
    }
    return placement;
  }

  /**
   * @param {string} message
   * @returns {string}
   */
  static validateMessage(message) {
    if (typeof message !== 'string') {
      console.warn('Tooltip Directive', 'The tooltip needs a message with type string');
    }

    return message;
  }

  /**
   * @param {number|string} width
   * @returns {number}
   */
  static validateWidth(width) {
    if (width === 'auto') {
      return width;
    }

    if (typeof width !== 'number' || width < 1) {
      console.warn('Tooltip Directive', 'The tooltip width has to be a number greater 0');
      return 200;
    }

    return width;
  }

  /**
   * @param {number} delay
   * @returns {number}
   */
  static validateDelay(delay) {
    if (typeof delay !== 'number' || delay < 1) {
      console.warn('Tooltip Directive', 'The tooltip delay has to be a number greater 0');
      return 100;
    }

    return delay;
  }
}

/**
 * Helper function for creating or updating a tooltip instance
 *
 * @param {HTMLElement} el
 * @param {object} obj
 * @param {*} obj.value
 * @param {object} obj.modifiers
 */
function createOrUpdateTooltip(el, { value, modifiers }) {
  let message = hasOwnProperty(value, 'message') ? value.message : value;
  message = message ? message.trim() : '';

  const placement = value.position || Object.keys(modifiers)[0];
  const { showDelay } = value;
  const { hideDelay } = value;
  const { disabled } = value;
  const { appearance } = value;
  const { width } = value;
  const { showOnDisabledElements } = value;
  const { zIndex } = value;

  const configuration = {
    element: el,
    message,
    placement,
    width,
    showDelay,
    hideDelay,
    disabled,
    appearance,
    showOnDisabledElements,
    zIndex,
  };

  if (el.hasAttribute('tooltip-id')) {
    const tooltip = tooltipRegistry.get(el.getAttribute('tooltip-id'));
    tooltip.update(configuration);

    return;
  }

  const tooltip = new Tooltip(configuration);

  tooltipRegistry.set(tooltip.id, tooltip);
  el.setAttribute('tooltip-id', tooltip.id);
}

export default {
  bind: (el, binding) => {
    createOrUpdateTooltip(el, binding);
  },

  unbind: (el) => {
    if (el.hasAttribute('tooltip-id')) {
      const tooltip = tooltipRegistry.get(el.getAttribute('tooltip-id'));
      tooltip.hideTooltip();
    }
  },

  update: (el, binding) => {
    createOrUpdateTooltip(el, binding);
  },

  /**
   * Initialize the tooltip once it has been inserted to the DOM.
   * @param el
   * @param binding
   * @param node
   */
  inserted: (el, binding, node) => {
    if (el.hasAttribute('tooltip-id')) {
      const tooltip = tooltipRegistry.get(el.getAttribute('tooltip-id'));
      tooltip.init(node);
    }
  },
};
