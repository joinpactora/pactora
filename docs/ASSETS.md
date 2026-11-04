# Asset provenance

## Logo

`dist/assets/mark.svg` and the inline matching mark in `dist/ui.js` are original code-native vectors: paired arrows and a handoff stroke, safety orange and white. No third-party marks are used.

## Original 3D hero

`dist/relay-model.js` is original, editable procedural geometry: twin cast-polymer gates, layered plinths, rails, glass data cartridge, machined fittings, fasteners, rotary encoders, LEDs, cooling fins, and cables. Seven blocks represent preserved progress; three represent remaining work.

`dist/assets/relay-engine.glb` is exported directly from that geometry by `scripts/export-model.mjs`. It includes named components, physically based materials, and an eight-second `Checkpoint_recovery` animation. It is 3,255,780 bytes, with 266 meshes and 158,148 triangles.

`docs/model-studio-preview.png` is a CPU path-traced render of the exact GLB using Mitsuba 3.9.1 and trimesh 5.2.0. `dist/assets/relay-engine-poster.webp` is its delivery conversion. It is the loading and WebGL fallback poster. Render recipe: `scripts/render-model-cpu.py`. No generated image is used as model geometry.

Three.js 0.180.0 and its RoundedBoxGeometry, RoomEnvironment, and GLTFExporter are vendored from the official npm distribution. Addon imports point to the local module. MIT license: `dist/vendor/LICENSE-three.txt`. The production runtime uses same-origin requests.

## Previous hero artwork (retained source)

Final project asset: `dist/assets/relay-engine.webp`.

Generated with the built-in image generation tool, then converted to WebP for delivery. The uncompressed source remains in the task's generated-image output. No reference artwork was copied.

Prompt:

> Use case: stylized-concept. Asset type: premium website hero illustration for RelayWorks, a software service that rescues partially completed AI tasks. Create an exceptionally art-directed tactile industrial 3D still life, landscape 3:2 format. Scene: a warm ivory studio floor and seamless background (#f5f4ef), soft large shadows. Centerpiece is a bold sculptural orange tubular relay mechanism, two incomplete curved loops weaving past each other to form a continuous passage, with precision machined matte orange polymer and a few dark charcoal metal joints. A single translucent frosted-glass rectangular data cartridge is suspended within the loops; its inner six small blocks show four charcoal completed blocks and two orange blocks being transferred. Small cream architectural stepping platforms under the mechanism, an orange cable entering one side, pale gray cable leaving the other. Three-quarter isometric product photography, strong composition, object fills central 80%, slight film grain, almost physical design museum photography with playful editorial charm, rich orange and deep charcoal against ivory. Soft daylight from upper left, realistic ambient occlusion, very high design quality. This is metaphorical product artwork, not a diagram. No text, no lettering, no numbers, no logos, no watermark, no people, no robots, no purple, no blue gradients, no neon, no glow, no stock sci-fi background. All objects fully inside frame with ample margin.

## Typography

DM Sans Regular and Bold self-hosted from the Google Fonts distribution. Font files are packaged locally to avoid external requests. License: SIL Open Font License 1.1. See `dist/assets/OFL.txt`.

## Patch / original recovery specialist

Release 0.3 adds `dist/specialist-model.js`: a new, original character with a ceramic head shell, a smoked face display, geometric illuminated eyes and smile, an antenna, machined ear fittings, a cast orange body, the RelayWorks handoff mark, jointed arms and fingers, stability boots, a service deck, and a ten-unit glass checkpoint cartridge. Neither the Emo project’s geometry or face texture nor the Robot Playground model/code was copied.

`dist/assets/patch-specialist.glb` is exported directly from that geometry. It is 2,441,076 bytes, with 154 meshes and 87,252 triangles, named components, PBR materials, and an eight-second head/cartridge animation. `scripts/export-specialist.mjs` also generates the four render poses in an ignored local cache.

`docs/patch-pose-0.png` through `patch-pose-3.png` are transparent CPU path-traced RGBA renders of the exact exported pose geometry, using Mitsuba 3.9.1 and trimesh 5.2.0. Their corresponding WebP assets preserve alpha. The fallback changes pose with the recovery stage; the live version uses the same geometry directly. No generated bitmap or stock image is used to create Patch.

The hero, workshop and diagrams are code-native. Fonts, Three.js and all runtime assets are self-hosted. Original relay-engine assets remain packaged for continuity with the previous release.
