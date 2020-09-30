import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

class LinkExternal extends Component {

    render() {
        return (
            <strong>
                <a href={this.props.href} target="_blank">
                    {this.props.text || this.props.href}
                    {} <i className="fa fa-external-link " aria-hidden="true"></i>
                </a>
            </strong>
        )
    }

}


export class Help extends Component {

    render() {
        return (
            <div className="container my-3 p-3  mb-5 shadow card">
                <div className="row ml-3">
                    <div className="my-0">
                          <h4 className='text-center'>Plugin суулгах заавар</h4>
                            <ol>
                                <li>
                                    <LinkExternal href="/static/assets/qgis_plugin.zip" text={'Qgis plugin татах'}/>
                                 </li>
                                 <li>
                                    <strong >Татаж авсан 'Zip' файлыг задлаад өөрийн компьютер дээрхи 'qgis' суусан замын 'plugin' хэсэгт байрлуулна. </strong>
                                    <img className="m-3" src="/static/assets/image/plugin/plugin_dir.png" width='600px'/>
                                 </li>
                                <li>
                                    <strong>Qgis дээр 'plugin' болон 'plugin reloader' суулгах</strong>
                                    <ul className="list-unstyled">
                                        <li>
                                            <h6>Qgis {"->"} Manage and Install Plugins {"->"} Not installed {"->"} Plugin builder <br/>Qgis {"->"} Manage and Install Plugins {"->"} Not installed {"->"} Plugin reloader</h6>
                                            <img src="/static/assets/image/plugin/plugin.png" width='600px'/></li>
                                        <li className="mt-3">
                                            <img src="/static/assets/image/plugin/plugin_builder.png" width='600px'/></li>
                                        <li className="mt-3">
                                            <img src="/static/assets/image/plugin/plugin_view.png" width='600px'/></li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>Үүсгэсэн &nbsp; "plugin"-ийг  &nbsp;  Qgis-тай холбох</strong>
                                    <h6>Qgis {"->"}  Manage and Install Plugins {"->"} Installed {"->"} 'qgis_plugin' </h6>
                                </li>
                                <li className="mt-3">
                                    <strong>Үүсгэсэн &nbsp; "plugin"-ийг  &nbsp;  Plugin Reloader-тай холбох. Ингэснээр "Plugin"-ийг дахин дахин ачааллах боломжтой болно. </strong>
                                    <h6>Qgis {"->"}  Plugin Reloader{"->"} Configure {"->"} Select plugin you want to reload {"->"} qgis_plugin.</h6>
                                </li>
                            </ol>
                    </div>
                </div>
             </div>
        )
    }
}
