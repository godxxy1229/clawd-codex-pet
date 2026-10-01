# Clawd for Codex Pets

A calm SVG-crafted Clawd companion with nine animation states and sixteen look directions.

[View and install on Codex Pets](https://codex-pets.net/#/pets/clawd-svg).

![Clawd animations](previews/all-states.gif)

- Gentle breathing, blinking, walking, waving, jumping, and expressive reactions.
- Working: short square hands alternate across six illuminated keyboard keys.
- Reviewing: a rigid magnifying glass, focused eyes, and a subtle nod.
- Built from explicit SVG frames rendered with Sharp; no image-generation model used.

## Files

- `spritesheet.png`: validated Pets API atlas, 1536 × 2288, with 192 × 208 cells.
- `package/`: `pet.json` and lossless `spritesheet.webp` for [Codex Pets](https://codex-pets.net/#/upload).
- `svg/`: editable animation frames; `animation.json`: frame counts and preview timings.

The website package additionally fills row 0, column 6 with the neutral pose required by its format. The API PNG keeps that unused cell transparent. All animation frames are identical between the two exports.

## Rebuild

With Node.js installed, run `npm install`, then `npm run build`. Outputs go to `build/`.

## Credits and rights

Adapted from [rullerzhou-afk/clawd-on-desk](https://github.com/rullerzhou-afk/clawd-on-desk/tree/75976f51c275f974edfa995da205c4124860b44a/assets/svg), including its typing and debugger references. Clawd belongs to Anthropic; this is an unofficial fan adaptation.

The upstream artwork is **All Rights Reserved**, restricts commercial use and redistribution, and is not covered by the upstream code license. See [ARTWORK-NOTICE.txt](ARTWORK-NOTICE.txt). This repository grants no additional artwork rights.
