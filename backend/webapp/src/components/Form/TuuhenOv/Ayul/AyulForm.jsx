import React, { Component } from "react"
import {service} from '../../service'
import {NavLink} from "react-router-dom"
import AyulFormTable from "./AyulFormTable"

export class AyulForm extends Component {

    constructor(props) {

        super(props)
        this.state = {
            form_data: [{},{}],
            ayul_data: [],
            hm_utm: '',
            hm_x: 0,
            hm_y: 0,
            hm_llx: 0,
            hm_lly: 0,
            hm_llalt: 0,
            handle_save_succes_huree: false,
        }

        this.handleRemove = this.handleRemove.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.handleHureeSave = this.handleHureeSave.bind(this)
        this.hureeData = this.hureeData.bind(this)

    }

    handleInput(field, e) {
        this.setState({ [field]: e.target.value })
    }

    componentDidMount() {
        this.hureeData()
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
                this.hureeData()
            }
        })
    }


    handleHureeSave(){
        this.setState({handle_save_succes_huree:true})
        const dursgalt_id = this.props.dursgalt_id
        const {hm_utm, hm_x, hm_y, hm_llx, hm_lly, hm_llalt} = this.state
        service.ayulCreate(dursgalt_id, hm_utm, hm_x, hm_y, hm_llx, hm_lly, hm_llalt).then(({success}) => {
            
            if (success) {
                setTimeout(() => {
                    this.setState({handle_save_succes_huree:false})
                    this.hureeData()
                }, 1000)
            }
        })
    }

    render() {
        const tuuhen_ov = this.props.dursgalt_id

        return (
            <div>
                <h4>Дурсгалт газрын аюулын хамрах хүрээний солбилцол.</h4>
                <table className="table table-bordered">
                    <tr>
                        <th rowSpan="2" scope="rowgroup" scope="row">№</th>
                        <td colSpan="3">UTM</td>
                        <td colSpan="2">Latitude Longitude</td>
                        <td rowSpan="2">Alt(m)</td>
                        <td rowSpan="2">Засах</td>
                        <td rowSpan="2">Устгах</td>
                    </tr>
                    <tr>
                        <th scope="row">UTM Zone</th>
                        <th scope="row">N</th>
                        <th scope="row">E</th>
                        <th scope="row">N</th>
                        <th scope="row">E</th>
                    </tr>
                    {this.state.ayul_data.map((data, idx) =>
                            <AyulFormTable 
                                key={idx} 
                                values={data} 
                                idx={idx}
                                tuuhen_ov={tuuhen_ov}
                                handleRemove={() => this.handleRemove(data.id)}
                            ></AyulFormTable>
                        )}

                        <tr >
                            <th scope="row"></th>
                            <td scope="row">
                                <input
                                    type="number"
                                    className="form-control"
                                    id="hm_utm"
                                    onChange={(e) => this.handleInput('hm_utm', e)}
                                    value={this.state.hm_utm}
                                />
                            </td>
                            <td scope="row">
                                <input
                                    type="number"
                                    className="form-control"
                                    id="hm_x"
                                    onChange={(e) => this.handleInput('hm_x', e)}
                                    value={this.state.hm_x}
                                />
                            </td>
                            <td scope="row">
                                <input
                                    type="number"
                                    className="form-control"
                                    id="hm_y"
                                    onChange={(e) => this.handleInput('hm_y', e)}
                                    value={this.state.hm_y}
                                />
                            </td>
                            <td scope="row">
                                <input
                                    type="number"
                                    className="form-control"
                                    id="hm_llx"
                                    onChange={(e) => this.handleInput('hm_llx', e)}
                                    value={this.state.hm_llx}
                                />
                            </td>
                            <td scope="row">
                                <input
                                    type="number"
                                    className="form-control"
                                    id="hm_lly"
                                    onChange={(e) => this.handleInput('hm_lly', e)}
                                    value={this.state.hm_lly}
                                />
                            </td>
                            <td scope="row">
                                <input
                                    type="number"
                                    className="form-control"
                                    id="hm_llalt"
                                    onChange={(e) => this.handleInput('hm_llalt', e)}
                                    value={this.state.hm_llalt}
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
                            </td>
                        </tr>

                </table>
            </div>
        )
    }
}
