import React, { Component } from 'react';
import store,{writeMessage, postMessage} from '../store';
//import axios from 'axios';
import socket from '../socket';

export default class NewMessageEntry extends Component {
  constructor(){
    super();
    this.state=store.getState();
    this.handleChange=this.handleChange.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
  }

  componentDidMount(){
    this.unsubscribe=store.subscribe(()=>this.setState(store.getState()))
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  handleChange(event){
    const inputValue=event.target.value;
    const action=writeMessage(inputValue);
    store.dispatch(action)

  }

  handleSubmit(event){
    event.preventDefault();
    const content=this.state.newMessageEntry;
    const name=this.state.name;
    const channelId=this.props.channelId;
     
    const messageData={content, channelId, name}

    //console.log('%%%%%%%%%%%%%', messageData)

    const postMessageThunk=postMessage(messageData)
    store.dispatch(postMessageThunk)
    // axios.post('/api/messages', {content, channelId})
    //       .then(res=>res.data)
    //       .then(message=>{
    //         const action=gotNewMessageFromServer(message)
    //         store.dispatch(action)
    //         socket.emit('new-message', message)  //connect to socket connection on server index.js
    //       })

  }

  render () {
    return (
      <form id="new-message-form" onSubmit={this.handleSubmit}>
        <div className="input-group input-group-lg">
          <input
            onChange={this.handleChange}
            className="form-control"
            type="text"
            name="content"
            placeholder="Say something nice..."
          />
          <span className="input-group-btn">
            <button className="btn btn-default" type="submit">Chat!</button>
          </span>
        </div>
      </form>
    );
  }
}
