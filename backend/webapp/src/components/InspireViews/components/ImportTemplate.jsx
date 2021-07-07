import FileUpload from '@utils/Tools/FileUpload'

import React, { Component } from 'react'

export default class ImportTemplate extends Component {
    constructor(props){
        super(props)
        this.state = {
            is_open: false,
        }
    }

    render() {
        const { is_open } = this.state
        const { getFile, files } = this.props

        return (
            <div className="border mb-3 w-100  py-2 pl-3">
                <h5 className="text-uppercase text-center pt-2">
                    Feature template оруулах
                <label htmlFor="check" className="m-2" ></label>
                <input
                    type="checkbox"
                    id="check"
                    checked={is_open}
                    onChange={() => this.setState(prevState => ({ is_open: !prevState.is_open }))}
                />
                </h5>
                {
                    is_open
                    &&
                        <FileUpload
                            className="mt-4"
                            default_text="Template оруулна уу"
                            files={files}
                            getFile={getFile}
                        />
                }
            </div>
        )
    }
}
