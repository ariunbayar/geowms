import React, { Component } from "react"
import DursgaltGazarTable from './DursgaltGazarTable'
import { NavLink } from "react-router-dom"
import { service } from './service'
import { HureeForm } from './Huree/HureeForm'
import { AyulForm } from './Ayul/AyulForm'
import Maps from '../../components/map/Map'
import { Pagination } from "../../components/pagination/pagination"

export class AddForm extends Component {

    constructor(props) {


        super(props)
        this.state = {
            perPage: 10,
            currentPage: 1,
            searchQuery: '',
            form_data: [],
            ayul_data: [],
            handle_save_succes_ayul: false,
            huree_len: 0,
            x: '',
            y: '',
            id: this.props.id.match.params.id,
            load: 0,
            rows: [],
            ayuul_geoms: [],
            geom_points: [],
        }

        this.paginate = this.paginate.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.hureeTooShirheg = this.hureeTooShirheg.bind(this)
        this.handleXY = this.handleXY.bind(this)
        this.loadRows = this.loadRows.bind(this)
        this.loadAyuulRows = this.loadAyuulRows.bind(this)
        this.loadGeomPoints = this.loadGeomPoints.bind(this)
    }

    handleXY(values, info) {
        this.setState({ x: values[0], y: values[1] })
    }

    handleInput(field, e) {
        this.setState({ [field]: e.target.value })
    }

    componentDidMount() {
        this.hureeTooShirheg()
        this.paginate(1, "")
        this.loadRows()
        this.loadAyuulRows()
        this.loadGeomPoints()
    }

    paginate(page, query) {
        const perPage = this.state.perPage
        const id = this.state.id
        this.setState({ currentPage: page })
        return service
            .dursgaltGazarAll(page, perPage, query, id)
            .then(page => {
                this.setState({ form_data: page.items, form_data_length: page.items.length })
                return page
            })
    }

    handleSearch(field, e) {
        if (e.target.value.length >= 1) {
            this.setState({ [field]: e.target.value })
            this.paginate(this.state.currentPage, e.target.value)
        }
        else {
            this.setState({ [field]: e.target.value })
            this.paginate(this.state.currentPage, e.target.value)
        }
    }

    hureeTooShirheg() {
        const { id } = this.state
        service.about(id).then(({ tuuh_soyl }) => {
            if (tuuh_soyl) {
                tuuh_soyl.map((tuuh) =>
                    this.setState({
                        huree_len: tuuh['too_shirheg'],
                    })
                )
            }
        })
    }

    handleRemove(id) {
        service.dursgaltGazarRemove(id).then(({ success }) => {
            if (success) this.paginate()
            this.loadGeomPoints()
        })
    }

    loadRows() {
        service
            .rows(this.state.id)
            .then(({ rows }) => {
                this.setState({ rows })
            })
    }

    loadAyuulRows() {
        service
            .ayuul_geoms(this.state.id)
            .then(({ ayuul_geoms }) => {
                this.setState({ ayuul_geoms })
            })
    }

    loadGeomPoints() {
        service
            .geom_points(this.state.id)
            .then(({ geom_points }) => {
                this.setState({ geom_points })
            })
    }


    render() {
        const { currentPage } = this.state
        const dursgalt_id = this.state.id
        const huree_len = this.state.huree_len
        const huree_components = []
        for (var i = 1; i <= huree_len; i++) {
            huree_components.push(<HureeForm key={i} dursgalt_id={dursgalt_id} tuuh_soyl_huree_id={i} x={this.state.x} y={this.state.y} loadRows={() => this.loadRows()}></HureeForm>)
        }
        return (
            <div className='col-md-9 card'>
                <div className="row">
                    <Maps
                        geoms={this.state.rows}
                        handleXY={this.handleXY}
                        coordinatCheck={true}
                        ayuul_geoms={this.state.ayuul_geoms}
                        geom_points={this.state.geom_points}
                        type="ayuul"
                    />
                    <div className="card-body col-md-11 ml-5">
                        <h4 className="ml-5">СОЁЛЫН ҮЛ ХӨДЛӨХ ДУРСГАЛЫН ҮЗЛЭГ, ТООЛЛОГЫН ХЭЭРИЙН БҮРТГЭЛ</h4>
                        <div className="text-right my-3">
                            <a href="#" className="btn gp-outline-primary" onClick={this.props.id.history.goBack}>
                                <i className="fa fa-angle-double-left"></i> Буцах
                            </a>
                            <NavLink className="btn gp-btn-primary" to={`/gov/tuuhen-ov/dursgalt-gazar/${dursgalt_id}/`}>
                                Нэмэх
                            </NavLink>
                            <input
                                type="text"
                                className="form-control col-md-4  mb-1 float-left"
                                id="searchQuery"
                                placeholder="Хайх"
                                onChange={(e) => this.handleSearch('searchQuery', e)}
                                value={this.state.searchQuery}
                            />
                        </div>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">№</th>
                                        <th scope="col">Дурсгалт газрын нэр</th>
                                        <th scope="col">Чулуулгийн төрөл</th>
                                        <th scope="col">X</th>
                                        <th scope="col">Y</th>
                                        <th scope="col">Хамрах хүрээнд багтсан</th>
                                        <th scope="col">Үүссэн</th>
                                        <th scope="col">Засах</th>
                                        <th scope="col">Устгах</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    {
                                    this.state.form_data.map((values, idx) =>
                                        <DursgaltGazarTable
                                            key={idx}
                                            idx={(currentPage * 1) - 1 + idx + 1}
                                            // idx = {idx}
                                            dursgalt_id={dursgalt_id}
                                            values={values}
                                            handleRemove={() => this.handleRemove(values.id)}
                                            handleMove={this.handleMove}
                                            loadGeomPoints={() => loadGeomPoints()}
                                        />
                                    )
                                    }
                                </tfoot>
                            </table>
                        </div>
                        <Pagination
                            paginate={this.paginate}
                            searchQuery={this.state.searchQuery}
                            load={this.state.load}
                        />
                    </div>
                </div>
                <div className="col-md-7 card-body ml-3">
                <h4>Дурсгалт газрын хамрах хүрээний солбилцол.</h4>
                    {huree_components}
                    <AyulForm
                        dursgalt_id={dursgalt_id}
                        x={this.state.x}
                        y={this.state.y}
                        loadAyuulRows={() => this.loadAyuulRows()}
                    >
                    </AyulForm>
                </div>
            </div>
        )
    }
}
