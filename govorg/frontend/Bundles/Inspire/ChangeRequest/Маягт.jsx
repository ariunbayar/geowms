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
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.validationSchema = validationSchema.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
    }

    onSubmit(values, { setStatus, setSubmitting }) {
        const {change_request_id} = this.state
        service.controlToApprove(values, change_request_id).then(({success}) => {
            if(success) this.props.handleClose()
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
        service.detail(gid, tid, fid).then(({success, datas}) => {
            if(success){
                this.setState({
                    values:datas,
                    is_loading: false
                })
            }
        })
    }

    render() {
        const { values } = this.state
        if (this.state.is_loading || values.length == 0) {
            return (
                <p className="text-center"> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i> <br/> Түр хүлээнэ үү... </p>
            )
        }
        return (
            <div className='overflow-auto card-body'>
                <Formik
                    enableReinitialize
                    initialValues={{
                        form_values: values,
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
                                {values.form_values && values.form_values.length > 0 ? (
                                values.form_values.map((friend, index) => (
                                    <div key={index} className="row my-3 ">
                                        <div className="col-md-3">
                                            <label className="col-form-label">{friend.property_code ? friend.property_code : ''}</label>
                                        </div>
                                        {friend.value_type == 'option' ?
                                            <div className="col-md-9">
                                                <Fragment>
                                                    <Field name={`form_values.${index}.data` || ""} as="select" className="form-control" disabled={friend.role == 1 ? true : false}>
                                                        {friend.data_list &&
                                                            friend.data_list.map((data, idy) =>
                                                            <option key = {idy} value={data.code_list_id ? data.code_list_id  :''}>{data.code_list_name ? data.code_list_name : ''}</option>
                                                            )
                                                        }
                                                    </Field>
                                                </Fragment>
                                                <small>{friend.property_definition ? friend.property_definition : ''}</small>
                                            </div>
                                            :
                                            <div className="col-md-9">
                                                {friend.value_type_id == 'boolean' ?
                                                <Field
                                                name={`form_values.${index}.data`|| ""}
                                                as="select"
                                                className='form-control'
                                                disabled={friend.role == 1 ? true : false}
                                                >
                                                    <option value="true">True</option>
                                                    <option value="false">False</option>
                                                </Field>
                                                :
                                                <Field
                                                    name={`form_values.${index}.data`  || ""}
                                                    className='form-control'
                                                    disabled={friend.role == 1 ? true : false}
                                                    placeholder={friend.property_name}
                                                    type={friend.value_type}
                                                    />
                                                }
                                                <small>{friend.property_definition ? friend.property_definition : ''}</small>
                                            </div>
                                        }
                                    </div>
                                ))
                                ) : ( null
                                )}
                                <div className="row my-3 ">
                                    <div className="col-md-3">
                                        <label className="col-form-label">Тушаалын дугаар</label>
                                    </div>
                                    <div className="col-md-9">
                                      <Field
                                          name="order_no"
                                          className='form-control'
                                          placeholder="Тушаалын дугаар"
                                      />
                                      <ErrorMessage name="order_no" component="span"/>
                                    </div>
                                </div>
                                <div className="row my-3 ">
                                    <div className="col-md-3">
                                        <label className="col-form-label">Тушаал гарсан огноо </label>
                                    </div>
                                    <div className="col-md-9">
                                      <Field
                                          name="order_at"
                                          className='form-control'
                                          placeholder="Тушаал гарсан огноо"
                                          type="date"
                                      />
                                      <ErrorMessage name="order_at" component="span"/>
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
                            )}
                        />
                        </Form>
                    )}}
                </Formik>
            </div>
        )
    }
}
