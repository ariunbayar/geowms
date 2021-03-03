import React, { Component } from 'react'
import './style.css';

export default class Icon extends Component {

    render() {
        const {icon, size, color} = this.props
        return (
            <a className="hover-fx">
                <i className={`${icon} ${size} ${color}`}/>
            </a>
        )
    }
}
