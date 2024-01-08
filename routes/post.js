// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;

const mongoose = require('mongoose');
// const plm = require('passport-local-mongoose');

// mongoose.connect('mongodb://localhost:27017/instagram',
//   { useNewUrlParser: true }
// );

const postSchema = mongoose.Schema({

  picture:String,
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
  },
  caption:String,
  date:{
    type:Date,
    default: Date.now()
  },
  likes: [
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    }
  ]
//   posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post"}],

});
// userSchema.plugin(plm);

module.exports = mongoose.model("post", postSchema);
