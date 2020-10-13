import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import { service } from "./service"


export default class GisForm extends Component {

    constructor(props) {

        super(props)
        this.state = {
            id: props.values.id,
            name: props.values.name,
            gis_list:[],
            oid_list:[],

        }

        this.handleSave = this.handleSave.bind(this)
        this.handleLayerToggle = this.handleLayerToggle.bind(this)
    }

    componentDidMount(){
    }

    handleChange(field, e) {
        this.setState({[field]: e.target.value})
    }

    handleSave() {
        const {id,oid_list}=this.state
        const values ={'id':id, 'oid_list':oid_list}
        this.props.handleSave(values)
    }

    handleLayerToggle(e) {
        let oid_list = this.state.oid_list
        const value = parseInt(e.target.value)
        if (e.target.checked) {
            oid_list.push(value)
        } else {
            oid_list = oid_list.filter((oid) => oid != value)
        }       
        this.setState({oid_list})
    }


    componentDidUpdate(prevProps) {
        if (this.props.values.id !== prevProps.values.id) {
            const {id, name, oid_list} = this.props.values
            const gis_list = this.props.gis_list
            if(oid_list){
                this.setState({id, name, gis_list:gis_list, oid_list})
            }
            else{
                this.setState({id, name, gis_list:gis_list})
            }
        }
    }


    render() {
        const oid_list = this.state.oid_list
        return (    
            <>
                <div className="form-group">
                    <div className="form-group">
                        <NavLink className="btn gp-btn-primary btn-block waves-effect waves-light m-1"  to={`/back/дэд-сан/`}>
                                Буцах
                        </NavLink>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="id_name"> Сангийн нэр: </label>
                    <input
                        type="text"
                        className="form-control"
                        id="id_name"
                        placeholder="сангийн нэр"
                        onChange={(e) => this.handleChange('name', e)}
                        value={this.state.name}
                    />
                </div>
                <div>

                {this.state.gis_list.map((gis, idx) =>
                    <div key={idx}>
                        <label>
                            <input
                                type="checkbox"      
                                checked={oid_list.indexOf(gis.oid) > -1}                          
                                onChange={this.handleLayerToggle}
                                value={gis.oid}   
                            />
                            <a> {gis.tablename}</a>
                        </label>
                    </div>
                )}
                </div>

                <div className="form-group">
                    <button className="btn gp-btn-primary btn-block waves-effect waves-light m-1" onClick={this.handleSave} >
                        Хадгал
                    </button>
                </div>

                <div className="form-group">
                    <NavLink className="btn gp-btn-primary btn-block waves-effect waves-light m-1" to={`/back/дэд-сан/`}>
                            Буцах
                    </NavLink>
                </div>


                <dl>
                </dl>
            </>
        )
    }
}