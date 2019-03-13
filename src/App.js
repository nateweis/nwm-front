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
     messages:[]
    }
  }
  socket = io.connect('https://nwm-backend.herokuapp.com');

  changeRoom = (chat) => {
    this.socket.emit('room',chat)
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
    fetch('https://nwm-backend.herokuapp.com//sessions',{
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
