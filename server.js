require("dotenv").config({ path: "./env/.env" });

require("./db");
const app = require("./app");

app.listen(3000, () => {
  console.log("Server running. Use our API on port: 3000");
});
