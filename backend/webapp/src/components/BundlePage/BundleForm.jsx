import React, { Component } from "react"
import ImageUploader from 'react-images-upload'
import {NavLink} from "react-router-dom"
import { service } from "./service"


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
            self_module:'',
            module:props.values.self_module,
            check_module:false,
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleLayerToggle = this.handleLayerToggle.bind(this)
        this.onDrop = this.onDrop.bind(this)
        this.handleSelectChange = this.handleSelectChange.bind(this)

    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps) {
        if (this.props.values.id !== prevProps.values.id) {
            const {id, name, price, layers, icon_url, self_module} = this.props.values
            this.setState({id, name, price, layers, icon_url, self_module, module:self_module})
        }


    }

    handleChange(field, e) {
        this.setState({[field]: e.target.value})
    }

    handleSave() {
        const {id, name, layers,icon, icon_url, module}=this.state
            const values ={'id':id, 'name':name, "layers":layers, 'icon':icon, 'icon_url':icon_url, 'module':module}
            this.props.handleSave(values)

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


    handleSelectChange(event){
        const value = {'module':event.target.value, 'id':this.state.id}
        const module = event.target.value
        service.ModuleCheck(value).then(({success}) => {
            if (success){
                this.setState({
                    module:'',
                    check_module:true,
                })
                setTimeout(() => {
                    this.setState({
                        check_module:false
                    })
                }, 1000);
            }
            else{
                this.setState({
                    module:module,
                    self_module:module,
                })
            }
        })

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
                    <label htmlFor="id_price"> Модулын нэр: {this.state.check_module ? <a className="text-danger">Давхцаж байна</a>: ''} </label>

                    {this.state.price ?
                        <select className='form-control ' name="module" onChange={e =>this.handleSelectChange(e)}
                        value={this.state.self_module ? `${this.state.self_module}` : ''}
                        >
                            <option value=''></option>
                            {this.state.price.map(a=>
                                <option key={a.id}
                                value={a.id}
                                >
                                {a.name}
                                </option>)}
                    </select>:
                        <select className='form-control ' name="module">
                        <option value=''></option>
                    </select>
                    }
                </div>

                {this.props.formOptions.map(({name, layers,is_active}, idx) =>
                    <div className="form-group" key={idx}>
                        <div className="col-md-1"></div>
                        <div className="col-md-11">
                         {is_active ?
                            <div key={idx} className="row">
                                <a>
                                    <i className="fa fa-check-circle" style={{color: "green"}} aria-hidden="false"></i>
                                    <span> {name}</span>
                                </a>
                            </div> :
                            <div key={idx} className="row">
                                <a>
                                    <i className="fa fa-times-circle" style={{color: "#FF4748"}}></i>
                                    <del> {name}</del>
                                </a>
                            </div>
                            }
                        </div>
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
                        <img src={this.state.icon_url} style={{width:"100px"}} className="uploadPicture ml-3"/>
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
                    <button className="btn btn-primary btn-block waves-effect waves-light m-1" onClick={this.handleSave} >
                        Хадгал
                    </button>
                </div>

                <div className="form-group">
                    <NavLink className="btn btn-outline-primary btn-block waves-effect waves-light m-1" to={`/back/дэд-сан/`}>
                            Буцах
                    </NavLink>
                </div>


                <dl>
                </dl>
            </>
        )
    }
}
