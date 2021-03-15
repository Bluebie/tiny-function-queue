// object has json stringified paths as keys, and arrays of blocks as values
const queues = {}

async function runQueue (key) {
  while (queues[key].length > 0) {
    await queues[key].shift()()
  }
  delete queues[key]
}

/**
 * locks a specified path, runs a block function, then unlocks the path and returns the result
 * @param {*} path - path, anything json stringifyable
 * @param {Function|async function} block - callback function, lockWhile will wait until it can get a lock, then it will run the block
 * @async
 * @returns {*} - whatever your block returns
 */
exports.lockWhile = async function (path, block) {
  return new Promise((resolve, reject) => {
    const key = JSON.stringify(path)
    const job = () => { block().then(out => resolve(out)).catch(err => reject(err)) }
    if (!Array.isArray(queues[key])) {
      queues[key] = [job]
      runQueue(key)
    } else {
      queues[key].push(job)
    }
  })
}
