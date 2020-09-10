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

export class Cart extends Component{

    constructor(props) {
        super(props)
        this.div = []
        this.xy = []
        this.state = {
            coordinate: [],
            torf: false,
            data: [],
        }
        // this.addItem = this.addItem.bind(this)
        // this.showItem = this.showItem.bind(this)
        // this.showDiv = this.showDiv.bind(this)
        // this.handlePurchase = this.handlePurchase.bind(this)
        // this.checkDataForPurchase = this.checkDataForPurchase.bind(this)
          // this.cart = this.cart.bind(this)
    }

    componentDidMount(){
        console.log("",this.props.torf)
        const {coordinate, torf, content} = this.props
        if(torf == true){
            if(coordinate){
                var arr = [coordinate]
                console.log("didmount", arr)

                this.setState({data: arr})
            }
        }
    }

    componentWillReceiveProps(){
        if(this.props.torf == true){
            if(this.props.coordinate){
                var array = [this.props.coordinate]
                console.log("Array ", array)
                this.setState({
                    data: this.state.data.concat(array)
                })
            }
        }
    }

    // componentWillUpdate(pP,pS){
    //     console.log("------------------------------")
    //     console.log(pP.coordinate, this.props.coordinate)
    //     console.log("------------------------------")

    //     if(pP.coordinate !== this.props.coordinate){
    //     }
    // }

    checkDataForPurchase(){
        console.log("hudaldaj awah", this.state.data)
        service.purchaseFromCart(this.state.data)
            .then(({success}) => {
                if(success){
                    alert("Ajillasan")
                }
            }).catch(error => alert(error.text))
    }

    render(){
        const {coordinate, torf} = this.state
        console.log("in render",this.state.data)
        return(
            <div className="root">
                <div className="cart-list">
                <i className="fa fa-shopping-cart cart-size cart"></i>
                <div className="cart-count">
                    <span className="cart-count-span">
                        {this.state.data.length}
                    </span>
                </div>
                    {this.state.data}
                </div>
                <button type="button" className="btn gp-button-primary" onClick={() => this.checkDataForPurchase()}>
                    Худалдаж авах
                </button>
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

    showModal(coordinate, torf, content) {
        this.renderComponent({coordinate, torf, content})
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