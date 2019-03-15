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
        this.setState({users:data, username:''})
      },(err) => {
        console.log(err);
      })
    })
  }

  addToContacts = (data) => {
    console.log(data);
    const friend = data
    friend.user_id = this.props.currentUser.id
    friend.contact_id = data.id

    fetch('http://localhost:3000/users/contacts',{
      method:'POST',
      body:JSON.stringify(friend),
      headers:{
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    .then((res) => {
      res.json()
      .then((data) => {
        console.log(data);
        this.props.addToArr('friends', friend)
      },(err) => {
        console.log(err);
      })
    })
  }

  closeUsers = () => {
    this.setState({users:false})
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
      {this.state.users? <span>
          <span onClick={this.closeUsers}>
          Close
          </span>
          {this.state.users.info.map((user,index) => {
            return(
              <span key={index}>
                <p>{user.username}
                <button onClick={()=>this.addToContacts(user)}
                >Add to Contacts</button>
                </p>
              </span>
            )
          })}
        </span>:""}
      </>
    )
  }
}

export default FindUsers
