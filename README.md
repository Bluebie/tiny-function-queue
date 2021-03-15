# tiny-function-queue
 Very simple queue thing for async functions, for when you need something a bit like a file lock, for a single threaded app, to stop different async functions from clobbering each other's work.

You can use any JSON stringifyable object as taskID, could be a string file path, could be an array or an object.

Queues are ephemeral, so they cease to exist (and occupy memory) when there's nothing in that labeled queue, making it well suited to resource constrained environments, where you just want some basic serialisation of certain tasks like reading a file, updating something, and writing it back.

## Usage

```js
const tq = require('tiny-function-queue')

const returnValue = await tq.lockWhile('task name', async () => {
  // do some async work
  return 5
})
```

Intended use is for simple in memory single threaded file locking. Queues are created and destroyed as needed, so you can use a file path as the task name and not worry about ending up with a zillion queues in memory keeping track of a whole lot of nothing.

## Docs

Literally just that one function, `lockWhile(taskName, blockCallback)`:

### exports.lockWhile(taskName, block)

Returns a promise immediately, adds your block to a queue, resolves promise with any return value or errors your block created, when its turn comes to run. Queue is destroyed when there's no blocks left with this task name.

taskName can be any value that JSON stringifies well, so you could use a filesystem `"path string"`, or an `['array', 'path', 'representation']` or `{ even: 'an object' }`. Fun fact, despite what we've all been told, JS Objects are specced to maintain insertion order normally, so you don't need to worry about keys shuffling around in the real world.

That's it, that's the whole thing. Probably not worth an NPM package, but I just wanted a nice little contained tested doodad so I could stop going crazy. I'm sure this thing exists elsewhere, I just couldn't find one that had the memory characteristics I wanted.

---<3
  Bluebie