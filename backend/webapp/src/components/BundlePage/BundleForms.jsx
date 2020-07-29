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
        const id = this.props.match.params.id
        if(id)
        {
            this.handleListUpdated()
        }
        else{
            const form_values = this.initial_form_values
            this.setState({form_values})
        }
    }

    handleListUpdated() {
        const id = this.props.match.params.id

        service.detail(id).then(({bundle_list, form_options, form_options_role}) => {
            {bundle_list.map((bundle_list) =>
                this.setState({form_values: bundle_list})
            )}
            this.setState({form_options, form_options_role})

        })

    }

    handleSaveSuccess() {
        this.handleListUpdated()
    }

    handleSave(values) {

        if (values.id) {

            service.update(values).then(({success, item}) => {
                if (success) this.handleSaveSuccess()
            })

        } else {

            service.create(values).then(({success, item}) => {
                if (success) this.handleSaveSuccess()
            })

        }

    }

    handleRemove(id) {
        service.remove(id).then(({success}) => {
            if (success) this.handleSaveSuccess()
        })
    }

    render() {
        return (
            <div  className="container my-4">
                <div className="row">
                    
                    <div className="col-md-12">
                            <div className="row">
                                <div className="col-4">
                                <BundleForm
                                    handleSave={this.handleSave}
                                    handleCancel={this.handleFormCancel}
                                    formOptions={this.state.form_options}
                                    values={this.state.form_values}
                                />  
                                </div>
                                <div className="col-8">
                                <BundleAdminRights
                                    handleSave={this.handleSave}
                                    formOptions={this.state.form_options}
                                    formOptionsRole={this.state.form_options_role}
                                    values={this.state.form_values}
                                />
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        )
    }
}