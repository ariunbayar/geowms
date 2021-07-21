// import * as utils from "@helpUtils/ol"
import { GeoJSON } from 'ol/format'
import { transform, fromLonLat } from 'ol/proj'
import { Tile } from 'ol/layer'
import { TileImage, TileWMS, WMTS } from 'ol/source'
import WMTSTileGrid from 'ol/tilegrid/WMTS';

import BaseLayers from './components/BaseLayers'

import { securedImageWMS } from "@utils/Map/Helpers"
import { logicOp } from '../functions'

import { service } from './service'

import './style.css'

const options_scale = [
    {'zoom': '2.9903484967519145', 'scale': 5000000},
    {'zoom': '4.3576399772248543', 'scale': 1000000},
    {'zoom': '7.3376399772248575', 'scale': 100000},
    {'zoom': '8.738265134288114', 'scale': 50000},
    {'zoom': '9.721598467621447', 'scale': 25000},
    {'zoom': '10.781598467621446', 'scale': 10000},
    {'zoom': '12.194931800954776', 'scale': 5000},
    {'zoom': '14.383305008368451', 'scale': 1000},
]

const vars = {
    "data_projection": "EPSG:4326",
    "feature_projection": 'EPSG:3857',
    "format": new GeoJSON(),
    "au_search_layer_name": "administrative",
    "options_scale": options_scale
}

export {
    vars,
    removeFeatureFromSource,
    writeFeat,
    removeLayer,
    transformCoordinate,
    fromLonLatToMapCoord,
    setCenter,
    clearFeatures,
    setBaseLayers,
}

// tuhain feature ийн id аваад source аас нь арилгах
function removeFeatureFromSource(featureID, source, key='id') {
    const features = source.getFeatures();
    if (features != null && features.length > 0) {
        for (var i = 0; i < features.length; i++) {
            const properties = features[i].getProperties();
            if (properties[key] == featureID) {
                source.removeFeature(features[i]);
                break;
            }
        }
    }
}

function writeFeat(features) {
    const { format } = vars
    const data = format.writeFeatureObject(features, {
        dataProjection: vars.projection_display,
        featureProjection: vars.feature_projection,
    })
    const changedFeature = JSON.stringify(data)
    return changedFeature
}

// газрын зургаас layer устгах устгахдаа юугаар тааруулж устгах key ээ өгнө
function removeLayer(map, layer_name, get_key='name', op='exact') {
    map.getLayers().forEach(layer => {

        if (layer && layer.get(get_key) && logicOp(op, layer.get(get_key), layer_name)){
            map.removeLayer(layer)
        }

    });
}

// координатыг хувиргаж авах default аар 3857 аас 4326 байгаа
function transformCoordinate(coordinate, from_proj=vars.data_projection, to_proj=vars.feature_projection) {
    const map_coord = transform(coordinate, from_proj, to_proj)
    return map_coord
}

// газрын зурганд харагддаг координатаас long at авах 3857 аас 4326 авах
function fromLonLatToMapCoord(coordinate) {
    return fromLonLat([coordinate[0], coordinate[1]]);
}

function setCenter(coord, zoom, map=window.map) {
    const view = map.getView()
    const map_projection = view.getProjection()
    const map_coord = transformCoordinate(coord, vars.data_projection, map_projection)
    view.animate({ zoom: zoom }, { center: view.setCenter(map_coord) });
}

// тухайн layer ийн бүх feature ийг арилгах
function clearFeatures(layer) {
    const source = layer.getSource()
    source.clear()
}

// суурь давхаргыг газрын зураг дээр нэмэх
async function setBaseLayers(map) {
    const { base_layer_list } = await service.base_layer.get()
    var resolutions = [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125E-4, 3.4332275390625E-4, 1.71661376953125E-4, 8.58306884765625E-5, 4.291534423828125E-5, 2.1457672119140625E-5, 1.0728836059570312E-5, 5.364418029785156E-6, 2.682209014892578E-6, 1.341104507446289E-6, 6.705522537231445E-7, 3.3527612686157227E-7];
    var gridNames = ['EPSG:4326:0', 'EPSG:4326:1', 'EPSG:4326:2', 'EPSG:4326:3', 'EPSG:4326:4', 'EPSG:4326:5', 'EPSG:4326:6', 'EPSG:4326:7', 'EPSG:4326:8', 'EPSG:4326:9', 'EPSG:4326:10', 'EPSG:4326:11', 'EPSG:4326:12', 'EPSG:4326:13', 'EPSG:4326:14', 'EPSG:4326:15', 'EPSG:4326:16', 'EPSG:4326:17', 'EPSG:4326:18', 'EPSG:4326:19', 'EPSG:4326:20', 'EPSG:4326:21'];

    const base_layer_name = 'base_layer'
    if (base_layer_list) {
        const { base_layers, base_layer_controls } =
        base_layer_list.reduce(
            (acc, base_layer_info, idx) => {

                let layer

                if (base_layer_info.tilename == "xyz") {
                    layer = new Tile({
                        preload: 6,
                        source: new TileImage({
                            crossOrigin: 'Anonymous',
                            url: base_layer_info.url,
                        }),
                        name: base_layer_name,
                    })
                }

                if (base_layer_info.tilename == "wms") {
                    layer = new Tile({
                        source: new TileWMS({
                            ratio: 1,
                            url: base_layer_info.url,
                            params: {
                                'LAYERS': base_layer_info.layers,
                                'FORMAT': 'image/png',
                                'VERSION': '1.1.1',
                                "STYLES": '',
                                "exceptions": 'application/vnd.ogc.se_inimage',
                            },
                            tileLoadFunction: securedImageWMS
                        }),
                        name: base_layer_name,
                    })
                }

                if (base_layer_info.tilename == "wmts") {
                    layer = new Tile({
                        source: new WMTS({
                            url: base_layer_info.url,
                            layer: base_layer_info.layers,
                            matrixSet: vars.feature_projection,
                            format: 'image/png',
                            projection: vars.feature_projection,
                            tileGrid: new WMTSTileGrid({
                                tileSize: [256,256],
                                extent: [-180.0,-90.0,180.0,90.0],
                                origin: [-180.0, 90.0],
                                resolutions: resolutions,
                                matrixIds: gridNames,
                            }),
                            tileLoadFunction: securedImageWMS,
                            style: '',
                            wrapX: true,
                        }),
                    })
                }

                acc.base_layers.push(layer)
                acc.base_layer_controls.push({
                    is_active: idx == 0,
                    thumbnail_1x: base_layer_info.thumbnail_1x,
                    thumbnail_2x: base_layer_info.thumbnail_2x,
                    layer: layer,
                })

                return acc

            },
            {
                base_layers: [],
                base_layer_controls: []
            }
        )

        // суурь давхаргыг бүр давхаргын хамгийн доор оруулж байгаа хэсэг
        const layers = Array()
        base_layers.map(base_layer => layers.push(base_layer))
        map.getLayers().forEach(layer => {
            layers.push(layer)
            map.removeLayer(layer)
        })
        console.log('removed layers');
        layers.map(layer => map.addLayer(layer))
        map.addControl(new BaseLayers({ layers: base_layer_controls }))
    }
}
