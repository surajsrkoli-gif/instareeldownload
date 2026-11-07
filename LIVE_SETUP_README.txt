AUTO SLICE — YouTube Live runner

Add Dockerfile and server.js to the ROOT of your existing GitHub repository. Keep index.html.
In Hostless Settings choose Build System = Docker (Dockerfile at repository root), Working Directory = /.
Add YOUTUBE_STREAM_KEY as a Hostless secret/environment variable. NEVER put the key in GitHub or chat.
This runner opens index.html in Chromium at 540x960, captures it with FFmpeg, and sends it to YouTube RTMP.
It currently sends SILENT AUDIO because your current HTML has no sound effects/audio system.
Your earlier Hostless screen showed free capacity 0 CPU / 0 MB RAM. Do not deploy paid resources without checking cost and approval.
This requires Docker support, a persistent process, and outbound RTMP access from Hostless. Deployment success alone does not prove YouTube is receiving video. Verify in YouTube Studio > Go Live.
