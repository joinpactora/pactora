# Verification record

October 24, 2026 · Managed Sites preview, Chrome cloud browser

- JavaScript module syntax checks passed.
- Landing page visually inspected on desktop and in a 390px and 320px responsive frame.
- Decorative overflow corrected for narrow viewports; console tables scroll inside their container.
- Four-step landing walkthrough changes panels and reports the selected tab.
- FAQ expands with the expected founder description.
- Invalid/empty JSON is rejected with a visible error.
- Sample package creation progresses through import, budget, and review.
- A 9 USDC live cap allowed the Patch 6.40 + 0.32 fee recovery.
- The recovery completed, the output was accepted, and a live receipt was produced.
- The exported receipt parsed successfully: total_usdc=6.72.
- A separate 2 USDC cap disabled starting a recovery whose lowest total was 6.72.
- Job search no-match state and provider skill filtering worked.
- Provider save action worked.
- Workspace name and default budget persisted after reload.
- A live reset restored the original samples after QA.
- Token page inspected: proposed ticker, no deployment, no fabricated contract address or trading link.

This record covers the frontend. The token was not launched in this pass.


## Three.js upgrade · October 24, 2026

- Syntax checks include the new hero, model, scene, and exporter modules.
- The animated GLB was exported successfully: 3,255,780 bytes, 266 meshes, 158,148 triangles.
- Khronos glTF Validator reported zero errors and zero warnings; unused-UV informational messages were excluded. Report: model-validation.json.
- The exact GLB was imported with trimesh and path-traced with Mitsuba. Geometry and PBR material render were visually inspected; the matching delivery poster is 116,684 bytes.
- Desktop fallback layout and responsive frames at nominal 390px and 320px were inspected. Client/scroll widths matched at 375/375 and 305/305 (native scrollbar accounted for).
- Selecting Verify shows 100, Checks passed, and the matching product tab. Playback reaches the same final state. Pause returns the Play control and stops scheduled progression.
- Console navigation, New recovery dialog, dialog dismissal, and return to landing worked. No job data was changed during this upgrade check.
- Screenshots in this directory show the static fallback, not a live GPU-rendered canvas.
- The browser download-event automation timed out; direct model file existence, GLB parsing, and validation were verified separately.

The review browser cannot create a WebGL 2 context, so live browser rendering, orbit motion, and exploded assembly were not visually confirmed. The implementation and exact exported geometry are included for a WebGL-capable device check. This limitation does not affect the independently rendered poster or browser-local console.


## Recovery workshop redesign · October 24, 2026 · v0.3

- The complete marketing page now covers an original 3D specialist, recovery comparison, four-stage workshop, three workspace previews, specialist matching, architecture, integration examples, bounded use cases, milestones, community launch preparation, FAQ, and resource footer.
- JavaScript syntax checks passed for all application, model, scene, interaction, and export modules.
- The original Patch GLB exported successfully: 2,441,076 bytes, 154 meshes, 87,252 triangles. Khronos glTF Validator reported zero errors and zero warnings; unused-UV informational messages were excluded. Report: patch-validation.json.
- All four exact-geometry poses were imported and CPU path-traced. RGBA PNG and WebP outputs preserve transparent backgrounds; no stock/generated face image is used.
- Desktop hero, workspace and receipt layouts were inspected in the managed preview. The comparison reports 100 assigned units for restart and 30 for checkpoint recovery.
- Workspace preview tabs change panels and selected state. Arrow-key navigation changes the selected preview tab.
- Selecting Verify synchronizes the workshop, character poster, status and 100-unit progress. Timed handoff playback reaches stage 3 and returns to the Play control.
- Python/TypeScript/JSON examples change content and filename. The live-status FAQ expands with the expected answer.
- Console navigation, New recovery dialog, dismissal, and landing re-entry worked. Existing job data was preserved.
- Responsive frames at nominal 390px, 320px and 768px had matching client/scroll widths: 375/375, 305/305, and 753/753. The 320px headline was corrected to fit within the content width. Mobile decorative callouts were simplified to keep the robot face clear.
- Mobile navigation expands, navigates to the workspace section, and resets aria-expanded when closing. Native accessibility-index actions were used for nested-frame interaction after the frame locator did not activate the intended control.
- A direct section-link reload exposed a pre-existing empty-root route condition. The initial router now renders the landing before resolving section hashes; #workspace reload was verified.
- Component arrow/Home navigation preserves modified browser shortcuts such as Ctrl+Home.
- Backend, wallet, settlement, token launch and real agent execution remain outside this frontend release.

The review browser has no usable WebGL 2 context. The live GPU lighting, pointer damping, and 3D articulation were not visually verified here. The exported geometry and materials were independently rendered and validated; browser checks used the faithful four-pose fallback. A WebGL-capable device check remains necessary before public launch.
