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

  // changeing chatroom
  changeChat = (chat,index) => {
    this.props.changeRoom(chat)
    this.setState((pre) => {
      return{
        room: chat,
        chatIndex:index
      }
    })
  }

  // 3 methods for changing state arrays
  removeOneMessage = (arr,index) => {
    this.setState((pre) => {
      pre[arr].splice(index,1)
      return{[arr]:pre[arr]}
    })
  }

  addToArr = (arr,data) => {
    this.setState((pre) => {
      pre[arr] = [...pre[arr],data]
      return{[arr]: pre[arr]}
    })
  }

  fullArrUpdate = (arr, index, data) => {
    this.removeOneMessage(arr, index)
    this.addToArr(arr, data)
    console.log("hit this route");
  }

  // adding the props to state right away
  static getDerivedStateFromProps(props, state){
    if(!state.chats || state.chats.length !== props.chats.length){

      let room = {}
      let index = 0
      if(props.chats){
        for (let i = 0; i < props.chats.length; i++) {
          if(props.chats[i].current_room === props.chats[i].chat_id){
            room = props.chats[i]
            index = i
          }
        }
      }

      return{
        chats: props.chats,
        room: room,
        chatIndex: index
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
            <li onClick={()=>this.changeChat(chat,index)}>{chat.chat}</li>
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
        rmOne={this.props.rmOne}
        fullArrUpdate={this.props.fullArrUpdate}
        rmChat={this.removeOneMessage}
        chatIndex={this.state.chatIndex}
        editChat={this.fullArrUpdate}
        socket={this.props.socket}/>

      </div>
    )
  }
}


export default AllChats
