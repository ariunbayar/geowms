import React, {Component, Fragment} from "react"
import {service} from './service'
import SelectField from '@utils/Tools/Form/select_field'
import {LLCMap} from '../../../llc/frontend/LLCMap'
import { transformWithProjections } from "ol/proj"

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
    }

    changeGeom(state){
        let geom_state_count = this.state.geom_state_count
        var feature_count = this.props.selected_values.features.length
        if(state) {
            if (geom_state_count < feature_count) {
                geom_state_count = geom_state_count +1
            }
        }
        else {
            if (geom_state_count > 0) {
                geom_state_count = geom_state_count-1
            }
        }
        this.setState({geom_state_count})
    }

    handleChange(name, e) {
        const {selected_values} = this.props
        this.props.model_action(name, e, selected_values)
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

    render () {
        const { is_loading, themes, geom_state_count
        } = this.state
        const {selected_values, selected_packages, selected_features} = this.props
        const { theme, feature } = selected_values

        return (
            <div className="col-md-12">
                <div className="container">
                    <div className="form-row col-md-12 p-4 mx-1">
                        <SelectField
                            title_name='theme'
                            data_list={themes}
                            defualt_value={theme?.id || ''}
                            handleSelectField={this.handleChange}
                        />
                        <SelectField
                            title_name='package'
                            data_list={
                                selected_values.package?.list && selected_values.package?.list.length >0
                                ? selected_values.package?.list : selected_packages
                            }
                            defualt_value={selected_values.package?.id || ''}
                            handleSelectField={this.handleChange}
                        />
                        <SelectField
                            title_name='feature'
                            data_list={
                                selected_values.feature?.list && selected_values.feature?.list.length >0
                                ? selected_values.feature?.list : selected_features
                            }
                            defualt_value={feature?.id || ''}
                            handleSelectField={this.handleChange}
                        />
                    </div>
                    <div className="p-4 mx-1">
                        <div className="col-md-12 d-flex justify-content-between">
                            <label className="col-6 fa fa-angle-double-left fa-2x text-light  btn btn-success mx-2" onClick={(e) => this.changeGeom(false)}></label>
                            <label className="col-6 fa fa-angle-double-right fa-2x text-light  btn btn-success" onClick={(e) => this.changeGeom(true)}></label>
                        </div>
                            {
                                selected_values.features
                                &&
                                <div className="col-md-12 pb-5 mt-2 px-0 mx-0 d-flex justify-content-between">
                                    <div className="col-md-6">
                                        <div className="overflow-auto" style={{maxHeight: '60vh'}}>
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
                                                        Object.keys(selected_values.features[geom_state_count].properties).map((layer, idx) =>
                                                            <tr className="col-md-12" style={{fontSize: '12px'}} key={idx}>
                                                                <td>{idx+1}</td>
                                                                <td>{layer}</td>
                                                                <td className="font-weight-normal">
                                                                    {selected_values.features[geom_state_count].properties[layer]}
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
                                            vector_datas={selected_values.features[geom_state_count]?.geometry || []}
                                            height={'60vh'}
                                        />
                                    </div>
                                </div>
                            }
                    </div>
                </div>
            </div>
        )
    }
}
