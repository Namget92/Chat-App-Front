import { atom } from "recoil";

export const username = atom({
  key: "username",
  default: "",
});
export const boolean = atom({
  key: "boolean",
  default: true,
});
export const email = atom({
  key: "email",
  default: "",
});
export const password = atom({
  key: "password",
  default: "",
});
export const token = atom({
  key: "token",
  default: "",
});
export const users = atom({
  key: "users",
  default: [],
});
export const recoilChats = atom({
  key: "recoilChats",
  default: [],
});
export const socketId = atom({
  key: "socketId",
  default: "",
});
export const chatType = atom({
  key: "chatType",
  default: "group",
});
