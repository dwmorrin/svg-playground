/* global SVG */
/* exported Zoom */
const Zoom = (function () {
  let zoomOutFactor = 2;
  let zoomInFactor = 1 / zoomOutFactor;

  return { into, out, pan, setZoomFactor };

  function into(svg, event = {}) {
    _zoom("in", svg, event);
  }

  function out(svg, event = {}) {
    _zoom("out", svg, event);
  }

  function _zoom(direction, svg, { clientX, clientY }) {
    const z = direction === "out" ? zoomOutFactor : zoomInFactor;
    if (clientX === undefined) clientX = window.innerWidth / 2;
    if (clientY === undefined) clientY = window.innerHeight / 2;
    const { x, y, width, height } = getViewBox(svg);
    const target = SVG.clientToSVG(svg, { clientX, clientY });
    setViewBox(svg, {
      x: newOrigin(target.x, z, x),
      y: newOrigin(target.y, z, y),
      width: width * z,
      height: height * z,
    });
  }

  /**
   * Formula to zoom while keeping an arbitrary point constant.
   * This calculates the new value for the first two SVG viewBox values.
   * @param {number} constant keeps this point in the same window coordinate
   * @param {number} zoomFactor >1 for "out" effect, <1 for "in" effect
   * @param {number} oldOrigin current origin value
   */
  function newOrigin(constant, zoomFactor, oldOrigin) {
    return constant + zoomFactor * (oldOrigin - constant);
  }

  function pan(svg, { movementX, movementY }) {
    const { x, y, width, height } = getViewBox(svg);
    movementX = parsePanMove(movementX, width);
    movementY = parsePanMove(movementY, height);
    setViewBox(svg, {
      x: x - movementX,
      y: y - movementY,
      width,
      height,
    });
  }

  /**
   * Allows panning to use "%" character to define a proportional movement
   * @param {Number|String} value
   * @param {Number} dimension either width or height when "%" option is used
   */
  function parsePanMove(value, dimension) {
    if (typeof value === "number") return value;
    if (typeof value !== "string") throw `illegal pan command: ${value}`;
    value = value.trim();
    if (value.endsWith("%")) {
      return dimension * Number(value.slice(0, value.length - 1)) * 0.01;
    }
    return Number(value);
  }

  function getViewBox(svg) {
    const viewBox = svg.getAttribute("viewBox").split(",").map(Number);
    return {
      x: viewBox[0],
      y: viewBox[1],
      width: viewBox[2],
      height: viewBox[3],
    };
  }

  function setViewBox(svg, { x, y, width, height }) {
    svg.setAttribute("viewBox", [x, y, width, height]);
  }

  function setZoomFactor(z) {
    if (typeof z !== "number" || z <= 1)
      throw `illegal value for setZoomFactor: ${z}`;
    zoomOutFactor = z;
    zoomInFactor = 1 / z;
  }
})();
