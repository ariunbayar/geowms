import React, { Component } from "react"
import DursgaltGazarTable from './DursgaltGazarTable'
import {NavLink} from "react-router-dom"
import {service} from '../service'
import {HureeForm} from './Huree/HureeForm'
import {AyulForm} from './Ayul/AyulForm'

export class AddForm extends Component {

    constructor(props) {

        super(props)
        this.state = {
            form_data: [],
            ayul_data: [],
            handle_save_succes_ayul: false,
        }

        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleInput = this.handleInput.bind(this)

    }

    handleInput(field, e) {
        this.setState({ [field]: e.target.value })
    }

    componentDidMount() {
        this.handleListUpdated()
    }

    handleListUpdated() {
        const id = this.props.match.params.id
        service.dursgaltGazarAll(id).then(({form_data}) => {
            this.setState({form_data})
        })
    }

    handleRemove(id) {
        service.dursgaltGazarRemove(id).then(({success}) => {
            if (success) this.handleListUpdated()
        })
    }

    render() {
        const dursgalt_id = this.props.match.params.id
        return (
            <div  className="container my-4">
                <div className="row">

                    <div className="col-md-12">
                        <div className="text-right">
                            <a href="#" className="btn gp-outline-primary" onClick={this.props.history.goBack}>
                                <i className="fa fa-angle-double-left"></i> Буцах
                            </a>
                            <NavLink className="btn gp-btn-primary" to={`/back/froms/tuuhen-ov/dursgalt-gazar/${dursgalt_id}/`}>
                                Нэмэх
                            </NavLink>
                        </div>
                        <h4>СОЁЛЫН ҮЛ ХӨДЛӨХ ДУРСГАЛЫН ҮЗЛЭГ, ТООЛЛОГЫН ХЭЭРИЙН БҮРТГЭЛ</h4>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col"> № </th>
                                    <th scope="col">Дурсгалт газрын нэр</th>
                                    <th scope="col">Чулуулгын төрөл</th>
                                    <th scope="col">Latitude Longitude</th>
                                    <th scope="col">UTM</th>
                                    <th scope="col">type</th>
                                    <th scope="col">created_at</th>
                                    <th scope="col">Засах</th>
                                    <th scope="col">Устгах</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.form_data.map((values, idx) =>
                                    <DursgaltGazarTable
                                        key={idx}
                                        idx = {idx}
                                        dursgalt_id = {dursgalt_id}
                                        values={values}
                                        handleRemove={() => this.handleRemove(values.id)}
                                        handleMove={this.handleMove}
                                        
                                    />
                                )}
                            </tbody>
                        </table>
                        <HureeForm 
                            dursgalt_id={dursgalt_id}
                            ayulData={this.ayulData}
                        ></HureeForm>
                        <AyulForm 
                            dursgalt_id={dursgalt_id}
                            ayulData={this.ayulData}
                        >
                        </AyulForm>
                         

                       

                    </div>
                </div>
            </div>
        )
    }
}
