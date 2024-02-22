import { defineComponent } from "vue";
import validationService from "../services/validation.service";

export default defineComponent({
  props: {
    validation: {
      type: [String, Array, Object, Boolean],
      required: false,
      default: null,
    },
  },

  computed: {
    isValid(): boolean {
      // @ts-expect-error
      const value = this.currentValue || this.value || this.selections;

      return this.validate(value);
    },
  },

  methods: {
    validate(value: unknown): boolean {
      let { validation } = this;
      let valid = true;

      if (typeof validation === "boolean") {
        return validation;
      }

      if (typeof validation === "string") {
        const validationList = validation.split(",");

        if (validationList.length > 1) {
          validation = validationList;
        } else {
          // @ts-expect-error
          valid = this.validateRule(value, this.validation);
        }
      }

      if (Array.isArray(validation)) {
        valid = validation.every((validationRule) => {
          if (typeof validationRule === "boolean") {
            return validationRule;
          }

          return this.validateRule(value, validationRule.trim());
        });
      }

      return valid;
    },

    validateRule(value: unknown, rule: string): boolean {
      // @ts-expect-error
      if (typeof validationService[rule] === "undefined") {
        return false;
      }

      // @ts-expect-error
      return validationService[rule](value);
    },
  },
});
