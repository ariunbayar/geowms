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
        let check_ids = this.state.check_ids
        const value = parseInt(e.target.value)
        if (e.target.checked) {
            check_ids.push(value)
        } else {
            check_ids = check_ids.filter((oid) => oid != value)
        }

        this.props.setSelectedOptions(check_ids, e)
        this.setState({check_ids})

    }

    render() {
        const { data_list } = this.props
        const { check_ids } = this.state
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
                                    name={data.name}
                                    id={data.id}
                                    type="checkbox"
                                    onChange={(e) => { this.handleCheckData(e)}}
                                    checked={check_ids.indexOf(data.id) > -1}
                                    value={data.id}
                                />
                                <label
                                    className="mx-4 px-3"
                                    htmlFor={data.id}
                                >
                                    {data.name} {data.eng_name && `(${data.eng_name})`}
                                </label>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}
