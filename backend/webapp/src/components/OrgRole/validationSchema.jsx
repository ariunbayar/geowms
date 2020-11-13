import {object, string} from 'yup'


export const validationSchema = object().shape({

    name: string()
        .max(250, '250-с илүүгүй урттай оруулна уу!')
        .required('Хоосон байна хоосон байж болохгүй!'),
    description: string()
        .max(250, '1000-с илүүгүй урттай оруулна уу!')
        .required('Хоосон байна хоосон байж болохгүй!'),
})
