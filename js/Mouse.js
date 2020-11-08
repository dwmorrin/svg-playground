/* global deepmerge */
/* exported Mouse */
const Mouse = (function () {
  const buttons = { left: 0, right: 2 };
  const wait = { doubleClick: 250, drag: 75, wheel: 125 };
  const state = {
    down: false,
    dragTimeoutId: 0,
    dragging: false,
    singleClickTimeoutId: 0,
    wheel: 0,
    wheelTimeoutId: 0,
  };

  let transitions = {
    onClick: {
      single: {
        left: () => undefined,
        right: () => undefined,
      },
      double: {
        left: () => undefined,
        right: () => undefined,
      },
    },
    onDrag: () => undefined,
    onMove: () => undefined,
    onUp: () => undefined,
    onWheel: () => undefined,
  };

  window.addEventListener("mousemove", (event) => {
    if (state.down) transitions.onDrag({ event, state, setState });
    else transitions.onMove({ event, state, setState });
  });

  window.addEventListener("mousedown", () => {
    state.dragTimeoutId = window.setTimeout(() => {
      state.dragTimeoutId = 0;
      state.down = true;
    }, wait.drag);
  });

  // re-creates logic to detect "click" and "double click" events
  window.addEventListener("mouseup", (event) => {
    if (state.dragTimeoutId) {
      window.clearTimeout(state.dragTimeoutId);
      state.dragTimeoutId = 0;
    }
    state.down = false;
    if (state.dragging) {
      state.dragging = false;
      return;
    }
    transitions.onUp(event);
    if (state.singleClickTimeoutId) {
      window.clearTimeout(state.singleClickTimeoutId);
      state.singleClickTimeoutId = 0;
      if (event.button === buttons.left) {
        transitions.onClick.double.left({ event, state, setState });
      }
      if (event.button === buttons.right) {
        transitions.onClick.double.right({ event, state, setState });
      }
    } else {
      state.singleClickTimeoutId = window.setTimeout(() => {
        state.singleClickTimeoutId = 0;
        if (event.button === buttons.left) {
          transitions.onClick.single.left({ event, state, setState });
        }
        if (event.button === buttons.right) {
          transitions.onClick.single.right({ event, state, setState });
        }
      }, wait.doubleClick);
    }
  });

  window.addEventListener("wheel", (event) => {
    state.wheel = event.deltaY;
    if (state.wheelTimeoutId) return;
    window.setTimeout(() => {
      state.wheelTimeoutId = 0;
      transitions.onWheel({ event, state, setState });
    }, wait.wheel);
  });

  window.addEventListener("contextmenu", (e) => e.preventDefault());

  return {
    withMouseState,
    setTransitions,
  };

  function withMouseState(cb = () => undefined, preventDefault = true) {
    return function (event) {
      if (preventDefault) event.preventDefault();
      cb({ event, state, setState });
    };
  }

  function setState(newState) {
    Object.assign(state, newState);
  }

  function setTransitions(newTransitions) {
    transitions = deepmerge(transitions, newTransitions);
  }
})();
