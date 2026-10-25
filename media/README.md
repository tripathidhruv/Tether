# Tether intro video

19 s Remotion composition (`TetherIntro`, 1920x1080, 30 fps, 570 frames, no audio). Sources live in `video/`; the whole film is one frame-driven component in `video/TetherIntro.tsx`, with scene timings at the top of the component.

```bash
cd media
npm install

# Preview in Remotion Studio (port 3000 is usually taken by `next dev`)
npx remotion studio video/index.ts --port=3123

# Render the MP4 -> out/tether-intro.mp4
npx remotion render video/index.ts TetherIntro out/tether-intro.mp4 --codec=h264 --port=3123

# Render a single still, e.g. frame 400
npx remotion still video/index.ts TetherIntro out/frames/f400.png --frame=400 --port=3123
```

`npm run studio` / `npm run render` are shortcuts for the first two (add `-- --port=3123` if 3000 is busy).
