import validationService from '../services/validation.service';

export default {
  props: {
    validation: {
      type: [String, Array, Object, Boolean],
      required: false,
      default: null,
    },
  },

  computed: {
    isValid() {
      const value = this.currentValue || this.value || this.selections;

      return this.validate(value);
    },
  },

  methods: {
    validate(value) {
      let { validation } = this;
      let valid = true;

      if (typeof validation === 'boolean') {
        return validation;
      }

      if (typeof validation === 'string') {
        const validationList = validation.split(',');

        if (validationList.length > 1) {
          validation = validationList;
        } else {
          valid = this.validateRule(value, this.validation);
        }
      }

      if (Array.isArray(validation)) {
        valid = validation.every((validationRule) => {
          if (typeof validationRule === 'boolean') {
            return validationRule;
          }

          return this.validateRule(value, validationRule.trim());
        });
      }

      return valid;
    },

    validateRule(value, rule) {
      if (typeof validationService[rule] === 'undefined') {
        return false;
      }

      return validationService[rule](value);
    },
  },
};
