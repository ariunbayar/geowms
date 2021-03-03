import React, { Component } from "react"

export default class Text extends Component {

    render() {
            return (
                <div className="card-body p-2">
                    <div className="d-flex justify-content-center">
                        <div className="col-lg-12">
                            <div className="row">
                                <div className="col-lg-12 text-center">
                                    <a>{this.props.title}</a>
                                </div>
                            </div>
                            <div className="col-auto mt-0 p-0 ml-2">
                                <br />
                                <p>
                                    {this.props.text}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
