require("dotenv").config();
const {createServer} = require("node:http")
const {Server} = require("socket.io");
const express = require("express");

const app = express();
const server = createServer(app);

const io = new Server(server,{
    cors:{
        origin:"*",
    }
});

const ROOM = "group";

io.on('connection',(socket)=>{
    console.log("A user connected",socket.id);

    socket.on("joinRoom",async (userName)=>{
        console.log(`${userName} is joining the group.`);

       await socket.join(ROOM);

       //broadcast
       socket.to(ROOM).emit("roomNotice",userName);
    })

    socket.on("chatMessage",(msg)=>{
        socket.to(ROOM).emit("chatMessage",msg);
    });

    socket.on("typing",(userName)=>{
        socket.to(ROOM).emit("typing",userName);
    })
 
    socket.on("stopTyping",(userName)=>{
        socket.to(ROOM).emit("stopTyping",userName);
    })
})

const PORT = process.env.PORT || 2700;

server.listen(PORT,()=>{
    console.log(`server running at http://localhost:2700`);
})