import React, { Component, Fragment } from "react"
import { NavLink } from "react-router-dom"

import { service } from "../service"
import ModalAlert from "../../ModalAlert"
import {Formik, Field, Form, ErrorMessage} from 'formik'
import {validationSchema} from './validationSchema'
import EmployeeMap from "./Employee_map/Map"

import Loader from "@utils/Loader"

export class UserAdd extends Component {

    constructor(props) {

        super(props)
        this.state = {
            form_values: {
                id: null,
                username: '',
                first_name: '',
                last_name: '',
                position: '',
                email: '',
                gender: 'Эрэгтэй',
                register:'',
                is_admin: false,
                is_super: false,
                re_password_mail: false,
                phone_number: '',
                state: '',
                pro_class: '',
            },
            aimag: [],
            sum: [],
            horoo: [],
            aimag_id: -1,
            sum_id: -1,
            horoo_id: -1,
            aimag_name: '',
            sum_name: '',
            horoo_name: '',
            aimag_geo_id: '',
            sum_geo_id: '',
            horoo_geo_id: '',
            feature: {},

            description: '',
            point_coordinate: [],
            point: {},
            street: '',
            apartment: '',
            door_number: '',
            address_state: true,

            modal_alert_status: "closed",
            is_loading: true,

            errors: '',

            firstOrder_geom: '',
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleGetAll = this.handleGetAll.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.getFeildValues = this.getFeildValues.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.getPoint = this.getPoint.bind(this)
        this.getGeomFromJson = this.getGeomFromJson.bind(this)
        this.getGeom = this.getGeom.bind(this)
    }

    componentDidMount() {
        const org_emp = this.props.match.params.emp
        if(org_emp){
            this.handleGetAll(org_emp)
        }
        else {
            this.getFeildValues()
        }
    }


    handleGetAll(org_emp){
        service
            .employeeDetail(org_emp)
            .then(({ success, employee }) => {
                if (success) {
                    if (org_emp) {
                        this.getFeildValues(employee.level_1, employee.level_2, employee.level_3)
                    }
                    this.setState({
                        form_values: {
                            id: employee.id,
                            username: employee.username,
                            first_name: employee.first_name,
                            last_name: employee.last_name,
                            email: employee.email,
                            gender: employee.gender,
                            register: employee.register,
                            position: employee.position_id,
                            is_admin: employee.is_admin,
                            is_super: employee.is_super,
                            phone_number: employee.phone_number,
                            state: employee.state_id,
                            pro_class: employee.pro_class_id,
                        },
                        point: employee.point,
                        street: employee.street,
                        apartment: employee.apartment,
                        door_number: employee.door_number,
                        address_state: employee.address_state,
                    })
                }
            })
    }

    handleSubmit(values, { setStatus, setSubmitting, setErrors }) {

        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        const org_emp = this.props.match.params.emp

        const { street, apartment, door_number, address_state, aimag_name, sum_name, horoo_name, point_coordinate } = this.state
        const address = {
            'street': street,
            'apartment': apartment,
            'door_number': door_number,
            'level_1': aimag_name,
            'level_2': sum_name,
            'level_3': horoo_name,
            'point': point_coordinate,
            'address_state': address_state,
        }

        const payload = {
            'values': values,
            'address': address,
        }

        if(org_emp){
            if(values.re_password !== values.password)
            {
                setErrors({'re_password': 'Нууц үг адил биш байна.'})
                setSubmitting(false)
            }
            else {
                service
                    .employeeUpdate(org_emp, org_level, payload)
                    .then(({ success, errors }) => {
                        if (success) {
                            this.setState({modal_alert_status: "open"})
                            setStatus('saved')
                            this.modalCloseTime()
                        } else {
                            setErrors(errors)
                            this.setState({errors})
                        }
                        setSubmitting(false)
                    })
                    .catch((error) => {
                        alert("Алдаа гарсан байна")
                        setSubmitting(false)
                    })
            }

        }
        else{
            service
                .employeeAdd(org_level, org_id, payload)
                .then(({ success, errors, employee }) => {
                    if (success) {
                        this.setState({modal_alert_status: "open"})
                        setStatus('saved')
                        this.modalCloseTime(employee.user_id)
                    }
                    else{
                        setErrors(errors)
                        this.setState({errors})
                    }
                    setSubmitting(false)
                })
                .catch((error) => {
                    alert("Алдаа гарсан байна")
                    setSubmitting(false)
                })
        }
    }

    modalCloseTime(user_id) {
        this.props.refreshCount()
        setTimeout(() => this.modalClose(user_id), 2000)
    }

    modalClose(user_id) {
        const { level, id, emp } = this.props.match.params
        this.props.history.push(
            `/back/байгууллага/түвшин/${level}/${id}/хэрэглэгч/${emp || user_id}/дэлгэрэнгүй/`
        )
    }

    getGeomFromJson(geom_name, array) {
        let index
        array.map((data, idx) => {
            if (data.name == geom_name) {
                index = idx
            }
        })
        return index
    }

    getFeildValues(level_1, level_2, level_3) {
        let obj = Object()
        let geo_id
        let array
        service
            .formOptions('second')
            .then(({ success, secondOrders, firstOrder_geom }) => {
                if (success) {
                    if (level_1) {
                        obj['aimag_id'] = this.getGeomFromJson(level_1, secondOrders)
                        geo_id = secondOrders[obj['aimag_id']].geo_id
                        obj['aimag_geo_id'] = geo_id
                        obj['aimag_name'] = level_1
                        array = secondOrders[obj['aimag_id']].children
                        obj['sum'] = array
                    }
                    if (level_2) {
                        obj['sum_id'] = this.getGeomFromJson(level_2, array)
                        geo_id = array[obj['sum_id']].geo_id
                        obj['sum_geo_id'] = geo_id
                        array = array[obj['sum_id']].children
                        obj['horoo'] = array
                        obj['sum_name'] = level_2
                    }
                    if (level_3) {
                        obj['horoo_id'] = this.getGeomFromJson(level_3, array)
                        geo_id = array[obj['horoo_id']].geo_id
                        obj['horoo_geo_id'] = geo_id
                        obj['horoo_name'] = level_3
                    }
                    this.getGeom(geo_id)
                    this.setState({ aimag: secondOrders, ...obj, is_loading: false, firstOrder_geom })
                }
            })
    }

    getGeom(geo_id) {
        service
            .getGeom(geo_id)
            .then(({ feature }) => {
                if (feature) {
                    this.setState({ feature })
                }
            })
    }

    getPoint(point_coordinate) {
        let coordinates = point_coordinate
        if (typeof point_coordinate == 'string') {
            coordinates = point_coordinate.split(',')
        }
        const coordinate = [coordinates[1], coordinates[0]]
        this.setState({ point_coordinate: coordinate })
    }

    handleChange(e, field, child_field, reset_fields, parent_field) {
        const field_id = field + '_id'
        const field_geo_id = field + '_geo_id'
        const field_name = field + '_name'
        const idx = e.target.value
        let obj = Object()
        let geo_id
        if (idx !== '-1') {
            const value = this.state[field][idx]
            this.setState({ [child_field]: value.children })
            if (child_field) {
                obj[child_field] = value.children
            }
            geo_id = value.geo_id
            reset_fields.map((r_field, idx) => {
                const r_field_id = r_field + '_id'
                const r_field_geo_id = r_field + '_geo_id'
                const r_field_name = r_field + '_name'
                obj[r_field_id] = -1
                obj[r_field_geo_id] = ''
                obj[r_field_name] = ''
            })
            obj[field_geo_id] = geo_id
            obj[field_name] = value.name
            this.getGeom(geo_id)
        }
        else {
            if (reset_fields.length > 0) {
                reset_fields.map((r_field, idx) => {
                    const r_field_id = r_field + '_id'
                    const r_field_geo_id = r_field + '_geo_id'
                    const r_field_name = r_field + '_name'
                    obj[r_field] = []
                    obj[r_field_id] = -1
                    obj[r_field_geo_id] = ''
                    obj[r_field_name] = ''
                })
            }
            if (parent_field !== 'mongol') {
                const parent_field_id = parent_field + '_id'
                const parent_idx = this.state[parent_field_id]
                const parent_obj = this.state[parent_field][parent_idx]
                geo_id = parent_obj.geo_id
            }
            else {
                geo_id = this.state.firstOrder_geom
            }
            obj[field_geo_id] = geo_id
            this.getGeom(geo_id)
        }
        this.setState({ [field_id]: idx, ...obj })
    }

    render() {
        const { form_values, aimag, sum, horoo, aimag_id, sum_id, horoo_id, is_loading,
            feature, street, apartment, door_number, point, errors, address_state
        } = this.state

        const { positions, states, pro_classes } = this.props

        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        const org_emp = this.props.match.params.emp

        const url_list = `/back/байгууллага/түвшин/${org_level}/${org_id}/хэрэглэгч/`
        const url_detail = `/back/байгууллага/түвшин/${org_level}/${org_id}/хэрэглэгч/${org_emp}/дэлгэрэнгүй/`

        return (
            <div className="ml-3">
                <Loader is_loading={is_loading}/>
                <div className="row">
                    <div className="col-md-4">
                        <Formik
                            enableReinitialize
                            initialValues={form_values}
                            validationSchema={validationSchema}
                            onSubmit={this.handleSubmit}
                        >
                        {({
                            errors,
                            values,
                            isSubmitting,
                        }) => {
                            return (
                                <Form>
                                    <div>
                                        <div className="form-row">
                                            <div className="form-group col-12">
                                                <div className="position-relative has-icon-right">
                                                    <label htmlFor="id_name" >Нэвтрэх нэр:</label>
                                                    <Field
                                                        className={'form-control ' + (errors.username ? 'is-invalid' : '')}
                                                        name='username'
                                                        id="id_username"
                                                        type="text"
                                                        placeholder="Нэвтрэх нэр"
                                                    />
                                                    <ErrorMessage name="username" component="div" className="invalid-feedback"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-6">
                                                <label htmlFor="first_name">Овог:</label>
                                                <Field
                                                    className={'form-control ' + (errors.last_name ? 'is-invalid' : '')}
                                                    name='last_name'
                                                    id="id_last_name"
                                                    type="text"
                                                    placeholder="Овог"
                                                />
                                                <ErrorMessage name="last_name" component="div" className="invalid-feedback"/>
                                            </div>
                                            <div className="form-group col-6">
                                                <label htmlFor="first_name">Нэр:</label>
                                                <Field
                                                    className={'form-control ' + (errors.first_name ? 'is-invalid' : '')}
                                                    name='first_name'
                                                    id="id_first_name"
                                                    type="text"
                                                    placeholder="Нэр"
                                                />
                                                <ErrorMessage name="first_name" component="div" className="invalid-feedback"/>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-12">
                                                <label htmlFor="position">Албан тушаал:</label>
                                                <Field name="position" as="select" id="position"
                                                    style={{ fontSize: '0.8rem' }}
                                                    className={'custom-select ' + (errors.position ? 'is-invalid' : '')}
                                                >
                                                    <option value="">--- Албан тушаал сонгоно уу ---</option>
                                                    {
                                                        positions.map((item, idx) =>
                                                            <option key={idx} value={item.id}>{item.name}</option>
                                                        )
                                                    }
                                                </Field>
                                                <ErrorMessage name="position" component="span" className="invalid-feedback"/>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-12">
                                                <label htmlFor="email">E-Mail</label>
                                                <Field
                                                    className={'form-control ' + (errors.email ? 'is-invalid' : '')}
                                                    name='email'
                                                    id="id_email"
                                                    type="text"
                                                    placeholder="E-Mail"
                                                />
                                                <ErrorMessage name="email" component="div" className="invalid-feedback"/>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-12">
                                                <label htmlFor="gender">Хүйс:</label>
                                                <Fragment>
                                                    <Field name="gender" as="select"
                                                        className={'form-control ' + (errors.gender ? 'is-invalid' : '')}
                                                    >
                                                        <option>Эрэгтэй</option>
                                                        <option>Эмэгтэй</option>
                                                    </Field>
                                                    <ErrorMessage name="gender" component="div" className="text-dange"/>
                                                </Fragment>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-6">
                                                <label htmlFor="phone_number">Утасны дугаар:</label>
                                                <Field
                                                    className={'form-control ' + (errors.phone_number ? 'is-invalid' : '')}
                                                    name='phone_number'
                                                    id="id_phone_number"
                                                    type="text"
                                                    placeholder="Утасны дугаар"
                                                />
                                                <ErrorMessage name="phone_number" component="div" className="invalid-feedback"/>
                                            </div>
                                            <div className="form-group col-6">
                                                <label htmlFor="register">Регистер:</label>
                                                <Field
                                                    className={'form-control ' + (errors.register ? 'is-invalid' : '')}
                                                    name='register'
                                                    id="id_register"
                                                    type="text"
                                                    placeholder="Регистер"
                                                />
                                                <ErrorMessage name="register" component="div" className="invalid-feedback"/>
                                            </div>
                                        </div>
                                        <div className='form-row'>
                                            <div className="form-group col-12">
                                                <label htmlFor='id_state'>Төлөв:</label>
                                                <Field name="state" as="select" id="state"
                                                    style={{ fontSize: '0.8rem' }}
                                                    className={'custom-select ' + (errors.state ? 'is-invalid' : '')}
                                                >
                                                    <option value="">--- Ажилтаны төлөвийг сонгоно уу ---</option>
                                                    {
                                                        states.map((item, idx) =>
                                                            <option key={idx} value={item[0]}>{item[1]}</option>
                                                        )
                                                    }
                                                </Field>
                                                <ErrorMessage name="state" component="div" className="invalid-feedback"/>
                                            </div>
                                        </div>
                                        <div className='form-row'>
                                            <div className="form-group col-12">
                                                <label htmlFor='id_pro_class'>Мэргэжлийн ангийн бүрэлдэхүүн:</label>
                                                <Field name="pro_class" as="select" id="pro_class"
                                                    style={{ fontSize: '0.8rem' }}
                                                    className={'custom-select ' + (errors.pro_class ? 'is-invalid' : '')}
                                                >
                                                    <option value="">--- Мэргэжлийн ангийн бүрэлдэхүүн ---</option>
                                                    {
                                                        pro_classes.map((item, idx) =>
                                                            <option key={idx} value={item[0]}>{item[1]}</option>
                                                        )
                                                    }
                                                </Field>
                                                <ErrorMessage name="pro_class" component="div" className="invalid-feedback"/>
                                            </div>
                                        </div>
                                        {
                                            org_emp
                                            &&
                                                <div className="form-row">
                                                    <div className="form-group col-12">
                                                        <label htmlFor='id_re_password_mail'>Нууц үг солих e-mail илгээх</label>
                                                        <Field
                                                            className="ml-2"
                                                            name='re_password_mail'
                                                            id="id_re_password_mail"
                                                            type="checkbox"
                                                        />
                                                        <ErrorMessage name="re_password_mail" component="div" className="invalid-feedback"/>
                                                    </div>
                                                </div>
                                        }
                                        <div className='form-row'>
                                            <div className="form-group col-12">
                                                <label htmlFor='id_is_admin'>Байгууллагын админ</label>
                                                <Field
                                                    className="ml-2"
                                                    name='is_admin'
                                                    id="id_is_admin"
                                                    type="checkbox"
                                                />
                                                <ErrorMessage name="is_admin" component="div" className="invalid-feedback"/>
                                            </div>
                                        </div>
                                        {org_level ==4 &&
                                            <div className='form-row'>
                                                <div className="form-group col-12">
                                                    <label htmlFor='is_super'>Системийн админ</label>
                                                    <Field
                                                        className="ml-2"
                                                        name='is_super'
                                                        id="id_is_super"
                                                        type="checkbox"
                                                    />
                                                    <ErrorMessage name="is_super" component="div" className="invalid-feedback"/>
                                                </div>
                                            </div>
                                        }
                                        <div className="form-group">
                                            <button type="submit" className="btn gp-btn-primary" disabled={isSubmitting}>
                                                {isSubmitting && <i className="fa fa-spinner fa-spin"></i>}
                                                {isSubmitting && <a className="text-light">Шалгаж байна.</a>}
                                                {!isSubmitting && 'Хадгалах' }
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                                )}}
                        </Formik>
                    </div>
                    <div className="col-md-8">
                        <div className="form-row p-1">
                            <div className="form-group col-4">
                                <label htmlFor="aimag">Аймаг/Хот:</label>
                                <select
                                    id="aimag"
                                    className={'custom-select ' + (errors.level_1 ? 'is-invalid' : '')}
                                    aria-label="Default select example"
                                    onChange={(e) => this.handleChange(e, 'aimag', 'sum', ['sum', 'horoo'], 'mongol')}
                                    value={aimag_id}
                                >
                                    <option value='-1'>--- Аймаг/Хот сонгох ---</option>
                                    {aimag.map((data, idx) =>
                                        <option key={idx} value={idx}>{data.name}</option>
                                    )}
                                </select>
                            </div>
                            <div className="form-group col-4">
                                <label htmlFor="sum">Сум/Дүүрэг:</label>
                                <select
                                    id="sum"
                                    className={'custom-select ' + (errors.level_2 ? 'is-invalid' : '')}
                                    onChange={(e) => this.handleChange(e, 'sum', 'horoo', ['horoo'], 'aimag')}
                                    value={sum_id}
                                >
                                    <option value='-1'>--- Сум/Дүүрэг сонгох ---</option>
                                    {sum.map((data, idx) =>
                                        <option key={idx} value={idx}>{data.name}</option>
                                    )}
                                </select>
                            </div>
                            <div className="form-group col-4">
                                <label htmlFor="horoo">Хороо/Баг:</label>
                                <select
                                    id="horoo"
                                    className={'custom-select ' + (errors.level_3 ? 'is-invalid' : '')}
                                    onChange={(e) => this.handleChange(e, 'horoo', undefined, [], 'sum')}
                                    value={horoo_id}
                                >
                                    <option value='-1'>--- Баг/Хороо сонгох ---</option>
                                    {horoo.map((data, idx) =>
                                        <option key={idx} value={idx}>{data.name}</option>
                                    )}
                                </select>
                            </div>
                            <div className="form-group col-4">
                                <label htmlFor="street">Гудамж:</label>
                                <div className="input-group">
                                    <input
                                        id="street"
                                        className={'form-control ' + (errors.street ? 'is-invalid' : '')}
                                        onChange={(e) => this.setState({ street: e.target.value })}
                                        value={street}
                                        placeholder="Гудамжны нэрийг оруулах"
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text">гудамж</span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-2">
                                <label htmlFor="apartment">Байр:</label>
                                <div className="input-group">
                                    <input
                                        id="apartment"
                                        className={'form-control ' + (errors.apartment ? 'is-invalid' : '')}
                                        onChange={(e) => this.setState({ apartment: e.target.value })}
                                        value={apartment}
                                        placeholder="Байрны дугаарыг оруулах"
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text">байр</span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-2">
                                <label htmlFor="door_number">Хаалганы дугаар:</label>
                                <div className="input-group">
                                    <input
                                        id="door_number"
                                        className={'form-control ' + (errors.door_number ? 'is-invalid' : '')}
                                        onChange={(e) => this.setState({ door_number: e.target.value })}
                                        value={door_number}
                                        placeholder="Хаалганы дугаарыг оруулах"
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text">тоот</span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group mt-4">
                                <div className="form-check">
                                    <label className="form-check-label" htmlFor="id_address_state">
                                        Байнгын оршин суугаа хаяг
                                    </label>
                                    <input
                                        onChange={(e) => this.setState({ address_state: e.target.checked })}
                                        className={'form-check-input col-4 ' + (errors.address_state ? 'is-invalid' : '')}
                                        type="checkbox"
                                        id="id_address_state"
                                        checked={address_state}
                                    />
                                </div>
                            </div>
                        </div>
                        <EmployeeMap
                            feature={feature}
                            sendPointCoordinate={this.getPoint}
                            point={point}
                            class={(errors.point ? 'border border-danger' : '')}
                        />
                    </div>
                </div>
                <ModalAlert
                    modalAction={() => this.modalClose()}
                    status={this.state.modal_alert_status}
                    title="Амжилттай хадгаллаа"
                    model_type_icon="success"
                />
            </div>
        )
    }
}
