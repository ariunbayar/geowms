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
                this.props.getAll()
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
                    {idx + 1}
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
                {state==1 ? <td className="text-priamry">ШИНЭ</td>:
                state==2 ? <td className="text-danger">ТАТГАЛЗСАН</td>:
                state==3 ? <td className="text-success">ЗӨВШӨӨРСӨН</td>: null
                }

                {kind==1 ? <td className="text-success">ҮҮССЭН</td>:
                kind==2 ? <td className="text-primary">ЗАССАН</td>:
                kind==3 ? <td className="text-danger">УСТГАСАН</td>: null
                }
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
                            getAll={this.props.getAll}
                        />
                    }
                </td>
            </tr>
        )

    }

}
