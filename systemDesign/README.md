# Khateeb Remind System Design Document

# Purpose

The purpose of this document is to explain the systen design of Khateeb Remind and some reasons for many of the design desicions. It should aid anyone wanting to replicate the app or contribute to the project in understanding the project on a deeper level.

## Table of Contents

* [App Motivation](#app-motivation)
* [Project Stack](#project-stack)
* [Notes on Project Structure](#notes-on-project-structure)
* [NPM Scripts](#npm-scripts)
* [Environmental Variables](#environmental-variables)
* [Authorization Across the App](#authorization-across-the-app)

### Client Side
* [Reasons for using Vue](#reasons-for-using-vue)
* [Web App Routing](#web-app-routing)
* [Client Side 'Runtimes'](#client-side-runtimes)
* [Progressive Web App Testing](#progressive-web-app-testing)
* [Offline Mode](#offline-mode)
* [Client Side Configurations](#client-side-configurations)
* [On Client Side Performance](#on-client-side-performance)

### Server side
* [Reasons for Using Node](#reasons-for-using-node)
* [Server Side Controllers](#server-side-controllers)
* [About Database and Schemas](#about-database-and-schemas)
* [The Nefarious Notification Loop](#the-nefarious-notification-loop)
* [About Notifications and Third Party Services](#about-notifications-and-third-party-services)
* [Server Side Configurations](#server-side-configurations)
* [Server Initialization](#server-initialization)

### Extra Information
* [Dev-Ops Suggestions](#dev-ops-suggestions)
* [Closing Notes](#closing-notes)

<br/><br/><br/><br/>
# App Motivation

todo


# Project Stack

## Client (Frontend) - Javascript
* Vuejs - javascript framework
  * Vue router - for routing
  * Vuex - for state management
  * Vue PWA Plugin - useful library for creating PWAs with vue

### Build Tools
* Webpack - module bundler
* SASS - CSS preprocessor
* Babel - javascript transpiler

### Development Tools
* Serve - a javascript library for running webservers (used for testing PWA)
* ESLint - a linting tool
* VueCLI - managing webpack, dev server, etc.

## Server (Backend) - Javascript
* Expressjs - a node server framework
* Docker - for containerization

### Database
* MongoDB - a NoSQL database
* Mongoose - a mongoDB middleware for node

### Software Development Kits (SDKs)
* Amazon Web Services (AWS) client s3 - a library for uploading files to the cloud
* AWS client SES - a library for sending emails

### Development Tools
* Nodemon - hot reload of server

## Testing
* Unit-testing: Jest
* Integration-testing: Jest
* End-to-End: Cypress

# Notes on Project Structure

## Libraries
All custom client and server libraries are found in the "libraries" folder at the root folder of each respective project. In general, each library will include two files:

* main.js  
* helpers.js 

The "main.js" file repersents the library's public interface which is meant to be used. The "helpers.js" repersents the libraries private interface and backend implementations, which are NOT intended to be used, but serve only as implementation details for the public interface.

There a few libraries that stray from this rule, such as the "requests" client library. Usually these libraries will be compilation of sub-libraries which follow the convention mentioned above or will be a single file will are meant to be a public interface such as the "globalUtilities.js" client and server libraries.

Also on the server side there is a "middleware" folder, which essentially is a library, but I felt as if the distinction was helpful for distinguishing between general libraries and one's that are only used as API middleware.

## App and Server Entry points
The client entry point is found in the src folder and is name "App.js", while the entrypoint Vue instance is called "Main.vue".

The server entry point is called "Server.js" and is found in the root folder of the server.

## Config Files
As a general rule all configuration files are found in the root folder of each project. The only exception to this is the "icon.config.js" client configuration file which is found in the src folder of the client.

On the client side the "App.config.js" file found in the root folder is simply a compilation of neccessary environmental variables and configurations that are specific to the Khateeb Remind client. The "globalConfig" object is globally imported across the entire web-app via Vue prototyping.

On the server side the "Server.config.js" file found in the root folder servers the same purpose as "App.config.js" on the client. For obvious reasons the environmental variables for the server side are not included in this public repository, but you can recreate the .env file for both production and development by finding all the "process.env" references in the "Server.config.js" file.


## Global Variables and Functions
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

## NPM scripts
The README files at the root of the client and server provide brief explantions of the npm scripts for each respective project.

> [Client NPM scripts](https://github.com/moomoolive/khateeb_remind/blob/master/code/client/README.md)

> [Server NPM scripts](https://github.com/moomoolive/khateeb_remind/blob/master/code/server/README.md)

# Environmental Variables

## Client
Both development and production:
* VUE_APP_API_SERVER_URL <String> - your API url
* VUE_APP_INITIATE_OFFLINE_MODE_FAIL_REQUEST_COUNT <Number> - the amount of failed requests (timed-out or no server response) before initiating offline mode
* VUE_APP_MAX_NOTIFICATION_LOOP_RUN_COUNT_FOR_WEEK <Number> - the maximum amount of times an administrator can run the [notification loop](#the-nefarious-notification-loop) in a week across all jummahs before disabling it
* VUE_APP_MAX_NOTIFICATION_LOOP_RUN_COUNT_INDIVIDAUL_JUMMAH <Number> - the maximum amount of times an administrator can run the [notification loop](#the-nefarious-notification-loop) for one particular jummah before disabling it
* VUE_APP_DEFAULT_IO_LOADING_TIME <Number> - the default time (in milliseconds) the loading overlay screen is visible when page requires AJAX call on creation
* VUE_APP_DEFAULT_AUTH_IO_LOADING_TIME <Number> - the default time (in milliseconds) the loading icon appears for when authorization key (json web token) change is requested
 
 For PWA testing only:
 * VUE_APP_PWA - a variable to test whether bundle is being built for pwa testing.

## Server
Both development and production:
* EMERGENCY_KEY - used for API emergencies
* JWT_SECRET - used to sign JWTs
* DATABASE - URI to a MongoDB
* DEFAULT_ROOT_PASS - the default password for the root user
* DEFAULT_TEST_USER_PASS - the default password for test users
* VAPID_PUBLIC_KEY - public key for vapid, used on client side to get PWA subscription; generated by web-push library (included with package)
* VAPID_PRIVATE_KEY - private key for vapid, used on server side to send PWA push notifications; generated by web-push library (included with package)
* VAPID_SUBJECT_FIELD - your contact information for push services, in case of emergencies (like your notifications not being pushed, compromised credentials, etc.)

If using default third party cloud storage and email service (Amazon Web Services), you'll also need:
* AWS_HOSTING_REGION - region of hosting
* AWS_S3_ACCESS_KEY - aws security key
* AWS_S3_ACCESS_ID - aws security identification
* AWS_SES_EMAIL - name email that sends email notifications
* AWS_S3_BUCKET_NAME - bucket name of cloud storage

# Authorization Across the App

The client and server use the same authorization system to give access to resources. User types are mapped to an authorization level (integer).

| User Type  | Authorization Level | User Description |
| ------------- | ------------- | ------------|
| User Not Logged In | 0 | This user can be someone who has just landed on the website for the first time or a user who hasn't logged in yet |
| \*\*User Logged In Without a Specialized Authoization Key  | 1 | User who has an account and is logged in but isn't currently carrying the authorization key for any particular institution or role |
| Khateeb | 2 | Someone who gives Friday Khutbahs (sermons) |
| Institution Administrator | 3 | Someone who helps schedule khateebs at an institution |
| Root Institution Administrator | 4 | The leader (aka user with highest authority) of an institution; has unrestricted permissions |
| \*System Administrator | 5 | Someone who helps adminster the entire Khateeb Remind System |
| \*Root System Administrator | 6 | The user with the highest authentication across the whole system; has unrestricted permissions |

\* Special user type - any user who holds this authorization can only hold this authorization and will NOT be allowed to hold any other authorization.

** A specialized authorization key is just a key that indicates whether the current user is logged in as special user or logged into an institution. Any user can hold multiple specialized authorization keys (unless they are a special user) and before they want enter into any institution they are considered a "generic" user who cannot view any information related to institutions.

## Authorization Method
Khateeb Remind uses JWTs (json web tokens) to verify user identity. JWTs can hold up to 6 properties in the payload (implying that every JWT payload is an object), with only two attributes being mandatory:

* \_id: the user's identification hast
* __t: the user's type
* institutionID (optional): which institution are they logged into
* authId (optional): if logged into institution, what is their authorization reference (read more about this in the [schemas section](#about-database-and-schemas))
* SpecialStatus (optional): is the user as special user type
* specialInstitution (optional): reserved for special user type

Authorization is required to be in the request header in order to access API resources. JWT Token from last login is automatically stored in local storage on the client-side.

## On Header Mutations
If you look into the source code, you'll find that once a user is authenticated and their token deemed acceptable, a middleware then mutates (by appending) the incoming request header to include information about the incoming user based on the above mentioned JWT attributes. If JWT's attribute isn't present the header is either not included or recorded as undefined. Information includes: 

* institutionid --> JWT.institutionID or undefined
* userid: usertype --> JWT.__t
* targetusermodel --> derived from JWT.__t
* specialStatus --> JWT.specialStatus or not included at all
* specialInstitution --> JWT.specialInstitution or "default"
* authLevel --> derived from JWT.__t

## Client-side Authorization
The client-side app doesn't do any REAL authentication but relies on the server to do so for it. This posses no obvious security threat (as far as I can see, but I might be wrong) because the user cannot access any information without first requesting from the server. If the server returns a 401 (unauthorized) or 403 (forbidden) status code, the app will then either direct the user back to a page they have authorization to see and alert them that they are unauthorized to view the page they are on.

It is important to note that if a user tries to access a view (webpage) that requires a higher authorization level than their JWT claims they have the web-app will take preventative measures and not allow the user to direct to that pages. Unfortunately becauase the client app always assumes that the JWT has not been forged, a user *could* theortically forge their own JWT and add a higher level of authorization to the payload - which would allow them to see views that require higher authorization. But again the server would ideally detect something like this and the view wouldn't recieve any information from the server. 

<br/><br/><br/><br/>
# Client
<br/><br/>

# Reasons for using Vue

To understand why the progressive-javascript framework Vuejs was used for the client, one must first understand what the initial criteria for the client app entailed. The inital criteria for the client-side about were:

* Works well on mobile
* To be available offline

## Native-Mobile Application or a Progressive Web Application

This lead to the formulation of two general approaches to the client, either the client was to be a mobile-application or a web-application. The most promising solution for either type of app were:

* A cross-platform mobile application, using something like React-Native or Apache Cordova
* Or a mobile-first web-application + service worker

Ultimately the latter approach was chosen for a variety of reasons. Some of the main reason include:

* A web-application requires only one code base. Peroid. Although creating a mobile application in any framework built on the React-Native Engine or Apache Cordova would have more or less lead to one codebase, mobile applications cannot be accessed on desktop and thus a less versatile medium for creating a client.
* Not only are mobile applications less versatile than web applications but web applications use the most-widely supported languages (if you can call them that) used to create graphical user interfaces, HTML, CSS, and Javascript.
* Khateeb Remind doesn't require any native mobile APIs like geofencing.
* A web-app with a service worker (service workers by the way [supported by all modern browsers](https://caniuse.com/serviceworkers)) can be used offline and are quite efficent compared to websites without one.
* Web-app performance bottlenecks such as inital render times would be be dramatically reduced after the first visit because of service worker's caching ability. Initial render times can be further cut down via lazy loading non-essential script files.
* Web-apps can be forced to update (which is what Khateeb Remind client does), so legacy client-side code doesn't have to be supported by the Khateeb Remind servers.
* Web-apps don't have to be on the app store thus saving potential distrubition problems.  

## Why Use a Javascript Framework At All?

Keeping in mind that the app originally was very close to being a mobile application, modern single-page-application (SPA) frameworks such as Reactjs, Angularjs, or Vuejs offer a similar experience to native mobile clients with features like page transitions. More importantly though, SPAs offer an easy way to create reactive and extremely interactive client applications relative to normal javascript.

Other benefits of SPA frameworks include taking client-side routing and rendering pressure off the server thus making it available for more traffic, in theory.

## Out of All SPA Frameworks, Why Vue?

No reason in particular, I believe that React or Angular would have done just as well in Vue's place - but I believe Vue is a slightly more intitutive and simple library relative to the alternatives.

# Web App Routing

All referenced modules can be found in the src/router/routes client folder.

* Auth - all routes related to signing in, signing up, and account recovery.
* User - all routes that are reserved for those holding [level 1 authorization](#Authorization-Across-the-App).
* Khateebs - all routes that are reserved for those holding [level 2 authorization](#Authorization-Across-the-App).
* InstitutionAdmin - all routes that are reserved for those holding [level 3-4 authorization](#Authorization-Across-the-App).
* SysAdmin - all routes that are reserved for those holding [level 5+ authorization](#Authorization-Across-the-App).


# Client Side Runtimes

Within the web application there are two "runtimes" built on top of the Vue runtime. I use runtime for a lack of a better term, but they could also be called "managers". These runtimes help execute and manage processes associated with Vuex (Vuex is the state management library used within Khateeb Remind) modules that bear the same name. All vuex modules can be found in the src/store/modules client folder.

To check out all the types of notifications that Khateeb Remind offers out of the box without configuration check the "client/src/libraries/notification" folder. These are all the pre-built notification interfaces and can be extended by creating new templates.

## The Notification Runtime --> Vuex.notifications

The notification runtime deals with managing various aspects of the vuex "notifications" module found in "client/src/store/modules/".
 
### Managing Notification Queue
The main role of the notification runtime is to manage the notification queue found in the previously-mention module. Khateeb Remind generally employs a queue for notifications so that the app can support notifying the user of multiple notifications at once. All notifications that are intended to be displayed on the screen are put on to the notification queue and have an "origin" key attached to them.
 
Khateeb Remind has multiple origins where a notification can come from, including:
* Server
* The web application itself
* Or from user interaction
 
Once a notification is requested to be executed it is put on the queue and then the notification runtime (found in the main Vue instance of the app) will decide when and if the notification is to be displayed.
 
### Displaying Notifications on Screen
Once a notification is put on the queue the runtime analyzes the stated origin of the notification and decides how to execute the notification:

* Notifications coming from the web-app or server are put onto the "fromServer" queue. Once put on the queue, the notifications will be displayed on the screen one after another and taking precedent over user initiated notifications.
* Notifications created by user interactions or that state no origin at all are put on the "userPrompted" queue, only if the queue is empty. Therefore, a user cannot request another notificaton be displayed on the screen until the current one they prompted is no longer displayed. This measure we taken in order to prevent a circumstance where a user will click a button or any other element that prompts a notification, multiple times and then find a stack of notifications being displayed for that same element.

## The Request Runtime --> Vuex.requests

The main role of the request runtime is to manage delayed request and offline mode.
 
### Managing Delayed Requests
There are certain circumstances where it's desirable for a request to be delayed, such as updating the "name" field of an institution's location via text input. It may be desirable here because sending a request everytime the user types a letter would be awfully ineffiecent, and frankly may result in tens if not hundreds of requests while simply entering a location name.
 
Khateeb Remind's request runtime provides a solution to this in delayed requests.
 
A delayed request is essentially a request that is scheduled to run after X amount of seconds (defaults to 5 seconds) and if requested again before the specified delay, the request will be reset with the new request parameters. This cycle continues until the request is executed, thereby eliminating the need for tens if not hundreds of requests for a given user.
 
It should be noted that you can recieve a response for these requests like any normal request. The implementation of this feature is quite long and boring, but the short and sweet version of it is that everytime a request is re-requested, then previous request's promise is overwritten by the new promise. If you're interested in the details of implementation details check out the "client/src/components/misc/requestManager.vue" file.  
 
### Initiating Offline Mode and Offline Polling
If a request has timed out, due to the lack of a TCP connection with the server or a bug in server code, Khateeb Remind logs this in the "noResFromXHRinLast30Seconds" key of the requests Vuex module. The request runtime then keeps a track of how many requests have timed out in the following 30 seconds after the first timed out request. If the count passes the threshold of failed requests determined by the [VUE_APP_INITIATE_OFFLINE_MODE_FAIL_REQUEST_COUNT environmental variable](#environmental-variables) in those thirty seconds [offline mode](#offline-mode) is initated, otherwise the failed request count is reset.
 
If the failed requests threshold is passed, the notification runtime blocks all outbound requests by the app and starts to continously send requests to the "misc/health-endpoint" url of the Khateeb Remind server every 10 seconds (polling) until it responds with a 200 code. Only when the "health-endpoint" responds correctly does the app return to it's normal state.

# Progressive Web App Testing

Unfortunately there is no default way to test Vue PWA apps, as Vue CLI doesn't support it. Khateeb Remind provides a custom script that allows you to do so easily, just go to the root client folder and enter "npm run pwa". It's important to note that the "npm run pwa" command actually builds a distribution bundle (with source maps and comments intact) and then deploys it via a server package called "lite-server".

During the PWA build process you have access to the [VUE_APP_PWA environmental variable](#environmental-variables).

The developement server can be further configured by editing the "lite-server.config.js" file found in the client folder. Please consult the package for further [configurations](https://www.npmjs.com/package/lite-server).
* Note: lite-server provides API fallback


# Offline Mode

Offline mode is initiated in the app after an X (determined by the [VUE_APP_INITIATE_OFFLINE_MODE_FAIL_REQUEST_COUNT environmental variable](#environmental-variables)) number of requests don't respond or timeout within a 30 second interval.

This seemed a much better approach than using "window.navigator.onLine" to determine if app is offline in real-time, as the previous approach needs to be constantly checked in order to determine if the app is offline.

Once app is offline, all outbound requests are blocked. The app then starts to poll the API health endpoint (aka "/misc/health-endpoint") every 10 seconds, if the endpoint responds with a 200 status code, offline mode is turned off and all requests are unblocked, otherwise the app will continue to poll. All polling and request blocking is managed by the [requests runtime](#client-side-runtimes).


# Client Side Configurations

All these configurations are found in the *"App.config.js"* file found in the root folder of the client. All configurations are immutable and can only be changed by directly editing the file.

## Network - Everything related to Ajax calls and IO
* serverURL: an alias for [VUE_APP_API_SERVER_URL environmental variable](#environmental-variables)
* offlineModeRequestCountThreshold: a casted-to-number version of [VUE_APP_INITIATE_OFFLINE_MODE_FAIL_REQUEST_COUNT environmental variable](#environmental-variables)
* pwaTestingServerURL: a url to the server endpoint to be used during PWA testing
* defaultIOLoadingTime: a casted-to-number version of [VUE_APP_DEFAULT_IO_LOADING_TIME environmental variable](#environmental-variables)
* defaultAuthIOLoadingTime: a casted-to-number version of [VUE_APP_DEFAULT_AUTH_IO_LOADING_TIME environmental variable](#environmental-variables)

## Security - All matters related to client side security
* vapidPublicKey - a copy of the public vapid key produced by the server, same value as [VAPID_PUBLIC_KEY environmental variable](#environmental-variables). This is not an alias for that value though, as this must be inputted manually at the present time.

## Third Party Services
* feedbackFormURL - a url to external feedback form for Khateeb Remind

## User Restrictions - any client side restrictions the web-app artifically puts on users
* notificationLoopMaxRunCountPerWeek: an alias for [VUE_APP_MAX_NOTIFICATION_LOOP_RUN_COUNT_FOR_WEEK environmental variable](#environmental-variables)
* notificationLoopMaxRunCountPerJummah: an alias for [VUE_APP_MAX_NOTIFICATION_LOOP_RUN_COUNT_INDIVIDAUL_JUMMAH environmental variable](#environmental-variables)

## Global - configurations that are imported into every Vue instance
* nullId - the canonical value for a null id, usually when used when foreign key reference is empty

## Router - all settings related to the Vue-router
* animationName - the page transition animation choosen for the web app. For all other options check out the [vue-page-transition package](https://www.npmjs.com/package/vue-page-transition)

## PWA - configurations related to the progressive web functionality
* reloadDelayAfterNewServiceWorkerDetected - delay in seconds before reload is initated when new service worker is detected. Essentially the reload allows for the new service worker to take control of the webpage and thereby add any new content to the website code.

 
# On Client Side Performance
 
As stated before Khateeb Remind was close to being a mobile application, so in order to gap the bridge between native performance and web application performance, Khateeb Remind employs a few methods to make it a very performant client on both desktop and mobile:
* There are virtually no pictures in the application and 90% of visuals are icons in the form of SVGs, most taken from the generous folks at [font-awesome](https://fontawesome.com/).
* Client distribution servers heavily compress all files before serving.
* \> 90% of all views (pages) of Khateeb Remind are lazy-loaded.
* No CSS framework was used and all styling was done in-house.
* Imported fonts (from Google Fonts) are inlined and lazy-loaded.
* Source maps are not included in the distribution build.
* All JavaScript, CSS, and HTML files are cleaned of comments and minimized.
* Service worker caches > 95% of assets associated with the app and therefore repeat visits are even faster than initial. 
* Large JavaScript utility libraries were avoided (such as Moment and LoDash) in favor of smaller, more specific in-house libraries.

<br/><br/><br/><br/>
# Server
<br/><br/>

# Reasons for Using Node

The reason for using Node as a server runtime really came down to a few reasons: 

* Development speed with Node and JavaScript is fast, as compared to lower-level languages like Go and Rust.
* Node is offers great server performance (for a scripting language) straight out of the box and generally doesn't need any special configurations like putting another server infront of Node (eg. NGINX) to handle web traffic - like many other scripting languages.
* Node has a massive ecosystem of open-source libraries, so it was easy to find libraries for almost everything, most notably cryptography. 

# Server Side Controllers

* Announcements - CRUD Operations for announcements.
* Auth - anything related to signing into the application, account recovery, and signing up to Khateeb Remind.
* InstitutionAdmin - CRUD Operations for institution administrators.
* Institution - CRUD Operations for institutions and institution settings.
* Logos - CRUD Operations for logos.
* SysAdmin - all routes related to system administration, setting system settings, confirming institutions, etc.
* Timings - CRUD Operations for timings.
* User - all things related to individual users, setting modification, signing into institutions, requesting authorization for institution, etc.
* Locations - CRUD Operations for locations.
* Jummahs - CRUD Operations for jummah preferences and jummah related notifications.
* Misc - any route that didn't fit in any of the above categories.
* Khateebs - CRUD Operations related to institution khateebs. 

# About Database and Schemas

All database related information and schemas are found in the "server/database" folder.

## Locations
Stores information about the seperate locations that an institution has. Any given institution can have multiple locations associated with it.
 
## Timings
Stores information about Jummah prayer timings at each location. Any given location can have multiple timings associated with it.
 
This schema includes:
* Default khateebs
 
## Institution
An entity that organizes jummah prayers.
 
A note that there is a special institution status reserved for the test institution created at [server initialization](#server-initialization). The test institution cannot be permenantly deleted via the web-application interface as everytime it deletes itself it's reinitialized again right away. 
 
This schema includes:
* Institution settings
 
## User
An entity that can give khutabhs, adminster khutabh giving or run the Khateb Remind System. Check out [user types](#authorization-across-the-app) for more information.
 
A note that the root user cannot be permenantly deleted via the web-application interface as everytime the root user deletes their account it is reinitialized again right away. 
 
This schema includes:
* A list of user's authorization keys
* User settings
* Any statuses on user
 
## Announcement
A notification that is sent out to every user in an institution.
 
## Notification
A message that is sent out to a particular user.
 
This schema includes:
* Notification meta data, including if PWA or email notification was sent associated with it along with other information useful for debugging purposes.
 
## Verification Codes
A code sent to users via email in case of account recovery. Expires in 15 minutes.
 
## Jummah Preference
Store information about scheduled jummah prayers date, khateeb, location and timing.
 
## PWA subscription
The security details to send users web push notifications. Users can have multiple subscriptions.
 
## Authorization
Authorization keys to priviledges within an institution. Each institution has authorization unique authorization keys for khateebs, institution adminstrator, and the root institution administrator. 
 
Users can have multiple authorization keys and are not bound to particular institution or role, with the expection of [special user types](#authorization-across-the-app).

Note that only one user can ever hold the root institution adminstrator key for a given institution at once. The root institution adminstrator can delegate his authorization to any confirmed user within the institution, thereby revoking their right to login to the institution as the root administrator.
 
## User Schedule Restrictions
Any user that is registered as a khateeb at any given institution will have data associated with their availability to give khutbahs at that particular institution. Khateebs can restrict particular dates or jummah slots at any given institution.
 
It's important to note that a new copy is made for the user for each institution they are a khateeb at and schedule restictions are not shared across institutions.


# The Nefarious Notification Loop

The notification loop is a core part of the Khateeb Remind ecosystem. The notification loop is essentially a loop that sends of PWA notifications and emails to khateebs to remind them of jummah khutbahs they are supposed to be giving. The loop can be run manually or programmatically through a chron job.

Generally speaking the loop will NOT run in a couple of situtions:
* The particular jummah which the loop is being run for has already sent out it's notifications
* The notification loop max run count has been exceeded
* The khateeb has either email or push notifications turned off
* The adminstrator has turned off all notifications for institution
 
## Manual Execution
 
Khateeb Remind gives administrators a default way to override the notification chron job, as there are cases where this may be neccessary. In order to run the notification loop administrators just need to navigate to the adminstration schedule page, then click the settings button, then click the notify button. There are artificial limits set on how many times an administrator can manually run the loop, so that the Khateeb Remind servers don't get labeled as servers where span originates thereby limiting the reachability of all notifications for all institutions.
 
The artificially set limits are determined by [VUE_APP_MAX_NOTIFICATION_LOOP_RUN_COUNT_INDIVIDAUL_JUMMAH environmental variable](#environmental-variables) and [VUE_APP_MAX_NOTIFICATION_LOOP_RUN_COUNT_FOR_WEEK environmental variable](#environmental-variables).
 
## Cron Execution

Every Sunday at 6AM Mountain Standard Time (UTC - 7) a cron job is run which sets the timing for when and who notifications will be sent out to for the following week. This implicates that if notification timing changes for a particular institution after Sunday, they can expect the change to take effect ONLY for the following week and beyond, and NOT the current week.

The standard timezone the cron job is aligned with is Mountain Standard Time, but this can be configured by editing the [cron.timezone server configuration](#server-side-configurations).


# About Notifications and Third Party Services

## Email
Due to the fact that the [web-push API has not yet stabilized across all browsers](https://caniuse.com/push-api) Khateeb Remind relies on email notifications as it's primary method of notifying users. Currently the default implementation for email notifications uses AWS's Simple Email Service.
 
Users are free to opt out of these reminders via user settings. 

If you want to replace email with another method of notifying such as text, all you need to do is change the implementation of the interfaces provided by the "externalNotifications" library, in "server/libararies". Also, you'll need to modify the user database schema to accomodate any information needed to fulfill the replacement notification's requirements, such as logging phone number.
 
Related Environmental Variables: [AWS_SES_EMAIL environmental variable](#environmental-variables), [AWS_S3_ACCESS_ID environmental variable](#environmental-variables), [AWS_S3_ACCESS_KEY environmental variable](#environmental-variables), [AWS_HOSTING_REGION environmental variable](#environmental-variables)
 
## Web Push Notifications
Web push notifications are implemented in Khateeb Remind, check out the "server/libraries/pwaNotifications" for implementation details.
 
Related Environmental Variables: [VAPID_PUBLIC_KEY environmental variable](#environmental-variables), [VAPID_PRIVATE_KEY environmental variable](#environmental-variables), [VAPID_SUBJECT_FIELD environmental variable](#environmental-variables)
 
## Cloud Storage
Khateeb Remind currently uses an external cloud storage in order to store files related to the app. The default implemenation uses AWS's Simple-Storage (S3).
 
All files are stored as raw binary in the cloud and are differianted only by the folder they are placed in. File extensions are not supported because S3 doesn't support requesting files with multiple extensions in one request. Keeping file extensions would mean at least making a couple of requests for every file, in case they have a different extension - which is an inefficency that isn't work the price or the effort to optimize. 

All cloud storage interfaces are found in the "server/libraries/cloudStorage" folder.
 
Related Environmental Variables: [AWS_S3_BUCKET_NAME environmental variable](#environmental-variables), [AWS_S3_ACCESS_ID environmental variable](#environmental-variables), [AWS_S3_ACCESS_KEY environmental variable](#environmental-variables), [AWS_HOSTING_REGION environmental variable](#environmental-variables)
 

# Server Side Configurations

All these configurations are found in the *"Server.config.js"* file found in the root folder of the client. All configurations are immutable and can only be changed by directly editing the file.

## Global - configurations accessible from all files
* rootInstitution - this is a sort of fake institution reserved for the [special user types](#authorization-across-the-app) so that the web-application can treat them exactly like normal users.
* cron.timezone - the timezone all cron jobs are referenced against if the timezone options is set to true.
* consts.* - these are variables that used across the server for consistency
* customHeaders.* - headers that are not part of the HTTP request spec and are specific to Khateeb Remind.
* notifications.automatedNotificationSignature - signature of any message that is sent by Khateeb Remind.

## Database
* mongoose.* - options for the MongoDB ODM mongoose - khateeb remind's chosen MongoDB middleware
* URI - the URI to database, where it's hosted locally or on another machine

## Initialization
All explanation is provided in the [section below](#server-initialization)

## Security - all configurations related to Khateeb Remind Security
* jwtSecret - an alias for [JWT_SECRET environmental variable](#environmental-variables)
* thirdPartyServices.AWSAuthCredentials.region - an alias for [AWS_HOSTING_REGION environmental variable](#environmental-variables)
* thirdPartyServices.AWSAuthCredentials.credentials.secretAccessKey - an alias for [AWS_S3_ACCESS_KEY environmental variable](#environmental-variables)
* thirdPartyServices.AWSAuthCredentials.credentials.accessKeyId - an alias for [accessKeyId environmental variable](#environmental-variables)
* vapid.subject - an alias for [VAPID_SUBJECT_FIELD environmental variable](#environmental-variables)
* vapid.publicKey - an alias for [VAPID_PUBLIC_KEY environmental variable](#environmental-variables)
* vapid.privateKey - an alias for [VAPID_PRIVATE_KEY environmental variable](#environmental-variables)

## Third Party Services
* AWS.email - an alias for [AWS_SES_EMAIL environmental variable](#environmental-variables)
* AWS.cloudStorageBucketName - an alias for [AWS_S3_BUCKET_NAME environmental variable](#environmental-variables)
* AWS.cloudSubDirectories.* - where all cloud storage folders are specified

## Network - All configurations related to incoming requests from client
* port - which TCP port is the server listening on
* maxJSONSize - maximum size a request can be (default metric is in megabytes)


# Server Initialization

Every time the server is initalized (whether it's the first time running it or after a restart) the Khateeb Remind server schedules all cron jobs (check "server/cron/") and runs a couple of initiation scripts.

## Root User Creation

The first initiation script checks if the root user (or root system administrator) account exists and then creates it if it doesn't exist. The root user account cannot be created any other way. The root user account password is initially set by the [DEFAULT_ROOT_PASS environmental variable](#environmental-variables). 

All other related to the root user defaults can be changed by editing the initializationConfig.rootUser object found in "Server.config.js".

## Test Institution Creation

Another script that runs on server initialization creates a "test institution", whose purpose is to make development easier by having default accounts that will be created even if database is wiped and to simulated real bugs in production. 

This script first creates:

* An institution
* A related root institution administrator. Root institution administrator account details can be edited by modifying the initializationConfig.testInstitution.rootAdmin object found in "Server.config.js"
* One related institution administrator
* An variable number of locations which are determined by initializationConfig.testInstitution.locationCount key found in "Server.config.js"
* A variable number of timings related to each location which are determined by initializationConfig.testInstitution.timingsPerLocation key found in "Server.config.js"
* A variable number of related khateebs which are determined by initializationConfig.testInstitution.khateebCount key found in "Server.config.js". Khateeb account details can be edited by modifying the initializationConfig.testInstitution.khateebs object found in the same file.

All user account passwords created by the script are determined by the [DEFAULT_TEST_USER_PASS environmental variable](#environmental-variables).

<br/><br/><br/><br/>
# Extra Information
<br/><br/>

# Dev Ops Suggestions

![khateeb remind frontend archiecture](khateebRemindFrontend.png)

Because the Khateeb Remind Client App is a PWA it is required to served over a secure protocol (https) in order to function properly. It's also important to note that the server that is meant to serve the client app to requesting browsers must be configured to fallback to the file "index.html". This because the Vue-router is meant to handle routing but cannot do so unless all requests for static files are ultimately directed to the the Vue-app entry point.

![khateeb remind backend archiecture](khateebRemindBackend.png)

Since the docker image is already ready to go, it's recommended that you just use the docker file at the root of the server to build an image. Then host the image on a virtual machine and put infront of it a reverse-proxy of some kind - which serves traffic over https. It is highly-recommended for the server to be served over secure traffic because the client needs to be served over secure traffic - to function properly (due to service worker). If you intend to use insecure protocols (such as http) to fulfill server requests be aware that the client must also use an insecure protocol or all ajaz calls will be blocked by most browsers.

# Closing Notes

* Using some kind of statically-typed language on the server-side would have been very useful. Although this would have slowed down development speed slightly, it would have lead to better documentation and type saftey at runtime. Typescript or another language entirely, such as Rust, Go, C## etc would have been viable options.
* Using both ES6 Classes and Factory functions to initalize JavaScript objects, made the code a little confusing to follow and could have been avoided by choosing one method and sticking with it.
* Using an SQL or graph database would have probably been a better fit for Khateeb Remind instead of mongoDB. As the whole project started to grow in size the data only became more relation-oriented, which definintely in NOT the strength of Mongo in terms of performance or database interaction. Although MongoDB has an interface equivalent to SQL's "JOIN" (not exactly but close enough), it is neither as performant, intutive, or as well-documented as the SQL alternative.
* The authentication system should be more loosely coupled than it is right now. Instead of having hard-coded roles, it would have been better for the authorization to be based on read, write, modify, and delete permission for specific resources (eg. announcements). This would have lead to a more flexible, and powerful authorization system. 

