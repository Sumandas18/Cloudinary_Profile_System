const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const databaseConnection = require("./app/config/dbcon");
const rateLimiter = require("./app/utils/limiter");

databaseConnection();
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use("/blogUploads", express.static(path.join(__dirname, "/blogUploads")));

const authRoute = require("./app/routes/authRoute");
app.use(rateLimiter, authRoute);
const blogRoutes = require("./app/routes/blogRoute");
app.use(rateLimiter, blogRoutes);

const port = 4005;
app.listen(port, (error) => {
  if (error) {
    console.log("Error starting server:", error);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
