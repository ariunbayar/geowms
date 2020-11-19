import React, { Component, Fragment } from "react"

import ReactDOM from 'react-dom'
import {Control} from 'ol/control'

class CoordInputs extends Component{
    constructor(props){
        super(props)
        this.state = {
            coord: '',
        }
    }

    handleChange(e, ix, idx) {
        const coord = e.target.value
        this.setState({ coord })
        this.props.send(coord, ix, idx)
    }

    componentDidMount() {
        const { coord } = this.props
        this.setState({ coord })
    }

    componentDidUpdate(pP) {
        const { coord } = this.props
        if (pP.coord !== coord) {
            this.setState({ coord })
        }
    }

    render() {
        const { coord } = this.state
        const { idx, ix } = this.props
        return (
            <li className="float-left col-4 m-0 p-0 animated slideInLeft" key={idx}>
                {/* <div className="input-group input-group-sm m-0 p-0">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id={idx}>{idx == 0 ? 'X' : idx == 1 ? 'Y' : idx == 2 ? 'Z' : null}</span>
                    </div> */}
                <input
                    key={idx}
                    className="form-control"
                    type="number"
                    placeholder={idx == 0 ? 'X' : idx == 1 ? 'Y' : idx == 2 ? 'Z' : null}
                    minLength="0"
                    value={coord}
                    aria-describedby={idx}
                    onChange={(e) => this.handleChange(e, ix, idx)}
                />
                {/* </div> */}
            </li>
        )
    }
}

class ListComponent extends Component {

    constructor(props) {

        super(props)
        this.list = {}
        this.state = {
            coords_list: {}
        }
        this.handleOnChange = this.handleOnChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.sendCoordinate = this.sendCoordinate.bind(this)
        this.setUpdate = this.setUpdate.bind(this)
    }

    handleOnChange(e) {
        const query = e.target.value
        this.setState({ query })
    }

    sendCoordinate(coord, first, second) {
        const { coords_list } = this.state
        var parsed = null
        if (coord) parsed = parseFloat(coord)
        else parsed = coord
        if(coords_list.data[first].turning == 1) {
            if(coords_list.data[coords_list.data.length - 1].turning == coords_list.last){
                coords_list.data[coords_list.data.length - 1].geom[second] = parsed
            }
        }
        coords_list.data[first].geom[second] = parsed
        console.log(coords_list);
        this.setState({ coords_list })
    }

    setUpdate() {
        const { coords_list } = this.state
        this.props.update(coords_list);
    }

    handleSearch() {
        const { query } = this.state
        const { coords_list } = this.props
        coords_list.geom.map((coord, idx) => {
            if (idx == query) {
                const coordinate = [coord[0], coord[1]]
                this.props.fly(coordinate)
            }
        })
    }

    componentDidMount() {
        const { coords_list } = this.props
        if (coords_list !== {}) this.setState({ coords_list })
    }

    componentDidUpdate(pP) {
        const { coords_list } = this.props
        if (pP.coords_list !== coords_list) {
            this.setState({ coords_list })
        }
    }

    render() {
        const { coords_list } = this.props
        return (
            <div className="height-full animated slideInLeft">
                <center><label className="my-2 h5">{coords_list ? coords_list !== {} ? coords_list.id : 'NoName' : null}</label></center>
                {
                    coords_list ?
                    coords_list !== {} ?
                        coords_list.data.length > 0
                        ?
                        <div className="list-group overflow-auto">
                            {coords_list.data.map((datas, ix) =>
                                ((!coords_list.type.includes('Point')) ?
                                (datas.turning == coords_list.last ?
                                    ix !== coords_list.data.length - 1
                                : ix == ix) : ix == ix) &&
                                <div key={ix} className="list-group-item animated slideInLeft">
                                    <b>Эргэлтийн цэгийн дугаар: {datas.turning !== null ? datas.turning : ix}</b>
                                    <ul className="m-0 p-0" style={{listStyle:'none'}}>
                                        {datas.geom.map((coords, idx) =>
                                            <CoordInputs key={idx}
                                                coord={coords}
                                                idx={idx}
                                                ix={ix}
                                                send={this.sendCoordinate}
                                            />
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                        : "Буруу газар зурсан байна. Дахин шалгана уу"
                    : null
                    : null
                }
                <div className="row" role="toolbar">
                    <div className="col-md-6" role="group">
                        <button type="button" className="btn btn-secondary btn-block h-1" onClick={() => this.props.hide()}>Буцах</button>
                    </div>
                    <div className="col-md-6">
                        <button type="button" className="btn btn-primary btn-block h-1" onClick={() => this.setUpdate()}>Хадгалах</button>
                    </div>
                </div>
            </div>
        )
    }
}

export class CoordList extends Control {

    constructor(opt_options) {

        const options = opt_options || {}

        super({
            element: document.createElement('div'),
            target: options.target,
        })

        this.is_component_initialized = false
        const cssClasses = `col-md-4 rounded bg-light animated slideInLeft`

        this.element.className = cssClasses
        this.element.style.display = 'none'
        this.element.style.height = 'auto'
        this.renderComponent = this.renderComponent.bind(this)
        this.toggleControl = this.toggleControl.bind(this)
    }

    toggleControl(is_visible) {
        if (is_visible) {
            this.element.style.display = 'block'
        }
        else {
            this.element.style.display = 'none'
        }

    }

    renderComponent(props) {
        if (!this.is_component_initialized) {
            ReactDOM.render(<ListComponent {...props}/>, this.element)
            this.is_component_initialized = true
        }

        ReactDOM.hydrate(<ListComponent {...props}/>, this.element)
    }

    showList(islaod, coords_list, fly, hide, update) {
        this.toggleControl(islaod)
        this.renderComponent({coords_list, fly, hide, update})
    }

}