import React, { Component } from "react"

import ModelSelectTools from './select_modal'
import Modal from "@utils/Modal/Modal"
import { GPIcon } from "@utils/Tools"

export default class UsedTools extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modal_status: 'closed',
            selected_tools: [],
        }
        this.modalOpen = this.modalOpen.bind(this)
        this.modalChange = this.modalChange.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.handleSelectedTool = this.handleSelectedTool.bind(this)
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

    handleSelectedTool(value_type, value, idx) {
        var array = [...this.state.selected_tools]
        if(value_type) {
            array = array.concat(value)
        }
        else {
            array.splice(idx, 1);
        }
        this.props.values.handleSelectModel(array)
    }

    handleModalOpen(values) {
        this.modalChange(
            'Эрх бүхий багажны жагсаалт',
            <ModelSelectTools
                list_of_datas={ values }
                modal_comp_props={{
                    handleSelectedTool: this.handleSelectedTool
                }}
            />,
            null,
        )
    }

    modalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    modalChange(title, text, modalClose) {
        this.setState({
            title,
            text,
            modalClose,
        })
        this.modalOpen()
    }

    render() {
        const {
            tool_datas, info, state, selected_tools
        } = this.props.values

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
                                                            <a onClick={(e) => this.handleSelectedTool(false, value, idx)}>
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
                    !info
                    ?
                        <div className={`form-group col-md-12`}>
                            <div className="form-group col-md-12">
                                <a
                                    type='button'
                                    className="btn text-primary"
                                    id='tool_id'
                                    onClick={(e) => this.handleModalOpen(tool_datas)}
                                >
                                    <i className="fa fa-plus-circle text-success mt-2 mr-2"> </i>
                                        Багаж сонгох
                                </a>
                            </div>
                        </div>
                    :
                        null
                }
                <Modal
                    {...this.state}
                    text={this.state.text}
                    title={this.state.title}
                    modalClose={this.state.modalClose}
                    modal_status={this.state.modal_status}
                />
            </div>
        )
    }
}
