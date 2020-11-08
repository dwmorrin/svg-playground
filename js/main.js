/* global Debug Graphics KB Mouse SVG Zoom */

const width = window.innerWidth;
const height = window.innerHeight;
Graphics.draw(Graphics.labeledLines({ width, height }));
Graphics.draw(
  Graphics.dashedRectangle({
    x: width / 4,
    y: height / 4,
    width: width / 2,
    height: height / 2,
  })
);
Graphics.draw(Graphics.centeredCircle({ width, height }));
debugSvg();

KB.setTransitions({
  keydown: {
    ArrowLeft: () =>
      Zoom.pan(Graphics.getSvg(), { movementX: "20%", movementY: 0 }),
    ArrowRight: () =>
      Zoom.pan(Graphics.getSvg(), { movementX: "-20%", movementY: 0 }),
    ArrowUp: () =>
      Zoom.pan(Graphics.getSvg(), { movementX: 0, movementY: "20%" }),
    ArrowDown: () =>
      Zoom.pan(Graphics.getSvg(), { movementX: 0, movementY: "-20%" }),
    z: () => Zoom.into(Graphics.getSvg()),
    x: () => Zoom.out(Graphics.getSvg()),
    after: debugSvg,
  },
});

Mouse.setTransitions({
  onClick: {
    single: {
      left: onClick,
      right: onClick,
    },
    double: {
      left: mouseZoomInto,
      right: mouseZoomOut,
    },
  },
  onDrag: mouseDrag,
  onMove: ({ event }) => mouseDebug(event),
  onWheel: wheelZoom,
});

//--------------------------------------------------

function debugSvg() {
  Debug.show({
    viewBox: Graphics.getSvg().getAttribute("viewBox"),
  });
}

function markMouseClick(event) {
  Graphics.draw(Graphics.fade(Graphics.x(mouseXY(event))));
}

function mouseDebug({ clientX, clientY, movementX, movementY }) {
  const { x, y } = SVG.clientToSVG(Graphics.getSvg(), { clientX, clientY });
  Debug.show({ clientX, clientY, x, y, movementX, movementY });
}

function mouseDrag(mouseEvent) {
  if (mouseEvent.event.shiftKey) mouseDraw(mouseEvent);
  else mousePan(mouseEvent);
}

function mouseDraw({ event }) {
  const { x: cx, y: cy } = mouseXY(event);
  Graphics.draw(Graphics.circle({ cx, cy, r: 3 }));
}

function mousePan({
  event: { clientX, clientY, movementX, movementY },
  setState,
}) {
  Zoom.pan(Graphics.getSvg(), { movementX, movementY });
  setState({ dragging: true });
  mouseDebug({ clientX, clientY, movementX, movementY });
}

function mouseXY(event) {
  return SVG.clientToSVG(Graphics.getSvg(), event);
}

function mouseZoomInto({ event, state }) {
  Zoom.into(Graphics.getSvg(), event);
  onClick({ event, state });
}

function mouseZoomOut({ event, state }) {
  Zoom.out(Graphics.getSvg(), event);
  onClick({ event, state });
}

function onClick({ event, state }) {
  markMouseClick(event);
  Debug.show(state);
  mouseDebug(event);
  debugSvg();
}

function wheelZoom({ event, state }) {
  if (state.wheel > 0) Zoom.out(Graphics.getSvg(), event);
  else if (state.wheel < 0) Zoom.into(Graphics.getSvg(), event);
  onClick({ event, state });
}
