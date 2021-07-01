import React, { Component } from 'react'
import { NavLink } from "react-router-dom";


export default class BackButton extends Component {

    render() {
        if (this.props.navlink_url) {
            return (
                <NavLink className="geo-back-btn geo-back-btn-toggled" to={this.props.navlink_url}>
                    <i className="fa fa-chevron-circle-left"> {this.props.name && this.props.name}</i>
                </NavLink>
            )
        }
        else if (this.props.back_url) {
            return (
                <a className="geo-back-btn geo-back-btn-toggled" id='geo-back-btn' onClick={this.props.history.push(this.props.back_url)}>
                    <i className="fa fa-chevron-circle-left"> {this.props.name && this.props.name}</i>
                </a>
            )
        }
        else{
            return (
                <a className="geo-back-btn geo-back-btn-toggled" id='geo-back-btn' onClick={this.props.history.goBack}>
                    <i className="fa fa-chevron-circle-left"> {this.props.name && this.props.name}</i>
                </a>
            )
        }
    }
}
