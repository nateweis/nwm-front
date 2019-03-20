import React, {Component} from 'react'

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      edit: false,
      pic:"",
      email:''
    }
  }

  openForm = () => {
    this.setState((pre) => {
      pre.edit = !pre.edit
      return{edit:pre.edit}
    })
  }

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.updateUserData()
  }

  updateUserData = () => {
    fetch('http://localhost:3000/users/' + this.props.currentUser.id, {
      method:'PUT',
      body:JSON.stringify(this.state),
      headers:{
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'},
      credentials: 'include'
    })
    .then((res) => {
      res.json()
      .then((data) => {
        this.props.updatePic(this.state.pic)
        this.setState({
          edit:false,
          pic:'',
          email:''
        })
      },(err) => {
        console.log(err);
      })
    })
  }

  render(){
    return(
      <>
        <div className="avatar">
          <img
          onClick={this.openForm}
          src={this.props.currentUser.pic? this.props.currentUser.pic :"default-user.png"} />
        </div>
        {this.state.edit?
          <form onSubmit={this.handleSubmit}>
            <input
              placeholder="change picture"
              value={this.state.pic}
              onChange={this.handleChange}
              name="pic"
            />
            <input
              placeholder="change email"
              value={this.state.email}
              onChange={this.handleChange}
              name="email"
            />
            <input type="submit"/>
          </form>:""}
      </>
    )
  }

}

export default Profile
