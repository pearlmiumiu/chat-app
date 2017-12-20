import io from 'socket.io-client';
import store, {gotNewMessageFromServer} from './store';

const socket = io(window.location.origin);

console.log('/////////////', 'got here')

socket.on('connection', () => {

  console.log('/////////////')
  console.log('I am now connected to the server!');

  socket.on('new-message', message=>{
  	const action=gotNewMessageFromServer(message);
  	store.dispatch(action);
	
   })


});




export default socket;
