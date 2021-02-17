import React, { Component } from 'react'
import { NavLink } from "react-router-dom";


export default class BackButton extends Component {

    render() {
        if (this.props.navlink_url) {
            return (
                <NavLink className="geo-back-btn" to={this.props.navlink_url}>
                    <small className="fa fa-chevron-circle-left"> {this.props.name && this.props.name}</small>
                </NavLink>
            )
        }
        else if (this.props.back_url) {
            return (
                <a className="geo-back-btn" id='geo-back-btn' onClick={this.props.history.push(this.props.back_url)}>
                    <small className="fa fa-chevron-circle-left"> {this.props.name && this.props.name}</small>
                </a>
            )
        }
        else{
            return (
                <a className="geo-back-btn" id='geo-back-btn' onClick={this.props.history.goBack}>
                    <small className="fa fa-chevron-circle-left"> {this.props.name && this.props.name}</small>
                </a>
            )
        }
    }
}
