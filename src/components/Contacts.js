import React, {Component} from 'react';

class Contacts extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  static getDerivedStateFromProps(props, state){
    if(!state.friends || state.friends.length !== props.friends.length){
      return{friends: props.friends}
    }
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
