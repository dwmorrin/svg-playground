/* global HTML */
/* exported Debug */
const Debug = (function () {
  const showing = {};

  document.body.appendChild(
    HTML.createElement("div", {
      class: "debug",
      child: HTML.createElement("pre"),
    })
  );

  return { remove, show };

  function remove(key) {
    delete showing[key];
    _show();
  }

  function show(anything) {
    Object.assign(showing, anything);
    _show();
  }

  function _show() {
    document.querySelector(".debug pre").innerHTML = JSON.stringify(
      showing,
      null,
      2
    );
  }
})();
