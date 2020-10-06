import {object, string} from 'yup'

export const validationSchema = object().shape({
    id: string().required('оруулна уу!'),
})
