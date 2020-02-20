var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameSchema = new Schema({
	title:{
		type:String
	},
	price:{
		type:Number
	},
	description:{
		type:String
	},
	user:{
		type:String,
		required:true
	}
});

mongoose.model('games', GameSchema);