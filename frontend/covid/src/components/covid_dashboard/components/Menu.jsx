import React, { Component } from "react"
import {service} from './service'
import './menu.css'
export  class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vaccine_case: 100,
            vaccine_text: 'Вакцин хийлгэсэн тоо',
            confirmed_case_plus: '+10',
            confirmed_case_color: 'danger',
            covid_text: 'Батлагдсан тохиолдол',
            emchlegdej_bui_humuus_too_text: 'Эмчлэгдэж буй хүмүүсийн тоо',
            nas_barsan_hunii_too_text: 'Нас барсан хүмүүсийн тоо',
            nas_barsan_hunii_too_plus: '+10',
        }
    }

    numberWithCommas(value){
        if (value){
        value = value.toString();
        var pattern = /(-?\d+)(\d{3})/;
        while (pattern.test(value))
            value = value.replace(pattern, "$1,$2");
        }
        return value;
    }

    getCalculator(a, b){
        var temp = 0
        temp = a - b
        temp = this.numberWithCommas(temp)
        if(temp < 0) return temp
        return `+${temp}`
    }

    render() {
        const { onoodor_counts_obj, ochigdor_counts_obj } = this.props
        const { vaccine_text, covid_text, nas_barsan_hunii_too_text, emchlegdej_bui_humuus_too_text} = this.state
            return (
                <div className="px-3 py-2">
                    <div className="infoTile" style={{width: "100%"}}>
                        <div className="infoTileHeader">
                            <div>
                                <h2 className="title">{vaccine_text}</h2>
                            </div>
                        </div>
                        <div className="infoTileDosesAdministered">
                            <div className="dosesAdministered">
                                {this.numberWithCommas(onoodor_counts_obj['vaccine_hiisen_too'])}
                                <small className="ml-1">{this.getCalculator(onoodor_counts_obj['vaccine_hiisen_too'], ochigdor_counts_obj['vaccine_hiisen_too'])}</small>
                            </div>
                        </div>
                        <div className="infoTileConfirmedHeader">
                            <div>
                                <h2 className="title" title="Total confirmed cases">{covid_text}</h2>
                            </div>
                        </div>
                        <div className="infoTileConfirmed">
                            <div className="confirmed">
                                {this.numberWithCommas(onoodor_counts_obj['batlagdsan_tohioldol_too'])}
                                <small className="ml-1">{this.getCalculator(onoodor_counts_obj['batlagdsan_tohioldol_too'], ochigdor_counts_obj['batlagdsan_tohioldol_too'])}</small>
                            </div>
                        </div>
                        <div className="infoTileData">
                            <h2 className="legend">
                                <div className="color" style={{background: '#1F8536'}}></div>
                                <div className="description" style={{color: "#1F8536"}}>Эдгэрсэн тоо</div>
                                <div className="total">
                                    {this.numberWithCommas(onoodor_counts_obj['edgersen_humuus_too'])}
                                    <small className="ml-1">{this.getCalculator(onoodor_counts_obj['edgersen_humuus_too'], ochigdor_counts_obj['edgersen_humuus_too'])}</small>
                                </div>
                            </h2>
                            <h2 className="legend">
                                <div className="color" style={{background: '#ff9700'}}></div>
                                <div className="description text-warning">Эмчлэгдэж буй тоо</div>
                                <div className="total">
                                    {this.numberWithCommas(onoodor_counts_obj['emchlegdej_bui_humuus_too'])}
                                    <small className="ml-1">{this.getCalculator(onoodor_counts_obj['emchlegdej_bui_humuus_too'], ochigdor_counts_obj['emchlegdej_bui_humuus_too'])}</small>
                                </div>
                            </h2>
                            <h2 className="legend">
                                <div className="color" style={{background: '#223035'}}></div>
                                <div className="description text-dark">Нас барсан тоо</div>
                                <div className="total">
                                    {this.numberWithCommas(onoodor_counts_obj['nas_barsan_hunii_too'])}
                                    <small className="ml-1">{this.getCalculator(onoodor_counts_obj['nas_barsan_hunii_too'], ochigdor_counts_obj['nas_barsan_hunii_too'])}</small>
                                </div>
                            </h2>
                        </div>
                    <div className="lastUpdate">шинэчилсэн {onoodor_counts_obj['medeelel_shinchlegdsen_time']} өмнө</div>
                </div>
            </div>
            )
    }
}
