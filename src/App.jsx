/* eslint-disable react/react-in-jsx-scope */
import { Routes, Route } from "react-router-dom";

//Pages
import Login from "./pages/Login";
import ChatRoomPortal from "./pages/ChatRoomPortal";
import Chat from "./pages/Chat";
import ChatDM from "./pages/ChatDM";
import CreateAccount from "./pages/CreateAccount";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ChatRoomPortal />} />
      <Route path="/ChatDM/:name" element={<ChatDM />} />
      <Route path="/Chat/:name" element={<Chat />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/CreateAccount" element={<CreateAccount />} />
    </Routes>
  );
}

export default App;
