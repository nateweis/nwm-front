import React, {Component} from 'react'

class NewChat extends Component {
  constructor(props) {
    super(props)
    this.state={
      name:''
    }
  }

  componentDidMount(){
    this.props.getContacts()
  }

  render(){
    return(
      <>
      <form>
        <input
        type="text"
        placeholder="chat name"
        value={this.state.name}
        name="name"
        />
      </form>
      </>
    )
  }
}


export default NewChat
