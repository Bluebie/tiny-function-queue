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
 * @param {*} queueName - anything json stringifyable, to unquely identify which ephemeral queue to use
 * @param {Function|async function} block - callback function, lockWhile will wait until it can get a lock, then it will run the block
 * @returns {*} - whatever your block returns
 * @async
 */
exports.lockWhile = async function (queueName, block) {
  return new Promise((resolve, reject) => {
    const key = typeof queueName === 'string' ? queueName : JSON.stringify(queueName)
    const job = async () => {
      try {
        resolve(await block())
      } catch (err) {
        reject(err)
      }
    }

    if (!Array.isArray(queues[key])) {
      queues[key] = [job]
      runQueue(key)
    } else {
      queues[key].push(job)
    }
  })
}
