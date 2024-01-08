var app = require('express')();
var http = require('http').createServer(app);
var cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['cassandra-service'], localDataCenter: 'europe-west2' });
var io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});
var cors = require('cors');
const Client  = require('socket.io');

app.use(cors({
    origin: '*',
}));

io.on('connection', async (socket) => {
    console.log('User Online, Socket =', socket.id);

    socket.on('canvas-data', (data) => {
        socket.broadcast.emit('canvas-data', data);
    });

    socket.on('objectCreated', async (object) => {
        //Converts object to string 
        const ObjectString = JSON.stringify(object);

        //Saves converted string to Cassandra DB
        try{
            await client.execute(`UPDATE canvas_state SET state = ?`,[ObjectString]);
        }catch(error){
            console.error('Failed to save the last object to cassandra',error);
        }
    });
});


var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
http.listen(server_port, () => {
    console.log("Started on : "+server_port);
})