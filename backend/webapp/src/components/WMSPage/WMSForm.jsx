import React, { Component } from "react"
import {Link} from "react-router-dom"

import {service} from "./service"


export default class WMSForm extends Component {

    constructor(props) {

        super(props)

        this.state = {
            id: props.values.id,
            name: props.values.name,
            url: props.values.url,
            public_url: props.values.public_url,
            layers: props.values.layers,
            layer_choices: [],
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleLayerToggle = this.handleLayerToggle.bind(this)
        this.loadLayers = this.loadLayers.bind(this)

    }


    componentDidMount() {
        this.state.id && this.loadLayers(this.state.public_url)
    }

    componentDidUpdate(prevProps) {

        if (this.props.values.id !== prevProps.values.id) {
            const {id, name, url, public_url, layers} = this.props.values
            this.setState({id, name, url, public_url, layers, layer_choices: []})

            this.state.id && this.loadLayers(public_url)
        }

    }

    loadLayers(public_url) {

        service.getLayers(public_url).then((layer_choices) => {
            this.setState({layer_choices})
        })
    }

    handleChange(field, e) {
        this.setState({[field]: e.target.value})
    }

    handleSave() {
        this.props.handleSave(this.state)
    }

    handleLayerToggle(e) {
        let layers = this.state.layers

        if (e.target.checked) {
            layers.push(e.target.value)
        } else {
            layers = layers.filter((layer) => layer != e.target.value)
        }
        this.setState({layers})
    }

    render() {
        return (
            <div className="col-md-4 offset-md-4 shadow-lg p-3 mb-5 bg-white rounded">

                <div className="form-group">
                    <label htmlFor="id_name">Нэр</label>
                    <input
                        type="text"
                        className="form-control"
                        id="id_name"
                        placeholder="Нэр"
                        onChange={(e) => this.handleChange('name', e)}
                        value={this.state.name}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="id_url">WMS URL</label>
                    <input
                        type="text"
                        className="form-control"
                        id="id_url"
                        placeholder="WMS URL"
                        onChange={(e) => this.handleChange('url', e)}
                        value={this.state.url}
                    />
                </div>

                <div className="form-group">
                    <button className="btn btn-block gp-bg-primary" onClick={this.handleSave} >
                        Хадгал
                    </button>
                </div>

                <div className="form-group">
                    <button className="btn btn-block gp-outline-primary" onClick={this.props.handleCancel} >
                        <i className="fa fa-chevron-left" aria-hidden="true"></i>
                        &nbsp; Буцах
                    </button>
                </div>

                <dl>
                    <dt> Endpoint </dt>
                    <dd>
                        {this.state.id && this.state.public_url}
                        {!this.state.id && 'Хадгалсаны дараагаар Endpoint URL үүснэ!'}
                    </dd>

                    <dt> Давхаргууд </dt>
                    <dd>
                        {this.state.id && this.state.layer_choices.map((layer, idx) =>
                            <div key={idx}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={this.state.layers.indexOf(layer.code) > -1}
                                        onChange={this.handleLayerToggle}
                                        value={layer.code}
                                    />
                                    {layer.name} ({layer.code})
                                </label>
                            </div>
                        )}
                        {!this.state.id && 'Хадгалсаны дараагаар давхаргуудыг үзэх боломжтой болно'}
                    </dd>
                </dl>
            </div>
        )
    }
}

