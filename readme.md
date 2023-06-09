## GoIT Node.js Course Template Homework

## Getting Started

1. **Clone the repository**

2. **Install the dependencies:**

   ```
   npm install
   ```

3. **Set up the environment variables:**

   Create a .env file in the root directory.
   Add the following variables to the .env file:

   ```
   DB_HOST = 'mongodb+srv://<username>:<pswd>@cluster0.mw1yxix.mongodb.net/db-contacts?retryWrites=true&w=majority'

   ```

4. **Use one of the commands:**

- `npm start` &mdash; start server in production mode
- `npm run start:dev` &mdash; start server in dev mode (development)
- `npm run lint` &mdash; checking code with ESlint
- `npm lint:fix` &mdash; checking code and autofix

The API server will start running on http://localhost:3000.

## API Endpoints

### GET /contacts : Get all contacts.

### GET /contacts/:contactId : Get a contact by ID.

### POST /contacts : Create a new contact.

### PUT /contacts/:contactId : Update a contact by ID.

### PATCH /contacts/:contactId/favorite : Update favorite status by contact ID.

### DELETE /contacts/:contactId : Delete a contact by ID.
