
import React, { Component } from "react"
import {service} from './service'
import {RevokeRequestTable} from './RevokeRequestTable'

export default class RevokeRequestForm extends Component {

    constructor(props) {
        super(props)
        this.state={
            revoke_request:[],
            is_loading: false,
        }
        this.getAll = this.getAll.bind(this)
        this.onChangeTheme = this.onChangeTheme.bind(this)
    }
    componentDidMount(){
        this.getAll()
    }

    getAll(){
        this.setState({ is_loading: true })
        service
        .getAll()
        .then(({ success ,revoke_request, choices, modules }) => {
           if(success){
                this.themes = []
                this.packages = []
                this.features = []
                modules.map((module, idx) => {
                    this.themes.push(module)
                    module.packages.map((mods, idx) => {
                        this.packages.push(mods)
                        mods.features.map((mod, idx) => {
                            this.features.push(mod)
                        })
                    })
                })
               this.setState({revoke_request, is_loading: false, choices, modules, themes: this.themes, packages: this.packages, features: this.features})
            }
        })
    }

    onChangeTheme(value, type) {
        const { modules } = this.state
        this.themes = []
        this.packages = []
        this.features = []
        modules.map((module, idx) => {
            if (type == 'theme' && module.id == value){
                this.themes.push(module)
            } else if (value === '') {
                this.themes.push(module)
            }
        })
        this.themes.map((mods, idx) => {
            mods.packages.map((pack, idx) => {
                    this.packages.push(pack)
            })
        })
        this.packages.map((mod, idx) => {
            mod.features.map((feat, idx) => {
                this.features.push(feat)
            })
        })
        this.setState({ packages: this.packages, features: this.features, search_theme: value })
    }

    onChangePackage(value, type) {
        const { packages } = this.state
        this.themes = []
        this.packages = []
        this.features = []
        packages.map((mod, idx) => {
            if (type == 'package', mod.id == value) {
                this.setState({ search_package: value })
                mod.features.map((feat, idx) => {
                    this.features.push(feat)
                })
            } else if (value == '') {
                mod.features.map((feat, idx) => {
                    this.features.push(feat)
                })
            }
        })
        this.setState({features: this.features})
    }

    render() {
        const revoke_request = this.state.revoke_request
        return (
            <div className="card">
                <div className="card-body">
                <div className="col-md-12">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">№</th>
                                    <th scope="col">Орон зайн өгөгдөл</th>
                                    <th scope="col">Байгууллага / мэргэжилтэн</th>
                                    <th scope="col">Тушаалын дугаар</th >
                                    <th scope="col">Тушаал гарсан огноо</th >
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                    {
                                        revoke_request.length > 0 ? revoke_request.map((req, idx) =>
                                            <RevokeRequestTable
                                                key={idx}
                                                idx={idx}
                                                values = {req}
                                                getAll = {this.getAll}
                                            />
                                        )
                                        :<tr>
                                        <td className="text-justify">Өөрчлөлт байхгүй байна</td>
                                        </tr>
                                    }
                                </tbody>
                        </table>
                    </div>
                </div>
            </div></div>
        )
    }
}
