import React, { Component, Fragment } from 'react'
import { NavLink, withRouter } from 'react-router-dom'


class MenuItem extends Component {

    getNavLinkClass(path){
        return this.props.location.pathname === path ? 'active' : '';
    }

    render() {
        return (
            <li className={ this.getNavLinkClass(this.props.url) }>
                { this.props.children ?
                    <NavLink  activeClassName="active" to={this.props.url} className="waves-effect">
                      <i className={!this.props.icon? "icon-map": this.props.icon}></i> <span>{this.props.children}</span>
                    </NavLink>
                    :
                    <NavLink  activeClassName="active" to={ this.props.url } className="waves-effect">
                        { this.props.icon &&
                            <Fragment>
                                <i className={ this.props.icon }></i> {}
                            </Fragment>
                        }
                        <span>{ this.props.text }</span>
                    </NavLink>
                }
            </li>
        )
    }
}

export default withRouter(MenuItem)
