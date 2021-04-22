import React, { Component } from 'react'
import "./../Card_template/style.css"

export class Card_body extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { name, color, value, icon, text_color, card_state, border_color, col_size,} = this.props
        return (
            <div _ngcontent-rqc-c103="" className={`${col_size} ? ${col_size}:col-12 col-lg-6 col-xl-3`}>
            <div _ngcontent-rqc-c103="" className={`card ${border_color} border-left-sm`}>
                <div _ngcontent-rqc-c103="" className="card-body">
                    <div _ngcontent-rqc-c103="" className="media align-items-center">
                        <div _ngcontent-rqc-c103="" className="media-body text-left">
                            <span _ngcontent-rqc-c103="users_login">{name}</span>
                            <h4 _ngcontent-rqc-c103="" className={`card_info_color mb-0 ${text_color}`}>{value}</h4>
                            <span className=" mb-0 font-13 : mb-0 font-13">{card_state}</span>
                        </div>
                        <div _ngcontent-rqc-c103="" className={`align-self-center w-circle-icon rounded-circle ${color}`}>
                            <i _ngcontent-jqc-c103="" className={`${icon} text-white`}></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default Card_body






