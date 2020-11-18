import React, { Component } from "react"
import ChangeRequestModal from './changeRequestModal'
import {service} from './service'


export class ChangeRequestTable extends Component {

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
        const {id, theme_name, package_name, feature_name, state, form_json, geo_json, employee, org, created_at, kind, order_at, order_no} = this.props.values
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
                {state==1 ? <td className="text-priamry">ШИНЭ</td>:
                state==2 ? <td className="text-danger">ТАТГАЛЗСАН</td>:
                state==3 ? <td className="text-success">ЗӨВШӨӨРСӨН</td>: null
                }

                {kind==1 ? <td className="text-success">ҮҮССЭН</td>:
                kind==2 ? <td className="text-primary">ЗАССАН</td>:
                kind==3 ? <td className="text-danger">УСТГАСАН</td>: null
                }
                {
                state ==1 ?
                    <td>
                    <button className="btn btn-primary" onClick={this.handleRequestOpen}>
                        ДЭЛГЭРЭНГҮЙ
                    </button>
                    {is_model_request_open &&
                        <ChangeRequestModal
                            modalClose={this.handleRequestClose}
                            geo_json = {geo_json}
                            form_json = {form_json}
                            title="Илгээсэн хүсэлт"
                            kind={kind}
                            id = {id}
                            getAll={this.props.getAll}
                        />
                    }
                </td>:<td></td>
                }
            </tr>
        )

    }

}
