import React, {Component} from 'react'

class Messages extends Component {
  constructor(props) {
    super(props)
    this.state = {
      friendName:[],
      friendId:[]
    }
  }
  static getDerivedStateFromProps(props, state){
    if(!(state.chat && props.chat )|| state.chat.chat !== props.chat.chat){
      return{chat: props.chat}
    }
  }

  addFriends = () => {
    this.setState({form:true})
  }

  addList = (friend) => {
    if(this.state.friendName.indexOf(friend.username) === -1){
      this.setState({
        friendName:[friend.username,...this.state.friendName],
        friendId:[friend.id, ...this.state.friendId]
      })
    }

  }

  handleSubmit = () => {



    this.setState({
      form:false,
      friendName:[],
      friendId:[]
    })
  }

  render(){
    return(
      <div>
        <h3>Messages for {this.state.chat? this.state.chat.chat: '.....' } Room</h3>
        {this.state.chat? this.state.chat.admin? <button onClick={this.addFriends}>Add Friends to the Chat</button>:"" :""}
        {this.state.form? <div>
            <div>
            {this.props.friends.map((friend,index) => {
              return(
                <span key={index}>
                {friend.username} <button onClick={()=> this.addList(friend)}>+</button>
                <br/>
                </span>
              )
            })}
            </div>
            <div>
              <button onClick={this.handleSubmit}>Submit</button>
              {this.state.friendName.map((friend,index) => {
                return(
                  <span key={index}>
                  {friend} <br/>
                  </span>
                )
              })}
            </div>
          </div>
        :""}
      </div>
    )
  }
}

export default Messages
