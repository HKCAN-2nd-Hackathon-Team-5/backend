export default function (status, error, body) {
    const output = {
        status: status,
        msg: status >= 200 && status < 300 ? 'Success' : 'Failed',
        error: error
    };
    Object.assign(output, body);
    return output;
}
