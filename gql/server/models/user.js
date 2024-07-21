const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    name: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },

    images: {
      type: Array,
      default: [
        {
          url: "https://placehold.co/200x200.png?text=Profile",
          public_id: Date.now,
        },
      ],
    },
    about: {
      type: String,
    },
  },
  { timestamps: true }
); // created and update files will be updatef for eveyr user

module.exports = mongoose.model("User", userSchema);
  