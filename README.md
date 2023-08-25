# Battleship Server

This is the Socket.io server for handling multiplayer functionality.

[Front-end repo](https://github.com/ShirshoDipto/battleship)

## Running Locally

To run the front-end locally, follow the instructions on the [Front-end Repository](https://github.com/ShirshoDipto/battleship).

### Clone repository

```
git clone git@github.com:ShirshoDipto/battleship-server.git
```

```
cd battleship-server
```

### Set up environment variables

```
NODE_ENV = production

PORT = <A port for local address, e.g 5000>

CLIENT_ORIGINAL = <Address of the client. https:/shirshodipto.github.io/battleship>

CLIENT_LOCAL = <Address of locally running front-end (if andy), e.g http://127.0.0.1:5501>

SERVER = <Address of the this server. https://battleship-server-lq6d.onrender.com or local address, e.g http://localhost:5000>
```

### Install packages and start server

```
npm install
```

```
npm start
```
