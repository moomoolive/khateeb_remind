// a function that makes the execution thread
// in a particular function sleep and does not stop
// the main thread
// a note that this makes no guarantee that it will return
// exactly after input milliseconds, but guarantees that it will
// return after X milliseconds or greater
function nonBlockingSleep(milliseconds=2_000) {
    return new Promise(resolve => {
        window.setTimeout(() => resolve(true), milliseconds)
    })
}


export default {
    nonBlockingSleep
}