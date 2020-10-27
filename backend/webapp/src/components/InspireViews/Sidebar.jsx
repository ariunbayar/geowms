import React, { Component } from 'react'
import { service } from './service'

export default class SideBar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            show: false,
            id_list: []
        }
        this.handleInput = this.handleInput.bind(this)
        this.handleSave = this.handleSave.bind(this)
    }
    handleInput(e){
        let id_list = this.state.id_list
        const value = parseInt(e.target.value)
        if (e.target.checked) {
            id_list.push(value)
        } else {
            id_list = id_list.filter((oid) => oid != value)
        }
        this.setState({id_list})
    }

    handleSave(){
        const fid = this.props.fid
        const id_list = this.state.id_list
        service.setPropertyFields(fid, id_list).then(({success}) => {
            if(success){
            }
        })
    }

    render() {
        const {fields, fid} = this.props
        const {id_list} = this.state
        return (
            <form className={`card col-md-7`} style={{left:"10px"}}>
                <div className="card-body">
                    <h4>{fid}</h4>
                    {fields.map((property, idx) =>
                        <div key={idx}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={id_list.indexOf(property['property_id']) > -1}
                                    onChange={this.handleInput}
                                    value={property['property_id']}
                                />
                                <a> {property['property_code']}</a>
                            </label>
                        </div>
                    )}
                    <button className="btn btn-primary" onClick={this.handleSave}>submit</button>
                </div>
            </form>
        )
    }
}