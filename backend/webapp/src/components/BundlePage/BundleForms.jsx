import React, { Component } from "react"
import {service} from './service'
import BundleForm from './BundleForm'
import BundleAdminRights from './BundleAdminRights'

export class BundleForms extends Component {

    constructor(props) {

        super(props)

        this.initial_form_values = {
            id: null,
            name: '',
            price: 0,
            icon: '',
            icon_url: '',
            layers: [],
        }

        this.state = {
            bundle_list: [],
            form_options: [],
            form_options_role: [],
            form_values: {...this.initial_form_values}

        }

        this.handleSaveSuccess = this.handleSaveSuccess.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleListUpdated = this.handleListUpdated.bind(this)
    }

    componentDidMount() {
        this.handleListUpdated()
    }

    handleListUpdated() {
        const id = this.props.match.params.id
        if(id){
            service.detail(id).then(({bundle_list, form_options, form_options_role}) => {
                this.setState({form_values: bundle_list, form_options, form_options_role})
            })
        }else{
            service.getLayer().then(({form_options}) => {
                this.setState({form_options})
            })
        }

    }

    handleSaveSuccess() {
        this.handleListUpdated()
    }

    handleSave(values) {

        if (values.id) {

            service.update(values).then(({success}) => {
                if (success) this.handleSaveSuccess()
            })
        }
    }


    render() {
        return (
            <div className="clearfix">
               <div className="row" style={{padding:"0px",}}>
                    <div className="col-lg-4">
                        <div className="w-auto p-2 shadow-sm mb-2 bg-white rounded card">
                            <div className="card-body">
                                <BundleForm
                                    handleSave={this.handleSave}
                                    handleCancel={this.handleFormCancel}
                                    formOptions={this.state.form_options}
                                    values={this.state.form_values}
                                />
                            </div>
                        </div>
                    </div>
                    {this.props.match.params.id &&
                    <div className="col-lg-8">
                        <div className="bundle-table-scroll card">
                            <div className="card-body">
                                <BundleAdminRights
                                    handleSave={this.handleSave}
                                    formOptions={this.state.form_options}
                                    formOptionsRole={this.state.form_options_role}
                                    values={this.state.form_values}
                                />
                            </div>
                        </div>
                    </div>}
               </div>
            </div>
        )
    }
}
