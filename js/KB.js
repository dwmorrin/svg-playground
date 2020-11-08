/* global deepmerge */
/* exported KB */
const KB = (function () {
  let transitions = {
    keydown: {
      after: () => undefined,
    },
  };

  window.addEventListener("keydown", (event) => {
    if (transitions.keydown[event.key]) transitions.keydown[event.key](event);
    transitions.keydown.after(event);
  });

  return { setTransitions };

  function setTransitions(newTransitions) {
    transitions = deepmerge(transitions, newTransitions);
  }
})();
