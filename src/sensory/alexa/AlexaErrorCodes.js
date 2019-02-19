/**
 * Created by sashthecash on 21/06/2017.
 */


module.exports = {

	/** 300xxx internal Process */
	ERROR_INTENTNAME_MISSING_IN_CATALOGUE : {
		code : 300100,
		msg  : 'Intentname is missing in catalogue',
	},

	ERROR_VAR_MISSING_IN_CATALOGUE : {
		code : 300101,
		msg  : 'Variable is missing in catalogue',
	},

	ERROR_COMPILE_CATALOGUE : {
		code : 300102,
		msg  : 'Data is missing',
	},

	error : function ( ERROR, stack ) {
		let err   = ERROR;
		err.stack = stack;
		return err;
	}

};
