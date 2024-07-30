export function sendError(err, res) {
    console.error(err);
    res.status(500).send('Server error.');
}
