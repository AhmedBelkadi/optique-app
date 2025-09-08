const express = require("express");
const next = require("next");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Serve uploads folder
  const uploadsPath = path.join(__dirname, "uploads");
  console.log(`📁 Serving uploads from: ${uploadsPath}`);
  
  // Add debugging middleware for uploads
  server.use("/uploads", (req, res, next) => {
    console.log(`📤 Static file request: ${req.url}`);
    console.log(`📁 Looking for file: ${path.join(uploadsPath, req.url)}`);
    next();
  }, express.static(uploadsPath, {
    index: false,
    dotfiles: 'ignore',
    etag: true,
    lastModified: true
  }));

  // Handle everything else with Next.js
  server.all(/.*/, (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`🚀 Server ready on http://localhost:${port}`);
  });
});
