
const {Schema, model,Types} = require("mongoose");
  
  const UserSchema = new Schema({
    username: {type : String},
    email: { type: String, unique: true },
    password: { type: String, require: true }
   
  });
  
  const UserModel = model('User', UserSchema) //schema converted to model
  
  module.exports = UserModel