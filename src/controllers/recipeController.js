const Recipe = require("../models/recipe");

// @desc    Create a new recipe
// @route   POST /api/recipes
// @access  Public (for demonstration; adjust as needed)
exports.createRecipe = async (req, res) => {
  const { title, ingredients, instructions, category } = req.body;
  const userId = req.user.id; // Assuming you have middleware to extract user ID from request
  try {
    const newRecipe = new Recipe({
      title,
      ingredients,
      instructions,
      category,
      userId,
    });
    const recipe = await newRecipe.save();
    res.json(recipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public (for demonstration; adjust as needed)
exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("userId", "username"); // Populate user details
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Get recipe by ID
// @route   GET /api/recipes/:id
// @access  Public (for demonstration; adjust as needed)
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      "userId",
      "username"
    ); // Populate user details
    if (!recipe) return res.status(404).json({ msg: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Update recipe by ID
// @route   PATCH /api/recipes/:id
// @access  Public (for demonstration; adjust as needed)
exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!recipe) return res.status(404).json({ msg: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Delete recipe by ID
// @route   DELETE /api/recipes/:id
// @access  Public (for demonstration; adjust as needed)
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndRemove(req.params.id);
    if (!recipe) return res.status(404).json({ msg: "Recipe not found" });
    res.json({ msg: "Recipe removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
