import React, {Component, Fragment} from "react"
import {service} from './service'
import SelectField from '@utils/Tools/Form/select_field'
import {LLCMap} from '../../../llc/frontend/LLCMap'

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
            feature_name: props.selected_values.feature.id,
            theme_name: props.selected_values.theme.id,
            package_name: props.selected_values.package.id,
            selected_packages: props.selected_packages,
            selected_features: props.selected_features,
            selected_dt_list: [],
            data_type_list: [],
            is_loading: false,
        }
        this.handleChange = this.handleChange.bind(this)
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
        const { is_loading, themes, selected_features,
            selected_packages
        } = this.state
        const {selected_values} = this.props
        const { theme, feature } = selected_values
        return (
            <div className="col-md-12">
                <div className="form-row col-md-12 p-4 mx-1">
                        <SelectField
                            title_name='theme'
                            data_list={themes}
                            defualt_value={theme?.id || ''}
                            handleSelectField={this.handleChange}
                        />
                        <SelectField
                            title_name='package'
                            data_list={selected_packages}
                            defualt_value={selected_values.package?.id || ''}
                            handleSelectField={this.handleChange}
                        />
                        <SelectField
                            title_name='feature'
                            data_list={selected_features}
                            defualt_value={feature?.id || ''}
                            handleSelectField={this.handleChange}
                        />
                </div>
                <div className="col-md-12 pb-5 mt-2">
                    <LLCMap
                        vector_datas={selected_values.features}
                        height={'60vh'}
                    />
                </div>
            </div>
        )
    }
}
