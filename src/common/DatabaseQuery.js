export default function (query, req, res, operation) {
    req.app.locals.db.query(query, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error.');
            return;
        }

        if (operation === 'create') {
            res.status(201).json(data);
        } else if (operation === 'read') {
            res.status(200).json(data.recordset);
        } else {
            res.status(200).json(data);
        }
    });
}
