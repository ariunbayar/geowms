import React, { Component } from "react";
import { service } from './service'

export class delgerengui extends Component {
    constructor(props) {
        super(props)
        this.state = {
            values: {
                file_path: '',
            },
        }
    this.handleFile = this.handleFile.bind(this)
    }

    handleFile() {
        service.llcList().then(({ values }) => {
            if (values) {
                this.setState({ values })
            }
        })
    }

    render() {
        const { file_path } = this.state.values
        return (
            <div>
                <h1>{file_path}</h1>
                <h1>aaaaaaaaaaaaaaaa</h1>
            </div>
        )
    }
}
