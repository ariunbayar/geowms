import React, { Component } from "react"
import RequestModal from './requestModal'
import {service} from './service'


export class OrgRequestTable extends Component {

    constructor(props) {
        super(props)
        this.state={
            is_model_request_open: false,
            is_loading:false
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
        service.requestApprove(id, values).then(({ success, info })=>{
            if(success)
            {
                this.setState({ is_loading:false })
                this.props.getAll()
                this.handleRequestClose()
                this.props.modalAlertOpen(info, "success")
            }
            else
            {
                this.setState({ is_loading:false })
                this.handleRequestClose()
                this.props.modalAlertOpen(info, "warning")
            }
        }).catch((error) => {
            if(error == 'Bad Request')
            {
                this.setState({ is_loading:false })
                this.handleRequestClose()
                this.props.modalAlertOpen("Алдаа гарлаа. Обьект олдсонгүй.", "danger")
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
                {
                    state == "ШИНЭ" ? <td className="text-primary">{state}</td>:
                    state == 'ТАТГАЛЗСАН' ? <td className="text-danger">{state}</td>:
                    state == 'ЗӨВШӨӨРСӨН' ? <td className="text-success">{state}</td>:
                    state == 'ХЯНАХ' ? <td className="text-success">{state}</td>: null
                }

                {
                    kind == 'ҮҮССЭН' ? <td className="text-success">{kind}</td>:
                    kind == 'ЗАССАН' ? <td className="text-primary">{kind}</td>:
                    kind == 'ЦУЦЛАСАН' ? <td className="text-danger">{kind}</td>:
                    kind == 'УСТГАСАН' ? <td className="text-danger">{kind}</td>:
                    kind == 'ШУУД' ? <td className="text-danger">{kind}</td>: null
                }

                {
                state == "ШИНЭ" ?
                    <td>
                    <button className="btn btn-primary" onClick={this.handleRequestOpen}>
                        ШИЙДВЭРЛЭХ
                    </button>
                    {is_model_request_open &&
                        <RequestModal
                            modalClose={this.handleRequestClose}
                            modalAction={() =>this.handleRequestApprove(id)}
                            modalAlertOpen={this.props.modalAlertOpen}
                            form_json = {form_json}
                            geo_json = {geo_json}
                            title="Шийдвэрлэх"
                            kind={kind}
                            is_loading={this.state.is_loading}
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
