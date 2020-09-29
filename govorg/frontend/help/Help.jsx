import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"
import './help.css'
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
                                        <strong>Qgis дээр 'plugin' болон 'plugin reloader' суулгах</strong>
                                        <ul>
                                            <li>
                                                <h6>Qgis -> Manage and Install Plugins -> Not installed -> Plugin builder <br/>Qgis -> Manage and Install Plugins -> Not installed -> Plugin reloader</h6>
                                                <img src="/static/assets/image/plugin/plugin.png" /></li>
                                            <li className="mt-3">
                                                <img src="/static/assets/image/plugin/plugin_builder.png" /></li>
                                            <li className="mt-3">
                                                <img src="/static/assets/image/plugin/plugin_view.png" /></li>
                                        </ul>                                        
                                    </li>
                                    <li>
                                        <ul>
                                            <li>
                                              <strong>Үүсгэсэн &nbsp; "plugin"-ийг  &nbsp;  Qgis-тай холбох</strong>
                                                <h6>Qgis ->  Manage and Install Plugins -> Installed -> Үүсгэсэн 'plugin'-ний нэрийг сонгоно.</h6>
                                                <img src="/static/assets/image/plugin/select_plugin.png" />
                                            </li>
                                            <li>
                                              <strong>Үүсгэсэн &nbsp; "plugin"-ийг  &nbsp;  Plugin Reloader-тай холбох. Ингэснээр "Plugin"-ийг дахин дахин ачааллах боломжтой болно. </strong>
                                                <h6>Qgis ->  Plugin Reloader-> Configure -> Select plugin you want to reload -> Үүсгэсэн plugin.</h6>
                                                
                                            </li>
                                        </ul>
                                    </li>
                                </ol>
                        </div>
                </div>
             </div>
        )
    }
}
