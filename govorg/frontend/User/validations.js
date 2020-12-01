import {object, string} from 'yup'

function stringSchema(max) {
    if (max !== null && max !== undefined) {
        return string()
            .max(max, '${max}-с илүүгүй урттай оруулна уу!')
            .required('Хоосон байна!')
    } else {
        return string()
            .required('Хоосон байна!')
    }
}

export const validations = object().shape({
    old_password: stringSchema(20),
    new_password: stringSchema(20),
    re_new_password: stringSchema(20),
})
