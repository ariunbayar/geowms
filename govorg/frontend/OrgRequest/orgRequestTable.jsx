import React, { Component } from "react"
import RequestModal from './requestModal'


export class OrgRequestTable extends Component {

    constructor(props) {
        super(props)
        this.state={
            is_model_request_open: false,
        }
        this.handleRequestOpen = this.handleRequestOpen.bind(this)
        this.handleRequestClose = this.handleRequestClose.bind(this)
    }
    componentDidMount(){
    }
    handleRequestOpen() {
        this.setState({is_model_request_open: true})
    }

    handleRequestClose() {
        this.setState({is_model_request_open: false})
    }


    render() {
        const is_model_request_open = this.state.is_model_request_open
        const idx = this.props.idx
        const {theme_name, package_name, feature_name, state, form_json, geo_json, employee, org, created_at} = this.props.values
        return (
            <tr>
                <td>
                    {idx}
                </td>
                <td>
                    {theme_name + '/'+ package_name + '/' +feature_name}
                </td>
                <td>
                    {org+'/'+employee}
                </td>
                <td>
                    {created_at}
                </td>
                <td>
                    <button className="btn btn-primary" onClick={this.handleRequestOpen}>
                        ШИЙДВЭРЛЭХ
                    </button>
                    {is_model_request_open &&
                        <RequestModal
                            modalClose={this.handleRequestClose}
                            modalAction={this.props.handleGovorgDelete}
                            form_json = {form_json}
                            geo_json = {geo_json}
                            title="Шийдвэрлэх"
                            model_type_icon = "success"
                        />
                    }
                </td>
                <td>
                    {state}
                </td>
            </tr>
        )

    }

}
