# For Meem

A small, offline-capable web app: eight chapters that move from a greeting to a
letter to a question, with an easter egg and a hidden message tucked inside.

Built with React, TypeScript, Tailwind CSS and Framer Motion. No backend, no
accounts, no database — progress lives in `localStorage`, and the app is
installable and works offline after the first visit.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
```

Deploy `dist/` to any static host. The service worker precaches the build, so
after the first load the app opens with no network.

## Structure

```
src/
  chapters/      one file per chapter of the story
  components/
    background/  canvas particle field, constellation, colour washes
    ui/          shared surfaces: glass card, button, chapter frame
  hooks/         progress + navigation, storage, long-press, ambient audio
  lib/           reusable motion variants, confetti, haptics
  data/          every line of copy in the app
```

All of the writing lives in `src/data/content.ts`. Editing that file is enough
to change what the app says; no component needs to be touched.

## Notes

- **Music** is generated at runtime with the Web Audio API rather than shipped
  as a file, so there is nothing extra to download or cache. It starts muted.
- **Progress** is stored under the `meem.journey.v1` key. Chapters already
  reached stay unlocked and can be revisited from the navigator at the bottom.
- **Motion** respects the system "reduce motion" setting: particles hold still,
  the constellation appears complete, and confetti is skipped.
- **Icons** in `public/` are generated images; the palette they follow is the
  one defined at the top of `src/index.css`.

---

© Silkoraa Consultancy Ltd. All rights reserved.
