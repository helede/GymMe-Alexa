/**
 * Created by sashthecash on 21/06/2017.
 */

const
  AlexaComplexAnswer = require('./sensory/alexa/AlexaComplexAnswer'),
  lodash = require('lodash')

class Execution {

  /**  @param {AlexaRequestVO} alexaRequest */
  static exec (alexaRequest) {
    return Promise.resolve(alexaRequest)
      .then(Execution.handleIntent)
      .then(alexaRequest => {
        alexaRequest.answer = AlexaComplexAnswer.buildComplexAnwser(alexaRequest)
        return alexaRequest
      })
  }


  /**  @param {AlexaRequestVO} alexaRequestVO */
  static handleIntent (alexaRequest) {

    // vui implementation magic 3 lines! Dont Touch!
    if (alexaRequest.reqSessionData.subIntent &&
      alexaRequest.reqSessionData.subIntent[alexaRequest.intentName]) {
      alexaRequest.intentName = alexaRequest.reqSessionData.subIntent[alexaRequest.intentName]
    }

    let intentMethod = alexaRequest.intentName

    // alexaRequest.vReq     = {}; // data extracted out of the request
    // alexaRequest.vRes     = {}; // data generated to answer
    // alexaRequest.vResLoop = {}; // data generated to answer in loops

    /** check if a Method exists – named like the intent.. */
    return (typeof Execution[intentMethod] === 'function') ?
      Execution[intentMethod](alexaRequest) :
      Execution.GenericVuiRequest(alexaRequest)
  }







  /**  @param {AlexaRequestVO} alexaRequestVO */
  static LaunchRequest (alexaRequest) {

      let usersx = alexaRequest.getPermanent('userObject')

      if (usersx == undefined) {
          console.log('lange antwort')
          alexaRequest.pictureURL = "https://image.ibb.co/jDnJxJ/welcome.png";


    }
    else {
      console.log('\n \n Username: ' + usersx + '\n')
      alexaRequest.intentName = 'SecondStartIntent'
      alexaRequest.vRes = usersx
      alexaRequest.pictureURL = "https://image.ibb.co/jDnJxJ/welcome.png";
    }

    return new Promise(resolve => resolve(alexaRequest))
  }

    /**  @param {AlexaRequestVO} alexaRequestVO */
    static StopIntent (alexaRequest){

        let usersx = alexaRequest.getPermanent('userObject') || {userName: ''}
        alexaRequest.vRes = usersx
        alexaRequest.pictureURL = "https://image.ibb.co/e7wxPy/Bye.png";
        alexaRequest.shouldEndSession = true;

        return new Promise(resolve => resolve(alexaRequest))
    }




/*    /!**  @param {AlexaRequestVO} alexaRequestVO *!/
    static SessionEndedRequest (alexaRequest) {

        let usersx = alexaRequest.getPermanent('userObject') || {userName: ''}
        alexaRequest.vRes = usersx
        /!*alexaRequest.videoURL = undefined;
        alexaRequest.shouldEndSession = true;*!/

        alexaRequest.pictureURL = "https://image.ibb.co/e7wxPy/Bye.png";
        console.log("ByeBild" + alexaRequest.pictureURL)

        return new Promise(resolve => resolve(alexaRequest))
    }*/


  /**  @param {AlexaRequestVO} alexaRequestVO */
  static ProfilName (alexaRequest) {

    let name = alexaRequest.slots['profilVar']
    let userObj = alexaRequest.savePermanent('userObject', {userName: name})
    alexaRequest.vRes = userObj

      if(userObj == true){
          alexaRequest.pictureURL = "https://image.ibb.co/i3iBjy/Name.png";
      } else{
          alexaRequest.pictureURL = "https://image.ibb.co/jDnJxJ/welcome.png";
      }



    return new Promise(resolve => resolve(alexaRequest))


  }


  /**  @param {AlexaRequestVO} alexaRequestVO */
  static AskWorkoutsIntent (alexaRequest) {
    let userObject = alexaRequest.getPermanent('userObject') || {userName: 'tobi'}
    if (userObject.currentExercise !== undefined ){
      userObject.currentExercise ++}
    else {
        userObject.currentExercise = 0
    }

    alexaRequest.savePermanent('userObject', userObject)

    console.log('userObject' , userObject)

    alexaRequest.vRes = Object.assign(userObject, alexaRequest.dataBase[userObject.currentExercise])
    alexaRequest.shouldEndSession = false;
    //alexaRequest.pictureURL = ""
    //Crunches
    alexaRequest.videoURL = "https://www.garritschaap.com/hda/alexa/Crunches_CUI.m4v";

      return new Promise(resolve => resolve(alexaRequest))
  }


