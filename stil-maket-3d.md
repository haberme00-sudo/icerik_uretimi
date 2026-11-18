<!-- 12. stil: 3D Maket. Kaynak: kullanıcının beğendiği bir Instagram reel'i (2026-11-18); yalnızca görsel dil alındı, orijinal metin, kompozisyon ve marka logosu kullanılmaz. Yer tutucular CLAUDE.md §0'a göre doldurulur. Örnek uygulama repoda: maket-3d-sahne.js, maket-3d-index.html, maket-3d-render.mjs. -->

# TASK

Create a premium animated explainer in a **3D Technical Mock-up** style: a quiet, realistic studio model of the subject, rendered in WebGL, filmed by a slow and deliberate camera, and annotated like a site engineer's briefing. Real-looking objects (metal, glass, rubber, concrete, plastic, fabric — whatever the topic is made of) sit on a seamless studio backdrop that is either deep night-navy or soft light grey. Above them, a two-line editorial headline (a small italic serif line, then a heavy geometric sans line) states the one idea of the moment; below them, a karaoke caption follows the narration and lights up key words in yellow. Small labelled pills with thin leader lines, numbered rings, motion streaks and a glowing yellow "path" diagram explain how the thing works. It must feel like a calm, credible engineering demonstration — a physical model you could almost touch — not a slideshow, not a cartoon, not a product ad.

# 1. PROJECT CONFIGURATION — EDIT SETTINGS ONLY HERE

**Topic:** {{KONU}}

- Storyboard: {{STORYBOARD}}
- Voiceover: {{SES}}
- Subtitles: {{ALTYAZI}}
- Duration without voiceover: 30 seconds
- Format: {{BICIM}}
- Frame rate: 30 fps
- Sound effects: {{EFEKT}}
- Background music: {{MUZIK}}
- Final video format: MP4 (out/final.mp4)

This is the only editable section and the single source of truth. The topic is free text, a sentence or a paragraph; every object, fact, label, number and scene must come from it or from the narration, never from examples elsewhere in this prompt. The same prompt must work for unrelated subjects. All on-screen text is in the language of the topic. If the topic names real products or companies, use their authentic logos and colours, never invented branding.

# 2. HOW TO WORK — CLAUDE CODE

You are running in Claude Code inside a project folder.

- **Build:** create the animation here as `index.html` (plus JS/CSS files if useful). Expose `window.seek(t)` (t in seconds) that draws the exact frame for time t deterministically: no dependence on requestAnimationFrame timing, `Date.now()` or unseeded `Math.random()`. Timing is proportional to the resolved duration, never hard-coded.
- **Render:** drive headless Chrome (Chrome DevTools Protocol, Puppeteer or Playwright; install what is missing), call `seek(i / fps)` for every frame, capture at the configured native resolution and encode with ffmpeg to `out/final.mp4` (H.264, yuv420p).
- **Voiceover enabled:** the recording is in this folder and its duration is the master clock. Get word-level timestamps with Whisper (mlx-whisper or openai-whisper; install if missing) and align each visual idea to the moment it is spoken. Mux the recording into the final MP4. Never invent narration or timestamps.
- **Voiceover disabled:** use the fixed duration and let the pictures, concise on-screen text and moving diagrams carry the explanation.
- **Sound effects enabled:** fetch CC0 sounds from Openverse, `https://api.openverse.org/v1/audio/?q=<search>&license=cc0` (no key needed). Keep them sparse and tied to meaningful moments, place them with ffmpeg at exact timestamps, list sources in `CREDITS.md`.
- **Background music enabled:** use only the music file the user placed in this folder, mixed well below the narration with ducking. Do not synthesize music.
- **Storyboard enabled:** first write a scene table (time, idea, composition, motion, on-screen text) and render PNG preview frames of the key scenes, then stop and ask for approval. Disabled: plan internally and deliver the finished video.

# 3. QUALITY STANDARD

- **An explanation, not a demo reel.** Decide what the viewer must understand, then make the graphics themselves explain it: objects that transform, diagrams that build, numbers that move. Decoration that teaches nothing is cut.
- **Connected storytelling.** Scenes grow out of each other; an element from one idea becomes the start of the next. It must never feel like a slideshow of separate cards.
- **Clear hierarchy.** One main idea per moment, one focal point, generous margins, text readable on a phone and held still long enough to read.
- **Smooth.** Easing on everything, no jitter, no popping, no frame where nothing is decided.

