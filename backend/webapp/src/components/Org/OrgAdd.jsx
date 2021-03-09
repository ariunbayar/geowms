import React, { Component, Fragment } from "react"
import {NavLink} from "react-router-dom"
import {service} from "./service"
import ModalAlert from "../ModalAlert"
import {Formik, Field, Form, ErrorMessage} from 'formik'
import {validationSchema} from './validationSchema'
import Loader from "@utils/Loader"
import BackButton from "@utils/Button/BackButton"


export class OrgAdd extends Component {

    constructor(props) {
        super(props)

        this.state = {
            modal_alert_status: "closed",
            timer: null,
            roles: [],
            secondOrders: [],
            secondOrder_value: -1,
            thirthOrders: [],
            thirthOrder_value: -1,
            fourthOrders: [],
            fourthOrder_value: -1,
            geo_id: null,
            firstOrder_geom: '',
            disabled: true,
            is_loading: true,

            form_values: {
                org_level: 1,
                org_name: '',
                org_role: '-1',
            }
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleGetAll = this.handleGetAll.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.formOptions = this.formOptions.bind(this)
        this.handle2ndOrderChange = this.handle2ndOrderChange.bind(this)
        this.handle3rdOrderChange = this.handle3rdOrderChange.bind(this)
        this.handle4thOrderChange = this.handle4thOrderChange.bind(this)
    }

    componentDidMount() {
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        this.handleGetAll(org_level, org_id)
    }

    handleGetAll(org_level, org_id){
        if (org_id) {
            service.orgAll(org_level, org_id).then(({ orgs }) => {
                if (orgs) {
                    orgs.map(org => this.setState({
                        form_values: {
                            org_level: org_level,
                            org_name: org.name,
                            org_role: org.org_role,
                        },
                        geo_id: org.geo_id,
                    }))
                    this.formOptions()
                }
            })
        }
        else {
            this.formOptions()
        }
    }

    formOptions() {
        service.formOptions().then(({success, secondOrders, roles, firstOrder_geom}) => {
            if (success) {
                this.setState({secondOrders, roles, firstOrder_geom, is_loading: false})
                const geo_id = this.state.geo_id
                if (geo_id) {
                    var find_text = ''
                    for (var i = 0; i < geo_id.length; i++){
                        find_text += geo_id[i]
                        if (i === 4) {
                            secondOrders.map((value) => {
                                if (value['geo_id'] === find_text) {
                                    this.handle2ndOrderChange(value['geo_id'])
                                }
                            })
                        }
                        if (i === 6) {
                            this.state.thirthOrders.map((value) => {
                                if (value['geo_id'] === find_text) {
                                    this.handle3rdOrderChange(value['geo_id'])
                                }
                            })
                        }
                        if (i === 8) {
                            this.state.fourthOrders.map((value) => {
                                if (value['geo_id'] === find_text) {
                                    this.handle4thOrderChange(value['geo_id'])
                                }
                            })
                        }
                    }
                } else {
                    this.setState({geo_id: firstOrder_geom})
                }
                this.setState({disabled: false})
            }
        })
    }

    handle2ndOrderChange(value) {
        const { firstOrder_geom, secondOrders } = this.state
        if (value !== '-1') {
            secondOrders.map((province) => {
                if (province['geo_id'] === value){
                    this.setState({
                        thirthOrders: province['children'],
                        geo_id: province['geo_id'],
                    })
                }
            })
        } else {
            this.setState({
                thirthOrders: [],
                thirthOrder_value: '-1',
                geo_id: firstOrder_geom,
            })
        }
        this.setState({
            secondOrder_value: value,
            thirthOrder_value: '-1',
            fourthOrders: [],
            fourthOrder_value: '-1',
        })
    }

    handle3rdOrderChange(value) {
        const { thirthOrders } = this.state
        if (value === '-1') {
            this.setState({ fourthOrders: [], fourthOrder_value: '-1'})
            this.handle2ndOrderChange(this.state.secondOrder_value)
        } else {
            thirthOrders.map((thirthOrder) => {
                if (thirthOrder['geo_id'] === value){
                    this.setState({
                        fourthOrders: thirthOrder['children'],
                        geo_id: thirthOrder['geo_id']
                    })
                }
            })
        }
        this.setState({ thirthOrder_value: value, fourthOrder_value: '-1'})
    }

    handle4thOrderChange(value) {
        if (value !== '-1') {
            this.state.fourthOrders.map((team) => {
                if (team['geo_id'] === value){
                    this.setState({geo_id: team['geo_id']})
                }
            })
        } else {
            this.handle3rdOrderChange(this.state.thirthOrder_value)
        }
        this.setState({fourthOrder_value: value})
    }

    handleSubmit(values, { setStatus, setSubmitting, setErrors }){

        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        const {geo_id} = this.state
        const datas = {
            org_name: values.org_name,
            id: org_id,
            org_level: values.org_level,
            role_id: values.org_role,
            geo_id: geo_id,
        }
        service.org_add(org_level, datas).then(({success, errors}) => {
            if (success) {
                this.setState({modal_alert_status: "open"})
                this.props.refreshCount()
                setStatus('saved')
                setSubmitting(false)
                this.modalCloseTime()
            } else {
                setErrors(errors)
                setSubmitting(false)
            }
        })
    }

    modalClose(){
        const org_level = this.props.match.params.level
        this.props.history.push( `/back/байгууллага/түвшин/${org_level}/`)
    }

    modalCloseTime(){
        const org_level = this.props.match.params.level
        this.state.timer = setTimeout(() => {
            this.props.history.push( `/back/байгууллага/түвшин/${org_level}/`)
        }, 2000)
    }

    render() {

        const {form_values, roles, disabled} = this.state

        const org_id = this.props.match.params.id
        const org_level = this.props.match.params.level

        return (
            <div>
                <Formik
                    enableReinitialize
                    initialValues={form_values}
                    validationSchema={validationSchema}
                    onSubmit={this.handleSubmit}
                >
                {({
                    errors,
                    isSubmitting,
                }) => {
                    const has_error = Object.keys(errors).length > 0
                    return (
                        <div>
                            <Form className="col-4">
                                <Loader is_loading={this.state.is_loading}/>
                                <div className="form-row">
                                    <div className="form-group col">
                                        <div className="position-relative has-icon-right">
                                            <label htmlFor="org_name">Байгууллагын нэр</label>
                                            <div className='row'>
                                                <Field
                                                    className={'form-control ' + (errors.org_name ? 'is-invalid' : '')}
                                                    name='org_name'
                                                    id="id_org_name"
                                                    type="text"
                                                    placeholder="Байгууллагын нэр"
                                                />
                                                <ErrorMessage name="org_name" component="div" className="invalid-feedback"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {org_id &&
                                    <div className="form-row">
                                        <div className="form-group col">
                                            <label htmlFor="org_level">Түвшин</label>
                                            <div className='row'>
                                                <Fragment>
                                                    <Field name="org_level" as="select" className="form-control"
                                                    className={'form-control ' + (errors.org_level ? 'is-invalid' : '')}>
                                                        <option>1</option>
                                                        <option>2</option>
                                                        <option>3</option>
                                                        <option>4</option>
                                                    </Field>
                                                    <ErrorMessage name="org_level" component="div" className="invalid-feedback"/>
                                                </Fragment>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div className="form-row">
                                    <div className="form-group col">
                                        <label htmlFor="org_role">Байгууллагын эрх</label>
                                        <div className='row'>
                                            <Fragment>
                                                <Field name="org_role" as="select" className="form-control"
                                                className={'form-control ' + (errors.org_role ? 'is-invalid' : '' )}>
                                                    <option value="-1">....</option>
                                                    {roles.map((role, idx) =>
                                                        <option key={idx} value={role.id}>{role.name}</option>
                                                    )}
                                                </Field>
                                                <ErrorMessage name="org_role" component="div" className="invalid-feedback"/>
                                            </Fragment>
                                        </div>
                                    </div>
                                </div>
                                <h5 className="mb-3">Байгууллагын хамрах хүрээ</h5>
                                <table className="table col">
                                    <tbody>
                                        <tr>
                                            <th className='pt-3'>Аймаг/ Хот</th>
                                            <td>
                                                <div className='row'>
                                                    <select className='form-control' value={this.state.secondOrder_value} onChange={(e) => this.handle2ndOrderChange(e.target.value)}>
                                                        <option value='-1'>--- Улсын хэмжээнд ---</option>
                                                        {this.state.secondOrders.map((data, idx) =>
                                                            <option key={idx} value={data['geo_id']} >{data['name']}</option>
                                                        )}
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className='pt-3'>Сум/ Дүүрэг</th>
                                            <td>
                                                <div className='row'>
                                                    <select className='form-control' value={this.state.thirthOrder_value} onChange={(e) => this.handle3rdOrderChange(e.target.value)}>
                                                        <option value="-1">--- Сум/Дүүрэг сонгоно уу ---</option>
                                                        {this.state.thirthOrders.map((data, idx) =>
                                                            <option key={idx} value={data['geo_id']}>{data['name']}</option>
                                                        )}
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className='pt-3'>Баг/ Хороо</th>
                                            <td>
                                                <div className='row'>
                                                    <select className='form-control' value={this.state.fourthOrder_value} onChange={(e) => this.handle4thOrderChange(e.target.value)}>
                                                        <option value="-1">--- Баг/Хороо сонгоно уу ---</option>
                                                        {this.state.fourthOrders.map((data, idx) =>
                                                            <option key={idx} value={data['geo_id']}>{data['name']}</option>
                                                        )}
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="form-group">
                                    <button type="submit" className="btn gp-btn-primary" disabled={isSubmitting}>
                                        {isSubmitting && <i className="fa fa-spinner fa-spin"></i>}
                                        {isSubmitting && <a className="text-light">Шалгаж байна.</a>}
                                        {!isSubmitting && 'Хадгалах' }
                                    </button>
                                </div>
                            </Form>
                        </div>
                    )}}
                </Formik>
                <ModalAlert
                    modalAction={() => this.modalClose()}
                    status={this.state.modal_alert_status}
                    title="Амжилттай хадгаллаа"
                    model_type_icon = "success"
                />
                <BackButton {...this.props} name={'Буцах'} navlink_url={`/back/байгууллага/түвшин/${org_level}/`}></BackButton>
            </div>
        )
    }

}
