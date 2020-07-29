import React, { Component } from "react"
import ImageUploader from 'react-images-upload'
import {NavLink} from "react-router-dom"


export default class BundleForm extends Component {

    constructor(props) {

        super(props)

        this.state = {
            id: props.values.id,
            name: props.values.name,
            price: props.values.price,
            layers: props.values.layers,
            icon: props.values.icon,
            icon_url: props.values.icon_url,
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

                <div className="form-group">
                    <label htmlFor="id_price"> Үнэ: </label>
                    <input
                        type="number"
                        className="form-control"
                        id="id_price"
                        placeholder="сангийн нэр"
                        onChange={(e) => this.handleChange('price', e)}
                        value={this.state.price}
                    />
                </div>

                {this.props.formOptions.map(({name, layers}, idx) =>
                    <div className="form-group" key={idx}>
                        <dt> {name} </dt>
                        <dd>

                            {layers.map((layer) =>
                                <div key={layer.id}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={this.state.layers.indexOf(layer.id) > -1}
                                            onChange={this.handleLayerToggle}
                                            value={layer.id}
                                        />
                                        <a> {layer.name}</a>
                                    </label>
                                </div>
                            )}

                        </dd>
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="id_icon"> Icon: </label>
                    {!this.state.icon &&
                        <img src={this.state.icon_url} className="uploadPicture"/>
                    }
                    <ImageUploader
                        withPreview={true}
                        withIcon={false}
                        buttonText='Icon оруулах'
                        onChange={this.onDrop}
                        imgExtension={['.jpg', '.png']}
                        maxFileSize={5242880}
                        singleImage={true}
                        label=''
                    />
                </div>

                <div className="form-group">
                    <button className="btn btn-block gp-bg-primary" onClick={this.handleSave} >
                        Хадгал
                    </button>
                </div>

                <div className="form-group">
                    <NavLink to={`/back/`}>
                        <button className="btn btn-block gp-outline-primary"  >
                            Буцах
                        </button>
                    </NavLink>
                </div>


                <dl>
                </dl>
            </div>
        )
    }
}

