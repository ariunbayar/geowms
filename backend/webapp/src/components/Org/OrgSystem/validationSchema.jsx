import {object, string} from 'yup'


export const validationSchema = object().shape({

    name: string()
        .max(250, '250-с илүүгүй урттай оруулна уу!')
        .required('Хоосон байна утга оруулна уу.'),
    website: string()
        .matches(/^((ftp|http|https):\/\/)?([a-zA-Z0-9]+\.)?([a-zA-Z0-9][a-zA-Z0-9-]*)?((\:[a-zA-Z0-9]{2,6})|(\.[a-zA-Z0-9]{2,6}))$/, ({ value }) => `${value} Домайн нэрээ зөв оруулна уу.`)
        .max(250, '10-с илүүгүй урттай утга оруулна уу!')
})
