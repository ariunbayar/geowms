import React, { Component } from "react"
import {service} from './service'

export  class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vaccine_case: 100,
            vaccine_color: 'success',
            vaccine_text: 'Вакцин хийлгэсэн тоо',
            confirmed_case_plus: '+10',
            confirmed_case_color: 'danger',
            covid_text: 'Батлагдсан тохиолдол',
            emchlegdej_bui_humuus_too_text: 'Эмчлэгдэж буй хүмүүсийн тоо',
            nas_barsan_hunii_too_text: 'Нас барсан хүмүүсийн тоо',
            nas_barsan_hunii_too_plus: '+10',
        }
    }

    render() {
        const { update_time } = this.props
        const { batlagdsan_tohioldol_too_zuruu, emchlegdej_bui_humuus_too_zuruu, nas_barsan_hunii_too_zuruu } = this.props.mongol_zuruu
        const { batlagdsan_tohioldol_too, vaccine_too, vaccine_case, emchlegdej_bui_humuus_too, nas_barsan_hunii_too } = this.props.mongol_data
        const { confirmed_case_color, vaccine_color, vaccine_text, covid_text, nas_barsan_hunii_too_text, emchlegdej_bui_humuus_too_text} = this.state
            return (
                <div><br/>
                {
                    vaccine_too &&
                        <div className="row">
                            <div className="col-md-12">
                                <label htmlFor="label" style={{fontSize: '115%'}} className="mw-100 text-wrap align-middle">{vaccine_text}</label>
                            </div>
                        </div>
                }
                {
                    vaccine_too &&
                        <div>
                            <div className="row">
                                <div className="col-auto" style={{fontSize: 'x-large', wordBreak: "break-all"}}>
                                    <a className={`text-${vaccine_color}`}>{vaccine_case}</a>
                                </div>
                            </div>
                        </div>
                }
                {
                    vaccine_too &&
                    <hr />
                }
                    <div className="row">
                        <div className="col-md-12">
                            <label htmlFor="label" style={{fontSize: '115%'}} className="mw-100 text-wrap align-middle">{covid_text}</label>
                        </div>
                    </div>
                    <div>
                        <div className="row">
                            <div className="col-auto" style={{fontSize: 'x-large', wordBreak: "break-all"}}>
                                <a className={`text-${confirmed_case_color}`}>{batlagdsan_tohioldol_too}</a>
                            </div>
                            <div className='d-flex align-items-center'>
                                <div className="col-auto float-right badge-light">
                                    {
                                        batlagdsan_tohioldol_too_zuruu && !batlagdsan_tohioldol_too_zuruu.includes("-")
                                        ?
                                            `+${batlagdsan_tohioldol_too_zuruu}`
                                        :
                                            batlagdsan_tohioldol_too_zuruu
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <li htmlFor="label" style={{fontSize: '115%'}} className="mw-100 text-wrap align-middle">{emchlegdej_bui_humuus_too_text}
                                <div className="col-auto float-right badge-light" style={{fontSize: 'small'}}>
                                    {
                                        emchlegdej_bui_humuus_too_zuruu && !emchlegdej_bui_humuus_too_zuruu.includes("-")
                                        ?
                                            `+${emchlegdej_bui_humuus_too_zuruu}`
                                        :
                                            emchlegdej_bui_humuus_too_zuruu
                                    }
                                </div>
                                <div className="col-auto float-right">{emchlegdej_bui_humuus_too}</div>
                            </li>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <li htmlFor="label" style={{fontSize: '115%'}} className="mw-100 text-wrap align-middle">{nas_barsan_hunii_too_text}
                                <div className="col-auto float-right badge-light" style={{fontSize: 'small'}}>
                                    {
                                        nas_barsan_hunii_too_zuruu && !nas_barsan_hunii_too_zuruu.includes("-")
                                        ?
                                            `+${nas_barsan_hunii_too_zuruu}`
                                        :
                                            nas_barsan_hunii_too_zuruu
                                    }
                                </div>
                                <div className="col-auto float-right">{nas_barsan_hunii_too}</div>
                            </li>
                        </div>
                    </div><br/>
                    <div className="row">
                        <div className=" text-secondary col-md-12">
                            {update_time} өмнө шинэчлэгдсэн
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <hr />
                        </div>
                    </div>
                </div>
            )
    }
}
