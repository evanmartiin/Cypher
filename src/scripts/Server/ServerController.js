import { io } from 'socket.io-client';

class ServerController {
	constructor() {
		this.socket = io('https://cypher-gobelins.herokuapp.com/', { transports: ['websocket', 'polling', 'flashsocket'] });
	}

	emit(name, args) {
		this.socket.emit(name, args);
	}

	on(name, callback) {
		this.socket.on(name, callback);
	}

	off(name, callback) {
		this.socket.off(name, callback);
	}
}

export { ServerController };
