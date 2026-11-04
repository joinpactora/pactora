# Patch / recovery workshop release 0.3

Patch is an original articulated Three.js character. It represents the specialist that receives a checkpoint, recovers the unfinished units, and presents the verified result. The page illustrates the product; it does not claim real job execution or production settlement.

## Source map

| File | Purpose |
| --- | --- |
| dist/landing.js | Full marketing page, shared header/footer, recovery walkthrough |
| dist/specialist-hero.js | Hero, character controls, and illustrative recovery status |
| dist/specialist-model.js | Original geometry, materials, articulation, and animation export |
| dist/specialist-scene.js | Real-time camera, lighting, damped interaction, recovery animation, and fallback |
| dist/workspace-preview.js | Recovery, specialist, and receipt preview views |
| dist/marketing-interactions.js | Preview tabs, comparison, keyboard support, reveals, scroll progress, cleanup |
| dist/marketing.css | Responsive presentation system and readability adjustments |
| scripts/export-specialist.mjs | Model and render-pose exports |
| scripts/render-specialist.py | Transparent RGBA studio rendering |
| docs/patch-validation.json | Khronos glTF Validator output |

## Character pipeline

`npm run export:specialist` writes the editable animated GLB to dist/assets/ and temporary static pose GLBs to model/poses/. The pose cache is intentionally excluded from Git and the source ZIP. Run the exporter before regenerating posters.

The optional renderer accepts `stage samples size output` arguments. For example, `python scripts/render-specialist.py 2` uses stage 2, 128 samples, 1100 square pixels, and writes docs/patch-pose-2.png. Dependencies: Mitsuba 3.9.1, trimesh 5.2.0, and numpy. The rendered film preserves RGBA with a transparent background. The website supplies the contact shadow. Convert PNG to WebP without dropping alpha.

The GLB stores an eight-second editable head/cartridge animation. The live scene additionally poses the articulated arms, blinks, damps pointer movement, and changes the last three data blocks according to recovery progress. A 15-second recovery illustration loops on capable browsers unless paused. Manual stage selection pauses the sequence. Arrow keys rotate; Home resets the camera orbit. Reduced motion starts paused and disables ambient pointer tracking.

## Runtime boundaries

Three.js loads only on the landing page. Device pixel ratio and geometry detail are capped on small screens. Observers stop rendering offscreen and when the document is hidden. Route changes cancel animation/timers, remove handlers, disconnect observers, and dispose GPU resources. If WebGL 2 cannot initialize or its context is lost, the four exact-geometry posters retain stage selection and timed playback.

The source contains no copied robot model, stock face texture, analytics tracker, third-party runtime model request, fabricated funding claim, testimonial, partner logo, or live customer statistic.

## Verification limit

The review browser cannot create a WebGL 2 context, so live GPU appearance and pointer motion could not be visually verified. The exact exported model was validated and independently rendered on the CPU. Browser QA covers the fallback, page interactions, routes, and responsive layout. A WebGL-capable device check remains necessary before a public launch.


## Release 0.4
Native scroll now scrubs a reversible four-chapter recovery with articulated walking, checkpoint lifting, cartridge opening, repair, and receipt presentation. Camera movement is deterministic. Reduced motion uses still chapter poses. A 48-frame exact-geometry sequence supports browsers without WebGL. The animated download is patch-scroll-recovery.glb (22 seconds, 118 tracks). Both GLBs validate with zero errors and warnings. Motion checks cover reversibility, finite transforms, camera continuity and responsive framing. Desktop sequence and chapter navigation were visually checked. Live WebGL remains unavailable in the review browser; mobile visual review remains incomplete.
