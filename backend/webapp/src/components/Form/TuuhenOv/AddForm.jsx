import React, { Component } from "react"
import DursgaltGazarTable from './DursgaltGazarTable'
import {NavLink} from "react-router-dom"
import {service} from '../service'
import {HureeForm} from './Huree/HureeForm'
import {AyulForm} from './Ayul/AyulForm'
import BundleMap from '../../map/BundleMap'

export class AddForm extends Component {

    constructor(props) {

        super(props)
        this.state = {
            form_data: [],
            ayul_data: [],
            handle_save_succes_ayul: false,
            huree_len: 0,
            x: '',
            y: '',
        }

        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.hureeTooShirheg = this.hureeTooShirheg.bind(this)
        this.handleXY = this.handleXY.bind(this)
    }

    handleXY(values, info){
        console.log(values)
        this.setState({x:values[0], y:values[1]})
    }

    handleInput(field, e) {
        this.setState({ [field]: e.target.value })
    }

    componentDidMount() {
        this.handleListUpdated()
        this.hureeTooShirheg()
    }

    handleListUpdated() {
        const id = this.props.match.params.id
        service.dursgaltGazarAll(id).then(({form_data}) => {
            this.setState({form_data})
        })
    }

    hureeTooShirheg() {
        const id = this.props.match.params.id
        service.about(id).then(({tuuh_soyl}) => {
            if(tuuh_soyl){
                tuuh_soyl.map((tuuh) => 
                    this.setState({
                        huree_len: tuuh['too_shirheg'], 
                    })
                )
            }
        })
    }

    handleRemove(id) {
        service.dursgaltGazarRemove(id).then(({success}) => {
            if (success) this.handleListUpdated()
        })
    }

    render() {
        const dursgalt_id = this.props.match.params.id
        const huree_len = this.state.huree_len
        const huree_components = []
        for(var i=1; i<=huree_len; i++)
        {
            huree_components.push(<HureeForm dursgalt_id={dursgalt_id} tuuh_soyl_huree_id={i} x={this.state.x} y={this.state.y}></HureeForm>)
        }
        return (
            <div  className="container my-4">
                <div className="row">
                    <BundleMap
                        handleXY={this.handleXY}
                        coordinatCheck={true}
                    />
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

                        <h4>Дурсгалт газрын хамрах хүрээний солбилцол.</h4>
                        {huree_components}
                        <AyulForm 
                            dursgalt_id={dursgalt_id}
                            x={this.state.x}
                            y={this.state.y}
                        >
                        </AyulForm>
                         

                       

                    </div>
                </div>
            </div>
        )
    }
}
