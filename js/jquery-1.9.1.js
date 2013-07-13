/*!
 * jQuery JavaScript Library v1.9.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2012 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-2-4
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<9
	// For `typeof node.method` instead of `node.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,
	location = window.location,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.9.1",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function() {

	var support, all, a,
		input, select, fragment,
		opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Support tests won't run in some limited or non-browser environments
	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !all || !a || !all.length ) {
		return {};
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";
	support = {
		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.5/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
		checkOn: !!input.value,

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Tests for enctype support on a form (#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
		boxModel: document.compatMode === "CSS1Compat",

		// Will be defined later
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP), test/csp.php
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = ( div.offsetWidth === 4 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})();

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, ret,
		internalKey = jQuery.expando,
		getByName = typeof name === "string",

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			elem[ internalKey ] = id = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		cache[ id ] = {};

		// Avoids exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		if ( !isNode ) {
			cache[ id ].toJSON = jQuery.noop;
		}
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( getByName ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var i, l, thisCache,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			for ( i = 0, l = name.length; i < l; i++ ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( !name.indexOf( "data-" ) ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				// Try to fetch any internally stored data first
				return elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
			}

			this.each(function() {
				jQuery.data( this, key, value );
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		hooks.cur = fn;
		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, notxml, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && notxml && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && notxml && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			// In IE9+, Flash objects don't have .getAttribute (#12945)
			// Support: IE9+
			if ( typeof elem.getAttribute !== core_strundefined ) {
				ret =  elem.getAttribute( name );
			}

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( rboolean.test( name ) ) {
					// Set corresponding property to false for boolean attributes
					// Also clear defaultChecked/defaultSelected (if appropriate) for IE<8
					if ( !getSetAttribute && ruseDefault.test( name ) ) {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					} else {
						elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		var
			// Use .prop to determine if this attribute is understood as boolean
			prop = jQuery.prop( elem, name ),

			// Fetch it accordingly
			attr = typeof prop === "boolean" && elem.getAttribute( name ),
			detail = typeof prop === "boolean" ?

				getSetInput && getSetAttribute ?
					attr != null :
					// oldIE fabricates an empty string for missing boolean attributes
					// and conflates checked/selected into attroperties
					ruseDefault.test( name ) ?
						elem[ jQuery.camelCase( "default-" + name ) ] :
						!!attr :

				// fetch an attribute node for properties not recognized as boolean
				elem.getAttributeNode( name );

		return detail && detail.value !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};

// fix oldIE value attroperty
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return jQuery.nodeName( elem, "input" ) ?

				// Ignore the value *property* by using defaultValue
				elem.defaultValue :

				ret && ret.specified ? ret.value : undefined;
		},
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ( name === "id" || name === "name" || name === "coords" ? ret.value !== "" : ret.specified ) ?
				ret.value :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret == null ? undefined : ret;
			}
		});
	});

	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		event.isTrigger = true;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur != this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			}
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== document.activeElement && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === document.activeElement && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var i,
	cachedruns,
	Expr,
	getText,
	isXML
 * ompile,
	hasDuplicat
 * outermostCont* Inc
	// Local document vars
	setD12 jQue,
	012 jQue. and Elem. and otherIdes SizrbuggyQSAunder theMatchequerm * http:/contaijquersortOrderright 2Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc =ery Jav.nd other cosupport = {}. anir//jq = 0. andne via arclassChttp = createallee(s betokenallee and Firefox dies izle.js
rallee and Firefox dies ght 2General-purpose co-4
 *toundtrcript Libr= typeofScript Lib,
	MAX_NEGATIVE = 1 << 3113335)
Array methods
	arr = [] becop = arr.pop becushthe rootushSP.Nlice an roojQuer,ght 2Use a stripped-down indexOf if we can't u<9
	/native one
	node.met,

	//node.met|| *!
 * jQueelemrary 		1.9.1 via ar		len
varhis.length;
		for ( ; i < len; i++of unde	if ( corr[i] === typeof unde		return iumen	}
ent,
	indow.d-1;
	},
3335)
Regular expressions3335)
Whitespace characters http://www.w3.org/TR/css3-selectors/#w case of 
	 the $ in fine[\\x20\\t\\r\\n\\f]"ort: IjQuery = window.jQuery,

	/yntax/#verwrite
	
	verwrite
Encodingfine(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+"right 200osely modeled on CSS identifieroverwrite
	List,
n unquoted value should b9
	/_version = "1.9jQuery = window.jQuery,

	// Map overattribute	// Map ovght 2Proper s2type:t = core_deletedIds.coCSS21/syn win.html#to so-def-sion = "1.
	sion = "1.9=overwrite
eted dat.replace( "w", "w#" #13335)
Acceptable coreap ovt = core_deletedIds.co
	core_push = core_deletedIds.puOwnPropert cac[*^$|!~]?=)	//  = core_df jQu\\[
// se of overw+ "*(
// st of deleted data+ ") context ) {
		/
		"*(?:
// OwnPropertontext ) {
		// Th?:(['\"])(che ids, s^ ids])*?)\\3|he jQsion = "1.9uall|)|ly just the init  "*\\
	//push,
	use  arg jQues erenceort: I  then notefoxicendatapseudos/bracketquer:[eE][+-]? = core_d // Map ovenon-parentheti5, 2Map over jQlitting on whinythdataelseittinThese cause ences are here to reduce][+- number of	core_rnotitting nee dataf
// ize intrim PSEUDOg atFiltexOf
	// Us jQu:he jQuery object is actuallche i((.fn.init( selector, context, root( selector, con()[\\]]|
// nction( setoString,
3, 8 )
	// *)|.*)\\sed right 20ea dataand hiteescaped traildata the $ in , capturdatasome]+>)[se of overwverwrite
	_precF\xA0]+he lateck frtrim = n't RegExp( "^ context ) {
		// +(#952^or, conteche ids,)*d for matching numb+$ore_gsOwn = rcommaSON RegExp
	rvalidchars = /^[\],:{}*, context ) {
		// TsOwn ape =binpy of jQ?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,(e
	_$ = window.$,
>+~]d for matching numbe^"\\\r\
	// Ualse|null|-?(?:or HTML \\\r\,
	core_toStr RegExp
	rvalidchary );
	},

	//$sOwn = /jquey.coce
/consID":z])/gi,

	// Us#he jQuery object is actually \\\r	"CLASS()
	fcamelCase = \\.unction( all, letter ) {
		return lNAME.toUpperCase();
	},[name=fn.in?he jQuery object is actuall	// rers
	eturn lTAG()
	fcamelCase = he jQuery object is actoString,
	core_hamel {
		return lATTR()
	fcamelCase = ecognition (#1eturn lple wa=== "load" || documen/,
	rdashAlp	"CHILe()
	fcamelCase = :(only|first|last|nthom r-or d)-(child|of-r
	/r <tag>y just the init connstreven|odd|(([+-]|)(\\d*)ned for matching numbeery.f ) {
 {
		if ( document.addE\\d+)|)d for matching numbersickEx "igh for // Ford of in libraries implejQuedata.is()( "loaWed of corr t acPOS /jquedatain `// Map`.reaEFF\s * Copy=== "load" || documentext ) {
		// T[hes |:EventListeeq|gt|ldom rethod for dction() {
nt.atext ) {
		// Th(?:-\\d)?		doc );
			window.removeEven(?=[^-]|$ntListenedow.lo	rsib*))$/= /[	_$ =t\r\n\f]*[+~]/ jQueode.met= /^[^{]+\{\s* ) {e.metcode cont// Easilye = see.ha/retrieve.hasID or TAGefinetterFEFF\xA0]+|[rquickack to /^(?:#([ we +)|(\w+)|\.n this;
)$ conteinputL st	retuings
|// Map|Copyarea|button)$/1
 *rheadtoStr/^h\d{
			
	r^>]*|#ecto'|\\/g		if = core_dQrenc		if \=function( selec([^'"\]]*)function( selec\]ecto

		/_ver^>]*|#rty,
	core_trim = core_,
	core_indexOf = c^>]*|#(-.1",

	// Sarun=== "<" &&\\([\da-fA-F]{1,6}function( sele?|.)ectorfex check
		*!
 * jQue_,sume thbrary definehigdocu"0x
// ^>]*|#([- 0x10000umen// NaN means]+>)[, elpointocation = r );
!==id
			?nt.a^>]*|#([:nt.a// BMPh, elpecified	r );
< 0ch && 	Standa.fromCharCode(id
			+html or  )1] ||  !coSup

		} eal Planch, elpecif (surrogate pair	doctml) -> $(array)
				if ( ma>> 10 | 0xD800,id
			& 0x3FFor bacC) {
ndow;

: IE<9
	// For `typeof jQueryhod` instead of `node.method try( sejQuer.call(g at yoseveracluding Aibutent.	detaNodes, 0 )[0].nodeType;
} c * h ( eec( sejQuery,
*!
 * jQueiec( selectotype// Usresul
		if[]umenwhile ( (typeoe corr[i++])ument = t( matct)
	r= typeofumenlocation = t( matcthis, }

/**
 *ad", feature dete * jQes o@param {F!
 * jQ} fnlook props)
	and testent( r matchNET tra
 */
	if ( jQuisN matc(e
		c( seext ) {
r matc..isF[ mat+ ""ch ioperties oC Fire key-to som httpss\uFlimince sizeas meindow.s if possib(/ Fong, Object)} R				thi\/\1text[ ( win aftre_stoandalitcoreitself with
 *	p	corety  {


				(e of -suffixed)// Fo<[\w\W](if
				 http is larger than y.co. httpLt doc)	// ],

else \/\1oldisFuentryh ] ) ) {
				d Firefox die( se1.9. httpy.rekeych[1] ) ]( contex(ementB, props)
			key, to somc( sel: IE<9
(key				 ")and avoid collier j

			ion( thiprotor
	/ OpeDLE:lse (see Issue #157	docgumen lon		for () {
	=				 ) >);

					// Checkument = // Only keepo cat
 *
 *\/?nen Blaies conntNodElement[of ID
shift()  ) &&location = ent #6Other ] = to so this// ...and othMark a		if ( jQut acfunctald of by S ) {
as methods if possible
							if ( jQuerymarkh ] ) ) {
					thi.attr( ma match ](fn[// Mundefnto true;]( contexfn/ ...and othxt =trac.isF= dous= docugleTaench ]methods if possible
		Pass#([\tEle Fired div\w\W]expects a boolea {
					h ] ) ) {
				onter);

		 nodes thry )=2012 jQue.rootjQext : d("div")n thnodeTypLE: $(expr(ch is this					// ec( selE: $(expalsANDL} finallexpr)
// release memoryechaIE
		h is jnullt ). ...	if ( jQulem;
	(	core_rno,|)/.s* In{
						, seexec( se1.9./jque,gleTag m, 					) )r( "loaQSAry Foun	i, groups,tch , niLE: ew * CopyrunctS/ Map on thgumen() {
			t ?) {
			t.ownerion, Inctrun ready
	:.ownerDocumen )	if (012 jQuerc( seldation, Incnt ready
	 this
org/lidy
	=tion( sel||n rootjQuNDLE: match[1 {
			th||r in thgumen!// Map oor =r
	// Tlector;
	if ("em = d.id pr)
			} el
							// r documen					) ).selector 
					) )return1 &&s.length elect9xt;
		}

		ret] ) &.makeArra!
 * Released  wit! = this[0ctor )Shortcu
//"documen/jquehis.ector ) {.execr.nodeType )ntext ) )jectpeed-up:selector"#ID": conth: 0,
 =select[1ontext ) )functi( selector selector
	&& (PlainO this );getext : dById( tch in  the mCheck  = /\St,
	and 				//w+-]?Blackberry 4.6 					th );
	},

				;
		atfari no lonatch/ A sim012 jQuer#6963 );
	}gumen() {
&&ction.t the Nth e functionhe mHandld)
			c	}

w5.0 aIE, OwnPr,\w\W]Webki( sedow.dotemR
	// Ghe mb $(#id)insteads\uFID Return function.idoArracument = w) ) {
						for ( match in ] : thi		return jQuerynts at,
	 and (her num ] : n array of elements ad pushit onto the st,

	lector.intext as a clean
	get: func else if ( jQuery.isFu&&.isPlainO else if ( jQuery.isFcore_slice.call( thi) &&ents ang/licens

		// Buor;
		 .cons[ this.length + num ] : his[ num ] );
	},

	// Take ck
	// (returning the new may obhe matched element sets to: conit ontogumen{
		re2]num == nu)
	r.apply(is.context  ? contextreturn core_slice.sByTagNamor.nodeType ), 0)
	// Takn array of eleme= this.context;

		// Ret.etter.the newly-formed on() {
		re3]the oNET tracoreByCer.cn thhe oback for every elemention( callet
		return ret;
	},

	// Execute a callback for every elemention( cal( thit.
	// (You can seed the argment,
	lo 1;
			retpathength: 0)
	each:qsath ofer the MIh ] );// Map ontext ) )ol;
var HANDL		ns.le;
				}
e.applction)
		d element uments )ortcut fElem	},

	toArray:ly.)rtcut for dthis.qSA works// Fangds =on ext : d-roence que;
						ument.can) {
	 arounxt |isust functiyext || cxtraundef A sim	},
 functiw\W] {
	 !conp (arrt ||re (Thanksand Andr't duponFuncti || technique: con13-2E 8 doesteadvar lon o		}
		contextR
	//ngth;
	},

	toArrat wit this );
	},n th.toLowstris// nlectoeturn ext;
		}		
		// 		//$/g,

	e matched sergumenfunctio core_return coreA= core_d("id"ined in thpply( tholdtoString,
 === "<,ctor$&		// ush it onto the st this );svObject || t his.E: $(nly.
	// .
	//ly( th"[id='
// a jQ+ "'] "nction() =

		// ect documen&& jQuery.i--num == nul
		// andboh,
	sortoortcut f(

		// andbuery method.
	 ) );
	},

	ery,
	inh ] );
matched se function( et the Nth enction( sey.
	//ion() {
		retuice: []join(",t).ftext = thngth;
on() {
		reelem, i,d(expr)
return ret;
	},

	// Execute a callunction)
		.q: fyortcut fAll(ents anons, clone,gumentback 	// (You vObject = this;
		return thi(qsaErr.pusrgumen.find( selectome, opti! cor+ num ] :  this );removebject || this.c
		ret.context ment,
	locfn )clasll oj >= reg array},

	luery.fn;

,

	// For // J, "$1gh f) {
			this.context = thi/ ...and othD call xml.jquery ) {
ext : d|text[ it oem a rcontextefinfunction( e ] )udes  =selecto.jQuery idefined = typeof und//s a cleanext : dhStaver= "1d1;
		rn as 'cleanit callbackyet existsed
	(such as lo?:(<[\iframse )DLE: - #4833) (whichf ( length === )
	docuy matchef ( jQuery.isFunct) {
)t || context : dNDLE: $(exned values
		if ?object
			for ( elem, i )allbacHTML" :context s, jQ.))
			etsobject
		-reltjQuevarie.has once batext? len :cur /\S}

	// extenQuery.isFunction(target) [doc]		target = {};
012 jQuereturn tto.detaco setet as a clean{
								thistarget) ch ] );
							if ( target === /
dation, Incy itself i| (copyIsArray*!
 * jQuern t		// (whichral a					?ay ) f ( jQuery.isFunct					ector ) ) {
		rgum13-2fhed 012 jQuerw\W]if ( length === i )availe.hahis.dow.ector.sIsArrurn rootjQue== und
					) )ty sele||he det || context : dxt;
		}

		retundefined )
	// HaSet ouse if we'r and others just;contributs just {
			// Extend thlone t} else if (srs
 * Released  = udes src &&uncti,

	// Geif  every element in the"*")t set OR up mthis.pushSt)
	each:t in thNoCom(?:\d*= context*!
 * jQue
				
		dedivret;endCdetasrc &valent urn the(""	// (Yoen targ!;
};defined ) {
					target[ ect documey ob ( copy !== unnction( sele core met$(null)edust itespace
	the w		}
		}
	}nction( selecified object
	return target;
};innerget[sh: <},

	l><_versio>"copy1.9. retuvar
	// T;
};or dry.exrevObject || thmultipleand thnctio8name ] = 	// Fong1;
			ne tnction( selventn the ck: p ovn( eleen targ retulector );

	"ionseadyWait: r.contewindow.$ = _$;
		}

	) {
		return jQuery.eac{
		be_slisted		}
		}
	} function( call
		}

		return jQuery;
	},

	turnwnPrinsteadfindms tecond ler.c(#id)(in 9.6	doc// Is the DOM readry )ler.c='hidden e'></div>wait ) {

		// Abo if thert to // The 
		if ( window.$tion( call{};
	eady
		if ( wait === true("ey ) {
			text ) ) {or( context ) fn );

	Safari 3.2tributesler.core
	// the rc) ? llback				//chrn tR
	/s.
	isReady: fler.ct++;
		"et to  originaQuery.readyWait : jQuery.isReady ) {
	 jQu2 ready event
	holdReady: functicallname ] = his.pushust the  ( copy !== undefined ) {
		src privilegevent(mn thirolsefinQuery.isReady = truenum )
	each: funct++;
		} else {
			jQuery.ready( trueIn	}
		elect( ele// Is( this, argatch Mak// Is the DOM read`nodmee_pushions bound" if are areresolveWith( document, [  we're alntribut.inntexBeforeeturn,nal ents
thod ry.exfunctios loe len truep, ineep, cl DOM Ready event onstru jus the browse
	_willay() :

fewtch[2] ) || rorrect"2				}).off("ready");
		}
(th( documdy );
		}

		/// The/ See test/unit/core.js for demo0 anoncerning isFunc0ion.
	// Since version 1.3, DOM met+py sect documen)
	each: fuIdNott++;
		
				ore_slice.call(  DOM meth documenC;

	upady events
/ skipry.exten				reody ) {
		("rewindow.$ = _IE6/7upported. d		targnction( seery.coy = _
			// 
		}

		return jQuery;
	},

	// Is the DOM reada href='#, [ jQ.body ) {
			ret{
			jQueryold (orcurs.
	{
			jQuerrevObject || Wait:use strict";
onstrusFinite( obj );
	},

	type:("n( o")}

		"#e readch &&{}1] ||
		taString:ndefined = typeof undedy ) {
		= argevObject || t String, 2tantiat/ th		"r
	/ "object" || typeof obj === "function" ?
			class2t(obj)  copy, n	is, jck hoD

	// Hnd fcheck fs;
	},

	slictype(obj) ===targetretur
	//[ace( jQuprops)
				dn deep coindow argument) && ireturn core_slice.call function( obj ) {
	he default lengt{
		deep = se
		return core_slice.call(  jQuery me,

	// Get the Nth element in the matched element set OR
	// et the whole matched element set as a clean array
	getpported.ts d {
		return n? [m] :1] ) && obj ) {ve to cheheck the presence of the ugh, as 1.9. = cI( thi},

	// For ex check,senc=== "<"nd then;
		}

| "object" :
			typeof obj;
	},

	isPlainObject:is.c}

			!corecopy,  Maket ).f onto the to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !=bj === "funcm: $(htm	his.lengtid			this.conn" ?
			class2Nth eand window objects durn key === undefie ) {
.to somn obj )	for ( 	bj.coents ancript Libr ) {
		structor &&
				!core_hasOwn.call(obbj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return 1.9.					var
	// Ttion" ?
			class2defined || core_hasOwn.canal): If specified, tean and the n;
		}
					with anEmptyObject IE8,9 Will throw exc{
		//Tag		returheck ts to jQu}
		}
	}

	// Return the mh &&ypeOf") ) tagconstructor property.
		// Make sure that DOM nment in thned || core_hasOwnf obj === "funcback for every element in the tagtoStringbj )		forction( data, context, keepScrisingleTag.tes	tm theence t,
	spl	// Us) {
			this		if ( typeof context === "boolean" ) functi check out posry,
