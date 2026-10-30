import { ref } from "vue";
import { createAppRegions } from "./createAppRegions";

describe("createAppRegions", () => {
  it("hides a region while any request hides it", () => {
    // ARRANGE
    const { hidden, registerRegions } = createAppRegions();
    const releaseFirst = registerRegions(() => ({ header: false }));
    const releaseSecond = registerRegions(() => ({ header: false, sidebar: false }));

    // ACT
    releaseSecond();

    // ASSERT
    expect(hidden.value).toEqual({
      header: true,
      navigation: false,
      sidebar: false,
      contentFrame: false,
    });

    // ACT
    releaseFirst();

    // ASSERT
    expect(hidden.value.header).toBe(false);
  });

  it("follows a request that changes", () => {
    // ARRANGE
    const fullscreen = ref(false);
    const { hidden, registerRegions } = createAppRegions();
    registerRegions(() => ({ navigation: !fullscreen.value }));

    // ACT
    fullscreen.value = true;

    // ASSERT
    expect(hidden.value.navigation).toBe(true);
  });
});
