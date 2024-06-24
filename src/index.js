const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const recipeRoutes = require("./routes/recipeRoutes");
const webRoutes = require("./routes/web");
const userRoutes = require("./routes/userRoutes");
const auth = require("./middleware/auth");
const setupSwagger = require("./swagger");

dotenv.config();
connectDB();

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
setupSwagger(app);
//Use routes
app.use("/api/recipes", auth, recipeRoutes);
app.use("/api/users", userRoutes);
app.use("/", webRoutes); //for rendering pages

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
module.exports = { app };
