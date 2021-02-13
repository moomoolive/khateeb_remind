# Khateeb Remind Server

## Require Enviromental Variables
### Note: .env file must be present in the root folder 
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

## Recommended Hosting
```
If you intend to host this server independantly it's recommended to containerize with docker first. You will find the same dockerfile that is used for the official build in the root folder. 
**Important: this app is configured to set all the enviromental variables (except "NODE_ENV") via node and NOT through docker**
```