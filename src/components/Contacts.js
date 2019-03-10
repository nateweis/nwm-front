import React, {Component} from 'react';

class Contacts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      friends: this.props.friends
    }
  }
  componentDidMount(){
    this.props.getContacts()
  }


  render(){
    return(
      <div>
        {this.state.friends?
          this.state.friends.map((frnd, index) => {
            return(
              <div key={index}>
                <p>{frnd.username}</p>
              </div>
            )
          }): "Loading....."}
      </div>
    )
  }
}

export default Contacts
