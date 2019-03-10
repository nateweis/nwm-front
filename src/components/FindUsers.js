import React, {Component} from 'react'

class FindUsers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username:''
    }
  }

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleSubmit = (e) => {
    e.preventDefault()
    fetch('http://localhost:3000/users/'+ this.state.username)
    .then((res) => {
      res.json()
      .then((data) => {
        this.setState({users:data})
      },(err) => {
        console.log(err);
      })
    })
  }


  render(){
    return(
      <>
      <form onSubmit={this.handleSubmit}>
        <input type='text' placeholder="find user"
          value={this.state.username} name='username'
          onChange={this.handleChange}
        />
        <input type="submit"/>
      </form>

      </>
    )
  }
}

export default FindUsers
