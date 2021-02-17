import React, { Component, Fragment } from "react"

export default class Logo extends Component {

    render() {
            return (
                <div className="text-center">
                    <img
                        src={this.props.src}
                        className="logo"
                        alt="logo"
                        style={{weight: '100px', height: '100px'}}
                    />
                </div>
            )
        }
    }