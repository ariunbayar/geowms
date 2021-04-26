import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"
import {CreateStyle} from './style_add'

export default class ShowStyleData extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        this.handleOnChange = this.handleOnChange.bind(this)
    }

    handleOnChange(e) {
        this.props.handleOnChange(e)
    }

    render() {
            const {value, had_chosen, data_state} = this.props
            return (
                <div className="col-md-12 d-inline-block mx-0 px-0">
                    {
                        (value.range_number && value.range_number > 0 && had_chosen > 0)
                        &&
                        <div className="col-md-12 px-0">
                            {
                                (value.index_of_range == 1)
                                ?
                                <div className="col-md-12 d-flex my-2">
                                    <div className="col-md-6 mb-2">
                                        <label htmlFor="">Max scale</label>
                                        <input
                                            className="form-control"
                                            name="max_range"
                                            type="number"
                                            value={value.max_range}
                                            onChange={(e) => this.handleOnChange(e)}
                                        />
                                    </div>
                                </div>
                                :
                                <div className="col-md-12 d-flex my-2">
                                    <div className="col-md-6">
                                        <label htmlFor="">Min scale</label>
                                        <input
                                            className="form-control"
                                            name="min_range"
                                            type="number"
                                            value={value.min_range}
                                            onChange={(e) => this.handleOnChange(e)}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-2 mx-0 px-0">
                                        <label htmlFor="">Max scale</label>
                                        <input
                                            className="form-control"
                                            name="max_range"
                                            type="number"
                                            value={value.max_range}
                                            onChange={(e) => this.handleOnChange(e)}
                                        />
                                    </div>
                                </div>
                            }
                        </div>
                    }
                    <div>
                        {
                            (value && (data_state || had_chosen > 0))
                            &&
                            <div>
                                <div className="col-md-12 d-flex mx-0 my-2">
                                    <div className="col-md-6">
                                        <label htmlFor="">Style-ийн төрөл</label>
                                        <select
                                            className="form-control"
                                            name="shape_type"
                                            value={value.shape_type}
                                            onChange={(e) => this.handleOnChange(e)}
                                        >
                                            <option value="">--------------------------</option>
                                            {value.shape_types.map((data, idy) =>
                                                <option value={data.geo_name} key={idy}>{data.name}</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="col-md-6 px-0">
                                        <label htmlFor="rule_name">Rule-ийн нэр</label>
                                        <input
                                            type="text"
                                            name='rule_name'
                                            className="form-control"
                                            value= {value.rule_name}
                                            onChange={(e) => this.handleOnChange(e)}
                                        />
                                    </div>
                                </div>
                                {
                                    value.shape_type
                                    &&
                                    <div className="col-md-12">
                                        {
                                            (value.shape_type == 'PointSymbolizer' || value.shape_type == 'PolygonSymbolizer')
                                            &&
                                            <div className="col-md-4 d-inline-block">
                                                <label htmlFor="color" className="m-2">Дүрсийн дүүргэлтийн өнгө</label>
                                                <input
                                                    type="color"
                                                    name='fill_color'
                                                    className="form-control col-4"
                                                    value= {value.fill_color}
                                                    onChange={(e) => this.handleOnChange(e)}
                                                />
                                            </div>
                                        }
                                        <div className="col-md-4 d-inline-block">
                                            <label htmlFor="color" className="m-2">Хүрээний өнгө</label>
                                            <input
                                                type="color"
                                                name='style_color'
                                                className="form-control col-4"
                                                value= {value.style_color}
                                                onChange={(e) => this.handleOnChange(e)}
                                            />
                                        </div>
                                        <div className="col-md-4 d-inline-block">
                                            <label htmlFor="id_geoserver_user">Хүрээний өргөн</label>
                                            <input
                                                name="style_size"
                                                type="number"
                                                className="form-control col-4"
                                                id="style_size"
                                                value = {value.style_size}
                                                onChange={(e) => this.handleOnChange(e)}
                                            />
                                        </div>
                                        <div className="col-md-4 d-inline-block">
                                            <label htmlFor="color" className="m-2">Өнгөний уусгалт</label>
                                            <input
                                                type="number"
                                                name='color_opacity'
                                                className="form-control col-4"
                                                value= {value.color_opacity}
                                                onChange={(e) => this.handleOnChange(e)}
                                            />
                                        </div>
                                        <div className="col-md-4 d-inline-block">
                                            <label htmlFor="color" className="m-2">Зураасын урт</label>
                                                <input
                                                    type="number"
                                                    name='dashed_line_length'
                                                    className="form-control col-4"
                                                    value= {value.dashed_line_length}
                                                    onChange={(e) => this.handleOnChange(e)}
                                                />
                                        </div>
                                        <div className="col-md-4 d-inline-block">
                                            <label htmlFor="color" className="m-0 p-0">Зураас хоорондох зай</label>
                                            <input
                                                type="number"
                                                name='dashed_line_gap'
                                                className="form-control col-4"
                                                value= {value.dashed_line_gap}
                                                onChange={(e) => this.handleOnChange(e)}
                                            />
                                        </div>
                                    {
                                        value.shape_type == 'PointSymbolizer'
                                        &&
                                        <div className='col-md-4 d-inline-block'>
                                            <label htmlFor="wellknownname">Дүрсний сонголт</label>
                                            <select
                                                className="form-control form-control-sm"
                                                name="wellknownname"
                                                value={value.wellknownname}
                                                onChange={(e) => this.handleOnChange(e)}
                                            >
                                                <option value="circle">Дугуй</option>
                                                <option value="square">Дөрвөлжин</option>
                                                <option value="triangle">Гурвалжин</option>
                                                <option value="star"> Од</option>
                                                <option value="x"> Хэрээс</option>
                                            </select>
                                        </div>
                                    }
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
            )
        }
    }
