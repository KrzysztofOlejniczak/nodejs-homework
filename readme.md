## GoIT Node.js Course Homework

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
   DB_HOST = Your mongodb+srv uri
   SECRET = Your secret string to sign jwt
   SENDGRID_API_KEY = Your sendgrid API key
   EMAIL_SENDER = Your verified in sendgrid sender email
   BASE_URL = 'http://localhost'
   PORT = '3000'

   ```

4. **Use one of the commands:**

- `npm start` &mdash; start server in production mode
- `npm run start:dev` &mdash; start server in dev mode (development)
- `npm run lint` &mdash; checking code with ESlint
- `npm lint:fix` &mdash; checking code and autofix

The API server will start running on http://localhost:3000.

## API Endpoints

### GET /contacts : Get all contacts.

### GET /contacts?favorite=true&page=1&limit=20 : Get all contacts with favorite filter and pagination.

### GET /contacts/:contactId : Get a contact by ID.

### POST /contacts : Create a new contact.

### PUT /contacts/:contactId : Update a contact by ID.

### PATCH /contacts/:contactId/favorite : Update favorite status by contact ID.

### DELETE /contacts/:contactId : Delete a contact by ID.

### POST /users/signup : Register new user.

### POST /users/login : Login user.

### POST /users/logout : Logout user.

### GET /users/current : Get current user data.

### PATCH /users/ : Change users subscription.

### PATCH /users/avatars : Change users avatar > upload file with _avatar_ key.

### GET /users/verify/:verificationToken : Verify user email by sended verification token

### POST /users/verify : Resend verification email
