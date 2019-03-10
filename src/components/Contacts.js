import React, {Component} from 'react';

class Contacts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      friends:[]
    }
  }

  getContacts = () => {
    fetch('http://localhost:3000/users/contacts/'+ this.props.id)
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
    this.getContacts()
  }
  render(){
    return(
      <div>
        {this.state.friends.map((frnd, index) => {
          return(
            <div key={index}>
              <p>{frnd.username}</p>
            </div>
          )
        })}
      </div>
    )
  }
}

export default Contacts
