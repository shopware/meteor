import { ref } from "vue";
import { useAppRegions } from "./useAppRegions";

describe("useAppRegions", () => {
  it("hides a region while any request hides it", () => {
    // ARRANGE
    const { hidden, requestRegions } = useAppRegions();
    const releaseFirst = requestRegions(() => ({ header: false }));
    const releaseSecond = requestRegions(() => ({ header: false, sidebar: false }));

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
    const { hidden, requestRegions } = useAppRegions();
    requestRegions(() => ({ navigation: !fullscreen.value }));

    // ACT
    fullscreen.value = true;

    // ASSERT
    expect(hidden.value.navigation).toBe(true);
  });
});
