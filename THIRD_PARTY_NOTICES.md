# Learning experience reference

The Langlume lesson experience was informed by [Lingo / duolingo-clone](https://github.com/sanidhyy/duolingo-clone), by Sanidhya Kumar Verma, distributed under the MIT license.

Adapted interaction patterns: explicit answer selection and verification, progress through a finite sequence, practice without duplicate rewards, an exit confirmation, and completion feedback. Langlume implements these with its own TanStack Router, Supabase, lesson content, mascot, and design system.

The reference's Next.js, Clerk, Stripe, and Drizzle integrations are not dependencies of this project. Langlume retains its existing authentication and payment integrations.

Optional online dictionary definitions use [Free Dictionary API](https://dictionaryapi.dev/), an open-source service with [source on GitHub](https://github.com/meetDeveloper/freeDictionaryAPI). The app links to the source and license returned with supported entries. The guided conversation curriculum runs locally and does not depend on this service. See [KEYLESS_PRACTICE.md](KEYLESS_PRACTICE.md).

## Human pronunciation recordings (27 October 2026)

Files in `public/audio/` are recordings by Wikimedia Commons / Lingua Libre contributors, converted to MP3. Their individual CC BY-SA 3.0, CC BY-SA 4.0 or CC0 licenses and attribution are listed in `public/audio/credits.html` and `src/lib/language-apis/recorded-audio.json`. These media licenses do not license the application code. Original metadata is retained in the ignored audit folder.
