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
     currentUser:{}
    }
  }
  socket = io.connect('http://localhost:3000');

  toggleLogdin = () => {
    this.setState((pre) => {
      pre.logedin = !pre.logedin
      return{logedin:pre.logedin}
    })
  }

  getUser = () => {
    console.log("running");
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
      })
      .catch((err) => {
        console.log(err);
      })
    })
  }

  componentDidMount(){

  }


  render() {
    return (
      <div className="">
      {this.state.logedin? <Nav getContacts={this.getContacts}
      friends={this.state.friends}
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
