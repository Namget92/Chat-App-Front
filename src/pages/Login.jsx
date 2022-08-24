/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import { username, password, token, socketId } from "../recoil/atom";
import "../style/App.css";

function Login() {
  const navigate = useNavigate();
  const [yourUsername, setYourUsername] = useRecoilState(username);
  const [yourPassword, setYourPassword] = useRecoilState(password);
  const [yourSocketId, setYourSocketId] = useRecoilState(socketId);
  const [yourToken, setYourToken] = useRecoilState(token);
  const [response, setResponse] = useState({});

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected with server");
      setYourSocketId(socket.id);
    });
    socket.on("loginResponse", (data) => {
      if (data.token) {
        setYourToken(data.token);
        navigate("/");
      }
      if (data.info) {
        setResponse(data);
      }
    });
  }, []);

  function handleLogin() {
    socket.emit("login", {
      username: yourUsername,
      password: yourPassword,
    });
  }

  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <div className="App">
      <header className="App-header">
        <h2>Login</h2>
        <input
          name="username"
          value={yourUsername}
          placeholder="Username"
          type="text"
          onChange={(event) => setYourUsername(event.target.value)}
        />
        <input
          name="password"
          value={yourPassword}
          placeholder="Password"
          type="password"
          onChange={(event) => setYourPassword(event.target.value)}
        />
        {!response.info ? "" : `${response.info}`}
        <button onClick={handleLogin}>Confirm</button>

        <button
          onClick={() => {
            navigate("/CreateAccount");
          }}
        >
          Create Account
        </button>
      </header>
    </div>
  );
}

export { token };
export default Login;
