/**
 * Created by sashthecash on 08/06/2017.
 */

class AlexaResponseVO {

  static getResponse (alexaRequest, sessionData = null) {

    let {answer, shouldEndSession, card, description, videoURL, pictureURL } = alexaRequest

    let directives = []
      if(videoURL == null && description == null){
        directives.push(            
          {
          type: 'Display.RenderTemplate',
          template: {
            type: 'BodyTemplate2',
            token: 'WelcomeScreen',
            title: '',
            backgroundImage: {
              contentDescription: '',
              sources: [{url: pictureURL }],
            },
            textContent: {
              primaryText: {
                type: 'PlainText',
                text: description
              }
            }
          }
        })
      }
      else {
        shouldEndSession = undefined;
        directives.push({
          type: "VideoApp.Launch", 
          videoItem: {
            source: videoURL
          }
        })
      }



    let res =
      {
        version: '1.0',
        sessionAttributes: {},
        response: {
          outputSpeech: {
            type: 'SSML',
            ssml: `<speak>${answer}</speak>`
          },

          shouldEndSession: shouldEndSession,
          directives : directives,
          description : description,
          videoURL : videoURL
        }

      }

    if (card) {
      res.response.card = card
    }

    // add Session Attributes
    res.sessionAttributes = sessionData
    return res
  }

}

/**
 *
 card : {
				type: "Standard", // Simple, Standard, LinkAccount
				title: "Dein heutiges Trainingsergebniss",
				text: "Datum: /n Bodypart: /n Dauer: /n Deine nächste Trainingssession am: /n",
				image: {
				   smallImageUrl: 'https://image.ibb.co/b1b3ud/Gym_Me_Card.png',
				   largeImageUrl: "https://carfu.com/resources/card-images/race-car-large.png",
				}
			  },
 * */




module.exports = AlexaResponseVO
