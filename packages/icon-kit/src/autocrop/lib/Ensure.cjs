
const util = require('util');

module.exports = class Ensure {

	static unexpectedObject(message, obj) {
		return new Error(message + ": " + util.inspect(obj, {showHidden: false, depth: 2}));
	}

	static notNull(obj, objDescription = 'object') {
		if ( !obj ) {
			throw Ensure.unexpectedObject("Expected non-null " + objDescription, obj);
		}
		return obj;
	}
	
	static type(expectedType, obj, objDescription = 'object') {
		Ensure.notNull(obj, objDescription);
		let actualType = typeof obj;
		if (actualType !== expectedType) {
			throw Ensure.unexpectedObject("Expected type '" + expectedType + "' for " + objDescription + ", instead '" + actualType + "'", obj);
		}
		return obj;
	}

	static boolean(obj, objDescription = 'boolean') {
		return Ensure.type('boolean', obj, objDescription);
	}
	
	static string(obj, objDescription = 'string') {
		return Ensure.type('string', obj, objDescription);
	}
	
	static object(obj, objDescription = 'object') {
		return Ensure.type('object', obj, objDescription);
	}
	
	static func(obj, objDescription = 'function') {
		return Ensure.type('function', obj, objDescription);
		// TODO presently no easy way to detect difference between function vs class.
	}

	static clazz(obj, objDescription = 'class') {
		Ensure.type('function', obj, objDescription);
		if (typeof obj.constructor !== 'function' ) {
			throw Ensure.unexpectedObject("[" + objDescription + "] Expected class, but function doesn't have constructor", obj);
		}
		return obj;
	}

	static array(obj, objDescription = 'array') {
		if (!( obj instanceof Array )) { // Note: typeof for arrays is 'object'.
			throw Ensure.unexpectedObject("Expected array for " + objDescription + ", instead '" + (typeof obj) + "'", obj);
		}
		return obj;
	}
	
	static arrayWithLength(obj, expectedLength, objDescription = 'array') {
		Ensure.array(obj, objDescription);
		if (obj.length != 1) {
			throw Ensure.unexpectedObject("[" + objDescription + "] Expected array with length " + expectedLength + ", but has length " + obj.length, obj);
		}
		return obj;
	}

	static integer(value, valueDescription = "integer") {
		Ensure.notNull(value, valueDescription);

		// Ensure number - or if string, then convert to number
		let type = typeof value;
		if (type !== 'number') {
			if (type === 'string') {
				let _value = parseInt(value, 10);
				if ( !isFinite(_value) ) {
					throw new Error("[" + valueDescription + "] Couldn't convert string to integer: " + value);
				}
				value = _value;
			} else {
				throw Ensure.unexpectedObject("Expected type 'number' (or 'string' that can be converted to 'number') for " + objDescription + ", instead '" + type + "'", obj);
			}
		}

		// Ensure integer
		if ( isFinite(value) && value!=Math.trunc(value) ) {
			throw new Error("[" + valueDescription + "] Number is not integer: " + value);
		}
		return value;
	}

	/**
	 * Faster/less flexible version of above method.
	 */
	static integerStrict(value, valueDescription = "integer") {
		if ( isFinite(value) && value!=Math.trunc(value) ) {
			throw new Error("[" + valueDescription + "] Not valid integer: " + value);
		}
		return value;
	}
}
