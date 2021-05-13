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

todo


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
