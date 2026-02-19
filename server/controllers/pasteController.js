const Paste = require("../models/Paste");
const { nanoid } = require("nanoid");

exports.createPaste = async (req, res) => {
  try {
    const { content, expireMinutes, maxViews } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const pasteId = nanoid(6);

    let expiresAt = null;
    if (expireMinutes) {
      expiresAt = new Date(Date.now() + expireMinutes * 60000);
    }

    const paste = await Paste.create({
      content,
      pasteId,
      expiresAt,
      maxViews
    });

    res.json({
      url: `http://localhost:3000/paste/${pasteId}`
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getPaste = async (req, res) => {
  try {
    const paste = await Paste.findOne({ pasteId: req.params.id });

    if (!paste) {
      return res.status(404).json({ message: "Paste not found" });
    }

    // Time expiry check
    if (paste.expiresAt && paste.expiresAt < new Date()) {
      await Paste.deleteOne({ pasteId: req.params.id });
      return res.status(410).json({ message: "Paste expired" });
    }

    // View expiry check
    if (paste.maxViews && paste.views >= paste.maxViews) {
      await Paste.deleteOne({ pasteId: req.params.id });
      return res.status(410).json({ message: "View limit reached" });
    }

    paste.views += 1;
    await paste.save();

    res.json(paste);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
