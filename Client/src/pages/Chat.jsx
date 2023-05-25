import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { allUsersRoute, host } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";

function Chat() {
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isContactSelected, setIsContactSelected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    apifn();
  }, []);

  const apifn = async () => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    } else {
      setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const userApi = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        } else {
          navigate("/setAvatar");
        }
      }
    };
    userApi();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
    setIsContactSelected(chat !== undefined);
  };

  return (
    <Container isContactSelected={isContactSelected}>
      <div className="container">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />
        {isLoaded && currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer
            currentChat={currentChat}
            currentUser={currentUser}
            socket={socket}
            onBack={() => handleChatChange(undefined)}
          />
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: "25% 75%"};
  }
  @media only screen and (max-width: 720px) {
    .container {
     height: 90vh;
    width: 100vw;
    position: fixed;
    bottom: 0;
    overflow: hidden;
      grid-template-columns: ${(props) =>
        props.isContactSelected ? "0% 100%" : "100% 0%"};
    }
  }
  @media only screen and (min-width: 721px) {
    .container {
      height: 90vh;
      width: 90vw;
      grid-template-columns: 25% 75%;
    }
  }
`;
export default Chat;
