/**
 * Created by sashthecash on 28/04/2017.
 */


const
  objectPath = require('object-path'),
  crypto = require('crypto')
  userstore = require('./AlexaStore')

class AlexaRequestVO {

  constructor (rawData) {


    //WorkoutPictureURL
    this._pictureURL = null;

    //VideoURL
    this._videoURL = null;

    //WorkoutDescription
    this._description = null;

    //Exercise Database
    this._dataBase = null;

    this._rawData = rawData

    this._sessionData = {}


    this._shouldEndSession = true

    this._locale = objectPath.get(rawData, 'request.locale')

    this._requestType = objectPath.get(rawData, 'request.type')

    this._intentName = objectPath.get(this._rawData, 'request.intent.name') || this._requestType
    this._intentName = this._intentName.replace('AMAZON.', '')

    let deviceID = objectPath.get(rawData, 'context.System.device.deviceId') || 'noDevice'
    this._deviceID = crypto.createHash('md5').update(deviceID).digest('hex')

    let sessionID = objectPath.get(rawData, 'session.sessionId') || 'noSession'
    this._sessionID = crypto.createHash('md5').update(sessionID).digest('hex')

    let userId = objectPath.get(this._rawData, 'session.user.userId') || 'noUserID'
    this._userId = crypto.createHash('md5').update(userId).digest('hex')

    this._reqSessionData = objectPath.get(this._rawData, 'session.attributes') || {}

    // parse Slots to object.
    let slots = objectPath.get(rawData, 'request.intent.slots')
    this._slots = {}
    for (let slot in slots) { this._slots[slot] = slots[slot].value}

    this._vReq = {}
    this._vRes = {}
    this._vResLoop = []

    this.card = null

    console.log('---------------------')
    console.log(JSON.stringify(objectPath.get(rawData, 'request'), null, 4))
    console.log(JSON.stringify(this._reqSessionData, null, 4))
    console.log('---------------------')
  }

  savePermanent (key, val) {
    return userstore.save(this._userId, key, val)
  }

  getPermanent (key) {
    return userstore.retrieve(this._userId, key)
  }

  set vReq (val) {
    this._vReq = val
  }

  set vRes (val) {
    this._vRes = val
  }

  set vResLoop (val) {
    this._vResLoop = val
  }

  set skillData (val) {
    this._skillData = val
  }

   //WorkoutPicture
  set pictureURL (val) {
    this._pictureURL = val
  }

  //VideoURL
  set videoURL (val) {
    this._videoURL = val
  }

  //WorkoutDescription
  set description (val) {
      this._description = val
  }

  //Exercise Datenbank
  set dataBase (val) {
    this._dataBase = val
  }

  set answer (val) {
    this._answer = val
  }

  set shouldEndSession (val) {
    this._shouldEndSession = val
  }

  set repromptText (val) {
    this._repromptText = val
  }

  set intentName (val) {
    this._intentName = val
  }

  set sessionData (val) {
    this._sessionData = val
  }

  get shouldEndSession () { return this._shouldEndSession }

  get reqSessionData () { return this._reqSessionData }

  get vReq () { return this._vReq }

  get sessionData () { return this._sessionData }

  //Exercise Database
  get dataBase () { return this._dataBase }

  //VideoURL
  get videoURL () { return this._videoURL }

  //PictureURL
  get pictureURL () { return this._pictureURL }

  get vRes () { return this._vRes }

  get vResLoop () { return this._vResLoop }

  get skillData () { return this._skillData }

  get local () { return this._locale }

  get answer () { return this._answer }

  get deviceId () { return this._deviceID }

  get userId () { return this._userId }

  get sessionId () { return this._sessionID }

  get slots () { return this._slots }

  get answer () { return this._answer }

  get requestType () { return this._requestType}

  get intentName () {return this._intentName}

}

module.exports = AlexaRequestVO
