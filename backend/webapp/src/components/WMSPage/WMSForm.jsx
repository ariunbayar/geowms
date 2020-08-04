import React, { Component } from "react"
import { NavLink } from "react-router-dom"

import { service } from "./service"
import WMSCheckFormSort from './WMSCheckFormSort'

export class WMSForm extends Component {

    constructor(props) {

        super(props)

        this.state = {
            id: props.match.params.id,
            name: '',
            url: '',
            public_url: '',
            layers: [],
            layers_all: [],
            is_active:false,
            layer_choices: [],
            is_active_change:true
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleLayerToggle = this.handleLayerToggle.bind(this)
        this.loadLayers = this.loadLayers.bind(this)
        this.loadData = this.loadData.bind(this)
        this.handleWmsLayerRefresh = this.handleWmsLayerRefresh.bind(this)
        this.ActiveChange=this.ActiveChange.bind(this)

    }


    componentDidMount() {
        const id = this.props.match.params.id
        if (id) {
            this.loadData()
        }


    }

    componentDidUpdate(prevState) {


    }


    handleSave() {
        const id = this.props.match.params.id
        const {name,url,public_url,layers,layer_choices,is_active_change}= this.state
        if(is_active_change){
            const values={'id':id, 'name':name,'url':url, "public_url":public_url,"layers":layers,"layer_choices":layer_choices,"is_active":true }
            if (id) {
                service.update(values).then(({ success, item }) => {
                    if (success) { this.props.history.push('/back/wms/') }
                })

            } else {

                service.create(values).then(({ success, item }) => {
                    if (success) { this.props.history.push('/back/wms/') }
                })

            }
        }
        else{
            const values={'id':id, 'name':name,'url':url, "public_url":public_url,"layers":layers,"layer_choices":layer_choices,"is_active":false }
            if (id) {
                service.update(values).then(({ success, item }) => {
                    if (success) { this.props.history.push('/back/wms/') }
                })

            } else {

                service.create(values).then(({ success, item }) => {
                    if (success) { this.props.history.push('/back/wms/') }
                })

            }
        }

    }
    ActiveChange(e){
        const is_active=this.state.is_active
        this.setState({
            [e.target.name]:e.target.checked,
            
        })
        if(is_active){
            this.setState({
                is_active_change:false
            })
        }
        else{
            this.setState({
                is_active_change:true
            })
        }

    }
    loadData() {
        const id = this.props.match.params.id
        service.detail(id).then(({ wms_list }) => {
            if (wms_list) {
                {
                    wms_list.map((wms, idx) =>
                        this.setState({ name: wms.name, url: wms.url, public_url: wms.public_url, layers: wms.layers, layers_all: [],is_active:wms.is_active })
                    )

                }
                this.loadLayers(this.state.public_url)
                this.handleWmsLayerRefresh()
                
            }
        })
        

    }

    handleWmsLayerRefresh() {
        const id = this.props.match.params.id
        service.wmsLayerall(id).then(({ layers_all }) => {
            if (layers_all) {
                this.setState({ layers_all })
            }
        })
    }

    loadLayers(public_url) {

        service.getLayers(public_url).then((layer_choices) => {
            this.setState({ layer_choices })
        })
    }

    handleChange(field, e) {
        this.setState({ [field]: e.target.value })
    }

    handleLayerToggle(e, layer) {
        let layers = this.state.layers
        const wmsId = this.state.id
        const layerName = layer.name
        const layerCode = layer.code
        const legendURL = layer.legendurl
        if (e.target.checked) {

            service.layerAdd(layerName, wmsId, legendURL, layerCode).then(({ success }) => {
                if (success) {
                    this.handleWmsLayerRefresh()
                }
            })

            layers.push(layerCode)

        } else {

            service.layerRemove(layerCode, wmsId).then(({ success }) => {
                if (success) {
                    this.handleWmsLayerRefresh()
                }
            })

            layers = layers.filter((layer) => layer != layerCode)


        }

        this.setState({ layers })
    }

    render() {
        const { layers_all, id,is_active } = this.state
        return (
            <div className="container my-4">
                <div className="row">
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-4 shadow-lg p-3 mb-5 bg-white rounded">

                                <div className="form-group">
                                    <NavLink to={`/back/wms/`}>
                                        <button className="btn btn-block gp-outline-primary"  >
                                            Буцах
                                            </button>
                                    </NavLink>
                                </div>
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
                                <div>
                                    {this.state.is_active ? 
                                    <a className="text-danger">Хязгаарлах </a> :
                                    <a className="text-success">Идэвхжүүлэх </a>
                                    }
                                    <input 
                                    type="checkbox"
                                    name="is_active"
                                    checked={this.state.is_active}
                                    onChange={this.ActiveChange}/>
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-block gp-bg-primary" onClick={this.handleSave} >
                                        Хадгал
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
                                                        onChange={(e) => this.handleLayerToggle(e, layer)}
                                                        value={layer.code}
                                                    />
                                                    <span> {layer.name} ({layer.code})</span>
                                                </label>
                                            </div>
                                        )}
                                        {!this.state.id && 'Хадгалсаны дараагаар давхаргуудыг үзэх боломжтой болно'}
                                    </dd>
                                </dl>
                            </div>
                            <div className="col-8">
                                <div className="shadow-lg p-3 mb-5 bg-white rounded">
                                    <WMSCheckFormSort
                                        wmslayers={layers_all}
                                        wmsId={id}
                                        handleWmsLayerRefresh={this.handleWmsLayerRefresh}>

                                    </WMSCheckFormSort>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
