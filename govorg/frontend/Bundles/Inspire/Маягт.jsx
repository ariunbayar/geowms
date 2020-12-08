import React, { Component, Fragment } from "react"
import { Formik, Form, Field, ErrorMessage, validateYupSchema , FieldArray} from 'formik'
import { service } from "./service"
import { validationSchema } from './validationSchema'
import { validations } from './validations'

export default class Маягт extends Component {

    constructor(props) {
        super(props)

        this.state = {
            is_loading: true,
            tid: props.tid,
            pid: props.pid,
            fid: props.fid,
            values: {},
            geojson: {},
            order_at: '',
            order_no: '',
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.validationSchema = validationSchema.bind(this)
        this.addNotif = this.props.addNotif
    }

    onSubmit(values, { setStatus, setSubmitting }) {
        const { gid, null_form_isload, modifyend_selected_feature_check, remove_button_active, update_geom_from_list } = this.props
        if(this.props.roles[6]){
            if(!this.props.cancel_button_active) {
                if(null_form_isload) {
                    service.create(this.state.tid, this.state.pid, this.state.fid, values, this.state.geojson).then(({ success }) => {
                        if (success) {
                            this.setState({is_loading: true})
                            this.props.requestRefreshCount()
                            this.addNotif('success', 'Property хадгалалаа', 'check')
                        }
                    })
                }
                else if (modifyend_selected_feature_check || update_geom_from_list) {
                    this.props.SaveBtn(values)
                }
                else if (remove_button_active) {
                    this.props.requestRemove(values)
                }
                else {
                    service.createUpd(this.state.tid, this.state.pid, this.state.fid, values, null, gid).then(({ success }) => {
                        if (success) {
                            this.setState({is_loading: true})
                            this.props.requestRefreshCount()
                            this.addNotif('success', 'Property хадгалалаа', 'check')
                        }
                    })
                }
            }
        }
        else{
            if(!this.props.cancel_button_active) {
                if(null_form_isload) {
                    service.save(this.state.fid, values).then(({ success }) => {
                        if (success) {
                            this.setState({is_loading: true})
                            this.handleUpdate(gid)
                        }
                    })
                }
                else {
                    service.update(values, this.state.pid, this.state.fid).then(({ success }) => {
                        if (success) {
                            this.setState({is_loading: true})
                            this.handleUpdate(gid)
                        }
                    })
                }
            }
        }
        if (this.props.cancel_button_active) {
            if (this.props.roles[6]) {
                this.props.requestCancel(values.order_at, values.order_no, values.form_values)
            }
            else {
                this.props.cancel(values.order_at, values.order_no, values.form_values)
            }
        }
    }

    handleUpdate(gid){
        const fid = this.state.fid
        service.detail(gid, fid).then(({success, datas}) => {
            if(success){
                this.setState({
                    values:datas,
                    is_loading: false
                })
            }
        })
    }

    handleCreate(){

        service.detailNone(this.state.tid, this.state.pid, this.state.fid).then(({success, datas}) => {
            if(success){
                this.setState({
                    values:datas,
                    is_loading: false
                })
            }
        })
    }

    componentDidUpdate(pP){
        if(pP.togle_islaod !== this.props.togle_islaod)
        {
            const {gid, tid, pid, fid, geojson} = this.props

            this.setState({geojson, tid, pid, fid})
            if(!this.props.togle_islaod)
            {
                if(this.props.null_form_isload){
                    if(this.props.roles[6]) this.props.SaveBtn()
                    this.handleCreate()
                    this.setState({is_loading:true})
                }
                else{
                    this.handleUpdate(gid)
                    this.setState({is_loading:true})
                }
            }
        }
        if(pP.gid !== this.props.gid)
        {
            const gid = this.props.gid
            if(!this.props.togle_islaod)
            {
                if(this.props.null_form_isload){
                    if(this.props.roles[6]) this.props.SaveBtn()
                    this.handleCreate()
                    this.setState({is_loading:true})
                }
                else{
                    this.handleUpdate(gid)
                    this.setState({is_loading:true})
                }
            }
        }
        if(pP.null_form_isload !== this.props.null_form_isload)
        {
            this.props.SaveBtn()
            this.handleCreate()
            this.setState({is_loading:true})
        }
    }

    componentDidMount() {
        const gid = this.props.gid
        if(gid){
            if(!this.props.togle_islaod)
            {
                if(this.props.null_form_isload){
                    this.setState({is_loading:true})
                }
                else{
                    this.handleUpdate(gid)
                    this.setState({is_loading:true})
                }
            }
        }
    }

    render() {
        const { values, id } = this.state
        if (this.state.is_loading || values.length == 0) {
            return (
                <p className="text-center"> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i> <br/> Түр хүлээнэ үү... </p>
            )
        }
        return (
            <div className='overflow-auto card-body'>
                {this.props.gid ? <h4 className="text-center">Geom дугаар-{this.props.gid}</h4> : <h4 className="text-center">Шинэ цэг</h4>}
                <hr></hr>
                <Formik
                    enableReinitialize
                    initialValues={{
                        form_values: values,
                        order_at: this.state.order_at,
                        order_no: this.state.order_no,
                    }}
                    validationSchema={validations}
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
                                      <ErrorMessage className="text-danger" name="order_no" component="span"/>
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
                                      <ErrorMessage className="text-danger" name="order_at" component="span"/>
                                    </div>
                                </div>
                                <div>
                                    {this.props.roles[6] ?
                                    <button type="submit" className="btn btn-block gp-btn-primary">Хянуулах</button>:
                                    <button type="submit" className="btn btn-block gp-btn-primary">Хадгалах</button>
                                    }
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
