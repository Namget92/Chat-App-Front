/* eslint-disable react/react-in-jsx-scope */
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { username, password, email } from "../recoil/atom";
import "../style/App.css";
import socket from "../socket";

function CreateAccount() {
  const navigate = useNavigate();
  const [yourUsername, setYourUsername] = useRecoilState(username);
  const [yourPassword, setYourPassword] = useRecoilState(password);
  const [yourEmail, setYourEmail] = useRecoilState(email);
  const [response, setResponse] = useState({});

  useEffect(() => {
    socket.on("createAccountResponse", (data) => {
      setResponse(data);
    });
  }, []);

  function handleCreateAccount() {
    socket.emit("createAccount", {
      username: yourUsername,
      email: yourEmail,
      password: yourPassword,
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>Create Account</h2>
        <input
          name="username"
          value={yourUsername}
          placeholder="Username"
          type="text"
          onChange={(event) => setYourUsername(event.target.value)}
        />
        <input
          name="email"
          value={yourEmail}
          placeholder="Email"
          type="email"
          onChange={(event) => setYourEmail(event.target.value)}
        />
        <input
          name="password"
          value={yourPassword}
          placeholder="Password"
          type="password"
          onChange={(event) => setYourPassword(event.target.value)}
        />
        {!response.info ? "" : `${response.info}`}
        <button onClick={handleCreateAccount}>Confirm</button>
        {!response.success ? "" : <h4>Success! No go back to login page.</h4>}
        <button
          onClick={() => {
            navigate("/login");
          }}
        >
          Login page
        </button>
      </header>
    </div>
  );
}

export default CreateAccount;
