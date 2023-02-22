import { io } from 'socket.io-client';

class ServerController {
	constructor() {
		this.socket = io('https://cypher-gobelins.herokuapp.com/', { transports: ['websocket', 'polling', 'flashsocket'] });
	}

	emit(name, args) {
		this.socket.emit('CREATE_VIDEO', args);
	}
}

export { ServerController };
