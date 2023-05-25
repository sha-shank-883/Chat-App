const express = require("express");
const cors = require("cors");
// const path = require("path");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");
const app = express();
const Users = require("./model/userModel");

const socket = require("socket.io");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
// const BASE_URL = process.env.BASE_URL;

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

const server = app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("Client/build"));
// }

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(_dirname, " /Client/build")));
//   app.get(" * ", (req, res) => {
//     res.sendFile(path.join(_dirname, "Client", "build", "index.html"));
//   });
// } else {
//   app.get(" / ", (req, res) => {
//     res.send(" Api runnning ");
//   });
// }

const io = socket(server, {
  cors: {
    origin: "*",
    // origin: "http://localhost:3000",
    credentials: true,
  },
});
const onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });

  // io.on("connection", (socket) => {
  // Add the user to the online users list
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    // Update the user status in the database
    Users.findByIdAndUpdate(userId, { status: "online" }, { new: true })
      .then((updatedUser) => {
        console.log(`User ${updatedUser.username} is now online`);
        // Emit a socket event to update the online status of the user
        io.emit("user-online", userId);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  // Add a socket event to send the doc and save it in the database
  socket.on("send-doc", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      // Emit a socket event to send the doc
      socket.to(sendUserSocket).emit("doc-recieve", data.document);
      // Save the doc in the database
      messageRoute.saveDoc(data.document);
    }
  });

  socket.on("disconnect", () => {
    const userId = getUserIdBySocketId(socket.id);
    if (userId) {
      Users.findByIdAndUpdate(userId, { status: "offline" }, { new: true })
        .then((updatedUser) => {
          console.log(`User ${updatedUser.username} is now offline`);
          // Emit a socket event to update the offline status of the user
          io.emit("user-offline", userId);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });

  // Helper function to get the user ID by socket ID
  const getUserIdBySocketId = (socketId) => {
    for (const [userId, id] of onlineUsers.entries()) {
      if (id === socketId) {
        return userId;
      }
    }
    return null;
  };

  const userId = getUserIdBySocketId(socket.id);
  if (userId) {
    userModel
      .findByIdAndUpdate(userId, { status: "online" }, { new: true })
      .then((updatedUser) => {
        console.log(`User ${updatedUser.username} is now online`);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // Helper function to update the status of offline users
  const updateOfflineUsersStatus = () => {
    // Get the list of offline users
    Users.find({ status: "online" })
      .then((offlineUsers) => {
        // Update the status of offline users to "offline"
        offlineUsers.forEach((user) => {
          if (!onlineUsers.has(user._id.toString())) {
            user.status = "offline";
            user.save();
            io.emit("user-offline", user._id);
            console.log(`User ${user.username} is now offline`);
          }
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Call the updateOfflineUsersStatus function every 5 sec
  setInterval(updateOfflineUsersStatus, 5 * 1000);
});
