import * as autoEmailHelper from '../utility/AutoEmailHelper.js';

// POST http://localhost:3008/api/v1/auto-email/application-confirm
export function sendApplicationConfirm(req, res) {
    let formTitle;
    const lang = req.body.lang.toLowerCase();

    switch (lang) {
        case 'en':
            formTitle = 'Summer 2024 Specific Skills Camp (Age 10-14)';
            break;
        case 'zh-hant':
        case 'zh_hant':
            formTitle = '2024技能夏令營 (10-14 歲)';
            break;
        case 'zh':
            formTitle = '2024技能夏令营 (10-14 岁)';
            break;
    }

    autoEmailHelper.sendApplicationConfirm('Tai Man', req.body.email, formTitle, lang);
    res.sendStatus(200);
}

// POST http://localhost:3008/api/v1/auto-email/enroll-confirm
export function sendEnrollConfirm(req, res) {
    let formTitle;
    const lang = req.body.lang.toLowerCase();

    switch (lang) {
        case 'en':
            formTitle = 'Summer 2024 Specific Skills Camp (Age 10-14)';
            break;
        case 'zh-hant':
        case 'zh_hant':
            formTitle = '2024技能夏令營 (10-14 歲)';
            break;
        case 'zh':
            formTitle = '2024技能夏令营 (10-14 岁)';
            break;
    }

    autoEmailHelper.sendEnrollConfirm('Tai Man', req.body.email, formTitle, lang);
    res.sendStatus(200);
}
