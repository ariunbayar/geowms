import React, { Component, Fragment } from "react"
import { NavLink } from "react-router-dom"
import {Formik, Field, Form, ErrorMessage} from 'formik'

import { service } from './service'
import ModalAlert from "@utils/Modal/ModalAlert"
import InsPerms from '../Role/GovPerms'
import {validationSchema} from '../../../../backend/webapp/src/components/Org/OrgUser/validationSchema'
import EmployeeMap from "./Employee_map/Map"
import BackButton from "@utils/Button/BackButton"


export class EmployeeAdd extends Component {

    constructor(props) {
        super(props)

        this.perms=[]
        this.role=[]
        this.remove_perms=[]
        this.state = {
            form_values: {
                username: '',
                last_name: '',
                first_name: '',
                position: '',
                email: '',
                gender: 'Эрэгтэй',
                register: '',
                phone_number: '',
                is_admin: false,
                choose_role: '',
            },
            role_list: [],
            emp_role_id: null,
            roles: {},
            modal_alert_status: "closed",
            model_type_icon: '',
            title: '',
            prefix: '/gov/perm/employee/',
            is_inspire_role: false,
            is_inspire_role_null: true,

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
            map_coordinate: [],
            is_marker: true,

            is_address_map: true,
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.getRolesForOption = this.getRolesForOption.bind(this)
        this.getRole = this.getRole.bind(this)
        this.getValue = this.getValue.bind(this)

        this.getFeildValues = this.getFeildValues.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.getPoint = this.getPoint.bind(this)
        this.getGeomFromJson = this.getGeomFromJson.bind(this)
        this.getGeom = this.getGeom.bind(this)
    }

    componentDidMount() {
        this.getRolesForOption()
        this.getFeildValues()
    }

    getRolesForOption() {
        service
            .getRoleList()
            .then(({ success, roles }) => {
                if (success) {
                    this.setState({ role_list: roles })
                }
            })
    }

    getRole(emp_role_id) {
        this.setState({emp_role_id, is_inspire_role: false, is_inspire_role_null: false })
        if(emp_role_id)
        {
            service
                .getRole(emp_role_id)
                .then(({ success, role_name, role_id, role_description, roles }) => {
                    if (success) {
                        this.setState({ roles, is_inspire_role: true })
                    }
                })
        }
        else
        {
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.setState({roles: {}, is_inspire_role_null: true})
                }, 300);
            })
        }
    }

    getValue(checked, perm_kind, property_id, feature_id, perm_inspire_id, type, is_true_type, is_role_emp_id) {
        if(!checked && this.perms.length > 0) {
            this.perms.map((perm, idx) => {
                if(perm.feature_id == feature_id &&
                    perm.property_id == property_id &&
                    perm.perm_kind == perm_kind)
                {
                    this.perms.splice(idx, 1)
                }
            })
        }
        if(checked) {
            const role = {
                'feature_id': feature_id,
                'property_id': property_id,
                'perm_kind': perm_kind,
                'gov_perm_ins_id': perm_inspire_id,
                'emp_role_ins_id': is_role_emp_id ? is_role_emp_id : null,
            }
            this.perms.push(role)
        }
    }

    handleSubmit(user_detail, { setStatus, setSubmitting, setErrors }){
        const { emp_role_id } = this.state

        const { street, apartment, door_number, aimag_name, sum_name, horoo_name, point_coordinate } = this.state
        const address = {
            'street': street,
            'apartment': apartment,
            'door_number': door_number,
            'level_1': aimag_name,
            'level_2': sum_name,
            'level_3': horoo_name,
            'point_coordinate': point_coordinate,
        }

        service
            .createEmployee(user_detail, emp_role_id, this.perms, address)
            .then(({ success, errors, info }) => {
                if(success) {
                    setStatus('saved')
                    this.setState({
                        model_type_icon: 'success',
                        modal_alert_status: 'open',
                        title: info
                    })
                } else {
                    if (errors) {
                        setErrors(errors)
                    }
                }
                setSubmitting(false)
            })
            .catch(error => {
                alert("Алдаа гарсан байна")
                setSubmitting(false)
            })
    }

    modalClose() {
        this.props.history.push(this.state.prefix)
    }

    getFeildValues(level_1, level_2, level_3) {
        let obj = Object()
        let geo_id
        let array
        service
            .formOptions()
            .then(({ success, info }) => {
                if (success) {
                    if (level_1) {
                        obj['aimag_id'] = this.getGeomFromJson(level_1, info)
                        geo_id = info[obj['aimag_id']].geo_id
                        obj['aimag_geo_id'] = geo_id
                        obj['aimag_name'] = level_1
                        array = info[obj['aimag_id']].children
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
                    this.setState({ aimag: info, ...obj })
                }
            })
    }

    getGeom(geo_id) {
        service
            .getGeom(geo_id)
            .then(({ feature }) => {
                if (feature) {
                    this.setState({ feature, last_geo_id: geo_id })
                }
            })
    }

    getPoint(point_coordinate, map_coordinate) {

        let coordinates = point_coordinate
        if (typeof point_coordinate == 'string') {
            coordinates = point_coordinate.split(',')
        }
        const coordinate = [coordinates[1], coordinates[0]]
        this.setState({ point_coordinate: coordinate, map_coordinate })
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
                geo_id = 'au_496'
            }
            obj[field_geo_id] = geo_id
            this.getGeom(geo_id)
        }
        this.setState({ [field_id]: idx, ...obj })
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

    render() {
        const { form_values, roles, role_list, emp_role_id, prefix, is_inspire_role, is_inspire_role_null } = this.state
        const { aimag, sum, horoo, aimag_id, sum_id, horoo_id, feature, street, apartment, door_number, point, is_address_map } = this.state
        const { org_roles } = this.props
        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <Formik
                            enableReinitialize
                            initialValues = {form_values}
                            validationSchema={validationSchema}
                            onSubmit={this.handleSubmit}
                        >
                        {({
                            errors,
                            isSubmitting,
                        }) => {
                            const has_error = Object.keys(errors).length > 0
                            return (
                                <Form className="col-12">
                                    <div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <div className="position-relative has-icon-right">
                                                    <label htmlFor="username" >Нэвтрэх нэр:</label>
                                                    <Field
                                                        className={'form-control ' + (errors.username ? 'is-invalid' : '')}
                                                        name='username'
                                                        id="id_username"
                                                        type="text"
                                                        placeholder="Нэвтрэх нэр"
                                                    />
                                                    <ErrorMessage name="username" component="div" className="text-danger"/>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <div className="position-relative has-icon-right">
                                                    <label htmlFor="first_name">Овог:</label>
                                                    <Field
                                                        className={'form-control ' + (errors.first_name ? 'is-invalid' : '')}
                                                        name='first_name'
                                                        id="id_first_name"
                                                        type="text"
                                                        placeholder="Овог"
                                                    />
                                                    <ErrorMessage name="first_name" component="div" className="text-danger"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <div className="position-relative has-icon-right">
                                                    <label htmlFor="last_name">Нэр:</label>
                                                    <Field
                                                        className={'form-control ' + (errors.last_name ? 'is-invalid' : '')}
                                                        name='last_name'
                                                        id="id_last_name"
                                                        type="text"
                                                        placeholder="Нэр"
                                                    />
                                                    <ErrorMessage name="last_name" component="div" className="text-danger"/>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="position">Албан тушаал:</label>
                                                <Field
                                                    className={'form-control ' + (errors.position ? 'is-invalid' : '')}
                                                    name='position'
                                                    id="id_position"
                                                    type="text"
                                                    placeholder="Албан тушаал"
                                                />
                                                <ErrorMessage name="position" component="div" className="text-danger"/>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="email">Цахим хаяг</label>
                                                <Field
                                                    className={'form-control ' + (errors.email ? 'is-invalid' : '')}
                                                    name='email'
                                                    id="id_email"
                                                    type="text"
                                                    placeholder="Цахим хаяг"
                                                />
                                                <ErrorMessage name="email" component="div" className="text-danger"/>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="gender">Хүйс:</label>
                                                <Fragment>
                                                    <Field name="gender" as="select" className="form-control"
                                                    className={'form-control ' + (errors.gender ? 'is-invalid' : '')}>
                                                        <option>Эрэгтэй</option>
                                                        <option>Эмэгтэй</option>
                                                    </Field>
                                                    <ErrorMessage name="gender" component="div" className="text-dange"/>
                                                </Fragment>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="register">Регистер:</label>
                                                <Field
                                                    className={'form-control ' + (errors.register ? 'is-invalid' : '')}
                                                    name='register'
                                                    id="id_register"
                                                    type="text"
                                                    placeholder="Регистер"
                                                />
                                                <ErrorMessage name="register" component="div" className="text-danger"/>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="choose_role">Role: </label>
                                                <select className={'form-control ' + (errors.choose_role ? 'is-invalid' : '')} id="choose_role" name='choose_role' onChange={(e) => this.getRole(e.target.value)}>
                                                    <option value="">--- Role сонгоно уу ---</option>
                                                    {role_list.length > 0 && role_list.map((role, idx) =>
                                                        <option key={idx} value={role.role_id}>{role.role_name}</option>
                                                    )}
                                                </select>
                                                <ErrorMessage name="choose_role" component="div" className="text-danger"/>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="phone_number">Утасны дугаар:</label>
                                                <Field
                                                    className={'form-control ' + (errors.phone_number ? 'is-invalid' : '')}
                                                    name='phone_number'
                                                    id="id_phone_number"
                                                    type="text"
                                                    placeholder="Утасны дугаар"
                                                />
                                                <ErrorMessage name="phone_number" component="div" className="text-danger"/>
                                            </div>
                                            <div className="form-group col-md-6"><br/>
                                                <label htmlFor='is_admin'>Байгууллагын админ</label>
                                                <Field
                                                    className="ml-2"
                                                    name='is_admin'
                                                    id="id_is_admin"
                                                    type="checkbox"
                                                />
                                                <ErrorMessage name="is_admin" component="div" className="text-danger"/>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <button className="btn btn-primary btn-block mb-2" type="button" onClick={() => {
                                                    if (is_address_map) {
                                                        if (this.state.last_geo_id) {
                                                            this.getGeom(this.state.last_geo_id)
                                                        }
                                                    }
                                                    this.setState({ is_address_map: !is_address_map })
                                                }}>
                                                    {
                                                        !is_address_map ? "Role сонгох" : "Гэрийн хаяг оруулах"
                                                    }
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            {
                                                is_address_map && (is_inspire_role || is_inspire_role_null)
                                                ?
                                                    <InsPerms
                                                        action_type="editable"
                                                        is_employee={true}
                                                        getValue={this.getValue}
                                                        dontDid={true}
                                                        org_roles={org_roles}
                                                        role={roles}
                                                        is_inspire_role_null={is_inspire_role_null}
                                                        editable_is_check={this.perms}
                                                    />
                                                :
                                                    <div className="col-md-12">
                                                        <div className="form-row p-1">
                                                            <div className="form-group col-4">
                                                                <label htmlFor="aimag">Аймаг/Хот:</label>
                                                                <select
                                                                    id="aimag"
                                                                    className={'form-control ' + (errors.level_1 ? 'is-invalid' : '')}
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
                                                                    className={'form-control ' + (errors.level_2 ? 'is-invalid' : '')}
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
                                                                    className={'form-control ' + (errors.level_3 ? 'is-invalid' : '')}
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
                                                            <div className="form-group col-4">
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
                                                            <div className="form-group col-4">
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
                                                        </div>
                                                        <EmployeeMap
                                                            feature={feature}
                                                            sendPointCoordinate={this.getPoint}
                                                            map_coordinate={this.state.map_coordinate}
                                                            point={point}
                                                            is_marker={this.state.is_address_map}
                                                            class={(errors.point ? 'border border-danger' : '')}
                                                        />
                                                    </div>
                                            }
                                        </div>
                                        <div className="form-group">
                                            <button type="submit" className="btn btn-primary waves-effect waves-light m-1" disabled={isSubmitting}>
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
                </div>
                <ModalAlert
                    modalAction={() => this.modalClose()}
                    status={this.state.modal_alert_status}
                    title={this.state.title}
                    model_type_icon={this.state.model_type_icon}
                />
                <BackButton {...this.props} name={'Буцах'} navlink_url={prefix}></BackButton>
            </div>
        )
    }
}
