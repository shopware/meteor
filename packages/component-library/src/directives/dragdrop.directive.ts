import type { Directive } from "vue";

export interface DragConfig<DATA = unknown> {
  delay: number;
  dragGroup: number | string;
  draggableCls: string;
  draggingStateCls: string;
  dragElementCls: string;
  validDragCls: string;
  invalidDragCls: string;
  preventEvent: boolean;
  validateDrop:
    | null
    | ((
        dragConfigData: DragConfig<DATA>["data"],
        dropConfigData: DropConfig<DATA>["data"],
      ) => boolean);
  validateDrag:
    | null
    | ((
        dragConfigData: DragConfig<DATA>["data"],
        dropConfigData: DropConfig<DATA>["data"],
      ) => boolean);
  validateDragStart:
    | null
    | ((
        dragConfigData: DragConfig<DATA>["data"],
        el: HTMLElement,
        event: MouseEvent | TouchEvent,
      ) => boolean);
  onDragStart:
    | null
    | ((dragConfig: DragConfig<DATA>, el: HTMLElement, dragElement: HTMLElement) => void);
  onDragEnter:
    | null
    | ((
        dragConfigData: DragConfig<DATA>["data"],
        dropConfigData: DropConfig<DATA>["data"],
        valid: boolean,
      ) => void);
  onDragLeave:
    | null
    | ((
        dragConfigData: DragConfig<DATA>["data"],
        dropConfigData: DropConfig<DATA>["data"],
      ) => void);
  onDrop:
    | null
    | ((
        dragConfigData: DragConfig<DATA>["data"],
        dropConfigData: DropConfig<DATA>["data"],
      ) => void);
  data: null | DATA;
  disabled: boolean;
}

export interface DropConfig<DATA = unknown> {
  dragGroup: number | string;
  droppableCls: string;
  validDropCls: string;
  invalidDropCls: string;
  validateDrop:
    | null
    | ((
        dragConfigData: DragConfig<DATA>["data"],
        dropConfigData: DropConfig<DATA>["data"],
      ) => boolean);
  onDrop:
    | null
    | ((
        dragConfigData: DragConfig<DATA>["data"],
        dropConfigData: DropConfig<DATA>["data"],
      ) => void);
  data: null | DATA;
}

export interface DropZone {
  el: HTMLElement;
  dropConfig: DropConfig;
}

/**
 * @description An object representing the current drag element and config.
 */
let currentDrag: { el: HTMLElement; dragConfig: DragConfig } | null = null;

/**
 * @description An object representing the current drop zone element and config.
 */
let currentDrop: { el: HTMLElement; dropConfig: DropConfig } | null = null;

/**
 * @description The proxy element which is used to display the moved element.
 */
let dragElement: HTMLElement | null = null;

/**
 * @description The x offset of the mouse position inside the dragged element.
 */
let dragMouseOffsetX = 0;

/**
 * @description The y offset of the mouse position inside the dragged element.
 */
let dragMouseOffsetY = 0;

/**
 * @description The timeout managing the delayed drag start.
 */
let delayTimeout: number | null = null;

/**
 * @description A registry of all drop zones.
 */
const dropZones: DropZone[] = [];

/**
 * The default config for the draggable directive.
 */
const defaultDragConfig: DragConfig = {
  delay: 100,
  dragGroup: 1,
  draggableCls: "is--draggable",
  draggingStateCls: "is--dragging",
  dragElementCls: "is--drag-element",
  validDragCls: "is--valid-drag",
  invalidDragCls: "is--invalid-drag",
  preventEvent: true,
  validateDrop: null,
  validateDrag: null,
  validateDragStart: null,
  onDragStart: null,
  onDragEnter: null,
  onDragLeave: null,
  onDrop: null,
  data: null,
  disabled: false,
};

/**
 * The default config for the droppable directive.
 */
const defaultDropConfig: DropConfig = {
  dragGroup: 1,
  droppableCls: "is--droppable",
  validDropCls: "is--valid-drop",
  invalidDropCls: "is--invalid-drop",
  validateDrop: null,
  onDrop: null,
  data: null,
};

/**
 * Fired by event callback when the user starts dragging an element.
 */
