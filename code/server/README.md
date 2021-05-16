# Khateeb Remind Server

### Note: .env & .env.development file must be present in this folder

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
npm run server
```

### Runs Unit Tests
```
npm run test:unit
```

### Runs Integration Tests
```
npm run test:int
```

### Removes Unused Docker Images from Docker Daemon
```
npm run docker:remove-old
```
* Docker Daemon must be running to execute correctly

### Creates Test Docker Image and Creates a Container From It
```
npm run docker:create-test-container
```
* Docker Daemon must be running to execute correctly

### Runs Test Docker Container
```
npm run docker:run-test-container
```
* Docker Daemon must be running to execute correctly

### Removes Old Test Docker Container And Images, Creates a New Test Container, Then Runs it
```
npm run docker:test
```
* Docker Daemon must be running to execute correctly
