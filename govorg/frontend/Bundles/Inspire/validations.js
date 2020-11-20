import * as Yup from 'yup'

export function validations() {

    const schemaObj = []

        schemaObj['order_no'] = Yup.string().required('Нөхцөл хоосон байна !');
        schemaObj['order_at'] = Yup.date().required('Нөхцөл хоосон байна !');

    const validatesc = Yup.object(schemaObj)
    return validatesc;
}
