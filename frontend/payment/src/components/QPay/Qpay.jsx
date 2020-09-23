import React, { Component } from "react"
import {service} from './service'
// import { Timer } from './timeCount'

export class QPay extends Component {

    constructor(props) {
        super(props)
        this.state = {
            qPay_QRimage: '',
            purchase_id: props.purchase_id,
            qpay_open: false,
            msg: '',
            minutes: 5,
            seconds: 0,
            error_message: ''
        }
        this.payCheck = this.payCheck.bind(this)
        this.close = this.close.bind(this)
        this.timerRemaining = this.timerRemaining.bind(this)
    }

    componentDidMount(){
        if(this.state.qpay_open){
            this.timerRemaining()
            this.HandleCreateQpay()
        }
    }

    close(callback){
        callback()
    }

    componentDidUpdate(prevProps){
        if(prevProps.qpay_open !== this.props.qpay_open)
        {
            if(this.props.qpay_open)
            {
                this.setState({minutes:5, seconds:0, qPay_QRimage: ''})
                this.timerRemaining()
                this.HandleCreateQpay()
            }
            else{
                clearInterval(this.myInterval)
            }
        }
    }

    HandleCreateQpay(){
        const { purchase_id } = this.state
        const { price } = this.props
        service.handleCreateQpay(price, purchase_id).then(({qPay_QRimage, success, error_message}) => {
            if(success)
            {
                this.props.history(`/profile/all/api/details/${purchase_id}/`)
            }
            else
            {
                if(error_message){
                    this.setState({error_message})
                }
                this.setState({qPay_QRimage})
                this.payCheck(this.props.qpay_open)
            }
        })

    }

    payCheck(check){
        const { purchase_id } = this.state
        if(check){
            service.check(purchase_id).then(({success, msg}) => {
                if(success)
                {
                    this.close(this.props.handleClose)
                    this.props.history(`/profile/all/api/details/${purchase_id}/`)
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
        const { msg, minutes, seconds, qPay_QRimage, error_message } = this.state
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
                    (qPay_QRimage != [] ? 
                        <img className="shadow p-3 mb-5 bg-white rounded" src={"data:image/png;base64," +  qPay_QRimage} />:
                        <div className="my-5">
                            <div className="spinner-border gp-text-primary my-5" role="status">
                                <i className="fas fa-cog fa-spin"></i>
                            </div>
                        </div>
                    ):
                    <h6 className="text-success">{error_message}</h6>}
            </div>
        )
    }
}
