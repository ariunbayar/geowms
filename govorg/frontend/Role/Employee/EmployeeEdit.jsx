import React, { Component, Fragment } from "react"
import {Formik, Field, Form, ErrorMessage} from 'formik'
import { service } from './service'
import Modal from "@utils/Modal/Modal"
import {Notif} from '@utils/Notification'
import Loader from "@utils/Loader"
import InsPerms from '../Role/GovPerms'
import {validationSchema} from '../../../../backend/webapp/src/components/Org/OrgUser/validationSchema'
import EmployeeMap from "./Employee_map/Map"
import BackButton from "@utils/Button/BackButton"


export class EmployeeEdit extends Component {

    constructor(props) {
        super(props)

        this.too=0
        this.perms=[]
        this.role=[]
        this.remove_perms=[]
        this.emp_perms=[]
        this.state = {
            form_values: {
                username: '',
                last_name: '',
                first_name: '',
                position: '',
                email: '',
                gender: '',
                register: '',
                phone_number: '',
                is_admin: false,
                state: 1,
                pro_class: '',
                is_user: false,
            },
            modal_status: 'closed',
            is_loading: true,
            roles: {},
            perms: {},
            role_id: '',
            old_role_id: null,
            is_inspire_role: false,
            is_inspire_role_null: false,
            prefix: '/gov/perm/employee/',
            id: this.props.match.params.id,
            role_list: [],

            is_address_map: false,

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
            map_coordinate: [],

            is_marker: true,

            firstOrder_geom: '',

            positions: [],
            states: [],
            pro_classes: [],
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.getRolesForOption = this.getRolesForOption.bind(this)
        this.getDetail = this.getDetail.bind(this)
        this.getRole = this.getRole.bind(this)
        this.getValue = this.getValue.bind(this)
        this.removeItemFromArray = this.removeItemFromArray.bind(this)
        this.removeItemFromRemoveRoles = this.removeItemFromRemoveRoles.bind(this)
        this.checkRoleAndPerm = this.checkRoleAndPerm.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.addNotif = this.addNotif.bind(this)
        this.handleSendMail = this.handleSendMail.bind(this)

        this.getFeildValues = this.getFeildValues.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.getPoint = this.getPoint.bind(this)
        this.getGeomFromJson = this.getGeomFromJson.bind(this)
        this.getGeom = this.getGeom.bind(this)

        this.refreshMap = this.refreshMap.bind(this)

        this.modalChange=  this.modalChange.bind(this)
        this.handleChangeMail=  this.handleChangeMail.bind(this)
        this.handleHistory = this.handleHistory.bind(this)
        this.getSelectValue = this.getSelectValue.bind(this)
    }

    componentDidMount() {
        this.perms = []
        this.role = []
        this.remove_perms = []
        this.emp_perms=[]

        this.getDetail()
        if (!this.state.id) {
            this.getFeildValues()
        }
        this.getSelectValue()
    }

    getSelectValue() {
        service
            .getSelectValue()
            .then(({ success, positions, states, pro_classes }) => {
                if (success) {
                    this.setState({ positions, states, pro_classes })
                }
            })
    }

    getDetail() {
        const {id} = this.state
        service
            .getDetailEmployee(id)
            .then(({ success, employee_detail, role_id, perms }) => {
                if (success) {
                    this.getFeildValues(employee_detail.level_1, employee_detail.level_2, employee_detail.level_3)
                    this.setState({ perms, role_id, old_role_id: role_id, is_loading: false,
                        form_values:{
                            username: employee_detail.username,
                            last_name: employee_detail.last_name,
                            first_name: employee_detail.first_name,
                            position: employee_detail.position_id,
                            email: employee_detail.email,
                            gender: employee_detail.gender,
                            register: employee_detail.register,
                            phone_number: employee_detail.phone_number,
                            is_admin: employee_detail.is_admin,
                            state: employee_detail.state_id,
                            pro_class: employee_detail.pro_class_id,
                            is_user: employee_detail.is_user,
                        },
                        point: employee_detail.point,
                        street: employee_detail.street,
                        apartment: employee_detail.apartment,
                        door_number: employee_detail.door_number,
                        address_state: employee_detail.address_state,
                    })
                    this.getRolesForOption()
                }
            })
    }

    getRolesForOption() {
        service
            .getRoleList()
            .then(({ success, roles }) => {
                if (success) {
                    this.setState({ role_list: roles })
                    this.getRole(this.state.role_id)
                }
            })
    }

    getRole(role_id) {
        this.perms = []
        this.emp_perms = []
        this.setState({role_id, is_inspire_role: false, is_inspire_role_null: false })
        if(role_id)
        {
            service
                .getRole(role_id)
                .then(({ success, roles }) => {
                    if (success) {
                        this.role = []
                        this.setState({ roles, is_inspire_role: true })
                        this.refreshMap()
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

    getValue(checked, perm_kind, property_id, feature_id, perm_inspire_id, type, is_true_type, is_role_emp_id, is_emp_perm) {
        if(!checked && type == null) {
            this.removeItemFromArray(
                this.role,
                feature_id,
                property_id,
                perm_kind,
                is_role_emp_id,
                is_emp_perm
            )
        }
        if(!checked && this.perms.length > 0) {
            this.removeItemFromArray(
                this.perms,
                feature_id,
                property_id,
                perm_kind,
            )
        }
        if((checked && !type && !is_emp_perm) ||
            (checked && (type == 'role' || type == "perms"))
        ) {
            const add_role = {
                'feature_id': feature_id,
                'property_id': property_id,
                'perm_kind': perm_kind,
                'gov_perm_ins_id': perm_inspire_id,
                'emp_role_ins_id': is_role_emp_id ? is_role_emp_id : null,
            }
            if (type == 'role') this.role.push(add_role)
            if (type == 'perms') this.emp_perms.push(add_role)
            else this.perms.push(add_role)
        }
        if (is_emp_perm && checked && type == null && this.remove_perms.length > 0) {
            this.removeItemFromRemoveRoles(is_role_emp_id)
        }
    }

    removeItemFromArray (array, feature_id, property_id, perm_kind, perm_inspire_id, is_emp_perm) {
        if(is_emp_perm){
            this.remove_perms.push(perm_inspire_id)
            return
        }

        array.map((perm, idx) => {
            if(perm.feature_id == feature_id &&
                perm.property_id == property_id &&
                perm.perm_kind == perm_kind)
            {
                array.splice(idx, 1)
            }
        })
    }

    removeItemFromRemoveRoles(is_role_emp_id) {
        this.remove_perms.map((id, idx) => {
            if (id == is_role_emp_id) {
                this.remove_perms.splice(idx, 1)
            }
        })
    }


    handleSubmit(form_values, {setStatus, setSubmitting, setErrors}) {
        const {id, role_id, is_address_map} = this.state

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

        this.checkRoleAndPerm()
        if(is_address_map) {
            this.refreshMap()
        }
        service
            .updateEmployee(form_values, role_id, id, this.perms, this.remove_perms, address)
            .then(({ success, info, errors }) => {
                if(success) {
                    setStatus('saved')
                    this.modalChange(
                        'fa fa-check-circle',
                        "success",
                        'Амжилттай хадгаллаа',
                        '',
                        false,
                        this.handleHistory
                    )
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

    checkRoleAndPerm() {
        this.role.map((role, idx) => {
            this.emp_perms.map((perm, p_idx) => {
                if(role.property_id == perm.property_id && role.feature_id == perm.feature_id && role.perm_kind == perm.perm_kind) {
                    const found = this.remove_perms.find(element => element == perm.gov_perm_ins_id);
                    if(!found) {
                        this.remove_perms.push(perm.gov_perm_ins_id)
                    }
                }
            })
        })
    }

    handleModalOpen(){
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    addNotif(style, msg, icon){
        this.too ++
        this.setState({ show: true, style: style, msg: msg, icon: icon })
        const time = setInterval(() => {
            this.too --
            this.setState({ show: true })
            clearInterval(time)
        }, 2000);
    }

    handleSendMail(){
        this.setState({ is_loading: true })
        const username = this.state.form_values.username
        service
            .sendMail(username)
            .then(({ success, info }) => {
                if(success) {
                    this.setState({ is_loading: false })
                    this.addNotif('success', info, 'check')
                }
            })
    }

    getFeildValues(level_1, level_2, level_3) {
        let obj = Object()
        let geo_id
        let array
        service
            .formOptions()
            .then(({ success, info, firstOrder_geom }) => {
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
                    this.setState({ aimag: info, ...obj, firstOrder_geom })
                }
            })
    }

    getGeom(geo_id) {
        service
            .getGeom(geo_id)
            .then(({ data }) => {
                if (data) {
                    this.setState({ feature: data, last_geo_id: geo_id })
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
                geo_id = this.state.firstOrder_geom
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

    refreshMap() {
        const { last_geo_id, is_address_map, is_marker, point } = this.state
        let obj = Object()
        obj['is_address_map'] = !is_address_map
        if (is_address_map) {
            if (last_geo_id) {
                obj['is_marker'] = !is_marker
                obj['point'] = point
                this.getGeom(last_geo_id)
            }
        }
        this.setState({ ...obj })
    }

    modalChange(modal_icon, icon_color, title, text, has_button, modalClose) {
        this.setState(
            {
                modal_icon,
                icon_color,
                title,
                text,
                has_button,
                modalClose
            },
            () => this.handleModalOpen()
        )

    }

    handleChangeMail() {
        this.modalChange(
            'fa fa-exclamation-circle',
            "warning",
            'Нууц үг солих',
            'Та нууц үг солих имэйл илгээхдээ итгэлтэй байна уу?',
            true,
            null,
        )
    }

    handleHistory() {
        this.props.history.push(this.state.prefix)
    }

    render() {
        const {form_values, roles, role_list, prefix, is_inspire_role, is_inspire_role_null, perms, old_role_id, role_id, id, is_address_map } = this.state
        const { aimag, sum, horoo, aimag_id, sum_id, horoo_id, address_state, feature, street, apartment, door_number, point } = this.state
        const { org_roles } = this.props
        const { positions, states, pro_classes } = this.state
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
                                    <Loader is_loading={this.state.is_loading}/>
                                    <div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <div className="position-relative has-icon-right">
                                                    <label htmlFor="id_username" >Нэвтрэх нэр:</label>
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
                                                    <label htmlFor="id_last_name">Овог:</label>
                                                    <Field
                                                        className={'form-control ' + (errors.last_name ? 'is-invalid' : '')}
                                                        name='last_name'
                                                        id="id_last_name"
                                                        type="text"
                                                        placeholder="Овог"
                                                    />
                                                    <ErrorMessage name="last_name" component="div" className="text-danger"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <div className="position-relative has-icon-right">
                                                    <label htmlFor="id_first_name">Нэр:</label>
                                                    <Field
                                                        className={'form-control ' + (errors.first_name ? 'is-invalid' : '')}
                                                        name='first_name'
                                                        id="id_first_name"
                                                        type="text"
                                                        placeholder="Нэр"
                                                    />
                                                    <ErrorMessage name="first_name" component="div" className="text-danger"/>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-6">
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
                                            <div className="form-group col-md-6">
                                                <label htmlFor="id_email">Цахим хаяг</label>
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
                                                <label htmlFor="id_gender">Хүйс:</label>
                                                <Fragment>
                                                    <Field
                                                        name="gender"
                                                        as="select"
                                                        id="id_gender"
                                                        className="form-control"
                                                        className={'form-control ' + (errors.gender ? 'is-invalid' : '')}
                                                    >
                                                        <option>Эрэгтэй</option>
                                                        <option>Эмэгтэй</option>
                                                    </Field>
                                                    <ErrorMessage name="gender" component="div" className="text-dange"/>
                                                </Fragment>
                                            </div>
                                        </div>
                                        {this.props.employee.is_admin
                                        ?
                                            <div>
                                                <div className="form-row">
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="id_register">Регистер:</label>
                                                        <Field
                                                            className={'form-control ' + (errors.register ? 'is-invalid' : '')}
                                                            name='register'
                                                            id="id_register"
                                                            type="text"
                                                            placeholder="Регистер"
                                                        />
                                                        <ErrorMessage name="register" component="div" className="text-danger"/>
                                                    </div>
                                                    {this.props.employee.is_admin &&
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="choose_role">Role: </label>
                                                        <select className='form-control' id="choose_role" name='choose_role' value={this.state.role_id} onChange={(e) => this.getRole(e.target.value)}>
                                                            <option value="">--- Role сонгоно уу ---</option>
                                                            {role_list.length > 0 && role_list.map((role, idx) =>
                                                                <option key={idx} value={role.role_id}>{role.role_name}</option>
                                                            )}
                                                        </select>
                                                    </div>}
                                                </div>
                                                <div className='form-row'>
                                                    <div className="form-group col-md-6">
                                                        <div className="position-relative has-icon-right">
                                                            <label htmlFor="id_phone_number" >Утасны дугаар:</label>
                                                            <Field
                                                                className={'form-control ' + (errors.phone_number ? 'is-invalid' : '')}
                                                                name='phone_number'
                                                                id="id_phone_number"
                                                                type="text"
                                                                placeholder="Утасны дугаар"
                                                            />
                                                            <ErrorMessage name="phone_number" component="div" className="text-danger"/>
                                                        </div>
                                                    </div>
                                                    {
                                                        this.props.employee.is_admin &&
                                                            <>
                                                                <div className="form-group col-md-2 mt-1 text-center"><br/>
                                                                    <label htmlFor='id_is_admin'>Байгууллагын админ</label>
                                                                    <Field
                                                                        className="ml-2"
                                                                        name='is_admin'
                                                                        id="id_is_admin"
                                                                        type="checkbox"
                                                                    />
                                                                    <ErrorMessage name="is_admin" component="div" className="text-danger"/>
                                                                </div>
                                                                <div className="form-group col-md-2 mt-1 text-center"><br/>
                                                                    <label htmlFor='id_is_user'>Хэрэглэгч</label>
                                                                    <Field
                                                                        className="ml-2"
                                                                        name='is_user'
                                                                        id="id_is_user"
                                                                        type="checkbox"
                                                                    />
                                                                    <ErrorMessage name="is_user" component="div" className="text-danger"/>
                                                                </div>
                                                            </>
                                                    }
                                                    {(this.props.employee.username == form_values.username) || this.props.employee.is_admin ?
                                                    <div className="col-md-2 mt-1 text-center"><br/>
                                                        <button type="button" className="btn gp-btn-primary btn-sm" aria-hidden="true" onClick={this.handleChangeMail}>
                                                            {} Нууц үг солих имэйл илгээх
                                                        </button>
                                                    </div>
                                                    : null
                                                    }
                                                </div>
                                            </div>
                                        :
                                            <div>
                                                <div className="form-row">
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="id_register">Регистер:</label>
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
                                                        <div className="position-relative has-icon-right">
                                                            <label htmlFor="id_phone_number" >Утасны дугаар:</label>
                                                            <Field
                                                                className={'form-control ' + (errors.phone_number ? 'is-invalid' : '')}
                                                                name='phone_number'
                                                                id="id_phone_number"
                                                                type="text"
                                                                placeholder="Утасны дугаар"
                                                            />
                                                            <ErrorMessage name="phone_number" component="div" className="text-danger"/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    {(this.props.employee.username == form_values.username) || this.props.employee.is_admin ?
                                                    <div className="col-md-3 mt-1">
                                                        <button type="button" className="btn gp-btn-primary btn-sm" aria-hidden="true" onClick={this.handleChangeMail}>
                                                            {} Нууц үг солих имэйл илгээх
                                                        </button>
                                                    </div>
                                                    : null
                                                    }
                                                </div><br/>
                                            </div>
                                        }
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor='id_state'>Төлөв:</label>
                                                <Field name="state" as="select" id="id_state"
                                                    style={{ fontSize: '0.8rem' }}
                                                    className={'custom-select ' + (errors.state ? 'is-invalid' : '')}
                                                >
                                                    {
                                                        states.map((item, idx) =>
                                                            <option key={idx} value={item[0]}>{item[1]}</option>
                                                        )
                                                    }
                                                </Field>
                                                <ErrorMessage name="state" component="div" className="invalid-feedback"/>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor='id_pro_class'>Мэргэжлийн ангийн бүрэлдэхүүн:</label>
                                                    <Field name="pro_class" as="select" id="id_pro_class"
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
                                        {this.props.employee.is_admin &&
                                        <div className="form-group col-md-12">
                                            <button className="btn btn-primary btn-block mb-2" type="button" onClick={() => this.refreshMap()}>
                                                {
                                                    !is_address_map ? "Role сонгох" : "Гэрийн хаяг оруулах"
                                                }
                                            </button>
                                        </div>}
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
                                                        emp_perms={old_role_id == role_id ? perms : null}
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
                                                            map_coordinate={this.state.map_coordinate}
                                                            point={point}
                                                            is_marker={this.state.is_marker}
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
                <Modal
                    modal_status={this.state.modal_status}
                    modal_icon={this.state.modal_icon}
                    icon_color={this.state.icon_color}
                    title={this.state.title}
                    has_button={this.state.has_button}
                    text={this.state.text}
                    modalAction={this.handleSendMail}
                    modalClose={this.state.modalClose}
                    actionNameDelete="Шинэчлэх"
                />
                <Notif show={this.state.show} too={this.too} style={this.state.style} msg={this.state.msg} icon={this.state.icon}/>
                <BackButton {...this.props} name={'Буцах'} navlink_url={prefix}></BackButton>
            </div>
        )
    }
}
