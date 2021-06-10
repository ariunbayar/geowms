import React, { Component, Suspense } from 'react'
import { BrowserRouter, Switch, Route } from "react-router-dom";

import MenuItem from "@utils/MenuItem"
import SuspenseLoader from "@utils/Loader/SuspenseLoader"

const Map = React.lazy(() => import("./Map"));
const Request = React.lazy(() => import('./Request'));

export class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <BrowserRouter>
                <div id="sidebar-wrapper" data-simplebar="" data-simplebar-auto-hide="true">
                    <div className="brand-logo">
                        <a href="/">
                            <img src="/static/assets/image/logo/logo-2.png" className="logo-icon" alt="logo icon"></img>
                            <h5 className="logo-text">ГЕОПОРТАЛ</h5>
                        </a>
                    </div>
                    <ul className="sidebar-menu do-nicescrol">
                        <MenuItem icon="gp-text-primary fa fa-database" url="/llc/map/" text="Map"></MenuItem>
                        <MenuItem icon="gp-text-primary fa fa-plug" url="/llc/llc-request/" text="Хүсэлт"></MenuItem>
                    </ul>
                </div>
                <div className="clearfix">
                    <div className="content-wrapper">
                        <Suspense fallback={<SuspenseLoader is_loading={true} text={"Хуудас ачааллаж байна."}/>}>
                            <Switch>
                                <Route path="/llc/map/" component={Map} />
                                <Route path="/llc/llc-request/" component={Request} />
                            </Switch>
                        </Suspense>
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}