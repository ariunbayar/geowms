import React, { Component, Fragment } from "react"

import {helpers} from '../../../helpers'
import ReactDOM from 'react-dom'
import {Control} from 'ol/control'
import {CLASS_CONTROL, CLASS_HIDDEN} from 'ol/css.js'
import { service } from "../service"


class SearchBarComponent extends Component {

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
            aimag_id: -1,
            sum_id: -1,
            horoo_id: -1,
            BA:'',
            BB:'',
            BC:'',
            LA:'',
            LB:'',
            LC:'',
            point_id: '',
            error_msg: '',
            aimag: [],
            sum: [],
            horoo: [],
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
            ]
        }

        this.handleSubmitCoordinate = this.handleSubmitCoordinate.bind(this)
        this.handleSubmitClear = this.handleSubmitClear.bind(this)
        this.handleSubmitCoordinateName = this.handleSubmitCoordinateName.bind(this)
        this.handleSubmitCoordinateGradus = this.handleSubmitCoordinateGradus.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.handleInputSum = this.handleInputSum.bind(this)
        this.resetButton = this.resetButton.bind(this)
        this.setCenterOfMap = this.setCenterOfMap.bind(this)
        this.getGeom = this.getGeom.bind(this)
    }

    handleSubmitCoordinate(event) {
        event.preventDefault()
        // const coord = helpers.parseCoordinateString(this.state.coordinate)
        const coordinates = [this.state.coordinatey, this.state.coordinatex]
        this.props.handleSetCenter(coordinates, this.state.bairlal_one_zoom)
        this.props.setFeatureOnMap(undefined, coordinates, this.state.bairlal_scale)
    }

    handleSubmitClear(event) {
        event.preventDefault()
        this.setState({ sum_id: -1, aimag_id: -1 })
        this.setCenterOfMap()
        this.props.resetShowArea()
    }

    componentDidMount(){
        service.getAimags().then(({info, success}) => {
            if(success){
                this.setState({ aimag: info })
            }
            else{
                this.setState({error_msg: info})
            }setTimeout(() => {
                this.setState({error_msg: ''})
            }, 2222);
        })
    }

    handleSubmitCoordinateName(event) {
        event.preventDefault()
        service.searchPoint(this.state.point_id).then(({info, success}) => {
            if(success){
                this.props.handleSetCenter(info, parseInt(this.state.tseg_dugaar_zoom))
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
            this.props.handleSetCenter(array, this.state.bairlal_two_zoom)

        }
    }

    getGeom(geo_id) {
        service
            .getGeom(geo_id)
            .then(({ feature }) => {
                if (feature) {
                    this.props.setFeatureOnMap(feature)
                }
            })
            .catch((error) => alert("Алдаа гарсан байна"))
    }

    handleInput(e){
        if(e.target.value){
            const aimag_id = e.target.value
            if (aimag_id !== '-1') {
                this.setState({ aimag_id, sum_id: -1, horoo_id: -1 })

                const aimag_data = this.state.aimag[aimag_id]

                this.getGeom(aimag_data.geo_id)

                this.setState({ sum: aimag_data.children })
            }
            else {
                this.setState({ aimag_id: -1, sum_id: -1, horoo_id: -1 })
                this.resetButton()
            }
        }
    }

    handleInputSum(e, field, array){
        if(e.target.value){
            const id = e.target.value
            if (id !== '-1') {
                this.setState({ [field]: id })

                const data = array[id]

                this.getGeom(data.geo_id)

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
                this.getGeom(this.state[array_name][this.state[array_name + '_id']].geo_id)

            }
        }
    }

    setCenterOfMap() {
        var array = [103.525827, 46.723984]
        this.props.handleSetCenter(array, 5.041301562246971, false)
    }

    resetButton() {
        this.setState({ bairlal_one_zoom: 7.3376399772248575, bairlal_scale: 5000000 })
        this.setCenterOfMap()
        this.props.resetShowArea()
    }

    render() {
        const {error_msg, sum, aimag, options_scale, horoo} = this.state
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

                <form onSubmit={this.handleSubmitClear} className="rounded shadow-sm p-3 mb-3 bg-white rounded">
                    <div className="form-group">
                        <label className="font-weight-bold" htmlFor="formGroupInput">Аймгаар хайх</label>
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
                        <div className="input-group mb-3">
                            <div>
                                <button
                                    className="btn gp-btn-primary"
                                    type="submit"
                                >
                                    <i className="fa fa-trash mr-1"></i>Цэвэрлэх
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

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
            </div>
        )
    }
}

export class SearchBar extends Control {

    constructor(opt_options) {

        const options = opt_options || {}

        super({
            element: document.createElement('div'),
            target: options.target,
        })

        this.is_component_initialized = false
        const cssClasses = `col-md-3 ⚙-search rounded bg-light ${CLASS_HIDDEN}`

        this.element.className = cssClasses
        this.renderComponent = this.renderComponent.bind(this)
        this.toggleControl = this.toggleControl.bind(this)
    }

    toggleControl(is_visible) {
        this.element.classList.toggle(CLASS_HIDDEN, is_visible)

    }

    renderComponent(props) {
        if (!this.is_component_initialized) {
            ReactDOM.render(<SearchBarComponent {...props}/>, this.element)
            this.is_component_initialized = true
        }

        ReactDOM.hydrate(<SearchBarComponent {...props}/>, this.element)
    }

    showSideBar(handleSetCenter, islaod, showOnlyArea, resetShowArea, setFeatureOnMap) {
        this.toggleControl(islaod)
        this.renderComponent({ handleSetCenter, showOnlyArea, resetShowArea, setFeatureOnMap })
    }
}
