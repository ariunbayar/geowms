import React, { Component, Fragment } from "react"

import ReactDOM from 'react-dom'
import {Control} from 'ol/control'
import { service } from "../../service"

class NewMetaInput extends Component{
    constructor(props){
        super(props)
        this.input_data = {}
        this.state = {
            value: '',
        }
    }

    handleOnChange(value) {
        const { idx, ix, field, type, origin_name } = this.props
        this.setState({ value })
        this.props.getValues(value, idx)
    }

    render() {
        const { idx, ix, field, type, choices } = this.props
        const { value } = this.state
        return (
            <div className="form-group animated slideInLeft">
                <label>{field}</label>
                {
                    type > 1900 && choices == null
                    ?
                        <textarea
                            className="form-control"
                            rows="3"
                            onChange={(e) => this.handleOnChange(e.target.value)}
                            maxLength={type}
                            placeholder={value}
                            value={value}
                        >
                        </textarea>
                    : type < 1900 && choices == null ?
                        <input
                            type='text'
                            maxLength={type}
                            className="form-control"
                            value={value}
                            onChange={(e) => this.handleOnChange(e.target.value)}
                            placeholder={field + ` оруулна уу`}
                        />
                    : choices !== null ?
                        <select className="form-control"
                            onChange={(e) => this.handleOnChange(e.target.value)}>
                            <option key={idx} value=''>--- Сонгоно уу ---</option>
                            {choices.map((choice, idx) =>
                                <option key={idx} value={choice[0]}>{choice[1]}</option>
                            )}
                        </select>
                    : null
                }
                <small className="text-muted float-right">урт нь: {type}</small>
            </div>
        )
    }
}

class ListComponent extends Component {

    constructor(props) {

        super(props)
        this.list = []
        this.values = []
        this.state = {
            name_list: {},
            meta_data_list: [],
            query: '',
            found_it: '',
            is_searched: false,
            is_loading: false,
            geom_ids: [],
            is_new_meta: false,
            fields: [],
            is_create_meta: false,
        }
        this.handleOnChange = this.handleOnChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.collectGeom = this.collectGeom.bind(this)
        this.newMeta = this.newMeta.bind(this)
        this.getValues = this.getValues.bind(this)
    }

    handleOnChange(query) {
        this.setState({ query })
    }

    handleSearch() {
        const { query } = this.state
        this.setState({ is_loading: false })
        service.searchMeta(query).then(({success, meta_data}) => {
            if (success) {
                this.values = []
                this.setState({ found_it: query, is_searched: true, is_loading: true })
                // this.setState({ meta_data_list: meta_data })
            } else {
                this.setState({ found_it: '', is_searched: true, is_loading: true })
            }
        })
    }

    collectGeom(e) {
        const value = e.target.value
        const check = e.target.checked
        const { geom_ids } = this.state
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
        this.setState({ geom_ids: this.list })

    }

    saveGeom() {
        const { geom_ids, found_it, is_create_meta } = this.state
        let meta_data = []
        if (found_it && !is_create_meta) {
            const rsp = {
                'meta_id' : found_it
            }
            meta_data.push(rsp)
        }
        else if (is_create_meta && this.values.length > 0) {
            meta_data = this.values
        }
        service
            .createMeta(meta_data, geom_ids)
            .then(rsp => {
                console.log(rsp);
            })
        console.log(geom_ids)
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

    newMeta() {
        const { found_it } = this.state
        this.setState({ is_loading: true })
        if (found_it !== '') {
            service
                .deleteMeta(found_it)
                .then(({success}) => {
                    if (success) {
                        console.log("Амжилттай устгасан")
                    } else {
                        console.log("Устгах явцад алдаа гарсан")
                    }
                })
        }
        service
            .getMetaFields()
            .then(({success, fields}) => {
                if (success) {
                    this.values = []
                    fields.map((field, idx) => {
                        const json = {
                            'field_name': field.origin_name,
                            'value': ''
                        }
                        this.values.push(json)
                    })
                    this.setState({ fields, is_new_meta: true, is_searched: false, found_it: '' })
                }
            })
        this.setState({ is_loading: false })
    }

    getValues(input_datas, idx) {
        this.values[idx].values = input_datas
        this.setState({ is_create_meta: true })
    }

    render() {
        const { query, meta_data_list, meta, found_it, is_new_meta, fields } = this.state
        const { name_list } = this.props
        return (
            <div className="height-full animated slideInLeft">
                <div className="input-group mb-1">
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
                    found_it
                    ?
                        <div>
                            <label>Олдсон мета: {found_it}</label>
                        </div>
                    :
                    !is_new_meta && found_it == ''
                    ?
                        <div>
                            <label>Мета байхгүй байна
                                <br/>
                                <center>
                                    <span role="button" className="gp-text-primary" onClick={() => this.newMeta()}>
                                        <i className="fa fa-plus-square"></i>
                                        &nbsp;Шинээр Мета үүсгэх үү ?
                                    </span>
                                </center>
                            </label>
                        </div>
                    :
                    <div>
                        <button className="btn gp-btn-primary" onClick={() => this.setState({ is_new_meta: false })}>
                            <i className="fa fa-angle-double-left"></i>
                            &nbsp;Буцах
                        </button>
                        &nbsp;&nbsp;&nbsp;
                        <b>Мета дата шинээр үүсгэх</b>
                    </div>
                }
                {
                    !found_it && is_new_meta && fields.length > 0
                    ?
                        <div className="new-meta-form ">
                            {fields.map((field, idx) =>
                                <NewMetaInput key={idx}
                                    field={field.name}
                                    type={field.length}
                                    idx={idx}
                                    origin_name={field.origin_name}
                                    getValues={this.getValues}
                                    choices={field.choices}
                                />
                            )}
                        </div>
                    :
                    null
                }
                <hr />
                <div>
                    <label>Геометр өгөгдлүүд:</label>
                </div>
                <ul className="list-in-meta" style={is_new_meta ? {maxHeight: "calc( 20vh - 70px - 15px)"} : null}>
                    {name_list && name_list !== {} && name_list.map((name, idx) =>
                        <li className="animated slideInLeft float-left mr-2 pl-2 pr-2" key={idx}>
                            <div className="icheck-primary">
                                <input type="checkbox" value={name} id={idx} onChange={(e) => this.collectGeom(e)}/>
                                <label htmlFor={idx}>{name}</label>
                            </div>
                        </li>
                    )}
                </ul>
                <div className="btn-group flex-wrap" role="group">
                    <button type="button" className="btn gp-btn-primary" onClick={() => this.saveGeom()}>Хадгалах</button>
                    <button type="button" className="btn btn-light" onClick={() => {
                        (found_it !== '' ? this.props.modal(`Та "${found_it}" уг метаг цэвэрлэхдээ итгэлтэй байна уу ?`, this.newMeta) : this.newMeta)
                    }}>Цэвэрлэх</button>
                    <button type="button" className="btn btn-secondary" onClick={() => this.props.modal('Та уг цонхыг хаахдаа итгэлтэй байна уу ?')}>Болих</button>
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

    showMetaList(islaod, name_list, modal) {
        this.toggleControl(islaod)
        this.renderComponent({name_list, modal})
    }

}