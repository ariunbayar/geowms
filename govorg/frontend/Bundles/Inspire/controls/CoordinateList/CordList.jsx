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

    handleChange(e) {
        this.setState({ coord: e.target.value })
    }

    componentDidMount() {
        const { coord } = this.props
        this.setState({ coord })
    }

    // componentDidUpdate(pP) {
    //     const { coord } = this.props
    //     if (pP.coord !== coord) {
    //         this.setState({ coord })
    //     }
    // }

    render() {
        const { coord } = this.state
        const { idx, ix } = this.props
        return (
            <div className="input-group input-group-sm mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text" id={idx}>{idx == 0 ? 'X' : idx == 1 ? 'Y' : idx == 2 ? 'Z' : null}</span>
                </div>
                <input key={idx} className="form-control" type="number" value={coord} aria-describedby={idx} onChange={(e) => this.handleChange(e)}/>
            </div>
        )
    }
}

class ListComponent extends Component {

    constructor(props) {

        super(props)
        this.list = []
        this.state = {
            coords_list: []
        }
        this.handleOnChange = this.handleOnChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
    }

    handleOnChange(e) {
        const query = e.target.value
        this.setState({ query })
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
        this.list = [coords_list]
    }

    componentDidUpdate(pP) {
        const { coords_list } = this.props
        if (pP.coords_list !== coords_list) {
            this.list.push(coords_list)
        }
    }

    render() {
        const { query } = this.state
        const coords_list = this.list
        console.log(coords_list);
        return (
            <div className="height-full">
                <div className="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
                    <div className="btn-group" role="group" aria-label="First group">
                        <button type="button" className="btn btn-secondary" onClick={() => this.props.hide()}>1</button>
                        <button type="button" className="btn btn-primary" onClick={() => this.props.hide()}>SAVE</button>
                    </div>
                    <div className="input-group input-group-sm m-3">
                        <div className="input-group-prepend">
                            <div
                                className="input-group-text"
                                id="search"
                                role="button"
                                onClick={() => this.handleSearch()}
                            >
                                <i
                                    className="fa fa-search"
                                    aria-hidden="true"
                                >
                                </i>
                            </div>
                        </div>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Эргэлтийн цэгийн дугаар"
                            value={query}
                            aria-describedby="search"
                            onChange={(e) => this.handleOnChange(e)}
                        />
                    </div>
                </div>
                <center><label className="h5">{coords_list.length > 0 ? coords_list[0].id : 'NoName'}</label></center>
                {
                    coords_list.length > 0 ?
                    <div className="list-group overflow-auto">
                        {coords_list.map((coords, ix) =>
                            <div key={ix} className="list-group-item">
                                <b>Эргэлтийн цэгийн дугаар: {coords.turning !== null ? coords.turning : ix}</b>
                                    {coords.geom.map((coords, idx) =>
                                        coords.map((coord, i) =>
                                            <CoordInputs key={i}
                                                coord={coord}
                                                idx={i}
                                                ix={ix}
                                            />
                                        )
                                    )}
                            </div>
                        )}
                    </div>
                    : null
                }
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
        const cssClasses = `col-md-4 rounded bg-light`

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

    showList(islaod, coords_list, fly, hide) {
        this.toggleControl(islaod)
        this.renderComponent({coords_list, fly, hide})
    }

}
