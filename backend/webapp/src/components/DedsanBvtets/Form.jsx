import React, { Component, Fragment } from "react"
import { Formik, Form, Field, ErrorMessage, validateYupSchema , FieldArray} from 'formik'
import { service } from "./service"

export default class Forms extends Component {

    constructor(props) {
        super(props)

        this.options = []
        this.state = {
            is_loading: true,
            pid: props.pid,
            fid: props.fid,
            model_id: null,
            model_name: null,
            values: {},
            datas: [],
            code: this.props.code,
            hasDatas: false,
            isTrue: false,
            isC: false,
            before_id: '',
            before_name: '',
            jumped: false,
            edit_name: '',
            options: false,
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.getFields = this.getFields.bind(this)
        this.makeModel = this.makeModel.bind(this)
        this.getOptions = this.getOptions.bind(this)
    }

    onSubmit(values, { setStatus, setSubmitting }) {
        this.setState({is_loading:true})
        const {model_name, code, model_id, edit_name} = this.state
        service.save(values, model_name, model_id, edit_name).then(({ success, info }) => {
            if (success) {
                this.setState({ is_loading: false, info })
                if (code !== '') this.props.refresh(code)
                else this.props.refresh()
            }
            else{
                alert(info)
            }
        })
    }

    componentDidUpdate(pP){
        const {model_id, model_name, edit_name} = this.props
        if(pP.model_id !== model_id){
            if(model_id) this.getFields(model_name, model_id, edit_name)
            this.setState({ before_id: pP.model_id, before_name: pP.model_name, before_edit_name: pP.edit_name })
        }
        if(pP.model_name !== model_name || pP.edit_name !== edit_name)
        {
            this.setState({model_id, model_name, edit_name})
            if(model_name) this.getFields(model_name, model_id, edit_name)
        }
    }

    componentDidMount() {
        const {model_id, model_name, edit_name} = this.props
        this.setState({ model_id, model_name, edit_name })
        if(model_name) this.getFields(model_name, model_id, edit_name)
    }

    getFields(model_name, model_id, edit_name){
        this.setState({ values: {} })
        service.getFields(model_name, model_id, edit_name).then(({ success, fields }) => {
           if(success)
           {
                if (model_name == 'property'){
                    var name = 'value_type_id'
                    var find = 'value_type'
                }
                if (model_name == 'feature_config'){
                    var name = 'data_type_id'
                    var find = 'data_type'
                }
                if (model_name == 'data_type_config' || model_name == 'code_list_config'){
                    var name = 'property_id'
                    var find = 'property'
                }
                fields.map(field => {
                    if (field.field_name == name)
                    {
                        service
                            .getDatas(find)
                            .then(rsp => {
                                if(rsp.success){
                                    this.setState({ datas: rsp.datas })
                                }
                        })
                    }
                    if (field.field_name == 'connect_feature_id' ) {
                        this.getOptions()
                    }
                })
                this.setState({values: fields, is_loading:false, model_id, model_name})
           }
           else
           {
                console.log(fields)
           }
        })
    }

    makeModel(){
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

    backToForm(){
        const { before_id , before_name, before_edit_name } = this.state
        if (before_edit_name !== ''){
            this.props.handleFormLeft(before_name, before_id, before_edit_name)
        }
        else {
            this.props.handleFormLeft(before_name, before_id)
        }
    }

    getOptions(){
        this.options = []
        service.getDatas('feature').then(rsp => {
            if(rsp.success){
                rsp.datas.map((data, idx) =>
                    this.options.push(<option key={idx} value={data.id}>{data.name}</option>)
                )
            }
            this.setState({ options: true })
        })
    }

    render() {
        const prop_name = this.props.model_name
        const prop_edit_name = this.props.edit_name
        const prop_id = this.props.model_id
        if (this.state.is_loading) {
            return (
                <p className="text-center"> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i> <br/> Түр хүлээнэ үү... </p>
            )
        }
        const { values, model_id, datas, isTrue, isC, jumped, edit_name, info } = this.state
        return (
            <div className='overflow-auto card-body'>
                 {
                    jumped
                    ?
                        <div className="mb-2">
                            <button type="button" className="btn btn-block gp-btn-primary" onClick={() => this.backToForm()}>Буцах</button>
                        </div>
                    :
                        null
                }
                {
                    prop_edit_name && prop_name
                    ?
                    <h4 className="text-center">{prop_name}-{prop_edit_name}{(prop_id ? `-` + prop_id : '')}</h4>
                    :
                    <h4 className="text-center"> Model-{prop_name}{(prop_id ? `-` + prop_id : '')}</h4>
                }
                <hr></hr>
                <Formik
                    enableReinitialize
                    initialValues={{ form_values: values }}
                    onSubmit={ this.onSubmit}
                >
                    {({
                        errors,
                        status,
                        touched,
                        isSubmitting,
                        setFieldValue,
                        handleBlur,
                        handleChange,
                        setValues,
                        values,
                        isValid,
                        dirty,
                    }) => {
                    return(
                        <Form>
                        <FieldArray
                                name="form_values"
                                render={arrayHelpers => (
                                <div>
                                    {values.form_values && values.form_values.length > 0 ? (
                                    values.form_values.map((friend, index) => (
                                        <div key={index} className="row my-3">
                                            <div className="col-md-4 overflow-hidden test-wrap">
                                                <label className="col-form-label">{friend.field_name}</label>
                                            </div>
                                                <div className="col-md-8">
                                                    {friend.field_type == 'radio' ?
                                                    <div role="group" className="form-check" aria-labelledby="my-radio-group">
                                                        <label>
                                                            <Field
                                                                type="radio"
                                                                className="form-check-input"
                                                                name={`form_values.${index}.data`}
                                                                value='true'
                                                                onChange={(e) => {
                                                                    handleChange(e)
                                                                    if (friend.field_name == 'is_connect_to_feature') {
                                                                        setFieldValue(`form_values.${index - 3}.data`, 'false')
                                                                        this.setState({ isTrue: true })
                                                                    }
                                                                    if (friend.field_name == 'has_class') {
                                                                        setFieldValue(`form_values.${index + 3}.data`, 'false')
                                                                        this.setState({ isTrue: false })
                                                                    }
                                                                }}
                                                            />
                                                                <b className="text-center">True</b>
                                                        </label>
                                                            <br/>
                                                        <label>
                                                            <Field
                                                                type="radio"
                                                                className="form-check-input"
                                                                name={`form_values.${index}.data`}
                                                                value='false'
                                                                onChange={(e) => {
                                                                    handleChange(e)
                                                                    if (friend.field_name == 'is_connect_to_feature') {
                                                                        setFieldValue(`form_values.${index - 3}.data`, 'true')
                                                                        this.setState({ isTrue: false })
                                                                    }
                                                                    if (friend.field_name == 'has_class') {
                                                                        setFieldValue(`form_values.${index + 3}.data`, 'true')
                                                                        this.setState({ isTrue: true })
                                                                    }
                                                                }}
                                                            />
                                                                <b className="text-center">False</b>
                                                        </label>
                                                    </div>
                                                    :
                                                        (
                                                            (friend.field_name == 'data_type_id' && prop_name !== 'data_type_config')||
                                                            (friend.field_name == 'property_id' && prop_name === 'data_type_config')||
                                                            (friend.field_name.includes('connect_feature') &&  prop_name === 'feature_config')||
                                                            (friend.field_name == 'value_type_id' && prop_name !== 'value_type') ||
                                                            // (friend.field_name == 'value_type_id' && prop_name == 'value_type' && edit_name != '') ||
                                                            ((friend.field_name.includes('property_id') && prop_name == 'code_list_config'))
                                                            ?
                                                            <div className="input-group">
                                                                <Field
                                                                    name={`form_values.${index}.data`}
                                                                    className='form-control'
                                                                    placeholder={friend.field_name}
                                                                    as='select'
                                                                    disabled = {friend.field_name.includes('connect_feature') && isTrue ? 'disabled' : ''}
                                                                >
                                                                    <option value=""> --- Сонгоно уу --- </option>
                                                                    {
                                                                        friend.field_name.includes('connect_feature') && !isTrue && this.state.options
                                                                        ?
                                                                        this.options
                                                                        :
                                                                        datas.map((data, idx) =>
                                                                            <option
                                                                                key={idx}
                                                                                value={data.id}
                                                                            >
                                                                                {data.name}
                                                                            </option>
                                                                        )
                                                                    }
                                                                </Field>
                                                                {
                                                                    prop_name != 'code_list_config'
                                                                    ?
                                                                        !(friend.field_name.includes('connect_feature'))
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
                                                                        : null
                                                                    :
                                                                        null

                                                                }
                                                            </div>
                                                            :
                                                                <Field
                                                                    name={`form_values.${index}.data`}
                                                                    className='form-control'
                                                                    placeholder={friend.field_name}
                                                                    type={friend.field_type}
                                                                    disabled={(friend.data !== '' && friend.field_name.includes("id")) ? 'disabled' : ''}
                                                                />
                                                        )
                                                    }
                                                </div>
                                        </div>
                                    ))
                                    ) : ( null
                                    )}
                                    <div className={edit_name !== '' ? ' row' : ''}>
                                        {
                                            edit_name ?
                                                prop_name != 'value_type' ?
                                                <a className="btn col-md-4 btn-danger mr-1 text-white" onClick={() => this.props.remove(prop_name, prop_id, prop_edit_name, this.props.type, this.props.top_id)}>
                                                    Устгах
                                                </a>
                                                : null
                                                : null
                                        }
                                        <button type="submit" className={`btn ` + (edit_name ? 'col-md-7' : 'btn-block') +` gp-btn-primary`}>{edit_name !== '' ? 'Засах' : 'Хадгалах'}</button>
                                    </div>
                                </div>
                                )}
                            />
                        </Form>
                    )}}
                </Formik>
            </div>
        )
    }
}