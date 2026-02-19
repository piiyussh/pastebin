const mongoose = require("mongoose");

const pasteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    pasteId: {
      type: String,
      unique: true
    },
    expiresAt: Date,
    maxViews: Number,
    views: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Paste", pasteSchema);
