# Khateeb Remind System Design Document

# Purpose

The purpose of this document is to explain the systen design of Khateeb Remind and some reasons for many of the design desicions. It should aid anyone wanting to replicate the app or contribute to the project in understanding the project on a deeper level.

## Table of Contents

* [Project Stack](#project-stack)
* [Notes on Project Structure](#notes-on-project-structure)
* [Authorization Across the App](#authorization-across-the-app)
* [Reasons for using Vue](#reasons-for-using-vue)
* [Web App Routing](#web-app-routing)
* [Client Side 'Runtimes'](#client-side-runtimes)
* [Progressive Web App Testing](#progressive-web-app-testing)
* [Client Side Issues](#client-side-issues)
* [Client Side Configurations](#client-side-configurations)
* [Reasons for Using Node](#reasons-for-using-node)
* [Server Side Controllers](#server-side-controllers)
* [About Database and Schemas](#about-database-and-schemas)
* [The Nefarious Notification Loop](#the-nefarious-notification-loop)
* [About Notifications and Third Party Services](#about-notifications-and-third-party-services)
* [Server Side Configurations](#server-side-configurations)
* [Server Initialization](#server-initialization)
* [Dev-Ops Suggestions](#dev-ops-suggestions)
* [Closing Notes](#closing-notes)


# Project Stack

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


# Notes on Project Structure

#### Libraries
All custom client and server libraries are found in the "libraries" folder at the root folder of each respective project. In general, each library will include two files:

* main.js  
* helpers.js 

The "main.js" file repersents the library's public interface which is meant to be used. The "helpers.js" repersents the libraries private interface and backend implementations, which are NOT intended to be used, but serve only as implementation details for the public interface.

There a few libraries that stray from this rule, such as the "requests" client library. Usually these libraries will be compilation of sub-libraries which follow the convention mentioned above or will be a single file will are meant to be a public interface such as the "globalUtilities.js" client and server libraries.

Also on the server side there is a "middleware" folder, which essentially is a library, but I felt as if the distinction was helpful for distinguishing between general libraries and one's that are only used as API middleware.

#### App and Server Entry points
The client entry point is found in the src folder and is name "App.js", while the entrypoint Vue instance is called "Main.vue".

The server entry point is called "Server.js" and is found in the root folder of the server.

### Config Files
As a general rule all configuration files are found in the root folder of each project. The only exception to this is the "icon.config.js" client configuration file which is found in the src folder of the client.

On the client side the "App.config.js" file found in the root folder is simply a compilation of neccessary environmental variables and configurations that are specific to the Khateeb Remind client. The "globalConfig" object is globally imported across the entire web-app via Vue prototyping.

On the server side the "Server.config.js" file found in the root folder servers the same purpose as "App.config.js" on the client. For obvious reasons the environmental variables for the server side are not included in this public repository, but you can recreate the .env file for both production and development by finding all the "process.env" references in the "Server.config.js" file.


#### Global Variables and Functions
Each project has it's own global variables and functions. Any global configurations are found in either "App.config.js" or "Server.config.js" depending on the project. Any other global variables are found in the entry point for each respective app. 

Global variables are prepended by _ in the client app. This convention was chosen to avoid namespace conflicts with Vue's reserved properties which are prepend with "$". Variables are:

* \_api: all api requests
* \_utils: useful utility functions
* \_config: global app configurations 

On the server side global variables are prepended by "$", and are attached to the global Node object. Variables are:

* $rootDir: absolute path to the project's root directory
* $config: global server configurations
* $utils: useful utility functions
* $db: a reference to a list of all database models

#### NPM scripts
The README files at the root of the client and server provide brief explantions of the npm scripts for each respective project.

# Authorization Across the App

todo


# Reasons for using Vue

todo


# Web App Routing

todo


# Client Side Runtimes

todo


# Progressive Web App Testing

todo


# Client Side Issues

todo


# Client Side Configurations

todo


# Reasons for Using Node

todo


# Server Side Controllers

todo


# About Database and Schemas

todo


# The Nefarious Notification Loop

todo


# About Notifications and Third Party Services

todo


# Server Side Configurations

todo


# Server Initialization

todo


# Dev Ops Suggestions

todo


# Closing Notes

todo
