import React, { Component } from "react"

import {service} from '../service'
import Modal from "@utils/Modal/Modal"


export default class AyulFormTable extends Component {

    constructor(props) {
        super(props)

        this.state = {
            id: props.values.id,
            x: 0,
            y: 0,
            disable: false,
            save_is_load: false,
            save_is_error: false,

            modal_status: 'closed'
        }

        this.handleModalDeleteOpen = this.handleModalDeleteOpen.bind(this)
        this.updateData = this.updateData.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleInput = this.handleInput.bind(this)

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
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }


    componentDidUpdate(prevProps){
        if(prevProps.values !== this.props.values) {
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
            const {x, y, id} = this.state
            if(x == 0 || y==0){
                this.setState({save_is_error:true, save_is_load: false})
            }
            else if(x == null || y==null){
                this.setState({save_is_error:true, save_is_load: false})
            }
            else{
                service.ayulUpdate(tuuhen_ov, x, y, id).then(({success}) => {
                    if (success) {
                        setTimeout(() => {
                            this.props.loadAyuulRows()
                            this.setState({disable: false, save_is_load: false, save_is_error:false})
                        }, 1000)
                    }
                })
            }
        }
        else
        {
            this.setState({disable: true})
        }
    }

    render() {
        const idx = this.props.idx
        return (
            <tr key={idx}>
                <th scope="row">{idx+1}</th>
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
                <td>
                {this.state.disable ?
                    (this.state.save_is_load ?
                        <a className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                        </a>:
                        <a onClick={this.handleSubmit} data-toggle="tooltip" data-placement="top" title="Хадгалах">
                            <i className="fa fa-floppy-o" aria-hidden="true"></i>
                        </a>
                    ):
                    <a onClick={this.handleSubmit} data-toggle="tooltip" data-placement="top" title="Засах">
                        <i className="fa fa-pencil-square-o text-success" aria-hidden="true"></i>
                    </a>

                    }
                    <br></br>
                    {this.state.save_is_error ? <a className="text-danger">Хоосон байж болохгүй</a> : null}
                </td>
                {
                    <td>
                        <a onClick={this.handleModalDeleteOpen}>
                            <i className="fa fa-trash-o text-danger" aria-hidden="true"></i>
                        </a>
                        <Modal
                            modal_status={this.state.modal_status}
                            modal_icon='fa fa-exclamation-circle'
                            icon_color='warning'
                            title='Тохиргоог устгах'
                            has_button={true}
                            text={`Та "${this.state.y}", "${this.state.y}" координатыг устгахдаа итгэлтэй байна уу?`}
                            modalAction={this.props.handleRemove}
                            actionNameDelete="Устгах"
                        />
                    </td>
                }
            </tr>
        )
    }
}