ing n the w argumentag obj )steneobj == jQuery.isPlainO {
			tt( context ) ) ? this[ thiuery.map(this, + num ] : tmpm ] );
	},

	// Takecontext = th#6781
	remp().done( vObject = this;
		r) {
		//n the scripts paseted in the html & --jQuery&&typeOf") ) a, context, keepScrpts ) {
		if ( !data || typeof da!== "string" ) {
			return nul;
		}
		if ( typeof contextn the (#id)h in con) {
		//tion(e scripts pasetter.turn jQuery.mergetion( callbacypeOf") ) if ( !doces );
	},

	parseJSON: function( data ) {
		// Attion( calland window objects don't pass through, as l;
		}
		if ( typeof context Add the caif ( !docu && window.JSON.	ret an /jquery() {
		res[ match
		//f ( data ) {
		(:ace.me namelsescontexn the slic (IE9/ );
		11.5) license
 * httger in thctiona(:focusctual JSON
				// Logic borChrne t21\\\ret thFEFF\// Halso ad	.repjson.org/jsonsiver-/jquery c// GsdtokenQSA// Han		// Maky.isFuwcore requi0 ando mi++ , el (rn ( nincludas a clean readyp://json.	ret= [ "validc"inje documen,

	slice: fes
			this[
	//ngth,
		deep = fined in t!conuuery	retregexXML: fRta )returtegy adopjQueack( Diego Perini
		ified object
	return targetone th MaphStajectso empty to waiton rt: Fir null;
Ts.lei< len.isFuIE's t Firwe're uery; i //sitly null;
set( !cotor );

		 If then( obj ) {conteeFro					it)\s*\su, S && window.enoug thi [[Class]] bugs.jngth,.com/tior s/12359	if ( obs the DOM ready to be op( jQu},

	led=' if 			}
	e used? Set t"Microsow m- Sne tr );

		 case IE gettchedtDOMParee thisFunp.parsready readngth,
		deep = fa"[} catch(]eady ) {
			returder the MI		for (tor, context ) {
		// Th?:( rvaed|dise.had|ismap|ounter t|}
		up me} catch(|the jQonly.
	/t = this..toArred from- 
	noop:  && winden target is ing 		}
		his.pushStac[[Class]] -> type pairs
2011/REC-y,

	// Map ov-ve/20929 = {oop: ;
		}
		if th/uni e" )  5.0 aurn te.js || 			/				rring in gName( "parsererror" ).length 
	noop: ery.error( "Invalid XML: " + dataexecScript ().done( f
			scified object
	return targ		return from 0-12/	if ( ^= $= *=).find( winto so.java.neS core if ( d}
		tand NBSPse";
				xml.loadXML( ings

		//ing holds i=''/	reture = srcarsererror" ).length )i^=''uery.error( "Invalid XML: " + data )ry
	]=	}
		return xml;
	},

\"\"|''al context
	// WorFF 3.5ed oention(/:unction(ata )// Aborteady = t(( string ) {
		rmentste.js)
	camep: functioalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use ex)
	cameery.error( "Invalid XML: " + data )n elem.no, "Case: funl context
	// Worther than 1a litt || xval:MParsost-e = /\invalid;
			jQu	if ( obererror" ).length *,:xnymous orer
			// We us,.*:nymoustiony.makeArray)
	each:f ( data ) {
			
	// Cross-0,

	//son2.igger ) f ( data ) {
			||ady events
moz
 * htt ( ; i < length; i++ )wtoArr					value = callback.apply( o					value = callback.apply( ms					value = ca)ained in !== "string" ) {
			return null;
	// Ge objeformeit'scripts && ty.ise the incoming d"Microsr, c disconnl
	// 					(IE 9: con)
	each:						break;
 * h() {
		resontext.fn.trntextfunctionStandarde core failwhere i + (2typed a each
Gecky.isernal uuncti					cloON
				/bject
		forse for the most comm[s!to c:xonly.
	/icense
 * htt+ data )!=",;
			jQuerth,
			isArraer the MIa-z])/gi,

	// d XML: " +IsArra|unction/json.org/json2.				for ( i in obje === fa
					value =

		//// Neveg/licens an casepush,
t: Firfu sellength; i);

		} ea ) )(s.metdescenion // Hanl wi		tharget = {length; i)/.sourn this;org/licens

	// Cross-broents
g/licens)ainObjeall("\um = /ion, IncPosi( jQu function( data, btor") &&
				peof = a ];
		}

		par9 ? a		}

					// Neve: acontexbu theb, pab = jQuery.fe, "isPrototabjectwn t{};
!(xt ) ing up ];
		}

		parsey maontexore_t"\uFEFF\xfunctiontext + "" ).rereturn
					co	action( text ) {
			return&&  is for internal usage on},

	// & 16	for)
					epScripts = con?
				"" :
	gumen			"" :
	 {
			retubtrim = jQuery.fElement( parsed[bts (opo the stack (81
	relice.app target
		i = 2;
rn;
		}

		// Makelue ===copyIsArroDate *
 *				w*
 * DatesArray ) {
tion( text ) {
			return teults || [];

		if ( as thaion( ted;
	gumenn( texted = jQuhttp://sizzlre_slice.app,
					, to fn );/ onlyem, arrrrayls for internal usage only
	makeArray: function( arr,ly
	makeArray: function( arr, reained in th) {

		e_inde& 1 {
	a = jQuery.fny
	mat the Nth  ];
		}

		parssed = jQue {
		var leIsArnction(;
		},cause severa,ry.meement( pation = windorr === "s{
				jQuerin arr && arr[ i ] === elem ) {n;

		return i;
				
			}
		}

		ndexOf ) {
	g" ?
					[ a
			for ( 4 ? -1 : seconfn );function;
			}
		}

		return ret;
 ( typeof  = re,

	inArray: function( eleuom/
ext || documan tri		// Skip ac	} elwn trimecond[j] !== undaext = a  conteb+ ] = bd JSON
		//xit early= unrim =he whindesion =cali ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {		}

	P= /\Slesrnal		returneij >=nal objecait i						break;ret =ly-formed !ile {};


	// hitespace isf ( i in a+ ) {
our ow& jQuery ? ms
		// ile items
		// tor fums
		// tVal,
			Ih = i;

		returnry,
	ins,d` inst
			a ectore( rva !!inv;

		// Gile (text )  array, only sry,
	in	// G[];

		i Make sure bOj >=wi		//e					.
			 lisms.lh = iir  */
}

	vent( 
			fois			focu reta) && jQuery.icallbacurlike( Object(arr) ) ap.unse, wealuech in contcallbabk, arg ) {
		var value,
			i = 0,
			lengtb = elems.length,
			isdocumenalk peof ] );
rdataoos.pust ac{
				repanc.par jQuery.apandbox)
b( ; i ) : i :++of l === "numberifuncti	);
	ms ty,
	inial-cogth = i;

		rehav9
	/[];
r, cly
	map}
			[ i ] );
			}
( ; ,length; i:			// rat
	},

	//		i = inm
					target			co thod ength andbox)
cause severalitems
		//ength;( i in elems ) {
		ms
		//, tor
				);Always		}
uid)
			xml = newcurs://sizzls= un,
		} little "@" ("reathem);


			tion( elem		if ( jQu(a key Google alides).* http://sizzlresentext )[0, 0].*
 *(valueall( r
		r	}

		//  callp://sizzl && http://sizzln the documundefined r
		tself i	if ( isArypeOf") ) {.comng ) {
		rch ]( contexelector.rgumenment ) {
		vts.
	proxyally partially apply() {
		retuypeOf") ) {
		,ntext passed
	them012 jQuery Fo= unEFF\ = !ocument= arguments[ i ]) != null 	return rootjQuery.ready( selector  match inill incMakhis[They rml" );
			}	core_rnoteturnerencedow,  retrn u,

	// For charAt( selecto, "='$1'ugh lue ===			} else aalue ! "" ).repvalidc, so )
					.ir
		 + (ist= new
			if s;
	},

	slictypeof context =s don't pass throuy mation() org/json{};
obj[ i ] );

	 ] );rn us.conction() {
		reture_sli; i++ ) = argume1.9.re= jQse for the mos) {
			tmp =ed;
		}
		i 9'sif ( data ) {
								value = co			r				break;
				y.trim( dauid ||the html  A special, fast, lengt elemsAs we
		vxy.guid = fn.guid lace( aivalidtmpletfunction( elems // fragobj;
	}ginalnction() {cluding Ahe old obust equivt(src) ? src rse arrays
n array o funct			kee= "boocons	}

	//nction( fn, context )nd other ) {
		v[g ) ]thods and > ) {ly partiallre_trim && if ( data =);

		// Add thfn[ context ];
			context = fn;
			fn = tm else if ( jQuery.isFunction( selreturn rootjQuery.ready( selector );
		}

		if (space is rem elems );

		// Add t	bulk = key = = c=== "string" ) {
		.JSON s[0] = sval				// Dtext ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
	// The default lengt array(#id)=== un {
			return c], tru/ onlyval =);

		n obj != n[== undontext ) ,
					vadler to[i], tru = src &efined valujQuery.guidt.readyState;
		}

		rettion" ?
			class2ty.JSON && true, emptll( elemsreated in this contextem, keyA0") 	fn = function( elem, key the old o	fn = nulbackic boh &&(#id)
		/ ele&&.exc.functioed ?					to som:ement)
ly partiallunctio		// Sets mamsgulk = sage on't n" ) ( "S2typei++ ) {
unrecog,

	ind(  over j: 
// n( el				cop);
			} els		core_ata )/ ski	fn.t.length ]partiallu

	maStrace
ypeOf") )  {
			thefined ) leTag.tet.length ] t = cont	spl1	} ej || lue ===Un[],
	we *know*k( elems[bject"t.length ],!= null ) {ir
					retply( [], ret );
	!bjects
	guid: 1,

	// Bid ) {
			tal GUID counter for cuting y( [], ret );lk = ft accordurn [ context.cre])ith window argumen() {
	=context.cr i - 1  set
		ret).get.length ]		for (in" ) {
			ke ) {
			forjhe init fu/ Catch c//siry.f,

	// Bi[ j ],rsed&& windoemptyGet, 
							/r
			if ( jQu.length ] = val
				"" :
			}
	trimminge ourdifefin ===y ma ~b.sourceIode.es
	used on DOM r) -dle at asynchronously to allow scriTime();
san'   asynchronou

		else {
		probore Iuid = ;
		}
	ffer move originaiff spec
		//py !== unb folll: farowsersngth,arrayrg ) {
		var value,nextSy,
	in i ) : i : 0;

===  len;

		if  i;
				}
			}
 2;
	}

	// only sav i, a windoper	vary items 	if ( jQuerycompletor HTML t ac( window, sry 4.6 returns
	Ings
P	// U.
		//xy: function(defined = typeof undefinere set
1] ) ];
	 i ) {
			return cbody ) {
		re setbj )ings
 Holdnally once or () );
/ Proper// A fallback to window.onload, that will aing" )
			window.addEveBng" )tener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firi(ng before onload,falsg before ing" )"the old obate but safe also for iframes
			document.attachEvent( "onreadystap		retural
			window.addEve			returaltener( "match ]( contexelector;
				ults || [];-]?(?:\ner ) {e) {}

		= +e) {}

	body ) {
		entElement;
			} catch( = t,	.replaceext = falsejcontex/jquehronolying n( = c {
		ect doc,(e) {}

			context ||
						try {ect docum	for ( fast, g ) {
		rf = thacts orfn( elems[node.d = fn// Give the init funs;
	},eed[ ().ge
						try {s al readyState						j jQu!		if ( i;
				50 );
	uery method.functionry object
					Utilitylength = 1;
		$(null)e to catctor.to somof cora
	// of DOMased br= copy ) {


	//| false ) ) {
py) | *
 * Iy itself idyList.proypeOf") ) {
				retu	// cont	} euid of"	// xt || docu( selector,1] ) ];
		}

elector.sern this.eeturn;
		}uery..length =his.leisnd( sel		.repmethjQuery.after the brcontext( fn  already occurreems[ i || xmaverirefon theased bro
jQuer+=ady: * I{
					i&& windonv;

		// Guery.map(this, false;


	toArray:bj );

	if ( jQurse array: IE<9
ctort)
	p] ] : [his.pushSta// s theist.pusagw.jQskiprget = onsslice..readn't lin
						/#1115l/unseJSON: functinualllse;
	}

	ifore r.context;
		}fn;
					fn = &&
		( len ret = onto the Stan

functi					detare		fort acco() {
		nally{
			jQuer; objepoint ring Func event caleturn null;
) {
	var leng	},

	// Ta 2;
	}

h,
		type = jQuery.type(3ry.isWindow( obj 4ulk = fn;
					fn =sed Vo so, valuCase();
}) ) )();
on isArr		trrocoveratechuse  ( jQused bruery.com/tinally pack to  = jQueryut we wio re ( cop	if ( adjld ) ust  || us;
					// Check: 50
			.frameE	// U:unction doScr as callb ) |llback 
			
	//:
// t coml matc: repla>": { dir: "t the Nth ",} else: ( ; ig.cal" urn object;
}

/*
 * Cack lis+urn object;
reviousent calCreate a callback lis~s:
 *
 *	options: an option indo ] = to check});
	reype ===s[i], i, fnast,  array,{
		retu() {
		retuwn.call(obj.constructor.prototype,ipt.nwboovd)
			gieadyto som				tintern 'cllengterence ", cferenceaditional 3ptiod elemen4]ry.i list 5optio			/
 *
 * By default a callback list willrmed element sfore ~= parsed ) mes.
 *
 * em.i+k list and					copy, name,				(functch/ Supp( 0,// C Make ] =eady();
		ehaves or a more tradit/*	.replaceack( ag ) {
		[ady();
]
	},
1d (or -up mem re...: cont2 ws a 
	detach = func
	},
3(e) {}

		EventListe\d*e a n( "DO, fa?*					valu4 xt ismponer();
	xn+ynique:			wi "DO?allb| *
 *	5 signlicatece (no dup
	},
6 xterrupt callings when7e:	interryt callings when8 .readQuery.Callbacks*/aditional option object
else {
			// Enta );
		}n object
and will c3 ( obj )nth parsed ) et tth-*new Func get]?(?:\ch(e) {
		! list andllCheck, alue.call( eObject-f0stantiationck in cacumeric xata )yet tamete
	_t ac!core_hasOw.dy();ck in careme/^[\sws a },

	/ic bocad( sefunce.melyback0/1eferred)
 *4ptio+Possible op?ons:
 *
 *+0,

	//[6optio1) : 2 * Object-f*
 *bj )vent and 
		// Flag to odCasetantiatins:
 *
 *st fiObject-f7forg list 8"strf list was already firet will ac case work
nd shibi mat]?(?:\dhe newly-formed elemen "string" ?		( optionsCache[ options ] |of previous values any callba"completeehaves or a more traditnow: xtorecontexeference =ions ===5]n.callement atted to Object-away with theh ] );
he[ optioneturn null;
		}
ment)
	ext
	// Worss2typ
 * "fir+-]?(?:\d*as-iy.trim( da,
		// Laa Deferred)
 * oncmory = oprguments w Fortual ca = /^<(\w+)\ack( eference  (modified by remove if neference && ng
	rmsh ] );
eference .construc ( ; ; i ingInack( j$/g,

	/(recur	// l}

				( ; list;
		}));
	}, multipl, ( ; is.construcretudv							tmim =st.pcloe in  = /\S+/s ) {
	 firingInde multipl
	core_s(ally
		rFalse )y ) {
	-( ; listipts = false; // To{
				forx ].a ; list		}  neg matchnode.	fired,
		/0data;
			fobalnd will cevent fu		fired,
		/ data = false;		if ( stack ) {
					it = this. A fal copy; a staernafn;
	;
	jQuerg
	rmsP_hasOw A cent (load" an  (modifingth;vious values and will c3 obj.lengtobjecthe callbor us to cy)) ) ) {
				y.each( thisype = jQut++;
		if ( parsed ) pleted, false );) {Jim Dristypeo  throt() );
ction of cection ofwn.call(obj.constructor.prototyp else {
			// EnsuisPrototypeOf") ) {
				return false;
			}
ction of  maybe llem, i ) {
			return cacallction of Will throwcallbactter.toif ( data === null jQuery.isReap|)$/,trimler.callee[		data = jQ							}
		}ype(obj) =						y;
	},
(
								i RegExp
	rval(^recogtext ) {
		// ing u.unique || !s) {
		if ( docume "
	coiringIndex ler.calleea === null ) ypeOf") ) {
				return arg ) ) {
					h ] );
nallyif ( !docu||se {
	tional): If specifiehe fragment will be created in this co("ler.c.con	once:				}
		l any callba list behaves or not , 'enhance,g );

	 array, only s/ data: string of html
	//  {
			{
	var obj = cvalue !== undenction() {
	 we shoulementnd ) {
		var l = OwnPrope callb!=track 		}

		retur!art;
				;
							}
					typeof arrtext, scre sho ele].sort,
rt = start;
						fir=" ?emory ) {
trin;

	 ) {
		art;
						fire( n() {
				if ( list ) {
					jQuery.each(^argum list  = lcallb) {
					m/ With mif (0 ) {
					jQuery.each(*dex;
						while( ( index = jQuery.inA>tems
		// 			jQuery.each($dex;
						while( ( i		if ( - listdy ) {
			if ( list ) {
					jQuery.each(ike ? (memory: callbaclem.idsplice( index, 1 );
							// Handle firing |ion() {
				if ( list ||	if ( firing ) 0	// Wit; // To +rsed if ( list + "-" ) {
			
		// Makery.type( arg k added
 *					afafe ,s (lick by Diegreate a, or djQuery.isReas);

	ext (opmatted if needelecto (wecontexforwar;
var
	/iring ) {/ Colectoor dtached.oflector, (liklready = funned;
		n;
		}

hod (this, funs givrray( ?createOptt is 0
	ry.ex:che f(nngth; 					add( arg );
							}
					!!m ) {
		return y.
	// B

		//list
			empty: n deep copyxm		firingStas that areeepSstrict"is.lenunctffis.lenhrono, starr co = undi== "whetherif (
			has:? "rootjQuery  namptions: an optionay = und = /\Sry objeccond[j] !== und {
	e set
Query.irgs, function( _, arg ) {
				bled: fuusefox dlistnoth.calQuery.n.

		v collenction(d
					brx ].a:(thod for doup mts
	detach = funcm < 0 ? thiswhether+ num ] : t jQuery.efin+ num ] : t
				ry objements an {
			// Us) {
			sed [lockeeElement( pafined;
		Query.i
						ction( _, arg ) {
							varngth; and argum	}

		parsed = jQuery				}
							// Checknts and push ntext, args.s					functidisFun = 1;
		:up m-*ent.gwee != for ( ; gumensorn this;		 memo"intfinedate but s"up m Hold!( firi&&		},
			// Is urn !stacxt, args.,
					typeof arr Remove af ( firing[rn this;
		 = /\SparseFloat(o:ll the cisReady: f.has( aturn faln-nothcks f	deta(					}

	ace(ction				}on ` = /\Somplfined;
		
			has:&&ry.eallee + num ] : t contek `g ) `t && fa
			ns: aly- http:ng = false;? jQe: functi =ll the s;
				}

					/() {
				return !!e
//nd the t	h( opt		//e: functi[						!!firstructoion() {
hronou=			// O ( l1;
	 stack func

	De1tion( func) {
			/ples = [
				// action, add lof fnction() {
			 ) {
		var&&ll the ccument,
		[ry.Callbacknts
			firk;
			},
			// Ca++y.Callbacks("ment
	// keell call				ice ? args.sFallbaack.applys.pus have alread					memo
					if () {
			 ) {
		var t0					ks("mot j( {
				for			fire: W+-]?tLoadch aentBy	try {
ments );
						sbreaif (	return thintext, args ) {
				&& ++ supps("once ox)
	document = w			fired: functeferred: 
				// actist = stack = suppe", "done"			alwa fnFail, fxt, args.urn this;: IE<9
been called at learget = {retur );

		// Staents and= 0;
			firi// To kny maQuery.exisPla			return !!fireion( i, tuple ) urn s)eferred:Query.ples = [
				// actints );
				stener list, istens = argumtion() {
				self.filbacks for ded[ done | fail | p( event?-list ) elf.fefer ) {
					 if the callrn fa				 "fuloop ) {ab like"progr", jQuery.Callbacks("memory") ct", "fail", jQuery.Callbacks("once memory"), "rejectemory") ]
			],
			state = "pending",
			promise = {
				statocument context and arguments
			fireWith: function( context, args ) {
				are( argumennts );
					rhe[ oery.nctired(fuunctacom/ncounterQuery.DefefnFail, fn	jQuery.each( nts );
					r				//			return !!fireromise() : this,= tuple[ 0 ],

				then: funnDone, fnFail, fnurn this; a collectioil( arguments );
					rnProgress */ ) {ext, args.slice ? arxt, args fns = argumIncorpotmp;o catcffsetfuncenQuery.iagcenst cycl= !!zDefer )  supp-=th );ret.prevObject ) {
		turn && l			/		retu%st && list.0ress supp/obj != >( obnd the target
	ly by add and fireWith)
		firi
	// Uck by Diego 0 && ( le
	// U-st, inion( get arn a-		ifn	retv{ // Stay,
	core_trim = core_version.trise.pipe = prxecScriptPriorit

	/belsesr, bd list				int = tucustom, that wiindeadry )here upper = tule)$/,.java.neR // Flag to kset check keyher				ack( bj, callbac
				rgallbackftrimretur
	// Us[		list =!!firreturadd
			prostateStr {
			return caon( return		( optionsCac"unNET trae obj, caelems g
	rmsPex of curr				y.ea may.onlore_rnotwhite retindret );ws a;
		retunction( datchemory )lemerwise ncti [];
		ypeOf") 	for ( ] =  ) {lem;
	;
			ta );
		}his;
				}

		s to the list
		ch(e) {}

			// Fire callbaBut maiible
	NET tract ac cor:	inext a// deferred[.length,
	sed = jQue			/
				ipe for ipe for ""ck by Diegoe", "do,
					{
				list.add(.hasOwn
	corety pipe fo {
			return ca		retuired,tion doScrollCheck() {
					if ( !jQuery.i.add;

idxbled: full( obj	lis]
		{
				 by Diego Periniini
							/se; // To", "done// Give the init func		idar tnode.meontext.{
					if ( dinstantiatik, 50 );red ;
			!emory ="reshen: fun	},

	// Deferred hed push i/ results					add( arg );
							 notify ]
		ve the0 any
{
					if,
			dfire (used intpr, l Callback
	// Us});
	re ) o}

	i( sele (nlex ] = list.a"noindoke the deferred a promiseclone,
		targe lengiallbackbordinat("re i ^ 1 le.js
	for ( / Handle OMPar in l(?:(<[\w\W]\w-]*))$parseFro of  datromi"|true|ft.add;

( windt = context( match[1] y ) {

				toStrile.js
a string or something (possible i

				//vious valuesers;
				}

				// Mke the deferred a promise
		promise.he list do nothing anymore
	;
		}
		cock lCall given	// Updferred;
 {
		vxmgth ]( func ) {	splUse the tri ];
				nwbox.com/IEContens ) {
				by `	// Upd			retuferred );
		}

		// Al/ only() {
		s ) {
			 doScnts );
									e jQu		}

					e jQuull )ments and push ifiring  ) {
		,
			// Have the list do nothing anymoings
f ( li	return !stturn funcings
( value ) {
	tyGet;
	}uation
	if ( t! {
						romi			}
		th,
		callbahasning = length !== 1 || ( subordinate && jQsPrototypeOf") ) {
				return false;
elector.nodeType )typeof.length,
			beck if a esolveCg/licensning = length !== 1 || ( sructor propesPrototypeOf") ) {
				return false;
( argum &&
		( lengalue );
== 1 && le||nt);
// String t	}
								in key );
		es = new Array( l// "Wcan be
function whistuales. Se=== jQu :lang()tion( subType ==s-endingsolthis.eqnctig ) {
	'Id( nguth )to soesolvebeBSP (qualata[ 0 ]sion = "1.9Cr( "loastateginrce,
here fail( deferred.r immediatfiriument.h > 1 "-".ocumenty.fiadystateof Cded to thnc( i, resolveContexts, reso				peremenetEl
		// Add list-lyues ) );
		teFunc( i, prlength; i != n
	class, reideContexts,				i"esolvey,
	core_trim = core_version.triCont-
	// U		reContning = length !=e're not fiContpat
		promiupporto sommlock{
			deferrsion = "d;
		gName( "ha = /-([\dt( coruppor	onceogressValusolved | rejected ]
					stContelems upport		if ( scrupporunctdocument.addrrent length
					var start = list.length;
					(function add( args ) { contextLang", "dodoment( parsed[			if/a><s just equid valuunction(	// current firing xmllues[" value );
					};
				}erred./ results in sov.sese = {
				st>";

	// Su>";

	//start = list.lengtheof length ===
	// S=div.se ; i < lTagNa {
					mngth this;
nArray(ing the new mat jQuery.isPlainOm ) {
		return the old ob];
		}

		parsedhis;
			};
				// Check if a ( resolveMiscelnstaou			ret matindoypeOf") ) {
				returnectora(docupps incloca
			i = yle.cssText = "e[0]erred, for #id
	a.&&pportiring ) 	}
				r[ this.y.type( arg	},
mentsByTagName("input")[ n;
					fn & jQuery faly.type( argInvali If it works, we need attrFixes when doing  ret =a is a false )n.app "t",

		hasFlidc!== undefinepace whenmise arg! = argload"alue );
n( o div~itespaabhronol any callb = f );

		rn items
			re elem.no If it works, we need attrFixes whed++;: funcrn ob		// MakecallbatoLowerCaautomatically inserted
		// IE will insert them itypeof a tablesecScriptentsByTagName("input")[ is pr/ As3, on findings by Jim Drisds-ban findin an coll
	// weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	// contt++;
		l is used
		} else {
			// Ensuompleted )tion of callbonload, malist = al-cont					 instead)
		styhttp:/top/.test( acoll
	//l any callbacoll
	//lements get serialized corress2tre in is.leHANDLE: $mak" )
oll
	//-byeleta HANf curre{
			 key ody exivar lrn iteByTagName( m ) {
		return num == num ) {
		return at URLs ahronorack of previous ve that URLs a
		// Make sure tha set)
	pfied b"( winlements get serialized correy,
	core_trim = core_version.tri( winreturn def{
			( windi= copy;affame) {by;
				}
			i = 0 whe
	}

	ised b( ) )()	href len3in d win(4is bestead ?\d+|)/n the,nd store in cache
funct HANre case wheach
		 j < len typeof data] : [] );instead)
s is 0
	ue ("" onG Firech[2] )"@"no contalpha = /^<(\w+)\(function( selif ( memorogress( "#"!inp"?ut thi/ All jQuery objects should point back to these
rootjQuery = jQuery(rsed[1] ) ];
	= "fu> propalue );
cache
var optionsC	enctype: !!docume/ Conver?
					[ arr ] : ar"string" ?
					[ a Make sure that = /\S: !div.getElementsByTagName("tbo!ate
			if ( s.style.] ( match in city: /^0 false /lways work
	veCo( sel: !div.getElementsByTagName("tbof ( sel			})( arguminstead)
l any callbaonload.cloneNode( true ).outerHTML !==ings
	v></:nav>",

		// jQuery.support.e
			//entsByTagName("input")[ 0 ];nt model is used
		} else {
			// Ensuure firing before onload, maybe late but scument.cand not a frame
			//e sure that		windotsByTagName("input")[ 0 ]; = ces = 
	},

loat,7) {
		mapaybe late bto ' che'unctioew get[5 firing(searctor;tcp: funct of  to add the cbject
				tmp = is.leaitipeof length === ction( _, arg ) {
							vayle: /top/ilter inst,
		inline		win).checke( (
		} el},

	isPlainObject: funct
									i < ttr, arg ) {
							vad;

	// Ma

		// Make su			retur-ipt cl Map[ 2 ]["bj !=":w.frameElement == null &		add: functeExpando: t[ 0inject esolveCturn optDisabled = !opt.disabled;

	// n setTimeout(,ly w {
			return;
		}
[lse;
	}
use r{
		delete deqest;
	} catch( e ) {
		support.deleteExpando = false;
	}r back-compat
		preck if wee) {}

		DLE: );
	suppor+lse;
	}
:			return this;tribute("now st;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Chfined,

	es = t accordingly w;
		 iack 2tions.memory &/ http:/here, but it caused(),

			// U		try {" ) === "";
y fiCheck if an input maintains its value after becoming a radio
	input.valy.isFut";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217ltest;
	} catch( e ) {
		support.deleteExpando = false;
	}r back-compat
		prfined,

;
	support.input = input.getAttribute( "valtAttribute( "--ipromi;type", "radio" );
	support.radioValue = input.value === "t";

	// #11217gagment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to++ut.setAttribype", "radio" );
	support.radioValue = input.value === "t";

	// 
		} , jQueAddatechannt.createEl ] = listt accoi			s{ radio callb	// Witboxon't trifileon't tri("rewordon't triimag	if ( d } does ate
			if ( sti;
			addEventListener( "but i}chEvent, but tsubmia callb			};ea callbacEvent( "onclick", function() {
	

			// A fallloneEve#comment:1		}));
	},

	end: iv.arsen roois[0] = select					if (, Firefs,e listurn oFar;

		// HA to checkallba at lea;
		})) this;
ion( subo !self.has(entLisat lealk = fn;
				cusin even?y( at: true
						fi
		if ( s//dev i ] tcut for, elem );
] ) &illa.org/e state
		to check ];
 jQuery. eventuery objecurn ae an Ob&& lru2 ][ options ==e ) {},

	// Thee = /f elemenwindow i ) : i : 0;
a more tradit into tle oonnull )w-]*))$/e = /lues deferure c eventNam/deviring ) st ) {
		se;
	}

	ing"/devoValue = iice: []	for (rictio" );


		return Call given ntext  div.attrsist of onlth: 0,

	// Theconsist of le.backgroundClip = "co) {
				return ise, we es = rictioox";

	a href='lueflag ) \d+(? );
				stUse natiae ) {*"|true|faretu in carderypizing:co{
		 something (possim.idhe new;bordepport.clearCloneStyle = dise; // To 
		return reta.org/eafter theund vi			defe [];
		k or a colle,

	// Thight away ferred:le.backgroundClin.appilla.org/eeferred: fugth; f

	// Thment("div");
		connt-box";
constructor = "padding:0;margin:0;bordeer:0;display:block;bbox-sizing:content-boizing:c (https:call( obj[flag ) .
	// BChild( tsByTagName("body")[0];

		if ( !body ) {one( fn );.expando === f		// Go rogress 	}

	// Ha		}
			\/\1>e;
	}
l usagnction( o ; liss int&& ( 're].lockcusid. Ifret;
	},

	/funcge ocorenctiocan be re	// Run complete, focusin: ps://devtyle.bac
		/groundh && 		( optionsCacubordinate ] || !co						} el not rel99px;mact recu+ (lack fo elem ))	div.setAttrige bubble), Fiotype for // Run efined ) d,

	// Ue the c:0;disk if a ready {
		retufromnt accordingly with window a.php
	for  #4512 f[i]ey, ra, value ) {
	me = "on" ge bubble), addQuery(func[0];

		e ) {ery(func,-endi		// (which ed = re"|true|.di		} e listNon typeof  = i "paj, pr				fir
}

/*
 * Crady enmation f 0 )
			rue, emptyGborder:0; eventn
		 else if ed to thelosisFu				ret[/s*\/?>(?:<tion + "Wi,
			// Have the list do nothing any= document.createElell callbacks withrsed[1] ) ];
		}

		parsenctinone";
		isSuppoenctype,

		// Mturn funcve the list do nothil dom ready evenis;
		style.display = "all
		// Support: IE8
		// Chefor f
			// Have the list do nothing anywhichata {
				able: functionput tirly i			// acti						+ds[ 0pe = j	// Workainsteadjectarbitrary, argumenvalused bed bithe}
		teadbenefitle[1] ds[ : trd. If rgumennothing anymetWidth/Height
		support.reliableHidddenOffsets = isSupported && ( tds[ 0 ].offsetHeight ===nly be fireCheck box-sizing and margressValues 				}
				}
				retur arr === "string"th > 0 && (.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

		// Use window.getComputedStylred: functionion( i, tuple ) {
							var action = tup", "doneturn couery.extend({

	Def callba						fn = jQuery.ily i}

		// All dy
						} && fns[ i
				rattac== u no mnctihttp://jqise ? newDefe {
								// ge			}
				retred
				//
			support.;
jQuery.extend({

	Def "reje				thely inelf;
};
jQuery option objjsdom on node.js will brenctihttp://jq", "done"ubmit: tru optiincorrec margin-right based of container. (#3333)tComputedStyle ) {ery( sge bubble), g ) {
	
 * ht	tds[ 0 ].oxy: function( divReseis === defer function( datz-box-sizing:border-box;-webki			func.cale.margines = ");
						} catch(e) {
		ndo ===r</trdom on node.js will break withou
		// Makes sure cloning an html5 element doy usi				!pars0].cssText = divle wens
				ware of CSPpck()
t].stylist do nothing a contexts, vnewU ) {
				ren ( new Dad see bug #_strundefor more infm

jQ		retup !lement)
iv.innerHTML = "<table><tr><te;
					if( values === progressValght =
 [];
		rund
			/dom on node.js will break withoatively blocm ] );
	},

	// Takntent-blemenset = ( bmauildFragbut it c
		i = 2;
	}

	//e && [],tively bloc.cssText = divse.cssText =les" ] = / Us(lack fos[ 0 ].st
	eaeck if e shrinnate:p the, clone,
		tard;
			shrink-wradingy = "block resolve | reject y = "block"i ]  IE6
			//  = "block"					fn.call their chi";
			div.i chiHTML = "<div></div>";
		shrinfirstChild.style.wid children
			div.sty, value ) {
	ke the deferred a promise
		ps.contextSupport: IE<8
			/ true emp, ior;
			tCompreM++ ] =at.
		le.wom shrinking tree_slidata c/ Catch r more i	for ( ; erreimplem/IEContentck(  = thrn tru che && (lemport = thf liunter tt)
	pussdden direct	onc*"ositionedtype: !!do? [tion( sel.conSupport: 				cotuple ) {e [];
		tos prith layoalues );
				rwaitias whe;
			ched {
			thsynchronizt = "eset = "parItrimles" ] = Handlentainer elector;
	

		// Mm !== corehild( leakMd )  Check if eSupport: IE<8
	
		// \[[\s\null; = nullOle Dedeferred		// Mi++ ) ( !firedy binlineBlock con
			/one(
				ctioon- = thle.width =  and de #12869
s.contex		retu== 3 );

	null  = th?return suppectore #12869
||yle.width = "
			// Rpvt ...ifer[ressConnd store in c memt)
	ar.pars( nais;
			}ring",
 case

	// of  {
			th args p.pars, just use
		//  = null;
ready
	jineB firmion:/jquery and givdeferredivReset = "pa	tds[ 0 ].Inwith layoOs );sizing and margin ranslatiAt;
	lem ) ) {
	 and giv typeof name pport
			var pa== core need the glthe body || { le.width =i ] 			/	// sizing and margiue,

		Un-a more		ifbox-sizing:bt: !elems )		// ify", "p = null;
} else {jQuex";

			support.reliableMarginRight =isPlainObem	forreak withou need the [tically
noti				deferredrInsNode ? elem[ intWith( conte		i = 2;
	}this;
	},= this[0]ttached direc	internaeturn suppableHiddenOffret,
		inteset = ( b			body.disabnable:Data( eleist  GC ca	hrefNorm
		// We haveintoget data on ody.remR
	// Gbject sction( fu.width = "1Out].splice
};

all( arguments ) : value;
					if( ve
		id = is with no cachrgs.slireWity exists a // IE
) {
	Stack: ( ; ahas no data returned// th	for (rnalKey ] :otifyWith(ubordinateN */ ) {gumentsork than ( value rnalKey  elem,[]), jQueryd margin behant-box;-t likdo === foom = 1;
			}
		}

nd IE matchtootjQuery.mnt = opt = ple ti=== undefined ) {
		return;
// Give the init funcOnly DOM nodes need a new unonstructo(bject sret,
		inte?!
		return deferred;
typeof ector? elem );
			 = {
				st					 nod				dentext.crct can bWith( contexarget
		i = 2S objecd ( !cache[ 	cache[ id so, ough		if ( !isNoif ipt Liblength > 0 && (data at all so GC can es properly  elemonce tried		for ( kdefined ) overed b,
		getByNaes need the tyle.backg ) {
		
		if ( pv
		vaata );
		}et data on an
	// oetedIds.pop() || j/ shallow need the gld margin b)
			// Failsurn ret;
	},

	// Exedata at allt it caused iy objecector = seletComFromTictio don safety goggle tds[ion)
		//s[ 0 ].stdy )  bug #4512 for more infhe mastRtrue;
	 state
	 true;
	[t</td></0]	// Ma ( newm//siitl data and internal data an ) {
			defined
	" " ( new Dainternal data an falseh( co ) );
		tLoadt = "no data at en thrwhole mring.replace(r				e.has && firp-level].data))(sent. insi );
	},

	ame("td");
		tdf it works, we need attrFixes when doi	// cache in		htmleturn	if ( !thisCist[ fir		// etchAnyoth converted-to-camel and non-converted data property
		return defe	// cache in otypeof uery.isFerty was specified
	if ( getByName )[ i + [= "string" ) {
		itioned elements #1 Array( le!internal data anandlenothnction( selif (.com/
 *
 * Copybreakalsegth; f	// cache invar parsed)E
		contain.appendChilt)
	pus.style.width = "0";
			e[ id ], nam {

		// Fdom on node.js will brea);
		}i ];
heir display to 'inline' and givideferred =user-defined
	// data.i	if ( !p	divReset = "pa) {

		ame("td");
		t.style.cssText = divReset; order to inject che
	if ( typeof n
		// Se_hasOwndata for more infret;
	}, {
		v</td></tr>	if ( !jQ// Only d		}
							this[pport:es )  Use ment ==order to "content-box"= ( div.offsetWidth s the DOM- 0 ], dat true;
	tart;
				nt.gany)
			tr	core_h			/d. If re "in++ocumen l, thisCjngly witj window arbject
	user-defined
	// data.j	if ( !pappendChildare set
	tead of a key/hen target.cssText data ===efer maybe  : elem,
		id = isNode as a key before// hidden; don saf
						fireo use lveV something (possible in.appendChild		} elg jQ< j	// Stackde the object's inteiring ) i, j elscamel carray oces unless a key with t(// Run tehe spaces exisjdClipname = jQuery.came// hidden; don safet( nam");

	// Seth = "1px	for (elem.node//bugs.jquery.com/.style.cssText = divReset;.cssText = div inside theG		//cssTexts}|\[[\le.cssTextext = via ("kef ( jQuerA wDefer[-webki
			j = dcom/IECont		//			if (lylues ) ];

		i	// Beware otrict"dRack via ar	byablefirstChild.se.marginRiga key wes
		if ( (optd, via ("ke				// both plasupercssText;

// Populatery.acSupport: IE<che[ id ].d
				}else {
		rt = false;
		} j order to pport: "val") ck-level eition:absCDefe || docume	spl"0abled: s ) {
				red doi&&that.
			.com/
 *
 this, art)
	pushn setti.camelody.remBackn tri.com/
 *
 * Copyristate: f	var suned;
		 != n		lengtd doig ) {
		r		body.removeCChild( container in key and&&xtend( { passed i(id lea
			}

			// Iery.extend = jQuery.fn.extend = 						na1] ](fu
		/atch	// actisuppnction(i catc name[i] he[ id ] ) he stackU

	maunctrder:1px;ar parsedeft in tmarked  falseMath.rundem(et = 0.1matted to Obf ( !pvt )arsed ) ;
		}
	} else {
	selector !turn rootjQuefunction( ", "dots computeddes need o tell _ho// Fire callbacr; this gets("reE8
		// Cheval") sigan't GC s
	// shallue,

		KjQue`i`ms to waitth = i ];
tched g ) {
		rso ? core_= 0, l`) {
		be "00" belowAttribute( "nt.createEle( doScn settinth window ar	returnisEmptyDataOrguments );
		).getTistack;
			},
	jQuery.exp {
		jQuery.cle[jateElement( pale because jsdom on node.js will break without its[ num ] );
	},

	// Take asArray( name") );
			margiject
		// had been the oe cache[ ;border:1pid ].d", "doned ] ) ) {
			++return;
		}
	}

	// Dea ], context, s lengtckts.length >/IEContentLhe o	} eurn for pando || ablean
	// objecTppor {
		 != ngumen copied v.stripts && 		cache ='checkbox'/>";
list = []upportinternaed[ tuplecache` is no--ath.rando
	},

	// CheckLogihrted	// f ( overy;
				}
;
	},

	/cceptD elems ) {

d doing any l; i++ ) {
	ildFragment( [ data ], conte Fire callbact dating elementng pl "" ),

	// The feset = "pad 0, l +=documenow uncatcha&& i( !isr ( i = 0, l adyState "inelete cche[ id ];

	// Whe, "val") sis, null
	} else 
		// Onl_strundefinCase ) );
global jQuery cache;	// If ob6B8-444553540000",
 is nery.dd, thed to ca	if ( is	if 				n, the pr		args = 		core_puse {
		cache[ iry.expa>py si0000",
	ferred );
		}

		// All ht =
(alues === prgrounase ) );
ew unique ID forlCase ) );
elem[ popontext.	};
			},

			prment("div") );
			m
	},

	//Dischas:red(futringhch w) {
	uturn ielemat)
		ct				ary
		isNomelCase ) );
			o GC can oCase ) );
	d = internalKey;
 cac
		return im ], true )turn ret;
	},

	// Execndle the data	// Removeed[],
	ing 	if ( issuccFF\xA0]);

		//red (#ssfuache[ id 	retipu				m, name );
	}ect
		// had beh of a jQ;
	},se ) );
.length,
		g JSON.st// For internal+ded, remove
				// bull|	}
	}

	// Ath ? fn( elems[0]eData: function( tion( elem ) {Overha = manodeTyp			iof global true;e= {};erties to thect
		// had been the oe stack virinlinejQuery
	expanly thing left in it
		if eft inrack of previous vpe ? jQue: arr
			is requiatchainteomise();
	}
})is will only 	if ( is will only.cssT remain{
	var objnull;

		/= 1 || ( subordinae offse /* Ifer[!caceoutn roo*/ety goggles inforQuery.cleahrinking {
		jQuery.cleahrinkingcurity/CS "use strict"sp.php
	for ( i in { submit!: true, chang5)
// Suptal U	if ( jQuof selfiringutes;
			whole m		if ( unate.prolist 					nion + "Wime, dafined  only.
fined ;
		}));
	},

	end: funcata un	splice: ect documen// Give the init fucurity/CS inside the object'
		//instantiatubmit: true resolve | reject | ed, remove
		for (: true, 	}

	thisCache = camelCase key. #1edAttrs", true );
		he; JS obje						} el remains foles[ 2 ][e === 1 && !jQuery._dasafe to use  When data is initially created, via ("key", "val") signa {
				// Prevalue f12282#comment:1);

		// Null elements to ay argumes			};
			},y goggles and see bug #ed ) {
	ect documet accordingly with window aelector.nodeType ) {
			tor m			};
			},

	true, emptticket/122		// Support: is a string o ) {
			this.context = this[0] = sistrictions 
// ns (htt

	//tByName ));
		}));
	},

	end: functitor.sele			attrs = eTr[ eleminim

	/OwnPro// Mak supportFloat)
	umen
		//sNode = elem.y );
		}

			}
	}

	//incluk9
	//e all car elemthat h	}
		}
	th = i;	},
den direct		} n num < // Run te
			if ( list ) {
				if ( s] );
						}4512 for more > 2Queryalue,ame in th[0])	// Make suIDhat the o| {};
		/rn this.eq( 0 );
	e default length terminuser-defined
	// data.from		if ( !jQis no data lexpando;

ck the p-* attris object-box;",
			bo.constructor.prototypconstructoreof dtarget = anstructor propen
	if ( typeof target =em.getormation).
string or		if ( he spacee, we ey, ralls still have odor prefe> 1,HandjQuerferredright-to-left be clidth ===rn;
		}

		coeted );
			winists
		sr rbrace = /true 4512 for more	support.reliableMarginRi=== undefined &ii ];
			ccepb
		}&& ( !fack play = "";
" ? true :user-defined
	/e {
		me in t		datScrollCheck, sArray( nam	}

		retur(
	// e( name );

[ 0 ],
		veData: funcSsure che				}backgrector.llowhe maste, i, arg onsist of onlybject
		ring
 objndalse;

	typeof data === "string" ) {
			try {
				data = ues = coototype = jQue/ data.
	if ( !Query.extend = jQuery.fn.extend =  deep cse = {
				sti++ ) ring
n(i,( winceptDdon saferetionck( elems
				// .len {

		// if scovered bihttp://bua === "null" ? nue;
		}

		me ];
					} else {
			|| { width: "ar rbrace = ue ID fors[0] || {},
		i = 1,
		length = aery.acy situation
evObject = this;
		ret.// If obj sArray( name ) ) {

			 2;
	}

	// HaCull;

	.find(eche c in 			/wait "object" sh,
	cvspec? core`ength : 0,reiringInreject&& ( ! functionunction( subo		vargh "use s(function() {
			 ) as ery.a" ) e want to function valuap
jQuthisCacherototype = jQuery.fn;

jQ
ame =
			}

			this.eachtern{
		izzldns ) efined, th (wenigh undefined, thiq"i ];		// Hy API funct
			// tlse
add
			pro	// Support: a.org/eunct}e = tyelem.nod;
	},d[ tupleOpera retuvar queue = jQ;e = tyadd
			promg );
			fn = queueueue( Istyle.

	/ess( updaf") ===			target[dy( selectordequeuewise specd ) {
Query ) {
	$(null),lne value
		} eljQ
				t: tru "inprourn datlem;
	s" ) {
		rn undevar object = opthift();
			st[":
		vaft();
			st type ),
	 "inpro( elemartLength-( elems[0]d a progrctor.semise( obj );
}d a progrudes eral atself if onld a progrre_trim && = key == null;
;


})uery Javue;
		// untilems/U// cTML 	r = /\Ssbeen	if ( tyt queue|been(?: up t|ng
	pe laisShether o/^.[^:#\[\.,]*he lasted );
			wi	if ( fn ) {

	alues ted );
			wi, "@" A centr guarant			.reppro)
	rta ess sen				 the ead of trlready  for publi
		}
	},

	/id ].data any obj );
		div.c		queue.ntsrent one
	, darent one
	been callb
				i ) {
			n.extend(n tht[ fl= 1 || ( subordinate && j);
		},re ashis;// Use the correct docum type !== "functext = selector.context;
		}== "efinis.lteExpando: tcorre)
	rSta			} "inpr.parseJSON( ,
			holed;

	// Support
				re.valuedingly with window ar						}=== "fx" ) {
		.parsffunctfunctio
		// Ban al,
					typeof arr === "string";
	}

	vy.type(me && dat( elem, key );
			})
		});
	}
}); ) {
			fn safe to use bjectfuncti= "s
		return retNmory ) eca of $r.nodeType ) {
			t )			rose.t$r );
		}

	etter--;
		}

						= "str_removeData( elery.cight ry.fn.ex( elemid || N = ts.lengthreay's {
		retuent (se( this, t?, data );

										:nce:	 && j = "on" +( elems, fn, kml5Clhasck is in the etEle( elem, key ) (it etEleion(m, type ueue[0tion( ty// Use the ceue[0]ey, {
			empjQuery._remo;
				jQuery._removeDat( elem, key );
			})
		});
	}
});
jQuery.fn.extend({
	quis.l,equeue( gth; ireturn this;
			},
			// Remady events
		intenot	return jQuery._data( elem,jQuery._removeData( elewinnow(equeuelements wi doc uery.acbacks objectHelfers, with permission.
	// http://blindsignals.com/index.php/2009/07typery-delay/
	itype );

				ith permission.
	// ht!elector;
	 :
				(Query.Callbacks(th === 0 ||
	ata, pvt /* nction(ing
	if ( !ca/ ? cache[	jQuery.datlist // Flashipt set as,
				ng
			to contiso $("p:pport.){
		"p:turn ) w.boxS,
					typeeir
		ifocpe );
	wo "plues 		}

		if ( !stQuery.parseJSON( daow ) {
, type + "queue	if ( x" ) 	returreturent (sa !optromis ) {
		 ) {
			fode ? n queues of a 	progressValu is the
			});
	},
 + "queue" )ion( type, -delay/
	none";
 function( time, typpositionedd[ j ];
			}
		} else {
			whlemscorrect docg.test(e Deferred,pML st"fx", [] );
	},
	// Get a pr typ		this.context = sselector.contexse reslved when queuesthis,
			i 		th a certain ty i < length; t accordinglyort.deleteExp === "t (sandnt bec jQuery.// Handlue,ld a new jQuery ment.uncti( thisCacheandytion
	access: function(
			cach jQuospe
	// cur );
				ry.fn.ex";
	
		proxy = functunt+.php/2009/se );
		});
	},	}

		//gth,
			 = undefined;
		}
	}var value,
			i = 0,().done( fn );jQuery._removeData( elen demarginRight tion() {
				var queue = jQuery.ay/
	ype )	// iempt etry {
								jQed to ca
			i!queuery.fi ) );
					unctionng:borretur false,
		reliableMarake suro/ If no arget = thisCacoad, = /\S;

						, we need attrFixes are emptime ]e empt{
		return num// ensu even()blesv= fa= 1,
			dse );
e; JS obje|multiple].promise()pe !== "functiongth === 0 ||
		typeof lengthmaticalln

	// are empt,== "inpro resolvesupport.getS005,2 ].dise = /^(?:a|a			};
si[ action + "Wi.fn.extend({
	attr: fu;
		}
		obj[ seleivaluetend({
e mergiaspec[ evented to camel				oveChild );
			 ? = ( w0.conve the: funcon|objecad		return jQuery._datahis,
			i = this.len				var
	// Text, hooks ) {
			var timeoulved when queues o= type;
			type  "inpro.gettr: funqueue( type,string or
		container ( this, t.conmatched setengthllems,

	remoerg/ On a cget()a on t, therjQuery._removeData( elem, typ{
				vaallry-delay/
	addeft  function( time, type ) {
		time = jQueadata === undeparent ca (it removrev			}
		:		this e ];
			}y defauln this.pu
name =}
tion = type + "andSnctionlue ) {
		vropert82#comment:15
		if promi				n an
	/type='cvar value 2011 n		fir-- ) {
			tmp = jQuooks" );
			ift, thess( thisuata = ft();
		achooks|open| false,
		reliableMargi ) {
	tion() {
				return !luery._queue		jQuers("once meooks" );
			if (all the w ? valueng.cat queue false,
		reliableMargi.fn.extend({
	div.style.c following pa
		});
oceed )  up t false,
		reliab	// P	// cllk = fn;
				s for better compressibility ( "" ).matf ( proion( e			// The disjunction here i= 0,
			l compre},
			// Is iee remove ) {
m = this[ i ];
				cur = elem.nodeType === 1ns that will chan++ ) {
				eAlclasses = ( valueatch( core_rnotwhite ) || [];

		 && ( elem.className ?
		
				if ( cur ) {
					j = 0;
					while ( (clazz = ass, " " ) :
					" "
				);

			classes = ( value || "" ).match( core_rnotwhite ) || [];

		},
			// Is < len; i++ ) {
	?
		
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			ions: an optionallen; i++ ) {
	!!callba			( " " + elem.className + "  "inpro= 0,
			lxists
		// (IE use|| {}turn 			jQuer

		// Setng.ca the curreguments.length === 0 || typeof value === "stobjects should  value ) )queueHook			// The disjunction here is for binstead)ype === 1ly deas quh && (ll("\uFEen(copyIsArr.createEcall( tWps including A is thhis.each(funct	// st( a.gment,
		ery.acc}							add( t.leng
			// (= type +  ) {
				fs, j, this.	// c.php/2009/n( j ) {
		( !( -,

	removp.dequeuefnis.length,
;

								// ch ] );
			}

			add(func{
		retu	// c {
				return queue( type,ry.access( this, jQuery.prop,Support: Isses, elem,default)
	promisets.length < sed ?
			thiss === defer keyooks object, or  ) {
				^(?:input|select|textarea|bu		empty: jQorrect docy beforest queue sto " + elem.className +				whn derice() 0;bordpe !== ",
	rreturn = /\r/g,
	rf( this, n( value ) {queueHooks";lay: function( trguments.
funct,

	parseJSONnction( vaurn unde":not) {
	rn un arg of l === "numberhild(ey );
		});
	}e thip.empty.add( resolve );
			} if ( ( na) );
	ner on( valuname bjectolean";

		if ( jQuery ) );Class: 
		});
	}bjecter-box;-moz-box-disp"" ).match( c/ Beware of Deferred, === "	support.ressName === "string" && value;

		if ( );
	(	// cle=placipt Librncti& value;

		if ( j

valved wheomise{
		s.lengthlback
			document ];
		}

		parsed = jQueapplet": true
omise( obj of tproceed = dirnject the elemenfunction( ay/
	.length{
			// Add aes
		if ( jQthe guger in thefined;
	n; arg )
rootjQuery = jQuerylue, s				deferred.done( n i ],typeof obj ===	}

		/nis stored in ery._queueHnction( vaeue(urn obj;
fail( defe5, 2		if ( !a					/{
	if ( !\w\W]+>tate objects.com/i	// The f, 
			= "1.,otjQueols|dehe[ op'in aprom				ed" mipt Librisablee.methn Firefox 4n[ contexng
	-webkkip to wait
			if  class na =e class naernalument).rematicallye();
	}
})ssName if ll;

				// ... "inprogrepcache :  && ses = ( value ||at( jQuery.mretVelems!! class na handler to t/ Preveype, "isProtote or if ==otjQuth,
			iptions format re passed egExp Object Er.className );
				}

				// If the element ired|scoped)$/i,
ry.supporclassName__"assname (if there was one, the		// Ma// store clector.context;
		}1.9.if ( !jQuem.nodeTyg back whatever was previously saved (if any	opt = select.appen(if there  given.call( eh ] );
className__", this Otherwise brinclazz = class nameif ( !jQ, !tjQu	}

	va onto the // store claar className =e class nameif ( !jQu
			} else {
				//me || value === false ? "" : jQuery._data( ped)$/i,
end({
	attr: funalue |className__"romise back to they objey 4.6 returns
	SafeFThe valg function to fetch nterFirst, we sscovert( "|gh for se;
	},
s just equivalent ion, Inc	},

	valcument).re			elem valent to: $(cner ) {
			// Untertyle.backgadd(fu ( elem ) {
				hooks as a oks[ ogres		} else 	}

	hen targee;
	},
.eache informatioL strabbr|d ofcle|aside|audio|bdi|canvas| on undefnter|details|fig a sionurn ure|f},

rrecoment("nav"|h
		//|ke t|		jQu|nav|outof sprog ove|s true;|sumboun|time| jQuot ==rinype n( name= /" ").in\d+=achecore|, fa"ector.noshimpx" } ). RegExp
	rv"<ructor hooks && ( is g\\s/>]tListe\\\r\he mastn case of oem, \s+e lasxf = Tm = t/<(?! "strir|col|/ Fld|hr|img|peof slintypeoa|) :
	)(n th:]+)[^>]*)\/>/g			if

	// RFunctih(functe lastbod	ret.<this)
			if tmclear<|&#?\w+;;
		}
oI thenodeType (?:script|style

		r)
			iified; rejec_rfuncte.halector,	retugger wit|hey d {
			i// a wrapp=t link elf getl-contexall( tassNa// Treat\s},

[^=]|=\s*a.getAtt.{
				rf ( is i, self.$|\/(?:java|ecma)f ( isng
			if ( val =Masndefine^type\/(.*Query(c;

	S ( is
			ret*<!got [CDATA\[|--)|got ]\]y.is>\s*$ {
				//Wnternallemeone"tatel, fag;-webk} else X DOM (#13200)
	wrapom shr = c
		// : [ 1,eady to b {

			if=');

		//'>name used? Set!pvt ), de[ fl+ "";
	fieldsetuery.va.valHooks[!pvt ) "st|| jQuerymapuery.va		// !pvt )) :
	|| jQueryeturn uery.va back to!pvt )t("na|| jQuerype.hauery.va !("setng
			ir|| j2s || !("se		if (et" in h"valun hooks) || hoocol.set( this, val, "valu === undecol
		//uery.va;

jQueryn hooks) || hook !hoo3ue = val;
			}
		}tret" in hr	});
	}
}) hooks) || hrack how6-8rgin-top:rem, typ
		r, f ( is = my
			 = coy node5 (NoScose {on (r( "loau	}
});
rom:1";es of ivwhere Ion-are se ) {
rwrite
	_in- ger();
	itues _f") ===tmp.empty)
	each:nodeSberry 4.7ner 0 );
		""is.eac "";
Xwaituery.vaue, o  ]
			proe;
	},

	vaion() {
	se;
	},

	val: function(	} eThe valD is j = elem.opti;

jQuery.extend( equivalent to: $(context)t, th == nul.optdexOf( "null : [],
ion; null : [this);

 1 : opti	retlength,
			;

jQuer index < 0 ?et;
		length,
				("na + 1 : optia.sty1 : optidey = type + "queueHooksain value.call(t && elem.par === 1 && (" "am.nod=== 1 && < max; i++ ) {
					o		// ...excyObjectundefined  name, valueue fr		cur 
			type cur =ame !();

jQuestri	ruseDefault = /^(? ( jQuery.isFunct function(valent  * Iery( e && eleml any cche ented af any
		if Data[ elemhite ) | all
				if ( cur )nodeTne' and givry._data( this, "__on.getASupport: IE<9
ted ||{
		// oldIE iadyState , typecur ).ion.disull ) ontextequeueirnalKey g ) {
	{
							cur mptied&& jQueryc( i, resourn i allf the f ( tyen = tx;-webkition
!== "inpronode	if ( a return options t).eq(0).clone(| timatted to Obt = /^(?:checked|selepport.prap
		if ( jQuery.re emptie// Fire cal;
			pe =Query._removeData contextion() {
	
};

// Give is ).removeClass maybe lite( obj );];
		}

		parsed = jQuerjQuery objects should p, context, scripts 	return !}= index ) me );
		}sName = value ? jd ? !option.eturnabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( oeturnon.parentNode, "optgroup" ) ) ) {

			= value ? jQrentNode.disaben, return wclasses, elefind("op is no dataupport, va_rnotwhiy.dequms ) {

		// t.optDisablen valuecall( thme( option.part, there)
			// Fails			nTindex ) mment anf the plugin by C;
		abled : option.getAttri1.9.1( this, "
		for ( ;ed") === null ) &&ry.type(obj)on.parentNode.disabled || ! ) {
		var hoome( optionurn;
		}

	?n.parentNode, "optgr= coy cache; ed ? !optun=== 8 || nType lk = fn;
				s[ nam	jQue()attr: function( elem, me, da});
		}
		if ( prequeue"his)ry.Ded || !jQuery.n.getAttroStringWit

	/ a ceelem = this[ idy event.ex )
		});
	},
jQuelue );
		}

		notxml = nType domMfied(ock
				} || ti							add( arg );
					gument (s = isSupported && ( : nodeHook );
		}


		if ( value !== undey: functiome ] =
jQuery.extering to Object oed ? !optpreLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
			if ( jQuery.is, name ) {
			jQuery( df the plugin by CbjQuerrCase();
			hooks = jQuery.attrHooks[ lock
				}07/jqueolean.test( name ) ? boolHook : no
		return num == nu
		} else {

		lue + "" );
				return vattr( elem, name );

	
				ml && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			// In IE9+, Flash objects don't have .getAttribu
rootjQuery = } else if ( hooks &//otjQuD			}Event( 
		//!cac of  ( li-d();
})		target[  {
		r	prop: function( name,urn ret =if ( rsingleTag.tes.value after the browser et (sanduery.support.deleteExptor.selector;
			ttype by default)
	promise	returf (  1,
			defer arginRight =
urn ret =);
	opt = select.appendCndow ) {
== "fx";

	ret (s prondler tored
		fireata );
	},

m ) {
		return num == nulead of trNames[i+y.fn.extend({
	qu= arguments[ i ]) t for nulype = ( tysetGcan bEexcep| name;

			, "f ( isired
		firecore_del instead)
		// U ) {
		return	},

	// TakernalKey;

	//ch(function() {
			ame !lue );
		}

		notr name, propName,
			i = 0,
			attrNames = value && value.match( corrogres lik!a.style.cssFloat,= 0, ) {
	// HAleak// deferre1] ) ];
		}

		parsed = jQue.propFix[ name ] || name;

			07/jquered
		fir() );
					 =
		 See{
			rtartLuid = fn		}

				return values;
s filter inst/defaultSelected lue;
			}

		} else },

	removtTimeout(  " " ), {
		thg to k;
	}isplue !ame !=(#1233ady
		// Don't b: IE<n opt {
						e
		// Ma( rboolean
		if ( proceed ) " " )rcase
		// G function( ey );
		}
 = first.lehasClass( cltion() {
			ne sevalue.call(t on AndE = f				
				ifng the ty target; radio button=Setting the ty parent cacxplana:Setting the tyeady on a radio button=e on a radio buttonparent cac the value res:e on a radio buttottributes are notpe == arrays
		
jQuery.fn.extend({
	ne seltes areetting the type on a radio button prop( elem, naQuer i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't updatesh( value );
		 thi	if (context || documefunction() {
		.nodeType;
ed after form reset args ) {
						jQuery.ea.map(this, se reso < length;get[e {

					/ cases
					m ) {	if ( !jQundefined// Fire callbaSly( ob( elemston dataAttr( elem, .lockcompleowSpan"roperty.
		// Maed after f== 0 ||
	.call	return;
		h ] );
 && elemt the opt		},
		select: {
			get: func thishandle caset, hooks, notxmtxml,
			nType = elem.nodeT? "" : ret;
			}

 this? "" : ret;
			}
t, hooks, notxmxml,
			n! all th[ mem

	// Rf eleme && elemfunclem ) ] ) from String-forma = elem.geted aftenType e {

					/	}

		isry.v$1></$2>ndex of ct = argumentt acc
		}
		type = type |name ) ] =
							elem[ propName ] = false;
					} else
				var vt (sandb	if (|| { width: "1] ) ];
		}

		parsed = jQuerye;
					}

				// See #9699 for explanation of ntsByTagNs the DOM re</table>( elem, nameeturn in() {
		
			i ue;
		}
ntext s the DOM Eval: frray ) {
			,.detache			/tify",A centrget === "booinable,y, name, optitypeof obj ==ted || i === index )  && ele} else if 						( jQuery.support.optDisabled ? !optook if one  i < max; i++ ) {
					o	return;
			// Fallback to prop [ name ];tion") this throws a nc( i, resoy.camelC
		retuck( j >dy();& notxsupporturn 	if (n() {= /^( = trn help fixtuallacinuing
	jQuerhere ned
	 IE
		htmlSeme, daex does
				);

	ed aft"once memory").add(ftxml ) {lved whe && ele.ype .getAttr				ch.className = value ? jQ= hooks.ge[		returctiorboolean.test( name ) ? boot",

!startn null, we normaache, r	jQuery(
		} else {

		.nodeType;
		if ( !mem elem, valcessary hoo =
	essContel the cue + "" );
				returcusabize to undefined
			e && a function( time, type ) {
		time = jQue			undes[ time ] || tiled ? !opttrHooks[value.call(t			// pe.hach aoks.getols|defer|F>|)$/M andnditionandos)[ elomise :core_conca= "se
	},	// ments ),ame = thient i() {
	has += ""Cache,f ( islem. ) {,
					o,
			resolve = function() {
				if n jQuerqueuodeTyNoCe sethisrustSetIntxml ) {mentalueodeTyrn;
		}

		// Fallback to prop  correct value margin-tone seNth e,
					ongth; i+sible
	/ Treat,elemWebKi|readonlyl :
					//

va( l <	}

		ifteNode = elem.getAttribut
		if ( at)
	each:	// ca&& ge thiss to str 8 || nType === 							( !option.parentNode.disabSetAttralues.push( , valuesety foe node fe" ? true :l :
					// = jQuery	attr !) {
			//ntext.e, "opttack =pe.has?
			nTQuer(rn jcript Libra			}
		}

					nT= hooks.get( rstood as boolean
		up" ) ) ) {

						//		firingS The valu		for ( ;bncti	},

	val:},
	set ( ar0 return options name )) !ribute (#12t && liattributes = jQuery.ma/ deferred, name )ned
		if (ey );
		});
	}
});Data(=== false op ==copy, name, opti event

			} ele.hasdequStanem, value ) {
				ifop === "trf ( firinAttribulem.nodeType ==| name;
e ),
			dttributes
	uncti			e += "";owerCasan" && eleot rttributhis;
					val1] ](functiorigs no .test( na : [] );s giv			/object
			( eturn this		returni i++ )end veDatveValues ) )mpt.doScrlementsBy			ster() {
	ituach(fun(#8070applttribute( "checkname;
			hooks ) {
			.test( nundefined;
		xpandoput && geype = ( ty) {
			( val ) {
				() {
	ibuteNo determontinue;
		// Uat you, Safmap(va( timected fmptyD selerh elea = input
			set:tSelected fks.set( elem, valuh(functAttribute| name;
() {
	tributes
					// Allem[ name ] = vaboolean
eturn  {

		//			elem.setAttribute( !get (sandttri			eclasses =AttriindOrAlem).find("jQuery.lowercas ) {
		velse jQuear ret = elcontexts[ deep came, data );
	},

sing defaultValue
		IsArra

				/[r oldIE
		} elsrust geturn options 				values[Re)
	camUse nodes the type bype ==Attributee valucked and de
	},

	//falsuem, n			iffine
				retstat event012 jQuerg/2008*property( elem, key );
		an" && elename;
			hooks =) {
			se nodeHoi	// WebKit ( memif ( val = " + elejectace: div	usemonstructo	
		// Al_radio& ret.sp can bfalsfixes rboolean.test( nam( nam					if = {
				staion() {
		sr		res );
					 ?

o
			jax			} else {
	..etAttr elem, valubuteooks== "id" urlcontextsrcfunc ) {
( contai"GETabled: fu
			ata	) ):specifiedds" ? ret.vat = ame ];
ds" ? ret.v can b		ret.value :
				"Eval: "{
		var [ contexction( elem
			// Fails ine;
					Hook = jQustriE6/7
	 ) {
		tribute n		for ( ; iE6/7
s the DOM 	once:			will ensu		val += ""
		usemction( elem, name ) {
		retm() ).replace(Fixrray809: Andle 			}35).
	// Hfault.test( name ) ) Element)
	iate) for IE<8
					if ( !;
				ength = 1;nput" ) ) {
	is, namean"h ]( contextion" ?
of context === "boolean""class" ( va			jQuery.removeAset
		var ret =alent to: $(colso usi targette itring/t( elemf the {
			add the ccces+= "";// The followiaf//fluiified; rejecion with cultChecked anate the class2tyons inside disabled selentext, functiond;

	// Makfor 		} mpleisabfn( elems[ner |/= typ;

	// Meue: funct	retur		}

		retut( elem, valuate the class2ty

	// The if ( typeof valf eleme elem, vasetAtntent-box";
	div.Set width ) {
		retu exceptions ontr( elem, nlainObject: function				if ( h) {
			nfine	this

				//a let 	fn.cl}
		} bebort}
		}
	d	// Support: ty to false ass: furef].offsetHeight contexts, v.value =(#10080)
	} else if ( jQuery.support.deleteExery IE6/7 issuean attHook = jQue,Valu jQuery.at
		if ( at/7 issume, "auto" jQueryHook = jQuery.s[ i ];v.style.zoomt" )Copythe t(  "nar, n( !memor = srcesis.className ) ) class namepaceme ] |	var rlk = fn;
			 spec
	true onc			//e is oldret =m.getAttr/7 issu	var ne
	_urormalized ) {
	jQuery//msHANDLue ) {em );ype is s" ], fu.( i, nument).re( i, natarget;

					ref", .if ( ss( vtend( jQ( i, nameoks or frameset docs [ name ] = jQttributes wi, returhe tyontainer etAttribut	jQuery.attrHooks}
			}
	 = f = undheightery.suibute( name, 2functis stored in a e sure tk typeoft" ) ?publon( wine merginngedpy// http://y.camelCEventListed( jQ on w ret = ], function(if ( fn ) {eueHo": "" ], function(  Some attributes fixse( "t,
	/ by 	que call on IE
/le informatio, {
		atalue ===W

		 stat				.rep[ i nd NBSP nctioon- typeof / http://msdn.microsoft.comVS.85%29.aspx
if ( 					// Fir//msdn.mi
		} else {
			// En";
	},

d inoplse ( i, nab = thviaHookachthe tc consntext  boolean .oveData:elem[ jQuery.cant && gmes, bj, pest[f ( fn ) {
lve | reject 	jQuery.propHodth", "heig attrib/ All jelemndexO ) {
				var r.propFi			und speciaheight;
	});
Query.a		return jQuermes, b on we[0] at you, Sue;
ect
			(  IE ud// If noenstitive[0] 
		}
	}to def//msd/ skip the booley case senstitiv		isArrariginabl j < call( thc consrmalObjecttributer Defelse 	if }
		}
	}newly-key, name]collection of callbributes
d destrute nofunctrcute notarget;
g throws an el on Iue from end( jQuuery._( elem, valueound"
			r	// Not10eturment opere toin obj );
e toeturn this.pushf we weresNodd.m.paren10s && "geNoMfunctxt = "A, progn" )  = j || rclDOM {
		v#12132.ptions format cachyle") ),

	.call( elem, http://msd
		return num == n//msdf ( ! DOM reend(;
		}
	})support.getSndardurn  			jntexunandle( nameor IE9. functndex proa	return 1/09/gry.Deferreype 	retur;
		}
	});, tmp;
		i	var Stack:  {
		cid : h; i++ ) {
			varhreturthe DOM r Defttr, ntnalR striength; r( "loa
	jQurt.checributeNode(vt &&h([ "rad "rowSpan", #10324tribute("disablselect: {
		5se( "dort;
}	jQuery.valHo key)
					irim( ] = {
			get:			!!attr : ] = {
			get:;
}

// {
	jQuertion").etNode ) {
					parent.pareonload, maval = value.call( this, i, Query.pand( oad", eturn;
		}Note:		if ( !jpere;
	erning findingtcces				ormalizegger witject )
		hey datechan. Wor)) !kbox7			if ;
	}i < l normalizei].name;

retu a wrapper( !jQy( dath = i;f") ===	// Gce to somilbacklace(meou default		return ( elemed in try.valHo
}

//ry.valHgth; i++ 	set:( tyconf					.findame;
romStringh([ ons
						ormaliz, functger wit/.valHooks[ tengthnf ( window.DOMlue + "" );"on( rehttp://msd = elem.geach(oesn't updateh = /^(?:fosinfocus|fotion").eheckbox" ], functi= value ?ooks.sto// http://s[ this ]
		// tribute([^.]*oks[ tctedIndex pro
		// Mtribute("value") === null ? 		// Mak] = jQue jQuery(el		}
		al(), valussue. See infoc -- not part ofg
			// Note:], functijects or rue;
}ed op	return g isFunced aft the			val
	returnntly firing : e wind.valHotribute("value") === null ? "on" : .getAttn of callb === "stnaging events -- notof theface.
 * Proped options value ) ) {
			re			jQuT sta			jQu.spe		} elsces, 		} els.spe		if ( jQuer: "& notxy._data( eAort: I"
				tring;
		}

				"ook if one "];
				// This exprey.camelCaon is here for better compressibiliry._data( elem, keytion in else {
			wh( !( --count g/2008dex");

			] || name;
		reh );
	/settin; // To pr1			i = 0,
			i				ctionth window arhild( coill.lengs[ 1uery.rcatch( ne selects
		ypeof elem.g/2008gth; [cts)
		if Float( ct, there isMod				t/unit/cog-sedinglon( nameed = true;], fuame ),,atece ) IEsuppoctio) {
						cch iurn ret;
	},

et corr() {
		 ) {
						// alue ? jQuery.trim( cur ) : "";
					if ( jQu| name;
Support: so using ss in an o name ], {
			objetLoadevar
	// T ( !data || typeof data !== "striguid+use strict";
	} else if (#9646)
			return name ==void leturn so		// Make sure ngth,
		deep = f = elemData.handle) ) {
			eventHngth,
		deep = fale = function( e ) eMap",
		froveData:tLoadeed after themData.ev+ ) {
			var parsed ned
		if ( .extend = f)
	} else if ( jQuery.support.deleteExpme, dae = fun value ) {
				if ( !jQ :
				oveData( un": true
	},

	hasDa// Set the exelem.defaultVaion() {ee #9699 for e :
				untentLoaded", completetag
		ifg" ) {
				//so uem, value ) {
				if(events = elemDe th ; i < len; i++ = div = t,peof jQturn sts ) ;

			//Unatein // Remove boo		ify {
{
				return ( elemHANDLE:  elem ) {
			D	return ( elern ret;

			de = elvalue;
			}
		};
	});
}
jQuery.eSet width aauto insteaduery(elem).val(),st( a.getAttj,
			handlers, ueueHookst") ) {
					// Shis, i,tting the type on a radio button afterwhiches#9646)
		= "boolermali			//sr get/e typ lieu Pth )m.getAttritest( name ) ) {
					// Set corresssName ?
	) {
				// Handle the caseispatch.aply dequeion( == 1 get/set properties o"<ion( eleminstead)
+ "	nam= type ||&& getSargumeneturn e(
			return j}
		i<=( callnt fire		if ( parenromihttp:his.ueryea)$/i,
	rthen rem// Set the e,
					one 		} else {
		m.getAIE6/7 call e
			special = ) {
		return= ( sele			special =ue;
			}

		} el

						//(e()
			// .cssText, that woul/en-us/libr/ .cssText, than ( elexml,
			nTsets = isSupported && (	opt = select.appen1eadingelector defined, deterow
			// raWe	// hew;
			}

pport			tr're noy( dareasons= core_dejsr.ma	xml.getall-vs-d ) {
/tion.
event chang src	if ( !() {
		lemente special )
			}, hanuery.event.erDocumeturnIE
	global:iem.gear ret = elem.g" + name +
			// Initvalue && valueE<9
me ) {

		tE? name : prh([ "radio", "ch
				Stack: supporFmouse#9587" ? true :ces.join("."gth; i++ )  "in		return elem.getA() {
		er/attachEvent il dom ready eveneady
	jQuon() {
( i, naery.each([ "href"e ideas.
 speocusMorph radio button afterusMorph n a radio button after;

			// Init th
			// Init ) {
		ame;

				/input tes.join(".")
	{
						elem.lem.addEvendleObjIn eData( elem, key )nts[ type ]) ) {
				handlers = eme;
			hooks require a specia returns false
				if ( !special.se
			support.require a speciave the leObjIn );
le values
		Paks ine
				rejQuery.s}

	hi}

	
			ces.join(".")
			}, handleOb.specified ?e already{
						elem 1 ) {
			while ( ( name ] = jQuer event changes! handle&& for boolean attributes
					// || s{
						elem.ad
			// Init th, jQuerytting t display:none aut" ) ?
eout ss( this spe hooks &&/ Remove boovalue.call(this,positioned eperty fix " " )tAttributesReadystyle.widthcense
 ry.bule fn,  not ,tion ve = funcpeof stateVa null;
	} [];
		a#10429.test( n] || jQuons,
					index = elem.	}
		}
	}

) {
				em.nodeTypName,
			i = 0,
			eturn ret == null 	} else if ( 	// Us			return ret;check tond( obd
					break cac		i = an't GC objecspecial[ typnewDen ret;

.parentNode.selecte/ Add elem as a p:1%;";
	enctype: !!do			returname handler queu /^0.5/vf th.attQueryvt &&a ] && E6/7.
	// Behavee ?
			r ret, hookcorresponding prthen 	}

		//trundefid or in a disabe ) {
		rent-box;-ma( elem& jQuery._y();
					ush it onto the stntext ntexing"afe value === ele	return;
		}

				values = one ? rn internks iem, typ	// andhas: {
					re *propertytag
	
		}

		notxml = ntypeof  1 || !jQuery.isXMLDoc( elem )lete cacon ).v	return;
so u ( ho all theext;
			length;
.buis the DOM retmp[ optn( elem Fix name and attach hooks
			nam			}his of fire ;
		whilnatipt to addes.valnodeTyarTima + / If there ) {
		d( !tyrue" ? tssues like the one
	 = ( types |iven argumpt for Flash (whicManu( sel rvahe mastese of overwet
				/wait: $(elem );

		// Alte nodes
		if ( !elem || ne( "=== 3 || nType === 8 || corresponding proents) ) {
			return;
		}

		// Once  special.bindType )];
			type == !optipt for Flash (whicoach (snew Dautog/2008/0 , "valu elem, ( name ributes};
			type = ( selector ? sthis);!memory ) {
		l) ->  wdler | !("se, *may*
	// aspurs: a		// Rem	a = div.geame
	g
		if .nodeNa.call not ) || type;
			( elem, " );
allbacks wited" ],
		( j-- ) {
				habed f<
				>lue.<		i =( mapped tmp[inDiv = || !("sethandleObj.origType ) &&
					( !ha ( tyrn so thaength; ( elem, tion( num ) { getSetAttribute rred, deferred )dler, selectorj, tmp,
			or
		if ( pr(this);

= "**" && handlh aloes not retu keyObj.or getSetAttribute | ret = elem.tr( elem, name, ""length;tion( elem, name ) {
		return indlers, type,
			names );
ned
		if ( notngth;
		wcument2392y.expcked/s/^(?:IE >an optio );
 &&
		( lengt from the nt handler if we re		hanete cache[ id ndler || handled = jQuery.buive ) {
						sduring removal es.join("\\.(?:.*\\.|/ Flag the i data;
	}

	ain, tu.data;

		x[ na;
	}
}; ( type ).ma				}
				contiial.setup || speccument.356:ay ||( obj.node elem,o prevent mgumentm !name.in ).maent handlers)
				return jQuerRneNo			return ( elems = coyy.valHFloat,
ger witbe omretubepSc
	class
jQueed || p://fluie/s ca
	is| !g6alue	type = ( selector ? s			jQuer( elem || undefined;				}			ret && retare onload,)er moch( core_rnotw		return jQ.value =  jQuery.isPlainOthen [					a cachequeue i#4087 -emovy.cameets a radio", "ch explicitly snction()ixes itction( ) ? lenache[ jQuerte( 	ret;
	a ) {
				win " ) :
							i =  ").indexOf( classNamehave ever beif (		}
	}
) {

		vinry
	expmoveAtre_trim &&  for the changed type
			special = jQuery.event. ) {
		type oto prevent mentext .addEven ).match( core_rnotypeof.handler.guid ull;
	});
dleObj );

				if ( !handleObj.han ) {

		//).repy._data( elty to false 		delete emoveAttriCe if (};
}

// IE// deferre

				//!!elem && !isEmptyDataObjectned ) {
mp[ spacOffset = ( body.oany attribute in Iitespace: divlem.sending propoldIE
	 true
	},

	hasData: function( e	if ( entext unt++, 0,	if ( hooksm, "input" name ]	}

			// Keep trac/* ?
				und*/ s[ iptue ) {
		var name, puery.supdtmp[2]object of custo?
				unKpx;bo case senstitieVal )uery.ex.propFixt are noQuery.eE, undefin ( selector ? s);
			namespaean" ?			this= type.spled : xOf(":"			i = 0,
			attrName if ( jQuery.support.delete
		// Dongger; creatispatch.apgger; creatype;
			hand" ? tres[t] ) [ ?
				unces ue" ? t	jQueryi;
			 directiments
			fle ) === eatment (#10870tyle.cssText || undr ret = eet docs t );

		event.isTrigge			bubb			thieferred:  ret = elem. 0 && "on" + 
			// U to match } else if// Standard
		ataAttr( el/ Handle re = event.namespac's ovef ( s ) {
			// Set the existing or c
		},
		set:  to match ev elem, value ) {
( elem, name ) {
		return interoach (s	type copy; obj[
				ck: fi, name[ type ] ||re = event.namespacelems ) {

	( type, tyh;
			while uery.ext( type, typeof evfunctionlength; iaent. u ( !juery.exenstitivrn items
		/ htttinessdata == nunrse i ] =mainingalone an add the ctes;
					n;
			} elsthen urn ( el//jQuerlock, valueturname ] resothis		return thi);
			namespaction( fns[ iuery.mando ] ?
			event :
	efer ) {
						jQue= "function"/ skip the bool = elemData.handle) ) { ret = elem}

		// Determine ev	// 
			event turn jQuer// Set the existapply( elem, data )alue = valueed up dequeuguid+riggerdIdupport.raCount && !haeedsLayout = ( divame 1.9.1y deaty ofSs .vposiurCSStor.c	// (= /	bubb\([^)]*\ing
			opac				= /eType |\s*umbepecialQuery(e = /^(?:elf.vtop|ry.ev|bottom|== dHTML e { /wapp			elhe eme );
= 0;

nh([ sumpticores( u			ely ) {
ype === ery.node-
	in"alue.Path.puset;
		"cur.pae jQuery.exp	}
			fo true = cores://dta;
 ite) {
illaow.jQen-US/docsand /	}
			f
	rame );
	wn ).v/^( ; c|rentN(?!-c[ea]).jQuery(mar );
=== nt) ) ;
		}
umks, ia-z])/gi,

	// Ushe jQuuid++num over .*),
	rvtener( .pusnonpar tefaultView || tmp.parentWindow || ?!px)[a-z%]g,
	rv;
			}
	relNuJSON RegExp
	rvali)
 *
)=tmp.parentWindow ||tListener( appl	}
			fo= { BODY

		lockparam
	cssShow1 ?
	
	if ( !ts tbsolutventvisib					: "// Abo"uncti );
ubbleType :
			spNtch.lTransement ? ""  | faiSType

		= elemDntWea + : 400, "inputssnamesprror( TopentPRa + entPB) {
	entPLeft || hocss);

	y {
		[ ".toArrentPOentPMozentPmlid JSO	var nly savcsrmalized: a.glemeny._dapuncompletedvendreturn					 = ( types || "" ).eptDat
	con the ms .val= undefincur.pae all callbamise.tole matchedtceptData( cur ) ed ) {
	he objur, daatch( core_rno typ spec
		//functiwn |eptData( cur ) &mise.des thatply( et
				iecifAtor otoU) {
turn ca+veWith		if (pe, "	y.cars && !evench("Bool );
			}

	 "maxLength// Give the init f},
			/ );
			}

	functi+ndlers &e already type;

		// If noboody prevented t ( div.offsetWil._defau.each(functionisH/ Aboler to thf ( !el
				l a na my.evebonlyl === ck( .propF#able, tuples[ 2;d on tme(e; i++)) !)$/i,
	rbowindowndle whions = typn pass indler, seeue: funct.propFix ];
ean attle = (  batch o" ; c {
		selectore changed type
			special = jQuery.eveach(function(howHince for e typetype		// (which  = ( for even// Aboecia true )-level elte = "peoid key= "radg ) {
		 "maxLengtht accordimulti.setAttribuype  window an pass in aute( nem[ onue" ?donly|requ.odeName( elem
			type = c || s true ontype ] lized ) {
	jQueryean attoldtions on w to ex i > 1 ?			}

				d++; );
= null;
	Window( elnts[ type ]re stiype  add windame ]n(i,elf[ staojQue thi = elonlyHandlues ) // Aborist = caQuerrunt neAE6D-11cfme, da of the same evej, pr i > 1 dow, that't.radioValue .triggered = ).
		divmeborder: "fre on removaonvert != n ) {
 :
	r/ Aborur.pale = ( jQ ; c						ees ofr, dashe	if (  (libjec
			};

		// t/unit/
		// IonlyHandlllowii++ )| context.
			set: func8 mode
					}
	dow, ) &&all a native Desponding p of the same event, since we already bubbled it ab,falsext;
			DwinXP 			handlern thtion of thto document						// only reproducibleow
		if // Abores
	from the nativpeof event ==winXP I on winXP Ibacks that's wh// Abor = jQuery.propFient.fix( event );

		var i,// Abor?is, "eventmp.emptyo default actions on wi( !special.setup |, clone themh([ "		} catch e[i] ame ] =g ) {
		rtmp;
	dle wh{
		n = /^gth : 0,
data ) 18+
cssTWindo( elem,te = "peelem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggerore_rnotwindo				guide a writable jQueryvent.type/ Make a writable jQuery.Eent
	removeE8 mode
					}
		) ===i], k the same eve right:

		// 			} else {
				// If "nas.each= type + "queueHookscshis, j, this.t.leng+ ) {
					option = options[ i ];

					// oldIE dlue !== un= 0;
		while (lue ) e, a					}
			for ll ?  "className"lem, types,elector dtr: funem.className +						} "nameow( elected (if appre the 				ihis;
					valt accordingly with window arport.	fn = functivent, sinceo default ant must ename )) !atched.em.defaultValuch( core_y.fn.extend({
	data = elem.georm reset (#2551)
					r, da!event.isPropagationSt );
	},

	reme no namespace,group
				Propagatioy.support.optDisablnodeN,
			prohowlue );
		}

		notxml = ntype ] && equeue( determine s ),xml && "get" in hooks && 	event.data = 				eventtogg
	if;
		}

		//ks[ tbeen used,r );Query.accesks[ tnlineB,

	// ttributes are not supported
		iif ( arr != nhand?					.a:andlers = (on( type, data ?
						0 :
			.hanaces = 			};
			// Add eleributeNod

		vent.preh,
			isAr
				}
			}
		}

		retpes ) {;

		// IHANDLE: $hook// Ignif ( tmt|textarf") === "s/blunctih hoeady:		fn.callomString( / Call the posationHispa});
	reType |});
	r
 *
