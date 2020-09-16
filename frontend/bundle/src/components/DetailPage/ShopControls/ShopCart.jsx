import React, {Component} from "react"
import ReactDOM from 'react-dom'
import {Control} from 'ol/control'
import {service} from '../service'
import { toStringHDMS } from "ol/coordinate"
import Corner from "ol/extent/Corner"
import { array } from "yup"
import { CompilationStatus } from "webpack-build-notifier/dist/types"
import OverlayPositioning from "ol/OverlayPositioning"
import { set } from "ol/transform"
import { withRouter } from 'react-router-dom';
import { Route, Link, BrowserRouter as Router, Switch } from "react-router-dom";
import { identityTransform } from "ol/proj"
export class Cart extends Component{

    constructor(props) {
        super(props)
        this.div = []
        this.xy = []
        this.state = {
            coordinate: [],
            torf: false,
            data: [],
            x: null,
            y: null,
            is_button: false,
            is_purchase: false,
            alert_msg: '',
        }

        this.removeList = this.removeList.bind(this)
        this.checkDataForPurchase = this.checkDataForPurchase.bind(this)
    }

    componentDidMount(){
        console.log("did mount",this.props.content)
        const {coordinate, torf, content} = this.props
        if(torf == true){
            if(content.length !== 0){
                var arr = [this.props.content[0][1][2]]
                var arr1 = [this.props.content[0][1][0]]
                var json = [{ 'name': arr[0][1] ,'id': arr1[0][1] }]
                this.setState({ data: json, is_button: false, })
            }
        }
    }

    componentDidUpdate(pP, pS){
        console.log("did update")
        if(pP.coordinate !== this.props.coordinate){
            if(this.props.torf == true){
                if(this.props.content.length !== 0){
                    var arr = [this.props.content[0][1][2]]
                    var arr1 = [this.props.content[0][1][0]]
                    var json = [{ 'name': arr[0][1] ,'id': arr1[0][1] }]
                    const isBelowThreshold = (currentValue) => currentValue = json.name;
                    const found = this.state.data.filter(element => {
                         return element.id == json[0].id
                    }).length > 0
                    console.log('found', found)
                    if(!found){
                        this.setState({
                            data: this.state.data.concat(json),
                            is_button: false,
                        })
                    }
                    else{
                        this.setState({ alert_msg: "Адилхан цэг байна !", success: false })
                        setTimeout(() => {
                            this.setState({ alert_msg: '', success: false})
                        }, 2000);
                    }
                }
            }
        }
        if(pS.data !== this.state.data){
            if(this.state.data.length == 0){
                this.setState({ is_button: true })
            }
        }
    }

    removeList(coordinate){
        const {data} = this.state
        console.log("ustgah", coordinate)
        if(data.length == 1){
            this.setState({
                data: [],
            })
        }
        if(data.length > 1){
            const isBelowThreshold = (coordinateFromArray) => coordinateFromArray = coordinate;
            if(data.every(isBelowThreshold)){
                console.log("tentsuu data: ", coordinate)
                var array = data.filter((item) =>{
                    return item.id !== coordinate
                })
                this.setState({
                    data: array,
                })
            }
        }
    }

    checkDataForPurchase(){
        this.setState({ is_purchase: true })
        console.log("hudaldaj awah", this.state.data)
        if(this.state.data.length > 0){
            service.purchaseFromCart(this.state.data, this.props.code)
                .then(({success, msg, payment}) => {
                    if(success){
                        this.setState({ alert_msg: msg, success })
                        setTimeout(() => {
                            //this.props.history(`/payment/purchase/${payment}/`)
                            this.setState({ data: [], is_purchase: false, is_button: true })
                            window.location.href=`/payment/purchase/${payment}/`;
                        }, 1000);
                    }
                    if(!success){
                        this.setState({ is_purchase: false, is_button: false, alert_msg: msg })
                        setTimeout(() => {
                            this.setState({ alert_msg: '' })
                        }, 2000);
                    }
                }).catch(error => alert("Алдаа гарсан тул хуудсыг дахин ачааллуулна уу"))
        }
        else{
            this.setState({ alert_msg: "Уучлаарай сагс хоосон байна" })
        }
    }

    render(){
        const {coordinate, torf, data, is_button, alert_msg, success } = this.state
        const {x, y} = this.props
        console.log("in render",this.state.data)
        if(data.length > 0){
            this.div = []
            data.map((data, key) => {
                this.div.push(
                    <div className="rounded bg-light card-baraa row shadow-sm bg-white"  key={key}>
                        <div className="col-md-10 name">{data.name} </div>
                        <div className="col-md-1 icon"> <i type="button" className="fa fa-trash text-danger" onClick={() => this.removeList(data.id)}></i></div>
                    </div>
                )
            })
        }
        else{
            this.div = []
        }
        return(
            <div className="root">
                {
                    alert_msg !== '' && success
                    ?
                    <div className="alert alert-success alert-custom-css" role="alert">
                        {alert_msg}
                    </div>
                    :
                    <div className={`alert alert-danger alert-custom-css `+ (alert_msg !== '' ? 'd-block': 'd-none')} role="alert">
                        {alert_msg}
                    </div>
                }
                <div>
                <div className="cart-button">
                    <div className="card-count">
                        <span classname="cart-count-span text-success">
                            {this.state.data.length}
                        </span>
                    </div>
                    <div className="card-icon">
                        <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                    </div>
                </div>
                <div className="cart-list">
                    {this.div}

                    {this.state.is_purchase ?
                        <button className="btn gp-btn-primary" disabled>
                            <div className="spinner-border" role="status">
                                <span className="sr-only"></span>
                            </div>
                            {} Түр хүлээнэ үү...
                        </button> :
                        <button
                            className="btn gp-btn-primary pay-button my-4"
                            onClick={() => this.checkDataForPurchase()}
                            disabled = {is_button}
                        >
                            Худалдаж авах
                        </button>
                    }
                    </div>
                </div>
            </div>
        )
    }
}

export class ShopCart extends Control {

    constructor(opt_options) {
        const options = opt_options || {}
        super({
            element: document.createElement('div'),
            target: options.target,
        })

        this.is_component_initialized = true
        this.is_cart = false

        this.element.className = 'd-block'

        this.renderComponent = this.renderComponent.bind(this)
        this.showModal = this.showModal.bind(this)
        this.setClass = this.setClass
        this.render = this.render.bind(this)

    }

    renderComponent(props) {
        if (!this.is_component_initialized) {
            ReactDOM.render(<Cart {...props}/>, this.element)
            this.is_component_initialized = true
        }

        ReactDOM.hydrate(<Cart {...props}/>, this.element)
    }

    showModal(coordinate, torf, x, y, content, code) {
        console.log("from Cart", content)
        this.renderComponent({coordinate, torf, x, y, content, code})
        if(torf){
            // this.setClass()
        }
    }

    setClass(){
        this.root.className = 'h1'
        this.root.innerText = "Захиалгууд"
        console.log(this.root)
    }
}