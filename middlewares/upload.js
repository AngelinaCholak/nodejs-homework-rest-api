const path = require("node:path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);
    cb(null, path.join(__dirname, "..", "tmp"));
  },
});

module.exports = multer({ storage });
