import React, { Component, Fragment } from "react"
import './style.css'

export default class SideBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: props.items || [],
            active_menu: "",
            is_togle: false,
        }
        this.activeState = this.activeState.bind(this)
    }

    componentDidMount(){

    }

    activeState(key){
        const {active_menu} = this.state
        if(active_menu == key) this.setState({active_menu: "", is_togle: false})
        else this.setState({active_menu: key, is_togle: true})
    }

    render(){
        const { is_togle, items, active_menu } = this.state
        return(
            <div id="sidebar"
                className={is_togle ?  "sidebar sidebar-left " : "sidebar sidebar-left collapsed"} style={{zIndex: 1}}
            >
                <div className="sidebar-tabs">
                    <ul>
                        {items.map((item, idx) =>
                            item.bottom ? null :
                            <li key={idx} className={active_menu == item.key ? "active" : ""}><a onClick={() => this.activeState(item.key)} ><i className={item.icon}></i></a></li>
                        )}
                    </ul>
                    <ul>
                        {items.map((item, idx) =>
                            item.bottom &&
                            <li key={idx} className={active_menu == item.key ? "active" : ""}><a onClick={() => this.activeState(item.key)} ><i className={item.icon}></i></a></li>
                        )}
                    </ul>
                </div>
                <div className="sidebar-content">
                {items.map((item, idx) =>
                    <div key={idx} className={active_menu == item.key ? "sidebar-pane active" : "sidebar-pane"}>
                        {item.title &&
                            <h1 className="sidebar-header">
                            {item.title}
                            </h1>
                        }
                        {<item.component/>}
                    </div>
                )}
                </div>
            </div>
        )
    }
}