# 4. VERIFICATION

Render many frames as PNG across the whole timeline and look at them. Fix overflowing, overlapping, unreadable, empty or broken frames, and anything that looks generic rather than in this style, until you are proud of the result. Then render the final MP4 and report briefly what it shows.

---

# 5. VISUAL LANGUAGE AND PALETTE

The look has **two lighting moods** and the film alternates between them like an editor cutting between two studio setups. Never mix them inside one shot.

**Night studio (the "problem / forces / big picture" mood)**
- Backdrop: near-black navy, radial: centre `#141D2E`, mid `#0D1422`, edges `#070B14`. A faint cool haze band behind the object's horizon, `#1B2740` at 40 % opacity, so the object's silhouette separates from the background.
- Object light: one cool key light from upper left, a thin warm rim from behind-right; the object reads mostly as dark charcoal with crisp specular edges. Highlights `#C9D3E3`, metal mid-tones `#4A5263`, deepest shadows `#05070C`.
- Kicker (italic serif line): warm gold `#E2BE6A`.
- Headline (heavy sans): off-white `#F4F3EE`.
- Motion streaks (wind, air, heat, flow): white `#FFFFFF` at 35–70 % opacity, with a slight cyan tint at the head `#BFE6FF`.
- Force arrows: thin pale-blue-white `#DDEBFF`, glowing softly.

**Day studio (the "detail / how it's done / measurement" mood)**
- Backdrop: soft warm-grey cyclorama, vertical gradient top `#BFC1C0` → middle `#D8D9D6` → floor `#E6E6E2`, with a broad soft vignette (edges 12 % darker) and a very large, very soft floor shadow under the object.
- Object light: big soft overhead box light + fill; metals read silver `#B8BDC3` with white sheen `#F2F4F6`; dark parts `#2B2F36`.
- Kicker: deep navy `#1C2740` in italic serif.
- Headline: ink navy `#101A2E`.

**Shared accent system (both moods)**
- Signal yellow `#F3BC2E` (the single hero accent): karaoke highlight boxes, path diagrams, numbered rings, the most important pill. Text on yellow is `#141414`.
- Info blue `#2E8CEB` with white text: secondary callouts ("what to check").
- Ink pill `#18202E` with white text (on light backgrounds) for neutral labels.
- Alert red `#E2453F`: only for a single "this is the risk" marker per scene (a small ring with a dot, a short red leader line, a faint red label). Never as a background.
- Tag pill (top-left corner, always present): translucent white `rgba(255,255,255,0.88)` on light, `rgba(255,255,255,0.10)` with 1 px `rgba(255,255,255,0.18)` border on dark; tiny text, and a 6 px yellow dot before it.

Proportions per frame: ~80 % backdrop + object in neutrals, ~12 % text, ≤ 8 % accent colour. Yellow is precious: if more than three yellow things are on screen at once, remove one.

# 6. MATERIAL AND SURFACE

Everything is a **physical model under studio light**. The credibility comes from materials, not from complexity of geometry.

- **Metals:** `MeshPhysicalMaterial` with metalness 0.85–1.0, roughness 0.25–0.45, an environment map (see §9) so they catch long, soft reflections of a lightbox. Anodised/painted metal: metalness 0.3, roughness 0.5. Add a fine brushed or rolled texture via a procedurally generated roughness map (thin parallel noise stripes along the profile direction).
- **Glass / glossy dark surfaces** (screens, solar glass, windows): very dark base `#0A0D14`, roughness 0.05–0.12, clearcoat 1, so the env-map lightbox slides across them as the camera moves — that moving reflection is one of the most "real" cues and must be visible in at least one shot.
- **Repeating fine structure** (cells, grilles, fabric weave, tile joints, threads, perforations): never modelled one by one if it's tiny; use a procedural canvas texture (grid lines, cell pattern) mapped onto the surface, plus a matching normal/bump map so the light reacts to it.
- **Rubber / gaskets / plastics:** roughness 0.8–0.95, no metalness, slightly darker than they look in life.
- **Foam, insulation, concrete, wood cores** shown in a cut-away: matte, a soft procedurally-noised colour (e.g. foam `#E9DFA6` with subtle cells), slightly brighter than surrounding metal so the cut face reads.
- **Bevels everywhere.** Real objects have rounded edges that catch a highlight line. Use `RoundedBoxGeometry`, `ExtrudeGeometry` with `bevelEnabled`, or lathe profiles with small radius. Razor-sharp CG boxes are the fastest way to look fake.
- **Contact shadows:** every object that rests on another must have a soft dark contact shadow where they meet (shadow map + an extra blurred "AO" decal plane). Floating objects are only allowed while they are visibly being placed.
- **Depth of field feel:** distant parts of a big surface fall into softness and haze (fog `THREE.Fog` matching the backdrop colour, starting just behind the focal object). Close-up shots blur the far background via a pre-blurred backdrop or fog, never a heavy post-processing blur over the whole frame.
- **Grain:** a very light, seeded film grain (1.5–2.5 % amplitude, monochrome) over the final frame, different per frame index, so flat backdrop gradients don't band.

