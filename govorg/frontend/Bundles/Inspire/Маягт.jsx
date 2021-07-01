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
            form_values: {},
            order_at: '',
            order_no: '',
            data_types: [],
            code_list_ids: {},
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.setInitialValue = this.setInitial.bind(this)
        this.makeInitial = this.makeInitial.bind(this)
        this.validationSchema = validationSchema.bind(this)
    }

    onSubmit(values, { setStatus, setSubmitting }) {
        const { gid, null_form_isload, modifyend_selected_feature_check, remove_button_active, update_geom_from_list, cancel_button_active } = this.props
            if(null_form_isload){
                if (this.props.geojson != {}) {
                    this.setState({ is_loading: true })
                    service.create(this.state.tid, this.state.pid, this.state.fid, values, this.props.geojson).then(({ success, info }) => {
                        if (success) {
                            this.setState({ is_loading: false })
                            global.refreshCount()
                            global.NOTIF('success', info, 'check')
                        }
                        else {
                            global.NOTIF('danger', info, 'warning')
                        }
                    })
                }
                else {
                    global.NOTIF('danger', 'Зурагдсан геом өгөгдөл байхгүй байна', 'warning')
                }
            }
            else if (modifyend_selected_feature_check || update_geom_from_list) {
                this.props.SaveBtn(values)
            }
            else if (remove_button_active) {
                this.props.requestRemove(values)
            }
            else if (cancel_button_active) {
                this.props.requestCancel(values.order_at, values.order_no, values.form_values)
            }
            else {
                this.setState({ is_loading: true })
                service.createUpd(this.state.tid, this.state.pid, this.state.fid, values, null, gid).then(({ success, info}) => {
                    if (success) {
                        this.setState({ is_loading: false })
                        global.refreshCount()
                        global.NOTIF('success', info, 'check')
                    }
                })
            }
    }

    handleUpdate(gid){
        const fid = this.state.fid
        const tid = this.state.tid
        service.detail(gid, tid, fid).then(({success, datas, data_types}) => {
            if(success){
                this.setState({
                    form_values:datas,
                    data_types,
                    is_loading: false
                })
                this.makeInitial(datas)
            }
        })
    }

    handleCreate(){
        service.detailCreate(this.state.tid, this.state.pid, this.state.fid).then(({success, datas, data_types}) => {
            if(success){
                this.setState({
                    form_values:datas,
                    is_loading: false,
                    data_types
                })
            }
        })
    }

    componentDidUpdate(pP){
        if(pP.togle_islaod !== this.props.togle_islaod)
        {
            const {gid, tid, pid, fid} = this.props
            this.setState({ tid, pid, fid })
            if(!this.props.togle_islaod)
            {
                if(this.props.null_form_isload){
                    this.props.SaveBtn()
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
                    this.props.SaveBtn()
                    this.handleCreate()
                    this.setState({is_loading:true})
                }
                else{
                    this.handleUpdate(gid)
                    this.setState({is_loading:true})
                }
            }
        }
    }

    componentDidMount() {
        const gid = this.props.gid
        if(gid){
            if(!this.props.togle_islaod)
            {
                if(this.props.null_form_isload){
                    this.setState({ is_loading: true })
                }
                else{
                    this.setState({ is_loading: true })
                    this.handleUpdate(gid)
                }
            }
        }
    }

    setDisable(roles){
        const { modifyend_selected_feature_check, update_geom_from_list, null_form_isload, cancel_button_active, remove_button_active } = this.props
        var return_data = false
        if(null_form_isload){
            return_data = roles['PERM_CREATE']
        }
        if(remove_button_active){
            return_data = roles['PERM_REMOVE']
        }
        if(cancel_button_active){
            return_data = roles['PERM_REVOKE']
        }
        if(!null_form_isload && !remove_button_active && !cancel_button_active){
            return_data = roles['PERM_UPDATE']
        }
        return return_data
    }

    makeInitial(datas) {
        var initial_code_list_ids = {}
        datas.map((row, idx) => {
            initial_code_list_ids[row.property_code] = row.data

        })
        this.setState({code_list_ids: initial_code_list_ids})
    }

    setInitial(name, value) {
        var changed_code_list_ids = this.state.code_list_ids
        var form_values = this.state.form_values
        changed_code_list_ids[name] = value
        form_values.map((row, idx) => {
            if (row.property_code == name) {
                row.data = value
            }
        })
        this.setState({
            code_list_ids: changed_code_list_ids,
            form_values
        })
    }

    render() {
        const { form_values, id, data_types, code_list_ids } = this.state
        const { modifyend_selected_feature_check, update_geom_from_list, null_form_isload, cancel_button_active, remove_button_active } = this.props
        if (this.state.is_loading) {
            return (
                <p className="text-center"> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i> <br/> Түр хүлээнэ үү... </p>
            )
        }

        return (
            <div className='overflow-auto card-body'>
                {this.props.gid ? <h4 className="text-center">Geom дугаар-{this.props.gid}</h4> : <h4 className="text-center">Маягт</h4>}
                <hr></hr>
                <Formik
                    enableReinitialize
                    initialValues={{
                        form_values: form_values,
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
                                {
                                    data_types.map((data_type, idx) =>
                                        <Fragment key={idx}>
                                            <h5 className="text-center border-bottom">{data_type['data_type_name']}</h5>
                                            {
                                                form_values.map((friend, index) => (
                                                    data_type['property_ids'].includes(friend.property_id) &&
                                                        data_type['data_type_id'] == friend.data_type_id &&
                                                        <div key={idx.toString() + index.toString()} className="row my-3 ">
                                                            <div className="col-md-3">
                                                                <label className="col-form-label">{friend.property_name ? friend.property_name : ''}</label>
                                                            </div>
                                                            {
                                                                friend.value_type == 'option'
                                                                ?
                                                                    <div className="col-md-9">
                                                                        <Fragment>
                                                                            <Field name={`${friend.property_code}` || ""}
                                                                                as="select"
                                                                                className="form-control"
                                                                                disabled={this.setDisable(friend.roles)}
                                                                                value={code_list_ids[friend.property_code] ? code_list_ids[friend.property_code] : ''}
                                                                                onChange={(e) =>
                                                                                    this.setInitial(e.target.name, e.target.value)
                                                                                }
                                                                            >
                                                                                {friend.data_list &&
                                                                                    friend.data_list.map((data, idy) =>
                                                                                        <option key={idy} value={data.code_list_id ? data.code_list_id  : ''}>
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
                                                                        {friend.value_type_id == 'boolean'
                                                                        ?
                                                                            <Field
                                                                                name={`form_values.${index}.data` || ""}
                                                                                as="select"
                                                                                className='form-control'
                                                                                disabled={this.setDisable(friend.roles)}
                                                                            >
                                                                                <option value="true">True</option>
                                                                                <option value="false">False</option>
                                                                            </Field>
                                                                        :
                                                                            <Field
                                                                                name={`form_values.${index}.data` || ""}
                                                                                className='form-control'
                                                                                disabled={this.setDisable(friend.roles)}
                                                                                placeholder={friend.property_name}
                                                                                type={friend.value_type}
                                                                            />
                                                                            }
                                                                            <small>{friend.property_definition ? friend.property_definition : ''}</small>
                                                                        </div>
                                                            }
                                                        </div>
                                                    ))
                                            }
                                        </Fragment>
                                    )
                                }
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
                                    <button type="submit" className="btn btn-block gp-btn-primary">Хянуулах</button>
                                </div>
                            </div>)
                            }
                        />
                        </Form>
                    )}}
                </Formik>
            </div>
        )
    }
}
