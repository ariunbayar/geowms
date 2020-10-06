
import React, { Component } from "react"
import {service} from './service'
import GisForm from './BundleGisForm'
import BundleGisAdminRights from './BundleGisAdminRights'

export class BunleGisForms extends Component {

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
            gis_options:[],
            form_values: {...this.initial_form_values},
            gis_list: [],

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

        service.detail(id).then(({bundle_list, form_options, form_options_role, gis_options}) => {
            {bundle_list.map((bundle_list) =>
                this.setState({form_values: bundle_list, gis_options})
            )}
            this.setState({form_options, form_options_role, gis_options})

        })

        service.table_list_All().then(({items}) => {
            if(items){
             this.setState({
                gis_list:items
             })   
            }
        })

    }

    handleSaveSuccess() {
        this.handleListUpdated()
    }

    handleSave(values) {

        if (values.id) {

            service.updateGis(values).then(({success, item}) => {
                if (success) this.handleSaveSuccess()
            })

        } else {

            service.create_gis(values).then(({success, item}) => {
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
            <div className="row">
                <div className="col-lg-12">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="card">
                                <div className="card-body">
                                    <GisForm
                                        handleSave={this.handleSave}
                                        gis_list = {this.state.gis_list}
                                        values={this.state.form_values}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="card">
                                <div className="card-body">
                                    <BundleGisAdminRights
                                        handleSave={this.handleSave}
                                        gis_options={this.state.gis_options}
                                        formOptionsRole={this.state.form_options_role}
                                        values={this.state.form_values}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
