import React, { Component } from "react"

export class HureeEdit extends Component {
    render() {
        const huree_id = this.props.huree_id
        return (
            <a className="btn btn-outline-danger btn-sm btn-round btn-block waves-effect waves-light m-1 my-1" onClick={() => this.props.hureeRemove(huree_id)}>
                Хүрээ {huree_id} устгах
            </a>
        )
    }
}
