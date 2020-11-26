import {object, string} from 'yup'

function stringSchema(max) {
    if (max !== null && max !== undefined) {
        return string()
            .max(max, '${max}-с илүүгүй урттай оруулна уу!')
            .required('оруулна уу!')
    } else {
        return string()
            .required('оруулна уу!')
    }
}

export const validations = object().shape({
    email: stringSchema(20),
    password: stringSchema(20),
})