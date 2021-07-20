import React, { Component } from 'react';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';

import * as utils from "@helpUtils/ol"

import { service } from '../../../service'

const FEATUREID = 'circle_buffer'
const KNOWKEY = 'name'
class index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            coordinatex: '',
            coordinatey: '',
            bairlal_one_zoom: "14.383305008368451",
            bairlal_scale: 1000,
            layers: [],
            center_coordinates: [],
        }
        this.funcs = this.props.funcs
        this.setVisibleLayer = this.setVisibleLayer.bind(this)
        this.drawBuffer = this.drawBuffer.bind(this)
        this.getBufferFromGeoServer = this.getBufferFromGeoServer.bind(this)
        this.handleSubmitClear = this.handleSubmitClear.bind(this)
        this.clearLayers = this.clearLayers.bind(this)
    }

    handleSubmitCoordinate(event) {
        event.preventDefault()
        const { coordinatex, coordinatey } = this.state
        if (coordinatex && coordinatey) {
            const coordinates = [coordinatey, coordinatex]

            this.drawBuffer(coordinates)
            this.state.center_coordinates = coordinates
        }
    }

    setVisibleLayer(layer_name, is_visible) {
        this.state.layers.map((layer, idx) => {
            if (layer.get(KNOWKEY) == layer_name) {
                layer.setVisible(is_visible)
            }
        })
    }

    clearLayers() {
        this.state.layers.map((layer, idx) => {
            window.map.getLayers().forEach(map_layer => {
                if (
                    (layer && map_layer)
                    &&
                    (layer.get(KNOWKEY) && map_layer.get(KNOWKEY))
                    &&
                    (layer.get(KNOWKEY) == map_layer.get(KNOWKEY))
                ) {
                    window.map.removeLayer(map_layer)
                }
            })
        })
    }

    handleSubmitClear() {
        const source = this.props.vector_layer.getSource()
        setTimeout(() => {
            utils.removeFeatureFromSource(utils.vars.au_search_layer_name, source)
        }, 1000);

        this.props.resetSearchLayerFeatures()
        this.clearLayers()
        this.props.setCenterOfMap()
        this.funcs.resetSearch()

        this.setState({ layers: [] })
    }


    getBufferFromGeoServer(center_coordinates, is_visible, add_layers) {
        let wms_list = Array()

        if (!center_coordinates) {
            center_coordinates = this.state.center_coordinates
        }

        if (!add_layers) {
            wms_list = this.props.map_wms_list
        }
        else {
            wms_list = [{ "layers": add_layers }]
        }

        wms_list.map(({ is_display, layers }, idx) => {
            layers.map(({ checked, code, wms_or_cache_ur, tile, wms_tile }, l_idx) => {

                const search_layer_name = FEATUREID + "_" + code
                if (!is_visible) {
                    this.setVisibleLayer(search_layer_name, is_visible)
                }

                if (checked) {

                    let layer_tile = wms_or_cache_ur ? tile : wms_tile
                    layer_tile.setVisible(false)
                    const source = layer_tile.getSource()
                    const urls = source.getUrls();

                    const layer = new TileLayer({
                        source: new TileWMS({
                            url: urls[0],
                            projection: utils.vars.feature_projection,
                            ratio: 1,
                            params: {
                                'LAYERS': code,
                                'FORMAT': 'image/png',
                                'VERSION': '1.1.1',
                                'FILTER': JSON.stringify({ 'buffer': center_coordinates, 'scale': this.state.bairlal_scale }),
                                "STYLES": '',
                                "exceptions": 'application/vnd.ogc.se_inimage',
                            },
                            serverType: 'geoserver',
                            transition: 0,
                        }),
                        [KNOWKEY]: search_layer_name
                    })
                    this.state.layers.push(layer)
                    window.map.addLayer(layer)
                }
            })
        })
    }

    getBufferFeature(coordinates, bairlal_scale) {
        service
            .getBuffer(coordinates, bairlal_scale)
            .then(({ success, data }) => {
                if (success) {
                    this.props.setFeatureOnMap(data, this.getBufferFromGeoServer)
                }
            })
    }

    drawBuffer(coordinates) {
        let { bairlal_scale } = this.state
        bairlal_scale = parseFloat(bairlal_scale)

        this.getBufferFeature(coordinates, bairlal_scale)
        this.getBufferFromGeoServer(coordinates)
    }

    render() {
        const { options_scale } = utils.vars
        const { coordinatex, coordinatey } = this.state
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
                            <button className="btn gp-btn-primary" type="submit" disabled={!coordinatex && !coordinatey}><i className="fa fa-search mr-1"></i>Хайх</button>
                        </div>
                        <div className="col-md-7 d-flex flex-row-reverse">
                            <button className="btn gp-btn-primary" type="button" onClick={this.handleSubmitClear}><i className="fa fa-trash mr-1"></i>Цэвэрлэх</button>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

export default index;
