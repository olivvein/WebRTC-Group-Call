import io from 'socket.io-client';
const sockets = io('https://showroom.samlepirate.org/', { autoConnect: true, forceNew: false });
//const sockets = io('/');
export default sockets;
