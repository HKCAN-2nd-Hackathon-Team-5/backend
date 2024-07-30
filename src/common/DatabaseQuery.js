﻿export default function (query, params, req, res) {
    let statement = req.app.locals.db.request();

    params?.forEach(param => {
        statement = statement.input(param.name, param.type, req.body[param.name]);
    })

    statement.query(query, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error.');
            return;
        }

        const command = query.substring(0, 6).toUpperCase();

        if (command === 'INSERT') {
            res.status(201).json(data);
        } else if (command === 'SELECT') {
            res.status(200).json(data.recordset);
        } else {
            res.status(200).json(data);
        }
    });
}
