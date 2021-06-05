import React, { Component } from "react"

import { GPIcon } from "@utils/Tools"

import ModelSelectTools from './select_modal'

export default class UsedTools extends Component {

    constructor(props) {
        super(props)
        this.state = {
            select_layer_status: false,
            values: [],
            modalAction: '',
            modal_title: '',
            more_detail: '',
            selected_tools: []
        }
        this.handleSelectedTool = this.handleSelectedTool.bind(this)
        this.modalClose = this.modalClose.bind(this)
    }

    componentDidUpdate(pP, pS) {
        const { selected_tools, state, info } = this.props.values
        if(pP.values.selected_tools != selected_tools) {
            if(!state && !info ) {
                this.setState({ selected_tools: selected_tools })
            }
            else {
                this.setState({ selected_tools: selected_tools })
            }
        }
    }

    modalClose() {
        this.setState({ select_layer_status: false })
    }

    handleSelectedTool(value_type, value) {
        var array = [...this.state.selected_tools]
        if(value_type) {
            array = array.concat(value)
            this.setState({ select_layer_status: false })
        }
        else {
            for(let [i, layer] of array.entries()) {
                if(layer.bagaj_dugaar == value.bagaj_dugaar) {
                    array.splice(i, 1);
                }
            }
        }
        this.props.values.handleSelectModel(array)
    }

    handleSelectModel(modal_title, modalAction, values, more_detail) {
        return(
            this.setState({
                select_layer_status: true,
                modalAction,
                modal_title,
                values,
                more_detail
            })
        )
    }

    render (){
        const {
            tool_datas, info, state
        } = this.props.values
        const {
            modalAction, values,
            modal_title,
            select_layer_status,
            selected_tools
        } = this.state
        return (
            <div className="col-md-12">
                <label htmlFor=''> Зураглал үйлдэхдээ ашигласан багаж</label>
                <div className="row justify-content-center overflow-auto pl-5" style={{height: '23vh'}}>
                    <table className="table table-wrapper-table">
                        <thead>
                            <tr>
                                <th scope="col"> № </th>
                                <th scope="col">Багажны дугаар</th>
                                <th scope="col">Багажны марк</th>
                                <th scope="col">сертификатын дугаар</th>
                                <th scope="col">Дуусах хугацаа</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                selected_tools && selected_tools.length > 0
                                ?
                                    selected_tools.map((value, idx) =>
                                        <tr key={idx}>
                                            <th scope="row">{idx+1}</th>
                                            <td>{value.bagaj_dugaar}</td>
                                            <td>{value.bagaj_mark}</td>
                                            <td>{value.certificate_number}</td>
                                            <td>{value.expired_date}</td>
                                            <td className="text-center mx-0 px-0">
                                                {
                                                    !info
                                                    ?
                                                        state != "ИЛГЭЭСЭН" &&
                                                            <a href="#" onClick={(e) => this.handleSelectedTool(false, value)}>
                                                                <GPIcon icon={"fa fa-minus-circle text-danger"}/>
                                                            </a>
                                                    :
                                                        null
                                                }
                                            </td>
                                        </tr>
                                    )
                                :
                                    null
                            }
                        </tbody>
                    </table>
                </div>
                {
                    info || state == "ИЛГЭЭСЭН"
                    ?
                        <div className={`form-group col-md-12`}>
                            <div className="form-group col-md-12">
                                <a
                                    id='tool_id'
                                    href="#"
                                    onClick={(e) => this.handleSelectModel('Эрх бүхий багажууд', this.handleSelectedTool, tool_datas)}
                                >
                                    <GPIcon icon={"fa fa-plus-circle text-success mr-4 mt-2"}/>
                                    <label htmlFor="tool_id">Багаж сонгох</label>
                                </a>
                            </div>
                        </div>
                    :
                        null
                }
                {
                    select_layer_status
                    &&
                        <ModelSelectTools
                            modalClose={this.modalClose}
                            modalAction={modalAction}
                            list_of_datas={values}
                            title={modal_title}
                        />
                }
            </div>
        )
    }
}
