import React, { Component } from "react"

import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import "./styles.css"
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style'
import {Vector as VectorSource} from 'ol/source';
import {Vector as VectorLayer} from 'ol/layer';
import Modal from '../components/helpers/Modal'

export class RequestMap extends Component {
    constructor(props) {

        super(props)

        this.state = {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
            is_open_modal: false,
        }
        this.loadMapData = this.loadMapData.bind(this)
        this.loadMap = this.loadMap.bind(this)
    }

    componentDidMount() {
        const { geoJson } = this.props
        this.loadMap()
        this.loadMapData(geoJson)
    }

    loadMap(){
      const map = new Map({
        layers: [
            new TileLayer({
              source: new OSM(),
            }),
        ],
        target: 'map',
        view: new View({
            center: [11461613.630815497, 5878656.0228370065],
            zoom: 5.041301562246971,
        }),
      });
      this.map = map
    }

    loadMapData(GeoJson){

        const styles_new = {
          'MultiPolygon': new Style({
            stroke: new Stroke({
              color: '#DE3A12',
              width: 2,
            }),
            fill: new Fill({
              color: 'rgba(0,255,0,0.3)',
            }),
          }),
          'Polygon': new Style({
            stroke: new Stroke({
              color: '#DE3A12',
              width: 2,
            }),
            fill: new Fill({
              color: 'rgba(0,255,0,0.3)',
            }),
          }),
          'Point': new Style({
            image: new CircleStyle({
              radius: 5,
              fill: new Fill({
                color: '#DE3A12',
              }),
            }),
          }),
          'LineString': new Style({
            stroke: new Stroke({
              color: '#DE3A12',
              width: 2,
            }),
          }),
          'MultiLineString': new Style({
            stroke: new Stroke({
              color: '#DE3A12',
              width: 2,
            }),
          }),
          'MultiPoint': new Style({
            image: new CircleStyle({
              radius: 5,
              fill: new Fill({
                color: '#DE3A12',
              }),
            }),
          }),
        };

        const geojsonObject =  GeoJson
        if(geojsonObject){
          const vectorSourceNew = new VectorSource({
            features: new GeoJSON().readFeatures(geojsonObject, {
              dataProjection: this.state.dataProjection,
              featureProjection: this.state.featureProjection,
            }),
          });

          const vectorLayerNew = new VectorLayer({
            source: vectorSourceNew,
            style: function (feature) {
              return styles_new[feature.getGeometry().getType()];
            }
          });
          this.map.getView().fit(
            vectorSourceNew.getExtent(),
            {
              size: this.map.getSize(),
              padding: [25, 25, 25, 25],
              maxZoom: 20,
              // duration: 4000 // herwee hugatsaatai harahaar eniig heregleh
            }
          )
          this.map.addLayer(vectorLayerNew)
        }
    }

  changeState(state, button_state) {
    this.setState({ is_open_modal: true, state, button_state })
  }

  closeModal() {
    this.setState({ is_open_modal: false })
  }

  render() {
    const { geom_name, form_json, id } = this.props
    const { is_open_modal, state, button_state } = this.state
    return (
      <div className="container-fluid">
        <div className={'show d-block modal fade text-wrap'} tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog custom-modal-width">
            <div className="modal-content">
              <div className="modal-header text-center">
                <h5 className="modal-title w-100">{geom_name}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.props.handleRequestClose()}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body pt-0 pb-0">
                <div className="row">
                {
                  form_json &&
                  <div className="col-md-4 overflow-auto text-break" style={{height:"calc( 90vh - 85px - 15px)"}}>
                  {
                    form_json
                    ?
                      form_json.map((prop, idx)=>
                        <FormValue key={idx} prop={prop}/>
                      )
                    :
                      null
                  }
                  </div>
                }
                <div className="col-md-8 px-0 reaquest">
                    <div id="map"></div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn gp-btn-primary text-center" onClick={() => this.changeState('reject', 'Татгалзах')}>
                  <a className="text-succes">Татгалзах</a>
                </button>
                <button className="btn gp-btn-outline-primary text-center" onClick={() => this.changeState('approve', 'Цуцлах')}>
                  <a className="text-succes">Цуцлах</a>
                </button>
              </div>
              {
                is_open_modal
                ?
                  <Modal
                      modalClose={() => this.closeModal()}
                      modalAction = {() => this.props.stateButton(id, state)}
                      text={`Та ${button_state.toLowerCase()}даа итгэлтэй байна уу ?`}
                      title={`Тохиргоог ${button_state.toLowerCase()}`}
                      status={this.state.status}
                      model_type_icon = "success"
                      actionNameDelete={button_state}
                  />
                  :
                    null
              }
            </div>
            </div>
          </div>
        </div>
        <div className={'modal-backdrop fade show'}></div>
      </div>
    )
  }
}


export class FormValue extends Component {
  constructor(props) {

      super(props)

      this.state = {
          showInfo: false,
      }
  }

  render() {
    const { showInfo } = this.state
    const { prop } = this.props
    return (
      <div className="row">
        <i role="button" className="fa fa-exclamation-circle p-0 m-0 ml-2 mt-1"
            onMouseOver={() => this.setState({ showInfo: true })}
            onMouseOut={() => this.setState({ showInfo: false })}
          >
        </i>
        <div className="col-md-10">
            <label>{prop.property_name}: <b>{prop.data}</b></label>
        </div>
        {
          showInfo
          ?
            <small className="ml-1">{prop.property_definition}</small>
          :
            null
        }
      </div>
    )
  }
}