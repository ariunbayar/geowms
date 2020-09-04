import {object, string} from 'yup'


export const validationSchema = object().shape({

    tesgiin_ner: string()
        .max(50, '50-с илүүгүй урттай оруулна уу!')
        .required('Хоосон байна!'),
    toviin_dugaar: string()
        .max(100, '100-с илүүгүй урттай оруулна уу!')
        .required('Хоосон байна!'),
    pid: string()
        .max(20, '20-с илүүгүй урттай оруулна уу!')
        .required('Хоосон байна!'),
    suljeenii_torol: string()
        .required('Хоосон байна!'),
    center_typ: string()
        .max(10, '10-с илүүгүй урттай оруулна уу!')
        .required('Хоосон байна!'),
    sudalga_or_shine: string()
        .required('Хоосон байна!'),
    date: string()
        .required('Хоосон байна!'),
    hors_shinj_baidal: string()
        .max(200, '200-с илүүгүй урттай оруулна уу!')
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
