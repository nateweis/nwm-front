import React, {Component} from 'react'

class Login extends Component {
  constructor(props){
    super(props)
    this.state = {
      username:'',
      password:''
    }
  }

  handleChange = (e) => {
    this.setState({[e.target.id]: e.target.value})
  }

  handleSubmit = (e) => {
    e.preventDefault()
    fetch('http://localhost:3000/users',{
      method:'POST',
      body:JSON.stringify(this.state),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      res.json()
      .then((data) => {
        console.log(data);
        this.setState({
          username:'',
          password:''
        })
      },(err) => {
        console.log(err);
      })
    })
  }

  render(){
    return(
      <>
      <form onSubmit={this.handleSubmit}>
        Sign Up:
        <input type="text" placeholder="username"
        value={this.state.username} id="username"
        onChange={this.handleChange}/>
        <input type="password" placeholder="password"
        value={this.state.password} id="password"
        onChange={this.handleChange}/>
        <input type="submit"/>
      </form>
      </>
    )
  }
}

export default Login
