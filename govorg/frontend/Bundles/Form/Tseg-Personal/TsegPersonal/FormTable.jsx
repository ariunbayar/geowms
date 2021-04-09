import React, { Component } from "react"
import {NavLink} from "react-router-dom"

import Modal from "@utils/Modal/Modal"


export default class FormTable extends Component {

    constructor(props) {
        super(props)

        this.state = {
            point_class: '',
            point_type: '',

            modalAction: null,
            modal_status: 'closed',
            modal_icon: 'fa fa-check-circle',
            icon_color: 'success',
            title: '',
            text: '',
            has_button: false,
        }

        this.handleModalDeleteOpen = this.handleModalDeleteOpen.bind(this)
        this.handleModalSuccessOpen = this.handleModalSuccessOpen.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.handlePointSetName = this.handlePointSetName.bind(this)
        this.handleBoxLeave = this.handleBoxLeave.bind(this)
        this.handleBoxOver = this.handleBoxOver.bind(this)
        this.modalChange = this.modalChange.bind(this)
    }

    handleBoxOver (e){
        this.setState({ showBox: true })
    }

    handleBoxLeave(e){
        this.setState({ showBox: false })
    }

    handleModalSuccessOpen(event) {
        event.preventDefault()
        this.modalChange(
            this.props.handleSuccess,
            'fa fa-exclamation-circle',
            "warning",
            'Баталгаажуулах уу?',
            `Та "${this.props.values.point_name}" энэ цэгийг баталгаажуулахдаа итгэлтэй байна уу?`,
            true
        )
    }

    handleModalDeleteOpen(event) {
        event.preventDefault()
        this.modalChange(
            this.props.handleRemove,
            'fa fa-exclamation-circle',
            "warning",
            'Тохиргоог устгах',
            `Та "${this.props.values.point_name}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`,
            true
        )
    }

    modalChange(modalAction, modal_icon, icon_color, title, text, has_button) {
        this.setState({
            modalAction: modalAction,
            modal_icon: modal_icon,
            icon_color: icon_color,
            title: title,
            text: text,
            has_button: has_button,
        })
        this.handleModalOpen()
    }

    handleModalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    componentDidMount(){
        this.handlePointSetName('point_class',this.props.values.point_class)
    }

    componentDidUpdate(prevProps){
        if(prevProps.values !== this.props.values){
            this.setState({modal_status: 'closed'})
            this.handlePointSetName('point_class',this.props.values.point_class)
        }
    }

    handlePointSetName(field, id){
        if(id == 3) this.setState({[field]: 'GPS-ийн сүлжээ'})
        if(id == 6) this.setState({[field]: 'Гравиметрийн сүлжээ'})
        if(id == 7) this.setState({[field]: 'Өндрийн сүлжээ'})
        if(id == 4) this.setState({[field]: 'Триангуляцийн сүлжээ'})
        if(id == 5) this.setState({[field]: 'Полигометрийн сүлжээ'})
        if(id == 8) this.setState({[field]: 'Зураглалын сүлжээ'})
        if(id == 2) this.setState({[field]: 'GNSS-ийн байнгын ажиллагаатай станц'})
    }

    render() {
        const { id, objectid, point_id, point_name, pid, point_class, point_type, center_typ, aimag, sum, t_type, sheet1, sheet2, sheet3, geom} = this.props.values
        const idx = this.props.idx
        return (
            <tr>
                <th>{idx + 1}</th>
                <th>{point_name}</th>
                <th>{point_id}</th>
                <th>{this.state.point_class}</th>
                <th>{point_type > 4 && point_type ? <a>{point_type} зэрэг</a> : point_type < 4 && point_type ? <a>{point_type} анги</a> :''} </th>
                <th>{aimag}</th>
                <th>{sum}</th>
                <th>
                    <NavLink to={`/gov/forms/tseg-info/tsegpersonal/tseg-personal/${id}/${t_type}/засах/`}>
                            <i className="fa fa-pencil-square-o gp-text-primary" aria-hidden="true"></i>
                    </NavLink>
                </th>
                <th>
                    <a href="#" onClick={this.handleModalDeleteOpen}>
                        <i className="fa fa-trash-o text-danger" aria-hidden="true"></i>
                    </a>
                </th>
                <th>
                    {
                        t_type[3] != point_class
                        ?
                            <a className="btn"
                                onClick={this.handleModalSuccessOpen}
                                onMouseOver={(e) => this.handleBoxOver(e)}
                                onMouseLeave={(e) => this.handleBoxLeave(e)}
                            >
                                <i className="fa fa-check" aria-hidden="true"></i>
                            </a>
                        :
                            <a className="btn">
                                <i className="fa fa-check text-success" aria-hidden="true"></i>
                            </a>
                    }
                    <div className={`alert alert-dark rounded position-absolute d-none`+
                                `${this.state.showBox ? " d-block" : ""}`}
                                role="alert"
                                style={{backgroundColor:"white"}}
                    >
                        <h6 className="alert-heading">Санамж!</h6>
                        <span>Баталгаажуулснаар шинээр үүссэн болон шинэчилсэн цэгийн мэдээллийг шинэчлэх санал дээр байгаа цэгийн жагсаалтад нэмэх болно.</span>
                    </div>
                    <Modal
                        modalAction={this.state.modalAction}
                        modal_status={this.state.modal_status}
                        modal_icon={this.state.modal_icon}
                        icon_color={this.state.icon_color}
                        title={this.state.title}
                        text={this.state.text}
                        has_button={this.state.has_button}
                        actionNameBack="Үгүй"
                        actionNameDelete="Тийм"
                    />
                </th>
            </tr>
        )
    }
}
