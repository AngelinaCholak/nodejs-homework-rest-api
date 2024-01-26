const express = require("express");
const logger = require("morgan");
const cors = require("cors");


const contactsRouter = require("./routes/api/contacts");
const authRoutes = require("./routes/api/users");
const avatarRoutes = require("./routes/api/avatars");


console.log(authRoutes); 
const app = express();

app.use("/avatars", express.static("public/avatars"));

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRoutes);
app.use("/api/users", avatarRoutes);


app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;




