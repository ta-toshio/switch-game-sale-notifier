import * as functions from 'firebase-functions'
import storeGameMasterEventRegister from './storeGameMaster'
import storeGameSaleMasterEventRegister from './storeGameSaleMaster'

const express = require('express')
const app = express()

exports.updateGame = storeGameMasterEventRegister()

exports.updateGameSale = storeGameSaleMasterEventRegister()

exports.api = functions.https.onRequest(app)