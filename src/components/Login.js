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
    this.setState({[e.target.name]: e.target.value})
  }

  handleSubmit = (e) => {
    e.preventDefault()
    fetch('https://nwm-backend.herokuapp.com/sessions',{
      method:'POST',
      body:JSON.stringify(this.state),
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
        this.setState({
          username:'',
          password:''
        })

        this.props.getUser()
      },(err) => {
        console.log(err);
      })
    })
  }


  render(){
    return(
      <>
      <form className="login-box" onSubmit={this.handleSubmit}>
      <h2>Login</h2>
        <input type="text" placeholder="username"
        value={this.state.username} name="username"
        onChange={this.handleChange}/>
        <input type="password" placeholder="password"
        value={this.state.password} name="password"
        onChange={this.handleChange}/>
        <input type="submit" value="Login"/>
      </form>
      </>
    )
  }
}

export default Login
