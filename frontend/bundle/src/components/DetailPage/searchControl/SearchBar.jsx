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
            zoom: 10,
            zoom1: 10,
            zoom2: 13,
            zoom3: 10,
            aimagid: -1,
            sumid: -1,
            BA:'',
            BB:'',
            BC:'',
            LA:'',
            LB:'',
            LC:'',
            point_id: '',
            error_msg: '',
            aimag: [],
            sum: []
        }

        this.handleSubmitCoordinate = this.handleSubmitCoordinate.bind(this)
        this.handleSubmitClear = this.handleSubmitClear.bind(this)
        this.handleSubmitCoordinateName = this.handleSubmitCoordinateName.bind(this)
        this.handleSubmitCoordinateGradus = this.handleSubmitCoordinateGradus.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.handleInputSum = this.handleInputSum.bind(this)
    }

    handleSubmitCoordinate(event) {
        event.preventDefault()
        // const coord = helpers.parseCoordinateString(this.state.coordinate)
        var array = [this.state.coordinatey, this.state.coordinatex]
        this.props.handleSetCenter(array, this.state.zoom)
    }

    handleSubmitClear(event) {
        event.preventDefault()
        this.setState({sumid: -1, aimagid: -1})
        var array = [103.525827, 46.723984]
        this.props.handleSetCenter(array, 5.041301562246971)
    }

    componentDidMount(){
        service.getAimags().then(({info, success}) => {
            if(success){
                this.setState({aimag: info})
                service.getSum("Хөвсгөл").then(({info, success}) => {
                    if(success){
                        this.setState({sum: info})
                    }
                    else{
                        this.setState({error_msg: info})
                    }setTimeout(() => {
                        this.setState({error_msg: ''})
                    }, 2222);
                })
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
                this.props.handleSetCenter(info, this.state.zoom2)
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
            this.props.handleSetCenter(array, this.state.zoom1)

        }
    }

    handleInput(e){
        if(e.target.value){
            this.setState({aimagid: e.target.value})
            this.setState({sumid: -1})
            const aimag_id = e.target.value
            const aiamg_data = this.state.aimag[aimag_id]
            var aimag_name = aiamg_data[2]


            var array = [aiamg_data[0], aiamg_data[1]]
            this.props.handleSetCenter(array, 7.555)


            service.getSum(aimag_name).then(({info, success}) => {
                if(success){
                    this.setState({sum: info})
                }
                else{
                    this.setState({error_msg: info})
                }setTimeout(() => {
                    this.setState({error_msg: ''})
                }, 2222);
            })
        }
    }
    handleInputSum(e){
        if(e.target.value){
            this.setState({sumid: e.target.value})
            const sum_id = e.target.value
            const sum_data = this.state.sum[sum_id]


            var array = [sum_data[0], sum_data[1]]
            this.props.handleSetCenter(array, 10.555)

        }
    }

    render() {
        const {error_msg} = this.state
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

                <form onSubmit={this.handleSubmitClear} className=" rounded shadow-sm p-3 mb-3 bg-white rounded">
                    <div className="form-group">
                        <label className="font-weight-bold" htmlFor="formGroupInput">Аймгаар хайх</label>
                        <div className="input-group mb-3">
                            <select name="center_typ" as="select"
                                onChange={this.handleInput}
                                value={this.state.aimagid}
                                className='form-control'>
                                <option value='-1'>--- Аймаг/Нийслэл сонгоно уу ---</option>
                                {this.state.aimag.map((data, idx) =>
                                    <option key={idx} value={idx}>{data[2]}</option>
                                )}
                            </select>
                            <select name="center_typ" as="select"
                                onChange={this.handleInputSum}
                                className='form-control'
                                value={this.state.sumid}
                                >
                                <option value="-1">--- Сум/дүүрэг сонгоно уу ---</option>
                                {this.state.sum.map((data, idx) =>
                                    <option key={idx} value={idx}>{data[2]}</option>
                                )}
                            </select>
                        </div>
                        <div className="input-group mb-3">
                            <div>
                                <button className="btn gp-btn-primary" type="submit"><i className="fa fa-trash mr-1"></i>Цэвэрлэх</button>
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
                        {/* <label className="font-weight-bold" htmlFor="formGroupInput">масштаб</label>
                        <div className="input-group mb-3">
                            <input type="number" className="form-control"
                                name="zoom2"
                                onChange={(e) => this.setState({zoom2: e.target.value}) }
                                value={this.state.zoom2}
                            />
                        </div> */}
                        <div className="input-group mb-3">
                            <div>
                                <button className="btn gp-btn-primary" type="submit"><i className="fa fa-search mr-1"></i>Хайх</button>
                            </div>
                        </div>
                    </div>
                </form>


                <form onSubmit={this.handleSubmitCoordinate} className=" rounded shadow-sm p-3 mb-3 bg-white rounded">
                    <div className="form-group">
                        <label className="font-weight-bold" htmlFor="formGroupInput">Байрлалаар хайх</label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Өргөрөг"
                                name="coordinate"
                                onChange={(e) => this.setState({coordinatex: e.target.value}) }
                                value={this.state.coordinate}
                            />
                            <input type="text" className="form-control" placeholder="Уртраг"
                                name="coordinate"
                                onChange={(e) => this.setState({coordinatey: e.target.value}) }
                                value={this.state.coordinate}
                            />
                        </div>
                        {/* <label className="font-weight-bold" htmlFor="formGroupInput">масштаб</label>
                        <div className="input-group mb-3">
                            <input type="number" className="form-control" placeholder="өргөрөг, уртраг"
                                name="zoom"
                                onChange={(e) => this.setState({zoom: e.target.value}) }
                                value={this.state.zoom}
                            />
                        </div> */}
                        <div className="input-group mb-3">
                            <div>
                                <button className="btn gp-btn-primary" type="submit"><i className="fa fa-search mr-1"></i>Хайх</button>
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
                        {/* <label className="font-weight-bold" htmlFor="formGroupInput">масштаб</label>
                        <div className="input-group mb-3">
                            <input type="number" className="form-control" placeholder="өргөрөг, уртраг"
                                name="zoom1"
                                onChange={(e) => this.setState({zoom1: e.target.value}) }
                                value={this.state.zoom1}
                            />
                        </div> */}
                        <div className="input-group mb-3">
                            <div>
                                <button className="btn gp-btn-primary" type="submit"><i className="fa fa-search mr-1"></i>Хайх</button>
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

    showSideBar( handleSetCenter, islaod) {
        this.toggleControl(islaod)
        this.renderComponent({ handleSetCenter})
    }

}
