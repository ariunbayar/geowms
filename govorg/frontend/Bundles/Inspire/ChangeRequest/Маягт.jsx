import React, { Component, Fragment } from "react"
import { Formik, Form, Field, ErrorMessage, validateYupSchema , FieldArray} from 'formik'
import { service } from "./service"
import { validationSchema } from '../validationSchema'
import { validations } from '../validations'

export default class Маягт extends Component {

    constructor(props) {
        super(props)

        this.state = {
            is_loading: true,
            tid: props.tid,
            fid: props.fid,
            gid: props.gid,
            change_request_id: props.change_request_id,
            values: {},
            geojson: {},
            order_at: '',
            order_no: '',
            description: props.description,
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.validationSchema = validationSchema.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
    }

    onSubmit(values, { setStatus, setSubmitting }) {

        const { change_request_id } = this.state

        this.props.handleIsload(true)

        service
            .controlToApprove(values, change_request_id)
            .then(({success, info}) => {
                this.props.handleIsload(false)
                this.props.handleClose()
            })

    }

    handleRemove(){
        const {change_request_id} = this.state
        service.controlToRemove(change_request_id).then(({success}) => {
            if(success) this.props.handleClose()
        })
    }

    componentDidMount(){
        this.handleUpdate()
    }

    handleUpdate(){
        const {tid, fid, gid} = this.state
        if (!this.props.form_json) {
            service.detail(gid, tid, fid).then(({success, datas}) => {
                if(success){
                    this.setState({
                        values: datas,
                        is_loading: false
                    })
                }
            })
        }
    }

    render() {
        const { values, description } = this.state
        const { form_json, state } = this.props
        if ((this.state.is_loading || values.length == 0) && !form_json) {
            return (
                <p className="text-center"> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i> <br/> Түр хүлээнэ үү... </p>
            )
        }
        var datas = values
        if (form_json) datas = form_json

        return (
            <div className='overflow-auto card-body'>
                <Formik
                    enableReinitialize
                    initialValues={{
                        form_values: datas,
                        order_at: this.state.order_at,
                        order_no: this.state.order_no,
                    }}
                    validationSchema={validations}
                    onSubmit={this.onSubmit}
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
                                    {
                                        values.form_values && values.form_values.length > 0
                                        ?
                                            values.form_values.map((friend, index) => (
                                                <div key={index} className="row my-3">
                                                    <div className="col-md-3">
                                                        <label className="col-form-label">{friend.property_code ? friend.property_code : ''}</label>
                                                    </div>
                                                    {
                                                        friend.value_type == 'option'
                                                        ?
                                                            <div className="col-md-9">
                                                                <Fragment>
                                                                    <Field
                                                                        name={`form_values.${index}.data` || ""}
                                                                        as="select"
                                                                        className="form-control"
                                                                        disabled={state != "ХЯНАХ" ? true : false}
                                                                    >
                                                                        {friend.data_list &&
                                                                            friend.data_list.map((data, idy) =>
                                                                                <option key={idy}
                                                                                    value={data.code_list_id ? data.code_list_id  :''}
                                                                                >
                                                                                    {data.code_list_name ? data.code_list_name : ''}
                                                                                </option>
                                                                            )
                                                                        }
                                                                    </Field>
                                                                </Fragment>
                                                                <small>{friend.property_definition ? friend.property_definition : ''}</small>
                                                            </div>
                                                        :
                                                            <div className="col-md-9">
                                                                {
                                                                    friend.value_type_id == 'boolean'
                                                                    ?
                                                                        <Field
                                                                            name={`form_values.${index}.data`|| ""}
                                                                            as="select"
                                                                            className='form-control'
                                                                            disabled={state != "ХЯНАХ" ? true : false}
                                                                        >
                                                                            <option value="true">True</option>
                                                                            <option value="false">False</option>
                                                                        </Field>
                                                                    :
                                                                        <Field
                                                                            name={`form_values.${index}.data`  || ""}
                                                                            className='form-control'
                                                                            disabled={state != "ХЯНАХ" ? true : false}
                                                                            placeholder={friend.property_name}
                                                                            type={friend.value_type}
                                                                        />
                                                                }
                                                                <small>{friend.property_definition ? friend.property_definition : ''}</small>
                                                            </div>
                                                    }
                                                </div>
                                            ))
                                        :
                                            null
                                    }
                                    {
                                        state == "ХЯНАХ"
                                        ?
                                            <div>
                                                <div className="row my-3 ">
                                                    <div className="col-md-3">
                                                        <label className="col-form-label">Тушаалын дугаар</label>
                                                    </div>
                                                    <div className="col-md-9">
                                                        <Field
                                                            name="order_no"
                                                            className={'form-control ' + (errors.order_no ? 'is-invalid' : '')}
                                                            placeholder="Тушаалын дугаар"
                                                        />
                                                        <ErrorMessage  className="text-danger" name="order_no" component="span"/>
                                                    </div>
                                                </div>
                                                <div className="row my-3 ">
                                                    <div className="col-md-3">
                                                        <label className="col-form-label">Тушаал гарсан огноо </label>
                                                    </div>
                                                    <div className="col-md-9">
                                                        <Field
                                                            name="order_at"
                                                            className={'form-control ' + (errors.order_at ? 'is-invalid' : '')}
                                                            placeholder="Тушаал гарсан огноо"
                                                            type="date"
                                                        />
                                                        <ErrorMessage className="text-danger" name="order_at" component="span"/>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <button type="submit" className="btn btn-block gp-btn-primary">Хадгалах</button>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <button onClick={this.handleRemove} className="btn btn-block btn-danger">Устгах</button>
                                                    </div>
                                                </div>
                                            </div>
                                        :
                                            state == "ТАТГАЛЗСАН"
                                            ?
                                                <div className="row my-3">
                                                    <div className="col-md-3">
                                                        <label className="col-form-label">Тайлбар</label>
                                                    </div>
                                                    <div className="col-md-9">
                                                        <input type="text" className="form-control" value={description} disabled/>
                                                    </div>
                                                </div>
                                            :
                                                null
                                    }
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
