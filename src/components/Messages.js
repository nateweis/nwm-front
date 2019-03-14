import React, {Component} from 'react'

class Messages extends Component {
  constructor(props) {
    super(props)
    this.state = {
      friendName:[],
      friendId:[],
      newMsg:'',
      options:false,
      newName:'',
      participants:[],
      edit:''
    }
  }
  static getDerivedStateFromProps(props, state){
    if(!(state.chat && props.chat )|| state.chat.chat !== props.chat.chat){
      return{chat: props.chat}
    }
  }

  // opens the form for adding ppl to the chat
  addFriends = () => {
    this.setState({form:true})
  }

  // putts the friends in a list ready to send over to be added to the chat
  addList = (friend) => {
    if(this.state.friendName.indexOf(friend.username) === -1){
      this.setState({
        friendName:[friend.username,...this.state.friendName],
        friendId:[friend.contact_id, ...this.state.friendId]
      })
    }

  }

  // Submits the list to the database
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

  // typing in the message box
  handleChange = (e) => {
    this.setState({newMsg:e.target.value})
  }
  // submitting the message to the chat
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

  // closes the add friend form without adding anyone
  closeForm = () => {
    this.setState({
      form:false,
      friendName:[],
      friendId:[]
    })
  }

  // removes the friend from the q of ppl being added to the chat
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

  // warning pop up before removing a chat
  warning = () => {
    this.setState({warning:true})
  }
  cancelNuke = () => {
    this.setState({warning:false})
  }

