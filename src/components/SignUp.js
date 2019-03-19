import React, {Component} from 'react'

class SignUp extends Component {
  constructor(props){
    super(props)
    this.state = {
      username:'',
      password:''
    }
  }

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
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
      <form className="login-box" onSubmit={this.handleSubmit}>
      <h2>Sign Up</h2>
        <input type="text" placeholder="username"
        value={this.state.username} name="username"
        onChange={this.handleChange}/>
        <input type="password" placeholder="password"
        value={this.state.password} name="password"
        onChange={this.handleChange}/>
        <input type="submit" value="Sign Up"/>
      </form>
      </>
    )
  }
}

export default SignUp
