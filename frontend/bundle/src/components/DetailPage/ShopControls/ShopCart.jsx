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
        }
        // this.addItem = this.addItem.bind(this)
        // this.showItem = this.showItem.bind(this)
        // this.showDiv = this.showDiv.bind(this)
        // this.handlePurchase = this.handlePurchase.bind(this)
        // this.checkDataForPurchase = this.checkDataForPurchase.bind(this)
          // this.cart = this.cart.bind(this)
        this.removeList = this.removeList.bind(this)
    }

    componentDidMount(){
        console.log("",this.props.torf)
        const {coordinate, torf, content} = this.props
        if(torf == true){
            if(content){
                var arr = [content[0][0]]
                this.setState({ data: arr })
            }
        //     if(coordinate){
        //         var arr = [coordinate]
        //         console.log("didmount", arr)

        //         this.setState({data: arr})
        //     }
        }
    }

    componentDidUpdate(pP){
        if(pP.coordinate !== this.props.coordinate){
            if(this.props.torf == true){
                var arr = [this.props.content[0][0]]
                this.setState({
                    data: this.state.data.concat(arr)
                })
                // if(this.props.coordinate){
                //     var array = [this.props.coordinate]
                //     console.log("Array ", array)
                //     this.setState({
                //         data: this.state.data.concat(array)
                //     })
                // }
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

    removeList(coordinate){
        const {data} = this.state
        console.log("ustgah", coordinate)
        if(data.length == 1){
            this.setState({
                data: []
            })
        }
        if(data.length > 1){
            const isBelowThreshold = (coordinateFromArray) => coordinateFromArray = coordinate;
            if(data.every(isBelowThreshold)){
                console.log("tentsuu data: ", coordinate)
                var array = data.filter((item) =>{
                    return item !== coordinate
                })
                this.setState({
                    data: array
                })
            }
        }
    }

    checkDataForPurchase(){
        console.log("hudaldaj awah", this.state.data)
        if(name !== ''){
            service.purchaseFromCart(this.state.data)
                .then(({success, msg, payment}) => {
                    if(success){
                        this.setState({ data: []})
                        setTimeout(() => {
                            // this.props.history.push(`/payment/purchase/${payment}/`)
                            window.location.href=`/payment/purchase/${payment}/`;
                        }, 1000);
                        console.log(msg)
                    }
                    if(!success){
                        alert(msg)
                    }
                }).catch(error => alert(error.text))
        }
    }

    render(){
        const {coordinate, torf, data} = this.state
        const {x, y} = this.props
        console.log("in render",this.state.data)
        if(data.length > 0){
            this.div = []
            data.map((data, key) =>{
                this.div.push(<li key={key}>{data} <button type="button" className="fa fa-trash" onClick={() => this.removeList(data)}>Устгах</button></li>)
            })
        }
        else{
            this.div = []
        }
        return(
            <div className="root">
                <div ></div>
                <div className="cart-list">
                <i className="cart-count fa fa-shopping-cart cart-size cart"></i>
                <div className="cart-count">
                    <span className="cart-count-span">
                        {this.state.data.length}
                    </span>
                </div>
                    <ul>
                        {this.div}
                    </ul>
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

    showModal(coordinate, torf, x, y, content) {
        console.log("from Cart", coordinate)
        this.renderComponent({coordinate, torf, x, y, content})
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