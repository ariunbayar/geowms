import React, { Component } from "react"

import SelectField from '@utils/Tools/Form/select_field'
import * as utils from "@helpUtils/functions"

import { LLCMap } from '../../../llc/frontend/LLCMap'

import { service } from './service'


export class ConfigureBundle extends Component {

    constructor(props) {
        super(props)

        this.state = {
            status: "initial",
            action_type: '',
            modal_status: "closed",
            modal_icon: 'fa fa-check-circle',
            icon_color: 'success',
            title: '',
            text: '',
            model_type_icon: '',
            action_name: '',
            modalClose: null,
            values: props.values,
            table_name: '',
            themes: props.themes,
            packages: props.packages,
            features: props.features,
            selected_packages: props.selected_packages,
            selected_features: props.selected_features,
            selected_dt_list: [],
            data_type_list: [],
            geom_state_count: 0,
        }
        this.handleChange = this.handleChange.bind(this)
        this.changeGeom = this.changeGeom.bind(this)
        this.getType = this.getType.bind(this)
    }

    componentDidMount() {
        const { id } = this.props.selected_values.feature
        this.getType(id)
    }

    changeGeom(state) {
        let geom_state_count = this.state.geom_state_count
        var feature_count = this.props.selected_values.features.length - 1

        if(state) {
            if (geom_state_count < feature_count) {
                geom_state_count = geom_state_count + 1
            }
            else geom_state_count = 0
        }
        else {
            if (geom_state_count > 0) {
                geom_state_count = geom_state_count - 1
            }
            else geom_state_count = feature_count
        }
        this.setState({ geom_state_count })
    }

    handleChange(name, selection, e) {
        const { selected_values } = this.props
        const select = selection.code
        this.props.model_action(name, e, selected_values)
        this.getType(select)
    }

    getType(selected_feature_id) {
        service
            .geomType(selected_feature_id)
            .then(({ geom_type }) => {
                if(geom_type) {
                    this.props.getGeomType(geom_type)
                    this.setState({ geom_type })
                }
            })
    }

    componentDidUpdate(pP, pS) {
        const { selected_packages, selected_features} = this.props
        if (pS.selected_packages != selected_packages) {
            this.setState({selected_packages})
        }

        if (pS.selected_features != selected_features) {
            this.setState({selected_features})
        }
    }

    checkValidType(feat_data_type, geom_type) {
        if (geom_type) {
            if (feat_data_type !== geom_type) {
                return false
            }
        }
        return true
    }

    render() {
        const { themes, geom_state_count, geom_type } = this.state
        const { selected_values, selected_packages, selected_features } = this.props
        const { theme, feature } = selected_values

        var feature_data = selected_values.features[geom_state_count]
        var feat_data_type = utils.checkMultiGeomTypeName(feature_data.geometry.type)
        const is_valid_type = this.checkValidType(feat_data_type, geom_type)

        return (
            <div className="col-md-12">
                <div className="form-row col-md-12 p-4 mx-1">
                    <SelectField
                        state_name='theme'
                        label="Theme"
                        option_name = "name"
                        option_key = "code"
                        data_list={themes}
                        default_value={theme?.id || ''}
                        default_text={'theme-ийн нэр сонгоно уу'}
                        handleSelectField={this.handleChange}
                    />
                    <SelectField
                        state_name='package'
                        label="package"
                        option_name = "name"
                        option_key = "code"
                        data_list={
                            selected_values.package?.list && selected_values.package?.list.length > 0
                            ? selected_values.package?.list : selected_packages
                        }
                        default_value={selected_values.package?.id || ''}
                        className={"col-md-4"}
                        default_text={'package-ийн нэр сонгоно уу'}
                        handleSelectField={this.handleChange}
                    />
                    <SelectField
                        state_name='feature'
                        label="feature"
                        option_name = "name"
                        option_key = "code"
                        data_list={
                            selected_values.feature?.list && selected_values.feature?.list.length > 0
                            ? selected_values.feature?.list : selected_features
                        }
                        default_value={feature?.id || ''}
                        className={"col-md-4"}
                        default_text={'feature-ийн нэр сонгоно уу'}
                        handleSelectField={this.handleChange}
                    />
                    <div className="col-md-8"></div>
                    <div className="col-md-4">
                        {
                            !is_valid_type && feature?.id &&
                                <small className="text-danger">Төрөл таарахгүй байна!</small>
                        }
                    </div>
                </div>
                <div className="col-md-12 d-flex justify-content-between">
                    <div className="col-md-6">
                        <label htmlFor="">Тушаалын дугаар</label>
                        <input
                            className={'form-control ' + (!selected_values.order_no && 'is-invalid')}
                            name='order_no'
                            type="text"
                            value={selected_values.order_no || ''}
                            onChange={(e) => {this.handleChange('order_no', [], e)}}
                        />
                    </div>
                    <div className="col-md-6 mb-2">
                        <label htmlFor="">Тушаал гарсан огноо</label>
                        <input
                            className={'form-control ' + (!selected_values.order_at && 'is-invalid')}
                            name='order_at'
                            type="date"
                            value={selected_values.order_at || ''}
                            onChange={(e) => {this.handleChange('order_at', [], e)}}
                        />
                    </div>
                </div>
                <div className="p-4 mx-1">
                    {
                        selected_values.features
                        &&
                        <div className="col-md-12 pb-5 mt-2 px-0 mx-0 d-flex justify-content-between">
                            <div className="col-md-6">
                                <div className="overflow-auto" style={{maxHeight: '50vh'}}>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col"> # </th>
                                                <th scope="col"> Property</th>
                                                <th scope="col"> Утга</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                Object.keys(feature_data)
                                                &&
                                                Object.keys(feature_data.properties).map((layer, idx) =>
                                                    <tr className="col-md-12" style={{fontSize: '12px'}} key={idx}>
                                                        <td>{idx+1}</td>
                                                        <td>{layer}</td>
                                                        <td className="font-weight-normal">
                                                            {feature_data.properties[layer]}
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col-md-6 d-inline-block">
                                <LLCMap
                                    vector_datas={feature_data?.geometry || []}
                                    height={'50vh'}
                                />
                            </div>
                        </div>
                    }
                    <div className="col-md-12 d-flex justify-content-between px-1">
                        <label className="col-md-6 fa fa-angle-double-left fa-2x text-dark btn btn-outline-primary mr-2" onClick={(e) => this.changeGeom(false)}></label>
                        <label className="col-md-6 fa fa-angle-double-right fa-2x text-dark btn btn-outline-primary" onClick={(e) => this.changeGeom(true)}></label>
                    </div>
                </div>
            </div>
        )
    }
}
