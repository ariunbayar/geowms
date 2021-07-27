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


export default class Help extends Component {

    render() {
        return (
            <div className="container my-3 p-2  mb-5 shadow card">
                <div className="col-md-11 pl-4 ml-4">
                    <div className="col-md-12 d-flex justify-content-center my-4">
                        <label className="h4">Тусламж</label>
                    </div>
                    <div className="col-md-12 my-5">
                        <label className="h4 col-md-12">ГАРЫН АВЛАГА</label>
                        <div className="col-md-12 d-flex justify-content-center">
                            <div className='col-md-10 text-justify'>
                                <span className="">
                                    Мэдээлэл оруулах цахим хэсгээс гадна QGIS програм ашиглан мэдээлэл засах боломжтой. Хэрхэн мэдээлэл оруулах болон оруулсан мэдээллийг засварлах дэлгэрэнгүй зааварчилгааг татаж аван зааврын дагуу оруулна уу.
                                </span>
                            </div>
                            <div className="col-md-2"><label className="btn btn-success float-right">татах</label></div>
                        </div>
                    </div>
                    <div className="col-md-12 my-5">
                        <label className="h4 col-md-12">СТАНДАРТЫН ТАНИЛЦУУЛГА</label>
                        <div className="col-md-12 d-flex justify-content-between">
                            <div className='col-md-10 text-justify'>
                                <span>Таны эрхийн хүрээнд мэдээлэл оруулахад шаардлагатай стандартыг татаж аван дэлгэрэнгүй танилцах боломжтой.</span>
                            </div>
                            <div className="col-md-2"><label className="btn btn-success float-right">татах</label></div>
                        </div>
                    </div>
                    <div className="col-md-12 my-4">
                        <span className='col-md-12 h4'>Plugin <label className="h4">суулгах заавар</label></span>
                            <ol className="my-2">
                                <li>
                                    <LinkExternal href="/static/assets/qgis_plugin/qgis_plugin.zip" text={'Qgis plugin татах'}/>
                                 </li>
                                 <li>
                                    <strong >Plugins{"->"} Manage and Install Plugins {"->"} Install from ZIP {"->"}ZIP file татаж авсан замыг заана {"->"} Install Plugin</strong>
                                    <img className="m-3" src="/static/assets/image/plugin/plugin_dir.png" width='600px'/>
                                 </li>
                                <li>
                                    <strong>Qgis дээр 'plugin reloader' суулгах</strong>
                                    <ul className="list-unstyled">
                                        <li>
                                            <h6>Qgis {"->"} Manage and Install Plugins {"->"} Not installed {"->"} Plugin reloader</h6>
                                            <img src="/static/assets/image/plugin/plugin.png" width='600px'/></li>
                                        <li className="mt-3">
                                            <img src="/static/assets/image/plugin/plugin_builder.png" width='600px'/></li>
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
