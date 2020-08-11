import {object, string} from 'yup'


export const validationSchema = object().shape({

    name: string()
        .max(250, '250-с илүүгүй урттай оруулна уу!')
        .required('оруулна уу!'),
})
