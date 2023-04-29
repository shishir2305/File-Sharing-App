const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();

// Set up multer middleware to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  const directoryPath = path.join(__dirname, "uploads");
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return res.status(500).send("Error getting files");
    }
    const fileInfos = [];
    files.forEach(function (file) {
      const filePath = path.join(directoryPath, file);
      const fileInfo = {
        name: file,
        size: fs.statSync(filePath).size,
        date: fs.statSync(filePath).mtime,
      };
      fileInfos.push(fileInfo);
    });
    res.json(fileInfos);
  });
});

app.get("/uploaddocs", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Set up route for uploading files
app.post("/upload", upload.single("file"), (req, res) => {
  res.send("File uploaded successfully");
});

// Set up route for downloading files
app.get("/download/:filename", (req, res) => {
  const file = path.join(__dirname, "uploads", req.params.filename);
  res.download(file);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
