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
            themes: [],
            packages: [],
            features: [],
            feature_name: '',
            theme_name: '',
            package_name: '',
            selected_packages: [],
            selected_features: [],
            selected_dt_list: [],
            data_type_list: [],
            is_loading: false,
            selected_values: props.selected_values
        }
        this.handleChange = this.handleChange.bind(this)
        this.getInspireTree = this.getInspireTree.bind(this)
        this.getArray = this.getArray.bind(this)
    }
    componentDidMount() {
        this.getInspireTree()
    }

    componentDidUpdate(pP, pS) {
        const { theme_name, feature_name, packages, features, table_name} = this.state
        const { selected_values} = this.props
        if (pS.feature_name != feature_name) {
            this.props.model_action(feature_name)
        }

        if (pS.packages != packages) {
            this.setState({packages})
        }

        if (pS.features != features) {
            this.setState({features})
        }
        if (pP.selected_values != selected_values) {
            this.setState({selected_values})
        }
    }

    // handleGetDetial( packages, features ){
    //     const {table_id, id} = this.state
    //     this.setState({ is_loading: true })
    //     service.pg_config.tableDetail(id, table_id).then(({success, form_datas}) => {
    //         if(success){
    //             form_datas['selected_packages'] = this.getArray(packages, form_datas.theme_name)
    //             form_datas['selected_features'] = this.getArray(features, form_datas.package_name)
    //             this.setState({ ...form_datas, is_loading: false })
    //         }
    //     })
    // }

    getInspireTree(){
        service.getInspireTree().then(({themes, packages, features}) => {
            this.setState({themes, packages, features})
        })
    }

    getArray(data, selected_value) {
        var array = [...data]
        var seleted_datas = array.filter((data) => data.parent == selected_value)
        return seleted_datas
    }

    handleChange(name, e) {
        const { packages, features } = this.state
        const selected_value = e.target.value
        var data_list = {}
        var seleted_datas = []
        var array = []

        if ( name == 'theme' ) {
            data_list['theme_name'] = selected_value
            seleted_datas = this.getArray(packages, selected_value)
            data_list['selected_packages'] = seleted_datas
            data_list['feature_name'] = ''
            data_list['id_list'] = []
        }

        else if ( name == 'package' ) {
            if (selected_value) {
                data_list['package_name'] = selected_value
                seleted_datas = this.getArray(features, selected_value)
                data_list['selected_features'] = seleted_datas
                data_list['feature_name'] = ''

            }
            else {
                data_list['feature_name'] = ''
            }
        }
        else {
            data_list['feature_name'] = selected_value
        }

        if (! selected_value) {
            data_list['selected_features'] = []
            data_list['feature_name'] = ''
        }

        this.setState({ ...data_list })
    }

    render () {
        const { is_loading, themes,
            theme_name, package_name,
            feature_name, selected_features,
            selected_packages, selected_values
        } = this.state
        return (
            <div className="col-md-12">
                <div className="form-row col-md-12 p-4 mx-1">
                        <SelectField
                            title_name='theme'
                            data_list={themes}
                            defualt_value={theme_name}
                            handleSelectField={this.handleChange}
                        />
                        <SelectField
                            title_name='package'
                            data_list={selected_packages}
                            defualt_value={package_name}
                            handleSelectField={this.handleChange}
                        />
                        <SelectField
                            title_name='feature'
                            data_list={selected_features}
                            defualt_value={feature_name}
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
