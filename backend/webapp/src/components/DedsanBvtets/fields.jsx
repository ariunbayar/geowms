import React, { Component } from 'react'

export class Fields extends Component {
    constructor(props){
        super(props)
        this.state = {
            show_side: this.props.show_side
        }

    }

    componentDidUpdate(pP){
        const { show_side } = this.props
        if(pP.show_side !== show_side){
            this.setState({ show_side })
        }
    }

    render() {
        const { handleClose, features } = this.props
        const { show_side } = this.state
        console.log('haha', features)
        return (
            <div className={`card col-md-6 border border-danger ` + (show_side ? 'd-block' : 'd-none')}>
                <div className="card-body ">
                    {
                        show_side
                        ?
                        <button className="btn btn-danger" onClick={handleClose()}> X </button>
                        :
                        null
                    }
                    {/* <table className="table position-sticky table-responsive" style={{top:0}}>
                        <thead>
                            <tr>
                            {fields.map((field, idx) =>
                                    <th key={ idx }>
                                        { field }
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table> */}
                </div>
            </div>
        )
    }
}