import React, { Component, Fragment } from "react"
import "./styles.css";
import WMSItem from './WMSItem'
import {helpers} from '../../helpers'

export class Sidebar extends Component {
    constructor(props) {

        super(props)

        this.state = {
            coordinate: '',
        }

        this.handleSubmitCoordinate = this.handleSubmitCoordinate.bind(this)
    }

    handleSubmitCoordinate(event) {
        event.preventDefault()
        const coord = helpers.parseCoordinateString(this.state.coordinate)
        this.props.handleSetCenter(coord, 3)
        this.props.toggleSidebar(false)
    }

    render() {
        return (
            <div className={ this.props.is_sidebar_open ? 'col-md-12 ⚙ ⚙-hide' : 'col-md-12 ⚙'}>
            <div className="row">
                <div className="row sidebarHeader">
                    <div className="row">
                        {/* <form onSubmit={this.handleSubmitCoordinate}>
                            <div className="form-group searchComponent">
                                <label className="font-weight-bold" htmlFor="formGroupInput">Байрлалаар хайх</label>
                                <div className="input-group mb-3">
                                    <input type="text" className="form-control" placeholder="өргөрөг, уртраг"
                                        name="coordinate"
                                        onChange={(e) => this.setState({coordinate: e.target.value}) }
                                        value={this.state.coordinate}
                                    />
                                    <div className="input-group-append">
                                        <button className="btn gp-outline-primary" type="submit"><i className="fa fa-search mr-1"></i>Хайх</button>
                                    </div>
                                </div>
                            </div>
                        </form> */}
                    </div>
                    <div className="row xButtonLayer">
                        <a onClick={() => this.props.toggleSidebar(false)}><i className="fa fa-times" aria-hidden="true"></i></a>
                    </div>
                </div>
                <div className="row sidebarFooter">
                    {this.props.map_wms_list.map((wms, idx) =>
                    <WMSItem wms={wms} key={idx}/>
                )}
                </div>
            </div>
            </div>
        )
    }
}
