import {object, string} from 'yup'


export const validationSchema = object().shape({

    name: string()
        .max(250, '250-с илүүгүй урттай оруулна уу!')
        .required('Хоосон байна утга оруулна уу.'),
    website: string()
        .matches(/^((http|https):\/\/)?([a-zA-Z0-9]+\.)?([a-zA-Z0-9][a-zA-Z0-9-]*)?((\:[a-zA-Z0-9]{2,6})|(\.[a-zA-Z0-9]{2,6}))$/, `Домайн нэрээ зөв оруулна уу.`),
})
