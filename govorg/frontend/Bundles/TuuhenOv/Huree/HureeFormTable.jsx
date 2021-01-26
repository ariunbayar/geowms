import React, { Component } from "react"
import {service} from '../service'
import Modal from "@utils/Modal/Modal"


export default class HureeFormTable extends Component {

    constructor(props) {
        super(props)

        this.state = {
            id: props.values.id,
            x: 0,
            y: 0,
            is_modal_delete_open: false,
            tuuh_soyl_huree_id: props.tuuh_soyl_huree_id,
            disable: false,
            save_is_load: false,
            save_is_error: false,
            perms: this.props.perms,
            is_editable : this.props.is_editable,
            modal_alert_status: 'closed',
            timer: null
        }

        this.handleModalDeleteOpen = this.handleModalDeleteOpen.bind(this)
        this.handleModalDeleteClose = this.handleModalDeleteClose.bind(this)
        this.updateData = this.updateData.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)

    }
    handleInput(field, e) {
        this.setState({ [field]: e.target.value })
    }
    componentDidMount(){
        this.updateData()
    }

    updateData(){
        this.setState({
            id: this.props.values.id,
            x: this.props.values.x,
            y: this.props.values.y,
        })
    }

    handleModalDeleteOpen(event) {
        event.preventDefault()
        this.setState({is_modal_delete_open: true})
    }

    handleModalDeleteClose() {
        this.setState({is_modal_delete_open: false})
    }
    componentDidUpdate(prevProps){
        if(prevProps.values !== this.props.values) this.setState({is_modal_delete_open: false})
        if(prevProps.values !== this.props.values)
        {
            this.setState({
                id: this.props.values.id,
                x: this.props.values.x,
                y: this.props.values.y,
            })
        }
    }
    handleSubmit() {

        if(this.state.disable)
        {
            this.setState({save_is_load: true})
            const tuuhen_ov = this.props.tuuhen_ov
            const { x, y, id, tuuh_soyl_huree_id} = this.state
            if(x == 0 || y==0){
                this.setState({save_is_error:true, save_is_load: false})
            }
            else{
                service.hureeUpdate(tuuhen_ov,  x, y, id, tuuh_soyl_huree_id).then(({success}) => {
                    if (success) {
                        this.setState({modal_alert_status: 'open'})
                        this.props.loadRows()
                        this.modalCloseTime()
                    }
                })
            }
        }
        else
        {
            this.setState({disable: true})
        }
    }

    modalCloseTime() {
        this.state.timer = setTimeout(() => {
            this.setState({modal_alert_status: 'closed', disable: false, save_is_load: false, save_is_error:false})
        }, 2000)
    }

    modalClose() {
        clearTimeout(this.state.timer)
        this.setState({modal_alert_status: 'closed', disable: false, save_is_load: false, save_is_error:false})
    }

    render() {
        const idx = this.props.idx
        const { perms, is_editable } = this.state
        return (
            <tr key={idx}>
                { perms.perm_view ? <th scope="row">{idx+1}</th> : null }
                { is_editable || perms.perm_view
                    ?
                    <td scope="row">
                        <input
                            type="number"
                            className="form-control"
                            id="x"
                            onChange={(e) => this.handleInput('x', e)}
                            disabled = {(this.state.disable)? "" : "disabled"}
                            value={this.state.x}
                        />
                    </td>
                    :
                    null
                }
                { is_editable || perms.perm_view
                    ?
                    <td scope="row">
                        <input
                            type="number"
                            className="form-control"
                            id="y"
                            onChange={(e) => this.handleInput('y', e)}
                            disabled = {(this.state.disable)? "" : "disabled"}
                            value={this.state.y}
                        />
                    </td>
                    :
                    null
                }
                {
                    is_editable
                    ?
                    <td>
                        {this.state.disable ?
                        (this.state.save_is_load ?
                            <a className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </a>
                            :
                            <a onClick={this.handleSubmit} data-toggle="tooltip" data-placement="top" title="Хадгалах">
                                <i className="fa fa-floppy-o text-success" aria-hidden="true"></i>
                            </a>
                        ):
                        <a onClick={this.handleSubmit} data-toggle="tooltip" data-placement="top" title="Засах">
                            <i className="fa fa-pencil-square-o text-success" aria-hidden="true"></i>
                        </a>

                        }
                        <br></br>
                        {this.state.save_is_error ? <a className="text-danger">Хоосон байж болохгүй</a> : null}
                    </td>
                    :
                    null
                }
                {
                    perms.perm_remove
                    ?
                    <td>
                        <a onClick={this.handleModalDeleteOpen}>
                            <i className="fa fa-trash-o text-danger" aria-hidden="true"></i>
                        </a>
                        {this.state.is_modal_delete_open &&
                            <Modal
                                modalClose={this.handleModalDeleteClose}
                                modalAction={this.props.handleRemove}
                                text={`Та "${this.state.x}", "${this.state.y}" координатыг устгахдаа итгэлтэй байна уу?`}
                                title="Тохиргоог устгах"
                                model_type_icon="success"
                            />
                        }
                    </td>
                    :
                    perms.perm_remove && perms.perm_create ? null: <td rowSpan="1"></td>
                }
            </tr>
        )
    }
}
