import { render } from "@testing-library/vue";
import TemplateRootComment from "../../utils/template-root-comment.vue";

describe("template comments", () => {
  it("are dropped at compile time, so a comment above the root element keeps a single root", () => {
    // ACT
    const { container } = render(TemplateRootComment);

    // ASSERT
    expect(container.childNodes).toHaveLength(1);
    expect(container).toHaveTextContent("Single root");
  });
});
