import React, { Component } from "react"
import {service} from '../service'

export default class SearchSelects extends Component {

    constructor(props) {
        super(props)
        this.state = {
            aimag: [],
            sum: [],
            horoo: [],
            aimag_id: -1,
            sum_id: -1,
            horoo_id: -1,
            aimag_name: '',
            sum_name: '',
            horoo_name: '',
            aimag_geo_id: '',
            sum_geo_id: '',
            horoo_geo_id: '',
        }
        this.handleChange = this.handleChange.bind(this)
        this.getGeom = this.getGeom.bind(this)
        this.getFieldValues = this.getFieldValues.bind(this)
    }

    getGeom(geo_id) {
        service
            .getGeom(geo_id)
            .then(({ feature }) => {
                if (feature) {
                    this.props.sendFeature(feature)
                }
            })
    }

    getFieldValues() {
        service
            .formOptions()
            .then(({ success, info }) => {
                if (success) {
                    this.setState({ aimag: info })
                }
            })
    }

    componentDidMount() {
        this.getFieldValues()
    }

    handleChange(e, field, child_field, reset_fields, parent_field) {
        const field_id = field + '_id'
        const field_geo_id = field + '_geo_id'
        const field_name = field + '_name'
        const idx = e.target.value
        let obj = Object()
        let geo_id
        if (idx !== '-1') {
            const value = this.state[field][idx]
            this.setState({ [child_field]: value.children })
            if (child_field) {
                obj[child_field] = value.children
            }
            geo_id = value.geo_id
            reset_fields.map((r_field, idx) => {
                const r_field_id = r_field + '_id'
                const r_field_geo_id = r_field + '_geo_id'
                const r_field_name = r_field + '_name'
                obj[r_field_id] = -1
                obj[r_field_geo_id] = ''
                obj[r_field_name] = ''
            })
            obj[field_geo_id] = geo_id
            obj[field_name] = value.name
            this.getGeom(geo_id)
        }
        else {
            if (reset_fields.length > 0) {
                reset_fields.map((r_field, idx) => {
                    const r_field_id = r_field + '_id'
                    const r_field_geo_id = r_field + '_geo_id'
                    const r_field_name = r_field + '_name'
                    obj[r_field] = []
                    obj[r_field_id] = -1
                    obj[r_field_geo_id] = ''
                    obj[r_field_name] = ''
                })
            }
            if (parent_field !== 'mongol') {
                const parent_field_id = parent_field + '_id'
                const parent_idx = this.state[parent_field_id]
                const parent_obj = this.state[parent_field][parent_idx]
                geo_id = parent_obj.geo_id
            }
            else {
                geo_id = 'au_496'
            }
            obj[field_geo_id] = geo_id
            this.getGeom(geo_id)
        }
        this.setState({ [field_id]: idx, ...obj })
    }

    render() {
        const { aimag, sum, horoo, aimag_id, sum_id, horoo_id } = this.state

        return (
            <div className="form-row">
                <div className="form-group col-4">
                    <label htmlFor="aimag">Аймаг/Хот:</label>
                    <select
                        id="aimag"
                        className="form-control"
                        aria-label="Default select example"
                        onChange={(e) => this.handleChange(e, 'aimag', 'sum', ['sum', 'horoo'], 'mongol')}
                        value={aimag_id}
                    >
                        <option value='-1'>--- Аймаг/Хот сонгох ---</option>
                        {aimag.map((data, idx) =>
                            <option key={idx} value={idx}>{data.name}</option>
                        )}
                    </select>
                </div>
                <div className="form-group col-4">
                    <label htmlFor="sum">Сум/Дүүрэг:</label>
                    <select
                        id="sum"
                        className="form-control"
                        onChange={(e) => this.handleChange(e, 'sum', 'horoo', ['horoo'], 'aimag')}
                        value={sum_id}
                    >
                        <option value='-1'>--- Сум/Дүүрэг сонгох ---</option>
                        {sum.map((data, idx) =>
                            <option key={idx} value={idx}>{data.name}</option>
                        )}
                    </select>
                </div>
                <div className="form-group col-4">
                    <label htmlFor="horoo">Хороо/Баг:</label>
                    <select
                        id="horoo"
                        className="form-control"
                        onChange={(e) => this.handleChange(e, 'horoo', undefined, [], 'sum')}
                        value={horoo_id}
                    >
                        <option value='-1'>--- Баг/Хороо сонгох ---</option>
                        {horoo.map((data, idx) =>
                            <option key={idx} value={idx}>{data.name}</option>
                        )}
                    </select>
                </div>
            </div>
        )
    }
}
