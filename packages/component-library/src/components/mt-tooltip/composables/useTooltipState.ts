import { reactive, ref } from "vue";

type GotOpenedBy = "hover" | "focus" | null;

type State = {
  isFocusingTrigger: boolean;
  isPressingTrigger: boolean;
  isHoveringTrigger: boolean;
  isHoveringTooltip: boolean;
  gotOpenedBy: GotOpenedBy;
};

export function useTooltipState() {
  const isVisible = ref(false);

  const state = reactive<State>({
    isFocusingTrigger: false,
    isPressingTrigger: false,
    isHoveringTrigger: false,
    isHoveringTooltip: false,
    gotOpenedBy: null,
  });

  function setState(newState: Partial<State>) {
    Object.assign(state, newState);
  }

  function show({ gotOpenedBy }: { gotOpenedBy: GotOpenedBy }) {
    if (!state.isFocusingTrigger && !state.isHoveringTrigger) return;
    if (state.isPressingTrigger) return;
    if (state.isFocusingTrigger && state.isHoveringTrigger && state.gotOpenedBy === "focus") return;

    isVisible.value = true;
    state.gotOpenedBy = gotOpenedBy;
  }

  function hide({ causedByKeyPress } = { causedByKeyPress: false }) {
    if (state.isFocusingTrigger && state.gotOpenedBy === "hover") {
      state.gotOpenedBy = null;
      isVisible.value = false;
      return;
    }

    if (isVisible.value && state.isPressingTrigger) {
      state.gotOpenedBy = null;
      isVisible.value = false;
      return;
    }

    if (state.isHoveringTrigger && state.isFocusingTrigger && causedByKeyPress) {
      state.gotOpenedBy = null;
      isVisible.value = false;
      return;
    }

    if (state.isFocusingTrigger && !causedByKeyPress) return;
    if (state.isHoveringTooltip || state.isHoveringTrigger) return;

    state.gotOpenedBy = null;
    isVisible.value = false;
  }

  return { isVisible, show, hide, setState };
}
