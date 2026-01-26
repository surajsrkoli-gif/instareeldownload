const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const ytdlp = require("yt-dlp-exec");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.json({ status: "✅ Backend Running (yt-dlp-exec)" });
});

app.post("/download", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || !url.includes("instagram.com")) {
      return res.status(400).json({ error: "❌ Invalid Instagram URL" });
    }

    const fileName = reel_${Date.now()}.mp4;
    const outputPath = path.join(__dirname, fileName);

    // ✅ Download video using yt-dlp
    await ytdlp(url, {
      output: outputPath,
      format: "mp4"
    });

    // ✅ Send file to user
    res.download(outputPath, "reel.mp4", (err) => {
      if (err) console.log(err);
      // ✅ delete after download
      fs.unlink(outputPath, () => {});
    });

  } catch (error) {
    return res.status(500).json({
      error: "❌ Download failed (Try public reel link)",
      details: error.message
    });
  }
});

// ✅ Render uses dynamic PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("✅ Server running on port:", PORT);
});