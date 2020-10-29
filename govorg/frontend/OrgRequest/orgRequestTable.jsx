import React, { Component } from "react"
import RequestModal from './requestModal'
import {service} from './service'


export class OrgRequestTable extends Component {

    constructor(props) {
        super(props)
        this.state={
            is_model_request_open: false,
        }
        this.handleRequestOpen = this.handleRequestOpen.bind(this)
        this.handleRequestClose = this.handleRequestClose.bind(this)
        this.handleRequestApprove = this.handleRequestApprove.bind(this)
    }
    componentDidMount(){
    }
    handleRequestOpen() {
        this.setState({is_model_request_open: true})
    }

    handleRequestClose() {
        this.setState({is_model_request_open: false})
    }
    
    handleRequestApprove(id){
        const values = this.props.values
        service.requestApprove(id, values).then(({success})=>{
            if(success){
                this.handleRequestClose()
            }
        })
    }

    render() {
        const is_model_request_open = this.state.is_model_request_open
        const idx = this.props.idx
        const {id, theme_name, package_name, feature_name, state, form_json, geo_json, employee, org, created_at, kind} = this.props.values
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
                            modalAction={() =>this.handleRequestApprove(id)}
                            form_json = {form_json}
                            geo_json = {geo_json}
                            title="Шийдвэрлэх"
                            id = {id}
                        />
                    }
                </td>
                <td>
                    {state ? state : ''}
                </td>
                <td>{kind}</td>
            </tr>
        )

    }

}
