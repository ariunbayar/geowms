import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import './style.css'

export class Item extends Component {

    render() {

        const {id, name, order, url, thumbnail_1x, thumbnail_2x, sort_order} = this.props.values
        const {className, values, index} = this.props

        return (
            <div className={className}
            >
                <div className="card shadow-sm"
                    key={index}
                    draggable
                    onDrop={event => this.props.onDrop(event, values, index)}
                    onDragOver={event => this.props.onDragOver(event, values, index)}
                    onDrag={(event) => this.props.onDrag(event, values, index)}
                >
                    <div className="row no-gutters">
                        <div className="col-md-7">
                            <div className="card-body pb-0">
                                <p className="card-text mb-0">
                                    <NavLink className="" to={`/back/суурь-давхарга/${id}/дэлгэрэнгүй/`}>
                                        <strong>{name}</strong>
                                    </NavLink>
                                </p>
                                <p className="card-text">
                                    <small className="text-muted">{url}</small>
                                </p>

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
