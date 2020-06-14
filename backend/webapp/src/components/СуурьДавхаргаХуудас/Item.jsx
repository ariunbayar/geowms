import React, { Component } from "react"
import {NavLink} from "react-router-dom"


export class Item extends Component {

    render() {

        const {id, name, order, url, thumbnail_1x, thumbnail_2x} = this.props.values
        const {className} = this.props

        return (
            <div className={className}>
                <div className="card shadow-sm">
                    <div className="row no-gutters">
                        <div className="col-md-8">
                            <div className="card-body">
                                <p className="card-text">
                                    <NavLink className="stretched-link" to={"/back/суурь-давхарга/дэлгэрэнгүй/"}>
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
                                src={thumbnail_1x}
                                srcSet={thumbnail_2x + ' 2x'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
