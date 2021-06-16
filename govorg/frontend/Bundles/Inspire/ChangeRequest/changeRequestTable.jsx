import React, { Component } from "react"
import ChangeRequestModal from './changeRequestModal'

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
          order_no,
          feature_id,
          theme_id,
          old_geo_id,
          change_request_id,
          project_name,
          description,
        } = this.props.values
        return (
            <tr className="text-center">
                <td>
                    {idx + 1}
                </td>
                <td className="text-left">
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
                    state=='ШИНЭ' ? <td className="text-priamry">ШИНЭ</td>:
                    state=='ТАТГАЛЗСАН' ? <td className="text-danger">ТАТГАЛЗСАН</td>:
                    state=='ЗӨВШӨӨРСӨН' ? <td className="text-success">ЗӨВШӨӨРСӨН</td>:
                    state=='ХЯНАХ' ? <td className="gp-text-primary">ХЯНАХ</td>: null
                }
                {
                    kind=='ҮҮССЭН' ? <td className="text-success">ҮҮССЭН</td>:
                    kind=='ЗАССАН' ? <td className="text-primary">ЗАССАН</td>:
                    kind=='ЦУЦЛАСАН' ? <td className="text-danger">ЦУЦЛАСАН</td>:
                    kind=='БУЦААГДСАН' ? <td className="text-danger">БУЦААГДСАН</td>:
                    kind=='УСТГАСАН' ? <td className="text-danger">УСТГАСАН</td>: null
                }
                <td>
                    {project_name}
                </td>
                <td>
                    <button className="btn btn-primary" onClick={this.handleRequestOpen}>
                        {state == 'ХЯНАХ' ? 'ХЯНАХ' : 'ДЭЛГЭРЭНГҮЙ'}
                    </button>
                    {
                        is_model_request_open
                        &&
                            <ChangeRequestModal
                                modalClose={this.handleRequestClose}
                                geo_json={geo_json}
                                form_json={form_json}
                                title="Илгээсэн хүсэлт"
                                kind={kind}
                                id={id}
                                state={state}
                                description={description}
                                feature_id={feature_id}
                                theme_id={theme_id}
                                old_geo_id={old_geo_id}
                                change_request_id={change_request_id}
                                getAll={this.props.getAll}
                            />
                    }
                </td>
            </tr>
        )
    }
}
