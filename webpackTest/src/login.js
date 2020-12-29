import testFn from './test.js'
import React from 'react'
import _ from 'lodash'
import Vue from 'vue'

let vm = new Vue({
  template: '<div>{{ hi }}</div>'
})

console.log('vm', vm)

class Square1 extends React.Component {
  render () {
    return null
    // return <button className='square'>{this.props.value}</button>
  }
}
testFn()
console.log('Square', Square1)
_.chunk(['a', 'b', 'c', 'd'], 2)
