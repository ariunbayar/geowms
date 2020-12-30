import React, { Component } from "react"
import {service} from './service'
import { RequestMap } from './Map'

export class RevokeRequestTable extends Component {

    constructor(props) {
        super(props)
        this.state={
            is_model_request_open: false,
        }
        this.handleRequestOpen = this.handleRequestOpen.bind(this)
        this.handleRequestClose = this.handleRequestClose.bind(this)
        this.stateButton = this.stateButton.bind(this)
    }

    handleRequestOpen() {
        this.setState({ is_model_request_open: true })
    }

    handleRequestClose() {
        this.setState({ is_model_request_open: false })
    }

    stateButton(id, state) {
        this.handleRequestClose()
        this.props.setLoading()
        service
            .revokeState(id, state)
            .then(({ success }) => {
                if (success) {
                    this.props.paginate(1, '')
                }
            })
    }

    render() {
        const { is_model_request_open } = this.state
        const { idx } = this.props
        const {
            last_name,
            first_name,
            theme_name,
            package_name,
            feature_name,
            org,
            created_at,
            order_at,
            old_geo_id,
            order_no,
            state
        } = this.props.values
        return (
            <tr>
                <td>
                    {idx}
                </td>
                <td>
                    {theme_name + '/'+ package_name + '/' +feature_name}
                </td>
                <td>
                    {org+'/'+last_name.charAt(0).toUpperCase() + '.' + first_name.charAt(0).toUpperCase() + first_name.substring(1)}
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
                <td className={state == 'ЗӨВШӨӨРСӨН' ? 'text-success' : state == 'ТАТГАЛЗСАН' ? 'text-danger' : null}>
                    {state}
                </td>
                <td>
                    <button className="btn gp-btn-primary" onClick={() => this.handleRequestOpen()}>Шийдвэрлэх</button>
                    {
                        is_model_request_open
                        ?
                            <RequestMap
                                handleRequestClose={this.handleRequestClose}
                                geoJson={geo_json}
                                geom_name={old_geo_id}
                                form_json={form_json}
                                id={id}
                                stateButton={this.stateButton}
                            />
                        :
                            null
                    }
                </td>
            </tr>
        )
    }
}