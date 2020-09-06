import {object, string} from 'yup'


export const validationSchema = object().shape({

    dugaar: string()
        .max(100, '100-с илүүгүй урттай оруулна уу!')
        .required('Хоосон байна!'),
    date: string()
        .max(50, '50-с илүүгүй урттай оруулна уу!')
        .required('Хоосон байна!'),
    too_shirheg: string()
        .required('Хоосон байна!'),
    burtgegch: string()
        .max(100, '100-с илүүгүй урттай оруулна уу!')
        .required('Хоосон байна!'),

})

export const validationSchemaTseg = object().shape({
    torol_zuil_dursgalt_gazriin_ner: string()
        .max(100, '100-с илүүгүй урттай оруулна уу!')
        .required('Хоосон байна!'),
    torol_zuiltorol_zuil_name: string()
    .required('Хоосон байна!'),
    torol_zuil_dursgalt_gazriin_coordinatalt: string()
        .max(50, '50-с илүүгүй урттай оруулна уу!')
        .required('Хоосон байна!'),
    torol_zuil_todorhoilolt: string()
        .max(500, '500-с илүүгүй урттай оруулна уу!')
        .required('Хоосон байна!'),
    hemjee_talbai: string()
        .max(20, '20-с илүүгүй урттай оруулна уу!')
        .required('Хоосон байна!'),
    hemjee_urt: string()
        .max(100, '100-с илүүгүй урттай оруулна уу!')
        .required('Хоосон байна!'),
    hemjee_orgon: string()
        .max(20, '20-с илүүгүй урттай оруулна уу!')
        .required('Хоосон байна!'),
    hemjee_ondor: string()
        .max(20, '20-с илүүгүй урттай оруулна уу!')
        .required('Хоосон байна!'),
    hemjee_zuzaan: string()
        .max(20, '20-с илүүгүй урттай оруулна уу!')
        .required('Хоосон байна!'),
    hemjee_golch: string()
        .max(20, '20-с илүүгүй урттай оруулна уу!')
        .required('Хоосон байна!'),
    hemjee_busad_hemjee: string()
        .max(50, '50-с илүүгүй урттай оруулна уу!'),
    hemjee_temdeglel: string()
        .max(500, '500-с илүүгүй урттай оруулна уу!'),

    dg_ezen_temdeglel: string()
        .max(500, '500-с илүүгүй урттай оруулна уу!'),

    dgh_tusgai_temdeglel: string()
        .max(500, '500-с илүүгүй урттай оруулна уу!'),

    dgh_yaaraltai_temdeglel: string()
        .max(500, '500-с илүүгүй урттай оруулна уу!'),

    dgh_omchlol_ezemshih_omchlol_sanal_temdeglel: string()
        .max(500, '500-с илүүгүй урттай оруулна уу!'),

    dgh_maltan_sudaltan_temdeglel: string()
        .max(500, '500-с илүүгүй урттай оруулна уу!'),

    dgh_gemtliin_temdeglel: string()
        .max(500, '500-с илүүгүй урттай оруулна уу!'),

    dgh_baigaliin_huchin_zuil_temdeglel: string()
        .max(500, '500-с илүүгүй урттай оруулна уу!'),

    dgh_sergeen_zasvarlasan_eseh_temdeglel: string()
        .max(500, '500-с илүүгүй урттай оруулна уу!'),

    dgh_sergeen_zasvarlah_eseh_temdeglel: string()
        .max(500, '500-с илүүгүй урттай оруулна уу!'),

    dgh_hamgaalaltiin_zereg_oorchloh_sanal_temdeglel: string()
        .max(500, '500-с илүүгүй урттай оруулна уу!'),

    dgh_hashaa_baigaa_eseh_temdeglel: string()
        .max(500, '500-с илүүгүй урттай оруулна уу!'),

    dgh_saravchtai_eseh_temdeglel: string()
        .max(500, '500-с илүүгүй урттай оруулна уу!'),

    dgh_hayg_tailbar_eseh_temdeglel: string()
        .max(500, '500-с илүүгүй урттай оруулна уу!'),

    last_busad_temdeglel: string()
        .max(500, '500-с илүүгүй урттай оруулна уу!'),

    dg_ezen_dursgalt_gazar_ezen: string()
        .required('Хоосон байна!'),
    dgh_angilal: string()
        .required('Хоосон байна!'),
    dgh_bus_togtooh_shaardlaga: string()
        .required('Хоосон байна!'),
    dgh_tusgai_hamgaalalt: string()
        .required('Хоосон байна!'),
    dgh_yaaraltai_hamgaalalt: string()
        .required('Хоосон байна!'),
    dgh_omchlol_ezemshih_omchlol_sanal_hamgaalalt: string()
        .required('Хоосон байна!'),
    dgh_maltan_sudaltan_hamgaalalt: string()
        .required('Хоосон байна!'),
    dgh_sergeen_zasvarlasan_eseh_hamgaalalt: string()
        .required('Хоосон байна!'),
    dgh_sergeen_zasvarlah_eseh_nenshaardlaga: string()
        .required('Хоосон байна!'),
    dgh_hamgaalaltiin_zereg_oorchloh_sanal: string()
        .required('Хоосон байна!'),
    dgh_hashaa_baigaa_eseh_hashaa: string()
        .required('Хоосон байна!'),
    dgh_saravchtai_eseh_saravch: string()
        .required('Хоосон байна!'),
    dgh_hayg_tailbar_eseh_hayg: string()
        .required('Хоосон байна!'),

})