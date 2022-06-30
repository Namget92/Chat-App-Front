import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import {
  username,
  users,
  token,
  recoilChats,
  socketId,
  chatType,
} from "../recoil/atom";
import "../style/App.css";
import { useEffect, useState } from "react";

function ChatRoomPortal() {
  const navigate = useNavigate();
  const [yourUsername, setYourUsername] = useRecoilState(username);
  const [yourToken, setYourToken] = useRecoilState(token);
  const [type, setType] = useRecoilState(chatType);
  const [contacts, setContacts] = useRecoilState(users);
  const [chats, setChats] = useRecoilState(recoilChats);
  const [yourSocketId, setYourSocketId] = useRecoilState(socketId);
  const [chatRoomName, setChatRoomName] = useState("");
  const [response, setResponse] = useState([]);
  const [chatsResponse, setChatsResponse] = useState([]);

  useEffect(() => {
    socket.on("getAllUsers", (data) => {
      setContacts(data.success);
      setResponse(data);
    });
    socket.on("getAllChats", (data) => {
      setChats(data.success);
      setChatsResponse(data);
    });
    socket.on("chatDeleted", (sender, receiver) => {
      updateAll();
      console.log(`${sender} deleted room - ${receiver}`);
    });
    socket.on("badToken", (data) => {
      console.log(data);
    });
    socket.on("joined_room", (sender, receiver) => {
      navigate(`/chat/${receiver}`);
    });
    socket.on("joined_DM_room", (sender, receiver) => {
      const items = [`${receiver}`, `${sender}`];
      const order = items.sort();
      navigate(`/chatDM/${order[0]} & ${order[1]}`);
    });
    socket.on("createChat", (sender, receiver) => {
      updateAll();
      setType("group");
      console.log(`${sender} created room - ${receiver}`);
    });
    socket.on("updateUsers", () => {
      updateAll();
    });
  }, []);

  useEffect(() => {
    if (yourToken === "") {
      console.log("Token is bad or is missing");
      navigate("/Login");
    }
    updateSocketId();
    updateAll();
  }, []);

  function wantAllUsers() {
    socket.emit("wantAllUsers", {
      username: yourUsername,
    });
  }
  function updateSocketId() {
    socket.emit("updateSocketId", yourSocketId, yourUsername);
  }
  function wantAllChats() {
    socket.emit("wantAllChats");
  }
  function joinRoom(room) {
    setType("group");
    socket.emit("join_room", yourUsername, room);
  }
  function joinDMroom(room) {
    setType("private");
    socket.emit("join_DM_room", yourUsername, room);
  }
  function createChat() {
    socket.emit("createChat", yourUsername, chatRoomName);
  }
  function deleteMe(room) {
    socket.emit("deleteMe", yourUsername, room);
  }
  function updateAll() {
    wantAllChats();
    wantAllUsers();
  }
  function refreshPage() {
    socket.emit("logoff", yourUsername);
    window.location.reload();
  }
  if (contacts == [] || chats == []) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hej {yourUsername}!</h1>
        <div>
          {
            <div>
              {response.success ? (
                <div>
                  <p>Direct Message:</p>
                  {contacts.map((user) => (
                    <button
                      onClick={() => {
                        joinDMroom(user.username);
                      }}
                      key={user.username}
                    >
                      {user.username}
                    </button>
                  ))}
                </div>
              ) : (
                ""
              )}
            </div>
          }
          {chatsResponse.success ? (
            <div>
              <p>Open Chats: </p>
              {chats.map((chat) => (
                <div key={chat.receiver} className="open-chats">
                  {" "}
                  <button
                    onClick={() => {
                      joinRoom(chat.receiver);
                    }}
                  >
                    {chat.receiver}
                  </button>
                  <button
                    className="del-button"
                    onClick={() => {
                      deleteMe(chat.receiver);
                    }}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          ) : (
            ""
          )}
        </div>
        <p>New Chat:</p>
        <input
          name="chatRoomName"
          value={chatRoomName}
          placeholder="Chat name"
          type="text"
          onChange={(event) => setChatRoomName(event.target.value)}
        />
        <button onClick={createChat}>New Chat</button>
        <button
          onClick={() => {
            updateAll();
          }}
        >
          Update
        </button>
        <button onClick={refreshPage}>Log off</button>
      </header>
    </div>
  );
}

export default ChatRoomPortal;
