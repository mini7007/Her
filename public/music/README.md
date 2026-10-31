# Music — where the songs live

Drop the three audio files here, named exactly:

```
public/music/khat.mp3
public/music/faasle.mp3
public/music/alfaaz.mp3
```

The player in Scene 07 ("Our Songs") reads these paths from
`src/content/relationship.ts` — titles and artist names are editable there too.

## Important — copyright

Do **not** download or include commercial songs you don't have the rights to
use. Options that keep this honest and safe:

1. **Rip nothing.** Don't pull audio from YouTube or streaming services.
2. **Buy the tracks** from a store that allows personal use, and keep them
   local to your deployment only (this site is private and unindexed).
3. **Use your own recordings** — a favourite cover you recorded, a voice
   note, anything that is yours.

If a file is missing, the player shows a gentle "not available yet" message
and everything else keeps working — the experience is fully usable without
music, by design.

## Encoding tips

- Format: MP3 (H.264-free, plays everywhere).
- Keep each file under ~8 MB for fast mobile loading (128–192 kbps is plenty).
- Names are case-sensitive on Vercel: `khat.mp3`, not `Khat.mp3`.
