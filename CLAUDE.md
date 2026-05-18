# CLAUDE.md

This project is a kids animation studio.

The goal is to turn a child's simple idea into a cute, safe, animated web page.

## Project Type

- Vite
- React
- CSS animation
- Static frontend only
- Deployed on Vercel

Do not turn this into a full-stack app unless explicitly asked.

## Main Goal

When asked to create or modify an animation:

1. Understand the child's idea.
2. Expand it into a simple warm story.
3. Design 3-5 scenes.
4. Implement the animation in React and CSS.
5. Make sure the app builds successfully.
6. Keep the result simple, cute, safe, and viewable on mobile.

The final result should feel like a small children's animated short, not just a static demo page.

## Preferred Files To Edit

Prefer editing:

- `src/App.jsx`
- `src/App.css`
- `src/main.jsx`
- `index.html`
- `README.md`

If the project uses TypeScript, prefer:

- `src/App.tsx`
- `src/App.css`
- `src/main.tsx`

Avoid changing project tooling unless necessary.

## Animation Quality Rules

Every animation should have:

- A clear main character
- A simple story
- 3-5 scenes
- Visible motion
- A beginning, middle, and ending
- A closing caption
- Bright, child-friendly visuals
- Mobile-friendly layout

Avoid low-quality results such as:

- Static pages with no animation
- Only text and no character
- One emoji spinning in place
- No ending
- Tiny characters that are hard to see
- Animations shorter than 15 seconds
- Broken mobile layout

## Story Structure

Before coding, internally plan the animation like this:

- Title
- Main character
- Setting
- Style
- Scene 1
- Scene 2
- Scene 3
- Optional Scene 4 or 5
- Ending caption

Each scene should include:

- What appears on screen
- What moves
- What changes
- What text or caption appears

## Visual Style

Prefer:

- Cute
- Warm
- Bright
- Playful
- Simple
- Fairytale-like
- Suitable for children

Good themes include:

- Animals
- Space
- Ocean
- Forest
- Castle
- Rainbow
- Candy world
- Robots
- Dinosaurs
- Friendly magic
- Birthday party
- Friendship adventure

## Safety Rules

Do not create:

- Horror
- Blood
- Adult content
- Graphic violence
- Self-harm
- Bullying
- Dangerous imitation
- Gambling
- Personal private information
- Content encouraging children to run away, climb dangerous places, play with fire, touch electricity, or drive vehicles dangerously

If the child asks for unsafe content, rewrite it into a safe version.

Example:

Unsafe request:

> Make a monster destroy and eat a city.

Safe version:

> Make a small monster accidentally scare the city, then become friends with everyone.

## Technical Rules

Use:

- React components
- CSS animations
- SVG
- emoji
- CSS shapes
- simple gradients
- simple responsive layout

Avoid:

- External image URLs
- Backend services
- Databases
- Login systems
- Complex dependencies
- Large animation libraries unless explicitly needed

The page should play automatically when opened.

## Recommended Animation Techniques

Use CSS animations for:

- Flying
- Jumping
- Floating
- Swimming
- Waving
- Spinning
- Twinkling
- Scaling
- Moving left and right
- Moving up and down
- Bubbles rising
- Clouds drifting
- Stars blinking
- Captions fading in and out

Use a data-driven scene structure when possible.

Example shape:

const scenes = [
  {
    title: "Launch",
    text: "The bunny gets into a rocket and flies toward the moon.",
    emoji: "🐰",
    action: "launch"
  },
  {
    title: "Star Friends",
    text: "The stars twinkle and show the bunny the way.",
    emoji: "⭐",
    action: "twinkle"
  },
  {
    title: "Moon Landing",
    text: "The bunny lands on the moon and waves happily.",
    emoji: "🌙",
    action: "land"
  }
];

## Build Check

After making changes, run:

npm run build

If the build fails, fix the issue before finishing.

Do not claim the task is complete if the build fails.

## Git Rules

Only commit when:

- The animation is implemented
- The build passes
- The result is child-friendly
- The page is not broken on mobile

Suggested commit message format:

animation: short animation title

## Quality Self-Check

Before finishing, check:

- Story completeness: 1-5
- Motion richness: 1-5
- Visual variety: 1-5
- Child safety: 1-5
- Technical stability: 1-5

If any score is below 4, improve the animation before finishing.

## Response Style

When reporting to an adult, include:

- What was changed
- Whether the build passed
- Any important limitations
- The final viewing URL if known

When writing text meant for a child, keep it simple and friendly.

Example:

Animation is ready!

It is a little story about a kitten riding a bubble submarine under the sea and meeting glowing jellyfish friends.

## Final Principle

First be a director, then be a programmer.

Do not jump directly into code. First think through the story, scenes, motion, and ending.
