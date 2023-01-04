const express = require("express");
const app = express();
// const http = require("http");
// const server = http.createServer(app);
const logHandler = require("./middleware/logs/log");
const connectSocket = require("./controllers/socket");
require("dotenv").config();
const NotFound = require("./middleware/handler/404");
const errorHandler = require("./middleware/handler/errorHandler");
const connectDB = require("./config/db");
const cors = require("cors");
const sample = require("./routes/sample");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/message");
const colors = require("colors");

// middleware

app.use(cors());
app.use(express.json());
app.use(logHandler);
// routes
app.use("/sample", sample);
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

app.use(errorHandler);
app.use(NotFound);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    const con = await connectDB();
    console.log(`MongoDB connected: ${con.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`${error}`.red.bold);
    process.exit();
  }
};

// connectSocket(server);

start();

const server = app.listen(port, () =>
  console.log(`Server is listening on port ${port}...`.green.bold)
);
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    // console.log(userData);
    socket.join(userData._id);
    // console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room:" + room);
  });

  socket.on("new message", (newMessage) => {
    var chat = newMessage.chat;
    if (!chat.users) return "chat.users not defined";
  });
});
