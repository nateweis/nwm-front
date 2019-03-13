import React, { Component } from 'react';
import io from 'socket.io-client'
import SignUp from './components/SignUp'
import Login from './components/Login'
import Nav from './components/Nav'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
     logedin: false,
     currentUser:{},
     messages:[],
     leave:''
    }
  }
  socket = io.connect('https://nwm-backend.herokuapp.com/');

  changeRoom = (chat) => {
    // leave old room
    this.socket.emit('leave', this.state.leave)
    // enter new room
    this.socket.emit('room',chat.chat)
    // update user room info
    this.updateCurrentRoom(chat)
    // repopulate chat page apon entering a room
    this.getChatInfo()
    // reset the next room that will be left
    this.setState({leave:chat.chat})
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
    console.log("running");
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
        },(err) => {
          console.log(err);
          console.log("somthing wrong in getting the chats for user on frontend");
        })
    })
  }

  getChatInfo = () => {
    // fethch the chats info based on the room you are in
    const room = this.state.currentUser.current_room
    fetch('https://nwm-backend.herokuapp.com/messages/'+ room)
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
        this.getUser()
      },(err) => {
        console.log("didnt go through in changeRoom frontend");
      })
    })
  }



  componentDidMount(){
    this.socket.on('chat',(msg) => {
      this.setState({messages:[msg,...this.state.messages]})
    })
  }


  render() {
    return (
      <div className="">
      {this.state.logedin? <Nav getContacts={this.getContacts}
      changeRoom={this.changeRoom} getChats={this.getChats}
        friends={this.state.friends} chats={this.state.chats}
        messages={this.state.messages} socket={this.newMessage}
        logedin={this.toggleLogdin} currentUser={this.state.currentUser}/>:
        <div>
        <SignUp />
        <Login getUser={this.getUser} logedin={this.toggleLogdin} />
        </div>
      }
      </div>
    );
  }
}

export default App;
