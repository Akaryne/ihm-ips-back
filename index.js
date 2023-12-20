const socketIo = require('socket.io');
const http = require('http');
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

const server = http.createServer();
const io = socketIo(server, {cors: {origin: '*', methods: ['GET', 'POST']}});
const port = 8080;

const usbPort = new SerialPort({ path: 'COM9', baudRate: 115200 })
const parser = new ReadlineParser({ delimiter: '\n\r' })
usbPort.pipe(parser)


io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté',socket.id);

    parser.on('data', (data) => {
        console.log(data)
        socket.emit("getData",data)
    })

    socket.on('setSpeed', (data) => {
        console.log(data)
        usbPort.write(`V${data.speed}#`)
    })

    socket.on('disconnect', (data) => {
        console.log("Un utilisateur s'est déconnecté",socket.handshake.address);
    })
})

server.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
  });