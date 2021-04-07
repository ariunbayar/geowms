import React, { Component } from "react"


export default class Attributes extends Component {

    constructor(props) {
        super(props)
        this.state = {
            checked_array: props.layer.attributes || [],
        }
    }




    componentDidUpdate(pp){
        if(pp.layer !== this.props.layer){
            const {layer} = this.props
            this.setState({checked_array: layer.attributes})
        }
    }



    render() {
        const {wms, layer, idx} = this.props
        const {checked_array} = this.state
        return (
            <ul key={idx} id={`collapse-${idx}`} className="collapsed" data-parent="#accordion1">
            {wms.attributes.featureTypes.map((attribute, idx) => 
                attribute.typeName == layer.code &&
                attribute.properties.map((property, index) =>
                    <li>
                        <div className="icheck-primary">
                            <input type="checkbox" id={`active-delete-${layer.code}-${index}`}
                                checked={checked_array.indexOf(property.name) > -1}
                                value={property.name}
                                disabled={true}
                            />
                            <label htmlFor={`active-delete-${layer.code}-${index}`}>&nbsp;{property.name}</label>
                        </div>
                    </li>
                )
            )}
            </ul>
        )
    }

}