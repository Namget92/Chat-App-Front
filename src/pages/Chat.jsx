/* eslint-disable react/react-in-jsx-scope */
import { useRecoilState } from "recoil";
import { useNavigate, useParams } from "react-router-dom";
import InputEmoji from "react-input-emoji";
import "../style/App.css";
import { useEffect, useState } from "react";

import socket from "../socket";
import { username, token, socketId, chatType } from "../recoil/atom";

function Chat() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [yourToken, setYourToken] = useRecoilState(token);
  const [yourUsername, setYourUsername] = useRecoilState(username);
  const [yourSocketId, setYourSocketId] = useRecoilState(socketId);
  const [type, setType] = useRecoilState(chatType);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessage] = useState([]);
  const [active, setActive] = useState([]);

  useEffect(() => {
    socket.on("collectMessages", (data) => {
      setAllMessage(data);
    });
    socket.on("badToken", (data) => {
      console.log(data);
    });
    socket.on("noText", (data) => {
      console.log(data);
    });

    socket.on("leaved_room", (sender, receiver) => {
      console.log(`${sender} has left ${receiver}`);
    });
    socket.on("joining_room", (sender, receiver) => {
      console.log(`${sender} has joined ${receiver}`);
    });
    socket.on("disconnect", (reason) => {
      console.log(reason);
    });
  }, []);

  function goBack() {
    socket.emit("leave_room", yourUsername, name);
    navigate("/");
  }

  function handleMessage() {
    socket.emit("message", yourUsername, name, message, type);
    setMessage("");
  }

  useEffect(() => {
    if (yourToken === "") {
      console.log("Token is bad or is missing");
      navigate("/Login");
    }
    socket.emit("getMessages", name);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h3>{name}</h3>

        <div className="Text">
          {" "}
          {allMessages.map((message) => (
            <div className="chatbox" key={message.id}>
              {message.text ? (
                <div>
                  {" "}
                  <h5>{message.sender}</h5>
                  <p className="message">{message.text}</p>
                  <h5>{message.date}</h5>
                </div>
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
        <div className="fixed-content">
          <InputEmoji
            value={message}
            onChange={setMessage}
            cleanOnEnter
            onEnter={handleMessage}
            placeholder="Type a message"
          />
          <button onClick={handleMessage}>Send</button>
          <button onClick={goBack}>Back to chatportal</button>
        </div>
      </header>
    </div>
  );
}

export default Chat;
