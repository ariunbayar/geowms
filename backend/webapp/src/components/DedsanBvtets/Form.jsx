import React, { Component, Fragment } from "react"
import { Formik, Form, Field, ErrorMessage, validateYupSchema , FieldArray} from 'formik'
import { service } from "./service"
import Modal from '../../../../../src/components/Modal/DeleteModal'

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
            datas: [],
            code: this.props.code,
            hasDatas: false,
            isTrue: false,
            isC: false,
            before_id: '',
            before_name: '',
            jumped: false,
            edit_name: '',
            modal_status: "closed",
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.getFields = this.getFields.bind(this)
        this.makeModel = this.makeModel.bind(this)
        this.backToSide = this.backToSide.bind(this)
        this.closeForm = this.closeForm.bind(this)
    }

    onSubmit(values, { setStatus, setSubmitting }) {
        this.setState({is_loading:true})
        const {model_name, code, model_id, edit_name} = this.state
        service.save(values, model_name, model_id, edit_name).then(({ success, info }) => {
            if (success) {
                this.setState({ is_loading: false, info })
                this.backToSide('open')
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
            this.setState({ before_id: pP.model_id, before_name: pP.model_name })
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
        console.log(model_name, model_id, edit_name)
        service.getFields(model_name, model_id, edit_name).then(({ fields }) => {
           if(fields)
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
                })
                this.setState({values: fields, is_loading:false})
           }
           else
           {
                console.log('get fields gg')
           }
        })
    }

    makeModel(){
        this.setState({ jumped: true })
        if (this.props.model_name == 'feature_config') {
            this.props.handleFormLeft('data_type', '')
        }
        if (this.props.model_name == 'property') {
            this.props.handleFormLeft('value_type', '')
        }
        if (this.props.model_name == 'data_type_config') {
            this.props.handleFormLeft('property', '')
        }
    }

    backToSide(type){
        if (type == 'back') this.modalClose()
        if (type == 'close') this.setState({ modal_status: type })
        if (type == 'open') this.setState({ modal_status: type })
    }

    modalClose(){
        const { before_id, before_name } = this.state
        this.setState({ jumped: false, modal_status: "close" })
        this.props.handleFormLeft(before_name, before_id)
    }

    closeForm(){
        console.log('close')
        this.props.done()
    }

    render() {

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
                            <button type="button" className="btn btn-block gp-btn-primary" onClick={() => this.backToSide('back')}>Буцах</button>
                        </div>
                    :
                        null
                }
                {
                    this.props.edit_name && this.props.model_name
                    ?
                    <h4 className="text-center">{this.props.model_name}-{this.props.edit_name}{(this.props.model_id ? `-` + this.props.model_id : '')}</h4>
                    :
                    <h4 className="text-center"> Model-{this.props.model_name}{(this.props.model_id ? `-` + this.props.model_id : '')}</h4>
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
                        console.log(values)
                    return(
                        <Form>
                        <FieldArray
                                name="form_values"
                                render={arrayHelpers => (
                                <div>
                                    {values.form_values && values.form_values.length > 0 ? (
                                    values.form_values.map((friend, index) => (
                                        <div key={index} className="row my-3">
                                            <div className="col-md-3 overflow-hidden">
                                                <label className="col-form-label">{friend.field_name}</label>
                                            </div>
                                                <div className="col-md-9">
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
                                                                        this.setState({ isTrue: true })
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
                                                                        this.setState({ isTrue: false })
                                                                    }
                                                                }}
                                                            />
                                                                <b className="text-center">False</b>
                                                        </label>
                                                    </div>
                                                    :
                                                        (
                                                            (friend.field_name == 'data_type_id' && this.props.model_name !== 'data_type_config')||
                                                            (friend.field_name == 'property_id' && this.props.model_name === 'data_type_config')||
                                                            (friend.field_name == 'value_type_id' && this.props.model_name !== 'value_type') ||
                                                            ((friend.field_name == 'property_id' || friend.field_name == 'to_property_id') && this.props.model_name == 'code_list_config')
                                                            ?
                                                            <div className="input-group">
                                                                <Field
                                                                    name={`form_values.${index}.data`}
                                                                    className='form-control'
                                                                    placeholder={friend.field_name}
                                                                    as='select'
                                                                >
                                                                    <option value=""> ... </option>
                                                                    {datas.map((data, idx) =>
                                                                        <option
                                                                            key={idx}
                                                                            value={data.id}
                                                                        >
                                                                            {data.name}
                                                                        </option>
                                                                    )}
                                                                </Field>
                                                                {
                                                                    this.props.model_name != 'code_list_config'
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

                                                                }
                                                            </div>
                                                            :
                                                            (
                                                                (friend.field_name.includes('id') &&
                                                                !(friend.field_name.includes('connect_feature')))
                                                                ?
                                                                    <Field
                                                                        name={`form_values.${index}.data`}
                                                                        className='form-control'
                                                                        placeholder={friend.field_name}
                                                                        type={friend.field_type}
                                                                        disabled={(friend.field_name == 'top_theme_id') || (friend.field_name == 'value_type_id' && edit_name == '') ? '' : 'disabled'}
                                                                    />
                                                                :
                                                                    <Field
                                                                        name={`form_values.${index}.data`}
                                                                        className='form-control'
                                                                        placeholder={friend.field_name}
                                                                        type={friend.field_type}
                                                                        disabled={
                                                                            (!isTrue &&
                                                                                (friend.field_name.includes('connect_feature')))
                                                                            ?
                                                                                'disabled'
                                                                            :
                                                                                ''
                                                                        }
                                                                />

                                                            )
                                                        )
                                                    }
                                                </div>
                                        </div>
                                    ))
                                    ) : ( null
                                    )}
                                    <div className={edit_name !== '' ? ' row' : ''}>
                                        {
                                            edit_name &&  <button type="submit" className="btn col-md-4 btn-danger mr-5">Устгах</button>
                                        }
                                        <button type="submit" className={`btn ` + (edit_name ? 'col-md-7' : 'btn-block') +` gp-btn-primary`}>{edit_name !== '' ? 'Засах' : 'Хадгалах'}</button>
                                    </div>
                                </div>
                                )}
                            />
                        </Form>
                    )}}
                </Formik>
                <Modal
                    modalAction={() => this.backToSide('close')}
                    title={info || ''}
                    text={`Үргэлжлүүлэх үү ?`}
                    model_type_icon = "danger"
                    status={this.state.modal_status}
                    modalClose={() => this.closeForm()}
                    actionName='Үргэлжлүүлэх'
                    actionNameBack='Болсон'
                />
            </div>
        )
    }
}