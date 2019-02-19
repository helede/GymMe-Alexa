/**
 * Created by sashthecash on 21/06/2017.
 */

const request = require('request')

class AlexaInitialisation {

  /** @description load Google Sheet */
  static async loadSpreadSheetVUI (config, page = 'VUI') {
    return new Promise((resolve, reject) => {
      request({
          url: `https://sheets.googleapis.com/v4/spreadsheets/${config.googleSheetId}/values/${page}!A1:Z1000`,
          qs: {
            majorDimension: 'ROWS',
            key: config.googleApiKey,
            //range: config.range || 'A1:Z1000'
          }
        },
        (error, response, body) => {
          // console.log(body)
          if (!body || error) { return reject('ERROR -> while loading vui', error) }
          let rows
          try {
            rows = JSON.parse(body).values
          } catch (err) { return reject('ERROR -> while parsing vui', err)}

          if (page === 'VUI')
            return resolve(AlexaInitialisation.transformVui(rows))
          else
            return resolve(AlexaInitialisation.createJsonObjects(rows))

        })
    })
  }

  static transformVui (rows) {
    let data = {}
    let vui = {}
    rows.map(row => {
      vui[row[0]] = row.splice(1).filter(entry => (entry != ''))
    })
    data.vui = vui
    console.log(' -> loadSpreadSheetVUI -> loadTexts -> READY')
    return data
  }

  static createJsonObjects (data) {
    let head = data.shift()
    let result = []
    let d, da, c
    for (let i = 0; i < data.length; ++i) {
      c = -1
      da = {}
      d = data[i]
      d.map(param => {
        if (param === '✓' || param.toLowerCase() === 'true') {
          param = true
        }
        // param = param.split('\n'); 
        da[head [++c]] = param
        // console.log( head [++c] , page)
      })
      result.push(da)
    }
    return result
  }


}

module.exports = AlexaInitialisation

/*
 /// https://sheets.googleapis.com/v4/spreadsheets/1snytZZJqPLmHOfDR0KuzaWv5pON20mxthn0Wz2KeHkw/values/Answers
 /// https://docs.google.com/spreadsheets/d/13wM2ht5BEOsWVbSekMr2GYbogrlLCFschW6p4OsYBZQ/edit?usp=sharing
 spreadSheetVui : {
 googleApiKey : 'AIzaSyByUgNPqdigFbWafBTfnVuOCqX6-Fy9uR0',
 googleSheetId : '13wM2ht5BEOsWVbSekMr2GYbogrlLCFschW6p4OsYBZQ'
 }*/

