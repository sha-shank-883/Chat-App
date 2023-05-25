import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { BiTrash, BiHome, BiXCircle } from "react-icons/bi";
// import Messages from "./Messages";
// import contacts from "./Contacts";
import axios from "axios";
import {
  getAllMessagesRoute,
  sendMessageRoute,
  // deleteMessageRoute,
  deleteUserProfileRoute,
} from "../utils/APIRoutes";

export default function ChatContainer({
  currentChat,
  currentUser,
  socket,
  onBack,
}) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  // const [onlineUsers, setOnlineUsers] = useState(new Set());
  const scrollRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fn = async () => {
      if (currentChat) {
        const response = await axios.post(getAllMessagesRoute, {
          from: currentUser._id,
          to: currentChat._id,
        });
        setMessages(response.data.reverse());
      }
    };
    fn();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      message: msg,
    });
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  const deleteUser = async () => {
    try {
      const response = await axios.delete(
        `${deleteUserProfileRoute}/${currentUser._id}`
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProfile = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your profile?"
    );
    if (confirmDelete) {
      deleteUser(currentUser._id); // pass the user ID as a parameter
      localStorage.removeItem("chat-app-user"); // remove the user data from localStorage
      navigate("/login"); // navigate to the login page
    }
  };

  useEffect(() => {
    const handleUserDeleted = (deletedUserId) => {
      if (deletedUserId === currentChat?._id) {
        window.location.reload();
      }
    };
    if (socket.current) {
      socket.current.on("user-deleted", handleUserDeleted);
    }
    return () => {
      if (socket.current) {
        socket.current.off("user-deleted", handleUserDeleted);
      }
    };
  }, [currentChat, socket]);

  // console.log(currentChat);
  // var moment = require("moment"); // require
  // moment().format();
  return (
    <>
      {currentChat && (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                  alt=""
                />
                <div className={`status ${currentChat.status}`}>
                  <div className="status-text">{currentChat.status}</div>
                </div>
              </div>
              <div className="username">
                <h3>{currentChat.username}</h3>
              </div>
            </div>
            {/* <button>Back</button> */}
            <Button onClick={onBack}>
              <BiHome />
            </Button>
            <Button onClick={handleDeleteProfile}>
              <BiTrash />
            </Button>
            <Logout />
          </div>
          {/* <Messages /> */}
          <div className="chat-messages">
            {messages.map((message) => {
              const time = message.timestamp;
              const moment = require("moment");
              const formattedTime = moment(time).format("h:mm A");
              return (
                <div ref={scrollRef} key={uuidv4()}>
                  <div
                    className={`message ${
                      message.fromSelf ? "sended" : "recieved"
                    }`}
                  >
                    <div className="content">
                      <p>{message.message}</p>
                    </div>
                    {/* <Button onClick={() => handleDeleteMsg(message._id)}>
                    <BiXCircle />
                  </Button> */}
                    <div className="time">{formattedTime}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  background-color: black;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 10% 80% 10%;
  }
  .chat-header {
    display: flex;
    background: #6262ff;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        position: relative;
        img {
          height: 3rem;
        }
        .status {
          position: absolute;
          bottom: 7px;
          right: 0px;
          width: 0.7rem;
          height: 0.7rem;
          border: 1px solid white;
          // background-color: #ff0000;
          background-color: #00ff00;
          border-radius: 50%;
        }
        .status.offline {
          position: absolute;
          bottom: 7px;
          right: 0px;
          width: 0.7rem;
          height: 0.7rem;
          border: 1px solid white;
          background-color: #ff0000;
          border-radius: 50%;
        }
        .status-text {
          margin: 2px 25px 0px 30px;
          font-size: 11px;
          text-align: center;
          text-transform: capitalize;
          font-weight: 300;
          font-family: initial;
          letter-spacing: 2px;
          color: #c2e8f7;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }

    .time {
      color: #e3d7c0;
      // float: right;
      font-size: 12px;
      font-weight: 200;
      margin: 10px 0px 0px 0px;
    }
    .sended {
      flex-direction: column;
      justify-content: flex-end;
      align-items: end;
      .content {
        background-color: #551b8fd6;
      }
    }
    .recieved {
      justify-content: flex-start;
      flex-direction: column;
      align-items: start;
      .content {
        background-color: #615c66d6;
      }
    }
  }
`;
const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 1rem;
  background-color: #26218b;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ffffff;
  }
  &:hover {
    svg {
      font-size: 1.4rem;
      color: red;
    }
  }
`;
