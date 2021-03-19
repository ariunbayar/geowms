import React, { Component } from "react"

export  class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vaccine_case: 100,
            vaccine_color: 'success',
            vaccine_text: 'Вакцин хийлгэсэн тоо',
            confirmed_case: 100,
            confirmed_case_plus: '+10',
            confirmed_case_color: 'danger',
            covid_text: 'Батлагдсан тохиолдол',
            active_case_text: 'Эмчлэгдэж буй хүмүүсийн тоо',
            active_case: 100,
            fatal_case_text: 'Нас барсан хүмүүсийн тоо',
            fatal_case: 100,
            fatal_case_plus: '+10',
            updated: '7 минут',
        }
    }

    render() {
        const { confirmed_case_color, confirmed_case, confirmed_case_plus,
        vaccine_text, vaccine_case, vaccine_color, covid_text,
        active_case_text, active_case, fatal_case_text, fatal_case, fatal_case_plus, updated
    } = this.state
            return (
                <div><br/>
                    <div className="row">
                        <div className="col-md-12">
                            <label htmlFor="label" style={{fontSize: '115%'}} className="mw-100 text-wrap align-middle">{vaccine_text}</label>
                        </div>
                    </div>
                    <div>
                        <div className="row">
                            <div className="col-auto" style={{fontSize: 'x-large', wordBreak: "break-all"}}>
                                <a className={`text-${vaccine_color}`}>{vaccine_case}</a>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <hr />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <label htmlFor="label" style={{fontSize: '115%'}} className="mw-100 text-wrap align-middle">{covid_text}</label>
                        </div>
                    </div>
                    <div>
                        <div className="row">
                            <div className="col-auto" style={{fontSize: 'x-large', wordBreak: "break-all"}}>
                                <a className={`text-${confirmed_case_color}`}>{confirmed_case}</a>
                            </div>
                            <div className="col-auto float-right badge-light">{confirmed_case_plus}</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <li htmlFor="label" style={{fontSize: '115%'}} className="mw-100 text-wrap align-middle">{active_case_text}
                                <div className="col-auto float-right">{active_case}</div>
                            </li>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <li htmlFor="label" style={{fontSize: '115%'}} className="mw-100 text-wrap align-middle">{fatal_case_text}
                                <div className="col-auto float-right badge-light" style={{fontSize: 'small'}}>{fatal_case_plus}</div>
                                <div className="col-auto float-right">{fatal_case}</div>
                            </li>
                        </div>
                    </div><br/>
                    <div className="row">
                        <div className=" text-secondary col-md-12">
                            {updated}ийн өмнө шинэчлэгдсэн
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
