import React, { Component, Fragment } from 'react'
import { NavLink, withRouter } from 'react-router-dom'


class MenuItem extends Component {

    getNavLinkClass(path){
        return this.props.location.pathname === path ? 'active' : '';
    }

    render() {
        return (
            <li className={ this.getNavLinkClass(this.props.url) }>
                <NavLink  activeClassName="active" to={ this.props.url } className="waves-effect">
                    { this.props.icon &&
                        <Fragment>
                            <i className={ this.props.icon }></i> {}
                        </Fragment>
                    }
                    <span>{ this.props.text }</span>
                </NavLink>
                { this.props.children }
            </li>
        )
    }
}

export default withRouter(MenuItem)
