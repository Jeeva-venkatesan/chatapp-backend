// models/User.js
const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
});
module.exports = mongoose.model("User", UserSchema);

// models/Message.js
const MessageSchema = new mongoose.Schema({
    sender: String,
    room: String, // chat room id (group or 1-on-1)
    text: String,
    timestamp: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Message", MessageSchema);