All textures are generated deterministically at load time (seeded PRNG such as mulberry32) into offscreen canvases, then wrapped as `CanvasTexture` and cached. Nothing random is evaluated inside `seek`.

# 7. TYPOGRAPHY

Three voices, always in the same places:

1. **Kicker** — an elegant italic serif, light/regular weight. Free fonts: *Instrument Serif Italic* (first choice), *Playfair Display Italic*, *Fraunces Italic*. Size ≈ 4.2 % of frame width (≈ 46 px at 1080 wide). Sentence case. It names the subject or asks the question softly ("Asıl mesele:", "Kapatmadan önce", "Rüzgâr kaldırınca").
2. **Headline** — a heavy geometric/grotesque sans, ExtraBold/Black. Free fonts: *Plus Jakarta Sans ExtraBold* (first choice), *Manrope ExtraBold*, *Outfit Bold*. Size ≈ 7–8 % of frame width (≈ 80 px), tight tracking (−1 %), sentence/lower case, max ~18 characters per line, max 2 lines. It states the idea plainly ("nereye tutunuyor?", "son kontrol").
3. **Caption (karaoke)** — the same sans in Medium/Regular, ≈ 4 % width (44 px), white on dark scenes / ink navy on light scenes, soft shadow `0 2px 12px rgba(0,0,0,0.35)` on dark. Shows the phrase currently being spoken (2–6 words, max 2 lines, the second line may be a smaller 32 px gloss). Key words are highlighted by a **yellow box** (`#F3BC2E`, radius 6 px, padding 4 × 8 px) that wipes in from left to right in ~6 frames exactly when the word is spoken; the word turns `#141414`. Highlight at most 2 words per phrase: numbers, materials, verbs of action.

Plus small type: tag pill and callout pills in the same sans SemiBold, 22–26 px; tiny sublabels inside pills (a second line) at 16–18 px, 70 % opacity.

Kicker + headline are a single block, horizontally centred, top at ~6.5 % of frame height; the kicker sits on the headline like a signature. They enter together: kicker fades in and rises 12 px (280 ms, ease-out), headline follows 120 ms later with a short rise + slight scale 0.97→1. On a change of idea the old block fades/lifts out in 200 ms before the new one comes in; never cross-dissolve two headlines.

Turkish text: uppercase only via `toLocaleUpperCase("tr-TR")`; check ı/İ/ş/ğ glyphs in every chosen font (load fonts as local files with `@font-face`, wait for `document.fonts.ready` before the first seek).

# 8. COMPOSITION HABITS

- **Vertical stack in three bands:** top 18 % = tag pill + kicker/headline; middle ~55 % = the object, the hero; bottom band (≈ 66–80 % height) = karaoke caption, centred. Keep the lowest 9 % clean (platform UI).
- The object is **big and cropped**: it runs out of the frame on one or both sides, seen from a 3/4 elevated view (camera 25–40° above horizontal) with a mild telephoto feel (FOV 28–35°). We are close to a real thing, not looking at a tiny model on a table.
- **Diagonal energy:** long objects (beams, rails, roofs, cables, pipes) lie on a diagonal through the frame; rows of repeating elements vanish toward a corner.
- **One focal zone per shot**: either a whole-system wide shot (with path diagram) or a macro close-up of one joint/part. Alternate wide → close → wide, like a documentary.
- Callouts live in the empty air next to the object, pills are aligned on a loose column, leader lines are short and never cross each other or the headline.
- Generous empty backdrop above the object for the headline; never let geometry cross behind the headline text.

# 9. SIGNATURE DEVICES

