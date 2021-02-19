import React, { Component, Fragment } from "react"

export default class Logo extends Component {

    render() {
            return (
                <div className="card-body p-2">
                    <div className="text-center d-flex justify-content-center">
                        <img
                            src={this.props.src}
                            className="logo mw-100"
                            alt="logo"
                            style={{weight: '80px', height: '80px'}}
                        />
                    </div>
                </div>
            )
        }
    }
