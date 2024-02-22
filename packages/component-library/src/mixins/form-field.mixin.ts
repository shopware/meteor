import { defineComponent } from "vue";

export default defineComponent({
  props: {
    mapInheritance: {
      type: Object,
      required: false,
      default: null,
    },

    name: {
      type: String,
      required: false,
      default: null,
    },
  },

  computed: {
    formFieldName() {
      if (this.$attrs.name) {
        return this.$attrs.name as string;
      }

      if (this.name) {
        return this.name;
      }

      return undefined;
    },
  },
});
