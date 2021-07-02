import React, { Component, Suspense } from 'react'
import { BrowserRouter, Switch, Route } from "react-router-dom";

import MenuItem from "@utils/MenuItem"
import SuspenseLoader from "@utils/Loader/SuspenseLoader"
import DisplayModal from "@utils/Modal/DisplayModal"
import { DisplayNotif } from '@utils/Notification'

import { service } from "./Request/service"

const Map = React.lazy(() => import("./Map"));
const Request = React.lazy(() => import('./Request'));
const History = React.lazy(() => import('./History'));

export class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            request_count: 0,
        }
    this.requestCount = this.requestCount.bind(this)
    }

    getModalFunc(setModal) {
        global.MODAL = setModal
    }

    getNotifFunc(setNotif) {
        global.NOTIF = setNotif
    }

    componentDidMount() {
        this.requestCount()
    }

    requestCount() {
        service.getCount().then(({ success, request_count }) => {
            if (success) {
                this.setState({ request_count })
            }
        })
    }

    render() {
        const { llc } = this.props
        const { request_count } = this.state
        return (
            <div>
                <DisplayModal getModalFunc={this.getModalFunc}/>
                <DisplayNotif getNotifFunc={this.getNotifFunc}/>
                <Suspense fallback={<SuspenseLoader is_loading={true} text={"Хуудас ачааллаж байна."}/>}>
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
                                <MenuItem icon="gp-text-primary fa fa-plug" url="/llc/llc-request/" text="Хүсэлт" count={request_count}></MenuItem>
                                <MenuItem icon="gp-text-primary fa fa-history" url="/llc/history/" text="Шийдвэрлэгдсэн хүсэлт"></MenuItem>
                            </ul>
                        </div>
                        <div className="clearfix">
                            <div className="content-wrapper">
                                <Suspense fallback={<SuspenseLoader is_loading={true} text={"Хуудас ачааллаж байна."}/>}>
                                    <Switch>
                                        <Route path="/llc/map/" component={Map} />
                                        <Route path="/llc/llc-request/" component={Request}/>
                                        <Route path="/llc/history/" component={History} />
                                    </Switch>
                                </Suspense>
                            </div>
                        </div>
                    </BrowserRouter>
                </Suspense>
            </div>
        )
    }
}
