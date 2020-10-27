import * as Yup from 'yup'

export function validationSchema(fields, id) {

    const schemaObj = []

    fields.map((f) => {
        if (id) {
            if (f.type !== 'geometry') {
                if (f.type == 'integer' ||
                    f.type == 'double precision' ||
                    f.type == "bigint")
                {
                    schemaObj[f.name] =
                        Yup.number()
                            .typeError('Заавал тоо байх ёстой !')
                            .required('Нөхцөл хоосон байна !');
                }
                if (f.type == 'character varying' || f.type == 'character' ) {
                    schemaObj[f.name] =
                        Yup.string()
                            .max(50, 'Хэт урт байна !')
                            .required('Нөхцөл хоосон байна !');
                }
            }
        }
        else {
            if (f.name !== 'id' &&
                f.type !== 'geometry') {
                if (f.type == 'integer' ||
                    f.type == 'double precision' ||
                    f.type == "bigint")
                {
                    schemaObj[f.name] =
                        Yup.number()
                            .typeError('Заавал тоо байх ёстой !')
                            .required('Нөхцөл хоосон байна !');
                }
                if (f.type == 'character varying' || f.type == 'character' ) {
                    schemaObj[f.name] =
                        Yup.string()
                            .max(50, 'Хэт урт байна !')
                            .required('Нөхцөл хоосон байна !');
                }
            }
        }
    });
    const validatesc = Yup.object(schemaObj)
    return validatesc;
}