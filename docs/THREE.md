# Relay Engine 002

An original industrial mechanism that illustrates the product: keep seven completed blocks, transfer the checkpoint to a specialist, and recover the remaining three. The model is real editable geometry with PBR materials, named components, and an exported animation.

## Files

| File | Purpose |
| --- | --- |
| dist/relay-model.js | Original geometry and material definitions shared by the live scene and GLB export |
| dist/relay-scene.js | Three.js lighting, camera, animation, interaction, fallback, and lifecycle |
| dist/relay-hero.js | Accessible hero markup and controls |
| dist/three.css | Responsive hero layout and styling |
| dist/assets/relay-engine.glb | Editable model with an eight-second transfer clip |
| scripts/export-model.mjs | Node-based official GLTFExporter pipeline |
| scripts/render-model-cpu.py | Optional CPU path-traced studio render of the exported GLB |
| docs/model-validation.json | Khronos glTF Validator result |

## Editing

Serve dist/ as a static site. All browser dependencies are vendored; no build step or npm package installation is required. Edit createRelayModel() and run `npm run export:model` to regenerate the downloadable asset. The live scene builds the same geometry directly and does not download the GLB. Changing the model also requires regenerating the matching poster.

The optional poster recipe uses Python with mitsuba 3.9.1, trimesh 5.2.0, and numpy. Run `python scripts/render-model-cpu.py`, then convert docs/model-studio-preview.png to the production WebP. This is an offline asset render; it does not cover browser WebGL rendering.

## Interactions

The landing loads Three.js lazily. A 15.5-second illustration loops through Capture, Match, Resume, and Verify. The cartridge moves along rails; three data blocks turn green as work is recovered. Stage buttons select a paused state, Play/Pause controls the loop, and Inspect separates the assembly. Drag horizontally or use arrow keys to rotate; Home resets the view. Hover uses damped motion without intercepting wheel scrolling.

Reduced motion starts paused and disables ambient hover/scroll movement. Rendering pauses when the scene is offscreen or the document is hidden. The device pixel ratio and model detail are capped on narrow layouts. Route changes disconnect observers and pointer handlers, cancel frames and timers, and dispose GPU resources. WebGL 2 failure or context loss shows the matching studio poster and retains recovery stage/playback controls; 3D inspection is disabled.

## Verification boundary

The cloud review browser has no usable WebGL 2 context. Therefore the live GPU lighting, drag response, and exploded inspection could not be visually verified here. The exact GLB was independently imported and rendered on the CPU, its geometry and materials were visually inspected, and the glTF validator reported zero errors and warnings. The unused-UV informational category was excluded from the report; no warnings/errors were excluded.

Desktop and narrow-screen layout, static fallback, stage synchronization, timed fallback playback, pause, console navigation, modal opening, and landing re-entry were checked in the browser. The automated browser download event timed out; the original GLB file itself is present and validated. Check the live canvas on a WebGL 2-capable device before a public launch.
