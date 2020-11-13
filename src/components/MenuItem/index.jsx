import React, { Component, Fragment } from 'react'
import { NavLink, withRouter } from 'react-router-dom'


class MenuItem extends Component {

    getNavLinkClass(path){

        let is_match;

        if ('exact' in this.props) {
            is_match = this.props.location.pathname === path
        } else {
            is_match = this.props.location.pathname.substr(0, path.length) === path
        }

        return is_match ? 'active' : '';
    }

    render() {

        return (
            <li className={ this.getNavLinkClass(this.props.url) }>

                <NavLink activeClassName="active" to={ this.props.url } className="waves-effect">

                    { this.props.icon &&
                        <Fragment>
                            <i className={ this.props.icon }></i> {}
                        </Fragment>
                    }
                    <span>{ this.props.text }</span>

                    { this.props.children &&
                        <i className="fa fa-angle-left pull-right"></i>
                    }
                    {this.props.count > -1 && <small className="badge float-right badge-info">{this.props.count}</small>}
                </NavLink>

                { this.props.children }
            </li>
        )

    }
}

export default withRouter(MenuItem)