  // as admin completely end the chat for everyone
  nukeChat = () => {
    const id = this.state.chat.chat_id
    fetch('http://localhost:3000/chats/'+id,{
      method: 'DELETE',
      headers:{
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'},
      credentials: 'include'
    })
    .then((res) => {
      res.json()
      .then((data) => {
        console.log(data);
      },(err) => {
        console.log(err);
        console.log("couldnt get delete data");
      })
    })
    this.cancelNuke()
  }

  // as admin, rename the chat
  chatRename = () => {
    this.setState({
      chatRename:true,
      newName: this.state.chat.chat
    })
  }

  handleRenameChange = (e) => {
    this.setState({newName:e.target.value})
  }

  // sumits the new chat name
  submitNewName = (e) => {
    e.preventDefault()
    // sends the info to backend
    const obj = {
      id: this.state.chat.chat_id,
      chat: this.state.newName
    }
    fetch('http://localhost:3000/chats',{
      method:'PUT',
      body:JSON.stringify(obj),
      headers:{
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'},
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

    this.setState({chatRename:false})
  }

  // get the chat participants
  getChatParticipants = () => {
    const id = this.state.chat.chat_id
    fetch('http://localhost:3000/chats/members/'+id)
    .then((res) => {
      res.json()
      .then((data) => {
        this.setState({participants:data})
      },(err) => {
        console.log(err);
        console.log("getting chatroom members has frontend problems");
      })
    })
  }

  // kick guy out of chat
  kickOutOfChat = (member,index) => {
    const obj = {
      user:member,
      chat:this.state.chat.chat_id
    }
    fetch('http://localhost:3000/chats/remove/member',{
      method:'DELETE',
      body:JSON.stringify(obj),
      headers:{
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'},
      credentials: 'include'
    })
    .then((res) => {
      res.json()
      .then((data) => {
        console.log(data);
        this.setState((pre) => {
          pre.participants.splice(index,1)
          return{participants:pre.participants}
        })
      },(err) => {
        console.log(err);
        console.log("couldnt remove person from chat frontend");
      })
    })

  }

  // user can edit any of there messages
  editOneMessage = (message) => {
    this.setState({
      editMessage:true,
      edit: message.message,
      msgId: message.id
    })
  }

  handleMessageEdit = (e) => {
    this.setState({edit:e.target.value})
  }

  editMessageSubmit = (e) => {
    e.preventDefault()

    const obj = {edit:this.state.edit}
    fetch('http://localhost:3000/messages/'+ this.state.msgId,{
      method:'PUT',
      body:JSON.stringify(obj),
      headers:{
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'},
      credentials: 'include'
    })
    .then((res) => {
      res.json()
      .then((data) => {
        console.log(data);
      },(err) => {
        console.log("edit message no go on front");
      })
    })

    this.setState({editMessage:false})
  }

  // user can delete their own messages
  removeOneMessage = (msg) => {
    fetch('http://localhost:3000/messages/'+ msg.id,{
      method:'DELETE',
      credentials: 'include'
    })
    .then((res) => {
      res.json()
      .then((data) => {
        console.log(data);
      },(err) => {
        console.log("prob on front deleting message");
      })
    })
  }

  // addmins open/close their chat options
  optionMenu = () => {
    this.setState((pre) => {
      pre.options = !pre.options
      return{options:pre.options}
    })
    this.closeForm()
    this.getChatParticipants()
  }

  render(){
    return(
      <div>
      {/*==================================================
                    The header and option buttons
        ==================================================*/}
        <h3>Messages for {this.state.chat? this.state.chat.chat: '.....' } Room</h3>
        {/* option button for now just for admin need to make for everyone*/}
        {this.state.chat.admin? <button onClick={this.optionMenu}>Options</button> : ''}
        {this.state.chat? this.state.options? <div>
          {/* add frinds to chat (just for admin) */}
            <button onClick={this.addFriends}>Add Friends to the Chat</button>
            {/* rename/delte chat (just for admin) */}
            <button onClick={this.chatRename}>Rename Chat</button>
            <button onClick={this.warning}>Remove Chat</button>
            {/* shows group members (4everyone) */}
            <h4>Participants in "{this.state.chat.chat}" Room</h4>
            {this.state.participants.map((member, index) => {
              return(
                <div key={index}>
                  <li>{member.username}
                  {this.state.chat.admin? member.id !== this.props.currentUser.id?
                    <button onClick={()=> this.kickOutOfChat(member.id,index)}>Kick From Chat</button> : "":""}
                  </li>
                </div>
              )
            })}
          </div> :"" :""}

          {/*==================================================
                  The from to add friends to the chatroom
            ==================================================*/}

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

        {/*==================================================
                      The actual chat messages
          ==================================================*/}

        <div className="messages">
          {this.props.messages.filter( str => str.chat_id === this.props.currentUser.current_room ).map((message, index) => {
            return(

                <div key={index}>
                <strong>
                {message.user_id === this.props.currentUser.id? "You" : message.sender}
                </strong> : {message.message}

                {message.user_id === this.props.currentUser.id? <span>
                <button onClick={()=>this.editOneMessage(message)}>Edit</button>
                 <button onClick={()=>this.removeOneMessage(message)}>Remove</button>
                 </span>:''}

                </div>

            )
          })}

          {/*==================================================
                    The form to add a new message
            ==================================================*/}

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

        {/*==================================================
      A modual that pops up to give warning before deleting a chat
          ==================================================*/}

        {this.state.warning? <div className="warning-model">
            <p>Are you sure you want to delete
            {this.state.chat.chat} chat room?</p>
            <button onClick={this.cancelNuke}>No</button> <button onClick={this.nukeChat}>Yes</button>
          </div>:""}

          {/*==================================================
                      A modual for renaming the chat
            ==================================================*/}
          {this.state.chatRename? <div className='rename-chat'>
              <h4>Rename Chat</h4>
              <form onSubmit={this.submitNewName}>
                <input type='text'
                  value={this.state.newName}
                  onChange={this.handleRenameChange}
                />
                <input type="submit"/>
              </form>
            </div> :''}

          {/*==================================================
                  A modual for editing your message
            ==================================================*/}
          {this.state.editMessage?
              <form onSubmit={this.editMessageSubmit}>
                <input
                  type="text"
                  value={this.state.edit}
                  onChange={this.handleMessageEdit}
                />
                <input type="submit"/>
              </form>
          :''}

      </div>
    )
  }
}

export default Messages
