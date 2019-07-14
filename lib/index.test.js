'use strict'
/* global describe, test, expect, jest */

jest.mock('fs')
const fs = require('fs')
const Keyfob = require('../lib')

describe('Keyfob.load()', () => {
  test('returns a nested object with file contents', () => {
    const results = Keyfob.load({ root: '/text' })
    expect(results).toEqual({
      one: 'file one',
      'bad.txt': 'backup file',
      nested: {
        two: 'file two',
        deeply: {
          three: 'file three'
        }
      },
      neighbor: {
        four: 'file four'
      }
    })
  })

  test('returns a flat object with file contents', () => {
    const results = Keyfob.load({ root: '/text', flat: true })
    expect(results).toEqual({
      one: 'file one',
      'bad.txt': 'backup file',
      'nested/two': 'file two',
      'nested/deeply/three': 'file three',
      'neighbor/four': 'file four'
    })
  })

  test('respects excluded blobs', () => {
    const results = Keyfob.load({ root: '/text', patterns: ['*', '!*.bak'] })
    expect(results).toEqual({
      one: 'file one',
      nested: {
        two: 'file two',
        deeply: {
          three: 'file three'
        }
      },
      neighbor: {
        four: 'file four'
      }
    })
  })

  test('respects included blobs', () => {
    const results = Keyfob.load({ root: '/text', patterns: ['*.txt'] })
    expect(results).toEqual({
      one: 'file one',
      nested: {
        two: 'file two',
        deeply: {
          three: 'file three'
        }
      },
      neighbor: {
        four: 'file four'
      }
    })
  })

  test('runs a custom function', () => {
    const fn = function (path) {
      return JSON.parse(fs.readFileSync(path, 'utf8'))
    }

    const results = Keyfob.load({ root: '/json', fn })
    expect(results).toEqual({
      one: { name: 'one' },
      nested: {
        two: { name: 'two' }
      }
    })
  })
})
