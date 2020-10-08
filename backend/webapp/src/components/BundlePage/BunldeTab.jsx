import React, { Component } from "react"
import {NavLink, Switch, Route, BrowserRouter} from "react-router-dom"
import {service} from './service'
import {BundleForms} from './BundleForms'
import {BunleGisForms} from './GisForms'

export class BundleTab extends Component {

    constructor(props) {

        super(props)

        this.initial_form_values = {
            id: null,
            name: '',
            price: 0,
            icon: '',
            icon_url: '',
            layers: [],
            gis_list:[]
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
        this.tablePostgis = this.tablePostgis.bind(this)
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
        this.tablePostgis()
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

    tablePostgis(){
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
        const id = this.props.match.params.id
            return (
                <BrowserRouter >
                    <div>
                    <ul className="nav nav-tabs">
                        <li className=" nav-item nav-link">
                            <NavLink activeClassName="active" to={`/back/дэд-сан/${id}/засах/wms/`}>WMS</NavLink>
                        </li>
                        <li className=" nav-item nav-link">
                            <NavLink activeClassName="active" to={`/back/дэд-сан/${id}/засах/postgis_db/`}>postgis_db</NavLink>
                        </li>
                    </ul>
                    </div>
                    <div>
                    <Switch>
                        <Route path="/back/дэд-сан/:id/засах/wms/" component={BundleForms}/>
                        <Route path="/back/дэд-сан/:id/засах/postgis_db/"  component={BunleGisForms}/>
                    </Switch>
                    </div>
             </BrowserRouter>
            );
    }
}
