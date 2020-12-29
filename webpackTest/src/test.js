import { delay } from 'lodash'

const add = async function (a, b) {
  delay(10)
  return a + b
}

const result = await add(-2, 3)
