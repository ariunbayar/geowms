import {object, string, array} from 'yup'


export const validationSchema = object().shape({
    username: string()
        .max(150, '150-с илүүгүй урттай утга оруулна уу!')
        .required('Хоосон байна утга оруулна уу.'),
    first_name: string()
        .max(30, '30-с илүүгүй урттай утга оруулна уу!')
        .required('Хоосон байна утга оруулна уу.'),
    last_name: string()
        .max(150, '150-с илүүгүй урттай утга оруулна уу!')
        .required('Хоосон байна утга оруулна уу.'),
    position: string()
        .required('Хоосон байна нэгийг сонгоно уу.'),
    state: string()
        .required('Хоосон байна нэгийг сонгоно уу.'),
    email: string()
        .email(({ value }) => `Зөв e-mail хаяг оруулна уу.`)
        .max(254, '254-с илүүгүй урттай утга оруулна уу!')
        .required('Хоосон байна утга оруулна уу.'),
    gender: string()
        .max(100, '100-с илүүгүй урттай утга оруулна уу!')
        .required('Хоосон байна утга оруулна уу.'),
    phone_number: string()
        .max(8, '8 урттай утга оруулна уу!')
        .required('Хоосон байна утга оруулна уу.')
        .matches(new RegExp('[0-9]'), 'Заавал тоо байх ёстой!'),
    register: string()
        .matches(/[аАбБвВгГдДеЕёЁжЖзЗиИйЙкКлЛмМнНоОөӨпПрРсСтТуУүҮфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ]{2}[0-9]{8}/, ({ value }) => `${value} Регистер дугаараа зөв оруулна уу.`)
        .max(10, '10-с илүүгүй урттай утга оруулна уу!')
        .required('Хоосон байна утга оруулна уу.'),
})
