import "nuxt/schema";

declare module "nuxt/schema" {
  interface PublicRuntimeConfig {
    i18n?: {
      defaultLocale?: string;
    };
  }
}

export {};
