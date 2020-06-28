import React, { Component, Fragment } from "react"

import {helpers} from '../../helpers'
import WMSItem from './WMSItem'


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
        this.props.handleSetCenter(coord)
    }

    render() {
        return (
            <div>
                <div className="form-group">
                    <label className="font-weight-bold" htmlFor="formGroupInput">Нэрэлбэрээр хайх</label>
                    <div className="input-group mb-3">

                        <input type="text" className="form-control" placeholder="хайх утга" aria-label="" aria-describedby=""/>
                        <div className="input-group-append">
                            <button className="btn gp-outline-primary" type="button"><i className="fa fa-search mr-1" aria-hidden="true"></i>Хайх</button>
                        </div>
                    </div>
                </div>

                <form onSubmit={this.handleSubmitCoordinate}>
                    <div className="form-group">
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
                </form>
                <div className="tanih mt-5">
                    <label className="font-weight-bold" htmlFor="formGroupInput">Таних тэмдэг</label>
                    <p className="my-1">GPS- ийн сүлжээний цэг</p>
                    <p className="my-1">Гравиметрийн сүлжээний цэг</p>
                    <p className="my-1">Өндрийн сүлжээний цэг</p>
                    <p className="my-1">Триангуляцийн сүлжээний цэг</p>
                    <p className="my-1">Зураглалын сүлжээний цэг</p>
                </div>
                {this.props.map_wms_list.map((wms, idx) =>
                    <WMSItem wms={wms} key={idx}/>
                )}
            </div>
        )
    }
}
