import React, { Component } from "react"
import {service} from './service'


export class RevokeRequestTable extends Component {

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
                this.props.getAll()
                this.handleRequestClose()
            }
        })
    }

    render() {
        const is_model_request_open = this.state.is_model_request_open
        const idx = this.props.idx
        const {
            id,
            theme_name,
            package_name,
            feature_name,
            state,
            form_json,
            geo_json,
            employee,
            org,
            created_at,
            kind,
            order_at,
            order_no
          } = this.props.values
        return (
            <tr>
                <td>
                    {idx + 1}
                </td>
                <td>
                    {theme_name + '/'+ package_name + '/' +feature_name}
                </td>
                <td>
                    {org+'/'+employee}
                </td>
                <td>
                    {order_no}
                </td>
                <td>
                    {order_at}
                </td>
                <td>
                    {created_at}
                </td>
            </tr>
        )

    }

}
