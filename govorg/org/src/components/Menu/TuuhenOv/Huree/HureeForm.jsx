import React, { Component } from "react"
import {service} from '../service'
import HureeFormTable from "./HureeFormTable"

export class HureeForm extends Component {

    constructor(props) {

        super(props)
        this.state = {
            form_data: [{},{}],
            huree_data: [],
            x: 0,
            y: 0,
            handle_save_succes_huree: false,
            save_is_error: false,
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

    componentDidUpdate(prevProps, prevState){
        if(prevProps.x !== this.props.x)
        {
            const { x, y } = this.props
            this.setState({ x, y })
        }
    }

    hureeData(){
        service.hureeAll(this.props.dursgalt_id, this.props.tuuh_soyl_huree_id).then(({huree_data}) => {
                this.setState({huree_data})
        })
    }

    handleRemove(id) {
        const tuuhen_ov = this.props.dursgalt_id
        const ayul_id = id
        const tuuh_soyl_huree_id = this.props.tuuh_soyl_huree_id
        service.hureeDelete(ayul_id, tuuhen_ov, tuuh_soyl_huree_id).then(({success}) => {
            if(success){
                this.hureeData()
            }
        })
    }


    handleHureeSave(){
        this.setState({handle_save_succes_huree:true})
        const dursgalt_id = this.props.dursgalt_id
        const tuuh_soyl_huree_id = this.props.tuuh_soyl_huree_id
        const {x, y} = this.state
        if(x == 0 || y==0){
            this.setState({save_is_error:true, handle_save_succes_huree: false})
        }
        else{
            service.hureeCreate(dursgalt_id, x, y, tuuh_soyl_huree_id).then(({success}) => {
                if (success) {
                    setTimeout(() => {
                        this.setState({handle_save_succes_huree:false, save_is_error:false})
                        this.hureeData()
                    }, 1000)
                }
            })
        }
    }

    render() {
        const tuuhen_ov = this.props.dursgalt_id
        const tuuh_soyl_huree_id = this.props.tuuh_soyl_huree_id
        return (
            <div>
                {this.state.huree_data.length > 2 ?
                    <h6 className="text-success">Хүрээ  {tuuh_soyl_huree_id}.</h6>:
                    <h6 className="text-danger">Хүрээ  {tuuh_soyl_huree_id}.</h6>
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
                    {this.state.huree_data.map((data, idx) =>
                            <HureeFormTable
                                key={idx}
                                values={data}
                                idx={idx}
                                tuuhen_ov={tuuhen_ov}
                                tuuh_soyl_huree_id={tuuh_soyl_huree_id}
                                handleRemove={() => this.handleRemove(data.id)}
                            ></HureeFormTable>
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
            </div>
        )
    }
}
