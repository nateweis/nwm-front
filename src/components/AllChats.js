import React, {Component} from 'react';

class AllChats extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chats:this.props.chats
    }
  }

  changeChat = (chat) => {
    this.props.changeRoom(chat)
  }

  componentDidMount(){
    this.props.getContacts()
  }
  render(){
    return(
      <div>
        {this.state.chats? this.state.chats.map((chat,index) => {
          return(
            <a onClick={()=>this.changeChat(chat.chat)} key={index}>{chat.chat}</a>
          )
        }): "Loading....."}
      </div>
    )
  }
}


export default AllChats
