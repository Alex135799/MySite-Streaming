var mongoose = require( 'mongoose' );
var mongoosefs = require('mongoose-fs');

var eventSchema = new mongoose.Schema({
  title: {type: String, required: true},
  author_id: {type: String, required: true},
  author_name: {type: String, required: true},
  description: String,
  allDay: Boolean,
  start: {type: Date, "default": Date.now},
  end: Date,
  url: String,
  color: String,
  authorized_users: [{type: String, required: true}],
  date_inserted: {type: Date, "default": Date.now},
  date_updated: {type: Date, "default": Date.now}
});

eventSchema.plugin(mongoosefs, {keys: ['media'], mongoose: mongoose});

//Compiles schema into model with given name. makes collection name lowercase plural name of model name = blogs
mongoose.model('Event', eventSchema);
