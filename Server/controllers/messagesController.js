const messageModel = require("../model/messageModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await messageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (data) return res.json({ msg: "Message added successfully." });
    return res.json({ msg: "failed to add message to the databse" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await messageModel
      .find({
        users: {
          $all: [from, to],
        },
      })
      .sort({ updatedAt: -1 });
    const projectMessages = messages.map((msg) => {
      return {
        id: msg._id,
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        // message: msg.message.doc,
        timestamp: msg.createdAt,
      };
    });
    res.json(projectMessages);
  } catch (ex) {
    next(ex);
  }
};

// module.exports.addDocMessage = async (req, res, next) => {
//   try {
//     const { from, to, doc } = req.body;
//     const data = await messageModel.create({
//       message: { doc },
//       users: [from, to],
//       sender: from,
//     });
//     if (data) return res.json({ msg: "Document added successfully." });
//     return res.json({ msg: "failed to add document to the databse" });
//   } catch (ex) {
//     next(ex);
//   }
// };

// // Function to send a doc in chat and save it in the database
// const sendDocInChatAndSave = (docPath, senderId) => {
//   // Read the file from the given path
//   const doc = fs.readFileSync(docPath);

//   // Create a new message object with the doc and sender id
//   const message = {
//     message: {
//       doc
//     },
//     sender: senderId
//   };

//   // Save the message in the database
//   Messages.create(message);
// };
