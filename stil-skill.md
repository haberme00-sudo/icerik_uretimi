---
name: stil
description: Turn reference images (posters, ads, screenshots, any design) into a reusable animated explainer style, written as a long, detailed prompt, then make videos in it. Use when someone says "bu görselden stil çıkar", "bu tarzda video yap", "şablona çevir", "turn this poster into a video style", or gives an image and wants motion graphics.
---

# /stil

Turn a still image into a living video style. The result must look like the same designer made a whole explainer series, not like a poster with things sliding around.

The output is a **style prompt**: one long, self-contained prompt that any fresh Claude Code session can run with no other context and get this look on any topic. Detail is the point. A short description ("cream paper, bold type") gets an average video; a prompt that explains how the look is built, how it moves and how it is usually faked gets a great one.

## 1. Read the images
Look at each reference closely, at full size and in crops. Ask for a topic only if none was given.

## 2. Write the style prompt
Save `stil-prompt.md` in this order:

1. **Task:** one paragraph naming the style and the target: a premium animated explainer in this visual language, not a slideshow.
2. **The shared body** at the end of this file, copied verbatim (config block with its `{{…}}` placeholders, Claude Code workflow, quality standard, verification).
3. **The style sections**, written by you. Aim for 2,000–4,000 words. Write them as craft knowledge an expert designer would pass on, concrete enough to build from:
   - **Visual language and palette:** exact hex values sampled from the image, rough proportions, which colour is allowed where.
   - **Material and surface:** what the picture is physically made of (paper, ink, glass, light, pixels…) and how that material behaves: edges, grain, shadow, overprint, wear. Every texture generated deterministically.
   - **Typography:** kinds of faces (name free web fonts that match), sizes, case, how type sits on the page, how it enters and leaves.
   - **Composition habits:** grid rhythm, scale contrast, use of empty space. The habits, never the reference layout itself.
   - **Signature devices:** the 3–5 things that make this look recognisable.
   - **Technical implementation:** how to actually build this look in the browser, step by step: which renderer (Canvas 2D, SVG, WebGL), the layer structure, offscreen buffers, masks, shaders or noise functions, how textures are generated and cached. This is the section that separates great output from average.
   - **Signature motion:** how this material would move if it were real (ink stamps, paper slides, light sweeps), timing and easing, motion hierarchy.
   - **Transitions:** most scene changes are plain cuts or a camera move, like an edited film; define one or two signature transitions in the style's own material for the big moments.
   - **Information design:** which diagram types suit the style, how numbers, labels, arrows and charts look in it, phone-size readability.
   - **Sound:** kinds of effects that fit the material, as search terms.
   - **Cheap shortcuts to avoid:** the 4–6 ways a model usually fakes this look (a flat colour instead of real overprint, blur instead of refraction, a stock gradient…), each with what to do instead.

## 3. Test the prompt, not just a video
Fill the config with the user's topic, 8 seconds, storyboard off, and run the prompt exactly as written in a fresh session (a sub-agent if you can; otherwise follow only the prompt yourself). Put frames next to the reference and judge honestly: would someone believe the same designer made both? If not, fix **the prompt** where it caused the biggest difference, and run again. A first draft is never the finished prompt: expect two or three rounds, and the style is ready only when a fresh run with no extra help comes out as good as the reference.

## 4. Hand over and learn
Show the test video and `stil-prompt.md`. When the user gives feedback, fix the video and add the lesson to the prompt under a final "Notes" section in their words, so the next video never needs the same correction.

Take the style, not the picture. Use the visual language, never the original artwork, composition, text or logos; every frame is a new layout built around the topic.

---

## Shared body (copy verbatim into every style prompt)

```
# 1. PROJECT CONFIGURATION — EDIT SETTINGS ONLY HERE

**Topic:** {{KONU}}

- Storyboard: {{STORYBOARD}}
- Voiceover: {{SES}}
- Subtitles: Disabled
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
```
