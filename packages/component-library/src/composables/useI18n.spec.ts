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

  it("translates the singular version", () => {
    render({
      setup() {
        const { t } = useI18n({
          messages: { en: { apple: "apple | apples" } },
        });

        return { t };
      },
      template: "{{ t('apple', { n: 1 }) }}",
    });

    expect(screen.getByText("apple")).toBeInTheDocument();
  });

  it("translates the pluralized version", () => {
    render({
      setup() {
        const { t } = useI18n({
          messages: { en: { apple: "apple | apples" } },
        });

        return { t };
      },
      template: "{{ t('apple', { n: 2 }) }}",
    });

    expect(screen.getByText("apples")).toBeInTheDocument;
  });

  it("translates the 'none' version", () => {
    render({
      setup() {
        const { t } = useI18n({
          messages: { en: { apple: "no apple | apple | apples" } },
        });

        return { t };
      },
      template: "{{ t('apple', { n: 0 }) }}",
    });

    expect(screen.getByText("no apple")).toBeInTheDocument();
  });

  it("translates the pluralized version with custom values", () => {
    render({
      setup() {
        const { t } = useI18n({
          messages: { en: { apple: "no apple | apple | {n} apples" } },
        });

        return { t };
      },
      template: "{{ t('apple', { n: 3 }) }}",
    });

    expect(screen.getByText("3 apples")).toBeInTheDocument();
  });
});