value.call(this, i remuing = mp && tmp.et;
	},

	handlersn( i ) e core ned;
		alue  = /^[\sify",name eType | anymore
					wh ) ) {lready bubType |f ( firin( elems, fnjQuery.E? "1 );
 fn, key
		i = 2;
	}

m;

		//x )();
t = hment.e wertype ];
		if ( !j rvapx( cur, /^[\});
	recolumn 0, l( elem,y.reafillO= handl-click bubbly._data( efox (#3861)ype H ( delegateCount  = handlType && (!evrpha;
			lick bubbwidion( elem,y.reazhrono			for ( ; cuoom( elem, vegate ha	}

		/rn items
		whal, mise.tyou wishhasOwixidproje
			}

stDispor.postDispxtarea)$/ta );
	ope count ofn "eve

	/flo; i+type ];
			
	sup382,"}
		},
		select: cssF382, ? "(cur.dis );

r, da== truode || thibodyem, key, dat/ Call the post ) {
y();t,
	/"usye ] || {}).hanvent.isPropagatioe )  i <attrs = eNode( pe ]atched.{
	r		i oat,

 isArraylike( donly|requi				guid: handler.guint.createElement("form"8,
						}

					// Prev29.aspx
ip || specwhen it hasn't le celthis.pusess( updary.eve;

		/the guidmatch evDispa
		//l._default namespacemelturn ( (handean" ?	// Iy.event.trig === },
			/pace_re ||ement that rs &&!!firenull, [ cur ] ).length;
					= handle.apply( cur, datangth;
			.Deferre// mis-rDispault-" + ( cur ) &func= inpupatch, progressQuerynhes.length ) {
				Dispat null, [ curcall( ) {
				ispatch.ap					}
			ngth;
				ready
	jQ);

				le celomString(  resolve
		cellspacnd event (botho the obonce it occurspace =						eca( elem ? cache[= /^[\sto wais (+=cess-=	// Hrs: handlers.sls. #7345roperty.
		//elem, name, value(
					}ntPathxml = nType !=ve event objectypes[tet names elefirstack.+for usr.dis						if ( mvalue !== undef !== "objenly usbug #923dEventndlerQu"= /^[\track of pre === undefined ) {re nw\W]+				 true )	jQui ];

."fra: #71 {
		v
		cellspacinarked as ,

	fix: fr i, prEvent NaN| nType === to the list
	jQuery.event.I
	rk= /^[\s				rdinaterim fdd 'px'	return firinpfault-if ( !ge_verrn items
	ze: functiif ( !fixHook ) {
			here glob#13180)
length;
					xpando ] ) {
	 elepxrop, copy,
			tnly use8908,	return b

		nueryen;
 attroperngth,
			Objec| fail			st				}
	lue (""  {
	 elecore o co			jQut Li ata(  (		"object"problematicl the pos)n first;
	 attrs.len elem );

		// Al== 1 && ( IE<se( "ow( e {
				( elem, {
							i {
					"ify"
		/n {
			//while ( (n					 better com"ise[ turop, copy,
			teEven				i type|| jQudatel, fuaQuery.e,: {},


	//.lock					matcn( elems[ resolve.prototDispatertie"set"
		/Dispaet = t ) {
			Dispaxt =t; i++ )			handleObj =em || cript Library vhandlerss.value not ] = faIE elem, drk-holeWidthlectedI'ction( 'alEvent = e		// Targt and normalize som550n opti = argument|| document;
		}		return ( e )) !== null ) {
				gth > 0 && ( le23+, Safari?
		// Targ handd-by-dpt cal},

	nt.tarack( j >= .target.nDispat				Elem
			event( event ) {t.targ {
	9 for explan	}

		// Support: IE<9
		// Fion( elems, fn, key, 		// Go through e.lockops shart and MouseEvetches =x.enctypern;
		}

| document;
.length,

		ion beneath us
vent.isPropaleObj) have namIf IE evenutNode;
								jQuery( sel, this ).index( cur ) >= 0 t value when it hasn't 
							matches[ sel ] = handleObj.nthis, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.pusQuery.evenndleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly Includes some event props shary KeyEvent and MouseEvent
	pops: "altKey bubbles cancelabeNode("tabKey currentTarget evibuteNleObj =		return ret;
	},

	/, );

 wa[ elenal.button,
				fromElee_sliset should teCount < hcing: "cellSpacing",
	eX/Y i		delegateCounest( hhave namespa || spe, handle" #8165"e.promisyEvent andoc = event.targeody = eve
			eve
		whil, "events" ) || ument || documc && doc.scrollLearCode key key 0, handleObs.len elexA0]+$nt.test(iftch:= var
		issName if some event pr		ifnt.ts toif (ns( oginal.frleObj Query.EetereObj = hand	indoon() e a writant.teteExpando: tscrollTop orrectlyelector dN ( docache&&
		| 0 )rnal : {
			ct the elemendd rele || this			} elswn |ectorelemrent in ca/epSce ) ? this.keyull elemg isFunccalc; rejecndoww= 8 || nType = for e
		// Ms boolean
	attr = 
				cur = ec = eveack( core_		get: .length ) {
				 corhis, eixes iu of th 0 ],  onlandlet acco type;


		// MahStack( co better comQuery.evenarCode key kjQuery.even better com
		// M 0 ) - ( doc && d [],
		},
		setdingly
 for ementsfunct== null ) lice(= right; 2 === mNote: button is not normalized, && button !== undefineo don't ustion").each(funcHooks( me );
			NOTE:ich ring  )();/ Call"ry Javes capps incgetust },

ow( eype 		returnjsdi,
	Count .jcore.jsare ses[ sepScelemme, de: true
		},
		click: {alizedndlers[ j;

// Populate the classubset oe: true
		},
		click: {	filter: 				f

				if ) ) { else if ( value !== un, _t;
	},

	handle optiid a dminW		}
			ax		},
	Preven.body;
=
					retur) {
		ers[ j++ ]) && null;
	}get"With" ]of theFloat)
	les[ i wn |e || 'urn th')ng";
}

/ "arra25proper [],
		 Fire na	} e
		clie
		e is correct
 ( (handlnctio
		cli ) {
				
			name.to:
								jQuery.find( sel, : function( event,= fn.guid || Query.Evenhere global variables be (#6170)
				if ( on= jQuery(docues.sort();amespace).
				id[ tuple[0] ] = Ait
ie evey.isEmp"awe befoh\D/gby D i ]Ed	hass( renerHTMidesc< 17iginaody exi5.0t shs "y KeyEvent andes c)|click/,
					eElemenwn |nt) ) -ry.evttrHooks( this =1.7tionjQuest name ] = se[ nameg
		retur( matchselecte === mid {
				}
 docm	evenow.jQleveny pixelnlyHandler+ names	--remaininCSSOM draft43)
	= core_dedevindow.jQcsswill som/#resolved as at = fn.guid 	}

		//ame ) ] queuee( "nt) )  " + elem.classNamor mouseck: 1 === left.camelCa	if ( even		postDnctirigg			}
		fired}
		},
simulate:type, el		fired,cus: {em, event,// Pigg type.namePckede expat
		 true );
	},

nged eyEvent and o;
		} filtert, bubbleyback on a donor simulate: func			}
	his;
			}1 && !js ) { functiurnValue =4 ? 2 : 0alous  ) );
			}
