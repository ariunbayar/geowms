import React, { Component } from 'react';

import * as utils from "@helpUtils/ol"

class index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            coordinatex: '',
            coordinatey: '',
            bairlal_one_zoom: 7.3376399772248575,
            bairlal_scale: 5000000,
        }
    }

    handleSubmitCoordinate(event) {
        event.preventDefault()
        // const coord = helpers.parseCoordinateString(this.state.coordinate)
        const coordinates = [this.state.coordinatey, this.state.coordinatex]
        utils.setCenter(coordinates, this.state.bairlal_one_zoom)
        this.props.setFeatureOnMap(undefined, coordinates, this.state.bairlal_scale)
    }

    resetButton() {
        this.props.resetButton()
    }

    render() {
        const { options_scale } = utils.vars
        return (
            <form onSubmit={(e) => this.handleSubmitCoordinate(e)}>
                <div className="form-group">
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="Өргөрөг"
                            name="Өргөрөг"
                            onChange={(e) => this.setState({ coordinatex: e.target.value }) }
                            value={this.state.coordinatex}
                        />
                        <input type="text" className="form-control" placeholder="Уртраг"
                            name="Уртраг"
                            onChange={(e) => this.setState({ coordinatey: e.target.value }) }
                            value={this.state.coordinatey}
                        />
                    </div>
                    <label className="font-weight-bold" htmlFor="formGroupInput">масштаб</label>
                    <select name="bairlal_one_zoom" as="select"
                        onChange={(e) => this.setState({ bairlal_one_zoom: e.target.value, bairlal_scale: e.target.options[e.target.selectedIndex].text }) }
                        value={this.state.bairlal_one_zoom}
                        className='form-control'
                    >
                        {
                            options_scale.map((option, idx) =>
                                <option key={idx} value={option.zoom}>{option.scale}</option>
                            )
                        }
                    </select>
                    <div className="row mt-3">
                        <div className="col-md-5">
                            <button className="btn gp-btn-primary" type="submit"><i className="fa fa-search mr-1"></i>Хайх</button>
                        </div>
                        <div className="col-md-7 d-flex flex-row-reverse">
                            <button className="btn gp-btn-primary" type="button" onClick={this.resetButton}><i className="fa fa-trash mr-1"></i>Цэвэрлэх</button>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

export default index;