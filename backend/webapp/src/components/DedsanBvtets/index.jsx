import React, { Component, useEffect, useState } from "react"
import { Switch, Route } from "react-router-dom"

import Modal from "@utils/Modal/Modal"
import { Notif } from '@utils/Notification'

import { List } from './List'

export default class DedsanBvtets extends Component {

    constructor(props) {
        super(props)
        this.state = {
            setModal: null,
            setNotif: null,
        }
        this.getModalFunc = this.getModalFunc.bind(this)
        this.getNotifFunc = this.getNotifFunc.bind(this)
    }

    getModalFunc(setModal) {
        this.setState({ setModal })
    }

    getNotifFunc(setNotif) {
        this.setState({ setNotif })
    }

    render() {
        const { setModal, setNotif } = this.state
        return (
            <div>
                <DisplayModal getModalFunc={this.getModalFunc}/>
                <DisplayNotif getNotifFunc={this.getNotifFunc}/>
                {
                    setModal && setNotif
                    ?
                        <Switch>
                            <Route path={"/back/дэд-сан-бүтэц/"} component={(props) => <List {...props} setModal={setModal} setNotif={setNotif}/>} />
                        </Switch>
                    :
                        null
                }
            </div>
        )}
    }


class DisplayNotif extends Component {

    constructor(props) {
        super(props);
        this.too = 0
        this.state = {
            show: false
        }
        this.addNotif = this.addNotif.bind(this)
    }

    componentDidMount() {
        this.props.getNotifFunc(this.addNotif)
    }

    addNotif(style, msg, icon) {
        this.too ++
        this.setState({ show: true, style, msg, icon })
        const time = setInterval(() => {
            this.too --
            this.setState({ show: true })
            clearInterval(time)
        }, 3000);
    }

    render() {
        const { show, style, msg, icon } = this.state
        return (
            <Notif show={show} too={this.too} style={style} msg={msg} icon={icon}/>
        );
    }
}

function DisplayModal(props) {

    /*
        const modal = {
            modal_status: "open",
            modal_icon: modal_icon,
            modal_bg: modal_bg,
            icon_color: icon_color,
            title: title,
            text: text,
            has_button: has_button,
            actionNameBack: actionNameBack,
            actionNameDelete: actionNameDelete,
            modalAction: modalAction,
            modalClose: modalClose
        }
    */

    const [modal_info, setModalInfo] = useState({})
    const [modal_status, setModalStatus] = useState('closed')

    useEffect(() => {
        props.getModalFunc(setModal)
    }, [props.getModalFunc])

    const handleModalOpen = (modal_status) => {
        if (modal_status == 'open') {
            setModalStatus('initial')
            setTimeout(() => {
                setModalStatus(modal_status)
            }, 150);
        }
    }

    const setModal = (modal_info) => {
        handleModalOpen(modal_info.modal_status)
        setModalInfo(modal_info)
    }

    return (
        <Modal
            modal_status={modal_status}
            modal_icon={modal_info.modal_icon}
            modal_bg={modal_info.modal_bg}
            icon_color={modal_info.icon_color}
            text={modal_info.text}
            title={modal_info.title}
            has_button={modal_info.has_button}
            actionNameBack={modal_info.actionNameBack}
            actionNameDelete={modal_info.actionNameDelete}
            modalAction={modal_info.modalAction}
            modalClose={modal_info.modalClose}
        />
    )
}
