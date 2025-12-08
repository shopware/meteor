const styles = `
.mt-skeleton-bar {
  height: var(--scale-size-32);
  width: 100%;
  background-color: var(--color-background-tertiary-default);
  overflow: hidden;
  border-radius: var(--border-radius-xs);
}

.mt-skeleton-bar:not(:last-child) {
  margin-bottom: var(--scale-size-32);
}

.mt-skeleton-bar__shimmer {
  height: 100%;
  background-image: linear-gradient(
    89.17deg,
    var(--color-background-tertiary-default) 0.8%,
    var(--color-background-primary-default) 50.09%,
    var(--color-background-tertiary-default) 96.31%
  );
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: 0 0;
  animation: barShimmer 1.8s infinite;
  animation-timing-function: linear;
  transform: translate(-100%);
}

@keyframes barShimmer {
  to {
    transform: translate(120%);
  }
}
`;

class MtSkeletonBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  private render() {
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="mt-skeleton-bar">
        <div class="mt-skeleton-bar__shimmer"></div>
      </div>
    `;
  }
}

if (!customElements.get("mt-skeleton-bar")) {
  customElements.define("mt-skeleton-bar", MtSkeletonBar);
}

export default MtSkeletonBar;
