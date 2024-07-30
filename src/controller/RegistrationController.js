import databaseQuery from "../common/DatabaseQuery.js";

// POST http://localhost:3008/api/v1/registration
export function create(req, res) {
    res.status(200).json({ message: 'Registration created successfully.' });
}

// GET http://localhost:3008/api/v1/registration
export function read(req, res) {
    res.status(200).json({ message: 'Registrations read successfully.' });
}

// PUT http://localhost:3008/api/v1/registration
export function update(req, res) {
    res.status(200).json({ message: 'Registration updated successfully.' });
}

// DELETE http://localhost:3008/api/v1/registration
export function remove(req, res) {
    res.status(200).json({ message: 'Registration deleted successfully.' });
}
