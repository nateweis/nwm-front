import React, {Component} from 'react'
import {BrowserRouter, Route, Switch, NavLink} from 'react-router-dom'
import FindUsers from './FindUsers'
import Contacts from './Contacts'
import NewChat from './NewChat'
import AllChats from './AllChats'

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



  componentDidMount(){
    this.props.getContacts()
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
              getContacts={this.props.getContacts}
              friends={this.props.friends}
            />}/>

            <Route exact path='/newchat' render={() =>
              <NewChat
              getChats={this.props.getChats}
              getContacts={this.props.getContacts}
              friends={this.props.friends}
              id={this.props.currentUser.id}
              />
            }/>



          </Switch>
          <AllChats
            friends={this.props.friends}
            chats={this.props.chats}
            getContacts={this.props.getContacts}
            changeRoom={this.props.changeRoom}
           />
        </div>
      </BrowserRouter>
    )
  }
}

export default Nav
