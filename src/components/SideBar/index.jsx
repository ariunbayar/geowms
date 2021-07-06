import React, { Component } from "react"
import './style.css'

export default class SideBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: props.items || [],
            active_menu: "",
            is_toggle: false,
        }
        this.activeState = this.activeState.bind(this)
    }

    componentDidMount() {

    }

    activeState(key){
        const { active_menu } = this.state
        if(active_menu == key) this.setState({active_menu: "", is_toggle: false})
        else this.setState({ active_menu: key, is_toggle: true })
    }

    render(){
        const { is_toggle, items, active_menu } = this.state
        return(
            <div id="sidebar"
                className={is_toggle ?  "sidebar sidebar-left " : "sidebar sidebar-left collapsed"} style={{ zIndex: 1 }}
            >
                <div className="sidebar-tabs">
                    <ul>
                        {
                            items.map((item, idx) =>
                                item.bottom
                                ?
                                    null
                                :
                                    <li key={idx}
                                        role="button"
                                        className={active_menu == item.key ? "active" : ""}
                                    >
                                        <a data-toggle="tooltip"
                                            data-placement="right"
                                            title={item.tooltip}
                                            className="gp-tooltip"
                                            onClick={() => this.activeState(item.key)}
                                        >
                                            <i className={item.icon}></i>
                                        </a>
                                    </li>
                            )
                        }
                    </ul>
                    <ul>
                        {
                            items.map((item, idx) =>
                                item.bottom
                                &&
                                    <li key={idx}
                                        role="button"
                                        className={active_menu == item.key ? "active" : ""}
                                    >
                                        <a data-toggle="tooltip"
                                            data-placement="right"
                                            title={item.tooltip}
                                            onClick={() => this.activeState(item.key)}
                                        >
                                            <i className={item.icon}></i>
                                        </a>
                                    </li>
                            )
                        }
                    </ul>
                </div>
                <div className="sidebar-content">
                    {
                        items.map((item, idx) =>
                            <div key={idx}
                                className={active_menu == item.key ? "sidebar-pane active" : "sidebar-pane"}
                            >
                                {
                                    item.title
                                    &&
                                        <h1 className="sidebar-header">
                                            {item.title}
                                        </h1>
                                }
                                <item.component />
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}
