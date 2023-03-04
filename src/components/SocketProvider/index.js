import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import {
  setSocketState,
  setMainInformation,
  setTableInformation,
  setRoomInformation,
  setGameState,
} from "../../store/slices/gameSlice";

const socket = io("localhost:5000");
export const socketHooks = {
  emitJoinGame: (data) => {
    socket.emit("joinGame", data);
  },
  emitCreateRoom: (data) => {
    socket.emit("createTable", data);
  },
  emitEnterRoom: (data) => {
    socket.emit("tableInfo", data);
  },
  emitJoinRoom: (data) => {
    socket.emit("takeSeat", data);
  },
  emitFold: (data) => {
    socket.emit("fold", data);
  },
  emitCall: (data) => {
    socket.emit("call", data);
  },
  emitCheck: (data) => {
    socket.emit("check", data);
  },
  emitRaise: (data) => {
    socket.emit("raise", data);
  },
  emitAllIn: (data) => {
    socket.emit("allIn", data);
  },
};
const SocketProvider = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    socket.on("connect", () => {
      dispatch(setSocketState(true));
    });
    socket.on("disconnect", () => {
      dispatch(setSocketState(true));
    });

    socket.on("userInfo", (res) => {
      dispatch(setMainInformation(res));
    });
    socket.on("lobbyInfo", (res) => {
      dispatch(setTableInformation(res));
    });
    socket.on("tableInfo", (res) => {
      console.log(res);
      dispatch(setRoomInformation(res));
    });
    socket.on("error", (res) => {});
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
    };
  }, []);
  return <>{props.children}</>;
};

export default SocketProvider;
