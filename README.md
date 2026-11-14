# Please Claim Your Child

A complete short browser horror game set in St. Orison School's lost-and-found office. Work six strange claims, inspect the evidence and decide what to return, keep or destroy. Kept property haunts the shelves. Your own ID is the final claim.

## Play

Serve this folder with `python3 -m http.server 8766 --bind 127.0.0.1`, then open http://127.0.0.1:8766/. Requires WebGL and internet for the pinned Three.js module and optional Google Fonts. Click or tap the controls; no pointer lock or walking controls. Escape pauses. Sound starts only when you begin; volume and mute are available throughout.

1. Pick up the object. Drag it or use the turn buttons to rotate it. Investigate its pocket, lining, screen or label to uncover a clue. Each object also has an optional unsettling discovery.
2. Ring for the claimant; compare their story with the inspection notes.
3. Return, keep or dispose. Read the consequence, then advance.
4. If restlessness rises, select Shelves and use the lamp. It reduces pressure by 32, with a 12-second cooldown. At 100 the room claims you.
5. Resolve your own ID to finish. Five endings include one pressure-based loss. Replay resets the shift. Gentle shift slows pressure accumulation.

The game pauses when its tab is hidden or loses focus. There is no save between page reloads. Text outcomes conclude the story; there are no cinematic cutscenes or recorded voice acting. Original procedural room, props, character meshes and ambient audio; no downloaded model assets.

## Files and validation

- `index.html`, `lost.css`, `lost-game.js`: interface and live game orchestration.
- `claims.js`: six narrative cases and isolated decision rules.
- `lost-scene.js`: Three.js office, object inspection cameras, visitor and shelf animation.
- `audio.js`, `model-detail.js`: shared original sound and material helpers.
- `legacy.html`: preserved earlier After Hours mascot prototype.

Run `node tests/claims.mjs`. It checks all 729 decision paths, all five endings, inspection gates, lamp cooldown, gentle mode and reset. A complete six-claim escape was also played through the browser. Further human testing is useful for difficulty, sound balance and performance across devices.

Violet selected the concept and creative direction. Implementation and procedural assets were made with AI assistance. Source is maintained in this repository. Run locally using the instructions above; source publication does not automatically enable a public game website.

## Interactive inspections

- Raincoat: open the pocket to see a photograph; turn the lining out to discover a handprint.
- Voice jar: hear three synthesized notes with a visible musical clue; cover the glass to darken the lamp and reveal its message. The message is captioned, not spoken audio.
- Shadow: unfold the warning; move the light and watch the illustrated shadow reach toward it.
- Phone: read Elliot’s message, then swipe the evidence image or use the photo button to cycle through three illustrated surveillance pictures, including a future frame.
- Morrow: lift the inventory plate, then look through the eyeholes to reveal a figure in the 3D room. Lowering the head hides it.
- Student ID: turn it over and rub the photograph to reveal the attendant.

Evidence images are original vector illustrations. Interactions combine object rotation, camera/lighting changes, illustrated discoveries and optional scares; they are not physics-based cloth or hand simulations. All clues remain understandable with sound muted.

Validation: all 729 choice combinations and the revised clue gate pass `node tests/claims.mjs`. A complete browser playthrough exercised all twelve discoveries and reached the RELEASE ending. Full device coverage and human audio balancing remain open.
