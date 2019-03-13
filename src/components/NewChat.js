import React, {Component} from 'react'

class NewChat extends Component {
  constructor(props) {
    super(props)
    this.state={
      name:''
    }
  }

  handleChange =(e) => {
    this.setState({name:e.target.value})
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const obj = {
      name: this.state.name,
      user_id: this.props.id
    }
    fetch('http://localhost:3000/chats',{
      method:'POST',
      body:JSON.stringify(obj),
      headers:{
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    .then((res) => {
      res.json()
      .then((data) => {
        console.log(data);
        this.setState({name:''})
        this.props.getChats()
      },(err) => {
        console.log(err);
        console.log("theres an error in the create new chat front end");
      })
    })
  }

  componentDidMount(){
    this.props.getContacts()
  }

  render(){
    return(
      <>
      <form onSubmit={this.handleSubmit}>
        <input
        type="text"
        placeholder="chat name"
        value={this.state.name}
        name="name"
        onChange={this.handleChange}
        />
        <input type="submit" value="Add Chat"/>
      </form>
      </>
    )
  }
}


export default NewChat
