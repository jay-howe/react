require('./babel.register')

const { task, series, parallel } = require('gulp')
const path = require('path')
const tsPaths = require('tsconfig-paths')

const { compilerOptions } = require('./build/tsconfig.docs.json')
const config = require('./config').default
const sh = require('./build/gulp/sh').default

// add node_modules/.bin to the path so we can invoke .bin CLIs in tasks
process.env.PATH =
  process.env.PATH + path.delimiter + path.resolve(__dirname, 'node_modules', '.bin')

tsPaths.register({
  baseUrl: config.path_base,
  paths: compilerOptions.paths,
})

task('bundle:all-packages', () => sh('lerna run build'))

// load tasks in order of dependency usage
require('./build/gulp/tasks/dll')
require('./build/gulp/tasks/docs')
require('./build/gulp/tasks/screener')
require('./build/gulp/tasks/stats')
require('./build/gulp/tasks/git')
require('./build/gulp/tasks/test-unit')
require('./build/gulp/tasks/test-projects')
require('./build/gulp/tasks/perf')
require('./build/gulp/tasks/test-vulns')
require('./build/gulp/tasks/test-circulars')

// global tasks
task('build', series('dll', parallel('bundle:all-packages', 'build:docs')))