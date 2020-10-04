import React, { Component } from 'react'
import { NavLink, withRouter } from 'react-router-dom'

class MenuItem extends Component {
    getNavLinkClass(path){
        return this.props.location.pathname === path ? 'active' : '';
    }

    render() {
        return (
            <li className={this.getNavLinkClass(this.props.url)}>
                <NavLink  activeClassName="active" to={this.props.url} className="waves-effect">
                  <i className={!this.props.icon? "icon-map": this.props.icon}></i> <span>{this.props.children}</span>
                </NavLink>
            </li>
        )
    }
}

export default withRouter(MenuItem)
