import React, { Component } from "react"
import {service} from './service'
import Modal from "../Modal"


export class Дэлгэрэнгүй extends Component {

    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            values: {},
            showModal: false,
            modalTitle: null,
            modalText: null,
        }

        this.handleDelete = this.handleDelete.bind(this)
        this.modalTrue = this.modalTrue.bind(this)

    }

    componentDidMount() {
        service.getDetail(this.state.id).then((values) => {
            this.setState({values})
        })
    }
    modalClose() {
        this.setState({showModal: false})
    }
    handleDelete() {
        service.remove(this.state.id).then(({success}) => {
            this.props.history.push('/back/суурь-давхарга/')
        })
        this.modalClose()
    }

    modalTrue(event) {
        event.preventDefault()
        this.setState({showModal: true,  modalTitle: "Та итгэлтэй байна уу? ", modalText: this.state.values.name })
    }

    render() {

        const {id, name, url, thumbnail_1x, thumbnail_2x} = this.state.values
        const {showModal, modalText, modalTitle} = this.state

        return (
            <div className="container my-4">
                <Modal 
                    showModal={showModal} 
                    modalClose={() => this.modalClose()}
                    modalAction={() => this.handleDelete()}
                    text={modalText}
                    title={modalTitle}
                    >
                </Modal>
                <div className="row">
                    <div className="col-md-12 mb-4">
                        <a href="#" className="btn btn-outline-primary" onClick={this.props.history.goBack}>
                            <i className="fa fa-angle-double-left"></i> Буцах
                        </a>
                    </div>
                </div>
                <div className="row">

                    <div className="col-md-12 mb-4">
                        <strong>{name}</strong>
                    </div>

                    <div className="col-md-12 mb-4">
                        <small className="text-muted">{url}</small>
                    </div>

                    <div className="col-md-12 mb-4">
                        <img src={thumbnail_1x} srcset={thumbnail_2x + ' 2x'}/>
                    </div>

                    <div className="col-md-12 mb-4">
                        <a href="#" onClick={this.modalTrue} className="btn btn-danger">Устгах</a>
                    </div>

                </div>
            </div>
        )
    }

}
