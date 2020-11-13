import React, { Component, Fragment } from "react"
import Modal from "../Modal"

import {service} from './service'


class DiskItem extends Component {

    constructor(props) {
        super(props)

        this.readableFileSize = this.readableFileSize.bind(this)
        this.formatPercent = this.formatPercent.bind(this)
    }

    readableFileSize(bytes) {
       if(bytes == 0) return '0 Bytes';
       var k = 1000,
           dm = 2,
           sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
           i = Math.floor(Math.log(bytes) / Math.log(k));
       return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    formatPercent(current, total) {
        return (100 * current / total).toFixed(1) + '%'
    }

    render() {

        const { disk } = this.props
        const size_used = this.readableFileSize(disk.size_used)
        const size_total = this.readableFileSize(disk.size_total)
        const usage_percent = this.formatPercent(disk.size_used, disk.size_total)

        return (
            <Fragment>
                <div className="row">
                    <div className="col-4">
                        Файл систем: <code>{ disk.mount_point }</code>
                    </div>
                    <div className="col-8">
                        <div className="progress">
                            <div className="progress-bar" style={{width: usage_percent}}>
                                { usage_percent } - { disk.name }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-4 offset-4">
                        { size_used }
                    </div>
                    <div className="col-4">
                        Нийт: { size_total }
                    </div>
                </div>
            </Fragment>
        )
    }
}


export default class DiskSize extends Component {

    constructor(props) {
        super(props)

        this.state = {
            disks: [],
        }

    }

    componentDidMount() {
        service.getDisk().then(({ disks }) => {
            this.setState({ disks })
        })
    }

    render() {

        const { disks } = this.state

        return (
            <div className="card flex-grow-1">

                <div className="card-header">
                    Дискийн хэмжээ
                </div>

                <div className="card-body">

                    <div className="container">
                        {disks.map((disk, idx) =>
                            <DiskItem disk={ disk } key={ idx }/>
                        )}
                    </div>

                    <p className="small text-muted">Дискийн хэмжээний өөрчлөлтийн мэдээллийг 5 минут тутамд шинэчилнэ.</p>
                </div>

            </div>

        )
    }
}
