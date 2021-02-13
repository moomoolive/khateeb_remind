# Khateeb Remind Server

## Require Enviromental Variables
### Note: these variables are case-sensitive
```
* DATABASE: a url pointing an instance of MongoDB (such as mongo Atlas)
* ENCRYPTION_KEY: a key used for encrytion/decryption of sensitive in the database
* DEFAULT_ROOT_PASS: the default password for the root user once the root user creation script runs (checkout the 'cron' folder for more information)
* JWT_SECRET: a key used for signing and verifying JWTs (used for all user authorization)
* EMERGENCY_KEY: a password used to manually configure server in emergency situtations, such as forgetting root password, etc.
```

## Project setup
```
npm install
```

### Runs development server with hot-reloads
```
npm run dev
```

### Runs production server
```
npm run app
```