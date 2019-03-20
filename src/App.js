import React, { Component } from 'react';
import io from 'socket.io-client'
import SignUp from './components/SignUp'
import Login from './components/Login'
import AllChats from './components/AllChats'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
     logedin: false,
     currentUser:{},
     messages:[],
     leave:'',
     friends:[],
     signup:true
    }
  }
  socket = io.connect('http://localhost:3000');

  changeRoom = (chat) => {
    // leave old room
    this.socket.emit('leave', this.state.leave)
    // enter new room
    this.socket.emit('room',chat.chat)
    // update user room info
    this.updateCurrentRoom(chat)
    // reset the next room that will be left
    this.setState({leave:chat.chat})
  }

  enterFirstChat = () => {
    let room = ""
    for (let i = 0; i < this.state.chats.length; i++) {
      if(this.state.chats[i].chat_id === this.state.currentUser.current_room){
        room = this.state.chats[i].chat
      }
    }
    this.socket.emit('room',room)
    this.setState({leave:room})
  }

  newMessage = (msg) => {
    this.socket.emit('message',msg)
  }

  toggleLogdin = () => {
    this.setState((pre) => {
      pre.logedin = !pre.logedin
      return{logedin:pre.logedin}
    })
  }

  getUser = () => {
    fetch('http://localhost:3000/sessions',{
      method:'GET',
      credentials: 'include'
    })
    .then((res) => {
      res.json()
      .then((data) => {
        console.log(data);
        this.setState({currentUser:data})
        this.getContacts()
        this.setState({logedin:true})
      },(err) => {
        console.log(err);
      })
    })
  }

  getContacts = () => {
    fetch('http://localhost:3000/users/contacts/'+ this.state.currentUser.id)
    .then((res) => {
      res.json()
      .then((data) => {
        this.setState({friends:data})
        this.getChats()
      })
      .catch((err) => {
        console.log(err);
      })
    })
  }

  getChats = () => {
    fetch('http://localhost:3000/chats/'+ this.state.currentUser.id)
    .then((res) => {
        res.json()
        .then((data) => {
          this.setState(() => {
            return{chats:data}
          })
          this.enterFirstChat()
        },(err) => {
          console.log(err);
          console.log("somthing wrong in getting the chats for user on frontend");
        })
    })
  }

  getChatInfo = () => {
    // fethch the chats info based on the room you are in
    fetch('http://localhost:3000/messages')
    .then((res) => {
      // populate the message state with the info
      res.json()
      .then((data) => {
        this.setState({messages:data})
      },(err) => {
        console.log(err);
        console.log("error with getting chat info on load");
      })
    })
  }

  updateCurrentRoom = (chat) => {
    fetch('http://localhost:3000/users/changeRoom',{
      method:'PUT',
      body:JSON.stringify(chat),
      headers:{
         'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    .then((res) => {
      res.json()
      .then((data) => {
        console.log(data);
        this.setState((pre) => {
          pre.currentUser.current_room = chat.chat_id
          return{currentUser: pre.currentUser}
        })
      },(err) => {
        console.log("didnt go through in changeRoom frontend");
      })
    })
  }

  removeStateInfo = () => {
    this.setState({
      chats:[],
      currentUser:{},
      friends:[]
    })
  }

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
  }

  updateUserPic = (newPic) => {
    this.setState((pre) => {
      pre.currentUser.pic = newPic
      for (let i = 0; i < pre.messages.length; i++) {
        if(pre.currentUser.id === pre.messages[i].user_id){
          pre.messages[i].pic = newPic
        }
      }
      return{
        currentUser:pre.currentUser,
        messages:pre.messages
      }
    })
  }



  componentDidMount(){
    this.getChatInfo()
    this.getUser()
    this.socket.on('chat',(msg) => {
      this.setState({messages:[...this.state.messages,msg]})
    })
  }
  log = () => {
    this.setState({signup:false})
  }
  sign = () => {
    this.setState({signup:true})
  }


  render() {
    return (
      <div className="">
      {this.state.logedin? <AllChats getContacts={this.getContacts}
      changeRoom={this.changeRoom} getChats={this.getChats}
        friends={this.state.friends} chats={this.state.chats}
        messages={this.state.messages} socket={this.newMessage}
        logedin={this.toggleLogdin} currentUser={this.state.currentUser}
        addToArr={this.addToArr} fullArrUpdate={this.fullArrUpdate}
        removeState={this.removeStateInfo} rmOne={this.removeOneMessage}
        updatePic={this.updateUserPic}/>:
        <div className="opening-page">
          <div className="opening-box">
            <div className="login-btn">
              <span onClick={this.sign} className={this.state.signup? "selected":""}
              >Sign Up</span>
              <span onClick={this.log} className={this.state.signup? "":"selected"}
              >Login</span>
            </div>
            <div>
              {this.state.signup? <SignUp />: <Login getUser={this.getUser} />}
            </div>
          </div>
        </div>
      }
      </div>
    );
  }
}

export default App;
