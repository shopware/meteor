export default {
  i18n: {
    messages: {
      en: {
        'notification': {
          success: 'Success',
          info: 'Info',
          warning: 'Warning',
          error: 'Error',
        }
      },
      de: {
        'notification': {
          success: 'Erfolg',
          info: 'Info',
          warning: 'Warnung',
          error: 'Fehler',
        }
      }
    },
  },

  methods: {
    // eslint-disable-next-line no-unused-vars
    createNotification(notification) {
      // return Shopware.State.dispatch('notification/createNotification', notification);
    },

    createNotificationSuccess(config) {
      const notification = {
        variant: 'success',
        title: this.$tc('global.default.success'),
        ...config,
      };

      this.createNotification(notification);
    },

    createNotificationInfo(config) {
      const notification = {
        variant: 'info',
        title: this.$tc('global.default.info'),
        ...config,
      };

      this.createNotification(notification);
    },

    createNotificationWarning(config) {
      const notification = {
        variant: 'warning',
        title: this.$tc('global.default.warning'),
        ...config,
      };

      this.createNotification(notification);
    },

    createNotificationError(config) {
      const notification = {
        variant: 'error',
        title: this.$tc('global.default.error'),
        ...config,
      };

      this.createNotification(notification);
    },

    createSystemNotificationSuccess(config) {
      const notification = {
        variant: 'success',
        system: true,
        ...config,
      };

      this.createNotification(notification);
    },

    createSystemNotificationInfo(config) {
      const notification = {
        variant: 'info',
        system: true,
        ...config,
      };

      this.createNotification(notification);
    },

    createSystemNotificationWarning(config) {
      const notification = {
        variant: 'warning',
        system: true,
        ...config,
      };

      this.createNotification(notification);
    },

    createSystemNotificationError(config) {
      const notification = {
        variant: 'error',
        system: true,
        ...config,
      };

      this.createNotification(notification);
    },

    createSystemNotification(config) {
      const notification = { system: true, ...config };

      this.createNotification(notification);
    },
  },
};
