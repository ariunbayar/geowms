import React from "react"
import { NavLink } from "react-router-dom"


export function ButtonEdit(props) {
    return (
        <NavLink { ...props } className="btn btn-primary waves-effect waves-light m-1">
            <i className="fa fa-pencil-square-o"></i> Засах
        </NavLink>
    )
}
