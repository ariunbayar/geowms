import React, { Component, Fragment } from "react"

export default class DirectModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            is_modal_request_open: false,
            title: props.button_name,
            values: props.values,
            state: props.values.state,
        }
        this.test = this.test.bind(this)
    }

    test(){
        alert("hi all")
    }

    render (){
        const { is_modal_request_open, title, values, state } = this.state
        const { button_name } = this.props

        return (
            <Fragment>
                <div>
                    {
                        state == "ШИНЭ" && title !="Файл"

                        ?
                            title != "Дэлгэрэнгүй"

                            ?
                                <div className="ml-1 pl-2" >
                                    <i  style = {{color: '#00AAFF', cursor: 'pointer'}} role ='button' className="fa fa-send animated bounceIn "
                                    onClick={()=> this.test()}
                                    ></i>
                                </div>
                            :
                                // <i className="fa fa-eye ml-4"> </i>

                                <h6
                                    className="ml-3 hover-fx white text-primary"
                                    style = {{cursor: 'pointer'}} >Харах</h6>
                            //     <button type="button" className="btn btn-primary animated bounceIn ml-4"
                            //     style={{
                            //         background : '#FF0078',
                            //         border: '#FF0078',
                            //         padding:'5.5px'
                            //         }}>
                            //         <small>Харах</small>
                            // </button>
                        :
                            <button type="button" className="btn btn-primary animated bounceIn"
                                style={{
                                    background : '#FF0078',
                                    border: '#FF0078',
                                    padding:'5.5px'
                                    }}>
                                 <i className="fa fa-download"> &nbsp; Татах</i>
                            </button>
                }
                </div>
            </Fragment>
        )
    }
}
