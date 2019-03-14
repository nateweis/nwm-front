import React, {Component} from 'react';
import Messages from './Messages'

class AllChats extends Component {
  constructor(props) {
    super(props)
    this.state = {
      room:{}
    }
  }

  makePrivateRoom = (friend) => {
    const uniqeRoom = {
      chat:(friend + this.props.currentUser.id) + "",
      id: this.props.currentUser.id,
      chat_id: 0 - (friend + this.props.currentUser.id)
    }
    this.changeChat(uniqeRoom)
  }

  changeChat = (chat) => {
    this.props.changeRoom(chat)
    this.setState((pre) => {
      return{
        room: chat
      }
    })
  }

  static getDerivedStateFromProps(props, state){
    if(!state.chats || state.chats.length !== props.chats.length){

      let room = {}
      if(props.chats){
        for (let target of props.chats) {
          if(target.current_room === target.chat_id){
            room = target
          }
        }
      }

      return{
        chats: props.chats,
        room: room
      }
    }else{return null}
  }

  componentDidMount(){
    this.props.getContacts()

  }
  render(){
    return(
      <div>
      <h2>Chat Rooms</h2>
        {this.state.chats? this.state.chats.map((chat,index) => {
          return(
            <span key={index}>
            <li onClick={()=>this.changeChat(chat)}>{chat.chat}</li>
            </span>
          )
        }): "Loading....."}

        <h2>Private Message</h2>
        {this.props.friends? this.props.friends.map((friend,index) => {
          return(
            <span key={index}>
              <li onClick={()=> this.makePrivateRoom(friend.contact_id)}>{friend.username}</li>
            </span>
          )
        }): "Loading....."}

        <Messages
        currentUser={this.props.currentUser}
        friends={this.props.friends}
        chat={this.state.room}
        messages={this.props.messages}
        socket={this.props.socket}/>

      </div>
    )
  }
}


export default AllChats
