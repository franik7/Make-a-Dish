const Comment = require("../models/Comment");

module.exports = {
  createComment: async (req, res) => {
    try {
      await Comment.create({
        comment: req.body.comment,
        likes: 0,
        recipe: req.params.id,
      });
      console.log("Comment has been added!");
      res.redirect("/recipe/"+req.params.id);
    } catch (err) {
      console.log(err);
    }
  }
};

