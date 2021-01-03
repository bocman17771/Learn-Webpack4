async function start() {
  return await Promise.resolve('async is working')
}

const unused = 42
start().then(console.log)

// динамический импорт (пример)
import('lodash').then(_ => {
  console.log('lodash', _.random(0, 42, true))
})