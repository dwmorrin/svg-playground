/* exported HTML */
const HTML = (function () {
  return {
    createElement,
    modal,
    setTopAndLeftToClick,
    setHidden,
    setVisible,
  };

  function createElement(name, attrs) {
    const el = document.createElement(name);
    for (const key in attrs) {
      if (key === "class") el.classList.add(...attrs[key].split(/\s+/));
      else if (key === "child") el.appendChild(attrs[key]);
      else if (key === "children")
        attrs[key].forEach((child) => el.appendChild(child));
      else if (key === "innerHTML") el.innerHTML = attrs[key];
      else if (key === "textContent") el.textContent = attrs[key];
      else if (key === "onClick") el.addEventListener("click", attrs[key]);
      else if (key === "selected") {
        // only create attribute if true
        attrs[key] && el.setAttribute(key, attrs[key]);
      } else el.setAttribute(key, attrs[key]);
    }
    return el;
  }

  function modal({
    child = null,
    innerHTML = "",
    onClose = () => {
      return;
    },
    onOk = null,
    okText = "Ok",
  }) {
    const div = createElement("div", { class: "modal" });
    if (innerHTML) div.innerHTML = innerHTML;
    if (child) div.appendChild(child);
    const closeButton = createElement("button", {
      textContent: "Close",
      onClick: () => {
        onClose();
        div.remove();
      },
    });
    if (typeof onOk === "function") {
      const okButton = createElement("button", {
        textContent: okText,
        onClick: () => {
          onOk();
          div.remove();
        },
      });
      div.appendChild(okButton);
    }
    div.appendChild(closeButton);
    return div;
  }

  /**
   * Styles an element to be positioned at the mouse click, bounded by the
   * right and bottom edges of the window.
   *? Requires element to have position: absolute already set with CSS.
   *! You must attach the element to the DOM prior to calling this function
   *! or else the bounding rect properties will be all zeros.
   * @returns {void}
   */
  function setTopAndLeftToClick(htmlElement, { clientX, clientY }) {
    const rect = htmlElement.getBoundingClientRect();
    const maxY = window.innerHeight - rect.height;
    const maxX = window.innerWidth - rect.width;
    htmlElement.style.top = (clientY < maxY ? clientY : maxY) + "px";
    htmlElement.style.left = (clientX < maxX ? clientX : maxX) + "px";
  }

  function setHidden(...htmlElements) {
    htmlElements.forEach((element) => {
      element.style.display = "none";
    });
  }

  function setVisible(...htmlElements) {
    htmlElements.forEach((element) => {
      element.style.display = "block";
    });
  }
})();
