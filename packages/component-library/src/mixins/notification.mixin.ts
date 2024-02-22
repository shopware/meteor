import { defineComponent } from "vue";

export default defineComponent({
  i18n: {
    messages: {
      en: {
        notification: {
          success: "Success",
          info: "Info",
          warning: "Warning",
          error: "Error",
        },
      },
      de: {
        notification: {
          success: "Erfolg",
          info: "Info",
          warning: "Warnung",
          error: "Fehler",
        },
      },
    },
  },

  methods: {
    // eslint-disable-next-line no-unused-vars
    createNotification() {
      // TODO: Implement a general notification system
      // return Shopware.State.dispatch('notification/createNotification', notification);
    },

    createNotificationSuccess(config: any) {
      const notification = {
        variant: "success",
        title: this.$tc("global.default.success"),
        ...config,
      };

      // @ts-expect-error
      this.createNotification(notification);
    },

    createNotificationInfo(config: any) {
      const notification = {
        variant: "info",
        title: this.$tc("global.default.info"),
        ...config,
      };

      // @ts-expect-error
      this.createNotification(notification);
    },

    createNotificationWarning(config: any) {
      const notification = {
        variant: "warning",
        title: this.$tc("global.default.warning"),
        ...config,
      };

      // @ts-expect-error
      this.createNotification(notification);
    },

    createNotificationError(config: any) {
      const notification = {
        variant: "error",
        title: this.$tc("global.default.error"),
        ...config,
      };

      // @ts-expect-error
      this.createNotification(notification);
    },

    createSystemNotificationSuccess(config: any) {
      const notification = {
        variant: "success",
        system: true,
        ...config,
      };

      // @ts-expect-error
      this.createNotification(notification);
    },

    createSystemNotificationInfo(config: any) {
      const notification = {
        variant: "info",
        system: true,
        ...config,
      };

      // @ts-expect-error
      this.createNotification(notification);
    },

    createSystemNotificationWarning(config: any) {
      const notification = {
        variant: "warning",
        system: true,
        ...config,
      };

      // @ts-expect-error
      this.createNotification(notification);
    },

    createSystemNotificationError(config: any) {
      const notification = {
        variant: "error",
        system: true,
        ...config,
      };

      // @ts-expect-error
      this.createNotification(notification);
    },

    createSystemNotification(config: any) {
      const notification = { system: true, ...config };

      // @ts-expect-error
      this.createNotification(notification);
    },
  },
});
