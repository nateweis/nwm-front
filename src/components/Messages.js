import React, {Component} from 'react'
import ReactDOM from 'react-dom'

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

  // autoscroll only when on bottom
  componentWillUpdate(){
    console.log("did i go off?");
    const node = ReactDOM.findDOMNode(this)
    this.shouldScrollToBottom = node.scrollTop + node.clientHeight >= node.scrollHeight
  }

  // if on bottom autoscroll
  componentDidUpdate(){
    // console.log(this.shouldScrollToBottom);
    if(this.shouldScrollToBottom){
      const node = ReactDOM.findDOMNode(this)
      node.scrollTop = node.scrollHeight
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
      fetch('https://nwm-backend.herokuapp.com/chats/many',{
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
    const node = ReactDOM.findDOMNode(this)
    this.setState({newMsg:e.target.value})
    this.shouldScrollToBottom = node.scrollTop + node.clientHeight >= node.scrollHeight
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
    const node = ReactDOM.findDOMNode(this)
    this.shouldScrollToBottom = node.scrollTop + node.clientHeight >= node.scrollHeight
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
    fetch('https://nwm-backend.herokuapp.com/chats/'+id,{
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
        this.props.rmChat('chats',this.props.chatIndex)
        this.setState((pre) => {
          pre.chat.admin = false
          return{chat:pre.chat, options:false}
        })
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
    fetch('https://nwm-backend.herokuapp.com/chats',{
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
        this.props.editChat('chats', this.props.chatIndex, data.data)
      },(err) => {
        console.log(err);
      })
    })

    this.setState({chatRename:false})
  }

  // get the chat participants
  getChatParticipants = () => {
    const id = this.state.chat.chat_id
    fetch('https://nwm-backend.herokuapp.com/chats/members/'+id)
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
    this.removePersonFromChat(obj)
    this.setState((pre) => {
      pre.participants.splice(index,1)
      return{participants:pre.participants}
    })
  }

  // leave Chat
  leaveChat = () => {
    const obj = {
      user: this.props.currentUser.id,
      chat:this.state.chat.chat_id
    }
    this.removePersonFromChat(obj)
    this.props.rmChat("chats", this.props.chatIndex)
  }

  // remove a person from current chats
  removePersonFromChat = (obj) => {
    fetch('https://nwm-backend.herokuapp.com/chats/remove/member',{
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
      },(err) => {
        console.log(err);
        console.log("couldnt remove person from chat frontend");
      })
    })
  }

  // user can edit any of there messages
  editOneMessage = (message,i) => {
    this.setState({
      editMessage:true,
      edit: message.message,
      msgId: message.id,
      msgIndex: i
    })
  }

  closeEditOneMessage =() => {
    this.setState({editMessage:false})
  }

  handleMessageEdit = (e) => {
    this.setState({edit:e.target.value})
  }

  editMessageSubmit = (e) => {
    e.preventDefault()

    const obj = {edit:this.state.edit}
    fetch('https://nwm-backend.herokuapp.com/messages/'+ this.state.msgId,{
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
        this.props.fullArrUpdate('messages', this.state.msgIndex, data.data)
      },(err) => {
        console.log("edit message no go on front");
      })
    })

    this.setState({editMessage:false})
  }

  // user can delete their own messages
  removeOneMessage = (msg,i) => {
    fetch('https://nwm-backend.herokuapp.com/messages/'+ msg.id,{
      method:'DELETE',
      credentials: 'include'
    })
    .then((res) => {
      res.json()
      .then((data) => {
        console.log(data);
        this.props.rmOne('messages',i)
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
      <div className="center">
        <div className={this.state.options? "options options-menu":"options"}>
        {/*==================================================
                      The header and option buttons
          ==================================================*/}

          {/* option button for now just for admin need to make for everyone*/}
          <button className="option-btn" onClick={this.optionMenu}>Options</button>
          {this.state.chat? this.state.options? <div>
            {/* add frinds to chat (just for admin) */}
              {this.state.chat.admin?  <button className="user-btn" onClick={this.addFriends}>Add Friends to the Chat</button>: ''}

              {/* rename/delte chat (just for admin) */}
              {this.state.chat.admin?  <button className="user-btn"  onClick={this.chatRename}>Rename Chat</button>: ''}
              {this.state.chat.admin? <button className="user-btn"  onClick={this.warning}>Remove Chat</button> : ''}


              {/* shows group members (4everyone) */}
              <button className="user-btn"  onClick={this.leaveChat}>Leave Chat</button>
              <h4>Participants in "{this.state.chat.chat}" Room</h4>
              {this.state.participants.map((member, index) => {
                return(
                  <div key={index}>
                    <li>{member.username}
                    {this.state.chat.admin? member.id !== this.props.currentUser.id?
                      <button className="kick-btn" onClick={()=> this.kickOutOfChat(member.id,index)}>Kick From Chat</button> : "":""}
                    </li>
                  </div>
                )
              })}
            </div> :"" :""}

            {/*==================================================
                    The from to add friends to the chatroom
              ==================================================*/}

          {this.state.form? <div className="friend-que">
              <div className="addFriend">
              <h4>Available Friends to Add</h4>
              <span className="close-btn" onClick={this.closeForm}>X</span> <br/>
              {this.props.friends.map((friend,index) => {
                let onList = false
                for(let i = 0; i < this.state.participants.length; i++){
                  if(this.state.participants[i].username === friend.username){
                    onList = true
                  }
                }
                if(onList === false){
                  return(
                    <span key={index}>
                    {friend.username} <button className="plus" onClick={()=> this.addList(friend)}>+</button>
                    <br/>
                    </span>
                  )
                }else{return('')}

              })}

              </div>
              <div className="addedFriend">
              <h4>Friends To Be Added</h4>
                <button onClick={this.handleSubmit}>Submit</button>
                {this.state.friendName.map((friend,index) => {
                  return(
                    <span key={index}>
                    {friend} <span className="close-btn" onClick={()=>this.pop(index)}>  X</span><br/>
                    </span>
                  )
                })}
              </div>

            </div>
          :""}
        </div>


        {/*==================================================
                      The actual chat messages
          ==================================================*/}

        <div className="chat-screen">
          {this.props.messages.map((message, index) => {
            if(message.chat_id === this.props.currentUser.current_room){
              return(

                  <div className={message.user_id === this.props.currentUser.id?
                    "message message-user" :"message"} key={index}>

                    <div className="avatar">
                    <img src={message.pic? message.pic :"default-user.png"} />
                     </div>

                    <div className="msg">
                      <div className="pointer"> </div>
                      <div className="inner-msg">

                      {message.user_id === this.props.currentUser.id? <span className="message-btn">
                      <button onClick={()=>this.editOneMessage(message,index)}>Edit</button>
                       <button onClick={()=>this.removeOneMessage(message,index)}>Remove</button>
                       </span>:''}

                        <strong>
                        {message.user_id === this.props.currentUser.id? "You" : message.sender}
                        </strong>

                         <br/> {message.message}
                      </div>



                    </div>


                  </div>

              )
            }else{
              return("")
            }

          })}

          {/*==================================================
                    The form to add a new message
            ==================================================*/}

          <form className="new-msg" onSubmit={this.submit}>
          <input type='submit'/>
            <input
              type="text"
              value={this.state.newMsg}
              placeholder="New Message"
              onChange={this.handleChange}
            />
          </form>
        </div>

        {/*==================================================
      A modual that pops up to give warning before deleting a chat
          ==================================================*/}

        {this.state.warning? <div className="modual warning-model">
            <p>Are you sure you want to delete
            {this.state.chat.chat} chat room?</p>
            <button onClick={this.cancelNuke}>No</button> <button onClick={this.nukeChat}>Yes</button>
          </div>:""}

          {/*==================================================
                      A modual for renaming the chat
            ==================================================*/}
          {this.state.chatRename? <div className='modual rename-chat'>
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
              <form className='modual' onSubmit={this.editMessageSubmit}>
              <span onClick={this.closeEditOneMessage} >Close</span>
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
