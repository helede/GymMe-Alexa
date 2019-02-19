/**
 * Created by sashthecash on 21/06/2017.
 */

const
		lodash  = require( 'lodash' ),
		sprintf = require( 'sprintf-js' ).sprintf,
		Error   = require( './AlexaErrorCodes' );

class AlexaComplexAnswer {
	/**
	 @description create answer from custom pattern ( PREFIX_[2:ASSET_LOOPAFTER] ) by selecting random phrases and populate with data
	 @param {AlexaRequestVO} alexaRequest
	 @param {string} delimiter
	 @param {Object[]} assets */
	static buildComplexAnwser ( alexaRequest, delimiter = '<break time="500ms"/>' ) {

		let catalogue       = alexaRequest.skillData.vui;
		let pattern         = alexaRequest.intentName;
		let intentCatalogue = catalogue [ pattern ];
		if ( !intentCatalogue ) {
			throw Error.error( Error.ERROR_INTENTNAME_MISSING_IN_CATALOGUE, pattern );
		}
		let resultVoice = AlexaComplexAnswer.getRandom( catalogue [ pattern ] );

		let subIntent = new RegExp(/\{(.*?)\}/ ).exec(resultVoice);
		if (subIntent) {
			resultVoice = resultVoice.replace(subIntent[0],'');
			subIntent = subIntent[1];
			let options = subIntent.split(',');
			alexaRequest.sessionData.subIntent = {}
			options.map ( option => {
				let ar =  option.split(':');
				alexaRequest.sessionData.subIntent[ar[0]] = ar[1] || ar[0];
				return option;
			});
			alexaRequest.shouldEndSession = false;
		}

		console.log(subIntent, resultVoice);

		let extract  = new RegExp( /\[(.*?)\]/g ).exec( resultVoice );
		let nuString = '';
		let exp, tempArr;

		if ( extract ) {
			let assets          = alexaRequest.vResLoop;
			let loops           = Number( extract[ 1 ].substring( 0, 1 ) ) || 2;
			loops               = ( loops > assets.length ) ? assets.length : loops;
			resultVoice         = resultVoice.replace( extract[ 0 ], '$' );
			let cleanLoopString = extract[ 1 ].replace( /[^A-Z_]/g, '' );
			exp                 = cleanLoopString.split( '_' );
			for ( let l = 0; l < loops; l++ ) {
				let end  = !(l < loops - 1);
				tempArr  = exp.map( ex => AlexaComplexAnswer.populateData( ex, assets[ l ], catalogue, end ) );
				tempArr  = tempArr.filter( ex => (ex != '') );
				nuString = nuString.concat( tempArr.join( delimiter ) );
				nuString = nuString.concat( end ? '' : delimiter );
			}
		}
		exp         = resultVoice.split( '_' );
		tempArr     = exp.map( ex => AlexaComplexAnswer.populateData( ex, Object.assign( {}, alexaRequest.vReq, alexaRequest.vRes, alexaRequest.reqSessionData ), catalogue ) );
		resultVoice = tempArr.join( delimiter ).replace( '$', nuString );
		return resultVoice;
	}

	/** @description */
	static populateData ( input, data, catalogue, end = false ) {
		if ( input === '$' ) { return input;}
		if ( end && input.toLowerCase().indexOf( 'loop' ) !== -1 ) { return '' }

		let inputCatalogue = catalogue[ input ];
		if ( !inputCatalogue ) {
			throw Error.error( Error.ERROR_VAR_MISSING_IN_CATALOGUE, input );
		}
		let out, rnd;
		try {
			rnd = AlexaComplexAnswer.getRandom( inputCatalogue );
			out = sprintf( rnd, data );
		} catch ( err ) {
			throw Error.error( Error.ERROR_COMPILE_CATALOGUE, rnd + ' - ' + err );
		}
		return out
	}

	/** @description */
	static getRandom ( catalogue ) {
		let rnd = catalogue.map( phrase => {return { ph : phrase, rnd : Math.random() }} );
		rnd     = lodash.sortBy( rnd, 'rnd' );
		return rnd[ 0 ].ph;
	}
}

module.exports = AlexaComplexAnswer;
