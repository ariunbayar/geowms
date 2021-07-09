import React, { Component } from 'react';

import * as utils from "@helpUtils/ol"

import { service } from '../../../service'

class index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error_msg: '',
            point_id: '',
            tseg_dugaar_zoom: 7.3376399772248575,
        }
        this.handleSubmitCoordinateName = this.handleSubmitCoordinateName.bind(this)
    }

    handleSubmitCoordinateName(event) {
        event.preventDefault()
        console.log('dsadsadsadjksajdklsadjklsa');
        service
            .searchPoint(this.state.point_id)
            .then(({ info, success }) => {
                if(success){
                    utils.setCenter(info, parseInt(this.state.tseg_dugaar_zoom))
                }
                else{
                    this.setState({error_msg: info})
                }setTimeout(() => {
                    this.setState({error_msg: ''})
                }, 2222);
            })
    }

    render() {
        const { error_msg, point_id } = this.state
        const { options_scale } = utils.vars
        return (
            <form onSubmit={this.handleSubmitCoordinateName}>
                <div className="form-group">
                    {error_msg ? <label className="text-danger" htmlFor="formGroupInput">{error_msg}</label>: null}
                    <div className="input-group mb-3">
                        <input type="text"
                            className="form-control"
                            name="point_id"
                            onChange={(e) => this.setState({ point_id: e.target.value }) }
                            value={this.state.point_id}
                        />
                    </div>
                    <label className="font-weight-bold" htmlFor="formGroupInput">масштаб</label>
                    <select name="tseg_dugaar_zoom" as="select"
                        onChange={(e) => this.setState({ tseg_dugaar_zoom: e.target.value }) }
                        value={this.state.tseg_dugaar_zoom}
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