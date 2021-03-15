const assert = require('assert')
const delay = require('delay')
const taq = require('../index')

describe('lockWhile calls run in serial call order', () => {
  it('builds string in order with external awaits', async () => {
    const goal = 'ab:cd'
    let str = ''
    await taq.lockWhile('string', async () => {
      str += 'a'
      await delay(50)
      str += 'b'
    })
    str += ':'
    await taq.lockWhile('string', () => {
      str += 'c'
    })
    await taq.lockWhile('string', async () => {
      await delay(10)
      str += 'd'
    })
    assert.strictEqual(str, goal)
  })

  it('builds string in order with Promise.all()', async () => {
    const goal = 'abcd'
    let str = ''
    let prom = Promise.all([
      taq.lockWhile('string2', async () => {
        str += 'a'
        await delay(50)
        str += 'b'
      }),
      taq.lockWhile('string2', () => {
        str += 'c'
      }),
      taq.lockWhile('string2', async () => {
        await delay(10)
        str += 'd'
      })
    ])
    assert.strictEqual(str, 'a')
    await prom
    assert.strictEqual(str, goal)
  })

  it('arrays as queue names', async () => {
    const goal = 'abcd'
    let str = ''
    let prom = Promise.all([
      taq.lockWhile(['neat', 'task'], async () => {
        str += 'a'
        await delay(50)
        str += 'b'
      }),
      taq.lockWhile(['neat', 'task'], () => {
        str += 'c'
      }),
      taq.lockWhile(['neat', 'task'], async () => {
        await delay(10)
        str += 'd'
      })
    ])
    assert.strictEqual(str, 'a')
    await prom
    assert.strictEqual(str, goal)
  })
})
