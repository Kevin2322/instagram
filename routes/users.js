// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;

const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost:27017/instagram',
  { useNewUrlParser: true }
);

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  name:String,
  email:String,
  profileImage:String,
  bio:String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post"}],

});
userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);
