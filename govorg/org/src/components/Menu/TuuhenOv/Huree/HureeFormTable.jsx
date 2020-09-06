import React, { Component } from "react"
import Modal from "../../helpers/Modal"
import {service} from '../service'

export default class HureeFormTable extends Component {

    constructor(props) {
        super(props)

        this.state = {
            id: props.values.id,
            x: 0,
            y: 0,
            is_modal_delete_open: false,
            disable: false,
            save_is_load: false,
            save_is_error: false,
        }

        this.handleModalDeleteOpen = this.handleModalDeleteOpen.bind(this)
        this.handleModalDeleteClose = this.handleModalDeleteClose.bind(this)
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
            const { x, y, id} = this.state
            if(x == 0 || y==0){
                this.setState({save_is_error:true, save_is_load: false})
            }
            else{
                service.hureeUpdate(tuuhen_ov,  x, y, id).then(({success}) => {
                    if (success) {
                        setTimeout(() => {
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
        // const values = this.props.values
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
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>:
                        <a onClick={this.handleSubmit} data-toggle="tooltip" data-placement="top" title="Хадгалах">
                            <i className="fa fa-floppy-o" aria-hidden="true"></i>
                        </a>
                    ):
                    <a onClick={this.handleSubmit} data-toggle="tooltip" data-placement="top" title="Засах">
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </a>

                    }
                    <br></br>
                    {this.state.save_is_error ? <a className="text-danger">Хоосон байж болохгүй</a> : null}
                </td>
                <td>
                    <a onClick={this.handleModalDeleteOpen}>
                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </a>
                    {this.state.is_modal_delete_open &&
                        <Modal
                            modalClose={this.handleModalDeleteClose}
                            modalAction={this.props.handleRemove}
                            text={`Та "${this.props.values.id}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`}
                            title="Тохиргоог устгах"
                        />
                    }
                </td>
            </tr>
        )
    }
}
