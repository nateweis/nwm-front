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
    this.props.changeRoom(chat.chat)
    this.setState((pre) => {
      return{
        room: chat
      }
    })
  }

  static getDerivedStateFromProps(props, state){
    if(!state.chats || state.chats.length !== props.chats.length){
      return{chats: props.chats}
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
            <a onClick={()=>this.changeChat(chat)}>{chat.chat}</a><br/>
            </span>
          )
        }): "Loading....."}
        <Messages friends={this.props.friends} chat={this.state.room}/>
      </div>
    )
  }
}


export default AllChats
