import React, {Component, Fragment} from "react"
import {service} from './service'
import Loader from "@utils/Loader/index"
import SelectField from '@utils/Tools/Form/select_field'


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
        }
        this.selectedFeature = this.selectedFeature.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleGetDetial = this.handleGetDetial.bind(this)
        // this.getInspireTree = this.getInspireTree.bind(this)
        this.getArray = this.getArray.bind(this)
        this.getFeatProperties = this.getFeatProperties.bind(this)
    }
    componentDidMount() {
        const {id} = this.state
    }

    componentDidUpdate(pP, pS) {
        const { theme_name, feature_name, packages, features, table_name} = this.state
        if (pS.feature_name != feature_name) {
            if (feature_name) this.getFeatProperties(feature_name)
            else this.setState({feature_name})
            this.setState({ id_list: [] })
        }

        if (pS.packages != packages) {
            this.setState({packages})
        }

        if (pS.features != features) {
            this.setState({features})
        }
    }

    selectedFeature(e) {
        const feature = e.selected[0]
        if (feature) {
            const { values } = this.props
            const id = feature.getProperties()['id']
            values.map((value, idx) => {
                if (value.id == id) {
                    this.setState({ form_json: value.form_json, selected_value: value })
                }
            })
        }
    }

    getFeatProperties(feature_code) {
        this.setState({ is_loading: true })
        service.pg_config.getProperties(feature_code).then(({data_type_list}) => {
            if (data_type_list && data_type_list.length > 0) {
                this.setState({ data_type_list, is_loading: false })
            }
        })
    }

    handleGetDetial( packages, features ){
        const {table_id, id} = this.state
        this.setState({ is_loading: true })
        service.pg_config.tableDetail(id, table_id).then(({success, form_datas}) => {
            if(success){
                form_datas['selected_packages'] = this.getArray(packages, form_datas.theme_name)
                form_datas['selected_features'] = this.getArray(features, form_datas.package_name)
                this.setState({ ...form_datas, is_loading: false })
            }
        })
    }

    // getInspireTree(id){
    //     const {table_id} = this.state
    //     service.pg_config.getInspireTree(id).then(({themes, packages, features}) => {
    //         this.setState({themes, packages, features})
    //         if(table_id) this.handleGetDetial(packages, features)
    //     })
    // }

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
                data_list['id_list'] = []

            }
            else {
                data_list['feature_name'] = ''
                data_list['id_list'] = []
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
            selected_packages} = this.state

        return (
            <div className="card">
                <div className="card-body">
                    <div className="col-md-12">
                        {/* <div className="col-md-12">
                            <div className='form-row'>
                                <div className='col-md-3 '>
                                </div>
                                <div className='form-group col-md-9'>
                                    <div className='row'>
                                            <span
                                                className="col-md-4 border rounded"
                                                name='inspire_property'
                                            >
                                                Theme
                                            </span>
                                            <span
                                                className="col-md-4 border rounded"
                                                name='inspire_property'
                                            >
                                                Package
                                            </span>
                                            <span
                                                className="col-md-4 border rounded"
                                                name='inspire_property'
                                            >
                                                Feature
                                            </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr /> */}
                        <div className="form-row mr-3">
                            <div className='form-group col-md-3 align-self-center text-center px-2 '>
                                <b className="text-wrap">Point</b><br/>
                            </div>
                            <div className='form-group col-md-9'>
                                <div className="row">
                                    <SelectField
                                        title_name='theme'
                                        data_list={themes}
                                        defualt_value={theme_name}
                                        setSelect={this.handleChange}
                                    />
                                    <SelectField
                                        title_name='package'
                                        data_list={selected_packages}
                                        defualt_value={package_name}
                                        setSelect={this.handleChange}
                                    />
                                    <SelectField
                                        title_name='feature'
                                        data_list={selected_features}
                                        defualt_value={feature_name}
                                        setSelect={this.handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <Loader is_loading={is_loading} text={'Хүсэлтийг шалгаж байна түр хүлээнэ үү...'} />
                    </div>
                </div>
            </div>
        )
    }
}
