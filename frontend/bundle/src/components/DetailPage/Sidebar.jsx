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
                {this.props.map_wms_list.map((wms, idx) =>
                    <WMSItem wms={wms} key={idx}/>
                )}
            </div>
        )
    }
}


export class SidebarButton extends Control {

    constructor(opt_options) {

        const options = opt_options || {}

        super({
            element: document.createElement('div'),
            target: options.target,
        })

        this.toggleLayer = this.toggleLayer.bind(this)
        this.initLayer = this.initLayer.bind(this)
        this.handleClick = this.handleClick.bind(this)

        this.last_active = null

        const base_layers = options.layers.map(this.initLayer)

        const cssClasses = `суурь-давхаргууд ${CLASS_UNSELECTABLE} ${CLASS_CONTROL}`

        const element = this.element
        element.className = cssClasses
        base_layers.forEach((l) => element.appendChild(l))

    }

    initLayer({thumbnail_1x, thumbnail_2x, layer, is_active}) {

        const el = document.createElement('a')
        el.setAttribute('href', '#')
        el.className = 'суурь-давхарга' + (is_active ? ' ' + CLASS_ACTIVE : '')
        // TODO srcset for img tag using: thumbnail_1x & thumbnail_2x
        el.style.backgroundImage = `url(${thumbnail_2x})`
        el.addEventListener('click', (event) => {
            event.preventDefault()
            this.handleClick(el, layer)
        })

        this.toggleLayer(is_active === true, el, layer)

        return el

    }

    toggleLayer(is_active, el, layer) {

        if (this.last_active && is_active) {
            this.last_active.layer.setVisible(false)
            this.last_active.el.classList.toggle(CLASS_ACTIVE, false)
        }

        layer.setVisible(is_active)
        el.classList.toggle(CLASS_ACTIVE, is_active)

        if (is_active)
            this.last_active = {el, layer}
    }

    handleClick(el, layer) {
        if (this.last_active && this.last_active.el === el)
            return
        this.toggleLayer(true, el, layer)
    }

}
