import React, { Component, Fragment } from 'react'
import InspireMap from "@utils/BundleMap"
import Loader from '@utils/Loader'
import './styles.css'
import CardLink from "./components/CardLink";
export class OpenLayerPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            open_layer: props.open_layer,
            bundle: {},
            wms_url: '',
            wfs_url: '',
            wmts_url: '',
            shape_file_url: '',
            gml_url: '',
            geo_json_url: '',
            csv_url: '',
            layer_obj: {},
            wms_obj: {},
            is_loading: false,
        }
        this.setWms = this.setWms.bind(this)
        this.setBundle = this.setBundle.bind(this)
    }

    setWms(wms, layer){
        this.setState({
            wms_obj: wms,
            layer_obj: layer,
            wms_url: wms.url,
            wfs_url: wms.url,
            wmts_url: wms.chache_url,

            shape_file_url: layer.shape_file_url,
            gml_url: layer.gml_url,
            geo_json_url: layer.geo_json_url,
            csv_url: layer.csv_url,
            is_loading: true,
        })
        setTimeout(() => {
            this.setState({is_loading: false})
        }, 500);
    }

    setBundle(bundle){
        this.setState({
            bundle,
            is_loading: true,
            layer_obj: {},
            wms_obj: {},
            wms_url: '',
            wfs_url: '',
            wmts_url: '',

            shape_file_url: '',
            gml_url: '',
            geo_json_url: '',
            csv_url: '',
        })
        setTimeout(() => {
            this.setState({is_loading: false})
        }, 500);
    }

    componentDidMount(){
        const {open_layer} = this.props
        if(open_layer){
            this.setState({bundle: open_layer[0]})
        }
    }

    render() {
        const {open_layer, bundle, wms_url, wfs_url, wmts_url, layer_obj, wms_obj, shape_file_url, gml_url, geo_json_url, is_loading} = this.state
        return (
            <div className="col-md-12">
                <Loader is_loading={is_loading}></Loader>
                <div className="row">
                    <div className="col-12 mt-3 col-md-12 col-xl-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div id="owl-demo" className="owl-carousel owl-theme">
                                        {open_layer.map((bundle_obj, idx) =>
                                            <div className="item" key={idx} onClick={() => this.setBundle(bundle_obj)}>
                                                <img src={bundle_obj.icon} className="ahha" style={{height: "80px"}}></img>
                                                <h6 className={bundle_obj.id == bundle.id ? 'text-primary' : ''}>{bundle_obj.name}</h6>
                                                {bundle_obj.id == bundle.id && <hr className="bg-primary"></hr>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row text-center">
                    <div className="col-12">
                        <h1 className="text-center">{bundle && bundle.name}</h1>
                    </div>
                </div>
                {bundle &&
                <div className="row">
                    <CardLink name='WMS' url={wms_url} color='bg-dark'/>
                    <CardLink name='WMTS' url={wmts_url} color='bg-dark'/>
                    <CardLink name='WFS' url={wfs_url} color='bg-dark'/>

                    <CardLink name='GEOJSON' link={true} url={geo_json_url} color='bg-dark'/>
                    <CardLink name='GML' link={true} url={gml_url} color='bg-dark'/>
                    <CardLink name='SHAPE FILE' link={true} url={shape_file_url} color='bg-dark'/>
                </div>
                }
                <div className="row mb-5">
                    <div className="col-2 mt-3 col-md-2 col-xl-2">
                        <div className="card">
                            <div className="card-body">
                                <div className="list-group">
                                    <div id="accordion1">
                                        {bundle.wms_list && bundle.wms_list.map((wms, idx) =>
                                            wms.layers.length > 0 &&
                                            <ul className="list-group" key={idx}>
                                                <li className="list-group-item"
                                                    id={`${idx}`}
                                                    data-toggle="collapse"
                                                    data-target={`#collapse-${idx+1}`}
                                                    aria-controls={`collapse-${idx+1}`}
                                                    >
                                                    <i className="icon expand-icon fa fa-plus" id={`${idx}`}></i>
                                                    &nbsp;&nbsp;{wms.name}
                                                </li>
                                                <div id={`collapse-${idx+1}`} className="ml-3 collapse list-group" data-parent={`#accordion1`}>
                                                    {wms.layers.map((layer, idx) =>
                                                        <div key={idx} className={layer_obj.id == layer.id ? "list-group-item list-group-item-action active" : 'list-group-item list-group-item-action'} onClick={() => this.setWms(wms, layer)}>
                                                            <a>{layer.name}</a>
                                                        </div>
                                                    )}
                                                </div>
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-10 mt-3 col-md-10 col-xl-10">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="text-center">{layer_obj.name}</h4>
                            </div>
                            <div className="card-body">
                                <InspireMap
                                    bundle={bundle}
                                    url={wms_url}
                                    code={layer_obj.code}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
