import React, { Component } from "react"

export default class SelectOption extends Component {

    constructor(props) {
        super(props)
        this.state = {
            check_ids: []
        }
        this.handleCheckData = this.handleCheckData.bind(this)
    }

    componentDidMount() {
        let check_ids = this.props.check_ids
        this.setState({check_ids})
    }

    handleCheckData(e){
        var { data_list } = this.props
        let is_between = ['pk_start_index', 'pk_field_max_range']

        const value = parseInt(e.target.value)
        data_list[value]['checked'] = e.target.checked

        this.props.setSelectedOptions(data_list)
        this.setState({ data_list })
    }

    render() {
        const { data_list } = this.props
        return (
            <div className="row d-flex justify-content-center">
                <label className="text-center col-md-12">шүүлтүүрийн төрлүүдийг сонгоно уу !!!</label>
                <div className='mx-2'>
                    {
                        data_list.map((data, key) =>
                            <div
                                key={key}
                                className="icheck-primary  col-md-12 d-flex justify-content-between"
                            >
                                <input
                                    id={key}
                                    name={data.name}
                                    type="checkbox"
                                    value={key}
                                    checked={data.checked}
                                    onChange={(e) => { this.handleCheckData(e)}}
                                />
                                <label htmlFor={key} >
                                    {data.name} {data.config_code && `(${data.config_code})`}
                                </label>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}
