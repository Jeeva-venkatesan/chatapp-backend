const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://jeevavenkatesan:123@cluster0.erhfphu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true, // this enables TLS
});

const Message = require("./model/User");
const User = require("./model/User");

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    socket.on("send_message", async (data) => {
        const newMsg = new Message(data);
        await newMsg.save();
        io.to(data.room).emit("receive_message", newMsg);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    });
});

app.get("/messages/:room", async (req, res) => {
    const messages = await Message.find({ room: req.params.room }).sort({ timestamp: 1 });
    res.json(messages);
});

server.listen(8080, () => {
    console.log("Server running on port 8080");
});
