import React, { Component, Fragment } from "react"


export default class WMSLayerItem extends Component {

    constructor(props) {
        super(props)

        this.state = {
            name: props.layer.name,
            code: props.layer.code,
            tile: props.layer.tile,
            is_visible: props.layer.defaultCheck,
            legendURL: props.layer.legendURL,
        }

        this.toggle = this.toggle.bind(this)
    }
    componentDidMount(){
        this.state.tile.setVisible(this.props.layer.defaultCheck)
    }
    toggle(is_visible) {
        this.state.tile.setVisible(is_visible)
        this.setState({is_visible})
    }

    render() {

        const { name, code, is_visible, legendURL } = this.state
        return (
            <li>
                <label>
                    <div className="custom-control custom-switch">
                        <input
                        type="checkbox" className="custom-control-input" id={code}
                        onChange={(e) => this.toggle(e.target.checked)}
                        checked={is_visible}
                    />
                    <label className="custom-control-label" htmlFor={code}>{name}</label>
                    </div>
                </label>
                {legendURL != "null" &&
                <ul>
                    <li>
                        {code == 'UB_GDB.SDE.Clinic' ? <img className="img" src={'/media/covid/emleg.png'}/>:
                        code == 'UB_GDB.SDE.Family_clinic' ? <img className="img" src={'/media/covid/orh_emleg.png'}/>:
                        code == 'Шинжилгээ авах цэг' ? <img className="img" src={'/media/covid/shinjilgee_tseg.png'}/>:
                        code == 'UB_GDB.SDE.Shopping' ? <img className="img" src={'/media/covid/shinjilgee_tseg.png'}/>:
                        code == 'UB_GDB.SDE.Supermarket' ? <img className="img" src={'/media/covid/delguur.png'}/>:
                        code == 'UB_GDB.SDE.T271_EMIIN_SAN' ? <img className="img" src={'/media/covid/em_san.png'}/>:
                        code == 'UB_GDB.SDE.T280_ZOCHID_BUUDAL' ? <img className="img" src={'/media/covid/buudal.png'}/>:
                        code == 'UB_GDB.SDE.T289_KHOROONII_BAIR' ? <img className="img" src={'/media/covid/horoo.png'}/>:
                        <img className="img" src={legendURL}/>}
                    </li>
                </ul>
                }
            </li>
        )
    }
}
