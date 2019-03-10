import React, {Component} from 'react'
import {BrowserRouter, Route, Switch, NavLink} from 'react-router-dom'
import FindUsers from './FindUsers'

class Nav extends Component {
  render(){
    return(
      <BrowserRouter>
        <div>
          <NavLink to="/otherusers">Find Users</NavLink>
          <Switch>
            <Route exact path='/otherusers' render={
              ()=> <FindUsers currentUser={this.props.currentUser}/>}/>
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
