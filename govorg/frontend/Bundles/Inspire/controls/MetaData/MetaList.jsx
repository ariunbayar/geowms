import React, { Component, Fragment } from "react"

import ReactDOM from 'react-dom'
import {Control} from 'ol/control'
import { service } from "../../service"

class MetaHead extends Component{
    constructor(props){
        super(props)
        this.state = {
            coord: '',
        }
    }

    render() {
        const { idx, ix, names } = this.props
        const keys = Object.keys(names);
        const headName = keys
        return (
            <th>
                {headName}
            </th>
        )
    }
}

class ListComponent extends Component {

    constructor(props) {

        super(props)
        this.list = []
        this.state = {
            name_list: {},
            meta_data_list: [],
            query: '',
            foundIt: '',
            isSearched: false,
            isLoading: false,
            geoms: [],
        }
        this.handleOnChange = this.handleOnChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.collectGeom = this.collectGeom.bind(this)
    }

    handleOnChange(query) {
        this.setState({ query })
    }

    handleSearch() {
        const { query } = this.state
        this.setState({ isLoading: false })
        service.searchMeta(query).then(({success, meta_data}) => {
            if (success) {
                this.setState({ foundIt: query, isSearched: true, isLoading: true })
                // this.setState({ meta_data_list: meta_data })
            }
        })
    }

    collectGeom(e) {
        const value = e.target.value
        const check = e.target.checked
        const { geoms } = this.state
        if ( this.list.length == 0 || check ) {
            this.list.push(value)
        }
        else if ( this.list.length > 0 || check ) {
            this.list.push(value)
        }
        if (!check) {
            const isBelowThreshold = (coordinateFromArray) => coordinateFromArray = value;
            if(this.list.every(isBelowThreshold)){
                var array = this.list.filter((item) => {
                    return item !== value
                })
                this.list = array
            }
        }
        this.setState({ geoms: this.list })

    }

    saveGeom() {
        const { geoms } = this.state
        console.log(geoms)
    }

    componentDidMount() {
        service
            .getMetaData()
            .then(({success, meta_data_list}) => {
                if (success) {
                    // this.setState({ meta: meta_data_list })
                    // meta_data_list.map((data, idx) => {
                    //     this.setState({ meta_data_list: data })
                    // })
                }
            })
    }

    componentDidUpdate(pP) {
    }

    render() {
        const { query, meta_data_list, meta, foundIt } = this.state
        const { name_list } = this.props
        return (
            <div className="height-full animated slideInLeft">
                <div className="input-group mb-3">
                    <div className="input-group-prepend my-3">
                        <span className="input-group-text" id="search">
                            <i
                                className="fa fa-search"
                                role="button"
                                title="хайх"
                                onClick={() => this.handleSearch()}
                            ></i>
                        </span>
                    </div>
                    <input
                        type="text"
                        className="form-control my-3"
                        aria-describedby="search"
                        placeholder="Мета дугаараар хайх"
                        value={query}
                        onChange={(e) => this.handleOnChange(e.target.value)}
                    />
                </div>
                {
                    foundIt
                    ?
                        <div>
                            <label>Олдсон мета: {foundIt}</label>
                        </div>
                    :
                        <div>
                            <label>Мета байхгүй байна</label>
                        </div>
                }
                <hr />
                <div>
                    <label>Геомын дугаарууд:</label>
                </div>
                <ul className="list-in-meta">
                    {name_list.map((name, idx) =>
                        <li className="animated slideInLeft float-left mr-2 pl-2 pr-2" key={idx}>
                            <div className="icheck-primary">
                                <input type="checkbox" value={name} id={idx} onChange={(e) => this.collectGeom(e)}/>
                                <label htmlFor={idx}>{name}</label>
                            </div>
                        </li>
                    )}
                </ul>
                {/* <table className="table table-bordered col-8">
                    <tbody>
                        {Object.entries(meta_data_list).map(([key, value], idx) =>
                            <tr key={idx}>
                                <td>{key}</td>
                                <td>{value}</td>
                            </tr>
                        )}
                    </tbody>
                </table> */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <button className="btn btn-primary" onClick={() => this.saveGeom()}>Хадгалах</button>
                    </div>
                    <div className="col-md-6 mb-3">
                        <button className="btn btn-secondary">Цэвэрлэх</button>
                    </div>
                </div>
            </div>
        )
    }
}

export class MetaList extends Control {

    constructor(opt_options) {

        const options = opt_options || {}

        super({
            element: document.createElement('div'),
            target: options.target,
        })

        this.is_component_initialized = false
        const cssClasses = `col-md-3 rounded bg-light`

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

    showMetaList(islaod, name_list) {
        this.toggleControl(islaod)
        this.renderComponent({name_list})
    }

}