# JWT Auth

This repository is an independent auth component for your backend.

**Briefly about:** JWT *access* and *refresh* tokens, PostgreSQL as storage.

## Overview
The component provides full *JWT* auth including this features:
- Basic email-password auth logic
- Account creation confirmation via email
- Cookie management logic to provide invisible session control

## Setting up
1. Set up your *npm* project using `npm init`
2. Clone this repository to your project using `git clone` or any other convenient method.
3. Install required **npm** dependencies
    - bcryptjs
    - cookie-parser
    - cors
    - dotenv
    - express
    - express-validator
    - jsonwebtoken
    - nodemailer
    - nodemon _(for dev regime)_
    - pg
    - uuid
4. Create `.env` file in root directory of your project. 
5. Fill the `.env` properties
    > If you don't know how to set _environment_ properties just google it! :upside_down_face:
   
    - `API_URL`=your_api_url (https://localhost:8000 as example)
    - `CLIENT_URL`=your_frontend_url (such as `API_URL`)
    - `JWT_ACCESS_SECRET`=Y0ur_$ecRET_keY_F0R_jWt_@cce$$_t0KeN
    - `JWT_REFRESH_SECRET`=$uCh_@$_axe$_bUT_4_ReFresh
    - `PG_USER`=your_postgres_user
    - `PG_PASSWORD`=your_postgres_password
    - `PG_HOST`=your_postgres_host (_localhost_ in my case)
    - `PG_PORT`=your_postgres_port (default port for postgres is 5432)
    - `PORT`=your_server_port (8000 as example)
5. ***TODO***

## How can you improve this component in your project?
***TODO***
    
