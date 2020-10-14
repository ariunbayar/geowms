import React, {Component} from "react"


export class Typify extends Component {
    render() {

        const field = this.props.field

        return (
            <small className="text-muted col-sm-2">
                {
                    field == 'bigint'
                    ? 'Бүхэл том тоо оруулж .'
                    : field == 'integer'
                    ? 'Зөвхөн бүхэл тоо оруулна.'
                    : field == 'character varying'
                    ? 'Үсэг, тэмдэгт бичиж .'
                    : field == 'double precision'
                    ? 'Бутархай тоо оруулж .'
                    : null
                }
            </small>
        )
    }
}
