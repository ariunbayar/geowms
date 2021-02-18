import React, { Component, Fragment } from "react"

export default class Count extends Component {

    render() {
            return (
                <div className="form-row justify-content-center">
                    <div className="form-row  text-center">
                        <div className="form-group">
                            <label htmlFor="label" style={{fontSize: '115%'}} className="mw-100 text-wrap align-middle">{this.props.text}</label>
                        </div>
                    </div>
                    <div className="form-row  text-center">
                        <div className="form-group p-0 mt-1 mw-100">
                            {this.props.src &&
                            <img
                                src={this.props.src}
                                className="count  mw-100"
                                alt="count"
                                style={{weight: '40px', height: '40px'}}
                            />
                                }
                        </div>
                        <div className="form-group mt-0 p-0 ml-2">
                            <label  htmlFor="h1" style={{fontSize: '115%'}} className="mw-100 text-wrap align-middle"><h4>{this.props.count}</h4></label>
                        </div>
                    </div>
                </div>
            )
        }
    }
