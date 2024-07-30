# backend

## API Documentation

For the API that has return: none, there's actually an object returned by the database containing the number of affected
rows.

### Customer

`POST http://localhost:3008/api/v1/customer`

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

`GET http://localhost:3008/api/v1/customer`

- return: an array of all the customers

`GET http://localhost:3008/api/v1/customer/:id`

- return: an array of the customer with the specified id

`PUT http://localhost:3008/api/v1/customer/:id`

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

`DELETE http://localhost:3008/api/v1/customer/:id`

- return: none

### Registration

Should be similar to the Customer one. Let's see if we have time to update the document.
