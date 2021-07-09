// import * as utils from "@helpUtils/ol"
import { GeoJSON } from 'ol/format'
import { transform, fromLonLat } from 'ol/proj'
import { logicOp } from '../functions'

const vars = {
    "data_projection": "EPSG:4326",
    "feature_projection": 'EPSG:3857',
    "format": new GeoJSON(),
    "au_search_layer_name": "administrative",
}

export {
    vars,
    removeFeatureFromSource,
    writeFeat,
    removeLayer,
    transformCoordinate,
    fromLonLatToMapCoord,
    setCenter,
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
    const { format } = this.state
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
