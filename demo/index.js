import debug from 'debug'
import map from './../src'

function delay(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve.bind(undefined, timeout), timeout)
    })
}

function queue(length, max) {
    return [...new Array(length)].map(() => Math.round(Math.random() * max))
}

const log = debug('tamesy')

const syncQueue = queue(10, 50)
const asyncQueue = syncQueue.map(ms => () => delay(ms))

console.huraaay = (msg, props) => console.info(`🎉 ${msg} 🍻`, props)

console.info('🏁 Starting the race 1...')
map(asyncQueue, 2, false, null, log).then(props => console.huraaay('All work WITHOUT iterator done! ', props))

console.info('🏁 Starting the race 2...')
map(syncQueue, 2, delay, null, log).then(props => console.huraaay('All work WITH iterator done! ', props))
