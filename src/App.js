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
     friends:[]
    }
  }

  socket = io.connect('https://nwm-backend.herokuapp.com');


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
    fetch('https://nwm-backend.herokuapp.com/sessions',{
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
    fetch('https://nwm-backend.herokuapp.com/users/contacts/'+ this.state.currentUser.id)
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
    fetch('https://nwm-backend.herokuapp.com/chats/'+ this.state.currentUser.id)
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
    // fetch the chats info based on the room you are in
    fetch('https://nwm-backend.herokuapp.com/messages')
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
    fetch('https://nwm-backend.herokuapp.com/users/changeRoom',{
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



  componentDidMount(){
    this.getChatInfo()
    this.getUser()
    this.socket.on('chat',(msg) => {
      this.setState({messages:[...this.state.messages,msg]})
    })
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
        removeState={this.removeStateInfo} rmOne={this.removeOneMessage}/>:
        <div>
        <SignUp />
        <Login getUser={this.getUser} />
        </div>
      }
      </div>
    );
  }
}

export default App;
