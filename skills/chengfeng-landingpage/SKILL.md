---
name: chengfeng-landingpage
description: Transform a product's core promise into one original visual metaphor and directly produce a video-led landing-page direction, creative brief, or requested visual/video/web deliverable. Use when users ask to express a product through a metaphor, create a metaphor-led landing page, turn abstract product value into visual design, or make a brand/product demo feel less generic. For visual or landing-page production, always create a playable video layer and use it as the full-viewport hero world with editable DOM UI above it; do not return a static-only page or a contained video card unless explicitly requested. Do not use for ordinary UI implementation that has no positioning or narrative-design need.
---

# chengfeng-landingpage production

Turn the product's central tension into one visual system. Decide the direction; do not present a menu of concepts or ask the user to choose one.

## Inputs

Use the product description, target audience, desired action, brand constraints, and any supplied reference. Infer missing details from the request. State a material assumption only when it changes the outcome.

Find the product tension before choosing a style. Express it as a short relationship, such as `autonomous execution under human control` or `complex work made calm and legible`.

## Case library

For a video-led landing-page task, read [references/case-studies.md](references/case-studies.md) before defining the first screen. The public package intentionally contains only the reusable patterns, not the original local pages or generated footage. Treat every pattern as a structural reference, never as a source to copy: do not reuse another brand, wording, visual asset, generated footage, or exact prompt.

## Workflow

1. Distill one product claim and one central tension.
2. Select the single strongest concrete metaphor. Prefer an everyday physical system with visible cause and effect; avoid decorative, generic, or purely stylistic concepts.
3. Create a mapping from product roles and relationships to visual roles. Every major object, scale relationship, and motion must support that mapping.
4. Define the visual grammar:
   - composition and negative space;
   - palette, material, and lighting;
   - semantic motion: specify exactly what moves, what remains stable, and why;
   - first-screen hierarchy: video world, contrast/atmosphere layer, live navigation and copy, primary action, and one small state or interaction cue;
   - headline and supporting copy that name the proposition without explaining the image literally;
   - typography that matches the language of the live copy, including its reading size, line height, and tracking;
   - interaction behavior that reinforces the same relationship.
5. For every visual or landing-page production, create a motion source before building the page:
   - create an original, production-quality raster first-frame visual with usable negative space for live UI; when the Agent has image-generation capability, generate it directly and prefer the `image2` model when available;
   - when the Agent has no image-generation capability, give the user one copy-ready `image2` first-frame prompt and the exact image contract (`16:9`, intended subject position, reserved live-copy region, palette/material/lighting, no baked text/logo/UI). Ask the user to generate the image through an available image-generation service—preferably one offering `image2`—and upload the resulting PNG back to the Agent;
   - do not use an SVG, CSS diagram, wireframe, or other placeholder as the generation source;
   - create a playable 4–8 second video loop from that frame;
   - animate the part of the metaphor that proves the product relationship; keep framing and non-semantic elements stable;
   - keep text, logos, and UI out of generated footage.
6. Directly produce the requested scope:
   - **strategy / concept:** deliver the metaphor map, a production-ready creative brief, and a concrete video treatment;
   - **video:** deliver the loop as the primary artifact, with its poster/first frame;
   - **landing page:** build the homepage hero only by default. Make the generated video a full-viewport hero world; layer editable DOM navigation, proposition, action, and one restrained status/interaction cue over it; include the poster fallback, responsive layout, and reduced-motion behavior. Do not invent, add, or restyle sections below the hero, nor modify another specimen, unless the user explicitly expands the scope. Use a contained video card only when the user explicitly asks for it or the task is a UI/product walkthrough where a full-bleed world would contradict the claim.
7. Resolve the video source after the first frame is approved:
   - When an eligible, configured video API is authorized for the task, generate the loop through it and continue directly.
   - When no video API is configured, available, or authorized, do **not** replace the video with a static image or a generic local animation. Give the user a manual video-generation handoff: the original first-frame PNG, one copy-ready image-to-video prompt, and the exact export contract (`16:9`, `4–8 seconds`, locked camera, one semantic motion, no baked text/logo/UI, muted MP4). Recommend a browser-accessible image-to-video service the user already has access to; if none is known, describe the required capability rather than inventing a provider. Ask the user to upload the resulting MP4 back to the Agent.
   - On MP4 import, inspect the media and finish the same full-viewport hero treatment. The origin of the video may differ; the first-screen quality contract does not.
