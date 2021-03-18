import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"
import {service} from './service'


export default class Attributes extends Component {

    constructor(props) {
        super(props)
        this.state = {
            checked_array: []
            
        }
        this.setAttribute = this.setAttribute.bind(this)
        this.handleSave = this.handleSave.bind(this)
    }


    setAttribute(e, id, name){
        const {checked_array} = this.state
        var temp = checked_array
        if(e.target.checked){
            temp.push(name)

        }else{
            temp = temp.filter((data) => data != name)
        }
        this.setState({checked_array: temp})
        console.log(e.target.checked, id, name)
    }

    handleSave(){
        const {checked_array} = this.state
        const {wms, layer} = this.props
        console.log(checked_array, layer)
        service.setSystemAtt(checked_array, layer.id).then(({success})=>{
            if(success){
                alert(success)
            }
        })
    }

    render() {
        const {wms, layer} = this.props
        const {checked_array} = this.state
        return (
            <ul>
            {wms.attributes.featureTypes.map((attribute, idx) => 
                attribute.typeName == layer.code &&
                attribute.properties.map((property, index) =>
                    <li>
                        <div className="icheck-primary">
                            <input type="checkbox" id={`active-delete-${layer.code}-${index}`}
                                checked={checked_array.indexOf(property.name) > -1}
                                value={property.name}
                                onChange={(e) => this.setAttribute(e, layer.id, property.name)}
                            />
                            <label for={`active-delete-${layer.code}-${index}`}>&nbsp;{property.name}</label>
                        </div>
                    </li>
                )
            )}
            <a classNama="btn btn-primary" onClick={this.handleSave}>save</a>
            </ul>
        )
    }

}