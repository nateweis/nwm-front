import React, {Component} from 'react';
import Messages from './Messages'

class AllChats extends Component {
  constructor(props) {
    super(props)
    this.state = {
      room:{}
    }
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

      // let room = {}
      // for (let target of props.chats) {
      //   if(target.current_room === target.chat_id){
      //     room = target
      //   }
      // }

      return{
        chats: props.chats
        // room: room
      }
    }
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
            <p onClick={()=>this.changeChat(chat)}>{chat.chat}</p>
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
