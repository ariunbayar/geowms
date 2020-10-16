import React, { Component } from 'react'
import ThemJson from  './theme.json'
import {DedsanBvtetsItems} from './DedsanBvtetsItems'
import { service } from './service'



export class DedsanBvtets extends Component {

    constructor(props) {
        super(props)

        this.state={
            list_all:[]
        }
        this.getAll = this.getAll.bind(this)
    }

    componentDidMount(){
        this.getAll()
    }

    getAll(){
        service.getall().then(({success, data}) => {
            if(success){
                console.log(data)
                this.setState({
                    list_all:data
                })
            }
        })
    }

    /*
                    {ThemJson.map((theme, idx) =>
                  <DedsanBvtetsItems key = {idx} values={theme}></DedsanBvtetsItems>
                )}*/


    render() {
        return (
            <div>
            
            </div>
        )
    }

}

