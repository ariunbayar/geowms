import React, { Component } from 'react';

import * as utils from "@helpUtils/ol"

import { service } from '../../../service'

class index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            point_id: '',
            tseg_dugaar_zoom: '14.383305008368451',
            errors: {},
        }
        this.handleSubmitCoordinateName = this.handleSubmitCoordinateName.bind(this)
    }

    handleSubmitCoordinateName(event) {
        event.preventDefault()
        const { point_id, tseg_dugaar_zoom, errors } = this.state

        service
            .searchPoint(point_id)
            .then(({ data, success, error }) => {
                if (success) {
                    utils.setCenter(data, parseInt(tseg_dugaar_zoom))
                    errors['point_id'] = ''
                }
                else {
                    errors['point_id'] = error
                }
                this.setState({ errors })
            })
    }

    render() {
        const { point_id, tseg_dugaar_zoom, errors } = this.state
        const { options_scale } = utils.vars
        return (
            <form onSubmit={this.handleSubmitCoordinateName}>
                <div className="form-group">
                    <div className="input-group mb-3">
                        <input type="text"
                            className={`form-control ${errors?.point_id ? "is-invalid" : ""}`}
                            name="point_id"
                            onChange={(e) => this.setState({ point_id: e.target.value })}
                            value={point_id}
                        />
                        {
                            errors?.point_id
                            ?
                                <span className="invalid-feedback">
                                    {errors.point_id}
                                </span>
                            :
                                null
                        }
                    </div>
                    <label className="font-weight-bold" htmlFor="formGroupInput">масштаб</label>
                    <select
                        name="tseg_dugaar_zoom"
                        onChange={(e) => this.setState({ tseg_dugaar_zoom: e.target.value })}
                        value={tseg_dugaar_zoom}
                        className='form-control'
                    >
                        {
                            options_scale.map((option, idx) =>
                                <option key={idx} value={option.zoom}>{option.scale}</option>
                            )
                        }
                    </select>
                    <div className="input-group mt-3">
                        <button className="btn gp-btn-primary" type="submit"><i className="fa fa-search mr-1"></i>Хайх</button>
                    </div>
                </div>
            </form>
        );
    }
}

export default index;