function onDrag(el: HTMLElement, dragConfig: DragConfig, event: MouseEvent | TouchEvent): boolean {
  if (event instanceof MouseEvent && event.buttons !== 1) {
    return false;
  }

  if (dragConfig.preventEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (dragConfig.delay === null || dragConfig.delay <= 0) {
    startDrag(el, dragConfig, event);
  } else {
    // TODO: check if {} instead of "this" is working
    delayTimeout = window.setTimeout(startDrag.bind({}, el, dragConfig, event), dragConfig.delay);
  }

  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchend", stopDrag);

  return true;
}

/**
 * Initializes the drag state for the current drag action.
 */
function startDrag(el: HTMLElement, dragConfig: DragConfig, event: MouseEvent | TouchEvent) {
  // check if starting drag is valid
  if (
    dragConfig.validateDragStart !== null &&
    !dragConfig.validateDragStart(dragConfig.data, el, event)
  ) {
    return;
  }

  delayTimeout = null;

  if (currentDrag !== null) {
    return;
  }

  currentDrag = { el, dragConfig };

  const elBoundingBox = el.getBoundingClientRect();

  const pageX = ((event instanceof MouseEvent && event.pageX) ||
    (event instanceof TouchEvent && event.touches[0].pageX)) as number;
  const pageY = ((event instanceof MouseEvent && event.pageY) ||
    (event instanceof TouchEvent && event.touches[0].pageY)) as number;

  dragMouseOffsetX = pageX - elBoundingBox.left;
  dragMouseOffsetY = pageY - elBoundingBox.top;

  dragElement = el.cloneNode(true) as HTMLElement;
  dragElement.classList.add(dragConfig.dragElementCls);
  dragElement.style.width = `${elBoundingBox.width}px`;
  dragElement.style.translate = `${pageX - dragMouseOffsetX}px ${pageY - dragMouseOffsetY}px`;
  dragElement.style.left = "0";
  dragElement.style.top = "0";
  document.body.appendChild(dragElement);

  el.classList.add(dragConfig.draggingStateCls);

  if (typeof currentDrag.dragConfig.onDragStart === "function") {
    currentDrag.dragConfig.onDragStart(currentDrag.dragConfig, el, dragElement);
  }

  document.addEventListener("mousemove", moveDrag);
  document.addEventListener("touchmove", moveDrag);
}

let rotationTimeout = 0;

/**
 * Calculate the rotation based on movement direction.
 */
function calculateRotation(oldX: number, newX: number): string {
  if (oldX && Math.abs(newX - oldX) > 2) {
    const moveRight = newX - oldX > 0;

    return `${moveRight ? 5 : -5}deg`;
  }

  return "";
}

/**
 * Fired by event callback when the user moves the dragged element.
 */
function moveDrag(event: MouseEvent | TouchEvent) {
  if (currentDrag === null) {
    stopDrag();
    return;
  }

  const pageX = ((event instanceof MouseEvent && event.pageX) ||
    (event instanceof TouchEvent && event.touches[0].pageX)) as number;
  const pageY = ((event instanceof MouseEvent && event.pageY) ||
    (event instanceof TouchEvent && event.touches[0].pageY)) as number;

  if (dragElement) {
    // get the old value from dataset
    const oldX = Number(dragElement.dataset.translateX);

    const newX = pageX - dragMouseOffsetX;
    const newY = pageY - dragMouseOffsetY;

    // calculate rotation
    dragElement.style.rotate = calculateRotation(oldX, newX);

    // use timeout for resetting the rotation after movement stops
    clearTimeout(rotationTimeout);
    rotationTimeout = window.setTimeout(() => {
      if (dragElement) dragElement.style.rotate = "0deg";
    }, 100);

    // set translate value
    dragElement.style.translate = `${newX}px ${newY}px`;

    // save new x value to dataset
    dragElement.dataset.translateX = newX.toString();
  }

  if (event.type === "touchmove") {
    dropZones.forEach((zone) => {
      if (isEventOverElement(event, zone.el)) {
        if (currentDrop === null || zone.el !== currentDrop.el) {
          enterDropZone(zone.el, zone.dropConfig);
        }
      } else if (currentDrop !== null && zone.el === currentDrop.el) {
        leaveDropZone(zone.el, zone.dropConfig);
      }
    });
  }
}

/**
 * Helper method for detecting if the current event position
 * is in the boundaries of an existing drop zone element.
 */
function isEventOverElement(event: MouseEvent | TouchEvent, el: HTMLElement): boolean {
  const pageX = ((event instanceof MouseEvent && event.pageX) ||
    (event instanceof TouchEvent && event.touches[0].pageX)) as number;
  const pageY = ((event instanceof MouseEvent && event.pageY) ||
    (event instanceof TouchEvent && event.touches[0].pageY)) as number;

  const box = el.getBoundingClientRect();

  return (
    pageX >= box.x && pageX <= box.x + box.width && pageY >= box.y && pageY <= box.y + box.height
  );
}

/**
 * Stops all drag interaction and resets all variables and listeners.
 */
function stopDrag() {
  if (delayTimeout !== null) {
    window.clearTimeout(delayTimeout);
    delayTimeout = null;
    return;
  }

  const validDrag = validateDrag();
  const validDrop = validateDrop();

  if (validDrag && currentDrag) {
    if (typeof currentDrag.dragConfig.onDrop === "function") {
      currentDrag.dragConfig.onDrop(
        currentDrag.dragConfig.data,
        validDrop ? currentDrop?.dropConfig?.data : null,
      );
    }
  }

  if (validDrop && currentDrop) {
    if (typeof currentDrop.dropConfig.onDrop === "function") {
      currentDrop.dropConfig.onDrop(currentDrag?.dragConfig.data, currentDrop.dropConfig.data);
    }
  }

  document.removeEventListener("mousemove", moveDrag);
  document.removeEventListener("touchmove", moveDrag);

  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchend", stopDrag);

  if (dragElement !== null) {
    dragElement.remove();
    dragElement = null;
  }

  if (currentDrag !== null) {
    currentDrag.el.classList.remove(currentDrag.dragConfig.draggingStateCls);
    currentDrag.el.classList.remove(currentDrag.dragConfig.validDragCls);
    currentDrag.el.classList.remove(currentDrag.dragConfig.invalidDragCls);
    currentDrag = null;
  }

  if (currentDrop !== null) {
    currentDrop.el.classList.remove(currentDrop.dropConfig.validDropCls);
    currentDrop.el.classList.remove(currentDrop.dropConfig.invalidDropCls);
    currentDrop = null;
  }

  dragMouseOffsetX = 0;
  dragMouseOffsetY = 0;
}

/**
 * Fired by event callback when the user moves the dragged element over an existing drop zone.
 */
function enterDropZone(el: HTMLElement, dropConfig: DropConfig) {
  if (currentDrag === null) {
    return;
  }
  currentDrop = { el, dropConfig };

  const valid = validateDrop();

  if (valid) {
    el.classList.add(dropConfig.validDropCls);
    el.classList.remove(dropConfig.invalidDropCls);

    if (dragElement) {
      dragElement.classList.add(currentDrag.dragConfig.validDragCls);
      dragElement.classList.remove(currentDrag.dragConfig.invalidDragCls);
    }
  } else {
    el.classList.add(dropConfig.invalidDropCls);
    el.classList.remove(dropConfig.validDropCls);

    if (dragElement) {
      dragElement.classList.add(currentDrag.dragConfig.invalidDragCls);
      dragElement.classList.remove(currentDrag.dragConfig.validDragCls);
    }
  }

  if (typeof currentDrag.dragConfig.onDragEnter === "function") {
    currentDrag.dragConfig.onDragEnter(
      currentDrag.dragConfig.data,
      currentDrop.dropConfig.data,
      valid,
    );
  }
}

/**
 * Fired by event callback when the user moves the dragged element out of an existing drop zone.
 *
 * @param {HTMLElement} el
 * @param {DropConfig} dropConfig
 */
function leaveDropZone(el: HTMLElement, dropConfig: DropConfig) {
  if (currentDrag === null) {
    return;
  }

  if (currentDrop === null) {
    return;
  }

  if (typeof currentDrag.dragConfig.onDragLeave === "function") {
    currentDrag.dragConfig.onDragLeave(currentDrag.dragConfig.data, currentDrop.dropConfig.data);
  }

  el.classList.remove(dropConfig.validDropCls);
  el.classList.remove(dropConfig.invalidDropCls);

  if (dragElement) {
    dragElement.classList.remove(currentDrag.dragConfig.validDragCls);
    dragElement.classList.remove(currentDrag.dragConfig.invalidDragCls);
  }

  currentDrop = null;
}

/**
 * Validates a drop using the {currentDrag} and {currentDrop} configuration.
 * Also calls the custom validator functions of the two configs.
 */
function validateDrop(): boolean {
  let valid = true;
  let customDragValidation = true;
  let customDropValidation = true;

  // Validate if the drag and drop are using the same drag group.
  if (
    currentDrag === null ||
    currentDrop === null ||
    currentDrop.dropConfig.dragGroup !== currentDrag.dragConfig.dragGroup
  ) {
    valid = false;
  }

  // Check the custom drag validate function.
  if (currentDrag !== null && typeof currentDrag.dragConfig.validateDrop === "function") {
    customDragValidation = currentDrag.dragConfig.validateDrop(
      currentDrag.dragConfig.data,
      currentDrop?.dropConfig.data,
    );
  }

  // Check the custom drop validate function.
  if (currentDrop !== null && typeof currentDrop.dropConfig.validateDrop === "function") {
    customDropValidation = currentDrop.dropConfig.validateDrop(
      currentDrag?.dragConfig.data,
      currentDrop.dropConfig.data,
    );
  }

  return valid && customDragValidation && customDropValidation;
}
/**
 * Validates a drag using the {currentDrag} configuration.
 * Also calls the custom validator functions of the config.
 */
function validateDrag(): boolean {
  let valid = true;
  let customDragValidation = true;

  // Validate if the drag and drop are using the same drag group.
  if (currentDrag === null) {
    valid = false;
  }

  // Check the custom drag validate function.
  if (currentDrag !== null && typeof currentDrag.dragConfig.validateDrag === "function") {
    customDragValidation = currentDrag.dragConfig.validateDrag(
      currentDrag.dragConfig.data,
      currentDrop?.dropConfig.data,
    );
  }

  return valid && customDragValidation;
}

function mergeConfigs(defaultConfig: DragConfig | DropConfig, binding: { value: unknown }) {
  const mergedConfig = { ...defaultConfig };

  if (binding.value instanceof Object) {
    Object.assign(mergedConfig, binding.value);
  } else {
    Object.assign(mergedConfig, { data: binding.value });
  }

  return mergedConfig;
}

interface DragHTMLElement extends HTMLElement {
  dragConfig?: DragConfig;
  boundDragListener?: (event: MouseEvent | TouchEvent) => boolean;
}

/**
 * Directive for making elements draggable.
 *
 * Usage:
 * <div v-draggable="{ data: {...}, onDrop() {...} }"></div>
 *
 * See the {DragConfig} for all possible config options.
 */
export const draggable: Directive = {
  mounted(el: DragHTMLElement, binding) {
    const dragConfig = mergeConfigs(defaultDragConfig, binding as { value: unknown }) as DragConfig;
    el.dragConfig = dragConfig;
    el.boundDragListener = onDrag.bind(this, el, el.dragConfig);

    if (!dragConfig.disabled) {
      el.classList.add(dragConfig.draggableCls);
      el.addEventListener("mousedown", el.boundDragListener);
      el.addEventListener("touchstart", el.boundDragListener);
    }
  },

  updated(el: DragHTMLElement, binding) {
    const dragConfig = mergeConfigs(defaultDragConfig, binding as { value: unknown }) as DragConfig;

    if (el.dragConfig && el.dragConfig.disabled !== dragConfig.disabled) {
      if (!dragConfig.disabled) {
        el.classList.remove(el.dragConfig.draggableCls);
        el.classList.add(dragConfig.draggableCls);
        if (el.boundDragListener) {
          el.addEventListener("mousedown", el.boundDragListener);
          el.addEventListener("touchstart", el.boundDragListener);
        }
      } else {
        el.classList.remove(el.dragConfig.draggableCls);
        if (el.boundDragListener) {
          el.removeEventListener("mousedown", el.boundDragListener);
          el.removeEventListener("touchstart", el.boundDragListener);
        }
      }
    }

    // @ts-expect-error - typescript support is missing here
    Object.assign(el.dragConfig, dragConfig);
  },

  unmounted(el: DragHTMLElement, binding) {
    const dragConfig = mergeConfigs(defaultDragConfig, binding as { value: unknown }) as DragConfig;

    el.classList.remove(dragConfig.draggableCls);

    if (el.boundDragListener) {
      el.removeEventListener("mousedown", el.boundDragListener);
      el.removeEventListener("touchstart", el.boundDragListener);
    }
  },
};

/**
 * Directive to define an element as a drop zone.
 *
 * Usage:
 * <div v-droppable="{ data: {...}, onDrop() {...} }"></div>
 *
 * See the {dropConfig} for all possible config options.
 */
export const droppable: Directive = {
  mounted(el, binding) {
    const dropConfig = mergeConfigs(defaultDropConfig, binding as { value: unknown }) as DropConfig;

    dropZones.push({ el, dropConfig });

    el.classList.add(dropConfig.droppableCls);
    el.addEventListener("mouseenter", enterDropZone.bind(this, el, dropConfig));
    el.addEventListener("mouseleave", leaveDropZone.bind(this, el, dropConfig));
  },

  unmounted(el, binding) {
    const dropConfig = mergeConfigs(defaultDropConfig, binding as { value: unknown }) as DropConfig;

    dropZones.splice(
      dropZones.findIndex((zone) => zone.el === el),
      1,
    );

    el.classList.remove(dropConfig.droppableCls);
    el.removeEventListener("mouseenter", enterDropZone.bind(this, el, dropConfig));
    el.removeEventListener("mouseleave", leaveDropZone.bind(this, el, dropConfig));
  },

  updated: (el, binding) => {
    const dropZone = dropZones.find((zone) => zone.el === el);

    if (binding.value instanceof Object) {
      // @ts-expect-error - typescript support is missing here
      Object.assign(dropZone?.dropConfig, binding.value);
    } else {
      // @ts-expect-error - typescript support is missing here
      Object.assign(dropZone?.dropConfig, { data: binding.value });
    }
  },
};