8. Validate the result. Confirm that the metaphor is legible without the copy, that copy still works without the image, and that no visual or motion cue contradicts the product claim. For media, verify a real playable video file, duration, first/middle/last frame, and audio state. For a landing page, verify that the first viewport uses the video as its world rather than a contained illustration, and that all editable UI remains in DOM above the footage. When live copy is CJK, run `assets/tools/audit-cjk.js` in the browser at 1440px and 390px and require `total: 0` at both; reject any first screen relying on a system font stack, using weights the font does not ship, or showing negative tracking, sub-1.2 line height, sub-12px CJK, or horizontal overflow.

### CJK typography

When editable UI copy is predominantly Chinese, Japanese, Korean, or mixed CJK. Full spec, rationale, and failure cases: `references/cjk-typography.md`. **Han characters are fixed-width blocks that fill the em box — every English typographic instinct points the wrong way here.**

- **Ship the font; do not rely on a system stack.** A stack that starts at `"PingFang SC"` renders as three different faces on macOS / Windows / Linux, and PingFang is a system UI face that makes any art-directed hero look like a settings screen. Subset a webfont against the page's own copy — a hero uses 100–300 glyphs, so a full page lands at 160–230KB. Use `assets/tools/build-fonts.mjs`; keep system faces only as a missing-glyph fallback. Re-run the script after any copy change, or new characters silently fall back mid-sentence. macOS system faces (PingFang, Songti/SinoType) are licensed with the OS and **may not be embedded or redistributed** — fallback position only.
- **Pick the typeface from the metaphor, not from a global default.** Type is part of the metaphor: a neutral corporate sans over a dark classical oil painting has the image talking about craft and weight while the text talks about system settings. Read the *material and era* in the frame — wood/paper/stone/brass/handwork → `classical` (serif); steel/hydraulics/gauges/speed/pressure → `industrial`; screens/data/abstract geometry → `neutral`. Body copy defaults to `neutral` regardless. Declare the choice with its reasoning in the page's `fonts.config.json`; full voice catalog and selection rules in `references/cjk-type-voices.md`.
- **Use only weights the font actually ships.** PingFang has 100–600 in steps of 100; a subset ships whatever you packed. `650` / `680` / `560` snap to the nearest real weight, and with `font-synthesis: none` (keep it) nothing is synthesized — three declared levels render as two. Bind tokens to real files: 400 body, 500 nav/labels, 600 buttons/subheads, 700 display.
- **Never track CJK negative.** Headings and body at `0`; small labels at most `.02em`. Negative tracking merges strokes on dense glyphs. Reserve `.04em`–`.07em` tracking and uppercase for purely Latin technical labels.
- **Line height: display `≥1.2` (use 1.22), body `1.75`–`1.85`, single-line labels `1.5`.** English editorial values like `.91`, `1.06`, or `1` overlap CJK lines outright. Check the `font` shorthand too — `font: 600 36px/1.1` is the same bug, just harder to see.
- **Size floor is 12px for CJK, not 11px.** Han glyphs carry far more strokes than Latin at the same size. Body ≥16px desktop / ≥15px narrow; nav and actions ≥13px / ≥12px; labels, footers, status ≥12px. Values like `.55rem` (8.8px) inherited from English templates must all be raised.
- **Measure in `em` — 1em is exactly one Han character.** Display `≤11em` (11 characters per line), body `≤26em`. `32em` exceeds the comfortable 24–28 character scan width.
- **Lock semantic line breaks at wide widths only.** `white-space: nowrap` by default with a narrow-width escape hatch overflows the viewport between the two breakpoints; invert it (`@media (min-width: 781px)`). Author breaks with explicit spans, never `text-wrap: balance`. Define a separate line plan for narrow screens and keep punctuation off line starts.
- Set `line-break: strict`, `word-break: normal`, `overflow-wrap: normal`, plus `text-spacing-trim` and `text-autospace` behind `@supports` for Han–Latin spacing and full-width punctuation trimming.
- **Give CJK blocks more vertical air than English.** Dense Han blocks have none of the ascender/descender variation that groups English text visually; separation comes entirely from whitespace. Use a 4px scale with named rhythm tokens (eyebrow→title, title→body, body→action).
- Choose the CJK type voice from the product meaning: a product/UI claim normally leads with a CJK sans-serif hierarchy; use a serif display face only when the editorial, cultural, or metaphorical direction earns it — and then carry it through, rather than leaving a serif `h2` stranded under a sans `h1`.
- **Audit in a real browser before claiming completion.** Run `assets/tools/audit-cjk.js` at 1440px and 390px; it flags negative tracking, sub-1.2 line height, non-existent weights, sub-12px CJK, over-wide measure, and horizontal overflow. Reading the CSS is not enough — media queries, trailing override blocks, and `font` shorthands all diverge from the rendered value. `total: 0` at both widths is the bar.

