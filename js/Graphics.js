/* global SVG */
/* exported Graphics */
const Graphics = (function () {
  const svg = SVG.createElement("svg", {
    viewBox: [0, 0, window.innerWidth, window.innerHeight],
  });
  document.body.appendChild(svg);

  return {
    centeredCircle,
    circle,
    dashedRectangle,
    draw,
    fade,
    getSvg,
    labeledLines,
    x,
  };

  function getSvg() {
    return svg;
  }

  function draw(element) {
    svg.appendChild(element);
    return element;
  }

  //---- predefined routines ----

  /**
   * main routine, draws labeled Graphics
   */
  function labeledLines({ width, height }) {
    const Graphics = SVG.createElement("g");
    range(height).forEach((heightTick) => {
      if (heightTick % 100 !== 0) return;
      Graphics.appendChild(
        SVG.createElement("line", {
          x1: 0,
          x2: width,
          y1: heightTick,
          y2: heightTick,
          stroke: "black",
        })
      );
      range(width).forEach((widthTick) => {
        if (widthTick % 100 !== 0) return;
        Graphics.appendChild(
          SVG.createElement("text", {
            x: widthTick,
            y: heightTick,
            ["font-size"]: 10,
            innerHTML: `${widthTick},${heightTick}`,
          })
        );
      });
    });
    range(width).forEach((widthTick) => {
      if (widthTick % 100 !== 0) return;
      Graphics.appendChild(
        SVG.createElement("line", {
          x1: widthTick,
          x2: widthTick,
          y1: 0,
          y2: height,
          stroke: "black",
        })
      );
    });
    // draw(centeredCircle(width, height));
    return Graphics;
  }

  //---- effects ----

  function fade(element) {
    let opacity = 1;
    const fadeOut = () => {
      opacity *= 0.95;
      element.setAttribute("opacity", opacity);
      if (opacity > 0.05) window.requestAnimationFrame(fadeOut);
      else element.remove();
    };
    window.requestAnimationFrame(fadeOut);
    return element;
  }

  //---- predefined elements ----

  function centeredCircle({ width, height }) {
    return SVG.createElement("circle", {
      cx: width / 2,
      cy: height / 2,
      r: 5,
      stroke: "red",
      fill: "none",
    });
  }

  function circle({ cx = 0, cy = 0, r = 10, fill = "black" }) {
    return SVG.createElement("circle", {
      cx,
      cy,
      r,
      fill,
      stroke: "none",
    });
  }

  function dashedRectangle({ x = 0, y = 0, width, height }) {
    return SVG.createElement("rect", {
      x,
      y,
      width,
      height,
      stroke: "black",
      fill: "none",
      ["stroke-dasharray"]: 4,
    });
  }

  function x({ x = 0, y = 0, width = 20, height = 20 }) {
    return SVG.createElement("g", {
      children: [
        SVG.createElement("line", {
          x1: x - width / 2,
          x2: x + width / 2,
          y1: y + height / 2,
          y2: y - height / 2,
          stroke: "black",
        }),
        SVG.createElement("line", {
          x1: x - width / 2,
          x2: x + width / 2,
          y1: y - height / 2,
          y2: y + height / 2,
          stroke: "black",
        }),
      ],
    });
  }

  //---- utilities ----
  function range(length) {
    return Array.from({ length }).map((_, i) => i);
  }
})();