  /**  @param {AlexaRequestVO} alexaRequestVO */
  static NextIntent (alexaRequest) {

      let userObject = alexaRequest.getPermanent('userObject') || {userName: 'tobi'}
      console.log('Current User', userObject)

      if (userObject.currentExercise !== undefined) {

          ++userObject.currentExercise
      }
      else {
          userObject.currentExercise = 0
          console.log('Aktuelle Aufgabe' + userObject.currentExercise)
      }

      console.log('Current Exercise: ' + userObject.currentExercise)

      alexaRequest.savePermanent('userObject', userObject)

      console.log('userObject', userObject)

      if (userObject.currentExercise == alexaRequest.dataBase.length) {
          // send cards
          return new Promise(resolve => resolve(alexaRequest))

      }


      // check if exersice exisits
      let exercise = alexaRequest.dataBase[userObject.currentExercise]
          /*if (!exercise) {
            alexaRequest.intentName = 'StopIntent'
            alexaRequest.vRes = userObject
            alexaRequest.shouldEndSession = true;
          } else {
            // { userName: Tobi, exersiceName: kjdf}
            alexaRequest.vRes = Object.assign({}, userObject, exercise);
            alexaRequest.shouldEndSession = false;*/

      if (userObject.currentExercise == 1) {
          //Squads
          alexaRequest.videoURL = "https://www.garritschaap.com/hda/alexa/Squads_CUI.m4v";
          alexaRequest.pictureURL = "https://image.ibb.co/b1b3ud/Gym_Me_Card.png";
      }

      if (userObject.currentExercise == 2) {
          //Push Ups
          alexaRequest.videoURL = "https://www.garritschaap.com/hda/alexa/PushUps_CUI.m4v";
          alexaRequest.pictureURL = "https://image.ibb.co/b1b3ud/Gym_Me_Card.png";
      }
      if (userObject.currentExercise == 3) {
          //Jumping Jack
          alexaRequest.videoURL = "https://www.garritschaap.com/hda/alexa/JumpingJack_CUI.m4v";
          if (alexaRequest.videoURL == undefined) {
              alexaRequest.intentName = 'AskExercise';
              alexaRequest.pictureURL = "https://image.ibb.co/b1b3ud/Gym_Me_Card.png";
              //alexaRequest.description = askedExcercise;

          }
      }
      if (userObject.currentExercise == 4) {

          alexaRequest.intentName = 'StopIntent'
          alexaRequest.vRes = userObject
          alexaRequest.shouldEndSession = true
      }
      else {
          // { userName: Tobi, exersiceName: kjdf}
          alexaRequest.pictureURL = "https://image.ibb.co/c7egSo/GymMeBG.png"
          alexaRequest.vRes = Object.assign({}, userObject, exercise)
          alexaRequest.shouldEndSession = false;
      }
      return new Promise(resolve => resolve(alexaRequest))
    }




  /**  @param {AlexaRequestVO} alexaRequestVO */
  static AskExercise (alexaRequest) {

    let exerciseName = alexaRequest.slots['exercise']
    let keyed = lodash.keyBy(alexaRequest.dataBase, 'exerciseName')


    let askedExcercise = keyed[exerciseName]

    console.log('askedExcercise1', askedExcercise)
    if ( askedExcercise ) {
      let decription = askedExcercise.exerciseDescription
    }

    console.log('keyed', keyed)
    console.log('askedExcercise2', askedExcercise)
    console.log('exerciseDescription', decription)


    //let explainJumpingJack = alexaRequest.dataBase[0].Description

    alexaRequest.vRes = {exercise : askedExcercise}
    return new Promise(resolve => resolve(alexaRequest))
  }


  /**  @param {AlexaRequestVO} alexaRequestVO */
  static Endworkout (alexaRequest) {

    // alexaRequest.vRes = {exercises: 'aslkhj'}

    alexaRequest.card = {
      type: 'Standard', // Simple, Standard, LinkAccount
      title: 'Dein heutiges Trainingsergebniss',
      text: 'Datum: \n Bodypart: \n Dauer: \n Deine nächste Trainingssession am: \n',
      image: {
        smallImageUrl: 'https://image.ibb.co/b1b3ud/Gym_Me_Card.png',
        largeImageUrl: 'https://image.ibb.co/b1b3ud/Gym_Me_Card.png',
      }

    }
    return new Promise(resolve => resolve(alexaRequest))
  }


  /**@param {AlexaRequestVO} alexaRequestVO */
  static GenericVuiRequest (alexaRequest) {
    return new Promise(resolve => resolve(alexaRequest))
  }

}

module.exports = Execution
