import React, { Component } from "react"
import { NavLink } from "react-router-dom"

import { service } from "./service"
import ModalAlert from "@utils/Modal/ModalAlert"


class HandleInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: this.props.meta_data[this.props.meta]
        }
        this.handleOnChange = this.handleOnChange.bind(this)
    }

    handleOnChange(value) {
        const { meta } = this.props
        this.setState({ value })
        this.props.getValues(value, meta)
    }

    render(){
        const { meta, meta_data, field, type, choices } = this.props
        const { value } = this.state
        this.default = false
        if(choices) {
            choices.map((choice, idx) => {
                if (value == choice[0]) this.default = true
            })
        }
        return(
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
                            type="text"
                            className="form-control"
                            maxLength={type}
                            id={meta}
                            onChange={(e) => this.handleOnChange(e.target.value)}
                            value={value || ''}
                            placeholder={field + ` оруулна уу`}
                        />
                    : choices !== null ?
                        <select
                            defaultValue={this.default ? value : ''}
                            className="form-control"
                            onChange={(e) => this.handleOnChange(e.target.value)}>
                            <option value=''>--- Сонгоно уу ---</option>
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
export class MetaEdit extends Component {

    constructor(props) {
        super(props)

        this.list = []
        this.state = {
            edit: false,
            handleSaveIsLoad: false,
            is_loading: false,
            modal_alert_status: "closed",
            timer: null,
            text: '',
            id: this.props.match.params.id,
            modal_open: false,
            geom_ids: [],
        }
        this.handleSave = this.handleSave.bind(this)
        this.getValues = this.getValues.bind(this)
        this.modalClose = this.modalClose.bind(this)
    }

    handleSave() {
        const { geom_ids, id } = this.state
        this.setState({ handleSaveIsLoad: true })
        service
            .setEdit(id, this.values, geom_ids)
            .then(({success}) => {
                if (success) {
                    this.setState({ handleSaveIsLoad: false, modal_open: true, modal_alert_status: 'open' })
                }
            })
    }

    modalClose() {
        this.setState({ modal_alert_status: "closed", handleSaveIsLoad: false, modal_open: false })
        clearTimeout(this.state.timer)
        this.props.history.push(`/gov/meta/`)
    }

    modalCloseTime() {
        this.state.timer = setTimeout(() => {
            this.setState({ modal_alert_status: "closed", handleSaveIsLoad: false, modal_open: false })
            this.props.history.push(`/gov/meta/`)
        }, 2000)
    }

    componentDidMount() {
        const { id } = this.state
        service
            .getDetail(id, 'edit')
            .then(({success, meta_data, geo_data_list}) => {
                if (success) {
                    const data_field = Object.keys(meta_data)
                    if (geo_data_list.length > 0) {
                        this.geo_data_field = Object.keys(geo_data_list[0])
                    }
                    this.setState({ data_field, geo_data_field: this.geo_data_field, meta_data, geo_data_list })
                    this.getMetaFields(meta_data)
            }
        })
    }

    getMetaFields(meta_data) {
        service
            .getMetaFields()
            .then(({success, fields}) => {
                if (success) {
                    this.values = new Object();
                    fields.map((field, idx) => {
                        this.values[field.origin_name] = meta_data[field.origin_name]
                    })
                    this.setState({ fields, is_loading: true })
                }
            })
    }

    getValues(input_datas, meta) {
        this.values[meta] = input_datas
    }

    collectGeom(e) {
        const value = e.target.value
        const check = e.target.checked
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

    render() {
        const {  is_loading, data_field, fields, geo_data_field, meta_data, geo_data_list, text, modal_open } = this.state
        return (
            <div className="card">
                <div className="card-body">
                    <div className="text-left">
                        <NavLink to={`/gov/meta/`}>
                            <p className="btn gp-outline-primary">
                                <i className="fa fa-angle-double-left"></i> Буцах
                            </p>
                        </NavLink>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-md-5 ml-4">
                            {
                                !is_loading
                                ?
                                <div className="d-flex justify-content-center">
                                    <div className="spinner-border gp-text-primary" role="status"></div>
                                </div>
                                :
                                data_field ?
                                    data_field.map((meta, idx) =>
                                        (
                                            meta != 'id'
                                            ?
                                            fields && fields.map((field, idx) =>
                                                field.origin_name == meta
                                                ?
                                                    <HandleInput key={idx}
                                                        meta={meta}
                                                        meta_data={meta_data}
                                                        getValues={this.getValues}
                                                        field={field.name}
                                                        type={field.length}
                                                        idx={idx}
                                                        origin_name={field.origin_name}
                                                        choices={field.choices}
                                                    />
                                                :
                                                    null
                                            )
                                            : null
                                        )
                                    )
                                    : null
                            }
                        </div>
                        <div className="col-md-6">
                            <label>Геомын дугаарууд: &nbsp;
                            <i role="button" className="fa fa-info-circle" onMouseOver={() => {
                                const text = 'Устгах геомын дугаарыг сонгоно'
                                this.setState({ text })
                            }} onMouseOut={() => this.setState({ text: '' })}>
                                    {
                                        text !== ''
                                        ? <b className="position-absolute card card-body" style={{zIndex: '1050'}}>{text}</b>
                                        : null
                                    }
                            </i>
                            </label>
                            <ul style={{listStyle: 'none'}}>
                                {
                                geo_data_list && geo_data_list.length > 0
                                ?
                                    geo_data_list.map((name, idx) =>
                                    <li className="animated slideInLeft float-left mr-2 pl-2 pr-2" key={idx}>
                                        <div className="icheck-primary">
                                            <input type="checkbox" value={name.geom_id} id={idx} onChange={(e) => this.collectGeom(e)}/>
                                            <label htmlFor={idx}>{name.geom_id}</label>
                                        </div>
                                    </li>
                                    )
                                :
                                    <li className="animated slideInLeft float-left mr-2 pl-2 pr-2">
                                        Бүртгэлтэй геом байхгүй байна
                                    </li>
                                }
                            </ul>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-2">
                            <div className="form-group">
                                {this.state.handleSaveIsLoad ?
                                    <>
                                        <button className="btn btn-block gp-btn-primary">
                                            <a className="spinner-border text-light" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </a>
                                            <span> Шалгаж байна. </span>
                                        </button>
                                    </>
                                    :
                                    <button className="btn btn-block gp-btn-primary" onClick={this.handleSave} >
                                        Хадгалах
                                </button>
                                }
                                {
                                    modal_open
                                    ?
                                    <ModalAlert
                                        modalAction={() => this.modalClose()}
                                        status={this.state.modal_alert_status}
                                        title="Амжилттай хадгаллаа"
                                        model_type_icon="success"
                                    />
                                    :
                                    null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
