import React, { Component } from "react"

import Modal from "@utils/Modal/Modal"
import * as utils from "@helpUtils/ol"

import AdministrativeUnitSearch from "./components/AdministrativeUnitSearch"
import PropertySearch from "./components/PropertySearch"

import { service } from "../service"
import './style.css'


const MNZOOM = 5.041301562246971
const MNCENTER = [103.525827, 46.723984]

export class SearchBarComponent extends Component {

    constructor(props) {

        super(props)

        this.state = {
            coordinatex: '',
            coordinatey: '',
            bairlal_one_zoom: 7.3376399772248575,
            bairlal_two_zoom: 7.3376399772248575,
            tseg_dugaar_zoom: 7.3376399772248575,
            bairlal_scale: 5000000,
            zoom3: 10,
            BA:'',
            BB:'',
            BC:'',
            LA:'',
            LB:'',
            LC:'',
            point_id: '',
            error_msg: '',
            feature_ids: [],
            options_scale: [
               {'zoom': '2.9903484967519145', 'scale': 5000000},
               {'zoom': '4.3576399772248543', 'scale': 1000000},
               {'zoom': '7.3376399772248575', 'scale': 100000},
               {'zoom': '8.738265134288114', 'scale': 50000},
               {'zoom': '9.721598467621447', 'scale': 25000},
               {'zoom': '10.781598467621446', 'scale': 10000},
               {'zoom': '12.194931800954776', 'scale': 5000},
               {'zoom': '14.383305008368451', 'scale': 1000},
            ],
            bundle_id: props.bundle_id,
            modal_status: 'closed',
            aimag: [],
        }

        this.handleSubmitCoordinate = this.handleSubmitCoordinate.bind(this)
        this.handleSubmitCoordinateName = this.handleSubmitCoordinateName.bind(this)
        this.handleSubmitCoordinateGradus = this.handleSubmitCoordinateGradus.bind(this)
        this.resetButton = this.resetButton.bind(this)
        this.getGeom = this.getGeom.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.resetSearchLayerFeatures = this.resetSearchLayerFeatures.bind(this)
    }

    handleSubmitCoordinate(event) {
        event.preventDefault()
        // const coord = helpers.parseCoordinateString(this.state.coordinate)
        const coordinates = [this.state.coordinatey, this.state.coordinatex]
        utils.setCenter(coordinates, this.state.bairlal_one_zoom)
        this.props.setFeatureOnMap(undefined, coordinates, this.state.bairlal_scale)
    }

    componentDidMount() {
        service.getAimags()
            .then(({ info, success }) => {
                if(success){
                    this.setState({ aimag: info })
                }
                else{
                    this.setState({ error_msg: info })
                }
                setTimeout(() => {
                    this.setState({ error_msg: '' })
                }, 2222);
            })
    }

