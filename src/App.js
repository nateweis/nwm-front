import React, { Component } from 'react';
import io from 'socket.io-client'
import Login from './components/Login'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
     logedin: false
    }
  }
  socket = io.connect('http://localhost:3000');



  componentDidMount(){

  }


  render() {
    return (
      <div className="">
        <Login />
      </div>
    );
  }
}

export default App;