1. **The two-voice headline** (italic serif kicker on top of a heavy sans line) at the top of every scene.
2. **Karaoke caption with yellow word boxes** following the narration.
3. **"Representative model" tag pill** in the top-left corner (yellow dot + e.g. "Temsili model · <part name>"), which changes its suffix per scene ("· detay kesiti", "· yük yolu").
4. **Engineering callouts:** rounded pills (yellow / blue / ink) connected to exact 3D points by thin 1.5 px leader lines with a small ring (8–10 px) at the anchor; numbered rings (yellow outline, number in a small filled yellow dot) for "measure here" points.
5. **The path diagram:** at the explanatory peak, a glowing yellow polyline traces how something travels through the object (force, current, water, data, heat), joint by joint, with a pill at every stage. Night studio, object dimmed to ~60 % so the path pops.
6. **Motion streaks:** thin curved white lines that sweep across the object to show an invisible force (wind, airflow, heat, pressure) — each a short arc with a bright head and fading tail.

# 10. TECHNICAL IMPLEMENTATION

Renderer: **Three.js (WebGL)** for the 3D world, with a **2D overlay canvas** on top for all typography, pills, leader lines, path diagram, streaks and grain. Both are drawn inside `seek(t)`.

**Setup**
1. Load `three.module.js` and needed addons (`RoomEnvironment`, `RoundedBoxGeometry`, optionally `mergeGeometries`) as local ES modules (copy them into the project folder or import from the local `node_modules`). Use an import map.
2. `WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: false })`, size = native resolution, `setPixelRatio(1)`, `outputColorSpace = SRGBColorSpace`, `toneMapping = ACESFilmicToneMapping`, exposure ~1.0 (night) / 1.1 (day), `shadowMap.enabled = true`, `PCFSoftShadowMap`.
3. Environment: `PMREMGenerator` + `RoomEnvironment` → `scene.environment` (this is what makes metal and glass look real). Separately keep the visible backdrop as a big inside-out sphere or a curved cyclorama plane with a gradient `ShaderMaterial` (two presets: night, day). Swap backdrop + light rig preset per scene.
4. Lights: `DirectionalLight` key with shadow (shadow camera tightly fitted to the visible object, mapSize 2048, radius 4–6, small bias), a `HemisphereLight` fill, and for night a rim `DirectionalLight` from behind.
5. In headless render Chrome uses software WebGL (SwiftShader): keep total triangles moderate (< ~300k), use `InstancedMesh` for repeated parts (fasteners, ribs, cells, tiles), merge static geometry, and never re-create geometry or materials inside `seek`.

**Scene graph**
- Build every object once, procedurally, from the topic: profiles via `Shape` + `ExtrudeGeometry` (corrugations, rails, frames), `LatheGeometry` for round parts (screws, washers, bottles, pipes; a screw thread = a helical tube or a lathe profile with ridges + normal map), `RoundedBoxGeometry` for panels/blocks. Model only what the camera will see; cut-away faces get their own material.
- Group objects into named "props" with a `state` setter (`setProgress(p)`) so `seek` can position, explode, slide, rotate or reveal them from a 0–1 value.

**Time and camera**
- Write the timeline in design units `u` (0–30); if voiceover exists, a monotonic map turns spoken anchors into `u`. Each scene: `[u0, u1, camFrom, camTo, lightPreset, propsStates]`.
- Camera is defined by `{target, distance, azimuth, elevation, fov}`; interpolate these (not raw positions) with `easeInOutSine` over the whole scene, so the camera is **always** drifting slowly (dolly-in 5–12 %, orbit 4–10°). Never a dead-still frame, never a fast whip.
- Within a scene, prop actions use `easeOutCubic` (placing), `easeInOutCubic` (sliding), and a tiny overshoot `easeOutBack(1.2)` only for things that "seat" into place (a screw head, a clip).

**Overlay canvas**
- Project 3D anchor points with `vector.project(camera)` each frame so pills and rings stay glued to the moving object. Leader line = anchor ring → elbow → pill edge.
- Pills: rounded rect radius = height/2, 1 px inner highlight, soft shadow `0 6px 18px rgba(0,0,0,0.25)`; enter by scaling 0.9→1 + fade, line draws itself from anchor to pill (dash offset), 250–350 ms.
- Path diagram: polyline through projected anchor points; drawn progressively (length-based partial drawing), 4 px core `#F3BC2E` + 14 px glow at 25 % opacity; a small bright pulse travels along it after it's drawn.
- Streaks: precompute N seeded streak curves in 3D (or screen space) once; in `seek`, compute each streak's phase from `t` (`(t*speed + offset) % 1`) to draw a short arc with gradient tail.
- Karaoke caption: phrase timing from the narration word timestamps; highlight boxes wipe with `clip` rect.
- Grain: precompute 8 seeded noise tiles (256²), pick `frameIndex % 8`, draw with `globalCompositeOperation = "overlay"` at low alpha.

