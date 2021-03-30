import React, { Component } from "react"
import {Formik, Field, Form, ErrorMessage} from 'formik'
import {Switch, Route, NavLink} from "react-router-dom"


export class CreateStyle extends Component {
    constructor(props) {
        super(props)
        this.style_datas = []
        this.state = {
            form_values: {
                style_color: '#800000',
                style_size: 1,
                fill_color:  '#C0C0C0',
                wellknownname: '',
                wellknowshape: '',
                div_angle: '',
                color_opacity: 0.3,
                dashed_line_length: 0,
                dashed_line_gap: 0,
                check_style_name: '',
            },
            range_number: 1,
            had_chosen: 1,
            style_name: '',
            style_title: '',
            style_abstract: '',
            check_style: false,
            min_range: 0,
            max_range: 0,
        }
        this.handleValues = this.handleValues.bind(this)
    }

    handleValues(e) {
        console.log("hohoho", e.target.value, this.state)
    }

    render() {
            const {
                form_values,
                range_number,
                had_chosen,
                style_name,
                style_title,
                style_abstract,
            } = this.state
            return (
                <div className="row">
                    <div className="col-md-12">
                        <div className="col-md-12">
                            <div className="form-row col-md-8">
                                <div className="form-row text-dark">
                                    <div className="form-row col-md-8 mb-2">
                                        <label htmlFor="" className="col-md-4 my-2">Style-ийн нэр</label>
                                        <input
                                                name='style_name'
                                                id="style_name"
                                                type="text"
                                                className="form-control col-md-6"
                                            >
                                        </input>
                                    </div>
                                    <div className="form-row col-md-8 mb-2">
                                        <label htmlFor="style_title" className="col-md-4 my-2">Style-ийн гарчиг</label>
                                        <input
                                                name='style_title'
                                                id='style_title'
                                                type="text"
                                                className="form-control col-md-6 mt-2"
                                            >
                                        </input>
                                    </div>
                                    <div className="form-row content-justify-between col-md-8">
                                        <div className="form-group col-md-4">
                                            <label htmlFor="range_number">Range-ийн тоо</label>
                                            <input
                                            className="form-control col-6"
                                            onChange={(e) => this.setState({ range_number: e.target.value })}
                                            value={range_number}
                                            />
                                        </div>
                                        <div className="form-group col-md-6 mb-2">
                                            <label htmlFor="had_chosen">Утга авах range</label>
                                            <select
                                                className="form-control col-12"
                                                onChange={(e) => this.handleValues(e)}
                                                value={had_chosen}
                                            >
                                                <option className="col-md-12">-------------------------------</option>
                                            {
                                                (() => {
                                                    const rows = [];
                                                    for (let i = 1; i <= range_number; i++) {
                                                    rows.push(<option key={i} className="col-md-12">{i}</option>);
                                                    }
                                                    return rows;
                                                })()
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    {
                                        had_chosen &&
                                        <div className="form-row content-justify-between col-md-8">
                                            <div className="form-row col-md-12 text-center">
                                                    <div className="text-center col-md-12">Range <a className="text-info">{had_chosen}</a>-ийн утгууд</div>
                                            </div>
                                            <div className="form-group col-md-6">
                                                    <label htmlFor="">Min range</label>
                                                    <input
                                                        name='min_range'
                                                        id='id_min_range'
                                                        className="form-control col-md-6"
                                                        type="number"
                                                        onChange={(e) => this.setState({ min_range: e.target.value })}
                                                    />
                                            </div>
                                            <div className="form-group col-md-6 mb-2">
                                                <label htmlFor="">Max range</label>
                                                <input
                                                        className="form-control col-md-6"
                                                        name="max_range"
                                                        id="max_range"
                                                        type="number"
                                                        onChange={(e) => this.setState({ max_range: e.target.value })}
                                                    />
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <ModalAlert
                        modalAction={() => this.modalClose()}
                        status={modal_alert_status}
                        title={model_alert_text}
                        model_type_icon={model_alert_icon}
                    /> */}
                </div>
            )

        }
    }
