import { render, screen } from "@testing-library/vue";
import { useI18n } from "./useI18n";

describe("useI18n", () => {
  it("returns the translation for the given path", () => {
    render({
      setup() {
        const { t } = useI18n({
          messages: { en: { greeting: "Hello!" } },
        });

        return { t };
      },
      template: "{{ t('greeting') }}",
    });

    expect(screen.getByText("Hello!")).toBeInTheDocument();
  });

  it("returns the path to the translation if no translation is found", () => {
    render({
      setup() {
        const { t } = useI18n({
          messages: { en: { greeting: "Hello!" } },
        });

        return { t };
      },
      template: "{{ t('path.to.translation') }}",
    });

    expect(screen.getByText("path.to.translation")).toBeInTheDocument();
  });

  it("translates the snippet with custom values", () => {
    render({
      setup() {
        const { t } = useI18n({
          messages: { en: { greeting: "Hello, {name}!" } },
        });

        return { t };
      },
      template: "{{ t('greeting', { name: 'World' }) }}",
    });

    expect(screen.getByText("Hello, World!")).toBeInTheDocument();
  });

  it("keeps the custom value syntax when no custom value is provided", () => {
    render({
      setup() {
        const { t } = useI18n({
          messages: { en: { greeting: "Hello, {name}!" } },
        });

        return { t };
      },
      template: "{{ t('greeting') }}",
    });

    expect(screen.getByText("Hello, {name}!")).toBeInTheDocument();
  });
});
