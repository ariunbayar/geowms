import React, { Component } from "react"

import {service} from '../service'
import AyulFormTable from "./AyulFormTable"
import Modal from "@utils/Modal/Modal"


export class AyulForm extends Component {

    constructor(props) {

        super(props)
        this.state = {
            form_data: [],
            ayul_data: [],
            x: 0,
            y: 0,
            save_is_error: false,
            handle_save_succes_huree: false,
            modal_status: 'closed',
        }

        this.handleRemove = this.handleRemove.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.handleHureeSave = this.handleHureeSave.bind(this)
        this.hureeData = this.hureeData.bind(this)
        this.modalChange = this.modalChange.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
    }

    handleInput(field, e) {
        this.setState({ [field]: e.target.value })
    }

    componentDidMount() {
        this.hureeData()
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.x !== this.props.x)
        {
            const { x, y } = this.props
            this.setState({ x, y })
        }
    }

    hureeData(){
        service.ayulAll(this.props.dursgalt_id).then(({ayul_data}) => {
                this.setState({ayul_data})
        })
    }

    handleRemove(id) {
        const tuuhen_ov = this.props.dursgalt_id
        const ayul_id = id
        service.ayulDelete(ayul_id, tuuhen_ov).then(({success}) => {
            if(success){
                this.modalChange(
                    'fa fa-check-circle',
                    'success',
                    'Амжилттай устгалаа'
                )
                this.props.loadAyuulRows()
                this.hureeData()
            }
        })
    }

    handleHureeSave(){
        this.setState({handle_save_succes_huree:true})
        const dursgalt_id = this.props.dursgalt_id
        const {x, y} = this.state
        if(x == 0 || y==0){
            this.setState({save_is_error:true, handle_save_succes_huree: false})
        }
        else{
            service.ayulCreate(dursgalt_id, x, y).then(({success}) => {
                if (success) {
                    this.modalChange(
                        'fa fa-check-circle',
                        'success',
                        'Амжилттай нэмлээ'
                    )
                    this.props.loadAyuulRows()
                    this.hureeData()
                }
            })
        }

    }

    handleModalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    modalChange(modal_icon, icon_color, title) {
        this.setState({
            modal_icon,
            icon_color,
            title,
            handle_save_succes_huree: false,
            save_is_error:false,
        })
        this.handleModalOpen()
    }

    render() {
        const tuuhen_ov = this.props.dursgalt_id
        return (
            <div className="ml-3">
                <h4>Дурсгалт газрын аюулын хамрах хүрээний солбилцол.</h4>
                {this.state.ayul_data.length > 2 ?
                    <h6 className="text-success">Аюулын хүрээ</h6>:
                    <h6 className="text-danger">Аюулын хүрээ</h6>
                }
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th rowSpan="2" scope="rowgroup" scope="row">№</th>
                            <td colSpan="2">Latitude Longitude</td>
                            <td rowSpan="2">Засах</td>
                            <td rowSpan="2">Устгах</td>
                        </tr>
                        <tr>
                            <th scope="row">X</th>
                            <th scope="row">Y</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.ayul_data.map((data, idx) =>
                            <AyulFormTable
                                key={idx}
                                values={data}
                                idx={idx}
                                tuuhen_ov={tuuhen_ov}
                                handleRemove={() => this.handleRemove(data.id)}
                                loadAyuulRows = {() => this.props.loadAyuulRows()}
                            ></AyulFormTable>
                        )}
                        <tr >
                            <th scope="row"></th>

                            <td scope="row">
                                <input
                                    type="number"
                                    className="form-control"
                                    id="x"
                                    onChange={(e) => this.handleInput('x', e)}
                                    value={this.state.x}
                                />
                            </td>
                            <td scope="row">
                                <input
                                    type="number"
                                    className="form-control"
                                    id="y"
                                    onChange={(e) => this.handleInput('y', e)}
                                    value={this.state.y}
                                />
                            </td>
                            <td colSpan="2" scope="rowgroup" scope="row">
                                { this.state.handle_save_succes_huree ?
                                        <a className="spinner-border gp-text-primary" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </a>
                                    :
                                    <i onClick={this.handleHureeSave} className="btn btn-outline-primary " aria-hidden="true">Нэмэх</i>
                                }
                                <br></br>
                                {this.state.save_is_error ? <a className="text-danger">Хоосон байж болохгүй</a> : null}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Modal
                    modal_status={this.state.modal_status}
                    modal_icon={this.state.modal_icon}
                    icon_color={this.state.icon_color}
                    title={this.state.title}
                    text=''
                    has_button={false}
                    modalAction={null}
                />
            </div>
        )
    }
}
