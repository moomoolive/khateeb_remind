const streamToArrayBuffer = (ReadableNodeStream) => {
    return new Promise((resolve, reject) => {
        const chunks = []
        ReadableNodeStream.on("data", chunk => chunks.push(chunk))
        ReadableNodeStream.on("error", reject)
        ReadableNodeStream.on("end", () => resolve(Buffer.concat(chunks)))
    })
}

module.exports = {
    streamToArrayBuffer
}