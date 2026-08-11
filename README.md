# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
npx sv@0.16.6 create --template minimal --types ts --install npm .
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Environment

Copy `.env.example` to `.env.local` (git-ignored) and fill in what you need:

| Variable           | Needed for                              |
| ------------------ | --------------------------------------- |
| `OPENAI_API_KEY`   | Reading dialogue aloud (`/api/tts`)     |
| `OPENAI_TTS_MODEL` | Optional — defaults to `gpt-4o-mini-tts` |

Without a key the chronicle reads normally; the **Voice** control in the HUD
simply reports that the server has none. On Vercel, set the same variables in
the project's environment settings.

### How the voice works

The HUD's **Voice** toggle reads each dialogue line aloud as you reach it, and
every line carries its own speak button — in the gutter beneath the speaker's
face in Script mode, on the lip of the plate in Immersion. It speaks whatever
is on screen: Korean while Korean is shown, English otherwise.

Every clip is addressed by URL (`/api/tts?…`), returned `immutable`, and cached
by the browser, so re-reading a scene never bills a second time. The route also
keeps a small in-memory cache and collapses concurrent requests for the same
line into one call.

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
