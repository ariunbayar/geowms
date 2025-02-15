import {object, string} from 'yup'


export const validationSchema = object().shape({

    suljeenii_torol: string()
        .required('Хоосон байна!'),
    ondor: string()
        .required('Хоосон байна!'),
    ondor_torol: string()
        .required('Хоосон байна!'),
    center_typ: string()
        .max(10, '10-с илүүгүй урттай оруулна уу!')
        .required('Хоосон байна!'),
    sudalga_or_shine: string()
        .required('Хоосон байна!'),
    date: string()
        .required('Хоосон байна!'),
    hotolson: string()
        .max(100, '100-с илүүгүй урттай оруулна уу!')
        .required('Хоосон байна!'),
    alban_tushaal: string()
        .max(200, '200-с илүүгүй урттай оруулна уу!')
        .required('Хоосон байна!'),
    alban_baiguullga: string()
        .max(200, '200-с илүүгүй урттай оруулна уу!')
        .required('Хоосон байна!'),

})
