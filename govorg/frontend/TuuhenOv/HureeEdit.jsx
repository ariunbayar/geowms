import React, { Component } from "react"

export class HureeEdit extends Component {
    render() {
        const huree_id = this.props.huree_id
        return (
        <li className="btn gp-outline-primary" onClick={() => this.props.hureeRemove(huree_id)}>
            Хүрээ {huree_id} устгах
        </li>
        )
    }
}
