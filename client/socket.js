import io from 'socket.io-client';
import store, {gotNewMessageFromServer} from './store';

const socket = io(window.location.origin);



socket.on('connect', () => {

  
  console.log('I am now connected to the server!');

  socket.on('new-message', message=>{
  	const action=gotNewMessageFromServer(message);
  	console.log('ddddddispatching', action)
  	store.dispatch(action);
	
   })


});




export default socket;
