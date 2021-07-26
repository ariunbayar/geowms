import React, { Component, Fragment, useState, useEffect } from "react"
import { service } from "./service"
import Loader from "@utils/Loader"

export default class Forms extends Component {

    constructor(props) {
        super(props)

        this.state = {
            is_loading: true,
            pid: props.pid,
            fid: props.fid,
            model_id: null,
            model_name: null,
            values: {},
            code: this.props.code,
            before_id: '',
            before_name: '',
            jumped: false,
            edit_name: '',
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.getFields = this.getFields.bind(this)
        this.makeModel = this.makeModel.bind(this)
        this.getValue = this.getValue.bind(this)
        this.connectedFields = this.connectedFields.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
    }

    onSubmit() {
        this.setState({ is_loading: true })
        const { values, model_name, code, model_id, edit_name } = this.state
        service.save(values, model_name, model_id, edit_name).then(({ success, info }) => {
            this.setState({ is_loading: false, info })
            if (success) {
                const modal = {
                    modal_status: "open",
                    modal_icon: "fa fa-check-circle",
                    icon_color: 'success',
                    title: info,
                }
                global.MODAL(modal)
                if (code !== '') this.props.refresh(code)
                else this.props.refresh()
            }
            else {
                const modal = {
                    modal_status: "open",
                    modal_icon: "fa fa-times-circle",
                    icon_color: 'danger',
                    title: info,
                }
                global.MODAL(modal)
            }
        })
    }

    handleRemove() {
        const { model_name, model_id, edit_name, type, top_id } = this.props
        this.props.remove(model_name, model_id, edit_name, type, top_id)
    }

    openModal(logo, title, text, action) {
        const modal = {
            modal_status: 'open',
            modal_icon: `fa fa-${logo}`,
            modal_bg: '',
            title: title,
            text: text,
            has_button: true,
            actionNameBack: 'Буцах',
            actionNameDelete: title,
            modalAction: action,
            modalClose: ""
        }
        global.MODAL(modal)
    }

    connectedFields(value_obj, idx) {
        var type = getOposite(value_obj.data)
        function getOposite(data) {
            if (data == 'true') return 'false'
            if (data == 'false') return 'true'
        }

        if (value_obj.field_name == 'is_connect_to_feature') {
            this.state.values[idx - 3].data = type
            if (type == 'true') {
                this.state.values[idx + 1].data = ''
                this.state.values[idx + 2].data = ''
            }
        }
        if (value_obj.field_name == 'has_class') {
            this.state.values[idx + 3].data = type
            if (type == 'false') {
                this.state.values[idx + 4].data = ''
                this.state.values[idx + 5].data = ''
            }
        }
        this.setState({ values: this.state.values })
    }

    getValue(data, idx) {
        let value_obj = this.state.values[idx]
        this.state.values[idx].data = data
        this.connectedFields(value_obj, idx)
    }

    componentDidUpdate(pP) {
        const { model_id, model_name, edit_name } = this.props
        if(pP.model_id !== model_id) {
            this.getFields(model_name, model_id, edit_name)
            this.setState({ before_id: pP.model_id, before_name: pP.model_name, before_edit_name: pP.edit_name })
        }
        if(pP.model_name !== model_name || pP.edit_name !== edit_name) {
            this.setState({ model_id, model_name, edit_name })
            this.getFields(model_name, model_id, edit_name)
        }
    }

    componentDidMount() {
        const { model_id, model_name, edit_name } = this.props
        this.setState({ model_id, model_name, edit_name })
        this.getFields(model_name, model_id, edit_name)
    }

    getFields(model_name, model_id, edit_name) {
        this.setState({ values: {}, is_loading: true })
        service
            .getFields(model_name, model_id, edit_name)
            .then(({ success, fields }) => {
                if(success) {
                    let has_class_idx
                    let is_connected_to_feature_idx
                    fields.map((field, idx) => {
                        if (field.field_name == 'has_class') has_class_idx = idx
                        if (field.field_name == 'is_connect_to_feature') is_connected_to_feature_idx = idx
                    })
                    this.setState({ values: fields, is_loading: false, model_id, model_name, has_class_idx, is_connected_to_feature_idx })
                }
            })
    }

    makeModel() {
        this.setState({ jumped: true })
        if (this.props.model_name == 'feature_config') {
            this.props.handleFormLeft('data_type', '')
        }
        if ((this.props.model_name == 'property') || (this.props.model_name == 'value_type')) {
            this.props.handleFormLeft('value_type', '')
        }
        if (this.props.model_name == 'data_type_config') {
            this.props.handleFormLeft('property', '')
        }
    }

    backToForm() {
        const { before_id , before_name, before_edit_name } = this.state
        if (before_edit_name !== '') {
            this.props.handleFormLeft(before_name, before_id, before_edit_name)
        }
        else {
            this.props.handleFormLeft(before_name, before_id)
        }
    }

    checkSelectAddData(data) {
        let has_btn = !(data.field_name.includes('connect_feature')) && !(data.field_name == 'top_code_list_id')
        return has_btn
    }

    render() {
        const prop_name = this.props.model_name
        const prop_edit_name = this.props.edit_name
        const prop_id = this.props.model_id
        const { values, jumped, edit_name, is_connected_to_feature_idx, is_loading } = this.state
        const btn_name = edit_name !== '' ? 'Засах' : 'Хадгалах'
        return (
            <div className='overflow-auto card-body'>
                 {
                    jumped
                    &&
                        <div className="mb-2">
                            <button type="button" className="btn btn-block gp-btn-primary" onClick={() => this.backToForm()}>Буцах</button>
                        </div>
                }
                <Loader is_loading={is_loading} text={'Уншиж байна'} />
                {
                    prop_edit_name && prop_name
                    ?
                        <h4 className="text-center">{prop_name}-{prop_edit_name}{(prop_id ? `-` + prop_id : '')}</h4>
                    :
                        <h4 className="text-center"> Model-{prop_name}{(prop_id ? `-` + prop_id : '')}</h4>
                }
                <hr></hr>
                <div>
                    {
                        values && values.length > 0
                        ?
                            values.map((friend, index) =>
                                <div key={index} className="row my-3">
                                    <div className="col-md-4 overflow-hidden test-wrap">
                                        <label className="col-form-label">{friend.field_name}</label>
                                    </div>
                                    <div className="col-md-8">
                                        {
                                            friend.field_type == 'radio'
                                            ?
                                                <RadioInputs
                                                    {...friend}
                                                    index={index}
                                                    setValue={this.getValue}
                                                />
                                            :
                                                (
                                                    friend.field_type == 'select'
                                                    ?
                                                        <div className="input-group">
                                                            <Select
                                                                {...friend}
                                                                index={index}
                                                                setValue={this.getValue}
                                                                can_connect_feature={is_connected_to_feature_idx && values[is_connected_to_feature_idx].data == 'false'}
                                                            />
                                                            {
                                                                prop_name != 'code_list_config'
                                                                ?
                                                                    this.checkSelectAddData(friend)
                                                                    ?
                                                                        <a className="input-group-btn">
                                                                            <i
                                                                                role="button"
                                                                                className="fa fa-plus-square gp-text-primary input-group-addon fa-2x m-0 p-0"
                                                                                onClick={() => this.makeModel()}
                                                                                aria-hidden="true"
                                                                            >
                                                                            </i>
                                                                        </a>
                                                                    :
                                                                        null
                                                                :
                                                                    null

                                                            }
                                                        </div>
                                                    :
                                                        <Input
                                                            {...friend}
                                                            index={index}
                                                            setValue={this.getValue}
                                                            model_name={prop_name}
                                                        />
                                                )
                                            }
                                    </div>
                                </div>
                            )
                        :
                            null
                    }
                    <div className={edit_name !== '' ? ' row' : ''}>
                        {
                            edit_name
                            ?
                                prop_name != 'value_type'
                                ?
                                    <a
                                        className="btn col-md-4 btn-danger mr-1 text-white"
                                        onClick={() => this.openModal('times-circle text-danger', 'Устгах', `Та ${prop_edit_name} - нэртэй ${prop_name}-г устгахдаа итгэлтэй байна уу ?`, this.handleRemove)}
                                    >
                                        Устгах
                                    </a>
                                :
                                    null
                            :
                                null
                        }
                        <button
                            type="button"
                            onClick={() => this.openModal('exclamation-circle text-warning', btn_name, `Та ${edit_name ? `${prop_edit_name} - нэртэй` : ''} ${prop_name}-г ${btn_name.toLowerCase()}даа итгэлтэй байна уу ?`, this.onSubmit)}
                            className={`btn ${edit_name ? 'col-md-7' : 'btn-block'} gp-btn-primary`}
                        >
                            {btn_name}
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

function Select(props) {

    const [value, setValue] = useState(props.data)

    useEffect(() => {
        setValue(props.data)
    }, [props.data])

    const handleOnChange = (e) => {
        let val = e.target.value
        setValue(val)
        props.setValue(val, props.index)
    }
    return (
        <select
            className='form-control'
            placeholder={props.field_name}
            disabled={
                props.can_connect_feature && props.field_name.includes('connect_feature')
                ?
                    'disabled'
                :
                    ''
            }
            value={value}
            onChange={handleOnChange}
        >
            <option value=""> --- Сонгоно уу --- </option>
            {
                props.options.map((data, idx) =>
                    <option
                        key={idx}
                        value={data.id}
                    >
                        {data.name}
                    </option>
                )
            }
        </select>
    )
}

function Input(props) {

    const [value, setValue] = useState(props.data)

    useEffect(() => {
        setValue(props.data)
    }, [props.data])

    const handleOnChange = (e) => {
        let val = e.target.value
        setValue(val)
        props.setValue(val, props.index)
    }

    return (
        <input
            type={props.field_type}
            placeholder={props.field_name}
            onChange={handleOnChange}
            value={value || ''}
            className={'form-control'}
            disabled={props.data && props.field_name.includes("id") && !(props.field_name == props.model_name + "_id") ? 'disabled' : ''}
        />
    )
}

function RadioInputs(props) {

    const [value, setValue] = useState(props.data.toString())

    useEffect(() => {
        setValue(props.data.toString())
    }, [props.data])

    const handleOnchange = (e) => {
        setValue(e.target.value)
        props.setValue(e.target.value, props.index)
    }

    return (
        <div className="form-check">
            <div>
                <input
                    type="radio"
                    id={`${props.field_name}-true`}
                    name={props.field_name}
                    checked={value == 'true' ? true : false}
                    value={`true`}
                    onChange={handleOnchange}
                />
                &nbsp;
                <label htmlFor={`${props.field_name}-true`}>
                    True
                </label>
            </div>
            <div>
                <input
                    type="radio"
                    id={`${props.field_name}-false`}
                    name={props.field_name}
                    checked={value == 'false' ? true : false}
                    value={`false`}
                    onChange={handleOnchange}
                />
                &nbsp;
                <label htmlFor={`${props.field_name}-false`}>
                    False
                </label>
            </div>
        </div>
    )
}
