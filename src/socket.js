import io from "socket.io-client";
const ENDPOINT = "https://tgt-chat-app-back.herokuapp.com/";
export default io(ENDPOINT);
