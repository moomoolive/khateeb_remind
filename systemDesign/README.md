# Khateeb Remind System Design Document

## Purpose

The purpose of this document is to explain the systen design of Khateeb Remind and some reasons for many of the design desicions. It should aid anyone wanting to replicate the app or contribute to the project in understanding the project on a deeper level.

## The Stack Used

### Client (Frontend) - Javascript
* Vuejs - javascript framework
  * Vue router - for routing
  * Vuex - for state management
  * Vue PWA Plugin - useful library for creating PWAs with vue

#### Build Tools
* Webpack - module bundler
* SASS - CSS preprocessor
* Babel - javascript transpiler

#### Development Tools
* Serve - a javascript library for running webservers (used for testing PWA)
* ESLint - a linting tool
* Jest - testing framework
* VueCLI - managing webpack, dev server, etc.

### Server (Backend) - Javascript
* Expressjs - a node server framework
* Docker - for containerization

#### Database
* MongoDB - a NoSQL database
* Mongoose - a mongoDB middleware for node

#### Software Development Kits (SDKs)
* Amazon Web Services (AWS) client s3 - a library for uploading files to the cloud
* AWS client SES - a library for sending emails

#### Development Tools
* Nodemon - hot reload of server
* Jest - testing framework
