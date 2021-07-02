import { get_modal_text } from "../requestModal"
import React, { Component, Fragment } from 'react'

export default class RefreshView extends Component {

    render(){
    const { values, ref_in_direct } = this.props
    return (
        <Fragment>
            <div className="col-md-12 d-flex justify-content-between">
                <div className="col-md-4 my-auto">
                    <label>View шинэчлэлт</label>
                </div>
                <div className="col-md-8 ml-5 mt-3 ">
                    <div className="custom-control custom-radio  ">
                        <input type="radio" className="custom-control-input " onClick={(e) =>{this.props.getRefViewStatus("Direct", e)}} checked={ref_in_direct} id="directRef" name="radio-stacked" required/>
                        <label className="custom-control-label float-left pt-1" htmlFor="directRef">Шууд шинэчлэх</label>
                    </div>
                    <div className="custom-control custom-radio  mb-3">
                            <input type="radio" className="custom-control-input " onClick={(e) =>{this.props.getRefViewStatus("24Hour", e)}} id="24HourRef" name="radio-stacked" required/>
                            <label className="custom-control-label float-left pt-1" htmlFor="24HourRef">24 цагийн дотор шинэчлэх</label>
                    </div>
                </div>
            </div>
            <div className="col-md-12">
                <small>{
                        `Та ${
                        values.length == 1
                            ?
                                get_modal_text(values[0].kind)
                            :
                        values.length > 1
                            ?
                                `сонгосон ${values.length} геометр өгөгдлөө`
                            :
                            null
                        }
                        зөвшөөрөхдөө итгэлтэй байна уу?`
                    }
                </small>
            </div>
        </Fragment>
    )}
}
