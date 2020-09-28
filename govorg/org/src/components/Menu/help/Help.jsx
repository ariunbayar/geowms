import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"
export class Help extends Component {

    constructor(props) {
        super(props)

    }


    render() {
        return (
            <div className="container my-3 p-3  mb-5 shadow">
                <div className="row ml-3">
                        <div className="my-0">
                              <h4 className='text-center'>Qgis-д plugin суулгах заавар</h4>
                                <ol>
                                    <li>
                                        Qgis дээр 'plugin' болон 'plugin reloader' суулгах
                                    </li>
                                </ol>
                        </div>
                </div>
             </div>
        )
    }
}
