import React, { Component } from "react"
import {service} from './service'
import { transformExtentWithOptions } from "ol/format/Feature"

export default class GeoData extends Component {

    constructor(props) {

        super(props)
        this.data = []
        this.state = {
            id: this.props.wmsId,
            feature_price: '',
            geo_db_export_field: '',
            geo_pk_field: '',
            geo_db_schema: '',
            geo_db_table:'',
            code: this.props.code,
            items: []
        }
        this.getData = this.getData.bind(this)
        this.saveData = this.saveData.bind(this)
    }

    componentDidMount() {
        this.getData()
    }

    getData(){
        const {id, code} = this.state
        service.getData(id, code).then(({success,items})=>{
            if(success){
                items.map((item) => this.setState({
                    feature_price: item.price,
                    geo_db_export_field: item.export_field,
                    geo_pk_field: item.pk_field,
                    geo_db_schema: item.schema,
                    geo_db_table: item.table,
                }))
            }
        }).catch(error => console.log(error))
    }

    saveData(){
        this.data = []
        const {feature_price, geo_db_export_field, geo_pk_field, geo_db_schema, geo_db_table, id, code} = this.state
        this.data.push({'price': feature_price, 'export_field': geo_db_export_field, 'pk_field': geo_pk_field, 'schema': geo_db_schema, 'table': geo_db_table})
        service.saveData(this.data, id, code).then(({success})=>{
            if(success){
                this.props.handleClose()
            }
        }).catch(error => console.log(error))
    }

    handleChange(field, e){
        this.setState({ [field]: e.target.value })
    }

    render() {
        const {feature_price, geo_db_export_field, geo_pk_field, geo_db_schema, geo_db_table, id, code} = this.state
        return (
            <div>
                <input type="number" min='0' className="form-control" placeholder="feature_price" value={feature_price || ''} onChange={(e) => this.handleChange('feature_price', e)}/>
                <br/>
                <input type="text" className="form-control" placeholder="geo_db_export_field" value={geo_db_export_field || ''} onChange={(e) => this.handleChange('geo_db_export_field', e)}/>
                <br/>
                <input type="text" className="form-control" placeholder="geo_pk_field" value={geo_pk_field || ''} onChange={(e) => this.handleChange('geo_pk_field', e)}/>
                <br/>
                <input type="text" className="form-control" placeholder="geo_db_schema" value={geo_db_schema || ''} onChange={(e) => this.handleChange('geo_db_schema', e)}/>
                <br/>
                <input type="text" className="form-control" placeholder="geo_db_table" value={geo_db_table || ''} onChange={(e) => this.handleChange('geo_db_table', e)}/>
                <br/>
                <button type="button" className="btn btn-outline-primary" onClick={() => this.saveData()}>Save</button>
            </div>

        )
    }
}

