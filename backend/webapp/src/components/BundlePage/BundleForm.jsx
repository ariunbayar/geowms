import React, { Component } from "react"
import ImageUploader from 'react-images-upload'
import {NavLink} from "react-router-dom"
import { service } from "./service"
import BackButton from "@utils/Button/BackButton"


export default class BundleForm extends Component {

    constructor(props) {

        super(props)
        this.state = {
            id: props.values.id,
            name: props.values.name,
            layers: props.values.layers,
            icon: props.values.icon,
            icon_url: props.values.icon_url,
            icon_url_err: ''
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
            const {id, name, layers, icon_url} = this.props.values
            this.setState({id, name, layers, icon_url})
        }


    }

    handleChange(field, e) {
        this.setState({[field]: e.target.value})
    }

    handleSave() {
        const {id, name, layers,icon, icon_url}=this.state
        if(id){
            const values ={'id':id, 'name':name, "layers":layers, 'icon':icon, 'icon_url':icon_url}
            this.props.handleSave(values)
        }else{
            if(icon){
                this.setState({icon_url_err: ''})
                const values ={'id':id, 'name':name, "layers":layers, 'icon':icon}
                this.props.handleSave(values)
            }else{
                this.setState({icon_url_err: 'Зураг алга байна'})
            }
        }

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
            <>
                <div className="form-group" style={{marginBottom: "8px"}}>
                    <label htmlFor="id_name"> Сангийн нэр: </label>
                    <input
                        type="text"
                        className="form-control"
                        id="id_name"
                        placeholder="сангийн нэр"
                        onChange={(e) => this.handleChange('name', e)}
                        value={this.state.name}
                        style={{marginBottom: "8px"}}
                    />
                </div>
                <div className ="bundle-table-scroll border border-light rounded">
                    {this.props.formOptions.map(({name, layers,is_active}, idx) =>
                        <div className="form-group" style={{marginTop: '10px'}} key={idx}>
                            <div className="col-md-12">
                            {is_active ?
                                <div id={`accordion2`}>
                                    <div className=" mb-2">
                                        <div className="card-header" style={{padding: "5px"}}>
                                            <button key={idx} className="btn btn-link shadow-none text-dark text-left collapsed" style={{padding: "5px"}} data-toggle="collapse" data-target={`#collapse-${idx}`} aria-expanded="true" aria-controls={`collapse-${idx}`}>
                                            <a>
                                                <i className="fa fa-check-circle" style={{color: "green"}} aria-hidden="true"></i>
                                                <span className="ml-2">{name}</span>
                                            </a>
                                            </button>
                                        </div>
                                        <div id={`collapse-${idx}`} className="collapse" data-parent="#accordion2">
                                            <div className="card-body">
                                            <dd>
                                                {layers.map((layer) =>
                                                    <div key={layer.id}>
                                                        <label style={{marginLeft: '25px'}}>
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
                                        </div>
                                    </div>
                                </div>
                            :
                            <div>
                                <div className=" mb-2">
                                    <div className="card-header" style={{padding: "5px"}}>
                                        <button key={idx} className="btn btn-link shadow-none text-dark text-left" style={{padding: "5px"}} data-toggle="collapse" data-target={`#collapse-${idx}`} aria-expanded="true" aria-controls={`collapse-${idx}`}>
                                        <a>
                                            <i className="fa fa-times-circle" style={{color: "#FF4748"}}></i>
                                            <span className="ml-2">{name}</span>
                                        </a>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            }
                            </div>
                        </div>
                    )}
                </div>
                <div className="form-group text-center mt-3">
                    <label htmlFor="id_icon" className="mr-2" style={{marginBottom: "0px"}}> Icon: </label>
                    {!this.state.icon &&
                        <img src={this.state.icon_url} style={{width:"50px"}} className="uploadPicture ml-2"/>
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
                    {this.state.icon_url_err && <p className="text-danger">{this.state.icon_url_err}</p>}
                </div>

                <div className="form-group">
                    <button className="btn gp-btn-primary btn-block waves-effect waves-light" onClick={this.handleSave} >
                        Хадгал
                    </button>
                </div>
                <BackButton {...this.props} name={'Буцах'} navlink_url={`/back/дэд-сан/`}></BackButton>
            </>
        )
    }
}
