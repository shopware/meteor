<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PropType, VNode } from 'vue';
import Vue from 'vue';

interface ItemBase {
  hidden?: boolean,
  [key: string]: any
}

function getWidth(el: Element) {
  const styles = window.getComputedStyle(el)
  const margin = parseFloat(styles.marginLeft) +
    parseFloat(styles.marginRight)

  // @ts-expect-error - offsetWidth exists on this element
  return Math.ceil(el.offsetWidth + margin)
}

export default Vue.extend({
  name: 'PriorityPlusMenu',

  props: {
    list: {
      type: Array as PropType<ItemBase[]>,
      required: true,
      default () { return [] }
    },
    offsetFactor: {
      type: Number,
      default: 2.0
    }
  },

  data(): {
    accumItemWidths: any[]
  } {
    return {
      accumItemWidths: []
    }
  },

  computed: {
    mainItems(): ItemBase[] {
      return this.list.filter((item) => !item.hidden)
    },

    moreItems(): ItemBase[] {
      return this.list.filter((item) => item.hidden)
    },

    hasHiddenItems(): boolean {
      return !!this.moreItems.length
    }
  },

  beforeCreate () {
    if (this.$options.propsData) {
      // @ts-expect-error - list is a property in this component
      this.$options.propsData.list.forEach((item) => {
        this.$set(item, 'hidden', false)
      })
    }
  },

  async mounted() {
    await this.$nextTick()

    this.storeItemWidths()
    this.handleResize()
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    window.addEventListener('resize', this.handleResize)
  },

  beforeUpdate() {
    this.handleResize()
  },

  beforeDestroy() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    window.removeEventListener('resize', this.handleResize)
  },

  methods: {
    storeItemWidths () {
      let sum = 0
      const els = Array.prototype.slice.call(this.$el.children || [])
      this.list.forEach((item, index) => {
        this.$set(item, 'width', getWidth(els[index]))
        sum += item.width
        this.$set(this.accumItemWidths, index, sum)
      })
    },

    getContainerWidth () {
      let offset = 0

      if (this.hasHiddenItems) {
        const els = Array.prototype.slice.call(this.$el.children || [])
        const el = els[els.length - 1]
        els && el && ( offset = getWidth(el) * this.offsetFactor )
      }

      // @ts-expect-error - offsetWidth exists on this element
      return this.$el.offsetWidth - offset
    },

    getLastVisibleItemIndex () {
      let index = 0
      const containerWidth = this.getContainerWidth()

      while (index < this.accumItemWidths.length) {
        if (this.accumItemWidths[index] > containerWidth) {
          index--
          break
        }
        index++
      }

      return index
    },

    async handleResize () {
      await this.$nextTick()

      const lastVisibleItemIndex = this.getLastVisibleItemIndex()

      this.list.forEach((item, index) => {
        const hidden = index > lastVisibleItemIndex
        this.$set(item, 'hidden', hidden)
      })
    }
  },

  render(): VNode {
    // @ts-expect-error - scopedSlots return a VNode
    return this.$scopedSlots.default({
      mainItems: this.mainItems,
      moreItems: this.moreItems
    })
  }
});
</script>