### Video-led interface contract

Treat this as a hard constraint for every video-led landing page. Let the video establish the world; let the UI make one proposition legible.

- Define semantic tokens before styling: `background`, `panel`, `ink`, `muted`, `line`, and `accent`. Keep a dark video world when it serves the metaphor; do not flatten it into a generic light product UI.
- Give the first viewport one hierarchy only: brand/navigation, one optional eyebrow, a deliberate headline, one supporting sentence, one primary action with at most one quiet secondary action, and one functional state or control. Remove duplicate counters, coordinate readouts, scroll prompts, and decorative status panels.
- Make the desktop CJK headline two intentional semantic lines when possible and never more than three; target `44px`–`60px` with `1.22` line height (never below `1.2` — see CJK typography). On narrow screens, define its new line plan at `30px`–`40px`. Use explicit spans or breaks; never use balanced wrapping to invent the rhythm.
- Keep the supporting copy to one short sentence, `15px`–`17px`, with enough contrast and `1.75`–`1.85` line height. Preserve more negative space than annotation around the focal action in the video.
- Limit text over video to the proposition group, the action group, and one real control or state cue. Every remaining overlay must either change a state, report a real state, or be removed.
- Use a 4px spacing scale. Use `6px` corners and `1px` borders for interface surfaces and buttons. Reserve fully rounded pills for compact, genuinely status-like controls; do not use them as the default marketing-button shape.
- Keep controls compact and functional: generally `12px`–`14px` type, visible hover/focus states, and no ornamental interaction labels. Make decorative motion subordinate to hierarchy, respect reduced motion, and do not animate every UI cluster on entry.
- Reject a first screen if a semantic phrase is split accidentally, the headline competes with the video for most of the frame, more than one non-functional overlay group remains, a generic pill/button treatment is repeated, or the page cannot be understood at both a 1054px desktop viewport and a narrow mobile viewport.

## Output contract

When producing a concept, return these sections in order:

1. `产品主张`
2. `核心张力`
3. `视觉隐喻`
4. `映射`
5. `表达语法`
6. `制作指令`

When producing a page or video, use the same logic internally and lead with the finished deliverable. Always hand off the standalone video as well as any landing page. Explain the mapping only when the user asks for the reasoning.

## Guardrails

- Do not give several visual directions, moodboards, or a selection step unless the user explicitly asks for alternatives.
- Do not treat a color palette or an art style as a metaphor. The relationship must be visible in object, composition, and behavior.
- Do not bake editable UI text, product claims, or logos into generated imagery or footage.
- Create original assets; do not reproduce a reference brand's marks, copy, or artwork.
- Keep generated video as an atmosphere or story layer. Keep navigation, copy, controls, and accessibility in the web layer.
- Do not choose a static-only visual treatment for a page, even when a CSS illustration could represent the metaphor.
- Do not place the generated video in a side panel, card, device mockup, or other contained frame by default. A full-viewport video hero is the landing-page default; deviate only for an explicit user constraint or a clear product-walkthrough need.
- Do not paste Latin-only font imports or English-first tight type metrics into a CJK interface. Set the language-appropriate stack and tune the rendered first viewport.
- Do not treat CJK typography as a font substitution. Define the intended line count, semantic breaks, Han–Latin spacing, and hierarchy before tuning CSS values; verify the rendered layout at desktop and narrow mobile widths.
- Do not ship a CJK page whose primary font is a system stack, and do not declare a weight the shipped font does not contain.
- Do not fix typography by appending another override block at the end of the stylesheet. Patch stacks make one value live in two places and drift apart; edit the source rule instead. If a trailing block already exists, fold it in rather than adding a third layer.
- Do not batch-rewrite minified or single-line CSS with regex without verifying brace balance and numeric validity afterwards — greedy matches turn `.72rem/1.55` into `1.5.55`.
- Use a paid external media API only when it is authorized in the task. If it is unavailable, preserve the video-led outcome through the manual handoff: provide the first frame, copy-ready image-to-video prompt, and MP4 export requirements; then resume after the user imports the generated video. Do not silently downgrade to a static hero or pretend a local placeholder is equivalent footage.
- If image generation is unavailable, preserve the same first-frame quality bar through the manual `image2` prompt handoff. Do not replace the required raster first frame with an SVG, CSS drawing, stock placeholder, or unrelated screenshot.
