import React, {Component} from "react"


export class Typify extends Component {
    render() {

        const field = this.props.field

        return (
                <small className="text-muted col-sm-2">
                    {
                        field == 'bigint'
                        ? 'Бүхэл том тоо оруулна. Жишээлбэл: 11000'
                        : field == 'integer'
                        ? 'Зөвхөн бүхэл тоо оруулна. Жишээлбэл: 45'
                        : field == 'character varying'
                        ? 'Үсэг, тэмдэгт бичиж болно. Жишээлбэл: Улаанбаатар'
                        : field == 'double precision'
                        ? 'Бутархай тоо оруулна. Жишээлбэл: 642506.59824'
                        : field == 'numeric'
                        ? 'Бүхэл, бутархай, том, жижиг гэх мэт тоо байна. Жишээлбэл: 12, 642506.59824, 32767'
                        : null
                    }
                </small>
        )
    }
}