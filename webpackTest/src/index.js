import './index.less'
// import dialog from 'dialog_alias'
import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import Vue from 'vue'
import { add, minus } from './math'
add(2, 3)

console.log('Vue', Vue)
let vm = new Vue({
  template: '<div>{{ hi }}</div>'
})

console.log('vm', vm)

if (module && module.hot) {
  module.hot.accept()
}

// const Square = ReactDOM.render(
//   <div>
//     <span>123123123</span>
//   </div>,
//   document.getElementById('root')
// )
console.log('React', React)
console.log('ReactDOM', ReactDOM)
// console.log('Square', Square)
console.log('_', _)
_.chunk(['a', 'b', 'c', 'd'], 2)

document.getElementById('btn').onclick = function () {
  console.log('被点击了')
  import(/* webpackChunkName: "js/test" */ './test.js').then(fn => fn.default())
}
// fetch('/user')
//   .then(response => response.json())
//   .then(data => console.log('/api/user', data))
//   .catch(err => console.log(err))

// fetch('/login/account', {
//   method: 'POST',
//   headers: {
//     Accept: 'application/json',
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//     username: 'admin',
//     password: '888888'
//   })
// })
//   .then(response => response.json())
//   .then(data => console.log('/login/account', data))
//   .catch(err => console.log(err))
