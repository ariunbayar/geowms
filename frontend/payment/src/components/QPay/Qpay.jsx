import React, { Component } from "react"
import {service} from './service'
// import { Timer } from './timeCount'

export class QPay extends Component {

    constructor(props) {
        super(props)
        this.state = {
            qPay_QRimage: [],
            purchase_id: props.purchase_id,
            qpay_open: false,
            msg: '',
            minutes: 5,
            seconds: 0,
        }
        this.payCheck = this.payCheck.bind(this)
        this.close = this.close.bind(this)
        this.timerRemaining = this.timerRemaining.bind(this)
    }

    componentDidMount(){
    }

    close(callback){
            callback()
    }

    componentDidUpdate(prevProps){
        if(prevProps.qpay_open !== this.props.qpay_open)
        {
            if(this.props.qpay_open)
            {
                this.payCheck(this.props.qpay_open)
                this.setState({minutes:5, seconds:0})
                this.timerRemaining()
                this.HandleCreateQpay()
            }
            else{
                this.payCheck(this.props.qpay_open)
                clearInterval(this.myInterval)
            }
        }
    }

    HandleCreateQpay(){
        const { purchase_id } = this.state
        const { price } = this.props
        service.handleCreateQpay(price, purchase_id).then(({qPay_QRimage, error_message, success, msg}) => {
            if(success)
            {
                this.props.history(`/payment/success/${purchase_id}/`)
            }
            else
            {
                if(msg){
                    this.setState({msg})
                    this.close(this.props.handleClose)
                }
                this.setState({qPay_QRimage, error_message})
            }
        })

    }

    payCheck(check){
        const { purchase_id } = this.state
        if(check){
            service.check(purchase_id).then(({success, error_message, msg}) => {
                if(success)
                {
                    this.setState({error_message:error_message})
                    this.close(this.props.handleClose)
                    this.timerRemaining()

                    this.props.history(`/payment/success/${purchase_id}/`)
                }
                else{
                    if(msg){
                        this.setState({msg})
                        this.close(this.props.handleClose)
                    }
                    setTimeout(() => {
                        this.payCheck(this.props.qpay_open)
                    }, 5000)
                }
            })
        }
    }

    timerRemaining(){
        this.myInterval = setInterval(() => {
            const { seconds, minutes } = this.state
            if (seconds > 0) {
                this.setState(({ seconds }) => ({
                    seconds: seconds - 1
                }))
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    this.close(this.props.handleClose)
                    clearInterval(this.myInterval)
                } else {
                    this.setState(({ minutes }) => ({
                        minutes: minutes - 1,
                        seconds: 59
                    }))
                }
            }
        }, 1000)
    }

    render() {
        const {error_message, msg, minutes, seconds, qPay_QRimage} = this.state
        return (
            <div className="container text-center">
                <div>
                    {qPay_QRimage != []
                        ?
                        ( minutes === 0 && seconds === 0
                            ? <h1>Дууссан!</h1>
                            : <h1>Хугацаа: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
                        )
                        :
                        null
                    }
                </div>
                {
                    msg != ''
                    ?
                        <div className="alert alert-danger position-absolute" role="alert">{msg}</div>
                    :
                    null
                }
                <h1 className="text-succes gp-text-primary"></h1>
                <h1 className="text-succes gp-text-primary">QR Code уншуулна уу.</h1><br></br>
                {error_message == '' ?
                    <img className="shadow p-3 mb-5 bg-white rounded" src={"data:image/png;base64," +  qPay_QRimage} />:
                    <h6 className="text-success">{error_message}</h6>}
            </div>
        )
    }
}