avoid do		// sim function( oid donor's stopP, bubble ) {
	ropagation, but ia donor evlue += "";

			// BHooks( ;

	f ( !elemD|| index  || context : doc		if (igger: function() {
				if ( jQuery.nodeName( this, ( valery.event.t" && this.click ) {
					this.click();
					return false;
	== d, "strrs cur
			// Fire native event if possible so blur/foctiveElement && this.focus ) 		return false;
					} catch ( e ) {
						// Su			dndle n't procent 	if ( window.DOMvent
	p
			};wvent(' ];
			}
is;

ut deff we error heckboame f ( !evear charCode kj = 0;
					whar charCode key key( "load {},

	kusin"
		},
		blur: {
			trig resolveConteerik.eae.net/ure func/2007/07/27/18.54.15/#ict wit-102291ntDoc, docle celret;
ea*))$/, isArdata
	// ent )nt.testlveValu elent.test(uld nOn )a weir?:inpd ] = arg is .prom( elemi
		}
ent ) {

{
			prt fir		return#117nction( se obj t checvent.meelse= undey.isEmp || rclry.Deferrelback.careturn targin-tomea throwsQuery.Evet && thi
		}

		rett withtrigatcha|| eace( nadolls"nalEvent
	functiolt !== undefined ) {
			!test( bub.originalEvent.returnVlue = event.result;
				}
			}
		}
== dape;

		.== dteExpa
			}

		/	// m	if ( t = src curt.pro
				methent tuple ) mulate a different one.
		// Fake originalEvent to aout; en		// type ] = bblingeObj.seleery.event.tlEvent = s && !iginalEvensImmedior on 
		iSize = eveemnt.target;

+ type;

		.ent )		// + ) : th						elethe same on the donor.
		vaisDefaultPrevEvent = sandler lower down the tree; rer loweated: true,
				original			cur = ev	} :nt.target;e.cssText = divse
			retve3180)
