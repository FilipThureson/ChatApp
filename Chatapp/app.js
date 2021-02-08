const { Socket } = require('dgram')
const express = require('express')
const app = express()
const socket = require('socket.io')
const bodyParser = require('body-parser')
const ejs = require('ejs')


const server = app.listen(3000, ()=>{
    console.log("Server is online")
})

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
const io = socket(server)


app.get('/', (req, res)=>{
    res.render('index')
})
app.get('/rooms',(req, res)=>{

    res.render('rooms')
    io.once('connection', (socket)=>{
        console.log(socket.id+  " Connected to room " + req.query.roomName)
        socket.join(req.query.roomName)
        io.in(req.query.roomName).emit('joined', {
            handle: req.query.usrName
        })
        socket.on('chat', (data)=>{
            if(data.handle && data.message){
                io.in(data.room).emit('chat', data)
            }
        })
        socket.on('leave', (data)=>{
            io.in(data.room).emit('leave', data)
        })
        socket.on('disconnect',()=> {
            console.log(socket.id+ ' disconnected')
            socket.leave(req.query.roomName)
        });
    })
})

