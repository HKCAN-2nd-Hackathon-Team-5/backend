export default function (query, req, res) {
    req.app.locals.db.query(query, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('SERVER ERROR');
            return;
        }

        res.status(200).json(data.recordset);
    });
}
