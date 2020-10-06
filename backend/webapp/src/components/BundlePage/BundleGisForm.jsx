import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import { service } from "./service"


export default class GisForm extends Component {

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
            tablename: props.gis_list.tablename,
            gis_list:[],
            oid_list:[],

        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleLayerToggle = this.handleLayerToggle.bind(this)
        this.onDrop = this.onDrop.bind(this)
        this.handleSelectChange = this.handleSelectChange.bind(this)

    }

    componentDidMount(){
    }

    handleChange(field, e) {
        this.setState({[field]: e.target.value})
    }

    handleSave() {
        const {id, name,module,oid_list}=this.state
            const values ={'id':id, 'name':name,'module':module, 'oid_list':oid_list}
            this.props.handleSave(values)
    }

    handleLayerToggle(e) {
        let oid_list = this.state.oid_list
        const value = parseInt(e.target.value)
        if (e.target.checked) {
            oid_list.push(value)
        } else {
            oid_list = oid_list.filter((oid) => oid != value)
        }
        this.setState({oid_list})
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

    componentDidUpdate(prevProps) {
        if (this.props.gis_list !== prevProps.gis_list) {
            const {id, name, price, layers, icon_url, self_module, oid_list} = this.props.values
            const gis_list = this.props.gis_list
            this.setState({id, name, price, layers, icon_url, self_module, module:self_module, gis_list:gis_list, oid_list})
        }
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
                    <div className="form-group">
                        <NavLink className="btn gp-btn-primary btn-block waves-effect waves-light m-1"  to={`/back/дэд-сан/`}>
                                Буцах
                        </NavLink>
                    </div>
                </div>
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
                <div>

                {this.state.gis_list.map((gis, idx) =>
                    <div key={idx}>
                        <label>
                            <input
                                type="checkbox"      
                                checked={this.state.oid_list.indexOf(gis.oid) > -1}                          
                                onChange={this.handleLayerToggle}
                                value={gis.oid}   
                            />
                            <a> {gis.tablename}</a>
                        </label>
                    </div>
                )}
                </div>

                <div className="form-group">
                    <button className="btn gp-btn-primary btn-block waves-effect waves-light m-1" onClick={this.handleSave} >
                        Хадгал
                    </button>
                </div>

                <div className="form-group">
                    <NavLink className="btn gp-btn-primary btn-block waves-effect waves-light m-1" to={`/back/дэд-сан/`}>
                            Буцах
                    </NavLink>
                </div>


                <dl>
                </dl>
            </>
        )
    }
}