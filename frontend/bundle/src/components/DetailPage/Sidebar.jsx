import React, { Component, Fragment } from "react"

import WMSItem from './WMSItem'


export class Sidebar extends Component {

    render() {
        return (
            <form>
                <div className="form-group">
                    <label className="font-weight-bold" htmlFor="formGroupInput">Нэрэлбэрээр хайх</label>
                    <div className="input-group mb-3">

                        <input type="text" className="form-control" placeholder="хайх утга" aria-label="" aria-describedby=""/>
                        <div className="input-group-append">
                            <button className="btn gp-outline-primary" type="button"><i className="fa fa-search mr-1" aria-hidden="true"></i>Хайх</button>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label className="font-weight-bold" htmlFor="formGroupInput">Байрлалаар хайх</label>
                    <input type="text" className="form-control" id="formGroupExampleInput" placeholder="Уртраг"/>
                    <input type="text" className="form-control mt-2" id="formGroupExampleInput2" placeholder="Өргөрөг"/>
                    <button type="submit" className="btn gp-outline-primary mt-2 float-right"><i className="fa fa-search mr-1" aria-hidden="true"></i>Хайх</button>
                </div>
                <div className="tanih mt-5">
                    <label className="font-weight-bold" htmlFor="formGroupInput">Таних тэмдэг</label>
                    <p className="my-1">GPS- ийн сүлжээний цэг</p>
                    <p className="my-1">Гравиметрийн сүлжээний цэг</p>
                    <p className="my-1">Өндрийн сүлжээний цэг</p>
                    <p className="my-1">Триангуляцийн сүлжээний цэг</p>
                    <p className="my-1">Зураглалын сүлжээний цэг</p>
                </div>
                {this.props.map_wms_list.map((wms, idx) =>
                    <WMSItem wms={wms} key={idx}/>
                )}
            </form>
        )
    }
}
