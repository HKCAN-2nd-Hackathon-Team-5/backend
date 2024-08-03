# backend

## API Documentation

For the API that has return: none, there's actually an object returned by the database containing the number of affected
rows.

### Student

`POST http://localhost:3008/api/v1/student`

- body: an object containing all the following properties
    - `first_name: string`
    - `last_name: string`
    - `gender: string`
    - `dob: string (YYYY-MM-DD)`
    - `address: string`
    - `city: string`
    - `postal_code: string (6 characters)`
    - `phone_no: int/string (10 digits)`
    - `email: string`
- return: none

`GET http://localhost:3008/api/v1/student`

- return: an array of all the students

`GET http://localhost:3008/api/v1/student/query`

- possible queries:
    - `first_name`
    - `last_name`
    - `gender`
    - `address`
    - `city`
    - `postal_code`
    - `email`
- return: an array of students that satisfy all the queries

`GET http://localhost:3008/api/v1/student/:student_id`

- return: an array of the student with the specified id

`PUT http://localhost:3008/api/v1/student/:student_id`

- body: an object containing any of the following properties
    - `first_name: string`
    - `last_name: string`
    - `gender: string`
    - `dob: string (YYYY-MM-DD)`
    - `address: string`
    - `city: string`
    - `postal_code: string (6 characters)`
    - `phone_no: int/string (10 digits)`
    - `email: string`
- return: none

`DELETE http://localhost:3008/api/v1/student/:student_id`

- return: none

### Application

Please read *Functions for Backend* for more details.

