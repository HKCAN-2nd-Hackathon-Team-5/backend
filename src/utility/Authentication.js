export default function (req, res, next) {
    if (req.headers.authorization === undefined) {
        res.sendStatus(401);
        return;
    }

    const authDetail = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString();

    if (authDetail !== process.env.ADMIN_USERNAME + ':' + process.env.ADMIN_PASSWORD) {
        res.sendStatus(403);
        return;
    }

    next();
}
