import React, {Component} from 'react'
import {BrowserRouter, Route, Switch, NavLink} from 'react-router-dom'
import FindUsers from './FindUsers'
import Contacts from './Contacts'
import NewChat from './NewChat'

class Nav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      friends:[]
    }
 }

  logout = () => {
    fetch('http://localhost:3000/sessions',{
      method:'DELETE',
      credentials: 'include'
    })
    .then((res) => {
      res.json()
      .then((data) => {
        console.log(data);
        this.props.logedin()
      })
      .catch((err) => {
        console.log(err);
      })
    })
  }

  getContacts = () => {
    fetch('http://localhost:3000/users/contacts/'+ this.props.currentUser.id)
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
      <BrowserRouter>
        <div>
          <NavLink to="/otherusers"> Find Users </NavLink>
          <NavLink to="/contacts"> Contacts </NavLink>
          <NavLink to="/newchat"> New Chat </NavLink>
          <span onClick={this.logout}> Logout </span>
          <Switch>
            <Route exact path='/otherusers' render={
              ()=> <FindUsers currentUser={this.props.currentUser}/>}/>

            <Route exact path='/contacts'
            render={()=> <Contacts
              getContacts={this.getContacts}
              friends={this.state.friends}
            />}/>

            <Route exact path='/newchat' render={() =>
              <NewChat
              getContacts={this.getContacts}
              friends={this.state.friends}
              />
            }/>
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default Nav
