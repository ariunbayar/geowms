import React, { Component } from "react"
import Modal from "../../../Modal"
import {service} from '../../service'

export default class AyulFormTable extends Component {

    constructor(props) {
        super(props)

        this.state = {
            id: props.values.id,
            hm_utm:'',
            hm_x: 0,
            hm_y: 0,
            hm_llx: 0,
            hm_lly: 0,
            hm_llalt: 0,
            is_modal_delete_open: false,
            disable: false,
            save_is_load: false,

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
            hm_utm: this.props.values.utm,
            hm_x: this.props.values.utmx,
            hm_y: this.props.values.utmy,
            hm_llx: this.props.values.x,
            hm_lly: this.props.values.y,
            hm_llalt: this.props.values.alt,
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
                hm_utm: this.props.values.utm,
                hm_x: this.props.values.utmx,
                hm_y: this.props.values.utmy,
                hm_llx: this.props.values.x,
                hm_lly: this.props.values.y,
                hm_llalt: this.props.values.alt,
            })
        }
    }
    handleSubmit() {

        if(this.state.disable)
        {   
            this.setState({save_is_load: true})
            const tuuhen_ov = this.props.tuuhen_ov
            const {hm_utm, hm_x, hm_y, hm_llx, hm_lly, hm_llalt, id} = this.state
            console.log(hm_utm, hm_x, hm_y, hm_llx, hm_lly, hm_llalt, id, tuuhen_ov)
            service.ayulUpdate(tuuhen_ov, hm_utm, hm_x, hm_y, hm_llx, hm_lly, hm_llalt, id).then(({success}) => {
                if (success) {
                    setTimeout(() => {
                        this.setState({disable: false, save_is_load: false})
                    }, 1000)
                }
            })
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
                        id="hm_utm"
                        onChange={(e) => this.handleInput('hm_utm', e)}
                        disabled = {(this.state.disable)? "" : "disabled"}
                        value={this.state.hm_utm}
                    />
                </td>
                <td scope="row">
                    <input
                        type="number"
                        className="form-control"
                        id="hm_x"
                        onChange={(e) => this.handleInput('hm_x', e)}
                        disabled = {(this.state.disable)? "" : "disabled"}
                        value={this.state.hm_x}
                    />
                </td>
                <td scope="row">
                    <input
                        type="number"
                        className="form-control"
                        id="hm_y"
                        onChange={(e) => this.handleInput('hm_y', e)}
                        disabled = {(this.state.disable)? "" : "disabled"}
                        value={this.state.hm_y}
                    />
                </td>
                <td scope="row">
                    <input
                        type="number"
                        className="form-control"
                        id="hm_llx"
                        onChange={(e) => this.handleInput('hm_llx', e)}
                        disabled = {(this.state.disable)? "" : "disabled"}
                        value={this.state.hm_llx}
                    />
                </td>
                <td scope="row">
                    <input
                        type="number"
                        className="form-control"
                        id="hm_lly"
                        onChange={(e) => this.handleInput('hm_lly', e)}
                        disabled = {(this.state.disable)? "" : "disabled"}
                        value={this.state.hm_lly}
                    />
                </td>
                <td scope="row">
                    <input
                        type="number"
                        className="form-control"
                        id="hm_llalt"
                        onChange={(e) => this.handleInput('hm_llalt', e)}
                        disabled = {(this.state.disable)? "" : "disabled"}
                        value={this.state.hm_llalt}
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