**Determinism:** `seek(t)` sets every prop state, camera, light preset and overlay purely from `t`, then calls `renderer.render` once and draws the overlay. Return a promise that resolves after fonts/textures are ready (first call) so the renderer can `await` it.

# 11. SIGNATURE MOTION

The model behaves like a careful hands-on demonstration on a workbench:
- **Placement:** parts descend 10–20 cm (scene scale) from above along their mounting axis and settle with a soft contact shadow growing as they near the surface (500–700 ms).
- **Fastening:** screws rotate while advancing (a full turn per thread pitch), washers compress slightly (scale-Y 1→0.92) at the end.
- **Exploded view / cut-away:** layers separate along one axis by small even gaps, or a section plane slices the object (use `clippingPlanes`) to reveal its inner layers; the cut face gets the brighter core material.
- **Forces:** streak lines sweep across, the affected part lifts a few millimetres and trembles very slightly (seeded, low amplitude, 6–8 Hz) and a pale arrow rises from it.
- **Measurement:** numbered rings pop onto points in order (1, then 2), a thin dimension line draws between them, then the value appears in a pill.
- **Check:** a blue pill with a question ("Conta yüzeye oturmuş mu?") points at the detail; a small check-chip list in the headline area ticks items in sequence (yellow filled circle with ✓, then next item numbered).
Motion hierarchy: camera drift (always, slowest) → main prop action (one at a time) → overlay elements (quick, crisp) → caption highlights (on the word). Never two prop actions starting on the same frame.

# 12. TRANSITIONS

- **Default: a cut on the word**, from a wide shot to a close-up or between moods (night ↔ day). Because the camera is always drifting, a hard cut reads as film editing. Headline block changes on the same cut.
- **Push-through (signature 1):** the camera dollies fast into a detail (e.g. into the joint, the hole, the screw) during the last 12 frames of a scene, the next scene starts already close on that same detail at a different scale or in cut-away.
- **Light flip (signature 2):** for "now let's look at the solution" moments, the backdrop and light rig cross-fade from night to day over 10–14 frames while the object stays — the only allowed blend, and it's a light change, not two images overlapping.
- Never a cross-dissolve of two different scenes (no ghosting), no slide-in cards, no zoom-blur wipes.
- Opening: start mid-action in the night studio (streaks already crossing the object) with a question headline. Closing: a slow pull-back to the whole system in day light, a calm summary headline, the caption's last phrase; then 1 s hold.

# 13. INFORMATION DESIGN

- Diagrams are **attached to the model**: path diagrams, dimension lines, numbered points, cut-aways, before/after states of the same object. No free-floating charts; if a number matters, it appears in a pill next to the part it describes or as a yellow-highlighted word in the caption.
- Numbers: big ones go in the headline ("3,5 cm'lik" as kicker + noun as headline); units always shown.
- Labels: max 3 pills per frame, max ~16 characters + optional sublabel line. Arrange pills in a vertical column with equal spacing; leader lines from the left or right, never crossing.
- Risk/warning: one red ring + short red label per scene, at most.
- Phone readability: nothing smaller than 16 px at 1080 width; pills ≥ 40 px tall; everything holds at least 1.2 s on screen.
- The tag pill always says the scene's honesty level ("Temsili model" / "Representative model" in the topic language) — the visuals are illustrative, not a specific real product, unless the topic names one.
- Facts must be correct; if a dimension is illustrative, it is labelled as such in the narration or tag.

# 14. SOUND

Real, dry, close-miked workshop sounds, sparse: metal panel placement ("metal clank soft", "sheet metal tap"), screw driving ("screwdriver", "drill short", "ratchet click"), clips/click-in ("plastic click", "latch"), wind/air for force scenes ("wind gust", "whoosh air"), a light UI tick for pills ("soft tick", "click ui"), a low airy whoosh for push-through camera moves ("whoosh low"), a gentle "ding" or soft confirmation for check ticks. Keep them 8–14 dB below the voice. No cartoon sounds, no booms.

