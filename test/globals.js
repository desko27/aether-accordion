import {expect} from 'chai'
import sinon from 'sinon'

const g = global || window

g.expect = expect
g.sinon = sinon
