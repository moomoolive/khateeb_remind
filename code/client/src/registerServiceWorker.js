/* eslint-disable no-console */

import { register } from 'register-service-worker'
import footerPopups from './libraries/footerPopup/main.js'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    async registered() {
      console.log('New service worker has been registered.')
    },
    cached() {
      console.log('Content has been cached for offline use.')
    },
    updatefound() {
      console.log('New content is downloading.')
    },
    updated(registration) {
      footerPopups.appWillUpdateMessage()
      const threeSecondsInMilliseconds = 3_000
      window.setTimeout(() => registration.waiting.postMessage({ action: 'skipWaiting' }) , threeSecondsInMilliseconds)
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.')
      footerPopups.youAreOffline()
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    }
  })

  let refreshing = false
  navigator.serviceWorker.addEventListener("controllerchange", function() {
    if (refreshing)
      return
    refreshing = true
    window.location.reload()
  })
}