# 15. CHEAP SHORTCUTS TO AVOID

1. **Flat-shaded boxes with no environment map** → looks like a 2005 CAD screenshot. Instead: PMREM RoomEnvironment, physical materials, bevels, contact shadows; let reflections slide across glossy surfaces as the camera moves.
2. **Static camera with things popping in** → instead the camera always drifts, and every part arrives by a physical action (descend, slide, rotate, separate).
3. **Text as plain centred white labels** → instead the two-voice headline (italic serif + heavy sans), pills with leader lines anchored to projected 3D points, karaoke caption with yellow word boxes.
4. **Generic glow / neon / lens flare to "make it cinematic"** → the look is studio realism. Light comes from a key light and the env map; glow is reserved for the yellow path diagram and streak heads.
5. **Busy multicolour diagrams** → one yellow hero accent, blue for one secondary callout, red for one risk; everything else neutral.
6. **Cross-dissolving scenes / ghosting** → cut, push-through, or light flip only.
7. **Uniform grey CG plastic for every part** → each material has its own roughness, metalness and texture; dark glass vs. brushed aluminium vs. matte rubber must be distinguishable at a glance.

# 16. NOTES (user feedback goes here)

Repo rules come first: the Solar Insider logo (logo.md) sits top-centre, so in vertical format the tag pill, kicker and headline start at y ≥ 200 px (tag pill at y ≈ 210 merged with the series label, e.g. "SAHA NOTU · 04 · Temsili model"; kicker baseline ≈ 310; headline baseline ≈ 405; headline scrim down to ≈ 680 px). Word timings come from `window.SES.kelimeler` as `[text, start s, end s]` arrays.

Starting point: copy `maket-3d-index.html` → `index.html`, `maket-3d-sahne.js` → `sahne.js`, `maket-3d-render.mjs` → `render.mjs` from REPO into the video folder and rebuild the scene for the topic (the file is a worked example: kiremit çatıya panel montajı). Copy `three.module.js` + `three.core.js` (build/) and `RoomEnvironment.js`, `RoundedBoxGeometry.js` (examples/jsm/…) from `araclar/paketler/node_modules/three/` into the video folder's `lib/`; if three is missing, `npm install --save-exact three@0.186.1` inside `araclar/paketler/`. Fonts (Instrument Serif Italic, Plus Jakarta Sans) from the google/fonts GitHub repo into the video folder.

Lessons from the first test video:
- **Headline scrim:** when the object fills the frame (close-ups, big surfaces), draw a backdrop-coloured vertical gradient over the top ~560 px (opacity 0.96 → 0) after the 3D image and before the headline. Without it the headline sits on busy geometry.
- **Day caption:** on mid-grey/dark objects in the day mood, put the karaoke phrase on a frosted rounded plate `rgba(250,250,248,0.8)` with navy text; at night use white text with a soft shadow, no plate.
- **Hidden structure:** when the explanation needs parts that are under other parts (fasteners under a panel, a beam under a cladding), fade the covering parts to ~15–30 % opacity ("x-ray") with their own cloned transparent materials (depthWrite off), instead of moving the camera under them.
- **Light levels (ACES):** day — exposure 1.0, env 0.55, key 2.3, hemi 0.55; night — exposure 0.95, env 0.16, key 1.45, hemi 0.12, rim 2.2. Higher env/hemi values wash the night mood out to grey.
- **Glossy glass:** keep `envMapIntensity` ≈ 0.55 and clearcoat ≈ 0.5, otherwise the RoomEnvironment light box blows out as a huge white blob in close-ups.
- **Anchor placement:** pills must never enter the caption band (y ≈ 1300–1520 at 1920 h) or the headline band (y < 420); check every pill in a frame at full size, because projected anchors move with the camera.
- **Rendering:** ES modules need an http server (file:// blocks them); headless Chrome with `--use-angle=swiftshader --enable-unsafe-swiftshader` renders a 1080×1920 frame with shadows in ~0.3–0.5 s. Draw the WebGL canvas into one 2D output canvas (backdrop → 3D → overlays → grain) so the frame is captured from a single canvas.
- **Transcript quirks:** ai33 transcripts may drop circumflexes ("Rüzgar") or change spelling ("kiremite"); anchor words must match the transcript spelling, and the caption should run through a small spelling-fix map.