    handleSubmitCoordinateName(event) {
        event.preventDefault()
        service.searchPoint(this.state.point_id).then(({info, success}) => {
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

    handleSubmitCoordinateGradus(event) {
        event.preventDefault()
        const {BA, BB, BC, LA, LB, LC} = this.state
        if (BA > 40 && BB > 0 && BC > 0 && LA > 40 && LB > 0 && LC > 0)
        {
            var LL=(LB/60+LA)
            var X=((LC/3600)+(LB/60)+LA-LL) + LL
            var BBB=(BB/60+BA)
            var Bbut=(BC/3600)+(BB/60)+BA-BBB
            var niitB=Bbut+BBB
            var array = [X, niitB]
            utils.setCenter(array, this.state.bairlal_two_zoom)

        }
    }

    async getGeom(geo_id, refreshLayerFn) {

        // try {
        const { success, data } = await service.getGeom(geo_id)
        if (data) {
            this.props.setFeatureOnMap(data, refreshLayerFn)
        }
        else {
            this.modalChange(
                'fa fa-exclamation-circle',
                '',
                'warning',
                'GEOM өгөгдөл байхгүй байна',
                '',
                false,
                '',
                '',
                null,
                null
            )
        }
        return data
        // }
        // catch {
            // alert("Алдаа гарсан байна")
            // return
        // }
    }

    setCenterOfMap() {
        utils.setCenter(MNCENTER, MNZOOM)
    }

    resetSearchLayerFeatures() {
        this.props.map_wms_list.map(({ layers, is_display }, idx) => {
            if (is_display) {
                layers.map(({ checked, tile, wms_tile, wms_or_cache_ur }, l_idx) => {
                    if (checked) {
                        wms_or_cache_ur ? tile.setVisible(checked) : wms_tile.setVisible(checked)
                    }
                })
            }
        })
    }

    resetButton() {
        this.setState({ bairlal_one_zoom: 7.3376399772248575, bairlal_scale: 5000000 })
        this.setCenterOfMap()
    }

    handleModalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    modalChange(modal_icon, modal_bg, icon_color, title, text, has_button, actionNameBack, actionNameDelete, modalAction, modalClose) {
        this.setState(
            {
                modal_icon,
                modal_bg,
                icon_color,
                title,
                text,
                has_button,
                actionNameBack,
                actionNameDelete,
                modalAction,
                modalClose,
            },
            () => this.handleModalOpen()
        )
    }

    render() {
        const { error_msg, options_scale, bundle_id } = this.state
        return (
            <div>
                {/* <div className="form-group  rounded shadow-sm p-3 mb-3 bg-white rounded">
                    <label className="font-weight-bold" htmlFor="formGroupInput">Нэрэлбэрээр хайх</label>
                    <div className="input-group mb-3">

                        <input type="text" className="form-control" placeholder="хайх утга" aria-label="" aria-describedby=""/>
                        <div className="input-group-append">
                            <button className="btn gp-btn-primary" type="button"><i className="fa fa-search mr-1" aria-hidden="true"></i>Хайх</button>
                        </div>
                    </div>
                </div> */}

                <PropertySearch
                    getGeom={this.getGeom}
                    bundle_id={bundle_id}
                />

                <AdministrativeUnitSearch
                    setCenterOfMap={() => this.setCenterOfMap()}
                    resetButton={this.resetButton}
                    aimag={this.state.aimag}
                    map_wms_list={this.props.map_wms_list}
                    resetSearchLayerFeatures={this.resetSearchLayerFeatures}
                    getGeom={this.getGeom}
                    vector_layer={this.props.vector_layer}
                    funcs={this.props.funcs}
                />

                <form onSubmit={this.handleSubmitCoordinateName} className=" rounded shadow-sm p-3 mb-3 bg-white rounded">
                    <div className="form-group">
                        <label className="font-weight-bold" htmlFor="formGroupInput">Цэгийн дугаараар хайх</label>
                        <br></br>
                        {error_msg ? <label className="text-danger" htmlFor="formGroupInput">{error_msg}</label>: null}
                        <div className="input-group mb-3">
                            <input type="text" className="form-control"
                                name="point_id"
                                onChange={(e) => this.setState({point_id: e.target.value}) }
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
                        <div className="input-group mb-3">
                            <div>
                                <button className="btn gp-btn-primary my-3" type="submit"><i className="fa fa-search mr-1"></i>Хайх</button>
                            </div>
                        </div>
                    </div>
                </form>


                <form onSubmit={(e) => this.handleSubmitCoordinate(e)} className=" rounded shadow-sm p-3 mb-3 bg-white rounded">
                    <div className="form-group">
                        <label className="font-weight-bold" htmlFor="formGroupInput">Байрлалаар хайх</label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Өргөрөг"
                                name="Өргөрөг"
                                onChange={(e) => this.setState({coordinatex: e.target.value}) }
                                value={this.state.coordinate}
                            />
                            <input type="text" className="form-control" placeholder="Уртраг"
                                name="Уртраг"
                                onChange={(e) => this.setState({coordinatey: e.target.value}) }
                                value={this.state.coordinate}
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
                        <div className="mb-3">
                            <div className="row">
                                <div className="col-md-5">
                                    <button className="btn gp-btn-primary my-3" type="submit"><i className="fa fa-search mr-1"></i>Хайх</button>
                                </div>
                                <div className="col-md-7 d-flex flex-row-reverse">
                                    <button className="btn gp-btn-primary my-3" type="button" onClick={this.resetButton}><i className="fa fa-trash mr-1"></i>Цэвэрлэх</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <form onSubmit={this.handleSubmitCoordinateGradus} className=" rounded shadow-sm p-3 mb-3 bg-white rounded">
                    <div className="form-group">
                        <label className="font-weight-bold" htmlFor="formGroupInput">Өргөрөг</label>
                        <div className="input-group mb-3">
                            <label className="font-weight-bold" htmlFor="formGroupInput"></label>
                            <input type="text" className="form-control" placeholder="Градус X"
                                name="BA"
                                onChange={(e) => this.setState({BA: parseFloat(e.target.value)}) }
                                value={this.state.BA}
                            />
                            <input type="text" className="form-control" placeholder="Минут X"
                                name="BB"
                                onChange={(e) => this.setState({BB: parseFloat(e.target.value)}) }
                                value={this.state.BB}
                            />
                            <input type="text" className="form-control" placeholder="Секунд X"
                                name="BC"
                                onChange={(e) => this.setState({BC: parseFloat(e.target.value)}) }
                                value={this.state.BC}
                            />
                        </div>
                        <label className="font-weight-bold" htmlFor="formGroupInput">Уртраг</label>
                        <div className="input-group mb-3">
                            <input type="number" className="form-control" placeholder="Градус Y"
                                name="LA"
                                onChange={(e) => this.setState({LA: parseFloat(e.target.value)}) }
                                value={this.state.LA}
                            />
                            <input type="number" className="form-control" placeholder="Минут Y"
                                name="LB"
                                onChange={(e) => this.setState({LB: parseFloat(e.target.value)}) }
                                value={this.state.LB}
                            />
                            <input type="number" className="form-control" placeholder="Секунд Y"
                                name="LC"
                                onChange={(e) => this.setState({LC: parseFloat(e.target.value)}) }
                                value={this.state.LC}
                            />
                        </div>
                        <label className="font-weight-bold" htmlFor="formGroupInput">масштаб</label>
                        <select name="bairlal_two_zoom" as="select"
                            onChange={(e) => this.setState({bairlal_two_zoom: e.target.value}) }
                            value={this.state.bairlal_two_zoom}
                            className='form-control'
                        >
                            {
                                options_scale.map((option, idx) =>
                                    <option key={idx} value={option.zoom}>{option.scale}</option>
                                )
                            }
                        </select>
                        <div className="input-group mb-3">
                            <div>
                                <button className="btn gp-btn-primary my-3" type="submit"><i className="fa fa-search mr-1"></i>Хайх</button>
                            </div>
                        </div>
                    </div>
                </form>
                <Modal
                    modal_status={ this.state.modal_status }
                    modal_icon={ this.state.modal_icon }
                    modal_bg={ this.state.modal_bg }
                    icon_color={ this.state.icon_color }
                    title={ this.state.title }
                    text={ this.state.text }
                    has_button={ this.state.has_button }
                    actionNameBack={ this.state.actionNameBack }
                    actionNameDelete={ this.state.actionNameDelete }
                    modalAction={ this.state.modalAction }
                    modalClose={ this.state.modalClose }
                />
            </div>
        )
    }
}

// export class SearchBar extends Control {

//     constructor(opt_options) {

//         const options = opt_options || {}

//         super({
//             element: document.createElement('div'),
//             target: options.target,
//         })

//         this.is_component_initialized = false
//         const cssClasses = `col-md-3 ⚙-search rounded bg-light ${CLASS_HIDDEN}`

//         this.element.className = cssClasses
//         this.renderComponent = this.renderComponent.bind(this)
//         this.toggleControl = this.toggleControl.bind(this)
//     }

//     toggleControl(is_visible) {
//         this.element.classList.toggle(CLASS_HIDDEN, is_visible)

//     }

//     renderComponent(props) {
//         if (!this.is_component_initialized) {
//             ReactDOM.render(<SearchBarComponent {...props}/>, this.element)
//             this.is_component_initialized = true
//         }

//         ReactDOM.hydrate(<SearchBarComponent {...props}/>, this.element)
//     }

//     showSideBar(handleSetCenter, islaod, showOnlyArea, resetShowArea, setFeatureOnMap) {
//         this.toggleControl(islaod)
//         this.renderComponent({ handleSetCenter, showOnlyArea, resetShowArea, setFeatureOnMap })
//     }
// }
