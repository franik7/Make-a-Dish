const Comment = require("../models/Comment");

module.exports = {
  createComment: async (req, res) => {
    try {
      const commentData = {
        comment: req.body.comment,
        recipe: req.params.id,
        username: req.user.userName, // Save the username in the commentData
      };
  
      await Comment.create(commentData);
  
      console.log("Comment has been added!");
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  }
}
