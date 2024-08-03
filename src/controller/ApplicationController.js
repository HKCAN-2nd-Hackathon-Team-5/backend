import databaseQuery from "../utility/DatabaseQuery.js";

// POST http://localhost:3008/api/v1/application
export function create(req, res) {
    res.status(200).json({ message: 'Application created successfully.' });
}

// GET http://localhost:3008/api/v1/application
export function read(req, res) {
    res.status(200).json({ message: 'Applications read successfully.' });
}

// PUT http://localhost:3008/api/v1/application
export function update(req, res) {
    res.status(200).json({ message: 'Application updated successfully.' });
}

// DELETE http://localhost:3008/api/v1/application
export function remove(req, res) {
    res.status(200).json({ message: 'Application deleted successfully.' });
}
