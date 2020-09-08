import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import Modal from "../../../Modal"

export default class FormTable extends Component {

    constructor(props) {
        super(props)

        this.state = {
            is_modal_delete_open: false,
            is_modal_success_open: false,
            point_class: '',
            point_type: '',
        }

        this.handleModalDeleteOpen = this.handleModalDeleteOpen.bind(this)
        this.handleModalDeleteClose = this.handleModalDeleteClose.bind(this)
        this.handleModalSuccessOpen = this.handleModalSuccessOpen.bind(this)
        this.handlePointSetName = this.handlePointSetName.bind(this)
        this.handleBoxLeave = this.handleBoxLeave.bind(this)
        this.handleBoxOver = this.handleBoxOver.bind(this)
    }

    handleBoxOver (e){
        this.setState({ showBox: true })
    }

    handleBoxLeave(e){
        this.setState({ showBox: false })
    }
    handleModalDeleteOpen(event) {
        event.preventDefault()
        this.setState({is_modal_delete_open: true})
    }

    handleModalDeleteClose() {
        this.setState({is_modal_delete_open: false})
    }

    handleModalSuccessOpen(event) {
        event.preventDefault()
        this.setState({is_modal_success_open: true})
    }

    handleModalSuccessClose() {
        this.setState({is_modal_success_open: false})
    }
    componentDidMount(){
        this.handlePointSetName('point_class',this.props.values.point_class)
    }
    componentDidUpdate(prevProps){
        if(prevProps.values !== this.props.values){
            this.setState({is_modal_delete_open: false, is_modal_success_open: false})

            this.handlePointSetName('point_class',this.props.values.point_class)
        }
    }
    handlePointSetName(field, id){
        if(id == 1) this.setState({[field]: 'GPS-ийн сүлжээ'})
        if(id == 2) this.setState({[field]: 'Гравиметрийн сүлжээ'})
        if(id == 3) this.setState({[field]: 'Өндрийн сүлжээ'})
        if(id == 4) this.setState({[field]: 'Триангуляцийн сүлжээ'})
        if(id == 5) this.setState({[field]: 'Полигометрийн сүлжээ'})
        if(id == 6) this.setState({[field]: 'Зураглалын сүлжээ'})
        if(id == 7) this.setState({[field]: 'GNSS-ийн байнгын ажиллагаатай станц'})
    }

    render() {
        const { id, objectid, point_id, point_name, pid, point_class, point_type, center_typ,aimag, sum, t_type, sheet1, sheet2, sheet3, geom} = this.props.values
        const idx = this.props.idx
        return (
            <tr>
                <th>{idx + 1}</th>
                <th>{point_name}</th>
                <th>{pid}</th>
                <th>{this.state.point_class}</th>
                <th>{this.state.point_type}</th>
                <th>{aimag}</th>
                <th>{sum}</th>
                <th>
                    <NavLink to={`/back/froms/tseg-info/tsegpersonal/tseg-personal/${id}/засах/`}>
                            <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </NavLink>
                </th>
                <th>
                    <a href="#" onClick={this.handleModalDeleteOpen}>
                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </a>
                    {this.state.is_modal_delete_open &&
                        <Modal
                            modalClose={this.handleModalDeleteClose}
                            modalAction={this.props.handleRemove}
                            text={`Та "${name}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`}
                            title="Тохиргоог устгах"
                        />
                    }
                </th>
                <th>
                    <a href="#" onClick={this.handleModalSuccessOpen}
                                onMouseOver={(e) => this.handleBoxOver(e)}
                                onMouseLeave={(e) => this.handleBoxLeave(e)}>
                        <i className="fa fa-check" aria-hidden="true"></i>
                    </a>
                    <div className={`alert alert-dark rounded position-absolute d-none`+
                                `${this.state.showBox ? " d-block" : ""}`}
                                role="alert"
                                style={{backgroundColor:"white"}}
                    >
                        <h6 className="alert-heading">Санамж!</h6>
                        <span>Баталгаажуулснаар шинээр үүссэн болон шинэчилсэн цэгийн мэдээллийг шинэчлэх санал дээр байгаа цэгийн жагсаалтад нэмэх болно.</span>
                    </div>
                    {this.state.is_modal_success_open &&
                        <Modal
                            modalClose={this.handleModalSuccessClose}
                            modalAction={this.props.handleSuccess}
                            text={`Та "${point_name }" энэ цэгийг баталгаажуулахдаа итгэлтэй байна уу?`}
                            title="Баталгаажуулах"
                            actionName="Баталгаажуул"
                        />
                    }
                </th>
            </tr>
        )
    }
}