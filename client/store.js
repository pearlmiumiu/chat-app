import {createStore, applyMiddleware} from 'redux';
import loggerMiddleware from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import axios from 'axios';

import socket from './socket';


//action types
const GOT_MESSAGES_FROM_SERVER='GOT_MESSAGES_FROM_SERVER';
const WRITE_MESSAGE='WRITE_MESSAGE';
const GOT_NEW_MESSAGE_FROM_SERVER='GOT_NEW_MESSAGE_FROM_SERVER';
const AUTHOR_NAME = 'AUTHOR_NAME';

//action creators
export function gotMessagesFromServer(messages){
	return {
		type: GOT_MESSAGES_FROM_SERVER,
		messages
	}
}

export function writeMessage(inputContent){
	return {
		type: WRITE_MESSAGE,
		newMessageEntry: inputContent
	}
}

export function gotNewMessageFromServer(message){
	return {
		type: GOT_NEW_MESSAGE_FROM_SERVER,
		message
	}
}

export const newAuthorName = (name) => {
  return {
    type: AUTHOR_NAME,
    name: name
  }
}

//thunk middleware
export function fetchMessages() {
  return function thunk(dispatch) {
    axios.get('/api/messages')
    .then(res => res.data)
    .then(messages => {

      const action = gotMessagesFromServer(messages);
      dispatch(action);
    });
  }
}

export function postMessage(messageData) {
  return function thunk(dispatch) {
    axios.post('/api/messages', messageData)
    .then(res => res.data)
    .then(newMessage => {
      //console.log('----------------', newMessage)
      dispatch(gotNewMessageFromServer(newMessage));


      socket.emit('new-message', newMessage);
      console.log('----------------', newMessage)
    });
  }
}




//initial state
const initialState={
	messages:[],
	newMessageEntry:'',
	name: ''  //for write message action. changes the input field
}

//reducer
function reducer(state=initialState, action){
	switch(action.type){
		case GOT_MESSAGES_FROM_SERVER:
			return Object.assign({}, state, {messages:action.messages})
		case WRITE_MESSAGE:
			return Object.assign({}, state, {newMessageEntry:action.newMessageEntry})
		case GOT_NEW_MESSAGE_FROM_SERVER:
			return Object.assign({}, state, {messages:[...state.messages, action.message]})  //messages:[...state.messages, action.message]
		case AUTHOR_NAME:
            return Object.assign({}, state, { name: action.name })
		default:
			return state;
	}
}

const middleware=applyMiddleware(loggerMiddleware, thunkMiddleware);

//store
const store=createStore(reducer, middleware)
export default store;

