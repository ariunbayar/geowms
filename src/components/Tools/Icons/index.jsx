import React, { Component } from 'react'
import './style.css';

export default class Icon extends Component {

    render() {
        const {icon, size, color} = this.props
        return (
            <i className={`hover-fx ${icon} ${size} ${color}`}/>
        )
    }
}
