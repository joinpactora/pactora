# RelayWorks intro video (90 s, 1920×1080, 30 fps)

- `relayworks-intro.mp4` is the finished video.
- `intro.html` is the timeline. Serve the repo root and open `/video/intro.html`, then click to play it with sound, or add `?t=42` to jump to a moment.
- `soundtrack.py` synthesizes `soundtrack.wav` (numpy and scipy), with cues timed to the timeline.
- `render.mjs` renders frames in headless Chrome and pipes them into ffmpeg.

Rebuild from the repo root:

```sh
python -m http.server 8779            # leave it running
python video/soundtrack.py video/soundtrack.wav
FF=$(python -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
node video/render.mjs http://127.0.0.1:8779/ "$FF" part.mp4 0 2700   # or split into ranges and run them in parallel
"$FF" -i part.mp4 -i video/soundtrack.wav -vf "scale=in_range=pc:out_range=tv,format=yuv420p" -c:v libx264 -crf 18 -c:a aac -b:a 256k -shortest -movflags +faststart video/relayworks-intro.mp4
```
