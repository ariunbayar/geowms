import React, { Component } from "react"
import {service} from './service'


export class Дэлгэрэнгүй extends Component {

    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            values: {},
        }

        this.handleDelete = this.handleDelete.bind(this)

    }

    componentDidMount() {
        service.getDetail(this.state.id).then((values) => {
            this.setState({values})
        })
    }

    handleDelete(event) {
        event.preventDefault()
        service.remove(this.state.id).then(({success}) => {
            this.props.history.push('/back/суурь-давхарга/')
        })
    }

    render() {

        const {id, name, url, thumbnail_1x, thumbnail_2x} = this.state.values

        return (
            <div className="container my-4 shadow-lg p-3 mb-5 bg-white rounded">
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
                        <a href="#" onClick={this.handleDelete} className="btn btn-danger">Устгах</a>
                    </div>

                </div>
            </div>
        )
    }

}
