import React, {Component} from 'react'

class Messages extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  static getDerivedStateFromProps(props, state){
    console.log(props);
    console.log("=========================");
    console.log(state);
    if(!(state.chat && props.chat )|| state.chat.chat !== props.chat.chat){
      return{chat: props.chat}
    }
  }

  addFriends = () => {

  }

  render(){
    return(
      <div>
        <h3>Messages for .... Room</h3>
        {this.state.chat? this.state.chat.admin? <button>Add Friends to the Chat</button>:"" :""}
      </div>
    )
  }
}

export default Messages
