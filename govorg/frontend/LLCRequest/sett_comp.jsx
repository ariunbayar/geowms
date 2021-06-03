import React, {Component, Fragment} from "react"
import {service} from './service'
import RequestModal from './requestModal'
import {ConfigureBundle} from './configure_bundle'

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
        }
        this.handleProceed = this.handleProceed.bind(this)
        this.closeModel = this.closeModel.bind(this)
        this.getInspireTree = this.getInspireTree.bind(this)
        this.modelAction = this.modelAction.bind(this)

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
        const selected_value = parseInt(e.target.value)

        var target_data = e.target.selectedIndex
        var optionElement = e.target.childNodes[target_data]
        var selected_data_name =  optionElement.getAttribute('name')

        var value_list_of = obj => obj.id == selected_values.id
        var index_of_list = list_of_datas.findIndex(value_list_of)

        if ( name == 'theme' ) {
            seleted_datas = this.getArray(packages, selected_value)
            data_list['selected_packages'] = seleted_datas
            list_of_datas[index_of_list]['feature']['name'] = ''
            list_of_datas[index_of_list]['feature']['id'] = ''
            data_list['selected_features'] = []
        }

        else if ( name == 'package' ) {
            seleted_datas = this.getArray(features, selected_value)
            data_list['selected_features'] = seleted_datas
            list_of_datas[index_of_list]['feature']['name'] = ''
            list_of_datas[index_of_list]['feature']['id'] = ''
        }

        if (! selected_value) {
            data_list['selected_features'] = []
            list_of_datas[index_of_list]['feature']['name'] = ''
            list_of_datas[index_of_list]['feature']['id'] = ''

        }
        list_of_datas[index_of_list][name].id = selected_value
        list_of_datas[index_of_list][name].name = selected_data_name
        data_list['list_of_datas'] = list_of_datas
        this.setState({ ...data_list })
    }

    getInspireTree(){
        service.getInspireTree().then(({themes, packages, features}) => {
            this.setState({themes, packages, features})
        })
    }

    handleProceed(values) {
        this.setState({model_status: true, selected_values: values})
    }

    closeModel() {
        this.setState({ model_status: false })
    }

    componentDidMount() {
        const {id} = this.props.match.params
        service.getFilesDetal(id).then(({list_of_datas}) => {
            this.setState({list_of_datas})
        })
        this.getInspireTree()
    }

    render () {
        const { list_of_datas, model_status, selected_values} = this.state
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
                                        <th scope="col">THEME</th>
                                        <th scope="col">PACKAGE</th>
                                        <th scope="col">FEATURE</th>
                                        <th scope="col">дэдсан сонгох</th>
                                        <th scope="col"></th>
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
                                                <a className="fa fa-cog text-primary" href="#" onClick={(e) => this.handleProceed(value)}></a>
                                            </td>
                                            <td>
                                                {/* fa fa-floppy-o gp-text-primary */}
                                                <a className="fa fa-pencil-square-o gp-text-primary" href="#" onClick={(e) => this.handleProceed(value)}>
                                                </a>
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
                                {...this.state}
                                title={'Дэд сан тохируулах'}
                            />
                        }
                    </div>
                </div>
            </div>
        )
    }
}
