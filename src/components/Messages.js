import React, {Component} from 'react'

class Messages extends Component {
  constructor(props) {
    super(props)
    this.state = {
      friendName:[],
      friendId:[],
      newMsg:''
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
        friendId:[friend.contact_id, ...this.state.friendId]
      })
    }

  }

  handleSubmit = () => {
      const obj = {
        userArr: this.state.friendId,
        chat_id: this.state.chat.chat_id
      }
      fetch('http://localhost:3000/chats/many',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      .then((res) => {
        res.json()
        .then((data) => {
          console.log(data);
        },(err) => {
          console.log(err);
        })
      })

    this.setState({
      form:false,
      friendName:[],
      friendId:[]
    })
  }

  handleChange = (e) => {
    this.setState({newMsg:e.target.value})
  }

  submit = (e) => {
    e.preventDefault()
    const obj = {
      msg:this.state.newMsg,
      sender:this.props.currentUser.username,
      chat_id: this.state.chat.chat_id,
      user_id: this.props.currentUser.id
    }
    this.props.socket(obj)
    this.setState({newMsg:''})
  }

  closeForm = () => {
    this.setState({
      form:false,
      friendName:[],
      friendId:[]
    })
  }

  pop = (index) => {
    this.setState((pre) => {
      pre.friendName.splice(index,1)
      pre.friendId.splice(index,1)
      return{
        friendName: pre.friendName,
        friendId: pre.friendId
      }
    })
  }

  render(){
    return(
      <div>
        <h3>Messages for {this.state.chat? this.state.chat.chat: '.....' } Room</h3>
        {this.state.chat? this.state.chat.admin? <button onClick={this.addFriends}>Add Friends to the Chat</button>:"" :""}
        {this.state.form? <div>
            <div className="addFriend">
            {this.props.friends.map((friend,index) => {
              return(
                <span key={index}>
                {friend.username} <button onClick={()=> this.addList(friend)}>+</button>
                <span onClick={this.closeForm}>X</span>
                <br/>
                </span>
              )
            })}
            </div>
            <div className="addedFriend">
              <button onClick={this.handleSubmit}>Submit</button>
              {this.state.friendName.map((friend,index) => {
                return(
                  <span key={index}>
                  {friend} <span onClick={()=>this.pop(index)}>  X</span><br/>
                  </span>
                )
              })}
            </div>

          </div>
        :""}

        <div className="messages">
          {this.props.messages.map((message, index) => {
            return(
              <div key={index}>
              <strong>
              {message.sender === this.props.currentUser.username? "You" : message.sender}
              </strong> : {message.message}
              </div>
            )
          })}
          <form onSubmit={this.submit}>
            <input
              type="text"
              value={this.state.newMsg}
              placeholder="New Message"
              onChange={this.handleChange}
            />
            <input type='submit'/>
          </form>
        </div>

      </div>
    )
  }
}

export default Messages
