import React, {Component} from 'react'

import { DisplayNotif } from '@utils/Notification'
import DisplayModal from "@utils/Modal/DisplayModal"

import { DetailPage } from './DetailPage'

export class App extends Component {

    setNotAndModal(fn, key) {
        global[key] = fn
    }

    render() {

        return (
            <>
                <DisplayModal getModalFunc={(fn) => this.setNotAndModal(fn, 'MODAL')}/>
                <DisplayNotif getNotifFunc={(fn) => this.setNotAndModal(fn, 'NOTIF')}/>
                <DetailPage bundle={this.props.bundle}/>
            </>
        )

    }
}