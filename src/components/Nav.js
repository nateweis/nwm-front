import React, {Component} from 'react'
import {BrowserRouter, Route, Switch, NavLink} from 'react-router-dom'
import FindUsers from './FindUsers'
import Contacts from './Contacts'

class Nav extends Component {
  render(){
    return(
      <BrowserRouter>
        <div>
          <NavLink to="/otherusers">Find Users</NavLink>
          <NavLink to="/contacts">Contacts</NavLink>
          <Switch>
            <Route exact path='/otherusers' render={
              ()=> <FindUsers currentUser={this.props.currentUser}/>}/>
            <Route exact path='/contacts'
            render={()=> <Contacts
            id={this.props.currentUser.id}  />}/>
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default Nav




//
// constructor() {
//
// }
