# SVG Playground

This is a simple web app for interacting with SVG,
primarily intended to be for my own reference when incorporating interactive SVG into other apps.

One goal of this playground was to declaratively state all the event handlers, as seen in [`main.js`](js/main.js).

Another goal was to have a decent [SVG pan and zoom system](js/Zoom.js), in plain JavaScript, for reference.
The system here is in a functional style (to keep it decoupled) and is shown working with both keyboard
and mouse inputs.

Since this is a development playground, there is a [debug window](js/Debug.js) that displays useful info
about the SVG
and mouse events.

## Usage

Open [`index.html`](index.html) in a browser. Clicking should produce a brief "X" mark, double clicking zooms
(left for zoom in, right for zoom out). Click and drag causes panning. Dragging with the shift key
produces a trail of circles. Arrow keys pan, z and x keys zoom in and out, respectively.
