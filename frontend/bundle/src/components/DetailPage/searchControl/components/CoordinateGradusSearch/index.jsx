import React, { Component } from 'react';

import * as utils from "@helpUtils/ol"

class index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            BA:'',
            BB:'',
            BC:'',
            LA:'',
            LB:'',
            LC:'',
            bairlal_two_zoom: "7.3376399772248575",
        }
        this.funcs = this.props.funcs
        this.handleSubmitCoordinateGradus = this.handleSubmitCoordinateGradus.bind(this)
    }

    handleSubmitCoordinateGradus(event) {
        event.preventDefault()
        const { BA, BB, BC, LA, LB, LC } = this.state
        if (BA > 40 && BB > 0 && BC > 0 && LA > 40 && LB > 0 && LC > 0)
        {
            var LL = (LB / 60 + LA)
            var X = ((LC / 3600) + (LB / 60) + LA - LL) + LL
            var BBB = (BB / 60 + BA)
            var Bbut = (BC / 3600) + (BB / 60) + BA - BBB
            var niitB = Bbut + BBB
            var array = [X, niitB]

            utils.setCenter(array, this.state.bairlal_two_zoom)
            const coordinates = utils.fromLonLatToMapCoord(array)
            this.funcs.marker.setCoordinates(coordinates)
            this.funcs.setVisibleMarker(true)

        }
        else {
            global.NOTIF("warning", "Оруулсан өгөгдөл таарахгүй байна", 'exclamation')
        }
    }

    setStateMapFloat(key, value) {
        this.setState({ [key]: parseFloat(value) })
    }

    render() {
        const { BA, BB, BC, LA, LB, LC, bairlal_two_zoom } = this.state
        const { options_scale } = utils.vars
        return (
            <form onSubmit={this.handleSubmitCoordinateGradus}>
                <div className="form-group">
                    <label className="font-weight-bold" htmlFor="formGroupInput">Өргөрөг</label>
                    <div className="input-group mb-3">
                        <label className="font-weight-bold" htmlFor="formGroupInput"></label>
                        <input type="text" className="form-control" placeholder="Градус X"
                            name="BA"
                            onChange={(e) => this.setStateMapFloat('BA', e.target.value)}
                            value={BA || ""}
                        />
                        <input type="text" className="form-control" placeholder="Минут X"
                            name="BB"
                            onChange={(e) => this.setStateMapFloat('BB', e.target.value)}
                            value={BB || ""}
                        />
                        <input type="text" className="form-control" placeholder="Секунд X"
                            name="BC"
                            onChange={(e) => this.setStateMapFloat('BC', e.target.value)}
                            value={BC || ""}
                        />
                    </div>
                    <label className="font-weight-bold" htmlFor="formGroupInput">Уртраг</label>
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="Градус Y"
                            name="LA"
                            onChange={(e) => this.setStateMapFloat('LA', e.target.value)}
                            value={LA || ""}
                        />
                        <input type="text" className="form-control" placeholder="Минут Y"
                            name="LB"
                            onChange={(e) => this.setStateMapFloat('LB', e.target.value)}
                            value={LB || ""}
                        />
                        <input type="text" className="form-control" placeholder="Секунд Y"
                            name="LC"
                            onChange={(e) => this.setStateMapFloat('LC', e.target.value)}
                            value={LC || ""}
                        />
                    </div>
                    <label className="font-weight-bold" htmlFor="formGroupInput">масштаб</label>
                    <select name="bairlal_two_zoom" as="select"
                        onChange={(e) => this.setState({ bairlal_two_zoom: e.target.value }) }
                        value={bairlal_two_zoom}
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
