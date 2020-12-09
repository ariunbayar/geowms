import {object, string} from 'yup'


export const validationSchemaCreate = object().shape({
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
        .max(250, '250-с илүүгүй урттай утга оруулна уу!')
        .required('Хоосон байна утга оруулна уу.'),
    email: string()
        .max(254, '254-с илүүгүй урттай утга оруулна уу!')
        .required('Хоосон байна утга оруулна уу.'),
    gender: string()
        .max(100, '100-с илүүгүй урттай утга оруулна уу!')
        .required('Хоосон байна утга оруулна уу.'),
    register: string()
        .max(10, '10-с илүүгүй урттай утга оруулна уу!')
        .required('Хоосон байна утга оруулна уу.'),
    password: string()
        .required('Хоосон байна утга оруулна уу.'),
    re_password: string()
        .required('Хоосон байна утга оруулна уу.'),
})


export const validationSchemaUpdate = object().shape({
    first_name: string()
        .max(30, '30-с илүүгүй урттай утга оруулна уу!')
        .required('Хоосон байна утга оруулна уу.'),
    last_name: string()
        .max(150, '150-с илүүгүй урттай утга оруулна уу!')
        .required('Хоосон байна утга оруулна уу.'),
    position: string()
        .max(250, '250-с илүүгүй урттай утга оруулна уу!')
        .required('Хоосон байна утга оруулна уу.'),
    email: string()
        .max(254, '254-с илүүгүй урттай утга оруулна уу!')
        .required('Хоосон байна утга оруулна уу.'),
    gender: string()
        .max(100, '100-с илүүгүй урттай утга оруулна уу!')
        .required('Хоосон байна утга оруулна уу.'),
    register: string()
        .max(10, '10-с илүүгүй урттай утга оруулна уу!')
        .required('Хоосон байна утга оруулна уу.'),
})
