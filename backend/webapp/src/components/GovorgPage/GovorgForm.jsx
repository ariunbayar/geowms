import React, { Component } from "react"
import FlipMove from 'react-flip-move'
import ImageUploader from 'react-images-upload'
import {service} from "./service"


export default class GovorgForm extends Component {

    constructor(props) {

        super(props)

        this.state = {
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleLayerToggle = this.handleLayerToggle.bind(this)
        this.onDrop = this.onDrop.bind(this)

    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps) {

        if (this.props.values.id !== prevProps.values.id) {
            const {id, name, price, layers} = this.props.values
            this.setState({id, name, price, layers})
        }

    }


    handleChange(field, e) {
        this.setState({[field]: e.target.value})
    }

    handleSave() {
        this.props.handleSave(this.state)
    }

    handleLayerToggle(e) {
        let layers = this.state.layers
        const value = parseInt(e.target.value)
        if (e.target.checked) {
            layers.push(value)
        } else {
            layers = layers.filter((id) => id != value)
        }
        this.setState({layers})
    }

    onDrop([icon]) {
        if(icon){
            let reader = new FileReader();
            reader.onload = (upload) => {
                this.setState({
                    icon: btoa(upload.target.result)
                })
            }
            reader.readAsBinaryString(icon)
        }
    }

    render() {
        return (
            <div className="shadow-lg p-3 mb-5 bg-white rounded">

                <div className="form-group">
                    <button className="btn btn-block gp-outline-primary" onClick={this.props.handleCancel} >
                        <i className="fa fa-chevron-left" aria-hidden="true"></i>
                        &nbsp; Буцах
                    </button>
                </div>


                <dl>
                </dl>
            </div>
        )
    }
}

