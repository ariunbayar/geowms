import React, { Component, Fragment } from "react"

export default class Count extends Component {

    render() {
            return (
                <div className="card-body p-2">
                    <div className="text-center d-flex justify-content-center">
                        <div className="col-lg-12">
                            <div className="row">
                                <div className="col-lg-12">
                                    <a>{this.props.text}</a>
                                </div>
                            </div>
                            <div className="row d-flex justify-content-center mt-1">
                                <div className="col-auto p-0 mt-1">
                                    <img
                                        src={this.props.src}
                                        className="count"
                                        alt="count"
                                        style={{weight: '30px', height: '30px'}}
                                    />
                                </div>
                                <div className="col-auto mt-0 p-0 ml-2">
                                    <h2>{this.props.count}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }