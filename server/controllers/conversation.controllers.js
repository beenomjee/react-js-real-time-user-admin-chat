import { Conversation } from "../db/index.js";

export const startConversation = async (req, res) => {
  try {
    const { member } = req.body;
    let conversation = await Conversation.findOne({
      $or: [
        { members: [member, req.user._id] },
        { members: [req.user._id, member] },
      ],
    });

    if (!conversation)
      conversation = await Conversation.create({
        members: [member, req.user._id],
      });

    return res.status(201).json(conversation);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};
