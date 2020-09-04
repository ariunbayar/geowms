import * as Yup from 'yup'

export const validationSchemaDan = Yup.object().shape({
        oiroltsoo_bairlal: Yup.string()
            .min(2, 'Хэт богионо байна!')
            .max(50, 'Хэт урт байна!')
            .required('Ойролцоо цэгийн байрлал хоосон байна!'),
        evdersen_baidal: Yup.string()
            .required('Ойролцоо цэгийн байрлал хоосон байна!'),
        nohtsol_baidal: Yup.string()
            .min(2, 'Хэт богионо байна!')
            .max(50, 'Хэт урт байна!')
            .required('Нөхцөл хоосон байна!'),
        sergeeh_sanal: Yup.string()
            .required('Санал хоосон байна!'),
});

export const validationSchemaAdmin = Yup.object().shape({
    //Цэгийн хувийн хэргийн дугаар
    email: Yup.string()
        .email('Имайл хаяг таарахгүй байна!')
        .required('Имайл хаяг хоосон байна!'),
    baiguulaga: Yup.string()
        .min(2, 'Хэт богионо байна!')
        .max(50, 'Хэт урт байна!')
        .required('Байгууллагын нэр хоосон байна.'),
    alban_tushaal: Yup.string()
        .min(2, 'Хэт богионо байна!')
        .max(50, 'Хэт урт байна!')
        .required('Албан тушаал хоосон байна!'),
    utas: Yup.number()
        .integer('Заавал тоо байх ёстой')
        .positive()
        .required('Утас бичээгүй байна!'),
    // password: Yup.string()
    //     .min(6, 'Password must be at least 6 characters')
    //     .required('Password is required'),
    // confirmPassword: Yup.string()
    //     .oneOf([Yup.ref('password'), null], 'Passwords must match')
    //     .required('Confirm Password is required'),
    //Цэгийн мэдээлэл
    // tsegiin_dugaar: Yup.string()
    //     .min(2, 'Хэт богионо байна!')
    //     .max(50, 'Хэт урт байна!')
    //     .required('Цэгийн дугаар хоосон байна!'),
    oiroltsoo_bairlal: Yup.string()
        .min(2, 'Хэт богионо байна!')
        .max(50, 'Хэт урт байна!')
        .required('Ойролцоо цэгийн байрлал хоосон байна!'),
    evdersen_baidal: Yup.string()
        .required('Ойролцоо цэгийн байрлал хоосон байна!'),
    nohtsol_baidal: Yup.string()
        .min(2, 'Хэт богионо байна!')
        .max(50, 'Хэт урт байна!')
        .required('Нөхцөл хоосон байна!'),
    sergeeh_sanal: Yup.string()
        .required('Санал хоосон байна!'),
});
