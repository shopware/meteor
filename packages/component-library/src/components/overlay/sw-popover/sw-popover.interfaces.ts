import type { TranslateResult } from "vue-i18n";

export interface View {
  name: string | TranslateResult;
  title?: string | TranslateResult;
  childViews?: View[];
}
