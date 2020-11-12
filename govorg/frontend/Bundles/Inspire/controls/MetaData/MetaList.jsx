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

class MetaBody extends Component{
    constructor(props){
        super(props)
        this.state = {
            coord: '',
        }
    }

    render() {
        const { idx, ix, data } = this.props
        console.log(data);
        return (
            <tr>
                <td>
                    {data}
                </td>
            </tr>
        )
    }
}

class ListComponent extends Component {

    constructor(props) {

        super(props)
        this.list = {}
        this.state = {
            name_list: {},
            meta_data: [],
            query: ''
        }
        this.handleOnChange = this.handleOnChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
    }

    handleOnChange(query) {
        this.setState({ query })
    }

    handleSearch() {
        const { query } = this.state
        service.searchMeta(query).then(rsp => {
            console.log(rsp);
        })
    }

    componentDidMount() {
        // service
        //     .getMetaData()
        //     .then(({succes, data}) => {
        //         if (succes) {
                    const meta_data = [{
                        'id': '1',
                        'org_name': 'ODko',
                        'odko': 'hah'
                    }]
                    this.setState({ meta_data })
                // }
            // })
    }

    componentDidUpdate(pP) {
    }

    render() {
        const { query, meta_data } = this.state
        const { name_list } = this.props
        // const count = Object.keys(meta_data[0]).length
        if (meta_data !== []) {
            var json = {}
            meta_data.map((data, idx) => {
                json = data
            })
            for (const [key, value] of Object.entries(json)) {
                console.log(`${key}: ${value}`);
              }
        }
        return (
            <div className="height-full">
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="search">
                            <i
                                className="fa fa-search"
                                role="button"
                                onClick={() => this.handleSearch()}
                            ></i>
                        </span>
                    </div>
                    <input
                        type="text"
                        className="form-control"
                        aria-label="Default"
                        aria-describedby="search"
                        value={query}
                        onChange={(e) => this.handleOnChange(e.target.value)}
                    />
                </div>
                <select>
                    {name_list.map((name, idx) =>
                        <option key={idx}>{name}</option>
                    )}
                </select>
                <table className="table table-bordered">
                        <tbody>
                            {meta_data.map((data, idx) =>
                                <tr key={idx}>
                                    <td><i className="fa fa-map mr-2" aria-hidden="true"></i>{Object.keys(data).length}</td>
                                    <td>{data[Object.keys(data)[idx]]}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
        const cssClasses = `col-md-auto rounded bg-light`

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