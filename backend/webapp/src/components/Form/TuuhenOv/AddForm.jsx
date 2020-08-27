import React, { Component } from "react"
import DursgaltGazarTable from './DursgaltGazarTable'
import {NavLink} from "react-router-dom"
import {service} from '../service'

export class AddForm extends Component {

    constructor(props) {

        super(props)
        this.state = {
            form_data: [{},{}],
            huree_data: [],
            ayul_data: [],
            hm_utm: '',
            hm_x: 0,
            hm_y: 0,
            hm_llx: 0,
            hm_lly: 0,
            hm_llalt: 0,

            ayul_utm: '',
            ayul_x: 0,
            ayul_y: 0,
            ayul_llx: 0,
            ayul_lly: 0,
            ayul_llalt: 0,


            handle_save_succes: false
        }

        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.handleHureeSave = this.handleHureeSave.bind(this)
        this.handleAyulSave = this.handleAyulSave.bind(this)
        this.hureeData = this.hureeData.bind(this)
        this.ayulData = this.ayulData.bind(this)

    }

    handleInput(field, e) {
        this.setState({ [field]: e.target.value })
    }

    componentDidMount() {
        this.handleListUpdated()
        this.hureeData()
        this.ayulData()
    }

    hureeData(){
        const id = this.props.match.params.id

        service.hureeAll(id).then(({huree_data}) => {
                this.setState({huree_data})
        })
    }

    ayulData(){
        const id = this.props.match.params.id

        service.ayulAll(id).then(({ayul_data}) => {
            this.setState({ayul_data})
        })
    }

    handleListUpdated() {
        const id = this.props.match.params.id
        alert(id)
        service.dursgaltGazarAll(id).then(({form_data}) => {
            alert(form_data)
            this.setState({form_data})
        })

    }

    handleRemove(id) {
        service.dursgaltGazarRemove(id).then(({success}) => {
            if (success) this.handleListUpdated()
        })
    }
    handleHureeSave(){
        this.setState({handle_save_succes:false})
        const id = this.props.match.params.id

        const {hm_utm, hm_x, hm_y, hm_llx, hm_lly, hm_llalt} = this.state
        service.hureeCreate(id, hm_utm, hm_x, hm_y, hm_llx, hm_lly, hm_llalt).then(({success}) => {
            if (success) {
                setTimeout(() => {
                    this.setState({handle_save_succes:false})
                    this.hureeData()

                }, 1000)
            }
        })
    }

    handleAyulSave(){
        this.setState({handle_save_succes:false})
        const id = this.props.match.params.id

        const {ayul_utm, ayul_x, ayul_y, ayul_llx, ayul_lly, ayul_llalt} = this.state
        service.ayulCreate(id, ayul_utm, ayul_x, ayul_y, ayul_llx, ayul_lly, ayul_llalt).then(({success}) => {
            if (success) {
                setTimeout(() => {
                    this.setState({handle_save_succes:false})
                    this.ayulData()

                }, 1000)
            }
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
                            <NavLink className="btn gp-btn-primary" to={`/back/froms/tuuhen-ov/dursgalt-gazar/`}>
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
                            {this.state.huree_data.map((data, idx) =>
                                    <tr key={idx}>
                                        <th scope="row">{idx+1}</th>
                                        <td scope="row">
                                            {data.utm}
                                        </td>
                                        <td scope="row">
                                        {data.utmx}
                                        </td>
                                        <td scope="row">
                                        {data.utmy}
                                        </td>
                                        <td scope="row">
                                        {data.x}
                                        </td>
                                        <td scope="row">
                                        {data.y}
                                        </td>
                                        <td scope="row">
                                        {data.alt}
                                        </td>
                                    </tr>
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
                                    </tr>
                                <tr>
                                    <td colSpan="7" scope="rowgroup" scope="row" className="text-center text-primary" style={{fontSize: "20px"}}>
                                        <i onClick={this.handleHureeSave} className="fa fa-plus btn btn-outline-primary rounded-circle" aria-hidden="true"></i>
                                    </td>
                                </tr>

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
                            {this.state.ayul_data.map((data, idx) =>
                                    <tr key={idx}>
                                        <th scope="row">{idx+1}</th>
                                        <td scope="row">
                                            {data.utm}
                                        </td>
                                        <td scope="row">
                                        {data.utmx}
                                        </td>
                                        <td scope="row">
                                        {data.utmy}
                                        </td>
                                        <td scope="row">
                                        {data.x}
                                        </td>
                                        <td scope="row">
                                        {data.y}
                                        </td>
                                        <td scope="row">
                                        {data.alt}
                                        </td>
                                    </tr>
                                )}

                                    <tr >
                                        <th scope="row"></th>
                                        <td scope="row">
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="ayul_utm"
                                                onChange={(e) => this.handleInput('ayul_utm', e)}
                                                value={this.state.ayul_utm}
                                            />
                                        </td>
                                        <td scope="row">
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="ayul_x"
                                                onChange={(e) => this.handleInput('ayul_x', e)}
                                                value={this.state.ayul_x}
                                            />
                                        </td>
                                        <td scope="row">
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="ayul_y"
                                                onChange={(e) => this.handleInput('ayul_y', e)}
                                                value={this.state.ayul_y}
                                            />
                                        </td>
                                        <td scope="row">
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="ayul_llx"
                                                onChange={(e) => this.handleInput('ayul_llx', e)}
                                                value={this.state.ayul_llx}
                                            />
                                        </td>
                                        <td scope="row">
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="ayul_lly"
                                                onChange={(e) => this.handleInput('ayul_lly', e)}
                                                value={this.state.ayul_lly}
                                            />
                                        </td>
                                        <td scope="row">
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="ayul_llalt"
                                                onChange={(e) => this.handleInput('ayul_llalt', e)}
                                                value={this.state.ayul_llalt}
                                            />
                                        </td>
                                    </tr>
                                <tr>
                                    <td colSpan="7" scope="rowgroup" scope="row" className="text-center text-primary" style={{fontSize: "20px"}}>
                                        <i onClick={this.handleAyulSave} className="fa fa-plus btn btn-outline-primary rounded-circle" aria-hidden="true"></i>
                                    </td>
                                </tr>

                         </table>

                       

                    </div>
                </div>
            </div>
        )
    }
}
