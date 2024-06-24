const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");
const auth = require("../middleware/auth");

const userController = require("../controllers/userController");
const recipeController = require("../controllers/recipeController");
// Home page route

router.get("/", auth, async (req, res) => {
  try {
    const recipes = await Recipe.find(); // Fetch recipes
    const isLoggedIn = req.user ? true : false; // Check if user is authenticated
    res.render("index", { recipes, isLoggedIn }); // Pass recipes and isLoggedIn to template
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
router.get("/register", (req, res) => {
  res.render("signup");
});

// Render login page
router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/logout", (req, res) => {
  res.clearCookie("token"); // Clear the 'token' cookie
  res.redirect("/login"); // Redirect to the login page
});
router.get("/addRecipe", (req, res) => {
  res.render("addRecipe");
});
router.get("/updateRecipe", (req, res) => {
  try {
    const recipe = Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).send("Recipe not found");
    }
    res.render("update", { recipe });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
