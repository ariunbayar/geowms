import React, { Component, Fragment } from "react"
import { Formik, Form, Field, ErrorMessage, validateYupSchema , FieldArray} from 'formik'
import {service} from '../service'
import {NavLink} from "react-router-dom"
import ModalAlert from "../../ModalAlert"


export class OrgInspireRole extends Component {

    constructor(props) {
        super(props)

        this.state = {
            form_datas: [],
            handleSaveIsLoad: false,
            modal_alert_status: "closed",
            timer: null,
            model_type_icon: '',
            title: '',
        }

        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)

    }

    onSubmit(values, { setStatus, setSubmitting }) {
        const {level, id} = this.props.match.params
        this.setState({handleSaveIsLoad: true})
        service.rolesAdd(level, id, values).then(({success}) => {
            if (success) {
                setTimeout(() => {
                    this.setState({modal_alert_status: "open", model_type_icon: 'success', title: 'Амжилттай хадгаллаа', handleSaveIsLoad: false})
                    this.modalCloseTime()
                }, 1000);
            }
            else{
                setTimeout(() => {
                    this.setState({modal_alert_status: "open", model_type_icon: 'danger', title: 'Алдаа гарлаа', handleSaveIsLoad: false})
                    this.modalCloseTime()
                }, 1000);
            }
        })
    }
    componentDidMount() {
        this.handleListUpdated()
    }

    handleListUpdated() {
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        service.inspireRoles(org_level, org_id).then(({ success, data }) => {
            console.log(data)
            this.setState({form_datas:data})
          });
    }

    modalCloseTime(){
        this.state.timer = setTimeout(() => {
            this.setState({modal_alert_status: 'closed'})
            this.setState({handleSaveIsLoad:false})
            this.handleListUpdated()
        }, 2000)
    }

    modalClose(){
        this.setState({modal_alert_status: 'closed'})
        clearTimeout(this.state.timer)
        this.setState({handleSaveIsLoad:false})
        this.handleListUpdated()
    }


    render() {
        const {form_datas} = this.state
        console.log(form_datas)
        return (
            <div className="my-4">
                <Formik
                    enableReinitialize
                    initialValues={{ form_values: form_datas }}
                    onSubmit={this.onSubmit}
                    render={({ values }) => (
                        <Form>
                            <FieldArray
                                name="form_values"
                                render={arrayHelpers => (
                                <div>
                                    {values.form_values && values.form_values.length > 0 ? (
                                        <>
                                        <hr></hr>
                                        <div className="row">
                                            <div className="col-md-5">
                                                <a className="text-dark">Нэрс</a>
                                            </div>
                                            <div className="col-md-1"><a className="text-dark">ХАРАХ</a></div>
                                            <div className="col-md-1"><a className="text-dark">НЭМЭХ</a></div>
                                            <div className="col-md-1"><a className="text-dark">ХАСАХ</a></div>
                                            <div className="col-md-1"><a className="text-dark">ЗАСАХ</a></div>
                                            <div className="col-md-1"><a className="text-dark">ЦУЦЛАХ</a></div>
                                            <div className="col-md-1"><a className="text-dark">ХЯНАХ</a></div>
                                            <div className="col-md-1"><a className="text-dark">БАТЛАХ</a></div>
                                        </div>
                                        <hr></hr>
                                        {values.form_values.map(({name, roles, packages}, theme_index) => (
                                            <div key={theme_index}>
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <a className="text-dark pl-1"><i class="fa fa-chevron-down gp-text-primary" aria-hidden="true"></i>&nbsp;{name}</a>
                                                    </div>
                                                        {roles.map((role, role_index) =>
                                                        <div className="col-md-1" key={role_index}>

                                                            <Field type="checkbox" name={`form_values.${theme_index}.roles.${role_index}`} />
                                                        </div>
                                                        )}
                                                </div>
                                                <hr></hr>


                                                {packages ? packages.map((package_data, package_index) =>
                                                    <div key={package_index}>
                                                        <div className="row">
                                                            <div className="col-md-5">
                                                                <a className="text-dark pl-2">&nbsp;&nbsp;&nbsp;<i class="fa fa-chevron-down gp-text-primary" aria-hidden="true"></i>&nbsp;{package_data.name}</a>
                                                            </div>
                                                            {package_data.roles.map((role, role_index) =>
                                                            <div className="col-md-1">
                                                                <Field type="checkbox" name={`form_values.${theme_index}.packages.${package_index}.roles.${role_index}`} />
                                                            </div>
                                                            )}
                                                        </div>
                                                        <hr></hr>

                                                        {package_data.features.map((feature_data, feature_index) =>
                                                            <div key={feature_index}>
                                                                <div className="row">
                                                                    <div className="col-md-5">
                                                                        <a className="text-dark pl-3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-chevron-down gp-text-primary" aria-hidden="true"></i>&nbsp;{feature_data.name}</a>
                                                                    </div>
                                                                    {feature_data.roles.map((role, role_index) =>
                                                                    <div className="col-md-1">
                                                                        <Field type="checkbox" name={`form_values.${theme_index}.packages.${package_index}.features.${feature_index}.roles.${role_index}`} />
                                                                    </div>
                                                                    )}
                                                                </div>
                                                                <hr></hr>

                                                                {feature_data.properties.length > 0 ? feature_data.properties.map((property_data, property_index) =>
                                                                    <div key={property_index}>
                                                                        <div className="row">
                                                                            <div className="col-md-5 ">
                                                                                <a className="text-dark pl-4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-chevron-right gp-text-primary" aria-hidden="true"></i>&nbsp;{property_data.name}</a>
                                                                            </div>
                                                                            {property_data ? property_data.roles.map((role, role_index) =>
                                                                            <div className="col-md-1">

                                                                                <Field type="checkbox" name={`form_values.${theme_index}.packages.${package_index}.features.${feature_index}.properties.${property_index}.roles.${role_index}`} />
                                                                            </div>
                                                                            ):null}
                                                                        </div>
                                                                        <hr></hr>
                                                                    </div>
                                                                ):null }
                                                            </div>
                                                        )}

                                                    </div>
                                                ):null }
                                                <hr></hr>
                                                <hr></hr>
                                            </div>
                                        ))}
                                        </>


                                    ) : ( null
                                    )}
                                    <div>
                                    {this.state.handleSaveIsLoad ?
                                        <button className="btn btn-block gp-btn-primary my-3">Уншиж байна</button>:
                                        <button type="submit" className="btn btn-block gp-btn-primary my-3">Хадгалах</button>
                                    }
                                    </div>
                                </div>
                                )}
                            />
                        </Form>
                    )}
                />
            <ModalAlert
                modalAction={() => this.modalClose()}
                status={this.state.modal_alert_status}
                title={this.state.title}
                model_type_icon={this.state.model_type_icon}
            />

            </div>
        )
    }
}