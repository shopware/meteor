// eslint-disable-next-line @typescript-eslint/no-unused-vars
import MtSnackbarNotification from "./_internal/mt-snackbar-notification.webc";

const styles = `
.mt-snackbar {
  width: 360px;
  position: fixed;
  bottom: var(--scale-size-16);
  right: var(--scale-size-16);
  z-index: 1600;
  pointer-events: none;
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
`;

interface SnackbarData {
  id: string;
  message: string;
  variant?: "success" | "error" | "warning" | "progress";
}

class MtSnackbar extends HTMLElement {
  private snackbars: SnackbarData[] = [];
  private isHovered: boolean = false;
  private removingIds: Set<string> = new Set();

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

  private attachEventListeners() {
    this.shadowRoot.addEventListener("mouseenter", () => {
      this.isHovered = true;
    });
    this.shadowRoot.addEventListener("mouseleave", () => {
      this.isHovered = false;
    });
  }

  private detachEventListeners() {
    // Cleanup if needed
  }

  // Public API to add snackbars
  public addSnackbar(
    message: string,
    variant?: "success" | "error" | "warning" | "progress",
  ): string {
    const id = `snackbar-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.snackbars.push({ id, message, variant });
    this.render();

    return id;
  }

  public removeSnackbar(id: string) {
    // Prevent multiple removals of the same notification
    if (this.removingIds.has(id)) {
      return;
    }

    this.removingIds.add(id);

    // Remove from array
    this.snackbars = this.snackbars.filter((s) => s.id !== id);

    // Find and remove the notification element from DOM after animation
    const container = this.shadowRoot!.querySelector(".mt-snackbar");
    if (container) {
      const notification = container.querySelector(`mt-snackbar-notification[data-id="${id}"]`);
      if (notification) {
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
          this.removingIds.delete(id);
        }, 550);
      } else {
        this.removingIds.delete(id);
      }
    } else {
      this.removingIds.delete(id);
    }

    this.render();
  }

  public clearSnackbars() {
    this.snackbars = [];
    this.render();
  }

  private render() {
    // Ensure container exists
    let container = this.shadowRoot!.querySelector(".mt-snackbar") as HTMLElement;
    if (!container) {
      this.shadowRoot!.innerHTML = `
        <style>${styles}</style>
        <div class="mt-snackbar"></div>
      `;
      container = this.shadowRoot!.querySelector(".mt-snackbar") as HTMLElement;
    }

    // Get existing notification elements
    const existingNotifications = Array.from(
      container.querySelectorAll("mt-snackbar-notification"),
    ) as HTMLElement[];

    // Update or create notifications
    this.snackbars.forEach((snackbar, index) => {
      if (this.removingIds.has(snackbar.id)) {
        return;
      }

      const offset = index * 68;
      let notification = existingNotifications.find(
        (el) => el.getAttribute("data-id") === snackbar.id,
      );

      if (!notification) {
        // Create new notification
        notification = document.createElement("mt-snackbar-notification") as HTMLElement;
        notification.setAttribute("data-id", snackbar.id);
        notification.setAttribute("data-message", snackbar.message);
        if (snackbar.variant) {
          notification.setAttribute("data-variant", snackbar.variant);
        }
        notification.setAttribute("data-offset", offset.toString());

        notification.addEventListener("remove-notification", (e: Event) => {
          const customEvent = e as CustomEvent;
          this.removeSnackbar(customEvent.detail.id);
        });

        container.appendChild(notification);
      } else {
        // Only update offset if notification is not being removed
        if (!notification.hasAttribute("data-removing") && !this.removingIds.has(snackbar.id)) {
          const currentOffset = parseInt(notification.getAttribute("data-offset") || "0", 10);
          if (currentOffset !== offset) {
            notification.setAttribute("data-offset", offset.toString());
          }
        }
      }
    });

    // Remove notifications that are no longer in the array
    existingNotifications.forEach((notification) => {
      const id = notification.getAttribute("data-id");
      if (!this.snackbars.find((s) => s.id === id) && !notification.hasAttribute("data-removing")) {
        notification.remove();
      }
    });
  }
}

if (!customElements.get("mt-snackbar")) {
  customElements.define("mt-snackbar", MtSnackbar);
}

export default MtSnackbar;
