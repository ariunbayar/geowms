import React, { Component, Fragment } from "react"
import './style.css'

export default class SideBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            is_togle: false

        }
    }

    componentDidMount(){

    }

    render(){
        const {is_togle} = this.state
        return(
            <div id="sidebar"
                className={is_togle ?  "sidebar sidebar-left " : "sidebar sidebar-left collapsed"} style={{zIndex: 1000}}
                onClick={() => this.setState({is_togle: !is_togle})}
            >
                <div className="sidebar-tabs">
                <ul role="tablist">
                    <li className="active"><a href="#home" role="tab"><i className="fa fa-bars"></i></a></li>
                    <li><a href="#profile" role="tab"><i className="fa fa-globe"></i></a></li>
                    <li><a href="#search" role="tab"><i className="fa fa-search"></i></a></li>
                    <li className="disabled"><a href="#messages" role="tab"><i className="fa fa-envelope"></i></a></li>
                    <li><a href="https://github.com/Turbo87/sidebar-v2" role="tab" target="_blank"><i className="fa fa-github"></i></a></li>
                </ul>

                <ul role="tablist">
                    <li><a href="#settings" role="tab"><i className="fa fa-gear"></i></a></li>
                </ul>
                </div>

                <div className="sidebar-content">
                <div className="sidebar-pane active" id="home">
                    <h1 className="sidebar-header">
                    sidebar-v2
                    <span className="sidebar-close"><i className="fa fa-caret-left"></i></span>
                    </h1>

                    <p>A responsive sidebar for mapping libraries like <a href="http://leafletjs.com/">Leaflet</a> or <a href="https://openlayers.org/">OpenLayers</a>.</p>

                    <p className="lorem"> ut labore et dolordolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
                </div>

                <div className="sidebar-pane" id="profile">
                    <h1>ol.control.LayerSwitcher</h1>
                    <div></div>
                    <p>
                    <a href="https://viglino.github.io/ol-ext/index.html" target="new">Fork me on Github!</a>
                    </p>
                </div>

                <div className="sidebar-pane" id="search">
                    <h1>ol.control.SearchNominatim</h1>
                    <div></div>
                    <p>
                    <a href="https://viglino.github.io/ol-ext/index.html" target="new">Fork me on Github!</a>
                    </p>
                </div>

                <div className="sidebar-pane" id="messages">
                    <h1 className="sidebar-header">Messages<span className="sidebar-close"><i className="fa fa-caret-left"></i></span></h1>

                </div>

                <div className="sidebar-pane" id="settings">
                    <h1 className="sidebar-header">Settings<span className="sidebar-close"><i className="fa fa-caret-left"></i></span></h1>
                    <p>
                    ol.control.LayerSwitcher from ol-ext.
                    <br/>
                    <a href="https://viglino.github.io/ol-ext/index.html" target="new">Fork me on Github!</a>
                    </p>
                    <p>
                    ol.control.Sidebar by Turbo87.
                    <br/>
                    <a href="https://github.com/Turbo87/sidebar-v2" target="new">Fork me on Github!</a>
                    </p>
                </div>
                </div>
            </div>


        )
    }
}
