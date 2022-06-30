import { useRecoilState } from "recoil";
import InputEmoji from "react-input-emoji";
import { useNavigate } from "react-router-dom";
import "../style/App.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";
import { username, token, socketId, chatType } from "../recoil/atom";

function Chat() {
  let { name } = useParams();
  const navigate = useNavigate();
  const [yourToken, setYourToken] = useRecoilState(token);
  const [yourUsername, setYourUsername] = useRecoilState(username);
  const [yourSocketId, setYourSocketId] = useRecoilState(socketId);
  const [type, setType] = useRecoilState(chatType);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessage] = useState([]);

  useEffect(() => {
    socket.on("collectDMMessages", (data) => {
      setAllMessage(data);
    });
    socket.on("badToken", (data) => {
      console.log(data);
    });
    socket.on("noText", (data) => {
      console.log(data);
    });

    socket.on("disconnect", (reason) => {
      console.log(reason);
    });
  }, []);

  function goBack() {
    socket.emit("leave_DM_room", yourUsername, name);
    navigate("/");
  }

  function handleMessage() {
    socket.emit("DMmessage", yourUsername, name, message, type);
    setMessage("");
  }

  useEffect(() => {
    if (yourToken === "") {
      console.log("Token is bad or is missing");
      navigate("/Login");
    }
    socket.emit("getDMMessages", yourUsername, name);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>{name}</h1>
        <div className="Text">
          {allMessages.map((message) => (
            <div key={message.id}>
              {message.text ? (
                <div className="chatbox">
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
