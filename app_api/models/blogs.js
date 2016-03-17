var mongoose = require( 'mongoose' );
var mongoosefs = require('mongoose-fs');

var blogSchema = new mongoose.Schema({
  title: {type: String, required: true},
  author: {type: String, "default": "me"},
  description: String,
  body: {type: String, required: true},
  date_inserted: {type: Date, "default": Date.now},
  date_updated: {type: Date, "default": Date.now}
});

blogSchema.plugin(mongoosefs, {keys: ['media'], mongoose: mongoose});

//Compiles schema into model with given name. makes collection name lowercase plural name of model name = blogs
mongoose.model('Blog', blogSchema);
