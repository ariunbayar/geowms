import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import Modal from "../../../../components/helpers/Modal"

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
        if(id == 3) this.setState({[field]: 'GPS-ийн сүлжээ'})
        if(id == 6) this.setState({[field]: 'Гравиметрийн сүлжээ'})
        if(id == 7) this.setState({[field]: 'Өндрийн сүлжээ'})
        if(id == 4) this.setState({[field]: 'Триангуляцийн сүлжээ'})
        if(id == 5) this.setState({[field]: 'Полигометрийн сүлжээ'})
        if(id == 8) this.setState({[field]: 'Зураглалын сүлжээ'})
        if(id == 2) this.setState({[field]: 'GNSS-ийн байнгын ажиллагаатай станц'})
    }

    render() {
        const { perm_view, perm_create, perm_remove, perm_revoke, perm_review, perm_approve } = this.props.perms
        const { id, objectid, point_id, point_name, pid, point_class, point_type, center_typ,aimag, sum, t_type, sheet1, sheet2, sheet3, geom} = this.props.values
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
                {perm_remove && perm_view && perm_create ?
                <th>
                    <NavLink to={`/gov/froms/tseg-info/tsegpersonal/tseg-personal/${id}/${t_type}/засах/`}>
                            <i className="fa fa-pencil-square-o gp-text-primary" aria-hidden="true"></i>
                    </NavLink>
                </th>
                :
                null
                }
                {perm_remove ?
                <th>
                    <a href="#" onClick={this.handleModalDeleteOpen}>
                        <i className="fa fa-trash-o text-danger" aria-hidden="true"></i>
                    </a>
                    {this.state.is_modal_delete_open &&
                        <Modal
                            modalClose={this.handleModalDeleteClose}
                            modalAction={this.props.handleRemove}
                            text={`Та "${point_name}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`}
                            title="Тохиргоог устгах"
                            model_type_icon = 'success'
                        />
                    }
                </th>
                :
                null}
                {perm_approve ?
                <th>
                    {t_type[3] != point_class ?
                        <a className="btn" onClick={this.handleModalSuccessOpen}
                                    onMouseOver={(e) => this.handleBoxOver(e)}
                                    onMouseLeave={(e) => this.handleBoxLeave(e)}>
                            <i className="fa fa-check" aria-hidden="true"></i>
                        </a>:
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
                    {this.state.is_modal_success_open &&
                        <Modal
                            modalClose={(e) => this.handleModalSuccessClose(e)}
                            modalAction={this.props.handleSuccess}
                            text={`Та "${point_name}" энэ цэгийг баталгаажуулахдаа итгэлтэй байна уу?`}
                            title="Баталгаажуулах уу?"
                            actionNameBack="    Үгүй"
                            actionNameDelete="  Тийм"
                            model_type_icon='warning'
                        />
                    }
                </th>
                :
                null
                }
            </tr>
        )
    }
}
