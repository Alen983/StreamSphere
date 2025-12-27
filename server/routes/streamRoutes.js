const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

module.exports = (app) => {
app.get("/movies/watch", (req, res) => {
  // assume user is premium for demo
  const videoPath = path.join(
    __dirname,
    "uploads/videos/trial.mp4"
  );
  const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

   if (!range) {
  res.writeHead(200, {
    "Content-Length": fileSize,
    "Content-Type": "video/mp4",
  });
  fs.createReadStream(videoPath).pipe(res);
  return;
}

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    });

    file.pipe(res);
  });
};