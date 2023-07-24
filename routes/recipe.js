const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const recipesController = require("../controllers/recipe");
const { ensureAuth } = require("../middleware/auth");

//Post Routes - simplified for now
//Since liked from server.js treat each path as:
//post/:id, post/createPost, post/likePost:id, post/deletePost
router.get("/:id", ensureAuth, recipesController.getRecipe);

//Enables user to create recipe with cloudinary for media uploads 
router.post("/createRecipe", upload.single("file"), recipesController.createRecipe);

//Enables user to favorite recipe  
router.post("/favoriteRecipe/:id", recipesController.favoriteRecipe);

// Route for displaying the favorite recipes
router.get("/", ensureAuth, recipesController.getFavorites);

//Enables user to like recipe. In controller, uses POST model to update likes by 1
router.put("/likeRecipe/:id", recipesController.likeRecipe);

//Enables user to delete recipe. In controller, uses POST model to delete recipe from MongoDB collection
router.delete("/deleteRecipe/:id", recipesController.deleteRecipe);






module.exports = router;
