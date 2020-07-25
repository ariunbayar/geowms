import React, { Component } from "react"
import Modal from "@/components/Modal"


export default class DiskSize extends Component {

    constructor(props) {
        super(props)

        this.readableFileSize = this.readableFileSize.bind(this)
    }

    readableFileSize(bytes) {
       if(bytes == 0) return '0 Bytes';
       var k = 1000,
           dm = 2,
           sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
           i = Math.floor(Math.log(bytes) / Math.log(k));
       return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    render() {

        const {disk} = this.props
        const size_used = this.readableFileSize(disk.size_used)
        const size_total = this.readableFileSize(disk.size_total)

        return (
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Диск</th>
                            <th scope="col">Ашиглалт</th>
                            <th scope="col">Ашигласан</th>
                            <th scope="col">Нийт</th>
                            <th scope="col">Файл систем</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td>{disk.name}</td>
                            <td>
                                <progress max={disk.size_total} value={disk.size_used}></progress>
                            </td>
                            <td>{size_used}</td>
                            <td>{size_total}</td>
                            <td>{disk.mount_point}</td>
                        </tr>
                    </tbody>
                </table>
                <p>Дискийн хэмжээний өөрчлөлтийн мэдээллийг 5 минут тутамд шинэчилнэ.</p>
            </div>
                    
        )
    }
}
