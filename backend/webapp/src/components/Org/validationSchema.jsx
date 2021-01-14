import {object, string} from 'yup'


export const validationSchema = object().shape({
    org_name: string()
        .max(150, '150-с илүүгүй урттай утга оруулна уу!')
        .required('Хоосон байна утга оруулна уу.'),
    org_level: string()
        .max(100, '100-с илүүгүй урттай утга оруулна уу!')
        .required('Хоосон байна утга оруулна уу.'),
    org_role: string()
        .max(100, '100-с илүүгүй урттай утга оруулна уу!')
        .required('Хоосон байна утга оруулна уу.'),
})
