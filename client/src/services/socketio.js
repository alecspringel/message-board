import socketIOClient from "socket.io-client";

const io = socketIOClient(process.env.REACT_APP_SERVER_URL, {
  withCredentials: true,
});

export default io;
