import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import './style.css'

export class Item extends Component {

    render() {

        const {id, name, order, url, thumbnail_1x, thumbnail_2x} = this.props.values
        const {className} = this.props

        return (
            <div className={className}>
                <div className="card shadow-sm">
                    <div className="row no-gutters">
                        <div className="col-md-7">
                            <div className="card-body">
                                <p className="card-text">
                                    <NavLink className="stretched-link" to={`/back/суурь-давхарга/${id}/дэлгэрэнгүй/`}>
                                        <strong>{name}</strong>
                                    </NavLink>
                                </p>
                                <p className="card-text">
                                    <small className="text-muted">{url}</small>
                                </p>

                            </div>
                        </div>
                        
                        <div className="col-md-1 d-flex align-items-center d-flex justify-content-center">
                            <div className="row no-gutters">
                                <a href="#" onClick={event => this.props.handleMove(id, 'up')}>
                                    <i className="fa fa-chevron-up" aria-hidden="true"></i>
                                </a>
                            </div>
                            <div className="row no-gutters">
                                <a href="#" onClick={event => this.props.handleMove(id, 'down')}>
                                    <i className="fa fa-chevron-down" aria-hidden="true"></i>
                                </a>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <img
                                className="card-img"
                                src={thumbnail_2x}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
