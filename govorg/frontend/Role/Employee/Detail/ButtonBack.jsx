import React from "react"
import { NavLink } from "react-router-dom"


export function ButtonBack(props) {
    return (
        <NavLink { ...props } className="btn gp-outline-primary m-1">
            <i className="fa fa-angle-double-left"></i> Буцах
        </NavLink>
    )
}
