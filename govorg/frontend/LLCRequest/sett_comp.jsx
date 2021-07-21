import React, {Component, Fragment} from "react"

import { makeStateColor, makeKindColor } from "@helpUtils/functions"
import * as utils from "@helpUtils/functions"
import Modal from "@utils/Modal/Modal"
import BackButton from "@utils/Button/BackButton"

import RequestModal from './requestModal'
import {ConfigureBundle} from './configure_bundle'
// govorg/frontend/LLCRequest/LLCList.jsx

import {service} from './service'

export class LLCSettings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            list_of_datas: [],
            model_status: false,
            selected_values: [],
            themes: [],
            packages: [],
            features: [],
            theme_state: false,
            selected_packages: [],
            selected_features: [],
            modal_status: 'closed',
            save_icon: false,
        }
        this.handleProceed = this.handleProceed.bind(this)
        this.closeModel = this.closeModel.bind(this)
        this.getInspireTree = this.getInspireTree.bind(this)
        this.modelAction = this.modelAction.bind(this)
        this.Save = this.Save.bind(this)
        this.modalChange = this.modalChange.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.goLink = this.goLink.bind(this)
        this.handleSaveModal = this.handleSaveModal.bind(this)
    }

    getArray(data, selected_value) {
        var array = [...data]
        var seleted_datas = array.filter((data) => data.parent == selected_value)
        return seleted_datas
    }

    modelAction(name, e, selected_values) {
        var data_list = {}
        var seleted_datas = []
        var { packages, features, list_of_datas } = this.state
        var value_list_of = obj => obj.id == selected_values.id
        var index_of_list = list_of_datas.findIndex(value_list_of)

        var value = e.target.value
        if (name == 'order_no' || name == 'order_at') {
            list_of_datas[index_of_list][name] = value
        }

        else {
            const selected_value = parseInt(value)
            var target_data = e.target.selectedIndex
            var optionElement = e.target.childNodes[target_data]
            var selected_data_name =  optionElement.getAttribute('name')


            if ( name == 'theme' ) {
                seleted_datas = this.getArray(packages, selected_value)
                data_list['selected_packages'] = seleted_datas
                list_of_datas[index_of_list]['package']['name'] = ''
                list_of_datas[index_of_list]['package']['id'] = ''
                list_of_datas[index_of_list]['feature']['name'] = ''
                list_of_datas[index_of_list]['feature']['id'] = ''
                data_list['selected_features'] = []
                list_of_datas[index_of_list]['package'].list = []
                list_of_datas[index_of_list]['feature'].list = []
            }

            else if ( name == 'package' ) {
                seleted_datas = this.getArray(features, selected_value)
                data_list['selected_features'] = seleted_datas
                list_of_datas[index_of_list]['feature']['name'] = ''
                list_of_datas[index_of_list]['feature']['id'] = ''
                list_of_datas[index_of_list]['feature'].list = []
            }
            else {
                data_list['model_status'] = true
            }

            if (! selected_value) {
                data_list['selected_features'] = []
                list_of_datas[index_of_list]['feature']['name'] = ''
                list_of_datas[index_of_list]['feature']['id'] = ''

                data_list['selected_packages'] = []
                list_of_datas[index_of_list]['package']['name'] = ''
                list_of_datas[index_of_list]['package']['id'] = ''

            }

            list_of_datas[index_of_list][name].id = selected_value
            list_of_datas[index_of_list][name].name = selected_data_name
        }

        list_of_datas[index_of_list].icon_state = false

        data_list['list_of_datas'] = list_of_datas
        this.setState({ ...data_list })
    }

    getInspireTree() {
        return service.getInspireTree()
    }

    handleProceed(values) {
        this.setState({ model_status: true, selected_values: values })
    }

    closeModel() {
        this.setState({ model_status: false })
    }

    componentDidMount() {
        const {id} = this.props.match.params

        service.getFilesDetal(id).then(async ({ list_of_datas }) => {
            const { themes, packages, features } = await service.getInspireTree()
            list_of_datas.map((list_of_data, idx) => {
                if (list_of_data.theme.id) {
                    var selected_packages = this.getArray(packages, list_of_data.theme.id)
                    var selected_features = this.getArray(features, list_of_data.package.id)
                    list_of_datas[idx]['package']['list'] = selected_packages
                    list_of_datas[idx]['feature']['list'] = selected_features
                }
            })
            this.setState({list_of_datas, themes, packages, features})
        })
    }

    handleSaveModal(value, idx) {
        const { selected_values, geom_type } = this.state
        const { features } = selected_values

        var file_geom_type
        features.map((details, idx) =>
            file_geom_type = details.geometry.type
        )
        file_geom_type = utils.checkMultiGeomTypeName(file_geom_type)
        if(geom_type !== file_geom_type) {
            const modal = {
                modal_status: "open",
                modal_icon: "fa fa-exclamation-circle",
                modal_bg: '',
                icon_color: 'warning',
                title: 'Геометр төрөл зөрсөн байна!',
                text: ` Та тохиргоогоо дахин хянана уу!`,
                has_button: false,
                actionNameBack: '',
                actionNameDelete: '',
                modalAction: null,
                modalClose: () => this.modalClose(idx)
            }
            global.MODAL(modal)
        }
        else {
            this.Save(value, idx)
        }
    }

    modalClose(idx) {
        var { list_of_datas } = this.state
        list_of_datas[idx].icon_state = true
        this.setState({ list_of_datas })
    }

    Save(value, idx) {
        var list_of_datas = this.state.list_of_datas
        service.Save(value).then(({ success }) => {
            if (success) {
                const modal = {
                    modal_status: "open",
                    modal_icon: "fa fa-check-circle",
                    modal_bg: '',
                    icon_color: 'success',
                    title: 'Амжилттай',
                    text: ``,
                    has_button: false,
                    actionNameBack: '',
                    actionNameDelete: '',
                    modalAction: null,
                    modalClose: null,
                }
                global.MODAL(modal)
            }
            else {
                const modal = {
                    modal_status: "open",
                    modal_icon: "fa fa-exclamation-circle",
                    modal_bg: '',
                    icon_color: 'warning',
                    title: 'Геометр төрөл зөрсөн байна!',
                    has_button: false,
                    actionNameBack: '',
                    actionNameDelete: '',
                    modalAction: null,
                    modalClose: null
                }
                global.MODAL(modal)
            }
            list_of_datas[idx].icon_state = true
            this.setState({ list_of_datas })
        })
    }

    handleModalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    modalChange(modal_icon, icon_color, title, has_button) {
        this.setState({
            modal_icon,
            icon_color,
            title,
            has_button
        })
        this.handleModalOpen()
    }

    goLink(values) {
        const modal = {
            modal_status: "open",
            modal_icon: "fa fa-commenting",
            modal_bg: '',
            icon_color: 'primary',
            title: 'Тайлбар',
            text: values.description,
            has_button: false,
            actionNameBack: '',
            actionNameDelete: '',
            modalAction: null,
            modalClose: null,
        }
        global.MODAL(modal)
    }

    getGeomType(geom_type) {
        this.state['geom_type'] = geom_type
    }

    render() {
        const { list_of_datas, model_status } = this.state
        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12 overflow-auto text-justify my-2" style={{height:"calc( 40vh - 35px - 7px)"}}>
                            <table className="table table_wrapper_table">
                                <thead>
                                    <tr>
                                        <th scope="col"> № </th>
                                        <th scope="col">Төрөл</th>
                                        <th scope="col">Төлөв</th>
                                        <th scope="col">Өөрчлөлт</th>
                                        <th scope="col">THEME</th>
                                        <th scope="col">PACKAGE</th>
                                        <th scope="col">FEATURE</th>
                                        <th scope="col">дэд сан сонгох</th>
                                        <th scope="col">Тайлбар</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        list_of_datas.length > 0 ?
                                        list_of_datas.map((value, idx) =>
                                        <tr key={idx}>
                                            <td>
                                                {idx+1}
                                            </td>
                                            <td>
                                                {value.geom_type}
                                            </td>
                                            <td className={`${makeStateColor(value.state)}`}>
                                                {value.state}
                                            </td>
                                            <td className={`${makeKindColor(value.kind)}`}>
                                                {value.kind}
                                            </td>
                                            <td>
                                                {value.theme.name}
                                            </td>
                                            <td>
                                                {value.package.name}
                                            </td>
                                            <td>
                                                {value.feature.name}
                                            </td>
                                            <td>
                                                {
                                                    value.icon_state
                                                    ?
                                                        <a className="text-primary fa fa-pencil-square-o" role="button" onClick={(e) => this.handleProceed(value)}/>
                                                    :
                                                        <a className='text-success fa fa-floppy-o' role="button" onClick={(e) => this.handleSaveModal(value, idx)}/>
                                                }
                                            </td>
                                            <td>
                                                <a className='gp-text-primary fa fa-commenting' role="button" onClick={(e) => this.goLink(value)}/>
                                            </td>
                                        </tr>
                                        ): <tr><td>дата бүртгэлгүй байна</td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                        {
                            model_status
                            &&
                                <RequestModal
                                    modalClose={this.closeModel}
                                    model_body={ConfigureBundle}
                                    model_action={this.modelAction}
                                    getGeomType={(...values) => this.getGeomType(...values)}
                                    {...this.state}
                                    title={'Дэд сан тохируулах'}
                                />
                        }
                        <Modal
                            modal_status={ this.state.modal_status }
                            modal_icon={ this.state.modal_icon }
                            modal_bg={ this.state.modal_bg }
                            icon_color={ this.state.icon_color }
                            text={ this.state.text }
                            title={ this.state.title }
                            has_button={ this.state.has_button }
                            actionNameBack={ this.state.actionNameBack }
                            actionNameDelete={ this.state.actionNameDelete }
                            modalAction={ this.state.modalAction }
                            modalClose={ this.state.modalClose }
                        />
                    </div>
                </div>
                <BackButton
                    {...this.props}
                    name={'Буцах'}
                    navlink_url={`/gov/llc-request/`}>
                </BackButton>
            </div>
        )
    }
}

