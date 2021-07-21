import React, { Component } from 'react';

import * as utils from "@helpUtils/ol"

import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';

var SEARCHLAYERNAME = 'administrative_boundary'
const LAYERKNOWKEY = 'name'

class index extends Component {

    constructor(props) {
        super(props);

        this.state = {
            aimag_id: -1,
            sum_id: -1,
            horoo_id: -1,
            aimag: props.aimag,
            sum: [],
            horoo: [],
            vector_layer: props.vector_layer,
            geo_id: '',
            layers: [],
        }

        this.getGeom = this.props.getGeom
        this.funcs = this.props.funcs
        this.getFeatureInfoFromInspire = this.getFeatureInfoFromInspire.bind(this)
        this.setVisibleLayer = this.setVisibleLayer.bind(this)
        this.clearLayers = this.clearLayers.bind(this)

    }

    UNSAFE_componentWillReceiveProps(nP) {
        this.setState({ aimag: nP.aimag, vector_layer: nP.vector_layer })
    }

    handleInput(e) {
        if (e.target.value) {
            const aimag_id = e.target.value
            if (aimag_id !== '-1') {
                const aimag_data = this.state.aimag[aimag_id]

                this.setGeom(aimag_data.geo_id)
                this.setState({ sum: aimag_data.children, aimag_id, sum_id: -1, horoo_id: -1 })
            }
            else {
                this.handleSubmitClear()
            }
        }
    }

    handleInputSum(e, field, array){
        if(e.target.value){
            const id = e.target.value
            if (id !== '-1') {
                this.setState({ [field]: id })

                const data = array[id]

                this.setGeom(data.geo_id)
                if (field == 'sum_id') {
                    this.setState({ horoo: data.children })
                }
            }
            else {
                var array_name
                if (field == 'horoo_id') {
                    this.setState({ [field]: -1 })
                    array_name = 'sum'
                }
                if (field == 'sum_id') {
                    this.setState({ [field]: -1, horoo_id: -1 })
                    array_name = 'aimag'
                }
                this.setGeom(this.state[array_name][this.state[array_name + '_id']].geo_id)
            }
        }
    }

    clearLayers() {
        this.state.layers.map((layer, idx) => {
            window.map.getLayers().forEach(map_layer => {
                if (
                    (layer && map_layer)
                    &&
                    (layer.get(LAYERKNOWKEY) && map_layer.get(LAYERKNOWKEY))
                    &&
                    (layer.get(LAYERKNOWKEY) == map_layer.get(LAYERKNOWKEY))
                ) {
                    window.map.removeLayer(map_layer)
                }
            })
        })
        this.setState({ layers: [] })
    }

    handleSubmitClear() {
        const source = this.state.vector_layer.getSource()
        utils.removeFeatureFromSource(utils.vars.au_search_layer_name, source)

        this.props.setCenterOfMap()
        this.props.resetSearchLayerFeatures()
        this.clearLayers()
        this.funcs.resetSearch()

        this.setState({ sum_id: -1, aimag_id: -1, horoo_id: -1, sum: [], horoo: [] })
    }

    async setGeom(geo_id) {
        this.getGeom(geo_id, this.getFeatureInfoFromInspire)
        this.getFeatureInfoFromInspire(geo_id)
        this.setState({ geo_id })
    }

    setVisibleLayer(layer_name, is_visible) {
        this.state.layers.map((layer, idx) => {
            if (layer.get(LAYERKNOWKEY) == layer_name) {
                layer.setVisible(is_visible)
            }
        })
    }

    getFeatureInfoFromInspire(geo_id, is_visible, add_layers) {

        let wms_list = Array()

        if (!geo_id) {
            geo_id = this.state.geo_id
        }

        if (!add_layers) {
            wms_list = this.props.map_wms_list
        }
        else {
            wms_list = [{ "layers": add_layers }]
        }

        wms_list.map(({ is_display, layers }, idx) => {
            layers.map(({ checked, code, wms_or_cache_ur, tile, wms_tile }, l_idx) => {

                const search_layer_name = SEARCHLAYERNAME + "_" + code
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
                                'FILTER': JSON.stringify({ 'within': geo_id }),
                                "STYLES": '',
                                "exceptions": 'application/vnd.ogc.se_inimage',
                            },
                            serverType: 'geoserver',
                            // Countries have transparency, so do not fade tiles:
                            transition: 0,
                        }),
                        [LAYERKNOWKEY]: search_layer_name
                    })
                    this.state.layers.push(layer)
                    window.map.addLayer(layer)
                }
            })
        })
    }

    render() {
        const { sum, aimag, horoo } = this.state
        return (
            <form>
                <div className="form-group">
                    <div className="input-group mb-3">
                        <select name="center_typ" as="select"
                            onChange={(e) => this.handleInput(e)}
                            value={this.state.aimag_id}
                            className='form-control'
                        >
                                <option value='-1'>--- Аймаг/Нийслэл сонгоно уу ---</option>
                                {
                                    aimag.map((data, idx) =>
                                        <option key={idx} value={idx}>{data.name}</option>
                                    )
                                }
                        </select>
                    </div>
                    <div className="input-group mb-3">
                        <select name="center_typ" as="select"
                            onChange={(e) => this.handleInputSum(e, 'sum_id', sum)}
                            className='form-control'
                            value={this.state.sum_id}
                        >
                            <option value="-1">--- Сум/дүүрэг сонгоно уу ---</option>
                            {
                                sum.map((data, idx) =>
                                    <option key={idx} value={idx}>{data.name}</option>
                                )
                            }
                        </select>
                    </div>
                    <div className="input-group mb-3">
                        <select name="center_typ" as="select"
                            onChange={(e) => this.handleInputSum(e, 'horoo_id', horoo)}
                            className='form-control'
                            value={this.state.horoo_id}
                        >
                            <option value="-1">--- Хороо/Баг сонгоно уу ---</option>
                            {
                                horoo.map((data, idx) =>
                                    <option key={idx} value={idx}>{data.name}</option>
                                )
                            }
                        </select>
                    </div>
                    <div className="input-group">
                        <div>
                            <button
                                className="btn gp-btn-primary"
                                type="button"
                                onClick={() => this.handleSubmitClear()}
                            >
                                <i className="fa fa-trash mr-1"></i>Цэвэрлэх
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

export default index;
