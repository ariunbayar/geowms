import React, { Component } from 'react';
import { service } from '../service';
import BackButton from "@utils/Button/BackButton"
import SelectField from './selectField'

export default class  PgForm extends Component {

    constructor(props) {
        super(props);
        this.over_dec = []
        this.state = {
            id: props.match.params.id,
            table_id: props.match.params.table_id,
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
            data_type_list: []
        }

        this.handleChange = this.handleChange.bind(this)
        this.getInspireTree = this.getInspireTree.bind(this)
        this.getFeatProperties = this.getFeatProperties.bind(this)
        this.handleSetField = this.handleSetField.bind(this)
        // this.handleSave = this.handleSave.bind(this)
    }

    componentDidMount(){
        const {id, table_id} = this.state
        // if(table_id) this.handleGetDetial(id, table_id)
        this.getInspireTree(id)
    }

    handleGetDetial(id, table_id){
        service.pg_config.tableDetail(id, table_id).then(({success, form_datas}) => {
            if(success){
                this.setState({
                    table_name: form_datas.table_name,
                    view_name: form_datas.feature_code,
                    matched_feilds: form_datas.field_config,
                    view_fields: form_datas.view_fields,
                    table_fields: form_datas.table_field_names
                })
            }
        })
    }

    getInspireTree(id){
        service.pg_config.getInspireTree(id).then(({themes, packages, features}) => {
            this.setState({themes, packages, features})
        })
    }

    getTableFields(name, value){
        const {id} = this.state
        service.pg_config.fieldNames(id, name, value).then(({state_name, table_fields}) => {
            var fields = {}
            fields[state_name] = table_fields
            this.setState({ ...fields })
        })
    }

    handleChange(name, e) {
        const { packages, features } = this.state
        const selected_value = e.target.value
        var data_list = {}
        var seleted_datas = []
        var array = []

        if ( name == 'theme' ) {
            data_list['theme_name'] = selected_value
            array = [...packages]
            seleted_datas = array.filter((data) => data.parent == selected_value)
            data_list['selected_packages'] = seleted_datas
        }

        else if ( name == 'package' ) {
            if (selected_value) {
                data_list['package_name'] = selected_value
                array = [...features]
                seleted_datas = array.filter((data) => data.parent == selected_value)
                data_list['selected_features'] = seleted_datas
            }
            else {
                data_list['feature_name'] = ''
            }
        }
        else {
            data_list['feature_name'] = selected_value
        }

        this.setState({...data_list})
    }

    componentDidUpdate(pP, pS) {
        const { theme_name, feature_name } = this.state
        if (pS.theme_name != theme_name) {
            this.setState({selected_features: [], feature_name: ''})
        }
        if (pS.feature_name != feature_name) {
            if (feature_name) this.getFeatProperties(feature_name)
            else this.setState({feature_name})
        }
    }

    getFeatProperties(feature_code) {
        service.pg_config.getProperties(feature_code).then(({data_type_list}) => {
            if (data_type_list && data_type_list.length > 0) {
                this.setState({data_type_list})
            }
        })
    }

    handleSave(){
        const {id, table_id, matched_feilds, view_name, table_name, table_field_error} = this.state
        if (! table_field_error.length >0 && ! this.over_dec.length > 0){
            service.pg_config.tableSave(id, table_id, matched_feilds, view_name, table_name).then(({success}) => {
                if(success){
                    alert("Амжилттай хадгаллаа.")
                    this.props.history.push(`/back/db-export/connection/pg/${id}/tables/`)
                }
            })
        }
    }

    handleSetField(e){
        console.log(e)
    }


    render() {
        const {
            table_id, id,
            themes, theme_name, package_name,
            feature_name, selected_features,
            selected_packages, data_type_list
        } = this.state
        return (
            <div className="card">
                <div className="form-row card-body p-4 mx-1">
                    <div className="form-group col-md-4">
                        <label htmlFor="id_view_name">Хүснэгтийн нэр</label>
                        <input
                            className='form-control'
                        />
                    </div>
                </div>
                <div className="form-row col-md-12 p-4 mx-1">
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
              { feature_name &&
                <div className="col-md-9 px-3">
                        <table className="table table-bordered m-1">
                            <thead>
                                <tr>
                                    <th className="text-center" style={{width: "15%"}}>
                                        Data <br/>type
                                    </th>
                                    <th className="text-center" style={{width: "5%"}}>
                                    </th>
                                    <th className="text-center" style={{width: "30%"}}>
                                        Property
                                    </th>
                                </tr>
                                {data_type_list.map((data_type, idx) =>
                                    <>
                                        <tr key={idx}>
                                            <th rowSpan={data_type.properties.length +1}
                                                className="text-wrap align-middle text-justify m-2"
                                            >
                                                <span className="text-center align-middle">({data_type.data_type_name})</span><br/>
                                                <span className="text-center align-middle">{data_type.data_type_eng}</span><br/>
                                                <span className="text-justify text-muted align-middle"><small>{data_type.data_type_definition}</small></span>
                                            </th>
                                        </tr>
                                        {data_type.properties.map((property, idx) =>
                                            <>
                                                <tr key={idx}>
                                                    <th>
                                                        <div className="icheck-primary justify-content-center">
                                                            <input
                                                                // id={data_type_config.property_name}
                                                                type="checkbox"
                                                                // checked={id_list.indexOf(data_type_config.property_id) > -1}
                                                                // onChange={this.handleInput}
                                                                value={property.property_id}
                                                            />
                                                            <label htmlFor={property.property_name}></label>
                                                        </div>
                                                    </th>
                                                    <th>
                                                        <label
                                                            htmlFor={property.property_name}
                                                            data-toggle="tooltip" data-placement="right" title={property.property_definition}
                                                        >
                                                            {property.property_name}
                                                        </label>
                                                    </th>
                                                </tr>
                                            </>
                                        )}
                                    </>
                                )}
                            </thead>
                        </table>
                    </div>
                }
                <BackButton
                    {...this.props}
                    name={'Буцах'}
                    navlink_url={`/back/db-export/connection/pg/${id}/tables/`}
                />
            </div>
        );
    }
}

