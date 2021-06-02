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
            theme_state: false
        }
        this.handleProceed = this.handleProceed.bind(this)
        this.closeModel = this.closeModel.bind(this)
        this.modelAction = this.modelAction.bind(this)
        this.getInspireTree = this.getInspireTree.bind(this)

    }


    getInspireTree(){
        service.getInspireTree().then(({themes, packages, features}) => {
            this.setState({themes, packages, features})
        })
    }

    modelAction(values) {
        var {list_of_datas, theme_state} = this.state
        var key = values.key
        var value_list_of = obj => obj.id == values.selected_values.id
        var index_of_list = list_of_datas.findIndex(value_list_of)

        list_of_datas[index_of_list][key] = values.selected_ins

        this.setState({list_of_datas})
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
                                                {value.theme}
                                            </td>
                                            <td>
                                                {value.package}
                                            </td>
                                            <td>
                                                {value.feature}
                                            </td>
                                            <td scope='row'>
                                                <a className="btn btn-primary" href="#" onClick={(e) => this.handleProceed(value)}>inspire тохиргоо</a>
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
