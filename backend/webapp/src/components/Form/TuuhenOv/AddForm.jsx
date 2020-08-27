import React, { Component } from "react"
import DursgaltGazarTable from './DursgaltGazarTable'
import {NavLink} from "react-router-dom"
import {service} from '../service'

export class AddForm extends Component {

    constructor(props) {

        super(props)
        this.state = {
            form_data: [{},{}],
        }

        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
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
        return (
            <div  className="container my-4">
                <div className="row">

                    <div className="col-md-12">
                        <div className="text-right">
                            <a href="#" className="btn gp-outline-primary" onClick={this.props.history.goBack}>
                                <i className="fa fa-angle-double-left"></i> Буцах
                            </a>
                            <NavLink className="btn gp-btn-primary" to={`/back/froms/dursgalt-gazar/add/`}>
                                Нэмэх
                            </NavLink>
                        </div>
                        <h2>СОЁЛЫН ҮЛ ХӨДЛӨХ ДУРСГАЛЫН ҮЗЛЭГ, ТООЛЛОГЫН ХЭЭРИЙН БҮРТГЭЛ</h2>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col"> № </th>
                                    <th scope="col">Дурсгалт газрын нэр</th>
                                    <th scope="col">Чулуулгын төрөл</th>
                                    <th scope="col">Geom</th>
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
                                        values={values}
                                        handleRemove={() => this.handleRemove(values.id)}
                                        handleMove={this.handleMove}
                                        
                                    />
                                )}
                            </tbody>
                        </table>
                        <table className="table table-bordered">
                            <tr>
                                <th rowSpan="20" scope="rowgroup" scope="row" style={{width: "10%"}}>Дурсгалт газрын хамрах хүрээний солбилцол.</th>
                                <th rowSpan="2" scope="rowgroup" scope="row">№</th>
                                <td colSpan="3">UTM</td>
                                <td colSpan="2">Latitude Longitude</td>
                                <td rowSpan="2">Alt(m)</td>
                                <th rowSpan="20" scope="rowgroup" style={{width: "20%"}}>Хэрэв тухайн газар том талбайг хамран оршиж байгаа бол дурсгалын хамрах хүрээг заавал тогтоох бөгөөд энэхүү хамрах хүрээний цэгүүдийн Солбилцлыг дарааллын дагуу бичнэ.</th>
                            </tr>
                            <tr>
                                <th scope="row">UTM Zone</th>
                                <th scope="row">N</th>
                                <th scope="row">E</th>
                                <th scope="row">N</th>
                                <th scope="row">E</th>
                            </tr>
                            {dg_hamrah_huree_solbiltsol.map((data, idx) =>
                                <tr key={idx}>
                                    <th scope="row">{idx+1}</th>
                                    <td scope="row">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="dg_hamrah_huree_solbiltsolutm"
                                            onChange={(e) => this.handleInput('dg_hamrah_huree_solbiltsolutm', e)}
                                            value={this.state.dg_hamrah_huree_solbiltsolutm}
                                        />
                                    </td>
                                    <td scope="row">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="dg_hamrah_huree_solbiltsolx"
                                            onChange={(e) => this.handleInput('dg_hamrah_huree_solbiltsolx', e)}
                                            value={this.state.dg_hamrah_huree_solbiltsolx}
                                        />
                                    </td>
                                    <td scope="row">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="dg_hamrah_huree_solbiltsoly"
                                            onChange={(e) => this.handleInput('dg_hamrah_huree_solbiltsoly', e)}
                                            value={this.state.dg_hamrah_huree_solbiltsoly}
                                        />
                                    </td>
                                    <td scope="row">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="dg_hamrah_huree_solbiltsolllx"
                                            onChange={(e) => this.handleInput('dg_hamrah_huree_solbiltsolllx', e)}
                                            value={this.state.dg_hamrah_huree_solbiltsolllx}
                                        />
                                    </td>
                                    <td scope="row">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="dg_hamrah_huree_solbiltsollly"
                                            onChange={(e) => this.handleInput('dg_hamrah_huree_solbiltsollly', e)}
                                            value={this.state.dg_hamrah_huree_solbiltsollly}
                                        />
                                    </td>
                                    <td scope="row">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="dg_hamrah_huree_solbiltsolllalt"
                                            onChange={(e) => this.handleInput('dg_hamrah_huree_solbiltsolllalt', e)}
                                            value={this.state.dg_hamrah_huree_solbiltsolllalt}
                                        />
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <td colSpan="7" scope="rowgroup" scope="row" className="text-center text-primary" style={{fontSize: "20px"}}>
                                    <i onClick={this.rowPlusHuree} className="fa fa-plus btn btn-outline-primary rounded-circle" aria-hidden="true"></i>
                                </td>
                            </tr>

                        </table>

                       

                    </div>
                </div>
            </div>
        )
    }
}
