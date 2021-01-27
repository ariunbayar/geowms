import React, { Component, Fragment } from "react"
import StyleMap from './Map'


export class ViewStyle extends Component {

    constructor(props) {

        super(props)
        this.state = {
            style_state: 'create_style',
            style_name: '',
            style_title: '',
            style_color: '#800000',
            style_size: 1,
            fill_color:  '#C0C0C0',
            check_style: false,
        }
        this.handleOnChange = this.handleOnChange.bind(this)
        this.handleOnClick = this.handleOnClick.bind(this)
        this.passValues = this.passValues.bind(this)

    }

    componentDidMount() {

    }

    componentDidUpdate(pP, pS){
        const {style_color, style_size, fill_color, check_style, style_name, style_title} = this.state
        if((pS.style_color != style_color) || pS.style_size != style_size || pS.fill_color != fill_color){
            this.props.handleStyleSave(style_color)
            this.setState({check_style:false, style_name, style_title, style_size, fill_color, style_color, hoho:1})
        }

    }
    handleOnClick(){
        this.setState({check_style:true})
    }

    handleOnChange(e){
        this.setState({[e.target.name]:e.target.value})
    }

    passValues(){
        const { style_color, style_title, style_size, style_name, fill_color, check_style} = this.state
        const values = { style_color, style_title, style_size, style_name, fill_color}
        if(check_style){
            this.props.handleStyleSave(values)
        }
    }

    render() {
        const {fname, view_name} = this.props
        const { style_color, style_title, style_size, style_state, style_name, check_style, fill_color} = this.state
        return (
            <div className="card">

                <div className="card-header">
                    <h4 className="text-center">{fname}</h4>
                    {view_name && <h4 className="text-center"><small>View name: {view_name}</small></h4>}
                </div>

                <div className="card-body">

                <fieldset>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <label htmlFor="state">Төлөв</label>
                            <select className="form-control form-control-sm"
                                onChange={(e) => this.setState({ style_state: e.target.value })}>
                                <option value="create_style">Style үүсгэх</option>
                                <option value="update_style">Үүссэн style-с сонгох</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        {style_state == 'create_style' ?
                            <Fragment>
                                <div className="form-group col-md-6">
                                    <label htmlFor="style_name">Style-ийн нэр</label>
                                    <input
                                        name="style_name"
                                        type="text"
                                        className="form-control"
                                        value = {style_name}
                                        onChange={(e) => this.handleOnChange(e)}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="style_title">Style-ийн гарчиг</label>
                                    <input
                                        name="style_title"
                                        type="text"
                                        className="form-control"
                                        value={style_title}
                                        onChange={(e) => this.handleOnChange(e)}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="id_geoserver_user">Style-ийн хэмжээ</label>
                                    <input
                                        name="style_size"
                                        type="number"
                                        className="form-control"
                                        id="style_size"
                                        value = {style_size}
                                        onChange={(e) => this.handleOnChange(e)}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="color" className="m-2">Дүрсийн дүүргэлтийн өнгө</label>
                                    <input
                                        type="color"
                                        name='fill_color'
                                        value= {fill_color}
                                        onChange={(e) => this.handleOnChange(e)}
                                    />
                                </div>
                                 <div className="form-group col-md-6">
                                    <label htmlFor="color" className="m-2">Хүрээний өнгө</label>
                                    <input
                                        type="color"
                                        name='style_color'
                                        value= {style_color}
                                        onChange={(e) => this.handleOnChange(e)}
                                    />
                                </div>
                                <div className="form-group col-md-12">
                                    <button
                                        type="button"
                                        className='btn btn-primary'
                                        onClick={this.handleOnClick}
                                    >
                                        {/* {this.state.check_style ? 'Style хадгалах' : 'Style шалгах'}
                                         */}
                                         Style-ийг шалгах
                                    </button>
                                </div>
                            </Fragment>
                        : null
                        }
                    </div>
                    {
                        check_style &&
                        <div className="form-row">
                            <div className="form-group col-md-12">
                                <StyleMap style_color={style_color} style_size={style_size} fill_color={fill_color}/>
                            </div>
                        </div>
                    }
                </fieldset>
                </div>

            </div>
        )
    }
}
