/**
 * Given an interable, an optional concurrency limit and an iterator resolves Promises from
 * the factory (interable) obeying the concurrency limit. The iterator should be used
 * to either return Promises as it's invoked with each item or can be left blank
 * if the passed each iterm itself is a Promise returning factory function.
 *
 * @method map
 * @param  {[any]} iterable                [of either Promise returning functions or an list of any]
 * @param  {Number} [concurrency=Infinity] [maximum limit of concurrently running Promises]
 * @param  {Function} iterator             [if passed a function invoked with each item which should return a Promise]
 * @param  {Function} log                  [if passed a function to be used for debugging]
 * @param  {Function} getPromise           [if passed a function providing a Promise (to overwrite native Promises)]
 * @return {[any]}                         [list of any in order of resolved items]
 */
// eslint-disable-next-line max-params
function map(iterable, concurrency = Infinity, iterator, getPromise, log = () => {}) {
    const extract = (item, iterator) => (typeof item === 'function') ? item() : iterator(item)
    const chain = fn => (typeof getPromise === 'function') ? getPromise(fn) : new Promise(fn)

    log(`map() Starting with iterable of ${iterable.length} in concurrency of ${concurrency}.`)

    return chain((resolve, reject) => {
        let running = 0
        let aborted = false
        let resolutions = []

        /**
         * step steps, maintains running Promises and loops again
         */
        function step() {
            log('step() Iterator completed with success - continuing queue.')

            running--
            loop()
        }

        /**
         * Aborts, marks the whole chain as aborted and rejects the Promise
         */
        function abort(err) {
            log('abort() iterator had error - rejecting queue.', err)

            aborted = true
            reject(err)
        }

        /**
         * Immedidiately invoked function returning an iterator (next, done)
         * to manage to iterable as a queue.
         */
        const queue = (function () {
            // To maintain correct indexes on resolved Promises
            let idx = -1

            return {
                // Each returning an object on next() with value || done
                next() {
                    if (idx < iterable.length - 1) {
                        return {value: iterable[++idx], idx}
                    }

                    return {done: true}
                }
            }
        })()

        /**
         * The loop. Maintaining a the running Promises vs. concurrency limits
         * while walking the queue.
         */
        function loop() {
            if (aborted) {
                return
            }

            while (running < concurrency) {
                const next = queue.next()

                if (next.done) {
                    log('loop() Concurrent slice of queue done.')

                    if (running === 0) {
                        log('loop() Complete queue is done.')

                        resolve(resolutions)

                        return
                    }
                    break
                }

                running++

                log('loop() Extracting onto iterator with value.')

                // Unboxes another value from the queue with either the iterator
                // or directly
                extract(next.value, iterator).then(resolvation => {
                    // Store resolved value and step
                    resolutions[next.idx] = resolvation
                    step()
                }, abort)
            }
        }

        // Initial kicker against the loop
        loop()
    })
}

export default map
