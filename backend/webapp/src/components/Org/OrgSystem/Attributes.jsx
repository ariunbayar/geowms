import React, { Component } from "react"
import {service} from './service'


export default class Attributes extends Component {

    constructor(props) {
        super(props)
        this.state = {
            checked_array: props.layer.attributes || [],
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

    componentDidUpdate(pp){
        if(pp.layer !== this.props.layer){
            const {layer} = this.props
            this.setState({checked_array: layer.attributes})
        }
    }

    handleSave(){
        const {checked_array} = this.state
        const {wms, layer} = this.props
        service.setSystemAtt(checked_array, layer.id).then(({success})=>{
            if(success){
                this.props.addNotif('success', 'Амжилттай хадгаллаа.', 'check')
            }
        })
    }

    render() {
        const {wms, layer} = this.props
        const {checked_array} = this.state
        return (
            <ul key={wms.id + layer.id} id={`collapse-${wms.id + layer.id}`} className="collapse" data-parent="#accordion1">
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
                            <label htmlFor={`active-delete-${layer.code}-${index}`}>&nbsp;{property.name}</label>
                        </div>
                    </li>
                )
            )}
            <a className="btn btn-info btn-sm btn-round waves-effect waves-light m-1 text-white" onClick={this.handleSave}>Хадгалах</a>
            </ul>
        )
    }

}