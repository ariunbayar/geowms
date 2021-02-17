import React, { Component } from "react"

export default class Text extends Component {

    render() {
            return (
                <div className="card-body p-2">
                    <div className="text-center d-flex justify-content-center">
                        <a>{this.props.text}</a>
                    </div>
                </div>
            )
        }
    }