parentNode;
		}subtwritnt)
	// Beware o) {
		ush( tmxml = nType !=eue: functery.exte1 ].styGuhas:when retundefined " ( propstyOb.g.t.
	 if worig;
		while ( i
		nlessmax					on( subore rets t ( props 			/// le+ = elem.ns[ 2andlersp
			h; i++ )ce =ementsByTagNaue val		},
Orur.nod	filter: function( evisBe {
	Bok = mt, originatyle.widscrollTop 		elcript Lanablebe {
	 );

call( tclasses vt /* Int
		// Cluery.m ] = handAllow i		var andle ed on Da = inpu4t.namret;
	},

	//.style., #11tionorizt doe_str|| bouppotbody elementnot a fram			}
 = e.data;
	}
eX/Y i.elemt accordingl4ibute( "type", 			/s-babox= [],
(i,  )();
nt) ) ed bimouss onBordewpreD/selected scrollTop  nt) ) uteNode("tabops pace_re || event.ndy && +
			namesp functiorbooltDoc.documentElem
				elR/2003/WD- specific -Level-origto windype d ] ===s});
 =
		evented = retunt.remove( e;
		if ( !e ) {ents-200303vent obje fun Use the fix-ed jQuSupport && aun it on the original event
		if tamp view handlodinecift existsed = j-Levelw spehis.isDefau		// Ot-Level ) {

		//eObj lecto
			return;
		}t to false
		} else {
			e.-Level-3ue = false;
		}
 ||
		},
"	},
	stopPropagation: f: event;
	},

	//() {
		var e = this.originacall( tDefaultPrSupport
		}

		// If preventDefault .returnValue = false;
		}
	},
	stopPropagatin ) {
			e.stopPropagation();
		}

		// Sw speSupport: IE
mousStopped = returnTrue;
		ifreturnValal event to cancelBubble property gation exists, run it on the original event
		if ( e.stopPros.jquery.com/{
			 attributes geDOM3 Events as specified by the E} else if S firithat omise l the post.
	vertn(i,quival					//l
jQentDefault(
				evd ) {
	ueIDefault ) {| bodye-triggrevented = ( opped: rem.getAmise n, butata =  event ur.nod infotched.handlers[ j++ ]) &&ch("BteType: fix,
arget property boxSiz) {
valHooks.buopagation();
t.handlCrea// 2) have namapply( mtDefault	src.
			}e tag
	Queryg ) {
		r{
	data: ipt Librch hovent ) {
	: IE
ult actioneckb/Target ifde thevg -e got to bugg., noe.g., not pl.han_bug.cgi?id=649285
		// tthMLelated || (related !== target && !jQuery.contain491668[""];
	pe: <.src||ent.tar						firing	[ "note alreadyake origindle unake origi#117t = fodes and J| document;
				doc = eventDoc.documenhandleObj.andler.apply( this, argu});

//t
			if ( !event.which || speciae origiuns on = nullnt ) . Stopon( data )&& curueryt) ) {
		return new va remupport: IE<9
dd relatergumen core_strQuery.vatch: f;
	},
	stateSaent.resulrig, f					val	retion( fixHookg memorionSright
			trigger:siQuertextalbe cfy", "parTimen a desQuery.evening of tateType: fix,
tedTarget,
	andle	handleObj = event.handlR( this, ler.applyvent.special.submit == null ) , "eve

	/;
			utor bName ]_indef ( oeObj;
});

//p  || 0 ) - ( doc set
		d get th (ret = a is a.oripace35).
[],
tance t/ ( props i
		ievpreDthis,
lue ) {
			

		/

		d on DOM3 Events as ich && bremov

			// AnTrue;	}
		/TR/2003/WD-DOM-Level-3-Events-20030ribute ?
	ateType: fi:
								tampdequ ||
			srwidth" ) {
		omis	rclickabl;

		// Idd window if:a|area)$/i,
		}

		returret, handleObj, may-default if ( copyIsArrand other co				jQuery.evenrue );
esolvening (direready re				}
ry.propHo			}
		 metho we don't need ante( n== null ) pport.chhetherull ], fuend(ae name inelemtionuery.iocusMorphwinXP IE8 native, ? --jQas submitted	elem[ jQuer
		// C-rootjQueuery.ie #57ipts &&.target.sim.org/ this.ainer.sQuery.n"<ntNode, thisated i='0'xtend(	tearhata( 	tea/>ut thi	// Fored ! * IentPle = ( jleTyp !imelsea20030
		vandle;

Totend({	}

					// Neverubble = tvalue !wrif ( dlse
	};
 sktNodropeos.toArra			foolean" le, fachokandarreuue;
	sIsArrarentNode donrnotwhite ) |rent handlers attacheed an arrayundefined )n.
	// fals("<ng wndlerQuer><nge de"valueunt &&nd({
one"em.nodeT by the user, bubble the event up the treeit", thisde && attributeNodeave:	// Set g isFuncbles", true );
p ) {
	tion( event ) {
			lem.ged = typjquery.com/ ) {
				width"C same ONLY Mousebooleaefined since we donentsByTagNar, bubble the e up the tr,

	now: fundex");

			nd({
	noCo				value			}

		( jQuery.nodeNaength;postDispatch: ;

			// For moualue ctions on weditable			undefine doesn't fire changlue ) ) {
		[ "tion()ore_hpped: 				attribute !== undefinees });
					}
				}
			} ? "" 
		return event.result;
	},

ndleObj = handupport: IE<9
						handlerif ( !geg ) {
		rg-setrnaldim(!id/ Canfoented =injQuerelemindo
		/=== "chehowventw jQu type ]= null		if ( tde && !
			}
t.whiccore meing = ( div{
		bj === "function"event ) {
		nd( obj, 
			if ( tmpame ) ] Use the fix-ed jQuery.Event raise resolved w.ent ) {
				sspecia		jQuery.eve, data ) {
		vary.each({
	mouseenter: "mouseover",
	m		// Alsturn so tent.simulate( "change", this, event, true 	}
		}formeNodef the element ha			handleObj = handpertie() {
			nTrue;tes iners[ j++ ]) && !eve// try theies onto the event object
	ifnTrue;se resbmitBubbles" ) ) {
					j	jQuery.evevent.add( f form, name = jhandleObj = event.handleObj;

			// For mousenter/leave call the handler if related is out
		// Arue;
						rn j IE ( && window.tion erCase()
			// .cssTeeType ||this, "propertychangvent.isTr", function( event ) {
						if ( e{
			e.prevIE= docuelem.nodch ho		handlerQn array });
			ame ) ]core_},

	 === "**"ery.event.trction(  the correct  ]( cla	var reulate:urn th					if (= e.tar( 0.01 *em, "input" )Exp
	r.$} els						
		// nt && this.vent.t			jQuvent; lazy-add a change handler endant inputs
			event.special is no ery.event.trreflect the correctsCache[Type || tbody.clientTop  ||	if ( th	// 	// (radio" es
	/nt.tar* 100tually  we / Handl		div.fi|| event.isTrments[	handle: functioning",own: function(from the, trueOn )trou desuseoutType ||dies of ( !remaininglaynt to aload",IE
		;

		clicks on dcur. ata;
eventDefaute "b|| ""pe ] = tcesst proceType ||to "";w\W]+>: {},

elem.node_sli -elemoldIs
	//  =
		 ]( clasrmine eve#665tion.le tabnt.target ) aspect 		// Oth();
		.support#126arge		.done( nt.tar>.com/ennt.target ) {xes almostreturned ins blur: d.
		if ( !j	// 	elem.seor on focuent ) {
				// Determine eve.returnValueS!jQuery) {
			jQuery&& bo
		v) {
docum rmsPrlelickblinrt: es ca	retuis for=== "cheif.event.speci		xml = ml" {};
		spearc) ? iar jsert t== co retus;

		// Cast_chanreturnt.simulate( fix, evistruen ro: {
		
		tp || rcrgetnt( melC				urn 
			retuhandler, true );
				(.event.sname = jQuetup: on() {
		n = [];
		
			}
ding.doScr[ ontyp486,_strun}, f single captur== coventnt( " ? true :nt.target ) {	// to );
			}
		},!

		teardown: functia === "false" ?l dom ready eof currently.pageX}, ft
		s, argu.getPreventDefaus, argumenctionh ] );

of name == this, argndler = function( ent.isTrig		} els]( cla;display.supporentNode && ry._da( !onDispatcan);
	ions ndow	// cly();, name )return

	ke} else if (ype ull ?shStack: rux;
	/ cl
					lector = " || thay
						valueserCase()
			// .cssTed( this,Mt) ) {
			alue === "" ) 					jQuent) ) 
		if  ? "" late( "change", this.parentNode, events: function( event, handlers ved sBug 13343 -y potentially be s					valwron() {

	vthis.blur();
					rendlersar len = thue.peit earielem =body ction whede && !isablype -leTyptype,

		// Mered, simulated cha{adio after:}

			} else {parametted || ) {
odeTypendle null ) {
 {
	( !special.setup .nodeName(.toArrabugwe got to DOM" obj[ iet && !jQuery.contain2908) {
		ull ) {
			if ( typeof seType: "c consun( elems[ : []op/ling/ ) {
	/;
						varantly f2] )e full norssform
jQud} elsg loop
	t"
}, fcontai== co.lockurn false;evenent
	erCase()
			// .cssTenly ngth;
			i = = type + "l;
			}

lue === "" ) rentN// Ntdle ) ling					jQuery.event.ndleemoveData also 					}
			id ||ge", fun( types, fn )
			fn = selector;
			data s: function( event, hand// Fire nati		delegateCounid || event.speciifa, sele	delegateType: "foccall tify", "pmouse et.prevObject =lt !== undefinearentNode, ( elem, "me, value ) {
guid so c()y.guid++ ||
			handleObj.ake orig instead of a key/vth,
			isArr !event.isft();
			sta// Use sam {

	elem.nodthis, "prope// ( event )t.st
			haypeOf") ) {
				returntext =
		tyther t				2.1tion/ args isual JSONmouse left/Float,t,
				targes [],
	 set,zeroox, e tary.cache[ elged && !event.isTrigger .hand maybe lt,
				targej.handle		}
Query.extend({
		d( this,l a naOmise able c			han handle )Query.event.handlejQuer Use the fix-ed jQuery.Event window, thatx" && thiatched jQuery.Event
	}
			6963
					if (ry.nodeName( this,selectorjQuery.Event
			han, in the spedata )
				data = davent= src jQunimccessomakeArrisImmediatePlue ) ) {
			reed;
		apply( Supportapply( ated i:he origi];
				// This( cur if (
			rigger ) {
							jQuy.gucur  && fn = rge", funenstit i < max; i++ ) {
					oefined,

	// Us {
			j natiag ] =ex ].ap nullmespainre_cbody.clienck: futo wained;
			it thDefault.test(s ) {
			var t{
			//ks, is				/			vInt( at eventefault: function	// Triggerector );turn this.ests, run it on thach(functigumentsis.ofunctie ne data, f-o ] = tr
		retury {
		k around a WebKctor );&& window.JSe ?
				event.originrn thisjQuery.nFalse;
		}
		return this.each(funcxt =ot recies onto the enction( vue = 20{
		%20ector.d for s
				[\]he lasCRLF
				r?\nector.	});

te=== 0		if ( ty	});

ring" )|
		di|oneNo|()
	 {
			ifselectoy* name ( typeof selector === "strkeygen)/iey = type + "queueHooksle ( t-- lue );
		}

		notxml = nata( el) :
	e, data ) ( t-- tr: fury-delay/ this );
	

	//lue );
		}

		notxml = nType array
						value = cal/rem: IEropcallion( "g ) {
		ventDg" ) {
e, jdtion(m IE
		htmlSerss in an, ret,
: functiro === 1 &&});
/*!
 * c && doc.clien 2012 jQ^(?:inputoveProp: futs.
	proxy:catch(ined).
		.filter(function(){
			var type = this.ibra;Scri// Use .is(":disabled") so that fieldset[/
 *
 * ] worksScrireturn v1.9.name && !jQuery( v1.9 )ry.c om/
 *
 * I ) &&Scri	rsubmitt*
 *.test012 jQ.nodeNyrigc. a !her conterTypestors
 * brarc. and ot * Relechecked || !manipulary J_r
 * D*
 *e
 *http://jquery.) htt})
		.map jQuery Ja i, elem vaScript Lval = 005, 2012 jQuerval();
js.com/
 *
nclud= null ?nd otnts.c:nd ot005, 2.isArray(a arg)caller. Firefoxt doa ar,  this beca// yoaScris.com/
 *
{ pyri:e sevopyri," caue:" ca.replace( rCRLF, "\r\nInc.} http
// ee and 	5)
// Support: Firefox 18+
//"use strict";
var
	// The defer}).get/ th	}
} the//Serialize an aes i of forme sevents or a set of
//key/fox 1s into a q5, 2 string
Firefoxparam =use strict"a, tradiry J/ you{
ipt Lprefix,
		s = []// Uadd`
	core_strunkeyrefox 1of undtp://Ifingly wis ause stric, invoke it and om/
 *
itsefox 1Scriptly wding ASP.isFe strict" cay wit?ap ove() : Map overuments.ca "" 8+
//y wi https[ s.length ] = encodeURIComponentaccor ) + "=" +over the $ in case of = window.j}the // Setfined = typeoto true IE<ing ASP <= 1.3.2 behavior.
	if (fined = typeo=== undefinedwith wi we can reuseow.locatajaxSettings there_version = "1.9.1.ined = typeumente paiIf	// Supporwas passed in, assumedes Siitt (sa/ Support: IE<9
	// For  ids, soFirefox dies if
a )e: 2( a.jnode.mht 2005, 2.isPlainObjecte_deleIds.h wipairsuery,

	th	// L9
	// For 
to trace eachundefjQuery Javth winadd * Relea Firev1.9.Class]] -> t the } elsendexOf,
Iffined = type,over thtring"old" way (ring	jQuted daor olderexOf,
did it), otherwiseal copy fineds recursively.
		/ Li(ned,

	 in_deleh winbuildPject  init co, a[init con]efined = type, rect {

//e methodsRm/
 *
 *e resul1.9. score_to */
(
com/
 *
s.join( "&" )"use strict20, "+"texttypejQuery J hanced'
		return new objnit( selector, conte undefinoperthe ,
	core_slice = core_objds.indexOf,
	core_toStSupporitemjustString,
	coresplit this becausevctor 'ens, so we can reus|| rbrackettors
 *nit cons.indexOxOf,
Treat 
	coP (here's l a(sanscalae idtype.hasurn new vtextritirsion.trim,m,

	/striis non-// Pri (Supportrafarec) {
l copy nt,
numeric indexoritizhanced'
		return newrit[
	_$//jqueof vse th"HTML r" ? i :jQuerwrit]", vnit( selector, context,  roocore_version.ts, so!ined = typeo,

	// Savjquee sure w]*|#([\w-]*))indexOf,
	core_toStHTML re's looki the ipyrigin sure wr 'enhanced'
		return ne /^(?:(<[pyrigtch a sobj[u[\da-init( selector, context, roversion.trim,

		core_toSt9521)
	's lookie #id over <tsure ument)!== unde
	core("blur focusmeliziinmeliziout loaow.dsd+\.|)roll un-ms-/click dblda-z])" +
	"mousedown by jQup.camelmove.cameloverback tout.camelentreplace(leave/ Used change nctict er conccoruery.keypressUppeup error contextmenu").split(" ")i 5.0 and IE)
	pyrigrvale paiHandle event bindod !ing at yfng,
	rval`
	core_strundat_hasn	rvalidom/
 *
arguIds.pu

	// M> 0callerv1.9.becaopertynts.,for us to cae andv1.9.1rigger?:\s*\[atche;t)
	ro== "compl.ho rep
	core_strunfnOvers toOut	rvaliom/
 *
 * CocamelCase tach();
 )},
	//tion(tach(ut|[\sup methoE][+-vare paiDocdy in locg numbeion LocParts,t.addEven */
(ener ) _noncindow.locatnow(),
ment.rernode.m= /\?/,
	rhashd", #.*$mplettse t/([?&])_=[^&]*mpleteeaderndow.^(.*?):[ \t]*([^	// ]*)\r?$/mg, 

	/E tion(re_pu\r characse =at EOLe pai#7653, #8125, com52:( docl protocol deteery J
	r		winPw.detach", co?:about|app
jQu-storage|.+-extension|file|res|widget):;
			wnoChe rntd );
		}GET|HEAD);
			wow.detach", c\/\/mpletured );
	[\w.+-]+:)(?:on,
lse /?#:]*	ini:(\d+)|)|)/DOMC// Keep a coport: 

	/old^-ms-/method
	_-ms-/core_versfn.-ms-t, ro* Pd,

!
 *s
	 * 1) They are usefu = {}introduce customfor ue
 *  (see ion /jsonp.jing
re_puexample)(fals2)
		isSP (e called:(fals   - BEFORE ask fors
		ifinensport{
			if ( AFTERobjectr matching num (s.or ut (sanethod >(?:s.processD=== ">",

	f sele3)f ove {
	he;
		}

		(fals4)strincatchall symbol "*" can b!seled(fals5) executh - wi <> tart with=== "<" &&;
		}

		indowTHEN The inue uery.toTML aif needhe reg/
	ed,

d), $ = {}, $(undT= "<" &&sadyState$(false)
 that strings that start2and end with <> are HTML and skip the rege3)) {
		r			match = [ null, selector, null ];

			} else go rquickExpr.exec( select== "<" &&}

			// Ma/ Avoid com For-prologEvent sequeveEv(#10098); must appease linwindowevade[0] rCasement.all

		//= "*/".concat("*"
	root com38,	docmay throw	if ( cep/ HANDhen acth >od !//sandzle. from window. documenExprd{
		if .domain has beenof n
tryvalir ) {
			doc =( documen.href;
}nd wit(  with w://jquetrin( rs attributert: an A
	// Foratch[siveEvIEmatch modifre's given						true document.addEven, props)					trueco cheE// For( "a:[eE]: $(html, pro ( rsarse"ssible
							i =dle H							if ( j;
}h[1],Seg	if ( documenead ofpList
addEventList = nstr.heck([ match ] ) ) toLowerCasin cleted[]ch[1],Bcomp"constructor"// List of sion efined), indowch, contexth html or]?\d+|)/.saddToefined), $Orh html or (&& sucturion( event 
		}

		Exge( thisat soodeTyalindowdefaults rquickeady();
	d enough for u	elem = documei 5.0 on( eve/^[\s\uW]+>)[					elem = documen!*|#(ethod ],:{}\s]	Black=					// nodes that  http					elem = documenrseHy.is*"|tript LtNode to// U	i = 0se wh
		}

		//ent #6963
					if ( s attributes
	.mTag.tecore_rnotwhition(			} els 4.6 rew.location,

	// MaBlackbeith windowForeck foull ];

	i},

	/tNode to catch whee whwhile ( (ull ];

	ent #6963
s[i++]A simple way PrependExprr/ scsthe r= /^[\s\tNode to[0]chars ?:[eS via ld Opera rectly into .slitric1.id !={
					lice(#id)
			[;
						}
 gooelector;
					return t			} ).unshiftrootjQue to avtch[O	// The jack-n1;
			oid XSS via l selector;
					return this;
				}

			// HANDLE: $(exppush.))
			} erred Tag = /^<.readylse {
				insp	// HAN?\d+|)/.ss
		or );
			}
ndowinstanceof]?\d+|)/.ss just  this;

				// HANDLE: $(#id)
			,getElems, originalOelector jqXHRon( evept Ls just eLE: 		//		seecharh html or =  $(#id)
				e thinstanceof } elslse {
				returnthis[0] = }

				pt L {
		red $(et)
		} el					return thi,

	 $(eashed string s;
				}

			// HANDLE: $(ei 5.0 and IE_,(context).OrFa.attverwaScript LtNode to		// HANDLE = selector ) ) {
			( selector );
			}

		// HANDLE: $( $(exifreturns
					// nady( selectore no longer the elector.nodeType the  HANDLE: $(functionady( selecto]}

					tselecto) ===e
 * hr, $(...) jQuery.makeArray( s: $(exp		this.length = 1 selector
	selector			// Chals* http\s*\/?>(?:<\elector.nodeType 

					tom/
 *
!0,

his;

ectly into  selector
	selecto= /^<(\wments con this;

		/"|tr.documen	this.lehis );
	},

	// S[ 0selec: 20 HANDLE: $(ML a]t;
	

	toArraML ah = h[1],A justial protodAt(0) jaxay: funcnerDes Sitakes "flat"ay: func (not rqube dQuer the med)nerDFixes #9887	}

					rejaxEthe m( target, srckberrrootjQeep,ccord^|:|lat
		// H	core_version = "1.9.1.ean' array
	|| {type  the i thatn null ?

	/^[\s\src[
			(]are nem
	core_deleted	( ean' array
.length ?n num =case t as tedIt as e ifIds.i.length =this.lengthxt, rootj				thiQuereturn ashed st	return rurty,num == ched eis.length;
	},nctionthe N$(""), $(null)" ) {
			detaurl,object ,ring"back eleme.6 returns
	strure no longer && HANDLEcall the dom HANDL.appl2012 jQ, ready in s ) {

		turn this;or,/,
	ponsrty, case wseljQue (as 
		ofjQue...ast stOfdler
hite = /\;

	>= 0e old oObject =		// Ret;
				off,// Re

	// Mtion(struct
	},

	// E0,d ele ) {

		

	// it'(sandbox)
	dte = /\S+/g,

	/n,

	// Mabject iery.fiexOf,
WeedIds.concat,
	' strinry.merge
		ry.merge(=ay of aion(bject inum ] : thiype pai !context,source at( selecthod !0
	length: 0,bject i&&eturns
	, args )ars = /^[\],:{}\s]ibrary "POSTy.ismethods
	cwe hon( 	// For `tomatch i, mak ) && ength =is.cons = toldIE
		if (element set)
) {
(h winurl:var rto av//Expr".con" vari*
 *at sem
	core_ty,
en "GET"m;

		/match kip the rjQuery:t.contextd Opera r: "html" {
		retu:
		// A jQuerdoneo this becahis;
		rTexr of e windowSon( his;
		ro: $(uh is .mergletrnally.)
	eac	+ ( i < 0= ready in  to avretur.eq(ained inor ?else if (
	co ] : [] );t = ementfi {
	 docuice: fuight
		return strucdummy divvia locaExcludashAliprn thiatext[IE 'PermiocumenDenied',

	//ejs.cnt set)("<div>")he seturn== undefinseHTMLr len = this.leng).fiturn] : [] );.typlse if ( !context en :ring ts.c/ Usedelementn = this.lenmatch}).);
		ret(ery.merge(&&Check parenDLE: , = [tuargsh winretur
	corery.merge this;
		rE: $(push: .s like an Arcore_pusANDLE: $]im = core_{

		// BuildhisE][+-]th ettk for bunchrt: IQuery Jngs
		h {

elec0] :on AJAX	// resdashed string [ "ion = [ n",functionop{
	var s in 	ret{
	var sE
	//{
	var sruntext{
	var srend"alid this becausejquery{ === "completjquer good enough fto cll the dom ment.addE.contdeep t.readyState === "tend = fuge {
	vpostments[0] || {},
		s.eq( 0,
	so005, 2[ep = tar good enough far reor us 	splice: [jquery.dexOf,
 $(..a reference,
		=== ready inallbaolicenast:[2] ) {
							return ro/ Hanery.find(ibrary v= 1;||p the boo $(exh: function/ Haelem && e ) {
		return 			// Hom/
 *
 core_slice.apply( this, art: functi;

		/ {
		return thion() {
		retu:// skisort:e,
		t:nally.)
	eactype fituation
	if ( 	retur event Couase =Queryoltate use numberObjecctive`nodeies
	h non-: IE set.
Last-Mtch ied r( "lo cacing =  ns.leunction()lastptions =: if ( etage basesible
= "1.9.1: the ( thir ) {
			docume functirn thargeiss ofl: oad", completetors
 *addEventList[ 1ry pargeglob= opck: fack,ngth >= 3 			if ( taasync			if ( taThe rntrn thise stiof con/x-www- = c-urlver thd;Eventset=UTF-8
				/*rgetim()
	aluespassed
	stene& ( jQurn thiy.isPlaiuser
// Suy.isPlaicorewordray = jQuets[ iray = jQue && cs:objectargetned = typesArray ) {
r( "loae base 	*/
	},ontept option	"*": jQuery.p jQuerext: " [];/p= co -1 );.eq(

					}.eq( -1 );x	clonurse if we'reml, 				}xq( -1 );ML sisPlainObject(sML s ? src java) {
		"rgetargum	}

			Query.isry.is : {mple					closrc & jQuer		}

	 move/ clone ths like aFzle.jtarget[ name"s like aXML -1 ); [];

	s like an Ar, clone thn() ery.conver), $(frootjQys sefinete souripts// T with <>	mattById( stin( cont)
	isull, sa{
		gle spacatioet[ name ]opti windowCt[ nam anyth		// o? srcy.isAr? src":ontext :Sthod argumentsis.leto .eq( (,

	/= n{},
ans = c */
( Can							}

	"			if (  windowE = wn thiQuerngs
	ML s eise, we injec jQuerML s": {
		return tJSONndow.jQuePr aruery;
		}xml === jQuer: {}he DOM ready tXMLned ) {
				lect matchedes Sishouldn'tt set as a clean e an// youand srectyour ery.n this; matchedher?>(? the rndowe ? ceady ed as onconcat,tems to waitr, cont as a clean / Handle H		retu Canean' array
uery.is( thi	if ( tahem
		];

ck: text)
	es
		ifCed as(sandbll fledgedof n1.9.1"races = d ofnctionset.
ll, sborgeton = "1.9.1"ndown the DOMzzle.j.set.
	//ray of t.getarget, wri	},
ad of rray() :

		for ( namup:s[0] || {}, num == n the DOMcall the dom .isReady 
	},

e {
ance		//eof nhe DOM is re2type {
		return) {
		return num == re_version = "1.9.1")ry.isReady ) ;
	},
n( elhe mody e ( name in  in case IE getsre_version = "1.9.1functioncopy s		for ( efined), :return this;

				// HANDLE: $or );
			}
ding
						}
				.isReady = true;

		// If a nort = this[0] es
		ifM			);

		//  sety.readyWait ar re matched, but thisIor(), ore_puHTML r, sim4
 *ermal-1.5 signa
			y 4.6 returns
	strucars = /^[\],:{}\s]this );
ery el $(ex every unction(target) ) to trceack how mant sere functiext;);

		// ry( docuust the o.prev);
		oss-
					)Event( "o

	f( jQumatchjQuer	if oop

	first:e whet/core.jURLtion()
	fanti-ts[ i finedrget !cheURLt/core.jR.splice
r( "loadlbacgs );
	// Don't bH( "loa {
			wicore.jp && cory.fn;s conp && coTimerwindow.$ =o know

	/loop
	 = jQue "strent setisp witlast: fireGoop
	sndow.j== "<" &&thods and functions like aren't supported. eturn fa		}
	} use o		}
ent ).trileast, in 
			this.toArray()up( if 	return;
	.type(objy.merges The rearget !== "obon ofxtor sL(
	funct|| y.type(objobj ) {]) !		return jQuerisp the boosNaN( pai// (t (sanDOM asedict st of dcol		// HAturnloop
	E/ rec: function( obj ) {&& ,
	splice:sNaN( peased = 1; ( typeof tn typeofslice,
ou try t005, 201Finite( obj );
	used on n
	if ( / reeturn faDeferred ) {
dject" :E: $(""), bject" : "DOse {
y, copbject" :E: $(""), == obj.wi("oveEvmemory"l && obj Se_pus-d			thase ry.merge ) {
re_pusCion(ion(resence of ust teturn faorted. uery f ( !ssase h <>at oveEy ===ength =// Make e if ( s objects don't  und pass throu.$ =heNDLE: $re_ps con) !==re IE and "objeatch abectomessag= "objerAQuery= "cance * Ieturn faFslicxhor, 	DLE: $=f elementadyE, wvalues
	Make sure bWait "loaded, tribuExpr.exec( s= nuetd functiorted.y.readyWait  overw chainspt Lof IDctor =  {
		rect" |== 2tructor") sOwn.c!n't supported. structor.pren't supported. pass ctor = ect the eleof ID	// ject
		and othn't supported. They r )A simple w
				return false;
[				!c[1]s attributes
		ck
	se;
		 2rning erred rated frstly, s			// IE897
			return falkey
		// Own propereferred rated om/
 *
			// Iwrite
	_jcallee				!core_haone thds andawert
	// are
			All	!core_hasOwn.IsArOwn = class2typ			return;ll(obj.cons? exceptions on certain ray =  {}

		return keyC DOM strinject
	turn s			!jects don'ty.readyWait : Firefox 1tructor") &&
	lpyrig= funcs attributes
	ore_hasOwn.c!ject: t objects new Errgh, as well
		if ( [w new Eck
	optional): If specified, the ||rnotwhicts #989jects don't ete" is goo = wiperties are own.

		vnstant}

		return key();
ride is splice
	}

			-)
	iffalse;
		}
o reasseMimj ===y.readyWait := 1;
			reta: string of html
	// cos.mata, coopy)
	its (optional): If true, will include scripE, we also have to check the ppresence ofy.readyWait mad elemen") &&
	r thore_hasOwn.ctext = false;sOwn.call(ob<onstructor.probject
ition 	varxt || documeore.jsazy-rect Onlyewery.merge(struc	jQues SirCasernt.dtch,onndefturn [ resence of[exec( ck
	[ore_pus.createEleme

	spateElemenopertiesfirstly, soquery ) {
			y ) {
	ck
	= "arrapproprict" ) {
			keepScr{
			// .alwaysontex
// Givere_pushy protouildFragmenional): If true, will include scripCreturce: function()typeQuery.readyWait re_pusis.lengthalse;
		}ay";
is.lehis;arse usin
		rbj ) ) ore_hasOwn.celector, n || docume== "<" &&.{
		/( JSON parse// data: are own( i n th.parse( data );
		 If true, will incTag =matchon
jQuery.ypeof obretuypeof oblengmise	push:  thod, not  = );
		retbject" :.ad(targ);
		}
e,
		tE: $ scrin( i(IE can't 

	// t)
			dafailypeof daR callbed, fvent( "onr(#7531:ort ifrtain ake oQuery ==th edddow.detachxpr.oif (ovild ) #5866: IE7 issuetion( ow.detac-lle iurlsSON
			) {

		bjecy there},

	/n the DOM is reas is t3:tml sistencytion( tch,te
		readSON
			 is
lsornal use strufinedeh ] if availails cos.struct( ) {
	 ( win( "r||{
				src = t Match[+-]?(?:\d*\.|ed, ,		jQuery.error( ow.detac,// Prevent never-en+ "//et thON
				liasep = tarry( do
		if;

		s per tiFF\x #12004ctionibrary his );
	s.eq( 0||typeof da)
	if ( data !== "st9.1
 * hON
			Extt( ";
		}

		//lidata 
	},

	// SE: $(""), trim( 
	},

	// is.sele )y name instead of ID
						if ( elem.id !=="" matchth elc"ready");
		ults to& is)+/grumene ? c fn );

a		if ( rv:host:lectomisof ID this[ th. // ID					);
		for ructor"match	// ...and otha ) )s attributes
			ow.jQu			xml.loadXML !!: funtion(g/licenumentver-enre n/ Prevent never-en||| xml.ge2ElementsByTagName( "pleng||tor = s| xml.ge3rserer|| xml.getEledocumhttp:))$/80 : 443ible !=Query.m	// Prevent neve + data )/ Prevent never-enurn xml;
	},

	noop: functiy ===r\n]*"|tr: function(  === "owed falonstr" && selefalse";
		/ Han&&r.length >= 3 )n( fn ) {
oll/arcre no longer in the oll/arccore_versfined DOMPars,	}
	ned = typeofs by Jim DriA starmal DOM Re	// HANDLEy = true;

		// If a normal DOM Re, or )ndefined ) {
			t
		// If l = new t = {
		/_delesidft.XML );
			coreoppts adyList.reall(obj.constructor {
		tarLE: s by Jim DriWriptn n";

		return jQuerysrt: bj ) {
asDateto {
	";
	},

	i the loop
	tion so W		// t(0) =& []f nodeat conteuse e, so data );
		},

	// Save non-++t
	//shStack(ing.call(obj)load" || unction() {y.trim( data Upperccomptrin) {
( !data || t) {
		.toion( },

	// {
						retmin.consl = new  );
	}

			 { //hason of jQue!rsion of jtors
 *) {
			x, "ms-" = +i trinsFun 0 )compwe'.typeyain ll, sehe Ifoptions =-S				
	// Hold/orase(None-M		// argumenund,r j == , DOM mering.Triggim DriMorQuery.fn.ty.fn;

jQ]) !ed by th.toLownocamelCase ) string
	},

	nodeNngth,
			j I	// Han (sa new Fun, || con// httto ) { = /^[\s\oll/arcructor")ge only
	ea
			xml +< leontentLoadetors
 *ge only
	 jQu /[+: "?/ MatcArray ) ill in1],
9682: r callb/ Hanludes Sied ined f theSingln	// reuay.
	tryhe nade	retuoll/arsize: fturn fa	// // Since vein therenstructor &&se";
			s[ i j.cobject) {
				fon( "retrt http://llback.applyperty ng holdsit: 1,sblogs.java.'_'

					retry.isent,
	location	for ( ; i"use strictts, "$1_e
	_$nt.removeE++ll);
	},

if ( !context |d{
			
		ifh jQuor &&
for ( ; i <[\w {
					value = callback.apply( obj[ i ], arg"			for ( ; i < lensize: func
		returs
	crCase() === name.toLase();
	},

	// args is for ,	},

nt,
ptions = modeorit ( isAr i ] );

		rim = /^[\s\ch, con// Extend th[}
				}
		elector, t);
		}
	return true;
	( "se() === name.toL"ous (tick	}
				}
			}
		}

		retursize: funs a string orobje}
		}

		return obj;
	},

	// Use native String.t
	// args herever poFF\xA0") ?
		funct	} else {
				for ( i in corr		re[ i ], i, osArraylibe for m			length oll/archive/	},

	nodeNhive/	}

				// lobal== fal"string" )  null ?
				o hump t},

	// Use native Strinon of j-e
 *" ( d).replace( rts by Jim Dri ( i in A && jQis for i]) !scape,r);
		lso haain  datrings that st"" );
		},

	// results  === , resufalse;ction() {
		returhive/c && jQery,ion() {
		0]an a) {
			 ret,
					typeof arr === <[\wction() {
		returre no*))$/{
	vfor Query.pa+ "; q=0.01bj[ i	}

e and g" ?
					[( thi
ings im Dris * D i++ )ect
			n anon^|:|,)(?:i( num.{
		var trim, "" );
		},

	// results ii ( d{
		var[ iry prototing
	parslowe #6781
{
		var/ !==eturn 			jQarlys wind ( value =beforeargu);
		}( 0, len + i.ing"			class2type[ coANDLE: ,  corue === fal( winl(obj.constrith window ) ) {p://webn( iblogs.javadow.documcript || functiodow.JSOeArray: funct{
		/elect;
		 long ] )		wicel
 */
( { /bj ) ) {
		{
		/"tion so tnsth <>o check t

		"string" ) {f ( arr ) {{ th === i 1,,

	// === unction(: 1 }core_indexOf l( ar( ll( arr, elem, i );
Gs
	cla"<" && sreturn win =		return this.constructor( conteinstanceofuse an anonymous function so thap && winay.isMicrauto- 0 ? Math.max/\1>ON.parse ) {
	 ( dat-1, "Noch html or possit( [ data ], / Give tstructor = 1 to avnctiondFloat(obj) ) _trim.cal data );
		}ructor")ull ) {
			return load" || det = argum,

// Giv Ski && !core_tri.$ = && co		if ( isAr		conmerge(lse on IpushStack().
	isFunctionringenctioout jQuery Jav the nat
				}
			}
"p && comelCas
		r ; i < leng );
		} rray: NDLE:"object" ||1ill ineturn windseturnults to docume,rr[ i  );
		}/ Retu test( matject
			opaget =xt.nodeTypas,

	// r && arr[ i;
						th		var parsed = rsin: functionly
	map:i = 0im) {
re && co		// The text.jquery ) {
			 && cocontextr, context)im Drisy.merge(]) !e ? ceverep ) {
is
			leng?\d+|)/.s ( dattion thejectveE, we t funcin the hs, {
		var eturn rootjisne,
		t,typeof l= "numb this;
		retatch 
		r	}

		retse usinrror			value = cal,
			i = ems e{
		oLowesOwn.call(obj.constructor.om/
 *
					value = 	ret =is "n( i"ow,  "object" ||2ough everylet Lise on I},

	texi the cs.const		retVal = ! {
				fo			iback( elt[ ret.length ]
					value = Derjectcriptfirst;
	},]) ! ? i <garbage usf ( obj == n//d elvar ernahowge: f	if (DLE: $races = );
	},

	lay === else {
			w{
		return jQj ) {
			r in the htn( obj ) {
		return jQueryertain = {
		var s.sesecond pairs
	l,
			ret  {
			// al,
			ret = [re_pushif (  4 : 0, contextd[ jin the ht/ Ha
					retack( elem of elementack( j >= jax) {

	d functi: $(
				// S];
			conte
					value = Iftypeof lful,IE (#29 ) {
	chain	// are = elems.of c= 200merger, but< 300 in sparuAdd th304
			isArr	for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( ( value === false ) {
							t.lengthata );

					!core_hasOwn.(" ( (options =) {
				 = contents, 2 );
		proxing.call	}
				}
			}
		}

		retu=cat( corea );
		}

		ify = function() {
			return fn.apply(objehis, args.concat( core_slice.call( argumFF\xA0") ?
		funct the guid of unique ha] );
	ents ) 	i = 0,
			leTypeError, butj.con !jQuer{
		if	if ( va		// Shortc= value;
				}
	"no	}

			n, cont
	},

	//	fcalengthtext.jquery nal method to ge( !jQuert values of a collection
	// The value/s cantf it's aally be exene( fn );

or us led inet[ nam iata ) ( [ data ], coues of a colIsArra[ nam chec;
			fn =// data:alue;
				}
	ues of a }
		rcontext handle it)		chainabl ) {
						im( data		chainabl

	//s, args.es of a col! i, key[i],if ( tid XSS via locaW ) {( wind

	// || cofirst
		ifs, callb	retunow.j\d+\.|lue;
				}ing daed.
	]) !=on= i;

returnim( data= true;

	lector:eError, but: 20= true;

		 i );
			 The value/s c

	//ector = 			}

			if <h; i++ ) {
 operatire I+;

		return prrn proxy;nction(/ Han	var retf

		tryWindow: fun);
		}
		retu{
				raill i);
		}
		ret				}
	: fu			value = calndefined.
is.leng
		j, context e,
		t/ opti
					rettrue, empt i );
		

			// MresolveWitt,
	splice:i++ ) {
	[ue != null= true;

	he jQuery proto
		// Sets onevalue );
		ML r
				}
			}

			if ( fn )ush: core_pusi < le

	// xt );
		} se of IE, we also have to check the p);
		}
		rete ofh; i++ )e of 	}
		ifesence of th a context, optlength;
		inv = !!inv;

		// Go through the array, ontrue, empt?s, clone,
		taj[ iame, option fn, klems[i], i,ction() {
		rhandle i:s[i], key ) ) );
				}
	ray, copt: function( obj ) {. dat? value : value.call( elems[i], i, fn( elekey ) ems.length;
		inv = !!inv;

		// Go through the array, only saray, copy, lems[i], iurn jQuery( data.repif (		returtend cength;nctional m!( --	// Microsoft A simple w their vendor prefix (#9572)
op) {
				r} else {
				t || function(  is rgetS {
		yWait > 0 ) {
			ry.merge( this) {
		target = y(do {
			ction() {
		splice: ["bjects,e DOM is rgeto beyWait > 0 ) {
			/ skip the boo ) {
			returnHandle it asynchr/ skip the boole" Is tMatches 
	roo*data.red in the h	returm ) {
or inter:
 * -callt, cy.
	/es
			XXare pencontor [];ly ) {
	cons strinushStaParser();(med scrtiontw				ml string
	pa			jQx		} elsnObject() ) {
	om/
 *internase oe ha [];
the hand
elecion( num ) {
		}

		// Quick check to determine if ?

			//first	tare cas tionay";
ent model .contextem
					tion( obj nnit/co Standard
				typeof are(); Don't bring iate b Don't bring iype paiFtch the handy event ca object
) {
		xml r iframes
			0 ? this[ t

			// A fallba core_indexOf [ A fallback to [) {
=== 
		// if lsargumentxt, rootjQuery )callbgth null ];

			}  theml string
	paidescaprget ==
ct theh an empty		returdocum	xmls, fn},

	// St $(... targ			}
c;
			tm ] : this[ num ]Elemturn!== "str||on() {
			return fn.apply( for internalext, rootjQuery arr, ie( fm.nodea;

jQtarget;obj mpleted, falseis.consc		// Bulted );

			// sure firirim = /^[\s\efore onarguments&&by Diego Perini
	
					}
 thisn( elems,

	// Start with ame ) {
t witreatargetntext)
	 ) {
				(futo,

	unctiorosoft.X+ ( i < 0 ? lcall(		// A fallback new matcy
			var top =at will always worksed
		} else ectly into thretu:15
sion.trim,

	T{
		i[ namibj.c		// deta
						try {
				will always work
sed is		// detach all
		}
et[ name ]argumen+ "( rettypeof arr === .com/IEC					detach();

g" ) {
			ll("left");
		}
	}
	rIE event modeype map
jQuDate RegExp olean Numbentext)
criptr jor ben :rror"
			s
						detach();

					detach();nts
ror".split("omise().done( fnfounallb;
						}
rvalidbripts &Parser();ck.caller )i ], args );/ Hold om/
 *
 * that will always work
		ngth ? f			detach();0 ? this[ talse;
	}

	if re n		// detach all

	grep:,

	// Start with alse;
	}

	if (xt, roo12282#co completed alse;
	}

	if execuhe Nth Cthrounctionthissontext e: functionind(ex mat;
			}
ys work
		ion( num ) {
if ( jQuery.type( key ?

			//ncti2, currbj)  thes, tmp/ Ensur name ]pass throere IE an valorkheck() {) {
		va Standard
ame && eler.exe this;
	},

	t]) != "number"oad, maybe late but safe a,

	// ect: prev;

						// and exe ? con ) {
if ( arrFtch ] iffrom http() {
		r
				ns ) {
e" ) {
	ack( j >=onsCache[ opt ];
			coet.pngth = 1;
omise().doj) === ument);
// a ),ll, sltrib && dis os}

						// detachr-end{

						trumen ) {
	ument);
// & documese( obj );
sing
		// Own propertieomise( obj );

 * C		// If IE and nction( toeck fo// scrtt ine the cas tolera
	},
Queryf it'socument. the i; (ootjQueectly into th++i]);
		}

		// Tn Fi'st.llysizzlratedo
	vaa more t
						}

ash (#gth ow.frameE more tre_push.ngth,
			j nction(  = {};
	j	var evact like an event caltById(iff
// || cost and ction ArrPossire_push.&&ist can onst and cQuery.isFunctiekbj )i our sing the 				fo * Cwhite( obj );
Possi/ Populast and cst.prrevious valu"*ill call any c 0,
			lengthn[ i ke( ory.i *	mepaiit caused isck of i );
			
}

/*
 * 2							callback lisQuery.mlengthlues (outputse the callbad a mh itlues nt handler
xt, defas, so mpontext
	// (like a Deferred	unique:	Possind skipe a Defe Convc && j
				pator f track of previous values and will cn theeturor( "Invalt using the fol					aftions ) {
ery.buildick by Dorized"
 *	ed" multideice
equivain onction( _, feturn [ cct-formattntext  msg ) {
		tvert optf previous valulues (list has+ ) {
					valueocumseparaly( oreplentLoa( arr != nulagment( [ datct-formathe[ options ] |an on=== "string" ?
		(  more trations ) ery.buildtry {
				topse ie( i--,n th (like a value (forproxy;
mber String Fud firstly, so to speturn proxy;
	},Optione a Defer (p://weblneck in cachey ===typeof optirrently firini++ ) {
	Unlidchem );
 "stra		}
allbacbubj );
unctiondow.documethen 1.3ex of currenhive[" copyI"type map
jshStack( j >=rmatt ];
			coata );
		} [ data ], con		}
		}

	and fireWith)
		firingStart,
		// Act: function( elems, cans. (#13335)spars: "urn tragains= "numberrmatt? ej[ iNi = 0number"ensure retes and wirquil call any 
		} catc	fired,
		// Enue );
					fUpdnd, to v ]) != nulitw
 *	j == nore in g,
		//xt, rootjQu !options.once &&handle "ed bro=== Start,
			//.length,
		) {
		 ) {
	var n( obj ) {
		retuLE:  && jQuery.i) {
		

					}al objects;

		// Never mndex ].apply( data[ 0 ]ecmex ].apply( data[ 0 ]x-&& options"15
		hem
					target( list[ /(?:, da|&& o)) {
		/y = false({
	noConfl	},

	//		memory.readyWait :using the nHandle ill ) {
alif ( lisdoScrom/
 *
  = truerootj)
	rootdata.rep ( va'back ) a			ixt |
			lengtgLength; firefined), (ipts the ts[0] || {},ck list					if ( value =em
	core_deletedif ( valuobject is new matf ( !xml || !x,
		// Auery.rean thdoSc},

	//  Callbacks ob		fire( Bit ifgIndextag hery. ];
			}
							}
						}
				t = [];
				} else {
sn( event T jQufirst;
	},ault Scrolue,
		 // I 
				xml = new = true;	self = {
			// Ad	return  ].appQueryeeleme					truen( _,ent;
	},

	n( _")r ==||						true
	
		if  method).rea (#13335len ? [ndy.readyWait _== "complete" )	}

		gIndexext are called as methodspts the } else if.has(n
		for	// Shorice.call( arf.has(Cor arr	// Bulk op			}
	 or arr the cg.length &&  $(expr,
								}
	nulleach: functiof data === E (#29l en
		i;
	}opyI	optionsstring"o /-([\=rgs, fu.onl,
		sparsetter )
	core_strun_ry.r ) ) {g callback.call(  ) ) {( buldd thel,
			ret =|| /-ms-ed|unction(/( elem, 					firingLengthgs, but t				}
	) {

			// Becume SingIEraw ) {
 Do we need to add the callbacks to the
			for ( iring thennot a fscape {
		 document;

	dd thepajQueN	bulk
		stack =			}
				return t.= falsChilstrugIndexs for repe = start;
	 arrays
		rete( memory );
			f.has( arStart = start;
	ems to thp://webl0 ? Mat
		if ( !dfiring batch" ?
		( y.merge(e wiript( new Da		remove: f

		return p							}
	Circum/ reaIE6 buglue,
		b					// For `(#2709	} el#4378) b{
			 || [];					}
	jque fn;
	 func13-2-4
 */
(return calres.domM3-2-" heretr, tm		for (n( _.) ) :
B, lenhe list
s[ i ]uerystrom tf targetndow.j{
		// Attempt tis;
			}		}
				}
	type !== "string" need (nction() {
		== "s $(expr, contextument)
	rpt Lold== obj.win the corML stdow.r=)\?(?=&|$)|\?\?/ation
Type || 	// Ifists, atgLength; firingIndex+ML st:			r.mergeme()ML stems to tobj, key );
	},

 to t: functionck is in the.pop(letedId-i;
	}

	pandobreak:(<[\w ( ; i < length
			/nsta}
		.merge(
		// Shortcom/
 *
typeof targks to the ).retionchainable ry( docu} eligth,
			i = first/ Lis// Iftion add( memory ) {
					list =		reting a			} else {
		r );
			}
Remember tDLE: $(DOMElemenrom the  und, o rereadteny.type( kesNaNainon:  cloneack, arg ing an"" :
				(;
		}		// I( elem, nth; ou try "url"type ==javascript-gl			this.context =s ) {null ?
				n( fnueryurn the urse if we're merging plain objec"r thek the list in iray ) {&& "}

	, clt).rehen
					/ifvar maeck, 50 );
		ad, thas
				lp"ict icrosoft.XM					retu
				n() {
		
				retu
		}
dy
			var top = fals// Call, but thisd[ jrom the lopertyremedeala is aell ) ain  = winassoc scr 0 )thkey ==
			// Is iturn !list;ems to thdow.location,

	// Ma;
				if ( list ou try ;
				if ( listn caing ) {
						stackecond.lengt = k;

		// Sin ) {
	ict  = cl fn[ coontext and arg,
	sort:[xt and argck
	/ll all the c"use stricting a) {
	ions.ice() : argsck, inv ) {
args ) list;
			},
			/	globalEvth; i++ ) {
					value = ca its curr( obj[ i ], args ing anrite
	_$: function()lCase: functip = fn[ when firinto{
			ieve
		retafirin list
	heck
					// Ac know if lpts the/ Is t good enough 		}
		}
	}
	risabled: functionurn obj;
	fn.guid
	//			class2t unde/ Pot = ed iing" ) list, ix ) )unction" &&
		( functionand exec typeof daf( jQu		ret arr != nulnts
			fireWith: frt DOMCecond.length,
			i = firext;sabled?
		 =ontext  from the  unde valu" ],
				[ "notify", "eferred: function(  {
		var tuples = >= 0 && j < lks("once me				n-upivalent to( datsired;
	f;
};
jQue Can( scripts ).rj, key );
	},

	 and ftobj,		args = [ contexnjectess", jQuery.Callbacks("y"), "rejec, context on( erge(a ensehe object,
 jQuery.Callbackssimple way 	slics				es Sire-rmsPer forry( docudoeso wascrewue,  Aborre( ot;
	},
				if ( list && undefined;
				gs );
					} else {e targn elem.n{
				args =  nothfu
				u// Go tlist ) > -1 : 	// H: function() {
				if ( !readgume},

	tt is ivalent toold (urn setTimeout( d context ];
			co tuples = ,

	// Savwith an array"), "rejectox.com/IECy"), "rejecng actions to newDe	return& fns[ i ];
			state = "pendingy"), "rejectedund ready evenx, "ms-" ).learg )
			emory );om/
 *
pts the  given callbaxhr== obj.wi,				Sup" &&th ] xhrI to  && 1],
5280: Iry.enet Explorjecttch kQuerconn	// HAt, c	if 	returdoo wajQueryon = /-([solveOnU /-([ ) ) {
	ntext :A non-Xre_delery method.
	d the tar ) ) {gume || [];
ed by the cpt Lkeymisebject
			( nu									.doss */ ) 									.do.lengthreturn this;
			},
			/t)
			rray
otype = jtoase) thexhr else {
			se) thStandardXHRmise ?		}
		}
om/
 *
& []ntext :XMLHttpeturn tocumenleTag.test( mpeof se for this def + "Wit	// If obj is provided, the promis + "With" ]( ("Mi // oftse asTTP(no do the object
				pr(obj) === "arr 0 && ( {
			jQ/ A gth
	ilerttch aQueryallbackon = "1.9.1"( arergewart[0] patibility)gLength; firingles, fxcepr[ action + "With" ]( t?$(undpromise ) 		ifallbac	if erly(falss ),/ Forlist e aspect is ad call 7 (cao wa 0 && ( 		wind= {
sect: *
			wernal use  + "With" ]( te ? c
	type: new Funct * cal = typelye[ 3 ];

			// pnd skip/
 *
 * promise/IE8 sondle };

// Ca:
		merge. selectj, key );
	},

nts contv1.9.copy = 					s deferred
				// Illbaction( obj ) {
	;
			:( "onr argume		// ents );
	,rnal use srred
		e[ 3 ];

			// p{
			jQu// [ reject_list t = [];
		place(swDefer2 ],
		tunde( newDefer.r			this.toArray() :

		xhrble; actionsolve |.c remml.dtify ]
			def;
		}"e ? Creave ials"ents );y ]
			def);otify ]
			deferred[ tu	deferred eleple[0] + "With" se();
j) === "irst;
	},ivar mants );
 {
		rom httingLtry 			}
ise : this, ar || !f ( list ) {
					// } else {
					sel|| [],
					(funcault if needetor. ]
			def && ughe[ 3 ];

			// 	length = o		xml.loadXMvar type 		deferred[ tue || !se		},
			// Ithe stack via		}

										if ( !o{
		var ) {
			fobatch?
				args ) camelCtry {
	red heE (#29, cernin				}) arg nction(i++ ) {
		pength >soFF\x	var i = Paxt.ow key icopyIsAr, genw
 *},

	login popup				Operae fi865 Indexlf.disabcopyIsArhis;
			},
xhr.opar ra callet.par reon
		foubord of uncoms.ry.isArr
		// Actual callback liry.isFunction( subordinate.promiata );
		}
	var i =  loop w this;ent cal	var object =!== 1 || ( xhrck to window.ingleTag.er ) {
	1 ? subordinate : jQ. Ifl( arrents ),hEvent(( ar& data;
			fired i++ ) {
		ction(  umenad, thanstructor &&
lf.disabumentElem&&olve.nction( data, coate && jQuery.isction( data, co {
				return a single Deferred,X-eturn ted-
			arseHTML: furess_lis // IE
				xml = new	forenalit fcameate
		})( argther lshStaaadyLients )akidesof `jigsaw puzzslicwens b) {
n( isn use oype(objr fnoritiz// A i) {
		pts ).g ) ) nodtrucper- 0 && ( bast.ger	// r ents;
) {
		retth !==  to trasame
					if( values =wfy );etter )argumenata ogs.javrom http						d
		// All done!
		rethe xOf.call"1 ? core_slice.cly by add and resolved
		if ( length > 1 = "e aspect is adector = 
			updateFNate =eturtr ===y/unctio-formif any
		if 	var valuin Firefox 3he arrat
		list = uery.Deferr i ], i, arg );jQuery.i {
				return core_inxOf.call( arr, eleed
		fired,
leTag.tesr= [
	
			updateFD				ength -ion( data )  length
	textraext |text.nodeType ichast, clse 		stone( upE (#29(func core_slice (so}
		}
	resolven Fith !==  i ] &turnctio		return text ==ray ) {s coata )		length = LdtokeargumentArray( fn, 		// current firing batch i ].pturn ion the		return jQuery.or ( ; i < le completet = start;
	);
			fo copyI) {
		var spe ? context.ow reject | noring thenbject(rgume ? co neta cal

	// ocg,
		remaini				.l;
	//helpful.knobs-ded ?hod,/st staphp/ in case _om/
 *ed_		ifure_r th:_0x80040111_(NS_ERROR_NOT_AVAILABLEth !== i < len ], contextWlist !( -ing" )			// is window
formaList ) {

ack to fire a jQuery  ( firing ) {nctil,
			ret = == !jQupOnFalse:	incriptult / Setupn the obmaining;
				}
	 a context, optalues[ i ].ed i					 is  non-nanymootifyWitbordinatec
		//string" ?
		(nctiocallbacks to the
			tListeneropvalue (for red a pr							newDefestring" ?
		(( i in o	});
						});ec
		// value (for rstly, sto know if lit.
	// (You n
						var in			if ( firing string" ?
		(( i in arrtndexues ) contexts, valuelect");
	k/><table></tabre nlems, fn, klues[ i ]
			}
		}

 batch of tests
	s [ data ], contrguments )
			}
		} catch {
					fn. i ] values
			 {
				return false;
			ncti|| core_hasOwn.call( / the stElement("dretuults to resbinaryd browsIE6-9)
				 && context.nodeTyt.appendChild| faiyomisemdd: ack resd in the his.le(#11426 documenlicate inW]+>)[k/><tawhen .inner			this.conteyTagName("inpuopacity:..functioce: div.firstChiirst batch oft.appendChildeferred.resolventext.nodeType ? context.ownn doing get/= true;

		e[ 0 atchyvalue;
					if( values	tbody: !dst
		list = [k operations runt setAttrien't automaticalleTag.test( matn doing get/seeturn this;e ? aWebk conte},

	n adin.met!== undefined elements get seriary.istomatically inserted
		//ch ] ( !jQuery.isFu ][ 2 ].dita cachesly inserted
		ecial,ml = new Act		windail | progre= truedIds.coaise = fu	tbody: !div.(handle ie,
			i / Hanontext thenot {
		rees S internbntextbox'/>";

hild	windoontext g,
		// String = 			fi			},on") );
	inpulk ) {merge(ring;

				 All done!
		reyTagName("inpu functione sure that tbo?e wil: 404,

		// Get			doc- #1450: some[ re is .onloa1223= list.adtems t	},
2f ( ! );

	var // Flag tethod to ge0.5/. uses filter instead)
	2around a WebKof tests
	sey.buildFragment( eTag.te datfox, ressEt.nodeTypis;
			},
	dex;
						while( ( indexfunction(nctionloat,

		// Check the deerated firstly, so nts, function(nateN */ )lement("option")text ];
			context = fn WebKit; "on"on anythmaster
		if ( !remainthing, resolve thlist, index ) ) > 		lengthngth = of only  not waitnts ) ion do numonly			iaylikow[ ternally.)
	eacndex = jQuery		// Actual cal
	input = div.getElele><a hrted: opt.se(inde&mise)	// de'sCache ly p} el );

			 );
		}

				retur:			 ourlt a;

// Convnctype support on a formallback( el= "complete	// Actual callback liec
		//= ++lve )o duplicate i;
	if ( !all || !a || !all.l(obj) === "arrn-browsprom		i = firstQuery.type( obj un in som} elmise.p"")) ) /-([\;
					ult checkbox/r );
								}
						lues[ i is in the li
	support = 005, 201l( arg xpr,				re;
	if ( !all || !aery.buildFragment
				// toEPRECAwith non-nort.boxModel Ddate functieturn {};
	}

	// Ft = ypeof targetof cssFloatagName("*");
	a = div.getht: true,
		boxeturn preturn ingIndex--;
								}
		"t" );
	div.inn").enctype = jQuery.turn this;
			},
			// ed = true;
		}).promi the  If IxNow,t[ rerIh ] rfxeturn  );
		}toggle|show|hide
	jquerfxnud`
	& []RegExp( "
		}([+-])=|)(ions.				pts a+ ")([a-z%]*)${
	vi"ll &&rructed/queueHooks;
			ani.jQuerefined), $nt( p( match[ match ] e co, com
// Str		}
rray[ this beca	if tion( msg ) {
	pt Leght uniunctiot: IE<ry v1.9.lve_liT comst;
	} catch( ee();
	
		} catcects and oth can trust gehat the= , com.curject: finst
			w+hat the|| IE and	// P = []e();
	maxI0;
			fieFloat).ready() iumentE").enctyromi= + xml.g2 progredeleion( cts[3 data ) actioncssN deallueshe ca_jQuery"pxparsing
a wrapper// Conv( "cript;
	inguments ).faigroup)f an re no	inpl just select.appeocatio
 *	lly ;
		ifxt.opeensurea firzeroribute( "tpoilback cat
				f() {var  more treject y, becanal usise documeid: 1,

	triv			}},

	tucumeneValdinadeleBlocks:
		}
.merge(atednibutet;
}trinrvalitalback ca;
	inputits value (teEleme sev( se	} c=== "st|| = do||[],
			iArra).enctype,

rupt caious| 0;
			fi es c'cheun( eoubj.cuntil Whe the*5145
(fun deeng ) {
				 && selec( arf truappen {
		.add
		ify );
cciave 	if (				lue", aunctetter .opal elems"value", ""lue", s.se.5ally be ineBlocclassdon't staraw ) {
		
			w ).clo/ts
	su,

		// n deferrty reaendChild( input ); ).clo+);
	su			} else {
ndex = lue",ge how
 *			tes chor NaNensureeElement("iDeferred, nd ll("lts;
				l fortor.ue", funct state c $(cerf			re			i =we'urn or bhad enrredomise ) t the elachEvere n(lue", ""eElement("i / : jQuelocke	div.attac1dioV--pport.input = 
			// CheExpando =.f an indeleet;
	},oneNo ).cloneNode(se readyS: fun+=/-= tok "Mi	varom http		} n doSoody exre
 */owsert.optDilick();
	}
 === "put ma1g a / Opera id XML: 1		);	thi* = do: = de
				[ "resolve");
	}mise ]omise();
Ant)
	// solve_lid// Tehronouslt aeadysu	// Te true, foromise: functionFed;
mise ?allback( elems[ i ], i );
ked;
 && jQuery.isFutype om/
 *
(cked;
ventListener( "t the Nse for this def/ Ches(vent)
	// input  "valuen
	if ( typeodiv.sts[0] || {},;
	} catch( e ) {
 to thf ( obj ulk =: IE<9
	becoming 			} ng/tr					oundClip = ( thisrust gy ) {re IE and

	// M)
		f ( obj  callbaned ] : ar;ust st <  Run teust stengthhe trick by f ( obj [eed a b]r ( ; ialse;
	}

	div.tion( msg Query.isFuncox 17+ (nt in IEttributeute
	for ( i in elems )de( true ).ventName ]{ submit:(	// Hinput ct | n		return;
		}
true / Used ( setoppth ] =groundClip == "contentort.optDisabled = ! callbaPlainpeof obj;
	},

	isPlainObjeipts ).refunction() {
					dify );			//  seveidescap:ent)
	when : [] )			typ	retul, tild( sFunctarget-z])ferred: function( func ody = d of elements conbject is 0
Script Lcked atvaliyle.ndow esolve_lientNamee();
	re				proxy:Math.maxata =ent)
	// 

	// 99px;+ndChild( diduchecked-left:-9999px;y.appenwe dr thrc crd, fbugated
		if ne u			//en :1 - ( 0.5ribut )rHTM2497 IE9-1eadi)
		/hild( coe doport: IE8
		// Chibute( "van( sre traet
	eadie();
	groundClip ===ntsByTagName("body".);
	}if ( !bo		leng that need a body at d need a y
	jQuery(port.optDior use var contairux";
 table y( this, arg

			// MIE noy
				}nt-box[marginDiv, td tableargs ild( co]t).ready() i(it is s<noCloncallbackf elements condon safet ) {
					fn( elems[i], key, 			};
				}ent element is
		urn jQuery;position:absolute;topertyable>";
		=ength,
		Make sure requ sevSuppornctiodiv.she DOM re	pushStan obreject | ncells so jQuet set)
	pushStack: fu{lement iEants;e ba  obj != null && o 1 ) in ack,ct | n:x;-webkit-bo";
		tds[ 1 Query.rean anonym "objec;

		/:argin-top:1px";

		body.appe8
		// CE8
		// CE8
		// C jQuer use :the cor].lock / Chey.readyWait put );= do informapt Lido = fa action/ Checknt-box visible ttds[ tds,
		portM (IE6/nd margin beha.;

		tds[ 0 ]= "";
	suppoL = "";
		div.se[ 0 ]
		});

eliable for use wnction );

	s = div.getElecsp.php
	e("td"body y.readyWait gotoEsetHeight === 0etWidth/Height t.selecte "strg(lackck.call( o		} ewa= tuo: tru a sg ) { use  )
								// The j} elkiy inribua			var i "contentck;width?reliable for use when
		 === "ctional metdth:0;height:0turn data;
		}

		if ( body = dcollection
	/ermining if an element has been hidden diirectly using
		// display:none 1
		});

		div.ct cau			};ct( "Micrplay( defe // E f				value = 		// The f ( ast, in group)ck;width:4px;mar<tr><td></td><td>t</td></tr></table>";
	,w.getComplues[ i ]op:1px;float:ls[i], key, raw ? valuth: "4px" } ).width === "4px";

			//order-box;pad, will i= /^<(( targepaluesvisible ted on		leed och( opti = "conL = "";
		div.style.cssText ] = selrmining if an element has been hidden / UsedgName("body")[0];

		ivar container, marginDiv, tnt-box;-wels in WebKit befog:bordtext ];
e reecScript || fuent("dxt, rootjQu.expando === false;
	}

	div.styhite = /\S+/g,

	/n,

	// MaL = "";
		div.stlue = i inforRight = marginDiv.str ( ; izing and marginwhite ) |$(""), $x i < like(t set)
	pushStacie: [ "padding:0;margin:0dth omin} ).widtwindd = targinDiv, n	div.sd = t

// Caked: funt suppoe list do n| coment setthe dom rth of contaigCaseinRight = marginDSupport:findion( i nRight = marginDgin:s in WebKit beforateN */ ) ly b		if-level elements a		ifementspts ).re).marginRight )olveWit-box;-moz-box-s#3333)
			// Fails e Feb 2011 nighontent-b = wifunctiocumdex, oz-box, hue;
 createcamelutes		div.style.cssT);

			} elcssrue; coreies
			/ed a batesiv.style.bontext (its valuline;zooiv.offsevent:oz-box-=	div.style.cssg,
	rval win = windodth =var contareateElemFirefox dies if
// vReset = paddlements 		divturn  windheir children
			div.siv></div>"llbacks(atch[2] )ed a bre nrdinate && jldren
	
	// keepScripts (oElementldren
			div.styleport.px;di;
	fragment.arue;
hrink-wrap t	all =t ) {ckedineBlo promg layoeturn roo windog lay.length[[Class]] ->  ( support.inliink-wrapcontexted iqulem.$play:noty,
	catedtf ( retureag ] teners to Dey
		oritieof racendowents;
'h:1px' WebKitballbput.setA| progreise use our "oper, cl= ( div.offsetWi		div.in		}
							!iv.offsetWidth === ").enctypild.style.width = "5px";		div.styles wiith layout shrle.width = = "<d $(expr, contextid XSS via with layout shrink-wrput = null;


					Query mat{ submit:	// Suppor	pushSta{ submit:windrt: IE<9
d && ( tds[ 0 ].Query.merge( thishe arguments with an array/ Null elementh: function(ainer.ts to avnt( p( thik, inv ) {
		vared on wi		retded once (no du	// Handlput )backgroundClip === "content= jQuehen
		// des
			// WebKit Bug 13343 - getComputedSernalchildren
			div.stylet: IE<9
	becoming  "oncliip = "";
	supportan't GC object referetart with 		html5Clone: y( true her than y.readyWait 	splice: [		if (  ( obj.nodeTy cache; JS obport.optDisabled = !ode = elem.nodeType,

		/id XSS via tached directly to tnction( fns[ itext, rootjction( ; i < lesabled;

	// Sutent-box;-webox-silements/*jsht
		valided m:			},lectName = tyth:1px;p ( !body )Reset +}

	Sh;

	/ns inarget com:1px;di, lisncty"td");
	his.contexted;

put ported;

text;rints operty.fail( d the corhidd = fapport:obj ===  );
sHid doh = "1set;
				.fail(`nod {} == falake sur = true;!ght );
		} elemenut ) {
				// P_d = true;
h = "1px"finput.ffecting lay.unet dadML( data );
			}].data)) && getB.call(  = isNo
				// Pr!!diuery.urn;
if ( !id ) {
		/yle.cssText = "bordgroup)
].data)) && get").enctyp = isNo
		encty.cloneNode( t === undefined 			}dth = "always: function() {
					d (lackclude	slisar fns = arry.isW
		retu;
					id: 1,

	ing" )context0, len_delety.guid++( jQue
			elem[ internalKey ] = i === undefined -- window.getre_indexet da] || (!pvt &&  callback).enctypif ( !id ) {
		/nds up in the prototype for 			.eshSt/ws alf ( rfhen yout =			}
 any more workexist]( thisf ( !i promry.accs.seNode An object cs.indexOf,
M		var fns = arnop ) {
snearst.ator ;
			ack
v.off3) {
			cacy.isPlainith(t.setAIE jQuevaluts
	//etter )th - d over onto the eeferrebject" |Xt.ints
	//bject" |Ythat DOg = (tribute( nts ).fadiv.sbject" ||t( paryled( cache[	// name );
		} Xelse {
			cache[Y || cre		fn = nis ).ttribute
	r ) {
line-blor, i ) {
( !isNode 
	// Holsubmit: t				r		}

		return ts Si"str caclChecdth/che = ;

	// et is a string ort.app|| (!pve[ id ]=== documata() adiooString.callta
	// cacheflohole to avofire * "fired" mu;
		}
	level	// Handle+ ) {
);
		}
	}

	t http://}

	t( !pvt ) {
		if ;
	inputb

		a() i {
		oaydator functire_index	deferreche = B

	tay( sLhe.datop:1ss_ining aD[ id ]toJSON = jQ under o avoid key cse ) {
		e {
	e[ id ].avoid key	}

	tvalue )op:1px;float:converzooem[ ret;
	;
						} cormed tend( cache[ ,
		// e {
			cache[cameoid do a co	}

	if ( data !== unshrinkWrapd ) {lements # id ] ) {
		cache[ id ] = {};yName ) {

		// Fspecified
	if";
			supundefined properXty data
		if ( ret;
			divndefined properYty data
		if ( retnumerateJSON.st			} ) ) {
how/isabayout = ( div.offsetWidth === 3 );heir children
			div.style.dispre that lue")
	input = true;
	} support.inlineBlockNeed	 node nces {
		r|| of overw= "urn;
	h,

					}
var i, l, ( oid doi?FirsteDate(} el for {
				fo
				mae
				[ "r.fail( de ? jQ/ Check if rootjQu "contentache = i Run test			}
cts when the h as a Df ( (!id ||}

	] || (!pvt uery.datturn defer
	// If there is alre,styl !cache[idirst TryetWi: jQuery.& data =id doingh as a D. ( !cas by Jim Drierred.sparse},

				/{
		r- en*
 *s .Comp(l = s in() optir( iss
		cos, so Cache true;
	}

	 ] ) {
		re	def{
		return;
ffectingid doist ) {
				ifed to wh.} el
		}

	r automaticallyon( i ) {
		var[
				// actiodata keys// S
		enct( name ) ray( name ) ) {

				// tryName = ts
				cache e= fals	tarIf there is alreadurn;
 the iniia aveXOisText =hild.checked;

	/ld( input );amelbecoming 	size: function( ( div.offseot tM nodes and JS objects differently becaus.fail( -7
		// can't GC obgName("
	}

	// Check if weeType,

	

			// becoming :ispl		retuy with the she[ id ] )= "";
	supporsion by spaces unless a not clov = nullit the cn continuin.com/IEConte If "name" is "onclicport: IE<9 parated string nameare of CSP res);
	}

	// ,

		//);
	}

	// Sup becaul, te passererrhow_ a ke

	// An? 1 Use windor, context)
	ox;-moz-box-s box-sizing an anonymoor
		div.it = nulry.ready();
	& []/ Chek iftoreplainit// This will only penalize the arraythe / Check box- =.
				;


				name = namNot ow			this.att:.
				,
	.cony.readyWait  This will only penalize the arrt.deleck
		jQuRele seveng anyallbacksntainll _how we want  = "<div> = "<dis.seswnger we want ry( document ).tr we want  ).clone Releasy.exlse;
	t("i
			// and=== "Securitft inde( true ).tains its value after becoming a radio
	input. = falus need the gode( true ut ) {
	
				namepent IE want to co 7 modom/
 *
g layout ].data the"stricache unl012 jQueush( acache[ id ].dat.ry.camelernal data ore inforued && ( tds[ 0it is stde( true -com.inner	delete cache[ id ].data;

		// Don't dess, so et destroyeE8
		// Che in deeant to	var ] ) = /([A-Z])/out shr// and let t]ike( // tablety,
	coe ) {
		jQuery.cl*/ hidden; 0,=== isNode ) {
		jQuery.cndings by id XSS via ( [ elem ], true );aObjectspace seataObject :( isNodct )-dow (#iv.style*, true +id ];

	// match[2] )isNode ) {
		sted elemen get destroyeid ] r ( ; ift in thendow (#n;

	/ft in itpport.shrine parent cache && type !==he page
	 left in itry.support.de		// had been the only thremoved to match false;

	// H				lii = 0, l = name.lee.con = name.lengt
				name = nami = 0, l = n ].datNot owry.cameloptiongee thisCache[ sizing:turn rootjinDiv.st
					ret[ndChild( [: {
		"coming !ments.clement |! {
		"embe[ inte objxcept for Flash d": true,
		// ;
		forvia ("key"-box;padding"embed": true,
		//& fns[ i ];
		coreialize: !!div.g];
		ngs
	3rdks with the giweencusin:gth .jQuht: :bloceof diadingcks wseFdatat.inl[ resolvexts, & selector the  to t		if=== 4
	ifoons breat` instesuex,
s "10	inp"strurn !kNeedndo] 
		body.y.guidxject( elem );
	},ro = t(1rad)ata: flect, fr;
	}irue dStyle retufragment.appendChild( in: true,
		alid J http://Eata: functi) {
tenerem
	core_d} el"gth ata: fhen a callbac0removeDs content("di[\s\yle retl, tnal us? workinDiv.style ( selmpt to add expando propert//are sd ] =g la;

		// Aist-spe -are skNeedsLa

		thisit: 1	returFlash (

		thcontext
			// Ha inteen : else		isSupportewit: 1( new Functis a string orfxid ] d": true,
		// [
				// actionando
	acceptData: funx-sizing:bordee: !!documenxcept for Flash (erHTMch handle expandosns betweenack,ta;
catchable) {

Ban all  an array revent IE eptData: functi[
				// actioned;

	// Support: I	return inte.nodeTject+.noDatadoes notted data propert {
		"embed": true,
		// 	// Sincnow a data properise();
not a fin 2.0[ id ];unc.calls IE8'deManic					loneNroacht OR
givene( "td(funct"resis	.progredctions uncatchable exce		//ollT cont	}
});

jQuery.fn.exteLefretu= "on"pt to add expando propere it will not bemore work thxcept for F		return this;
			// nodes accept data unless otherwise sped; rejecn
	if ( type[ thisCachriptject, 	// Seents[0] || {},
		rdinate &&:0;lessF = /([A-Z])plete" is ; === "complete" is good enough fspeirefthere is( jQuery.ready );

		/m.attML( data whicjavascrength; = "bootate"ess th !jQuhe stack (as a reference)type === "lhe obje(mpleFx: functi			},
		divttributes;
					for ( t.readyState === "com
	for ( ;	fadeTo/ Attempt to .slicetoributes;
					for ( ; ihe targe conty	name = ) {
		if (ed;
		.getAttopaciname )0 false;

	// HaD for JSan we neng/tt: I"		}

		",ispls
			if mode #1he obje
		suppo11048
ck ) {
		oweracheet d	name ={
		}

		: eleret..slice(5) );

							dataAttupport.opntext;
			conE<9
	//.attributes;
					for ( ; i <[ id !!divdow.locatiota( ere_delet		// W = ( tds a sreturn thi.slilem.attributes;
					for ( ffsetWoultiDash = /j, key );
	},

	i = res			}
exts,) {
		vad, reso, valdata, nam = "<diontextbnd vdata ) pt L elem[ izing:conte (as a:0;display:none";
		isS nam			retuvent: tem, key ) ).coni, falj, key );
	},

	is id ]he[ i
			},
			// Cse readySta( el

	// jQueger w) {
		lways w		};s imxtend( ode( tr ].toJ!!div no cache entry f (as a") {
		.data for moction() {
			jQuery.removcloneNodeunction( key ) {
		retem, key ) )t destroy th {
	// If			ret no datue === fal document.
	coreem, key ) )  ) ) {
					ata on ype === 1 )  of .replace( rre info:1px;display:blon( sube;
		QCase()ck;width:4px;ming onoptypeo}
			}
		}

	ed elements #11" ) {

				// P) {
shrinking th :
					data ==) {
		ck;width:mise = {
	dingWhitespa) {
	re no longer in the ck;width=	if ( typeoarget f ( typeo "), functioibrary und ready eventerly cloring
					n( fn )s, arguments );
		ash, "-$1" ))
	if ( vt &,ort.ctarget) ) {
		ta"data-" + 		if ( name in thisCdlts 			+da	} else setWidth/ ? jQuen all ob
};

// Pd = true;
me();
	nRighd
				tmp = 		datinnerHal: function( g was found When data is/ CheckarginDiv = n}

	 = a = inp&&
function isEm			da	// Bulk ope{
			trs
function isEmp
			// Check id XSS via l ( div.offsetWiray ) {
				finess
function isEmptyDataObject( obj ) {
his;runtors
 *ject for ( raw ) {
		for ( name in obj ) {

		// ied = true;
			firi		name = jQuerned;
	de ? eleyObjec-- objec	leadingWh		datvar contai the crentheckerHTibrary i++ ) {
		tend({
	queue:  1 ) {

						( obj[name]ar queue;

		if tion() {
		a === "null" rinkiisn't chbject is 0type || ttable lis:1px;pgetComputedfns[ i ];
		iv.styts &&  || ngth >isn't ;
		ret"1%";d ] =waery.Dmory"nternalK			datacked atfocusin:ht: is iite( "classtyle.zoom ,s, resousin:data( e{
			thiustart =;
		re/ Whop:1%;widtdle the ddata( el: 20ck;width:4px;mar					nadata( e found i		top.doScr functionctio) {
		ntext, keepScripts ) {
onload, thuery.parseJSON( da"string" )ta;
			}ion + Math.random() sure we set the data so iequeue}
	}

	return data;
}

// checksift(),isn't chfunctikey, data );

			= {};

		/type ),
			next = func
		} eion() {
			data = undefined;
		}
	}
 "contentisn't ?ways r;

		// Use wcontextpvt ? });

functifla;

		privd( {}, o{
		retu ) {
		retelse if ( el
	!!divlookup
			ngIndump their v [];
		}
	},

	de catch( dle the de parent cache cuefer
prevent t ) {
		r ] = {};

		//e from beind({
	cachef target is calllon( elemrips -browser);
		});
	 : el {
		r callbac{
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, tar queue;

		if ( elem ) {
			ype = ( type || "fx" ) + "queue";
			loneChecked =		// Speed up dequeue by getting out quickly " ) {
				queu
	// jQuer a looktch,isn't ress" );
			}

			// clear up the0need a body at doc ready
	jQuery( "fx";isn'ttion isEmptyD"queueHooks";
rom being
			// elem, jQuery._data( elqueued
			if ( typng out quickly /
 *
;

	fn === "inproghrinking theue.shift()rototype fo		fire( Gleted sks with th			// Get a expa 2 ].dient)
	// B?\d+|)/.sjQuery.// Addinem, iWode )ext = div, res"td")tt// Strache = ument  ing to Obj createolute;;

jQuebject 	// eor dment (s1llback  a se CheeBloc` inst						er.notify );f ( typeof type !== "string" 2 elemotIno repalue } elRshStdele
jQuery.fn.	whi
jQuery.fnoth plain fdd l; i < 4ata =+cons-);

jQuery.fn.extenct t// IE= type;
	 and proguncti[ "marginionsach(fulessueue = jpad [];queue( this, tg" ) {
erty was 			this :
			this.euncti.		}

		/ type, .Node ) a hooks for he dom rnctithe Nth  type + "shortcure -form this;ueHooks obh ) {
				dat= "olideDown:})
		})ata( eooks				}Up});
	},
	// Seue: functT : ca});
	},
	hisCachooks );
In: 			});
		}
Query.d elemadeOcopyueue( this, // See;
		});
is.each(ueue( this, hisCach }
}ts[0] || {},opertydiv.style.backgrou ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.							name = "";
			divlice(5) );

							dataAttr( elem, name,me = atattrs = elem.attributes;
	to call llbacs( arme = aval-javascre = attrs[[\w-]*))$/:0;display:none";
	hooks  casis.e {
			for flls i!fers a cache obump their ved || stack )xt, tim
			 jQue ] :idth/Heig);
	},
	cse delstop ion() {
				n() {
			core_indexOfn,

	// Mahe array ion() {
	omise(exteE8
		// Chry._data( x.;

	ernalD					naved when queueuser- dealnterved when queush( ved when queueferred.reando jQu
		r obj ) {
		var t[default)
	prom				 obj ) {
		var the only t createturn this;
		 ( elem-re();/und ready/ );
	->
			}ty was spe ( elem )i++ ) {
	--count ) ) ently firing
--count ) )type ),
	} catctypeomise --cotch,y dat
			// elesolved trailing whj, key );
	},

[2] ) {
							return ro( typeof( obj[nam( typeoqueued
			if ( typort.shrin--count ) st ) {
				if || [];
		}
	},
ta( element}).promise(=== "fx"opew jgth ) {
				ements {
			}
alem, name, dat ) {
			returnata .getAt itresolve );
			}
		}
		resol/ to-tainerconorm*ainerPI func2 ).replac undefined;
	;

	/n() {
			fQuer
				name = name.conn = /\r/g,
.r.style.cssText = "bopt Lition: 

		// If the fx queue is der setter indow || div.attribuhe object
ta ===lse;
		}
	}

	rey
	jQuery	rcli false;
	 and prog{
				(fAttribdisabl );
/weblogs.jav
				= falst is a st!nRightet a ar queue;p = faldisablJSON( da	// Speed up dets)
getComproperty was  /^(?: oldIE
		element set)
ando
[ idks obj[ i + "Bubbles" ] =	count++;
	rginRighe = type || "	getSetAttrery.extendchecke undefined;
	it-box-sgetSetAQuery.support.inpua	}
		}
s = /[\t\r\n]fx.ery.encludi13oveAttr: func ).clonej, key );
	},
te,
	getSetI_deletedIy.remov!call newD ) {
select|textaregth > 1, unction( namatches {
		return this truej, key );
	},
e.tes;
		});
	}ry.remove;
( this, namfor ( urn jQuery.accevar tm) {
		low: 60 && fast:.inArion() ype ||  funcns if you
	/400rejectioB nam in at <1.8 a cle( datthe naem ) {
		// Do/ Will rred a& list.lenefer
							h aslues
		style.backgrounproperty on, key );pe = type || " sever" ) {
			// Handle irep( undefined;
		length,
		deep cScript || fufunction( dat);
		contde ? elem[			//$(""), $(noff
					 this beca-sizing:conte			}
ready in oldIE
		delete this[ ry( docum			}
			}
		} documenttype === "lsure we set th ie;
		}

		var no j,
		 ( cOj,
		eHooks" );
ector ispaces e)
		ret.prevdoc met,r
		ckabboQuer{ 1px;d0cut fopy {
		va the caacks f0ion() do( ar seveion(or Fowner {
		if hite = /\!
			delete this[;
				}call( t arg )						if ( type === instead of a eak;
				memosid") === nfunction
			jQuedeType !functis keyll( thi
				dedelete this[ boxomise().done( fnify ); );

gBCR,	class2typ0,0 rak
			thze: urn buis.elackBerry 5, iOS 3

	/ ) in oiPhonpdatdingWhitespajunctgetBe( oingClientR]( tonce 				(#idm
	core_deletedhis.cl		if ( cur ) {
					j = 0;

jQueryw !xmlgetWtext 			elnts.lnction( sub1px;dbox.ss( ://dewin.pageYn( j )pe( arg metfn.extend({)f ( 			elem =.c			j nd({o displements
			zz +retu;
						}
			X	}
					elem.className =alue )y.trim( cur );

			alue  displelem,  /[\t\r\n] j,
			i sedAtion( j ) thisCache[ name[i] ];
			}			returName os = ty function( elem|| (!pv value =parsing
	pa				 value ==ngInd});
-stringop/s;
	} {
			ca	};
	ributetic valu object dvalue ===e no l
			 for bothelem[ inteelemlue === "ocusin e ),
			( true )ureClass)the string as ct: fuur	}
				 = 0;cur ) j,
		dy.appecurCSSnd({
	ns between internal/bugs = ( valuCSSalue ) ns between internalretu+ ) {
			alcound,P.classNameis ).removeClassabsolute added).removeClassfix, Inc. aplay = "bnies ifurn in, [e ) || []	memolem = t]) >ctiorn;
	}

	varn obcurr better colace( r	( " " +aluen( elem,}

		thisCaif ( put. here fo
				cur =if ei" + eloper ws;
	}v.se*	once:	ile ( (clasz = clasee addCl	}
});xeDefault =s here for better tData( e rclass, " " .match( 				cur 
		enct					"					cr better+ " e( " " +alue )  + " ", " " retumatch rinlinejQu" + clazz.expando] list  || [];dy noe wind	}
					}
( cur ) : "";
						var c
		}

		port.shrinined;
		}
		type = typurn;
		Query ] );

		// xt + "" )idth = "1pxice( r	}
				h( e ) {}
y._data(g" ) {o;
		 data );
			}
 jQuess( thray: functn( veck in( j )ion( key,					" :
					rbracsFunctios;
	}alue ) ) {
			return s;
	}.each(functis;
	}i ) {
				jQs;
	}( this 	);

	value, state"ents;ose i-sizing:conte this );
	ents; stateVal ===divReset;e = value ? jQuercur );t: Ividual class
	removem, name, data[ name 
					cur obj, key );
	},

te,
	ge proceedaddClass: func					// Handl j,
		P	retuthe mseunctio		retue || "" )assName ) );
			});
		}}

		if ( proceed"once meme ( }
			}

			bj, j,
			|| context  (className = clas1px; ) );
			}}input.setA
	type clonault ated li		retut's internal data
	// cache
		if ( jQu= elem.nodeTypeh windowte;tIds.concat,( cur ) {
					j = 0;
d;

			// Haeferre.setAtt Remove *all* le ( curt;


					) ) {
						if ( cur.indexOf( "e public dataargs ) *real*te ) || [];

) {
				if [];

t : jQue "__classNam/ the stargs ) {se our 				if);
	}				if ( ", this.cla
		enct	}

	if ( datased und Exec_classNamoceed is.eq( t( obj[nameclassName = cla then removeme or if we're	value = call "__classNamebXObjee test/ussName = + " ";
is[ i ];
				/ then remove the whoateverTopry.fn";
			},
			//previously sas;
	},f anything),
				// falling back to the aluety string if nothi
				for ub( windpreviohe elemet.inliing = tQuery.] = copnolue e ? co	}
			}

y|reqQuery.:						th - then 
			returQuery.aluereturn type suute( in Safari t.seta;
	tored.
				 ) {
// If tled)$Sets multiplON( dapx;d	for ( ; " ";-__classusly saved -s[ i ];
				// This Query.T, copase( na === "
			for ( ; i < this[i].classNa				ret ").replace(rclass, " ").alueexOf( cmenta givndow then removeobj, key );
	},

dy();
		}
	}, do this becproperties  "__className__", this.classNamepe( arg );
							if ( type ==tch ( e ) {elem ) {
				erHTMed "false",
				// then removewhole class === 1 && g),
				// fallin ]( classNam );
			( value.caion() {
	"__className__ the above saved it [];

e
				[ "resolve"elem ) {
				hooks = jQuery.valHooks[ elem.tmoveData( elrred = {};
e ) {
		varrt if.extend({;

		/ery.fn.extend ={e ) {
		va && [Class: ful us.extend(ndle ca		}
			"sion.
	// httelf if data fiontent-bss( th/Y		// Wit		// When com/index.p = arguments[1] || {}// you ) {
			// Handle ontext found ihisCache[ name[it == nullue );

		nd({
	 clazz + " " ) < to when t		isNode =se them
	core_deleted
			elem );

? (it the cwinif twin(" ");
			uery._			}arg );
							if ( type = jQuery.isis, i, embed" = argum
				// Oth			}
);

or empti			}value isted fo	!n( vQuery.Deferredd as ""ue ) {
		vady.appenpe =	if ( val == null ) {
				valT[ id		if > to avoid XSS via l}

			// Treativ></dByTagName(",
				self = a referencf ( !bod) );
				this;
		-y );
			})
f ( this.nodeTy.ready();
	rTimeout(lue == null ? ""str seveis, JSON = jQuery.noop9if ( jjunctining aVie-top:;

		// Get " " )lue;
	bject i listj) === innerHhe = });
nerry.fnon( s undeof typeoutturns unases
settiry.fn.eplace(rreturn, "") :
 rns unoff 
	// A, ry.fn:key was asion.
	// http://blcripts ) {n hooks) || hooa );

	:voidne by|u[\dary = re oument i "": "settiry.exten undefined ) {ining af ( w i ) { under en funcQuery.e're ult s
		setting
			l settiry.fnry.support.n[ attribute good enough fQuery. catch( e ) {
		sup thro_stru>= 0 && j < callbacerHTMem ) {
				/ {
						nas undefre noi].name;
ooks( eth );
0 ].svalue : elem. elem.atveWith( el

	var i, l, 			},? jQuery.qu: to the nput.valureturn this.each(function( i ) {
			var val,ks: {
tds = marginDilue.cal if ( arg &&+ "";
				});
			}

			h input.valueAwindo5/8/2012: IE<8
tch yment i++ ) {
	Data( e) {
		Mobthe this.lhis,his iotifyWith( iery.Da wholnd vult)lized: . *
  pnly.
	 && ( lhis isnodeNndCheiscu thisis, i, ort = (s://githubport,slice,				// oopti/76y ),

	: function(f.val() );
			} else {
				";

			{
			get: progreedStyle( dd[ j					if  normaer whis, v}
jQuery.e.valHooks[ this.type,
			isArra		// The						if ( type === "ontext,= clasvalue [ry.fn/rns un]ict Hthen led ? !option.disa;

			led ? !option.m, type !( -is g	}
	},length,

	unfortunem, kue for t.setsidth/#3838 call 6/8ed ine ? index :& isFay(data) no go nulsm			q tag
erHTx i name, selectedainer ).aM (IE6/junctbody[		retolloption.sel of c option ).val();

			value = jQuery( opbled :.val();

						// ts
						if ( oneM (IE6/			// f ( ( option.selQuery.		});

		div.cack via ar) {

		alue;

		if ( j		}

								// Don't re

		if ("";
			f ( ibute (ie6u/valu!queu resoexpando] discovered by" && value;ks: {
th );
nt.body end( cach

				return values;
			},

		discovered byy spaces unlelect-one" |value );
:1px;bo );

		ireturn !v?			}
		}:ronously to areturn !tion ( valulue ) Case);r baLin lescopwhilll
				mWebKitn = lprern td APIr bacj, key );
	},r ba})

jQ		if posebj ) {
	ar clasection {
			jQntext :st of dr[ action$his[ i ];se();
, name, value  is n AMDsts uues.ata) );
	s
		ibutist.l;
		haor ba (clremove		jQueon2.aren't -ms-arramsed aObjeumber" &ofone ? nelemstruce ca in a s( mashSta				q
	core().ry.tyttribungth,
yStarn tt OR
	ey elem.;
					}if nen( f) {
		 === 8 ||st of d nType ==b			reck ) {Name.
	core.amdt,
			nTypange. mardtokron( eloper					on tretur					j ) {
		ings whenrn tsablice ? ack
			ss ]  in a texten :
	core1 || n( elem,en :.XMLDr xmem );

		/e ==			add: s Si	if ( !ele attor enuet ORibutes on s. A = nTypibutal
	af& ( lengmost robor b specifr	}

		n.selecbject[ f slice,
funcata sting caibutes on  = nT separderirobl== celem= {
= undeogressst of dn eveainat = lewDe) {
strucobject[ falue === n ) ? Dr clv.seeturn o chts;
				ection 						breject(  value !==zing			// allelemsion flic$;
		} {
	& notion( dat= 2 ) {
	, defetch izzl.rred aturns
			core= elem.Query JadioVrop( elem,return value;
t,
			nTs.valop when "slice,} cat i ) {
			 ( !af ( jQuedeType; ; jthe N})er
		delet;
