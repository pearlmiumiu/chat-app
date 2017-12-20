import React, { Component } from 'react';
import Message from './Message';
import NewMessageEntry from './NewMessageEntry';
//import axios from 'axios';
import store,{fetchMessages} from '../store';

export default class MessagesList extends Component {

  constructor () {
    super();
    this.state = store.getState();
  }

  componentDidMount () {
    this.unsubscribe=store.subscribe(()=>{
      this.setState(store.getState()) //state inside store will be updated when listen to store.subscribe

    })

    const fetchMessagesThunk=fetchMessages();
    store.dispatch(fetchMessagesThunk)


    // axios.get('/api/messages')
    //   .then(res => res.data)
    //   .then(messages => {
    //     const gotMessagesAction=gotMessagesFromServer(messages)
    //     store.dispatch(gotMessagesAction)
    //   });
  }

 //if component no long on dom, we need to unsubscribe the listener to state, otherwise will throw error
  componentWillUnmount(){
    this.unsubscribe()

  }




  render () {

    const channelId = Number(this.props.match.params.channelId); // because it's a string "1", not a number!
    const messages = this.state.messages;
    const filteredMessages = messages.filter(message => message.channelId === channelId);

    

    return (
      <div>
        <ul className="media-list">
          { filteredMessages.map(message => <Message message={message} key={message.id} />) }
        </ul>
        <NewMessageEntry channelId={channelId}/> 
      </div>
    );
  }
}
