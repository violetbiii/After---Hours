# Earlier prototype history

The gaze-freezing corridor concept below is superseded by the costume build.

# After---Hours
A first-person browser horror game where an empty university hides something that moves when you look away. Find your student ID, uncover the clues, and escape before the lights go out.

## First corridor prototype

Current build: a 3D corridor, keyboard movement, mouse or arrow-key looking, wall collision, a toggleable flashlight, searchable drawers, shuffled collectibles, phone messages, two endings, and an exit with a replay screen. Classroom 111 is explorable and contains the exit power switch; other classroom doors are scenery. The Last Student appears after collecting the ID, freezes when visible, and approaches after 0.7 seconds out of sight. After a four-second grace period it can catch you if you leave it unseen; watching it freezes it. Doorway peeking and the full story are future milestones.

### Play locally

Serve this folder with a static web server, for example `python3 -m http.server 8766 --bind 127.0.0.1`, then open http://127.0.0.1:8766. A desktop browser with WebGL and an internet connection is required: Three.js 0.170.0 loads from jsDelivr, and fonts load from Google Fonts.

Click Enter the West Wing (or focus the button and press Enter). Use WASD to move, the mouse or arrow keys to look, F to toggle the flashlight, E to interact, Tab to raise/lower your phone, and Escape to pause. Search the three corridor desk drawers for your ID (E opens a drawer, E again examines it), then inspect the exit. Restore power at the switch inside Classroom 111 and return to the exit. Both the ID and power are required.

### Project files

- `index.html`: menu and on-screen information.
- `style.css`: typography, colours, and screen overlays.
- `game.js`: the 3D scene, movement, interactions, and game state.

### Development journal — 27 September 2026

Violet chose the horror genre and university setting. This initial implementation was built with AI coding assistance. Next learning task: change one room detail or lighting value and explain how the change affects the scene.

Validation: JavaScript syntax check passed; browser rendering, starting via keyboard, and pause verified. Full movement and escape playthrough still needs player testing.

### Creature milestone

Original low-poly geometry in `creature.js`: reversed torso, tilted pale face, tiny dark eyes, long arms and curled fingers, and a blank swinging badge. Open `creature-preview.html` on the local server for a well-lit model study. Creature movement and badge animation pause with the game; replay resets the encounter.

Validation: syntax checks and automated Three.js checks passed for initial hiding, reveal, freezing while watched, unseen approach, the original introductory approach distance (superseded by the catch milestone), and reset. Model visually inspected in browser. Full player escape remains a manual playtest.

### Classroom puzzle milestone

Added Classroom 111 with desks, chairs, a chalkboard, an open doorway and a power switch. The offline exit reader points players to the classroom. E restores power; lighting and reader colour give feedback. Walls now occlude the creature, so it approaches while hidden behind a classroom wall. It stays in the corridor for this introductory encounter.

Validation: automated checks passed for the doorway path, solid walls, ID-only and power-only exit rejection, the complete ID/power/escape sequence, either collection order, replay reset, and wall-occluded creature movement.

### Sound milestone

Original procedural Web Audio sounds in `audio.js`: footsteps based on actual distance walked, distance-scaled stereo creature scrapes tied to actual movement, a power-switch clunk, and a classroom electrical hum after restoring power. Audio begins only after entering the game. Press M to mute or use the pause-menu mute and volume controls. Audio stops during pause, loss of focus and completion; replay keeps volume preferences for the session. No audio downloads or external sound assets.

Validation: syntax and diff checks passed. Automated audio-node checks covered initialization, mute/volume, footstep triggers, power sound, pause and resume. Browser startup, pause and mute shortcut verified. Final sound balance needs a listening playtest.

### Catch and retry milestone

Four-second grace period after reveal; creature approaches at 1.8 metres/second while unseen (player speed: 2.5). Physical obstacles block its movement and catches. It remains in the corridor. Getting caught shows the actual creature face briefly, plays a short sound, fades to black, and presents Try Again. Retry resets ID, power, creature, camera and blackout while retaining sound preferences.

Validation: automated Three.js checks passed for grace, watched freeze, unseen catch, wall-blocked movement/catches, and model close-up. Game integration checks passed for caught state, retry reset and successful escape. Browser startup verified; full visual scare and difficulty balance still need player testing.

### Interactive exploration milestone

Three corridor drawers and four classroom drawers open physically and can be searched. The ID and optional missing phone occupy different valid locations on every retry. Opening the correct drawer reveals the collectible; examining it collects it once. Phone messages arrive at story events and on active-game timers. Tab reads them without pausing, and the phone screen occludes the creature for its gaze rule. Pause, capture and endings lower the phone.

Optional objective: recover Maya’s phone from a classroom drawer before leaving. Escape without it gives Ending 01 / Alone; recovering it gives Ending 02 / The Witness. Both endings require ID and restored power. No extra objective is mandatory.

Validation: 50 randomized resets, open/search/collect lifecycle, one-time messages, collection orders, reachable search positions, power gate, both endings, phone interaction lock, pause/reset, and phone-obscured creature movement checked. Browser phone layout, unread badge and Tab interaction verified. Full player playthrough remains needed for pacing and difficulty.
