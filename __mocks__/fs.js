'use strict'
/* global jest */

const fs = jest.genMockFromModule('fs')

const dirResponses = {
  '/text': ['one.txt', 'bad.txt.bak', 'nested', 'neighbor'],
  '/text/nested': ['two.txt', 'deeply'],
  '/text/nested/deeply': ['three.txt'],
  '/text/neighbor': ['four.txt'],
  '/json': ['one.json', 'nested'],
  '/json/nested': ['two.json']
}

const fileResponses = {
  '/text/one.txt': 'file one',
  '/text/bad.txt.bak': 'backup file',
  '/text/nested/two.txt': 'file two',
  '/text/nested/deeply/three.txt': 'file three',
  '/text/neighbor/four.txt': 'file four',
  '/json/one.json': JSON.stringify({ name: 'one' }),
  '/json/nested/two.json': JSON.stringify({ name: 'two' })
}

const isFile = {
  isFile: () => true,
  isDirectory: () => false
}

const isDirectory = {
  isFile: () => false,
  isDirectory: () => true
}

const statResponses = {
  '/text/one.txt': isFile,
  '/text/bad.txt.bak': isFile,
  '/text/nested': isDirectory,
  '/text/nested/two.txt': isFile,
  '/text/nested/deeply': isDirectory,
  '/text/nested/deeply/three.txt': isFile,
  '/text/neighbor': isDirectory,
  '/text/neighbor/four.txt': isFile,
  '/json/one.json': isFile,
  '/json/nested': isDirectory,
  '/json/nested/two.json': isFile
}

fs.readdirSync = function readdirSync (path) {
  return dirResponses[path]
}

fs.readFileSync = function readFileSync (path) {
  return fileResponses[path]
}

fs.statSync = function statSync (path) {
  return statResponses[path]
}

module.exports = fs
