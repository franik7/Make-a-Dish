const cloudinary = require("../middleware/cloudinary");
const Recipe = require("../models/Recipe");
const Favorite = require("../models/Favorite");
const Comment = require("../models/Comment");
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    try {
      // Since we have a session each request (req) constains the logged-in users info: req user
      // console.log(req.user) to see everything  
      // Grabbing just the posts of the logged-in user
      const recipes = await Recipe.find({ user: req.user.id });
      // Sending post data from mongodb and user data to ejs template
      res.render("profile.ejs", { recipes: recipes, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const recipes = await Recipe.find()
        .sort({ createdAt: "desc" })
        .populate("user", "userName") // Populate the 'user' field and only select the 'userName' property
        .lean();
  
      res.render("feed.ejs", { recipes: recipes });
    } catch (err) {
      console.log(err);
    }
  },
  getFavorites: async (req, res) => {
    try {
      // Since we have a session, each request (req) contains the logged-in user's info: req.user
      // Grabbing the favorite recipes of the logged-in user
      const favoriteRecipes = await Favorite.find({ user: req.user.id })
        .populate({
          path: "recipe",
          populate: {
            path: "user",
            select: "userName",
          },
        })
        .lean();
  
      // Sending favorite recipe data from MongoDB and user data to the ejs template
      res.render("favorites.ejs", { favoriteRecipes: favoriteRecipes, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  
 getRecipe: async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);

      // Fetch the user separately using the user ID from the recipe object
      const user = await User.findById(recipe.user);

      const userName = user.userName; // Extract the userName from the fetched user

      const comments = await Comment.find({ recipe: req.params.id }).sort({ createdAt: "desc" }).lean();

      res.render("recipe.ejs", { recipe: recipe, user: req.user, userName: userName, comments: comments });
    } catch (err) {
      console.log(err);
    }
  },


  createRecipe: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // media is stored on cloudianry - the above request responds with url to media and the media id that you will need when deleting content
      await Recipe.create({
        name: req.body.name,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        ingredients: req.body.ingredients,
        directions: req.body.directions,
        likes: 0,
        user: req.user.id,
      });
      console.log("Recipe has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  favoriteRecipe: async (req, res) => {
    try { 
      await Favorite.create({
        user: req.user.id,
        recipe: req.params.id,
      });
      console.log("Recipe has been added to favorites!");
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  likeRecipe: async (req, res) => {
    try {
      await Recipe.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteRecipe: async (req, res) => {
    try {
      // Find post by id
      let recipe = await Recipe.findById({ _id: req.params.id })
  
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(recipe.cloudinaryId);

        // Delete associated comments from the database
      await Comment.deleteMany({ recipe: recipe._id });
  
      // Delete post from db
      await Recipe.deleteOne({ _id: req.params.id });
      await Favorite.deleteMany({ recipe: req.params.id });
  
      console.log("Deleted Recipe");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
