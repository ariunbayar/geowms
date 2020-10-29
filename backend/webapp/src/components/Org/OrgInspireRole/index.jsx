import React, { Component, Fragment } from "react"
import { Formik, Form, Field, ErrorMessage, validateYupSchema , FieldArray} from 'formik'
import {service} from '../service'
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

    onSubmit(values) {
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
        return (
            <div className="scroll-fixed ">
                <table className="table table-bordered row">
                    <thead className="thead-light col-12">
                        <tr className="row">
                            <th scope="col" className="text-center col-5">Оронзайн суурь өгөгдлийн сан</th>
                            <th scope="col" className="text-center col-1"><span>харах</span></th>
                            <th scope="col" className="text-center col-1"><span>нэмэх</span></th>
                            <th scope="col" className="text-center col-1"><span>хасах</span></th>
                            <th scope="col" className="text-center col-1"><span>засах</span></th>
                            <th scope="col" className="text-center col-1"><span>цуцлах</span></th>
                            <th scope="col" className="text-center col-1"><span>хянах</span></th>
                            <th scope="col" className="text-center col-1"><span>батлах</span></th>
                        </tr>
                    </thead>
                    <Formik
                        enableReinitialize
                        initialValues={{ form_values: form_datas }}
                        onSubmit={this.onSubmit}
                        render={({ values }) => (
                            <>
                                <FieldArray
                                    name="form_values"
                                    render={arrayHelpers => (
                                    <>
                                        {values.form_values && values.form_values.length > 0 ? (
                                            <tbody className="col-12">
                                            {values.form_values.map(({name, roles, packages}, theme_index) => (
                                                <>
                                                    <tr className="row">
                                                        <th className="col-5">
                                                            <a className="text-dark pl-1"><i className={roles[0] ? "fa fa-chevron-down gp-text-primary" : "fa fa-chevron-right gp-text-primary"} aria-hidden="true"></i>&nbsp;{name}</a>
                                                        </th>
                                                        {roles.map((role, role_index) =>
                                                        <td className="col-1" key={role_index}>

                                                            <Field type="checkbox" name={`form_values.${theme_index}.roles.${role_index}`} />
                                                        </td>
                                                        )}
                                                    </tr>
                                                    {packages.length > 0 && roles[0] ? packages.map((package_data, package_index) =>
                                                        <>
                                                            <tr className="row">
                                                                <th className="col-5">
                                                                    <a className="text-dark pl-2">&nbsp;&nbsp;&nbsp;<i className={roles[0] ? "fa fa-chevron-down gp-text-primary" : "fa fa-chevron-right gp-text-primary"} aria-hidden="true"></i>&nbsp;{package_data.name}</a>
                                                                </th>
                                                                {package_data.roles.map((role, role_index) =>
                                                                <td className="col-1" key={role_index}>
                                                                    <Field type="checkbox" name={`form_values.${theme_index}.packages.${package_index}.roles.${role_index}`} />
                                                                </td>
                                                                )}
                                                            </tr>

                                                            {package_data.features.length>0 && package_data.roles[0] ? package_data.features.map((feature_data, feature_index) =>
                                                                <>
                                                                    <tr className="row">
                                                                        <th className="col-5">
                                                                            <a className="text-dark pl-3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i className={roles[0] ? "fa fa-chevron-down gp-text-primary" : "fa fa-chevron-right gp-text-primary"} aria-hidden="true"></i>&nbsp;{feature_data.name}</a>
                                                                        </th>
                                                                        {feature_data.roles.map((role, role_index) =>
                                                                        <td className="col-1" key={role_index}>
                                                                            <Field type="checkbox" name={`form_values.${theme_index}.packages.${package_index}.features.${feature_index}.roles.${role_index}`} />
                                                                        </td>
                                                                        )}
                                                                    </tr>

                                                                    {feature_data.properties.length && feature_data.roles[0] > 0 ? feature_data.properties.map((property_data, property_index) =>
                                                                        <>
                                                                            <tr className="row">
                                                                                <th className="col-5">
                                                                                    <a className="text-dark pl-4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i className="fa fa-chevron-right gp-text-primary" aria-hidden="true"></i>&nbsp;{property_data.name}</a>
                                                                                </th>
                                                                                {property_data ? property_data.roles.map((role, role_index) =>
                                                                                <td className="col-1" key={role_index}>

                                                                                    <Field type="checkbox" name={`form_values.${theme_index}.packages.${package_index}.features.${feature_index}.properties.${property_index}.roles.${role_index}`} />
                                                                                </td>
                                                                                ):null}
                                                                            </tr>
                                                                        </>
                                                                    ):null }
                                                                </>
                                                            ):null}
                                                        </>
                                                    ):null }
                                                </>
                                            ))}
                                            </tbody>


                                        ) : ( null
                                        )}
                                        <tfoot className="col-12">
                                            <tr className="row">
                                                {this.state.handleSaveIsLoad ?
                                                    <a className="col-12 btn btn-block gp-btn-primary my-3 text-white">Уншиж байна</a>:
                                                    <a onClick={() => this.onSubmit(values)} className="col-12 btn btn-block gp-btn-primary my-3 text-white">Хадгалах</a>
                                                }
                                            </tr>
                                        </tfoot>
                                    </>
                                    )}
                                />
                            </>
                        )}
                    />
                </table>
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