/*! jQuery UI - v1.10.3 - 2013-07-11
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.position.js, jquery.ui.draggable.js, jquery.ui.droppable.js, jquery.ui.resizable.js, jquery.ui.selectable.js, jquery.ui.sortable.js, jquery.ui.accordion.js, jquery.ui.autocomplete.js, jquery.ui.button.js, jquery.ui.datepicker.js, jquery.ui.dialog.js, jquery.ui.menu.js, jquery.ui.progressbar.js, jquery.ui.slider.js, jquery.ui.spinner.js, jquery.ui.tabs.js, jquery.ui.tooltip.js, jquery.ui.effect.js, jquery.ui.effect-blind.js, jquery.ui.effect-bounce.js, jquery.ui.effect-clip.js, jquery.ui.effect-drop.js, jquery.ui.effect-explode.js, jquery.ui.effect-fade.js, jquery.ui.effect-fold.js, jquery.ui.effect-highlight.js, jquery.ui.effect-pulsate.js, jquery.ui.effect-scale.js, jquery.ui.effect-shake.js, jquery.ui.effect-slide.js, jquery.ui.effect-transfer.js
* Copyright 2013 jQuery Foundation and other contributors Licensed MIT */

(function( $, undefined ) {

var uuid = 0,
	runiqueId = /^ui-id-\d+$/;

// $.ui might exist from components with no dependencies, e.g., $.ui.position
$.ui = $.ui || {};

$.extend( $.ui, {
	version: "1.10.3",

	keyCode: {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
});

// plugins
$.fn.extend({
	focus: (function( orig ) {
		return function( delay, fn ) {
			return typeof delay === "number" ?
				this.each(function() {
					var elem = this;
					setTimeout(function() {
						$( elem ).focus();
						if ( fn ) {
							fn.call( elem );
						}
					}, delay );
				}) :
				orig.apply( this, arguments );
		};
	})( $.fn.focus ),

	scrollParent: function() {
		var scrollParent;
		if (($.ui.ie && (/(static|relative)/).test(this.css("position"))) || (/absolute/).test(this.css("position"))) {
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.css(this,"position")) && (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
			}).eq(0);
		}

		return (/fixed/).test(this.css("position")) || !scrollParent.length ? $(document) : scrollParent;
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	},

	uniqueId: function() {
		return this.each(function() {
			if ( !this.id ) {
				this.id = "ui-id-" + (++uuid);
			}
		});
	},

	removeUniqueId: function() {
		return this.each(function() {
			if ( runiqueId.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		});
	}
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap=#" + mapName + "]" )[0];
		return !!img && visible( img );
	}
	return ( /input|select|textarea|button|object/.test( nodeName ) ?
		!element.disabled :
		"a" === nodeName ?
			element.href || isTabIndexNotNaN :
			isTabIndexNotNaN) &&
		// the element and all of its ancestors must be visible
		visible( element );
}

function visible( element ) {
	return $.expr.filters.visible( element ) &&
		!$( element ).parents().addBack().filter(function() {
			return $.css( this, "visibility" ) === "hidden";
		}).length;
}

$.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo(function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		}) :
		// support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
	$.each( [ "Width", "Height" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
			type = name.toLowerCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
				outerHeight: $.fn.outerHeight
			};

		function reduce( elem, size, border, margin ) {
			$.each( side, function() {
				size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
				if ( border ) {
					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
				}
				if ( margin ) {
					size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
				}
			});
			return size;
		}

		$.fn[ "inner" + name ] = function( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + name ].call( this );
			}

			return this.each(function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			});
		};

		$.fn[ "outer" + name] = function( size, margin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name ].call( this, size );
			}

			return this.each(function() {
				$( this).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
	$.fn.addBack = function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	};
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
	$.fn.removeData = (function( removeData ) {
		return function( key ) {
			if ( arguments.length ) {
				return removeData.call( this, $.camelCase( key ) );
			} else {
				return removeData.call( this );
			}
		};
	})( $.fn.removeData );
}





// deprecated
$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

$.support.selectstart = "onselectstart" in document.createElement( "div" );
$.fn.extend({
	disableSelection: function() {
		return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
			".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
	},

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	}
});

$.extend( $.ui, {
	// $.ui.plugin is deprecated. Use $.widget() extensions instead.
	plugin: {
		add: function( module, option, set ) {
			var i,
				proto = $.ui[ module ].prototype;
			for ( i in set ) {
				proto.plugins[ i ] = proto.plugins[ i ] || [];
				proto.plugins[ i ].push( [ option, set[ i ] ] );
			}
		},
		call: function( instance, name, args ) {
			var i,
				set = instance.plugins[ name ];
			if ( !set || !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) {
				return;
			}

			for ( i = 0; i < set.length; i++ ) {
				if ( instance.options[ set[ i ][ 0 ] ] ) {
					set[ i ][ 1 ].apply( instance.element, args );
				}
			}
		}
	},

	// only used by resizable
	hasScroll: function( el, a ) {

		//If overflow is hidden, the element might have extra content, but the user wants to hide it
		if ( $( el ).css( "overflow" ) === "hidden") {
			return false;
		}

		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;

		if ( el[ scroll ] > 0 ) {
			return true;
		}

		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[ scroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] = 0;
		return has;
	}
});

})( jQuery );
(function( $, undefined ) {

var uuid = 0,
	slice = Array.prototype.slice,
	_cleanData = $.cleanData;
$.cleanData = function( elems ) {
	for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
		try {
			$( elem ).triggerHandler( "remove" );
		// http://bugs.jquery.com/ticket/8235
		} catch( e ) {}
	}
	_cleanData( elems );
};

$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, constructor, basePrototype,
		// proxiedPrototype allows the provided prototype to remain unmodified
		// so that it can be used as a mixin for multiple widgets (#8876)
		proxiedPrototype = {},
		namespace = name.split( "." )[ 0 ];

	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};
	// extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,
		// copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),
		// track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	});

	basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = (function() {
			var _super = function() {
					return base.prototype[ prop ].apply( this, arguments );
				},
				_superApply = function( args ) {
					return base.prototype[ prop ].apply( this, args );
				};
			return function() {
				var __super = this._super,
					__superApply = this._superApply,
					returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		})();
	});
	constructor.prototype = $.widget.extend( basePrototype, {
		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	});

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
		});
		// remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );
};

$.widget.extend = function( target ) {
	var input = slice.call( arguments, 1 ),
		inputIndex = 0,
		inputLength = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :
						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );
				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.widget.extend.apply( null, [ options ].concat(args) ) :
			options;

		if ( isMethodCall ) {
			this.each(function() {
				var methodValue,
					instance = $.data( this, fullName );
				if ( !instance ) {
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
				}
				methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			});
		} else {
			this.each(function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} )._init();
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",
	options: {
		disabled: false,

		// callbacks
		create: null
	},
	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;
		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			});
			this.document = $( element.style ?
				// element within the document
				element.ownerDocument :
				// element is window or document
				element.document || element );
			this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
		}

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},
	_getCreateOptions: $.noop,
	_getCreateEventData: $.noop,
	_create: $.noop,
	_init: $.noop,

	destroy: function() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.unbind( this.eventNamespace )
			// 1.9 BC for #7810
			// TODO remove dual storage
			.removeData( this.widgetName )
			.removeData( this.widgetFullName )
			// support: jquery <1.6.3
			// http://bugs.jquery.com/ticket/9413
			.removeData( $.camelCase( this.widgetFullName ) );
		this.widget()
			.unbind( this.eventNamespace )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetFullName + "-disabled " +
				"ui-state-disabled" );

		// clean up events and states
		this.bindings.unbind( this.eventNamespace );
		this.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "ui-state-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( value === undefined ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( value === undefined ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				.toggleClass( this.widgetFullName + "-disabled ui-state-disabled", !!value )
				.attr( "aria-disabled", value );
			this.hoverable.removeClass( "ui-state-hover" );
			this.focusable.removeClass( "ui-state-focus" );
		}

		return this;
	},

	enable: function() {
		return this._setOption( "disabled", false );
	},
	disable: function() {
		return this._setOption( "disabled", true );
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
			instance = this;

		// no suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			// accept selectors, DOM elements
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {
				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
							$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^(\w+)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.delegate( selector, eventName, handlerProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}
		});
	},

	_off: function( element, eventName ) {
		eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) + this.eventNamespace;
		element.unbind( eventName ).undelegate( eventName );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-hover" );
			},
			mouseleave: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-hover" );
			}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-focus" );
			}
		});
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}
		var hasOptions,
			effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;
		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}
		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;
		if ( options.delay ) {
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			});
		}
	};
});

})( jQuery );
(function( $, undefined ) {

var mouseHandled = false;
$( document ).mouseup( function() {
	mouseHandled = false;
});

$.widget("ui.mouse", {
	version: "1.10.3",
	options: {
		cancel: "input,textarea,button,select,option",
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var that = this;

		this.element
			.bind("mousedown."+this.widgetName, function(event) {
				return that._mouseDown(event);
			})
			.bind("click."+this.widgetName, function(event) {
				if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
					$.removeData(event.target, that.widgetName + ".preventClickEvent");
					event.stopImmediatePropagation();
					return false;
				}
			});

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind("."+this.widgetName);
		if ( this._mouseMoveDelegate ) {
			$(document)
				.unbind("mousemove."+this.widgetName, this._mouseMoveDelegate)
				.unbind("mouseup."+this.widgetName, this._mouseUpDelegate);
		}
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		if( mouseHandled ) { return; }

		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var that = this,
			btnIsLeft = (event.which === 1),
			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				that.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
			$.removeData(event.target, this.widgetName + ".preventClickEvent");
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return that._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return that._mouseUp(event);
		};
		$(document)
			.bind("mousemove."+this.widgetName, this._mouseMoveDelegate)
			.bind("mouseup."+this.widgetName, this._mouseUpDelegate);

		event.preventDefault();

		mouseHandled = true;
		return true;
	},

	_mouseMove: function(event) {
		// IE mouseup check - mouseup happened when mouse was out of window
		if ($.ui.ie && ( !document.documentMode || document.documentMode < 9 ) && !event.button) {
			return this._mouseUp(event);
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		$(document)
			.unbind("mousemove."+this.widgetName, this._mouseMoveDelegate)
			.unbind("mouseup."+this.widgetName, this._mouseUpDelegate);

		if (this._mouseStarted) {
			this._mouseStarted = false;

			if (event.target === this._mouseDownEvent.target) {
				$.data(event.target, this.widgetName + ".preventClickEvent", true);
			}

			this._mouseStop(event);
		}

		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(/* event */) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(/* event */) {},
	_mouseDrag: function(/* event */) {},
	_mouseStop: function(/* event */) {},
	_mouseCapture: function(/* event */) { return true; }
});

})(jQuery);
(function( $, undefined ) {

$.ui = $.ui || {};

var cachedScrollbarWidth,
	max = Math.max,
	abs = Math.abs,
	round = Math.round,
	rhorizontal = /left|center|right/,
	rvertical = /top|center|bottom/,
	roffset = /[\+\-]\d+(\.[\d]+)?%?/,
	rposition = /^\w+/,
	rpercent = /%$/,
	_position = $.fn.position;

function getOffsets( offsets, width, height ) {
	return [
		parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
		parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
	];
}

function parseCss( element, property ) {
	return parseInt( $.css( element, property ), 10 ) || 0;
}

function getDimensions( elem ) {
	var raw = elem[0];
	if ( raw.nodeType === 9 ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: 0, left: 0 }
		};
	}
	if ( $.isWindow( raw ) ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
		};
	}
	if ( raw.preventDefault ) {
		return {
			width: 0,
			height: 0,
			offset: { top: raw.pageY, left: raw.pageX }
		};
	}
	return {
		width: elem.outerWidth(),
		height: elem.outerHeight(),
		offset: elem.offset()
	};
}

$.position = {
	scrollbarWidth: function() {
		if ( cachedScrollbarWidth !== undefined ) {
			return cachedScrollbarWidth;
		}
		var w1, w2,
			div = $( "<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
			innerDiv = div.children()[0];

		$( "body" ).append( div );
		w1 = innerDiv.offsetWidth;
		div.css( "overflow", "scroll" );

		w2 = innerDiv.offsetWidth;

		if ( w1 === w2 ) {
			w2 = div[0].clientWidth;
		}

		div.remove();

		return (cachedScrollbarWidth = w1 - w2);
	},
	getScrollInfo: function( within ) {
		var overflowX = within.isWindow ? "" : within.element.css( "overflow-x" ),
			overflowY = within.isWindow ? "" : within.element.css( "overflow-y" ),
			hasOverflowX = overflowX === "scroll" ||
				( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
			hasOverflowY = overflowY === "scroll" ||
				( overflowY === "auto" && within.height < within.element[0].scrollHeight );
		return {
			width: hasOverflowY ? $.position.scrollbarWidth() : 0,
			height: hasOverflowX ? $.position.scrollbarWidth() : 0
		};
	},
	getWithinInfo: function( element ) {
		var withinElement = $( element || window ),
			isWindow = $.isWindow( withinElement[0] );
		return {
			element: withinElement,
			isWindow: isWindow,
			offset: withinElement.offset() || { left: 0, top: 0 },
			scrollLeft: withinElement.scrollLeft(),
			scrollTop: withinElement.scrollTop(),
			width: isWindow ? withinElement.width() : withinElement.outerWidth(),
			height: isWindow ? withinElement.height() : withinElement.outerHeight()
		};
	}
};

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
		target = $( options.of ),
		within = $.position.getWithinInfo( options.within ),
		scrollInfo = $.position.getScrollInfo( within ),
		collision = ( options.collision || "flip" ).split( " " ),
		offsets = {};

	dimensions = getDimensions( target );
	if ( target[0].preventDefault ) {
		// force left top to allow flipping
		options.at = "left top";
	}
	targetWidth = dimensions.width;
	targetHeight = dimensions.height;
	targetOffset = dimensions.offset;
	// clone to reuse original targetOffset later
	basePosition = $.extend( {}, targetOffset );

	// force my and at to have valid horizontal and vertical positions
	// if a value is missing or invalid, it will be converted to center
	$.each( [ "my", "at" ], function() {
		var pos = ( options[ this ] || "" ).split( " " ),
			horizontalOffset,
			verticalOffset;

		if ( pos.length === 1) {
			pos = rhorizontal.test( pos[ 0 ] ) ?
				pos.concat( [ "center" ] ) :
				rvertical.test( pos[ 0 ] ) ?
					[ "center" ].concat( pos ) :
					[ "center", "center" ];
		}
		pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
		pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

		// calculate offsets
		horizontalOffset = roffset.exec( pos[ 0 ] );
		verticalOffset = roffset.exec( pos[ 1 ] );
		offsets[ this ] = [
			horizontalOffset ? horizontalOffset[ 0 ] : 0,
			verticalOffset ? verticalOffset[ 0 ] : 0
		];

		// reduce to just the positions without the offsets
		options[ this ] = [
			rposition.exec( pos[ 0 ] )[ 0 ],
			rposition.exec( pos[ 1 ] )[ 0 ]
		];
	});

	// normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	if ( options.at[ 0 ] === "right" ) {
		basePosition.left += targetWidth;
	} else if ( options.at[ 0 ] === "center" ) {
		basePosition.left += targetWidth / 2;
	}

	if ( options.at[ 1 ] === "bottom" ) {
		basePosition.top += targetHeight;
	} else if ( options.at[ 1 ] === "center" ) {
		basePosition.top += targetHeight / 2;
	}

	atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
	basePosition.left += atOffset[ 0 ];
	basePosition.top += atOffset[ 1 ];

	return this.each(function() {
		var collisionPosition, using,
			elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseCss( this, "marginLeft" ),
			marginTop = parseCss( this, "marginTop" ),
			collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) + scrollInfo.width,
			collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) + scrollInfo.height,
			position = $.extend( {}, basePosition ),
			myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

		if ( options.my[ 0 ] === "right" ) {
			position.left -= elemWidth;
		} else if ( options.my[ 0 ] === "center" ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my[ 1 ] === "bottom" ) {
			position.top -= elemHeight;
		} else if ( options.my[ 1 ] === "center" ) {
			position.top -= elemHeight / 2;
		}

		position.left += myOffset[ 0 ];
		position.top += myOffset[ 1 ];

		// if the browser doesn't support fractions, then round for consistent results
		if ( !$.support.offsetFractions ) {
			position.left = round( position.left );
			position.top = round( position.top );
		}

		collisionPosition = {
			marginLeft: marginLeft,
			marginTop: marginTop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[ i ] ] ) {
				$.ui.position[ collision[ i ] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
					my: options.my,
					at: options.at,
					within: within,
					elem : elem
				});
			}
		});

		if ( options.using ) {
			// adds feedback as second argument to using callback, if present
			using = function( props ) {
				var left = targetOffset.left - position.left,
					right = left + targetWidth - elemWidth,
					top = targetOffset.top - position.top,
					bottom = top + targetHeight - elemHeight,
					feedback = {
						target: {
							element: target,
							left: targetOffset.left,
							top: targetOffset.top,
							width: targetWidth,
							height: targetHeight
						},
						element: {
							element: elem,
							left: position.left,
							top: position.top,
							width: elemWidth,
							height: elemHeight
						},
						horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
						vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
					};
				if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
					feedback.horizontal = "center";
				}
				if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
					feedback.vertical = "middle";
				}
				if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
					feedback.important = "horizontal";
				} else {
					feedback.important = "vertical";
				}
				options.using.call( this, props, feedback );
			};
		}

		elem.offset( $.extend( position, { using: using } ) );
	});
};

$.ui.position = {
	fit: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
				outerWidth = within.width,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = withinOffset - collisionPosLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
				newOverRight;

			// element is wider than within
			if ( data.collisionWidth > outerWidth ) {
				// element is initially over the left side of within
				if ( overLeft > 0 && overRight <= 0 ) {
					newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
					position.left += overLeft - newOverRight;
				// element is initially over right side of within
				} else if ( overRight > 0 && overLeft <= 0 ) {
					position.left = withinOffset;
				// element is initially over both left and right sides of within
				} else {
					if ( overLeft > overRight ) {
						position.left = withinOffset + outerWidth - data.collisionWidth;
					} else {
						position.left = withinOffset;
					}
				}
			// too far left -> align with left edge
			} else if ( overLeft > 0 ) {
				position.left += overLeft;
			// too far right -> align with right edge
			} else if ( overRight > 0 ) {
				position.left -= overRight;
			// adjust based on position and margin
			} else {
				position.left = max( position.left - collisionPosLeft, position.left );
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
				outerHeight = data.within.height,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = withinOffset - collisionPosTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
				newOverBottom;

			// element is taller than within
			if ( data.collisionHeight > outerHeight ) {
				// element is initially over the top of within
				if ( overTop > 0 && overBottom <= 0 ) {
					newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
					position.top += overTop - newOverBottom;
				// element is initially over bottom of within
				} else if ( overBottom > 0 && overTop <= 0 ) {
					position.top = withinOffset;
				// element is initially over both top and bottom of within
				} else {
					if ( overTop > overBottom ) {
						position.top = withinOffset + outerHeight - data.collisionHeight;
					} else {
						position.top = withinOffset;
					}
				}
			// too far up -> align with top
			} else if ( overTop > 0 ) {
				position.top += overTop;
			// too far down -> align with bottom edge
			} else if ( overBottom > 0 ) {
				position.top -= overBottom;
			// adjust based on position and margin
			} else {
				position.top = max( position.top - collisionPosTop, position.top );
			}
		}
	},
	flip: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.left + within.scrollLeft,
				outerWidth = within.width,
				offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = collisionPosLeft - offsetLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
				myOffset = data.my[ 0 ] === "left" ?
					-data.elemWidth :
					data.my[ 0 ] === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[ 0 ] === "left" ?
					data.targetWidth :
					data.at[ 0 ] === "right" ?
						-data.targetWidth :
						0,
				offset = -2 * data.offset[ 0 ],
				newOverRight,
				newOverLeft;

			if ( overLeft < 0 ) {
				newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
				if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
					position.left += myOffset + atOffset + offset;
				}
			}
			else if ( overRight > 0 ) {
				newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
				if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
					position.left += myOffset + atOffset + offset;
				}
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.top + within.scrollTop,
				outerHeight = within.height,
				offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = collisionPosTop - offsetTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
				top = data.my[ 1 ] === "top",
				myOffset = top ?
					-data.elemHeight :
					data.my[ 1 ] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[ 1 ] === "top" ?
					data.targetHeight :
					data.at[ 1 ] === "bottom" ?
						-data.targetHeight :
						0,
				offset = -2 * data.offset[ 1 ],
				newOverTop,
				newOverBottom;
			if ( overTop < 0 ) {
				newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
				if ( ( position.top + myOffset + atOffset + offset) > overTop && ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) ) {
					position.top += myOffset + atOffset + offset;
				}
			}
			else if ( overBottom > 0 ) {
				newOverTop = position.top -  data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
				if ( ( position.top + myOffset + atOffset + offset) > overBottom && ( newOverTop > 0 || abs( newOverTop ) < overBottom ) ) {
					position.top += myOffset + atOffset + offset;
				}
			}
		}
	},
	flipfit: {
		left: function() {
			$.ui.position.flip.left.apply( this, arguments );
			$.ui.position.fit.left.apply( this, arguments );
		},
		top: function() {
			$.ui.position.flip.top.apply( this, arguments );
			$.ui.position.fit.top.apply( this, arguments );
		}
	}
};

// fraction support test
(function () {
	var testElement, testElementParent, testElementStyle, offsetLeft, i,
		body = document.getElementsByTagName( "body" )[ 0 ],
		div = document.createElement( "div" );

	//Create a "fake body" for testing based on method used in jQuery.support
	testElement = document.createElement( body ? "div" : "body" );
	testElementStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0,
		background: "none"
	};
	if ( body ) {
		$.extend( testElementStyle, {
			position: "absolute",
			left: "-1000px",
			top: "-1000px"
		});
	}
	for ( i in testElementStyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	testElement.appendChild( div );
	testElementParent = body || document.documentElement;
	testElementParent.insertBefore( testElement, testElementParent.firstChild );

	div.style.cssText = "position: absolute; left: 10.7432222px;";

	offsetLeft = $( div ).offset().left;
	$.support.offsetFractions = offsetLeft > 10 && offsetLeft < 11;

	testElement.innerHTML = "";
	testElementParent.removeChild( testElement );
})();

}( jQuery ) );
(function( $, undefined ) {

$.widget("ui.draggable", $.ui.mouse, {
	version: "1.10.3",
	widgetEventPrefix: "drag",
	options: {
		addClasses: true,
		appendTo: "parent",
		axis: false,
		connectToSortable: false,
		containment: false,
		cursor: "auto",
		cursorAt: false,
		grid: false,
		handle: false,
		helper: "original",
		iframeFix: false,
		opacity: false,
		refreshPositions: false,
		revert: false,
		revertDuration: 500,
		scope: "default",
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		snap: false,
		snapMode: "both",
		snapTolerance: 20,
		stack: false,
		zIndex: false,

		// callbacks
		drag: null,
		start: null,
		stop: null
	},
	_create: function() {

		if (this.options.helper === "original" && !(/^(?:r|a|f)/).test(this.element.css("position"))) {
			this.element[0].style.position = "relative";
		}
		if (this.options.addClasses){
			this.element.addClass("ui-draggable");
		}
		if (this.options.disabled){
			this.element.addClass("ui-draggable-disabled");
		}

		this._mouseInit();

	},

	_destroy: function() {
		this.element.removeClass( "ui-draggable ui-draggable-dragging ui-draggable-disabled" );
		this._mouseDestroy();
	},

	_mouseCapture: function(event) {

		var o = this.options;

		// among others, prevent a drag on a resizable-handle
		if (this.helper || o.disabled || $(event.target).closest(".ui-resizable-handle").length > 0) {
			return false;
		}

		//Quit if we're not on a valid handle
		this.handle = this._getHandle(event);
		if (!this.handle) {
			return false;
		}

		$(o.iframeFix === true ? "iframe" : o.iframeFix).each(function() {
			$("<div class='ui-draggable-iframeFix' style='background: #fff;'></div>")
			.css({
				width: this.offsetWidth+"px", height: this.offsetHeight+"px",
				position: "absolute", opacity: "0.001", zIndex: 1000
			})
			.css($(this).offset())
			.appendTo("body");
		});

		return true;

	},

	_mouseStart: function(event) {

		var o = this.options;

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		this.helper.addClass("ui-draggable-dragging");

		//Cache the helper size
		this._cacheHelperProportions();

		//If ddmanager is used for droppables, set the global draggable
		if($.ui.ddmanager) {
			$.ui.ddmanager.current = this;
		}

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Store the helper's css position
		this.cssPosition = this.helper.css( "position" );
		this.scrollParent = this.helper.scrollParent();
		this.offsetParent = this.helper.offsetParent();
		this.offsetParentCssPosition = this.offsetParent.css( "position" );

		//The element's absolute position on the page minus margins
		this.offset = this.positionAbs = this.element.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		//Reset scroll cache
		this.offset.scroll = false;

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		//Generate the original position
		this.originalPosition = this.position = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if "cursorAt" is supplied
		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

		//Set a containment if given in the options
		this._setContainment();

		//Trigger event + callbacks
		if(this._trigger("start", event) === false) {
			this._clear();
			return false;
		}

		//Recache the helper size
		this._cacheHelperProportions();

		//Prepare the droppable offsets
		if ($.ui.ddmanager && !o.dropBehaviour) {
			$.ui.ddmanager.prepareOffsets(this, event);
		}


		this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position

		//If the ddmanager is used for droppables, inform the manager that dragging has started (see #5003)
		if ( $.ui.ddmanager ) {
			$.ui.ddmanager.dragStart(this, event);
		}

		return true;
	},

	_mouseDrag: function(event, noPropagation) {
		// reset any necessary cached properties (see #5009)
		if ( this.offsetParentCssPosition === "fixed" ) {
			this.offset.parent = this._getParentOffset();
		}

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		//Call plugins and callbacks and use the resulting position if something is returned
		if (!noPropagation) {
			var ui = this._uiHash();
			if(this._trigger("drag", event, ui) === false) {
				this._mouseUp({});
				return false;
			}
			this.position = ui.position;
		}

		if(!this.options.axis || this.options.axis !== "y") {
			this.helper[0].style.left = this.position.left+"px";
		}
		if(!this.options.axis || this.options.axis !== "x") {
			this.helper[0].style.top = this.position.top+"px";
		}
		if($.ui.ddmanager) {
			$.ui.ddmanager.drag(this, event);
		}

		return false;
	},

	_mouseStop: function(event) {

		//If we are using droppables, inform the manager about the drop
		var that = this,
			dropped = false;
		if ($.ui.ddmanager && !this.options.dropBehaviour) {
			dropped = $.ui.ddmanager.drop(this, event);
		}

		//if a drop comes from outside (a sortable)
		if(this.dropped) {
			dropped = this.dropped;
			this.dropped = false;
		}

		//if the original element is no longer in the DOM don't bother to continue (see #8269)
		if ( this.options.helper === "original" && !$.contains( this.element[ 0 ].ownerDocument, this.element[ 0 ] ) ) {
			return false;
		}

		if((this.options.revert === "invalid" && !dropped) || (this.options.revert === "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
			$(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
				if(that._trigger("stop", event) !== false) {
					that._clear();
				}
			});
		} else {
			if(this._trigger("stop", event) !== false) {
				this._clear();
			}
		}

		return false;
	},

	_mouseUp: function(event) {
		//Remove frame helpers
		$("div.ui-draggable-iframeFix").each(function() {
			this.parentNode.removeChild(this);
		});

		//If the ddmanager is used for droppables, inform the manager that dragging has stopped (see #5003)
		if( $.ui.ddmanager ) {
			$.ui.ddmanager.dragStop(this, event);
		}

		return $.ui.mouse.prototype._mouseUp.call(this, event);
	},

	cancel: function() {

		if(this.helper.is(".ui-draggable-dragging")) {
			this._mouseUp({});
		} else {
			this._clear();
		}

		return this;

	},

	_getHandle: function(event) {
		return this.options.handle ?
			!!$( event.target ).closest( this.element.find( this.options.handle ) ).length :
			true;
	},

	_createHelper: function(event) {

		var o = this.options,
			helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event])) : (o.helper === "clone" ? this.element.clone().removeAttr("id") : this.element);

		if(!helper.parents("body").length) {
			helper.appendTo((o.appendTo === "parent" ? this.element[0].parentNode : o.appendTo));
		}

		if(helper[0] !== this.element[0] && !(/(fixed|absolute)/).test(helper.css("position"))) {
			helper.css("position", "absolute");
		}

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj === "string") {
			obj = obj.split(" ");
		}
		if ($.isArray(obj)) {
			obj = {left: +obj[0], top: +obj[1] || 0};
		}
		if ("left" in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ("right" in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ("top" in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ("bottom" in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_getParentOffset: function() {

		//Get the offsetParent and cache its position
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition === "absolute" && this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		//This needs to be actually done for all browsers, since pageX/pageY includes this information
		//Ugly IE fix
		if((this.offsetParent[0] === document.body) ||
			(this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() === "html" && $.ui.ie)) {
			po = { top: 0, left: 0 };
		}

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition === "relative") {
			var p = this.element.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.element.css("marginLeft"),10) || 0),
			top: (parseInt(this.element.css("marginTop"),10) || 0),
			right: (parseInt(this.element.css("marginRight"),10) || 0),
			bottom: (parseInt(this.element.css("marginBottom"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var over, c, ce,
			o = this.options;

		if ( !o.containment ) {
			this.containment = null;
			return;
		}

		if ( o.containment === "window" ) {
			this.containment = [
				$( window ).scrollLeft() - this.offset.relative.left - this.offset.parent.left,
				$( window ).scrollTop() - this.offset.relative.top - this.offset.parent.top,
				$( window ).scrollLeft() + $( window ).width() - this.helperProportions.width - this.margins.left,
				$( window ).scrollTop() + ( $( window ).height() || document.body.parentNode.scrollHeight ) - this.helperProportions.height - this.margins.top
			];
			return;
		}

		if ( o.containment === "document") {
			this.containment = [
				0,
				0,
				$( document ).width() - this.helperProportions.width - this.margins.left,
				( $( document ).height() || document.body.parentNode.scrollHeight ) - this.helperProportions.height - this.margins.top
			];
			return;
		}

		if ( o.containment.constructor === Array ) {
			this.containment = o.containment;
			return;
		}

		if ( o.containment === "parent" ) {
			o.containment = this.helper[ 0 ].parentNode;
		}

		c = $( o.containment );
		ce = c[ 0 ];

		if( !ce ) {
			return;
		}

		over = c.css( "overflow" ) !== "hidden";

		this.containment = [
			( parseInt( c.css( "borderLeftWidth" ), 10 ) || 0 ) + ( parseInt( c.css( "paddingLeft" ), 10 ) || 0 ),
			( parseInt( c.css( "borderTopWidth" ), 10 ) || 0 ) + ( parseInt( c.css( "paddingTop" ), 10 ) || 0 ) ,
			( over ? Math.max( ce.scrollWidth, ce.offsetWidth ) : ce.offsetWidth ) - ( parseInt( c.css( "borderRightWidth" ), 10 ) || 0 ) - ( parseInt( c.css( "paddingRight" ), 10 ) || 0 ) - this.helperProportions.width - this.margins.left - this.margins.right,
			( over ? Math.max( ce.scrollHeight, ce.offsetHeight ) : ce.offsetHeight ) - ( parseInt( c.css( "borderBottomWidth" ), 10 ) || 0 ) - ( parseInt( c.css( "paddingBottom" ), 10 ) || 0 ) - this.helperProportions.height - this.margins.top  - this.margins.bottom
		];
		this.relative_container = c;
	},

	_convertPositionTo: function(d, pos) {

		if(!pos) {
			pos = this.position;
		}

		var mod = d === "absolute" ? 1 : -1,
			scroll = this.cssPosition === "absolute" && !( this.scrollParent[ 0 ] !== document && $.contains( this.scrollParent[ 0 ], this.offsetParent[ 0 ] ) ) ? this.offsetParent : this.scrollParent;

		//Cache the scroll
		if (!this.offset.scroll) {
			this.offset.scroll = {top : scroll.scrollTop(), left : scroll.scrollLeft()};
		}

		return {
			top: (
				pos.top	+																// The absolute mouse position
				this.offset.relative.top * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top * mod -										// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : this.offset.scroll.top ) * mod )
			),
			left: (
				pos.left +																// The absolute mouse position
				this.offset.relative.left * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left * mod	-										// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : this.offset.scroll.left ) * mod )
			)
		};

	},

	_generatePosition: function(event) {

		var containment, co, top, left,
			o = this.options,
			scroll = this.cssPosition === "absolute" && !( this.scrollParent[ 0 ] !== document && $.contains( this.scrollParent[ 0 ], this.offsetParent[ 0 ] ) ) ? this.offsetParent : this.scrollParent,
			pageX = event.pageX,
			pageY = event.pageY;

		//Cache the scroll
		if (!this.offset.scroll) {
			this.offset.scroll = {top : scroll.scrollTop(), left : scroll.scrollLeft()};
		}

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		// If we are not dragging yet, we won't check for options
		if ( this.originalPosition ) {
			if ( this.containment ) {
				if ( this.relative_container ){
					co = this.relative_container.offset();
					containment = [
						this.containment[ 0 ] + co.left,
						this.containment[ 1 ] + co.top,
						this.containment[ 2 ] + co.left,
						this.containment[ 3 ] + co.top
					];
				}
				else {
					containment = this.containment;
				}

				if(event.pageX - this.offset.click.left < containment[0]) {
					pageX = containment[0] + this.offset.click.left;
				}
				if(event.pageY - this.offset.click.top < containment[1]) {
					pageY = containment[1] + this.offset.click.top;
				}
				if(event.pageX - this.offset.click.left > containment[2]) {
					pageX = containment[2] + this.offset.click.left;
				}
				if(event.pageY - this.offset.click.top > containment[3]) {
					pageY = containment[3] + this.offset.click.top;
				}
			}

			if(o.grid) {
				//Check for grid elements set to 0 to prevent divide by 0 error causing invalid argument errors in IE (see ticket #6950)
				top = o.grid[1] ? this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
				pageY = containment ? ((top - this.offset.click.top >= containment[1] || top - this.offset.click.top > containment[3]) ? top : ((top - this.offset.click.top >= containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				left = o.grid[0] ? this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX;
				pageX = containment ? ((left - this.offset.click.left >= containment[0] || left - this.offset.click.left > containment[2]) ? left : ((left - this.offset.click.left >= containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY -																	// The absolute mouse position
				this.offset.click.top	-												// Click offset (relative to the element)
				this.offset.relative.top -												// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top +												// The offsetParent's offset without borders (offset + border)
				( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : this.offset.scroll.top )
			),
			left: (
				pageX -																	// The absolute mouse position
				this.offset.click.left -												// Click offset (relative to the element)
				this.offset.relative.left -												// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left +												// The offsetParent's offset without borders (offset + border)
				( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : this.offset.scroll.left )
			)
		};

	},

	_clear: function() {
		this.helper.removeClass("ui-draggable-dragging");
		if(this.helper[0] !== this.element[0] && !this.cancelHelperRemoval) {
			this.helper.remove();
		}
		this.helper = null;
		this.cancelHelperRemoval = false;
	},

	// From now on bulk stuff - mainly helpers

	_trigger: function(type, event, ui) {
		ui = ui || this._uiHash();
		$.ui.plugin.call(this, type, [event, ui]);
		//The absolute position has to be recalculated after plugins
		if(type === "drag") {
			this.positionAbs = this._convertPositionTo("absolute");
		}
		return $.Widget.prototype._trigger.call(this, type, event, ui);
	},

	plugins: {},

	_uiHash: function() {
		return {
			helper: this.helper,
			position: this.position,
			originalPosition: this.originalPosition,
			offset: this.positionAbs
		};
	}

});

$.ui.plugin.add("draggable", "connectToSortable", {
	start: function(event, ui) {

		var inst = $(this).data("ui-draggable"), o = inst.options,
			uiSortable = $.extend({}, ui, { item: inst.element });
		inst.sortables = [];
		$(o.connectToSortable).each(function() {
			var sortable = $.data(this, "ui-sortable");
			if (sortable && !sortable.options.disabled) {
				inst.sortables.push({
					instance: sortable,
					shouldRevert: sortable.options.revert
				});
				sortable.refreshPositions();	// Call the sortable's refreshPositions at drag start to refresh the containerCache since the sortable container cache is used in drag and needs to be up to date (this will ensure it's initialised as well as being kept in step with any changes that might have happened on the page).
				sortable._trigger("activate", event, uiSortable);
			}
		});

	},
	stop: function(event, ui) {

		//If we are still over the sortable, we fake the stop event of the sortable, but also remove helper
		var inst = $(this).data("ui-draggable"),
			uiSortable = $.extend({}, ui, { item: inst.element });

		$.each(inst.sortables, function() {
			if(this.instance.isOver) {

				this.instance.isOver = 0;

				inst.cancelHelperRemoval = true; //Don't remove the helper in the draggable instance
				this.instance.cancelHelperRemoval = false; //Remove it in the sortable instance (so sortable plugins like revert still work)

				//The sortable revert is supported, and we have to set a temporary dropped variable on the draggable to support revert: "valid/invalid"
				if(this.shouldRevert) {
					this.instance.options.revert = this.shouldRevert;
				}

				//Trigger the stop of the sortable
				this.instance._mouseStop(event);

				this.instance.options.helper = this.instance.options._helper;

				//If the helper has been the original item, restore properties in the sortable
				if(inst.options.helper === "original") {
					this.instance.currentItem.css({ top: "auto", left: "auto" });
				}

			} else {
				this.instance.cancelHelperRemoval = false; //Remove the helper in the sortable instance
				this.instance._trigger("deactivate", event, uiSortable);
			}

		});

	},
	drag: function(event, ui) {

		var inst = $(this).data("ui-draggable"), that = this;

		$.each(inst.sortables, function() {

			var innermostIntersecting = false,
				thisSortable = this;

			//Copy over some variables to allow calling the sortable's native _intersectsWith
			this.instance.positionAbs = inst.positionAbs;
			this.instance.helperProportions = inst.helperProportions;
			this.instance.offset.click = inst.offset.click;

			if(this.instance._intersectsWith(this.instance.containerCache)) {
				innermostIntersecting = true;
				$.each(inst.sortables, function () {
					this.instance.positionAbs = inst.positionAbs;
					this.instance.helperProportions = inst.helperProportions;
					this.instance.offset.click = inst.offset.click;
					if (this !== thisSortable &&
						this.instance._intersectsWith(this.instance.containerCache) &&
						$.contains(thisSortable.instance.element[0], this.instance.element[0])
					) {
						innermostIntersecting = false;
					}
					return innermostIntersecting;
				});
			}


			if(innermostIntersecting) {
				//If it intersects, we use a little isOver variable and set it once, so our move-in stuff gets fired only once
				if(!this.instance.isOver) {

					this.instance.isOver = 1;
					//Now we fake the start of dragging for the sortable instance,
					//by cloning the list group item, appending it to the sortable and using it as inst.currentItem
					//We can then fire the start event of the sortable with our passed browser event, and our own helper (so it doesn't create a new one)
					this.instance.currentItem = $(that).clone().removeAttr("id").appendTo(this.instance.element).data("ui-sortable-item", true);
					this.instance.options._helper = this.instance.options.helper; //Store helper option to later restore it
					this.instance.options.helper = function() { return ui.helper[0]; };

					event.target = this.instance.currentItem[0];
					this.instance._mouseCapture(event, true);
					this.instance._mouseStart(event, true, true);

					//Because the browser event is way off the new appended portlet, we modify a couple of variables to reflect the changes
					this.instance.offset.click.top = inst.offset.click.top;
					this.instance.offset.click.left = inst.offset.click.left;
					this.instance.offset.parent.left -= inst.offset.parent.left - this.instance.offset.parent.left;
					this.instance.offset.parent.top -= inst.offset.parent.top - this.instance.offset.parent.top;

					inst._trigger("toSortable", event);
					inst.dropped = this.instance.element; //draggable revert needs that
					//hack so receive/update callbacks work (mostly)
					inst.currentItem = inst.element;
					this.instance.fromOutside = inst;

				}

				//Provided we did all the previous steps, we can fire the drag event of the sortable on every draggable drag, when it intersects with the sortable
				if(this.instance.currentItem) {
					this.instance._mouseDrag(event);
				}

			} else {

				//If it doesn't intersect with the sortable, and it intersected before,
				//we fake the drag stop of the sortable, but make sure it doesn't remove the helper by using cancelHelperRemoval
				if(this.instance.isOver) {

					this.instance.isOver = 0;
					this.instance.cancelHelperRemoval = true;

					//Prevent reverting on this forced stop
					this.instance.options.revert = false;

					// The out event needs to be triggered independently
					this.instance._trigger("out", event, this.instance._uiHash(this.instance));

					this.instance._mouseStop(event, true);
					this.instance.options.helper = this.instance.options._helper;

					//Now we remove our currentItem, the list group clone again, and the placeholder, and animate the helper back to it's original size
					this.instance.currentItem.remove();
					if(this.instance.placeholder) {
						this.instance.placeholder.remove();
					}

					inst._trigger("fromSortable", event);
					inst.dropped = false; //draggable revert needs that
				}

			}

		});

	}
});

$.ui.plugin.add("draggable", "cursor", {
	start: function() {
		var t = $("body"), o = $(this).data("ui-draggable").options;
		if (t.css("cursor")) {
			o._cursor = t.css("cursor");
		}
		t.css("cursor", o.cursor);
	},
	stop: function() {
		var o = $(this).data("ui-draggable").options;
		if (o._cursor) {
			$("body").css("cursor", o._cursor);
		}
	}
});

$.ui.plugin.add("draggable", "opacity", {
	start: function(event, ui) {
		var t = $(ui.helper), o = $(this).data("ui-draggable").options;
		if(t.css("opacity")) {
			o._opacity = t.css("opacity");
		}
		t.css("opacity", o.opacity);
	},
	stop: function(event, ui) {
		var o = $(this).data("ui-draggable").options;
		if(o._opacity) {
			$(ui.helper).css("opacity", o._opacity);
		}
	}
});

$.ui.plugin.add("draggable", "scroll", {
	start: function() {
		var i = $(this).data("ui-draggable");
		if(i.scrollParent[0] !== document && i.scrollParent[0].tagName !== "HTML") {
			i.overflowOffset = i.scrollParent.offset();
		}
	},
	drag: function( event ) {

		var i = $(this).data("ui-draggable"), o = i.options, scrolled = false;

		if(i.scrollParent[0] !== document && i.scrollParent[0].tagName !== "HTML") {

			if(!o.axis || o.axis !== "x") {
				if((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity) {
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + o.scrollSpeed;
				} else if(event.pageY - i.overflowOffset.top < o.scrollSensitivity) {
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - o.scrollSpeed;
				}
			}

			if(!o.axis || o.axis !== "y") {
				if((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity) {
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + o.scrollSpeed;
				} else if(event.pageX - i.overflowOffset.left < o.scrollSensitivity) {
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - o.scrollSpeed;
				}
			}

		} else {

			if(!o.axis || o.axis !== "x") {
				if(event.pageY - $(document).scrollTop() < o.scrollSensitivity) {
					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
				} else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity) {
					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
				}
			}

			if(!o.axis || o.axis !== "y") {
				if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity) {
					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
				} else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity) {
					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
				}
			}

		}

		if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
			$.ui.ddmanager.prepareOffsets(i, event);
		}

	}
});

$.ui.plugin.add("draggable", "snap", {
	start: function() {

		var i = $(this).data("ui-draggable"),
			o = i.options;

		i.snapElements = [];

		$(o.snap.constructor !== String ? ( o.snap.items || ":data(ui-draggable)" ) : o.snap).each(function() {
			var $t = $(this),
				$o = $t.offset();
			if(this !== i.element[0]) {
				i.snapElements.push({
					item: this,
					width: $t.outerWidth(), height: $t.outerHeight(),
					top: $o.top, left: $o.left
				});
			}
		});

	},
	drag: function(event, ui) {

		var ts, bs, ls, rs, l, r, t, b, i, first,
			inst = $(this).data("ui-draggable"),
			o = inst.options,
			d = o.snapTolerance,
			x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
			y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

		for (i = inst.snapElements.length - 1; i >= 0; i--){

			l = inst.snapElements[i].left;
			r = l + inst.snapElements[i].width;
			t = inst.snapElements[i].top;
			b = t + inst.snapElements[i].height;

			if ( x2 < l - d || x1 > r + d || y2 < t - d || y1 > b + d || !$.contains( inst.snapElements[ i ].item.ownerDocument, inst.snapElements[ i ].item ) ) {
				if(inst.snapElements[i].snapping) {
					(inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
				}
				inst.snapElements[i].snapping = false;
				continue;
			}

			if(o.snapMode !== "inner") {
				ts = Math.abs(t - y2) <= d;
				bs = Math.abs(b - y1) <= d;
				ls = Math.abs(l - x2) <= d;
				rs = Math.abs(r - x1) <= d;
				if(ts) {
					ui.position.top = inst._convertPositionTo("relative", { top: t - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
				}
				if(bs) {
					ui.position.top = inst._convertPositionTo("relative", { top: b, left: 0 }).top - inst.margins.top;
				}
				if(ls) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l - inst.helperProportions.width }).left - inst.margins.left;
				}
				if(rs) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r }).left - inst.margins.left;
				}
			}

			first = (ts || bs || ls || rs);

			if(o.snapMode !== "outer") {
				ts = Math.abs(t - y1) <= d;
				bs = Math.abs(b - y2) <= d;
				ls = Math.abs(l - x1) <= d;
				rs = Math.abs(r - x2) <= d;
				if(ts) {
					ui.position.top = inst._convertPositionTo("relative", { top: t, left: 0 }).top - inst.margins.top;
				}
				if(bs) {
					ui.position.top = inst._convertPositionTo("relative", { top: b - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
				}
				if(ls) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l }).left - inst.margins.left;
				}
				if(rs) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r - inst.helperProportions.width }).left - inst.margins.left;
				}
			}

			if(!inst.snapElements[i].snapping && (ts || bs || ls || rs || first)) {
				(inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
			}
			inst.snapElements[i].snapping = (ts || bs || ls || rs || first);

		}

	}
});

$.ui.plugin.add("draggable", "stack", {
	start: function() {
		var min,
			o = this.data("ui-draggable").options,
			group = $.makeArray($(o.stack)).sort(function(a,b) {
				return (parseInt($(a).css("zIndex"),10) || 0) - (parseInt($(b).css("zIndex"),10) || 0);
			});

		if (!group.length) { return; }

		min = parseInt($(group[0]).css("zIndex"), 10) || 0;
		$(group).each(function(i) {
			$(this).css("zIndex", min + i);
		});
		this.css("zIndex", (min + group.length));
	}
});

$.ui.plugin.add("draggable", "zIndex", {
	start: function(event, ui) {
		var t = $(ui.helper), o = $(this).data("ui-draggable").options;
		if(t.css("zIndex")) {
			o._zIndex = t.css("zIndex");
		}
		t.css("zIndex", o.zIndex);
	},
	stop: function(event, ui) {
		var o = $(this).data("ui-draggable").options;
		if(o._zIndex) {
			$(ui.helper).css("zIndex", o._zIndex);
		}
	}
});

})(jQuery);
(function( $, undefined ) {

function isOverAxis( x, reference, size ) {
	return ( x > reference ) && ( x < ( reference + size ) );
}

$.widget("ui.droppable", {
	version: "1.10.3",
	widgetEventPrefix: "drop",
	options: {
		accept: "*",
		activeClass: false,
		addClasses: true,
		greedy: false,
		hoverClass: false,
		scope: "default",
		tolerance: "intersect",

		// callbacks
		activate: null,
		deactivate: null,
		drop: null,
		out: null,
		over: null
	},
	_create: function() {

		var o = this.options,
			accept = o.accept;

		this.isover = false;
		this.isout = true;

		this.accept = $.isFunction(accept) ? accept : function(d) {
			return d.is(accept);
		};

		//Store the droppable's proportions
		this.proportions = { width: this.element[0].offsetWidth, height: this.element[0].offsetHeight };

		// Add the reference and positions to the manager
		$.ui.ddmanager.droppables[o.scope] = $.ui.ddmanager.droppables[o.scope] || [];
		$.ui.ddmanager.droppables[o.scope].push(this);

		(o.addClasses && this.element.addClass("ui-droppable"));

	},

	_destroy: function() {
		var i = 0,
			drop = $.ui.ddmanager.droppables[this.options.scope];

		for ( ; i < drop.length; i++ ) {
			if ( drop[i] === this ) {
				drop.splice(i, 1);
			}
		}

		this.element.removeClass("ui-droppable ui-droppable-disabled");
	},

	_setOption: function(key, value) {

		if(key === "accept") {
			this.accept = $.isFunction(value) ? value : function(d) {
				return d.is(value);
			};
		}
		$.Widget.prototype._setOption.apply(this, arguments);
	},

	_activate: function(event) {
		var draggable = $.ui.ddmanager.current;
		if(this.options.activeClass) {
			this.element.addClass(this.options.activeClass);
		}
		if(draggable){
			this._trigger("activate", event, this.ui(draggable));
		}
	},

	_deactivate: function(event) {
		var draggable = $.ui.ddmanager.current;
		if(this.options.activeClass) {
			this.element.removeClass(this.options.activeClass);
		}
		if(draggable){
			this._trigger("deactivate", event, this.ui(draggable));
		}
	},

	_over: function(event) {

		var draggable = $.ui.ddmanager.current;

		// Bail if draggable and droppable are same element
		if (!draggable || (draggable.currentItem || draggable.element)[0] === this.element[0]) {
			return;
		}

		if (this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.hoverClass) {
				this.element.addClass(this.options.hoverClass);
			}
			this._trigger("over", event, this.ui(draggable));
		}

	},

	_out: function(event) {

		var draggable = $.ui.ddmanager.current;

		// Bail if draggable and droppable are same element
		if (!draggable || (draggable.currentItem || draggable.element)[0] === this.element[0]) {
			return;
		}

		if (this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.hoverClass) {
				this.element.removeClass(this.options.hoverClass);
			}
			this._trigger("out", event, this.ui(draggable));
		}

	},

	_drop: function(event,custom) {

		var draggable = custom || $.ui.ddmanager.current,
			childrenIntersection = false;

		// Bail if draggable and droppable are same element
		if (!draggable || (draggable.currentItem || draggable.element)[0] === this.element[0]) {
			return false;
		}

		this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function() {
			var inst = $.data(this, "ui-droppable");
			if(
				inst.options.greedy &&
				!inst.options.disabled &&
				inst.options.scope === draggable.options.scope &&
				inst.accept.call(inst.element[0], (draggable.currentItem || draggable.element)) &&
				$.ui.intersect(draggable, $.extend(inst, { offset: inst.element.offset() }), inst.options.tolerance)
			) { childrenIntersection = true; return false; }
		});
		if(childrenIntersection) {
			return false;
		}

		if(this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.activeClass) {
				this.element.removeClass(this.options.activeClass);
			}
			if(this.options.hoverClass) {
				this.element.removeClass(this.options.hoverClass);
			}
			this._trigger("drop", event, this.ui(draggable));
			return this.element;
		}

		return false;

	},

	ui: function(c) {
		return {
			draggable: (c.currentItem || c.element),
			helper: c.helper,
			position: c.position,
			offset: c.positionAbs
		};
	}

});

$.ui.intersect = function(draggable, droppable, toleranceMode) {

	if (!droppable.offset) {
		return false;
	}

	var draggableLeft, draggableTop,
		x1 = (draggable.positionAbs || draggable.position.absolute).left, x2 = x1 + draggable.helperProportions.width,
		y1 = (draggable.positionAbs || draggable.position.absolute).top, y2 = y1 + draggable.helperProportions.height,
		l = droppable.offset.left, r = l + droppable.proportions.width,
		t = droppable.offset.top, b = t + droppable.proportions.height;

	switch (toleranceMode) {
		case "fit":
			return (l <= x1 && x2 <= r && t <= y1 && y2 <= b);
		case "intersect":
			return (l < x1 + (draggable.helperProportions.width / 2) && // Right Half
				x2 - (draggable.helperProportions.width / 2) < r && // Left Half
				t < y1 + (draggable.helperProportions.height / 2) && // Bottom Half
				y2 - (draggable.helperProportions.height / 2) < b ); // Top Half
		case "pointer":
			draggableLeft = ((draggable.positionAbs || draggable.position.absolute).left + (draggable.clickOffset || draggable.offset.click).left);
			draggableTop = ((draggable.positionAbs || draggable.position.absolute).top + (draggable.clickOffset || draggable.offset.click).top);
			return isOverAxis( draggableTop, t, droppable.proportions.height ) && isOverAxis( draggableLeft, l, droppable.proportions.width );
		case "touch":
			return (
				(y1 >= t && y1 <= b) ||	// Top edge touching
				(y2 >= t && y2 <= b) ||	// Bottom edge touching
				(y1 < t && y2 > b)		// Surrounded vertically
			) && (
				(x1 >= l && x1 <= r) ||	// Left edge touching
				(x2 >= l && x2 <= r) ||	// Right edge touching
				(x1 < l && x2 > r)		// Surrounded horizontally
			);
		default:
			return false;
		}

};

/*
	This manager tracks offsets of draggables and droppables
*/
$.ui.ddmanager = {
	current: null,
	droppables: { "default": [] },
	prepareOffsets: function(t, event) {

		var i, j,
			m = $.ui.ddmanager.droppables[t.options.scope] || [],
			type = event ? event.type : null, // workaround for #2317
			list = (t.currentItem || t.element).find(":data(ui-droppable)").addBack();

		droppablesLoop: for (i = 0; i < m.length; i++) {

			//No disabled and non-accepted
			if(m[i].options.disabled || (t && !m[i].accept.call(m[i].element[0],(t.currentItem || t.element)))) {
				continue;
			}

			// Filter out elements in the current dragged item
			for (j=0; j < list.length; j++) {
				if(list[j] === m[i].element[0]) {
					m[i].proportions.height = 0;
					continue droppablesLoop;
				}
			}

			m[i].visible = m[i].element.css("display") !== "none";
			if(!m[i].visible) {
				continue;
			}

			//Activate the droppable if used directly from draggables
			if(type === "mousedown") {
				m[i]._activate.call(m[i], event);
			}

			m[i].offset = m[i].element.offset();
			m[i].proportions = { width: m[i].element[0].offsetWidth, height: m[i].element[0].offsetHeight };

		}

	},
	drop: function(draggable, event) {

		var dropped = false;
		// Create a copy of the droppables in case the list changes during the drop (#9116)
		$.each(($.ui.ddmanager.droppables[draggable.options.scope] || []).slice(), function() {

			if(!this.options) {
				return;
			}
			if (!this.options.disabled && this.visible && $.ui.intersect(draggable, this, this.options.tolerance)) {
				dropped = this._drop.call(this, event) || dropped;
			}

			if (!this.options.disabled && this.visible && this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
				this.isout = true;
				this.isover = false;
				this._deactivate.call(this, event);
			}

		});
		return dropped;

	},
	dragStart: function( draggable, event ) {
		//Listen for scrolling so that if the dragging causes scrolling the position of the droppables can be recalculated (see #5003)
		draggable.element.parentsUntil( "body" ).bind( "scroll.droppable", function() {
			if( !draggable.options.refreshPositions ) {
				$.ui.ddmanager.prepareOffsets( draggable, event );
			}
		});
	},
	drag: function(draggable, event) {

		//If you have a highly dynamic page, you might try this option. It renders positions every time you move the mouse.
		if(draggable.options.refreshPositions) {
			$.ui.ddmanager.prepareOffsets(draggable, event);
		}

		//Run through all droppables and check their positions based on specific tolerance options
		$.each($.ui.ddmanager.droppables[draggable.options.scope] || [], function() {

			if(this.options.disabled || this.greedyChild || !this.visible) {
				return;
			}

			var parentInstance, scope, parent,
				intersects = $.ui.intersect(draggable, this, this.options.tolerance),
				c = !intersects && this.isover ? "isout" : (intersects && !this.isover ? "isover" : null);
			if(!c) {
				return;
			}

			if (this.options.greedy) {
				// find droppable parents with same scope
				scope = this.options.scope;
				parent = this.element.parents(":data(ui-droppable)").filter(function () {
					return $.data(this, "ui-droppable").options.scope === scope;
				});

				if (parent.length) {
					parentInstance = $.data(parent[0], "ui-droppable");
					parentInstance.greedyChild = (c === "isover");
				}
			}

			// we just moved into a greedy child
			if (parentInstance && c === "isover") {
				parentInstance.isover = false;
				parentInstance.isout = true;
				parentInstance._out.call(parentInstance, event);
			}

			this[c] = true;
			this[c === "isout" ? "isover" : "isout"] = false;
			this[c === "isover" ? "_over" : "_out"].call(this, event);

			// we just moved out of a greedy child
			if (parentInstance && c === "isout") {
				parentInstance.isout = false;
				parentInstance.isover = true;
				parentInstance._over.call(parentInstance, event);
			}
		});

	},
	dragStop: function( draggable, event ) {
		draggable.element.parentsUntil( "body" ).unbind( "scroll.droppable" );
		//Call prepareOffsets one final time since IE does not fire return scroll events when overflow was caused by drag (see #5003)
		if( !draggable.options.refreshPositions ) {
			$.ui.ddmanager.prepareOffsets( draggable, event );
		}
	}
};

})(jQuery);
(function( $, undefined ) {

function num(v) {
	return parseInt(v, 10) || 0;
}

function isNumber(value) {
	return !isNaN(parseInt(value, 10));
}

$.widget("ui.resizable", $.ui.mouse, {
	version: "1.10.3",
	widgetEventPrefix: "resize",
	options: {
		alsoResize: false,
		animate: false,
		animateDuration: "slow",
		animateEasing: "swing",
		aspectRatio: false,
		autoHide: false,
		containment: false,
		ghost: false,
		grid: false,
		handles: "e,s,se",
		helper: false,
		maxHeight: null,
		maxWidth: null,
		minHeight: 10,
		minWidth: 10,
		// See #7960
		zIndex: 90,

		// callbacks
		resize: null,
		start: null,
		stop: null
	},
	_create: function() {

		var n, i, handle, axis, hname,
			that = this,
			o = this.options;
		this.element.addClass("ui-resizable");

		$.extend(this, {
			_aspectRatio: !!(o.aspectRatio),
			aspectRatio: o.aspectRatio,
			originalElement: this.element,
			_proportionallyResizeElements: [],
			_helper: o.helper || o.ghost || o.animate ? o.helper || "ui-resizable-helper" : null
		});

		//Wrap the element if it cannot hold child nodes
		if(this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)) {

			//Create a wrapper element and set the wrapper to the new current internal element
			this.element.wrap(
				$("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({
					position: this.element.css("position"),
					width: this.element.outerWidth(),
					height: this.element.outerHeight(),
					top: this.element.css("top"),
					left: this.element.css("left")
				})
			);

			//Overwrite the original this.element
			this.element = this.element.parent().data(
				"ui-resizable", this.element.data("ui-resizable")
			);

			this.elementIsWrapper = true;

			//Move margins to the wrapper
			this.element.css({ marginLeft: this.originalElement.css("marginLeft"), marginTop: this.originalElement.css("marginTop"), marginRight: this.originalElement.css("marginRight"), marginBottom: this.originalElement.css("marginBottom") });
			this.originalElement.css({ marginLeft: 0, marginTop: 0, marginRight: 0, marginBottom: 0});

			//Prevent Safari textarea resize
			this.originalResizeStyle = this.originalElement.css("resize");
			this.originalElement.css("resize", "none");

			//Push the actual element to our proportionallyResize internal array
			this._proportionallyResizeElements.push(this.originalElement.css({ position: "static", zoom: 1, display: "block" }));

			// avoid IE jump (hard set the margin)
			this.originalElement.css({ margin: this.originalElement.css("margin") });

			// fix handlers offset
			this._proportionallyResize();

		}

		this.handles = o.handles || (!$(".ui-resizable-handle", this.element).length ? "e,s,se" : { n: ".ui-resizable-n", e: ".ui-resizable-e", s: ".ui-resizable-s", w: ".ui-resizable-w", se: ".ui-resizable-se", sw: ".ui-resizable-sw", ne: ".ui-resizable-ne", nw: ".ui-resizable-nw" });
		if(this.handles.constructor === String) {

			if ( this.handles === "all") {
				this.handles = "n,e,s,w,se,sw,ne,nw";
			}

			n = this.handles.split(",");
			this.handles = {};

			for(i = 0; i < n.length; i++) {

				handle = $.trim(n[i]);
				hname = "ui-resizable-"+handle;
				axis = $("<div class='ui-resizable-handle " + hname + "'></div>");

				// Apply zIndex to all handles - see #7960
				axis.css({ zIndex: o.zIndex });

				//TODO : What's going on here?
				if ("se" === handle) {
					axis.addClass("ui-icon ui-icon-gripsmall-diagonal-se");
				}

				//Insert into internal handles object and append to element
				this.handles[handle] = ".ui-resizable-"+handle;
				this.element.append(axis);
			}

		}

		this._renderAxis = function(target) {

			var i, axis, padPos, padWrapper;

			target = target || this.element;

			for(i in this.handles) {

				if(this.handles[i].constructor === String) {
					this.handles[i] = $(this.handles[i], this.element).show();
				}

				//Apply pad to wrapper element, needed to fix axis position (textarea, inputs, scrolls)
				if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {

					axis = $(this.handles[i], this.element);

					//Checking the correct pad and border
					padWrapper = /sw|ne|nw|se|n|s/.test(i) ? axis.outerHeight() : axis.outerWidth();

					//The padding type i have to apply...
					padPos = [ "padding",
						/ne|nw|n/.test(i) ? "Top" :
						/se|sw|s/.test(i) ? "Bottom" :
						/^e$/.test(i) ? "Right" : "Left" ].join("");

					target.css(padPos, padWrapper);

					this._proportionallyResize();

				}

				//TODO: What's that good for? There's not anything to be executed left
				if(!$(this.handles[i]).length) {
					continue;
				}
			}
		};

		//TODO: make renderAxis a prototype function
		this._renderAxis(this.element);

		this._handles = $(".ui-resizable-handle", this.element)
			.disableSelection();

		//Matching axis name
		this._handles.mouseover(function() {
			if (!that.resizing) {
				if (this.className) {
					axis = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
				}
				//Axis, default = se
				that.axis = axis && axis[1] ? axis[1] : "se";
			}
		});

		//If we want to auto hide the elements
		if (o.autoHide) {
			this._handles.hide();
			$(this.element)
				.addClass("ui-resizable-autohide")
				.mouseenter(function() {
					if (o.disabled) {
						return;
					}
					$(this).removeClass("ui-resizable-autohide");
					that._handles.show();
				})
				.mouseleave(function(){
					if (o.disabled) {
						return;
					}
					if (!that.resizing) {
						$(this).addClass("ui-resizable-autohide");
						that._handles.hide();
					}
				});
		}

		//Initialize the mouse interaction
		this._mouseInit();

	},

	_destroy: function() {

		this._mouseDestroy();

		var wrapper,
			_destroy = function(exp) {
				$(exp).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing")
					.removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove();
			};

		//TODO: Unwrap at same DOM position
		if (this.elementIsWrapper) {
			_destroy(this.element);
			wrapper = this.element;
			this.originalElement.css({
				position: wrapper.css("position"),
				width: wrapper.outerWidth(),
				height: wrapper.outerHeight(),
				top: wrapper.css("top"),
				left: wrapper.css("left")
			}).insertAfter( wrapper );
			wrapper.remove();
		}

		this.originalElement.css("resize", this.originalResizeStyle);
		_destroy(this.originalElement);

		return this;
	},

	_mouseCapture: function(event) {
		var i, handle,
			capture = false;

		for (i in this.handles) {
			handle = $(this.handles[i])[0];
			if (handle === event.target || $.contains(handle, event.target)) {
				capture = true;
			}
		}

		return !this.options.disabled && capture;
	},

	_mouseStart: function(event) {

		var curleft, curtop, cursor,
			o = this.options,
			iniPos = this.element.position(),
			el = this.element;

		this.resizing = true;

		// bugfix for http://dev.jquery.com/ticket/1749
		if ( (/absolute/).test( el.css("position") ) ) {
			el.css({ position: "absolute", top: el.css("top"), left: el.css("left") });
		} else if (el.is(".ui-draggable")) {
			el.css({ position: "absolute", top: iniPos.top, left: iniPos.left });
		}

		this._renderProxy();

		curleft = num(this.helper.css("left"));
		curtop = num(this.helper.css("top"));

		if (o.containment) {
			curleft += $(o.containment).scrollLeft() || 0;
			curtop += $(o.containment).scrollTop() || 0;
		}

		//Store needed variables
		this.offset = this.helper.offset();
		this.position = { left: curleft, top: curtop };
		this.size = this._helper ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
		this.originalSize = this._helper ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
		this.originalPosition = { left: curleft, top: curtop };
		this.sizeDiff = { width: el.outerWidth() - el.width(), height: el.outerHeight() - el.height() };
		this.originalMousePosition = { left: event.pageX, top: event.pageY };

		//Aspect Ratio
		this.aspectRatio = (typeof o.aspectRatio === "number") ? o.aspectRatio : ((this.originalSize.width / this.originalSize.height) || 1);

		cursor = $(".ui-resizable-" + this.axis).css("cursor");
		$("body").css("cursor", cursor === "auto" ? this.axis + "-resize" : cursor);

		el.addClass("ui-resizable-resizing");
		this._propagate("start", event);
		return true;
	},

	_mouseDrag: function(event) {

		//Increase performance, avoid regex
		var data,
			el = this.helper, props = {},
			smp = this.originalMousePosition,
			a = this.axis,
			prevTop = this.position.top,
			prevLeft = this.position.left,
			prevWidth = this.size.width,
			prevHeight = this.size.height,
			dx = (event.pageX-smp.left)||0,
			dy = (event.pageY-smp.top)||0,
			trigger = this._change[a];

		if (!trigger) {
			return false;
		}

		// Calculate the attrs that will be change
		data = trigger.apply(this, [event, dx, dy]);

		// Put this in the mouseDrag handler since the user can start pressing shift while resizing
		this._updateVirtualBoundaries(event.shiftKey);
		if (this._aspectRatio || event.shiftKey) {
			data = this._updateRatio(data, event);
		}

		data = this._respectSize(data, event);

		this._updateCache(data);

		// plugins callbacks need to be called first
		this._propagate("resize", event);

		if (this.position.top !== prevTop) {
			props.top = this.position.top + "px";
		}
		if (this.position.left !== prevLeft) {
			props.left = this.position.left + "px";
		}
		if (this.size.width !== prevWidth) {
			props.width = this.size.width + "px";
		}
		if (this.size.height !== prevHeight) {
			props.height = this.size.height + "px";
		}
		el.css(props);

		if (!this._helper && this._proportionallyResizeElements.length) {
			this._proportionallyResize();
		}

		// Call the user callback if the element was resized
		if ( ! $.isEmptyObject(props) ) {
			this._trigger("resize", event, this.ui());
		}

		return false;
	},

	_mouseStop: function(event) {

		this.resizing = false;
		var pr, ista, soffseth, soffsetw, s, left, top,
			o = this.options, that = this;

		if(this._helper) {

			pr = this._proportionallyResizeElements;
			ista = pr.length && (/textarea/i).test(pr[0].nodeName);
			soffseth = ista && $.ui.hasScroll(pr[0], "left") /* TODO - jump height */ ? 0 : that.sizeDiff.height;
			soffsetw = ista ? 0 : that.sizeDiff.width;

			s = { width: (that.helper.width()  - soffsetw), height: (that.helper.height() - soffseth) };
			left = (parseInt(that.element.css("left"), 10) + (that.position.left - that.originalPosition.left)) || null;
			top = (parseInt(that.element.css("top"), 10) + (that.position.top - that.originalPosition.top)) || null;

			if (!o.animate) {
				this.element.css($.extend(s, { top: top, left: left }));
			}

			that.helper.height(that.size.height);
			that.helper.width(that.size.width);

			if (this._helper && !o.animate) {
				this._proportionallyResize();
			}
		}

		$("body").css("cursor", "auto");

		this.element.removeClass("ui-resizable-resizing");

		this._propagate("stop", event);

		if (this._helper) {
			this.helper.remove();
		}

		return false;

	},

	_updateVirtualBoundaries: function(forceAspectRatio) {
		var pMinWidth, pMaxWidth, pMinHeight, pMaxHeight, b,
			o = this.options;

		b = {
			minWidth: isNumber(o.minWidth) ? o.minWidth : 0,
			maxWidth: isNumber(o.maxWidth) ? o.maxWidth : Infinity,
			minHeight: isNumber(o.minHeight) ? o.minHeight : 0,
			maxHeight: isNumber(o.maxHeight) ? o.maxHeight : Infinity
		};

		if(this._aspectRatio || forceAspectRatio) {
			// We want to create an enclosing box whose aspect ration is the requested one
			// First, compute the "projected" size for each dimension based on the aspect ratio and other dimension
			pMinWidth = b.minHeight * this.aspectRatio;
			pMinHeight = b.minWidth / this.aspectRatio;
			pMaxWidth = b.maxHeight * this.aspectRatio;
			pMaxHeight = b.maxWidth / this.aspectRatio;

			if(pMinWidth > b.minWidth) {
				b.minWidth = pMinWidth;
			}
			if(pMinHeight > b.minHeight) {
				b.minHeight = pMinHeight;
			}
			if(pMaxWidth < b.maxWidth) {
				b.maxWidth = pMaxWidth;
			}
			if(pMaxHeight < b.maxHeight) {
				b.maxHeight = pMaxHeight;
			}
		}
		this._vBoundaries = b;
	},

	_updateCache: function(data) {
		this.offset = this.helper.offset();
		if (isNumber(data.left)) {
			this.position.left = data.left;
		}
		if (isNumber(data.top)) {
			this.position.top = data.top;
		}
		if (isNumber(data.height)) {
			this.size.height = data.height;
		}
		if (isNumber(data.width)) {
			this.size.width = data.width;
		}
	},

	_updateRatio: function( data ) {

		var cpos = this.position,
			csize = this.size,
			a = this.axis;

		if (isNumber(data.height)) {
			data.width = (data.height * this.aspectRatio);
		} else if (isNumber(data.width)) {
			data.height = (data.width / this.aspectRatio);
		}

		if (a === "sw") {
			data.left = cpos.left + (csize.width - data.width);
			data.top = null;
		}
		if (a === "nw") {
			data.top = cpos.top + (csize.height - data.height);
			data.left = cpos.left + (csize.width - data.width);
		}

		return data;
	},

	_respectSize: function( data ) {

		var o = this._vBoundaries,
			a = this.axis,
			ismaxw = isNumber(data.width) && o.maxWidth && (o.maxWidth < data.width), ismaxh = isNumber(data.height) && o.maxHeight && (o.maxHeight < data.height),
			isminw = isNumber(data.width) && o.minWidth && (o.minWidth > data.width), isminh = isNumber(data.height) && o.minHeight && (o.minHeight > data.height),
			dw = this.originalPosition.left + this.originalSize.width,
			dh = this.position.top + this.size.height,
			cw = /sw|nw|w/.test(a), ch = /nw|ne|n/.test(a);
		if (isminw) {
			data.width = o.minWidth;
		}
		if (isminh) {
			data.height = o.minHeight;
		}
		if (ismaxw) {
			data.width = o.maxWidth;
		}
		if (ismaxh) {
			data.height = o.maxHeight;
		}

		if (isminw && cw) {
			data.left = dw - o.minWidth;
		}
		if (ismaxw && cw) {
			data.left = dw - o.maxWidth;
		}
		if (isminh && ch) {
			data.top = dh - o.minHeight;
		}
		if (ismaxh && ch) {
			data.top = dh - o.maxHeight;
		}

		// fixing jump error on top/left - bug #2330
		if (!data.width && !data.height && !data.left && data.top) {
			data.top = null;
		} else if (!data.width && !data.height && !data.top && data.left) {
			data.left = null;
		}

		return data;
	},

	_proportionallyResize: function() {

		if (!this._proportionallyResizeElements.length) {
			return;
		}

		var i, j, borders, paddings, prel,
			element = this.helper || this.element;

		for ( i=0; i < this._proportionallyResizeElements.length; i++) {

			prel = this._proportionallyResizeElements[i];

			if (!this.borderDif) {
				this.borderDif = [];
				borders = [prel.css("borderTopWidth"), prel.css("borderRightWidth"), prel.css("borderBottomWidth"), prel.css("borderLeftWidth")];
				paddings = [prel.css("paddingTop"), prel.css("paddingRight"), prel.css("paddingBottom"), prel.css("paddingLeft")];

				for ( j = 0; j < borders.length; j++ ) {
					this.borderDif[ j ] = ( parseInt( borders[ j ], 10 ) || 0 ) + ( parseInt( paddings[ j ], 10 ) || 0 );
				}
			}

			prel.css({
				height: (element.height() - this.borderDif[0] - this.borderDif[2]) || 0,
				width: (element.width() - this.borderDif[1] - this.borderDif[3]) || 0
			});

		}

	},

	_renderProxy: function() {

		var el = this.element, o = this.options;
		this.elementOffset = el.offset();

		if(this._helper) {

			this.helper = this.helper || $("<div style='overflow:hidden;'></div>");

			this.helper.addClass(this._helper).css({
				width: this.element.outerWidth() - 1,
				height: this.element.outerHeight() - 1,
				position: "absolute",
				left: this.elementOffset.left +"px",
				top: this.elementOffset.top +"px",
				zIndex: ++o.zIndex //TODO: Don't modify option
			});

			this.helper
				.appendTo("body")
				.disableSelection();

		} else {
			this.helper = this.element;
		}

	},

	_change: {
		e: function(event, dx) {
			return { width: this.originalSize.width + dx };
		},
		w: function(event, dx) {
			var cs = this.originalSize, sp = this.originalPosition;
			return { left: sp.left + dx, width: cs.width - dx };
		},
		n: function(event, dx, dy) {
			var cs = this.originalSize, sp = this.originalPosition;
			return { top: sp.top + dy, height: cs.height - dy };
		},
		s: function(event, dx, dy) {
			return { height: this.originalSize.height + dy };
		},
		se: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
		},
		sw: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
		},
		ne: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
		},
		nw: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
		}
	},

	_propagate: function(n, event) {
		$.ui.plugin.call(this, n, [event, this.ui()]);
		(n !== "resize" && this._trigger(n, event, this.ui()));
	},

	plugins: {},

	ui: function() {
		return {
			originalElement: this.originalElement,
			element: this.element,
			helper: this.helper,
			position: this.position,
			size: this.size,
			originalSize: this.originalSize,
			originalPosition: this.! jQuery UI - v1
		};
	}

});

/*
 * Resizable Extensions
 */

$.ui.plugin.add("rcludes: ", "animatuery{

	stop: func- v1( event ) {
		var that = $(0.3 ).data("ui-t.js, jque),
			o =.drag.op- v1ss, jqprery.ui.r_propor- v1allyncludeElementle.js,ista = pr.length && (/textarea/i).test(pr[0].nodeNamejs, jqsoffseth = .js, && , jquhasScroll.autoc, "left") /* TODO - jump height */ ? 0 .10.at.querDiff.jquery, jquery.ui.wutton.jsmenu.js, jquery.ui.pwidth, jquetyle = { pinne: (s, jqueryspinne - js, jque), jquery.js, jquery.ujquery.tip.js, jh) }s, jq jqu = (parseInts, jque.ui.so.css(, jquer, 10) +js, jqupUI - v1.query-y.ui.re jQuery UI - v1effec)) || nulls, jqtopy.ui.effect-bounce.js, jquery.utopfect-clip.js, jquery.ui.ery.u-drop.js, jquery.ui.effetopxplode.js,;

		ounce.js, jquui.mous(, jq$.eueryd( jque, ry.u&& query? {ect-:ect-,ke.js:ke.js,} : {}).js,				dura- v1.1ofect-scaDect-tras, jq	easingnsfer.js
* EjQuert 2013stery.ui.positijqueui.efy.ui.querry.ued MIT	.tabs.j.effect-bounce.js, jquery.upinnefect-clt 2013		y.ui.eff.effect-bounce.js, jquery.ujquery = /^ui-id-\d+$ery.uffect-fade.js, jquery.ui.effect-fold.-id-\d+$ect-sl.effect-bounce.js, jquery.ui.effect-clid-\d+}.js, ble.f (prshakuery.ui.ajqueryTE: $.autoc)uery.ui.tabs.jquerspinnerry.ui.eff35,
	jquery.yui.{
		BAsed MIT// seleagating t.js,e, and updUMPAD_values for each ui.mouion contME: 36ry.ui.NUMPAeCache(querHOME: 36ry.ui.sele	NUMeget.js,ueryn.js,ui.c: 36,

		PAGEHOMEueryui.c, jquery.ui.widget.js, jquery.containi.soe.js, jquartributors LicensIT */
.js, jq, p, co, ch, cw,i.tabsR: 13,
	 jquerraggable.js, jquery.ui.droppable.js, jquery.ui.resizable.js,elery.ui.r;

// pl, jquc = o.T: 39,
		SPber" cery.(oc instanceof $) ? oc.get(0) : (/parent/ry.ui.oc) thiel.eout(f()
					setToc109,
 8,
!ce	DELETEreturnOME:,
		Ls, jqT: 39,
ery.ui.sogablece 109,
 8,
/docui.sounction() lode?
		==  :
				o	DELETEelem );
						Oy.ui.ry.uiect-sl0fect-: 0 //jq
	})( $.fn.focus UI - v1scrollParent: function()) {
		vareout(fD(function( $.js, jq: $(ments );
ffect-slt: functit 2013.tabs.j"))) || (/aspinne(uery.ui.effion"))) {
		jquery(( thi :
				o.bodyve)/).tNode.sdatepHqueryAGE_Dfn.call( // i'm a mple, so computeui.effect-, rs: (f bottom
s("psetion( .js, jq}, delay )js,  = []$.css$([ "Topery.Rts wi, "Ljque, "Bl)/)." ]).
		N(ui.positii, ne.js { p[i] = num(.js, jquery.upadding" +e {
		);		HOM};
	})( $.fn.focus ),

	scr.js, jqury.ui.(+$.css		var scrollParent;
		if .js, jquuery.ui.this,"overflow")+$.csSizery.uiy.ui.effe.js, jquinnere|abso() - p[3])end({
	}

		return (/fiWscrollst(th1])tatic|recuery.ui.r.fn.focus ),

	$.csscbuttverflow-x"));
			}().filt	},

	ery.ex: function( zIndepinne$.cssi.tool= (query.ui.datepicejs, jquery? c(relativrollP : cw +$.cssjquery.s.css( "zIndex", zIn	}

		if ( the|absongthh) {
				retue)/).test(this.css("positionIndeect-slcoeffec: functcoeffecss("posi	ENTER: 13,
		Ejquerylute|fixed)	},

	MPAD_Sy.ui.position.js, jquery.ui.woset, hkes beisPout(fr of ),

	Relativefunction( orig ) {
		return function( delay, fn ) {
			return typeocument) : scrollParent;
, c(this, jquery.ui.e.js, R_DIVquery.ui.aspect);
			||TRACT:.shiftKeyement i(thiquery.0) {
			0 }, n() {elem );
						}
					 );
				}ce[0] !rguments );ccordistatic/ery.ui.ceparentsUI - v1"))	DELETE=== "rcofn.call( turnspeffect<js, jqu_helper}

	/ Igno : 0return a, jquery.ui.tool== "fixery.ui.toolp.js, jq nested eljs, jquery.ui.effect-dements setTiiv style="z-index: 0;">ore th)+$.css 8,
	);
			DELETE:ct.js, jquery.ui.					// <div style/= "fixsition === $.cssPAGE_s, jquery.ui.effect			tnested elements with					// we ignorry.u case of nested elemery.uith an explicit value!isNaN( value ) && jquery.="z-index: -10;"><div style="z-inct-hignctionsetTid = "ui-id-" + (.css( "zIndex" ), 10 );
					if (  of 0
					// <divjquery.u== 0 ) {
						return value;
					}
				}ry.ui.

	uniqueId: function() {fn.call( elem ry.ui.}
				elm.length && eleeffec+s, jquery.ui.effec$.cs}
});

// se this ).remtion focusatop element, isTabtop {
		akes  = Math.abs("z-index: -10;"><}
});

// selectoseInt( ele</div>
		ame ) {
		map = elemen)lip.s, jquery.ui.spinne) {
		havioowerCase();
	if ( "area" === nodeName ) {+ (++uuirn 0;
.parentNode;
		+ (++uuid);
	me;
		if ( !elemenjquery.y );
		f this === "fixed" ) {
					// 
					searguounce.js, jqu	$( elem ).focu$.csnction consisten = /rnsisten|absoluteunction!!img && visible( img other browsers r );
			(;
		retur&&unction consisten	DELETEe.toLo-rs
function focusable(					// we ige.toLo;
		if ( !e this.e>rs
function focusapinnean explicit value of 0
					//ble( element );
 -makes css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return valu	// we igmapNamors must be jquery.e
		visible( elemenjquery		return this.each(function() {en";
		}).length; -ehavioeUniqueId: function() {
		return this.each(function() {
			if ( runiqueId.test( this.ex is igquery.ui.positi)uery.ui.draggable.js, jquery.ui.droppable.js, jquery.ui.resizable.js, is positioned
				positiorn a strin		var scrollParent;
		nction() {elem );
						}
					ta( enested able.jatm = ele{};

$h			inested($.css(thta( eery..attr( eutscrollParents, jquery.ui.spinner.js,0
		x" ) ) );
	}xed/).test(s, jquery.ui.progres );
				}-index: -10;"&& !fer.js
* ccordieName ) ed
					// other browsers return ale.js, j: 40,
ect-slhments wp = element0;"></div position et to a val		HOME:	// we igabIndexNaN = isNaN( tabIndex );
pecified
					// other browsers return a) && focusable( element, !isTabIndexNaN );
	}
});

// support: jQuery <1.8
if ( }		PAGE_UP: 33,
		PERIOD: 190,
		RIGHalso jquerACE: 32,
		TAB: 9,
		U P: 38
	}
})ion( orig ) {
		return function( delay, fn ) {
			return type_stor( norWidth: $.exp	DELETE:$terHe}).eq(0);
		} e	DELETE: }
});
gable.js, OME: 36eljquery.ui.droppable-(),
MPAD_SUBTion( $, undefined ) {

vel		scrollPa| {}(0);
		}
				size -= ).filter || {};

$.extend( $.ui, {
	eluery.ui.effect-cl: functborder ) {
					sfect-fold.ME: 36,m, sizeWidth" atic|r$( "<ypeof(o.(),
			ori
	retu"object" isNaN( ),
			ori	return (/(	DELETE 8,
oat( $.css( e188,
		DEsfer),
			ori	elem	return si[0]; outerW margin ) {
		; PAGE_t($.cs $}).eq(
		}

		$.fn,th,
				outerHeignner" + erHeon() ion( }t($.ion( ner" + name ] = functindex is ignored by the bro (n.js,, uijquery.ui.draggable.js, jquery.ui.droppable.js, jquery.ui.resizable.js,osery.ui.re jQuery			}ber" ?m, match[s, jquery.ui.effta( edelfunction( $y.ui.effect.js, jquery.ui.efoslength;
}||/).t.tabs.js, jquery.ui.tooltiosnt );
}
].cal0 );
	unct.id = "ui-id-" + (++u		retue ].callect-sliv>
					value = parsent( elems.eacAGE_Ds ig		_	return size;h,
				outerH, ceight: $.fn.outerHeight
			};

		function reduce( elem, ,
		Tgable.js, jquery.ui.droppable		$.each( sictor query.u.js, j, maser" c isNcry.ui.ac? c :					$( els(uin ) {
			y.ui.so	DOWN.filter( [iqueId , nents wi] :1, 1.6.2 (http://bu, orderjs, jque]CKSPACE:
			if cssndefined ) {i,37,
		DELETE: 4.ui.sumem =,
		T[sele]||clip.jize !$.fn.removOME: 36this a-b"&&"a-b">= 0	DELETE: 4, jque$.fn.r ="a-b"pulsate.jt : thPAGE_ ) ) | size, boery.is.pridth" ) ) || 0;
				}
				if ( margin ) {
					size -= parseFloat( $.css( empleTypgin" + t
			if ( size === undefined ) {
		.8
if  );
}

// sueprecateon() {+ name ].callui.ie = !!/ );
			}

			return this.query.ui.posit$.fn.innle.js, jremoveest(get.js, jqu== null ?
			 34,
	PAGE_UP: 33,
		PERIOD: 190,
		RIGHghosPACE: 32,
		TAB: 9,
		UP: 38ery.ui.draggable.js, jquery.ui.droppable.js uery.ui.resizable cer" + namAD_S.js, jquerfunct, margin ) {
			=== nodeNlonethis,"on", functth )cusableopacity: 0.25, display: "block",  browser: "eName ) "$.css( elecr" + namll( this,cturn th, margine/).tlParent: functionhis +.widClary.ud( selector =functi is deprecated.		if ( o functio	sizstrfilte?in: {
		a: ""divDefault();
		.appendToble( element,, seis ignored by the browaName );
			};
		}) :
		// support: jQuery <butto( "<a>" functan explicit 			var: 40,
eturn this.unbind( ".ui-disabl "visibility" ) ll( this,s must be visibl<1.8
if n !!$.data( elem, dataquery.ui.draggable.js, jquery.ui.droppable.joto.plugins[ i ] |		rele( element,n explicit .attr( 					start" iChildgins[ i ] |element	return t
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHgride.js, j.prototype;
			forquery.ui.draggable.js, jquery.ui.droppable.js, jquery.ui.resizable.js,".ui-disableSe[ "outer" + name] = function( size, margin ) {
			if ( typeof sunct= 0 ) xile.js,et.lfunc	plugin: {

			siznumbern( m[rflow ,erflow gs.jement m a ) {

Xem =low [0]||1, "tablow Yt the use1 wants to oxowerCaseround((});

$.e		return this/ t, bu) *rn falber" ?y "overflow" ) === rig[ "outer" + name urn faYse;
		}
Yontennewis.len=return th + oxTop",
		ue;
			 falsf ( !thisoition isMax	has = fa.m	}

		//cordODO: determ< 
			has , "tab;
		}oll ] > 0 DO: ue;
			ine whichue;
			 actue|absocause thiin

		// TODO, see ifine whi, see if>actually cause thiinto happen
		oll ] = 1e to
		//ue;
			he sc the sc, setrflow isrn fa
				}
		set, see itNode |
			has = f
			has =+rn falreturn ;
	}
});

 the scuery );
(oll ] > 0ay.prototyfined Y {

var uuid = 	}

		/e = Array.function( $, unde-ined ) {

var uuid = t doesn'e = Array.prototype.slice,
	_ {
	foata = $;
				})^(se|s|e)$unctiona an explicit value of 0
		 = funct() {
		vars.each(functioay.protot/.exe t($.c elem )ngerHandler( "remove" );
		// http://bugs.jquery.com/ticket/8235
		} catch( e ) {}
id ) ) {
				$( this 		retur- oy {}
	}
	_cleanDataswelems );
};

$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, 
				elendexNaN )ox {}
	}
	_cl$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, constructor, baseProtan be used as a mixin for multiple widg
				retur})(jQuery);
(0);
		} e $, undefined jque
$nt )				"ui.select jquery, jqumousede, fver.ui.: "1.10.3",
	esizabl:#8876 i,
				ion(odyullN	autoRefres funrugs );d.js,nce(this.cfilter: "*on( etoler( elem"touch"	};
	// callbacks
		createed:e.js, jqucreateuery Construct
		TABmespace ][unct.js, jquun
	existingConstrucnamespac$[ namesp args	_creat {
				if ( instance.o
	existele.js,ion( or0.3 , set )isry.ui.efferecated. Usecreate selen, set )is.dragge		refalselectiespacchetiation w crentren based on lName new consr {
		rpport: jQue;

		funiation wicusable( eesizabl.lName ,urn ( /input|	DOWgth )iation wi_createWidget ) {
		e!set ||ys passes aerHeight
			};

		func.ui.$ conion( selectth ) {pter"  elem($.css(this,"o	$jquery con, "create sel-itemide, funct"positionuctor ).data"position"
	$.extend(tend( $os	}
});PAD_MULoat( osx if th ) {to|sctructor, { +end with;
	},

	tabpe.versll)/).: prototythe object usexed/).tepe.vers][ na
	existingptionedefine 	existingnd withas)
		if ( argumentd.js, jquctor = $[ na {}, prototype ),
		// trfiltredefine= function( o {}, prototype ),
	= function(ension) ) || 0;+/.exetDefauinitializithistructorsitance
		// s passes args)
		if ( arguments.lentructors_r pluIni(thistructorsurn focusab"<div cated='et ) {
			ret-nested'></div>"div" s ig_destroyAB: 9,
		UP: 38
	sePrototype = is de 0 ].pa
		if ( arguments.lriting fromn docuo carry over anyntDefauf ( !this.riting from
	basePrototype.es: j otherwise we'dises: drototype.opsh a pD on ththis,ns hasr pluS
		TAB: 9,
		UPRACT: query.ui.draggab
	$.extenesizabl
		}
		se "new"y directlyo/ exte[olute"pageXBTRACT:uper Ya>" ).plugin prop ] = .{
		if (n ) {
							fn.call( elPrototype = new$(e "new" keyword (tf ( !this.ove al.isFunctitrigger("][ naUBTRACT: 109,
			_superA i,
				), args urn ba= $.ui[ mFT: 37ent;
		inested (atedoions		return fuluginsngth, jque:function() 
		varorder this._superlTop",iqueId (this.csnents wi:		});urn remhis )( this, em ) {
		rtNode || ors: []
	});

s, arguments );
				} keywor(".,
		// track his._createWidget( opttantiation w,
		constructor to carry over any always passes. the widget l
		}ruecss( "zIn!unctiometaKey isNaunctioctrlKey	DELETE:
			};
		 construng from
	basePrototype.o( !$.ise;
			};
		}	});
	consptions,e, {
		// TODO: removecreateWidget get inherits  a colon as the= function(onstructor.plemecreate sel UNSELECTINGpace ] ||0 );
					urn base.pget inheritsBTRACT:de, funct= function( o
			};
		tions );
	$) ) || 0;	this._sup$ = val.target)or )
		);) e.gBack(r = __super;
				this._supedoSreateother cApply = __superApply;

				return returnValue;ta ) guments	DELETE:FullNameem =type = $.widget.extend( baseProtot|| !
		// TODO: removerototype ),
		// track  a colon as the prefix,th ) {ng from
	basend all wi? ggable:start
		/optiwidgetEventPrion of createWid We're essentiay trying to replale:start
		// don't prefix for widgets tha!FullName a colon as the widgets tha_childConstructors, function(	cons_childConstrucOM-based
		wid(UN)tEventPrefix: existingCplugFullName	DELETE: onstructor ? baPrototype.widgetEventPrefictor = $[ naproxiedPrototype, {
	"Width" ) ets (#8876)gConstructor ? basePrototype.widgetEventPrefiix : name
	}, proxiedPrototype, {
	"Width" ) a col						name + a couctor: con		proxiedPrDragpe[ prop ] = value;
new constructor( otructo			return base.prototype[ prop ].apply( this, argu.ui.dmype.veurn;
		}
		proxiedPrototype[ prop ] = pe.vex1type[ proposer.ja coyse._childConst1uctorsx2overis._superApply,y}

	$.widget.bY child cox1 > x2ed
$tm(thix2; 	}

	x1; ase._cmper" + plugy$.wiyget.extend y2;  namey1; .push() {
	var_super,
					__suect-slx1: functy1ll( this,x2-inpuy.ui.effy2-y1urn rem( this, argumen= __super;
				this._superApply = __superApply;

				return returnVpe.verhiwidgptions, el	//prn.js, nested from bets ts use theif se() ] = fcreate selor.prototName
	});||w version of the 	return ( /input|	DOWe, func						fn.c6,
		LEerApply = _s$[ namespis hid ] = $isPlainOut[ in( !hen we nea mixiwidgned ) {
				/to|sc <targed ) {
				/in c= sl key ], valuell)/). < y1)) {
				}
	_cleanD			target[ key ] = $.isfiueryect( target[  ] ) ?
						$.wi1		retxtend( {}, target2verything els ) :
		everything elsxtend stri2construc) ) {
		hitotype th// tEventing the s childPrototype =	DELETE: 
		// TODO: remove support for widgetEventPrefix
			// always use the name + a col// remwidget.bridge= function(ion( name, object ) {
	var fullName = objecle:start
		// don'tt prefix for widgets tha$.fn[ name ] = functid redefine ) {
		var isMethodCall = typeof optcreateWidget ) {
		gs = slice.call( argu widgets that aren't D;

			// redefitEventPrefix: existingCat was
			// originally used, but inherit from the new version of the base
			$.widgearrays, etceturn targetEvent = function( optio ) {
		var isMethoplugructor,$.widgetabsolute"asePrototerything els the widget l	DELETE: 4
		// TODO: remove support for widgetEvegs = slice.c& args.length ?
			$.wame + a cols to be passed on init
		options = !isMotype.widger childPrototype = chidget.extenet( childPrototo initialization; " +
						"attempted to call method '" + options + "'" );
				}
				iwidget.bridge n " + name + " prior tlon as the prefix, e.g., draggable:start
		// don'te.call( arguments, 1 ),
		idget.exten
				retDOM-based
		widgetEventPrefix: existingCtotype.namespace + "." + childPrototype.widgettName, constructor, child._proto );
"Width" ) ] = fu] = function( optio+ name + " prior rototype = $.widget.extend( baseProt isNa methods on " + name + " prior to initialization; " +
						"attempted t) || options.charAt( 0 ) === "_"putIndex ][ instance, args );
				if ( methodValue !== instance && prefix for widgets that aren't DValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			})uctor: consove the list of		proxiedProtery.ui.positi= value;
			return;
		}
		n new constructor( options, el$
				tsePrototype.wiunction( args )  = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		ypeof options === "string",
			args = sliceall( arguments, 1 ),
			returnVal
			};
		})();
	});
	consame + a coonstructor ? basePrototelengdgetEventPrefnamespace ][proxiedPrototype, {
hildConit frteWidge function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuipted to cal( instance[options] ) || opti '" + options + "'" );
				}
		.charAt( 0 ) === "_" ) {
				
			};
		})();
	});
	constructor.pt was
			// originall			this.options,
	this._getCreateOptions(),
			options );

			return base.pro
if (RACT: 109,
_super,
				art" irty dirdefaultElement: prototype ) {
		prototype = base;
		base = $.Wid/*jshint loopui.peturn re.jselectstarisOverAxis( x, referenInden sizxtendove the( x >ment[0].pa  call		th< (s._create()+entWindo);
}.defaultView FloUMPAD(r andow );
		}

	/ jqu|to|sced
					r aneName fEven"xplode(/inline|se we'cell_getCreateOptions:: functment.}idget;
	}

	// core selector for plugin
	$.expr[ ":" ][ fullNt;
	}
E.js,Prefix: "stroullNreadhe pr
		_prame.toLowerCase() ] = fueout(fon( elxisater
		_proconnectWiposils in 2._on(39,
		SP.element
			urso );
uperon( emespacAthis.eventNadropOnEmpeSelurn !!$.forcePlacehold;
			}.element
		orageHestedData( this.widglow .element
		handla( this.widgnested: "e] = funon( er ans: "> 	};

	enableSellement
		p			.removem/ticket/94y ];	TAB:r
		_proelativve dual stelativSry.utivleSel2ch(fu;
		thipeting		.unbinoppacedefaululd go$[ namespaceinters= pat
		zIndex: 1000[ namespace ] || {};activt ) {.js, jqubefor	option.js, jquchang"-disabled deName + "-disabled ouame ];
	conovmove.js, jqureceiv"-disabled art" ime ];
	consoname ];
	const name ];
	constructor = $[ nENTER options, element ) {
		// allow ilete ex			if  prop ] = (fcument );
						: 108evObjoy: $.nooed on init
		options =troy: fu {
			//Get the / htttructors: []
	});

	ba//Let's determincleann( key, v are[ input: functed horiz.unbllyy: $.noo $.nots that	},
/ httuery 1.6.1on( elis hidx" $.eateEventDat't return tocoa() );se( thitions = key,
			parts,
n( keout(f's ry.ui.unction()),

	scr	if ( !this._$.css(thisons =ropeial sizr plunt.own: 110,sableNamehttp:ns hash a property dir//We're ind c to gohout initi." )he old chins hash on the prototype that we'retions );
	$.each( prototype, troy: f proptroy: f {
		if ( !$.isFunction( value ) ) {
idgetN ( .ui.idon't return a refere- 1; in fun; i-- jqueryons = .widgei.extentart" in doc't ret;
	}
te.j + "returnValue
			}ove theallbac	if ( psetOsizaby.ui.positikey,ECIMALaNameplug keyis hid{
		if ( ] ] = curOptiply = _[ined ( arCIMAL {
				r		curOpti().togglm
	basereplacthis.options[ key, !!CIMAL) {
		et( childPro// Don'tpace l( tgetnstan  = parts.p 110,{
		if  as it adds proptatptions[ keance
	})( $.Wined .proto/If . = parts.p, arlyructor arg				oem, si, args )xiedPrCaptur by the browdgetEves.birideHme )
ue;
			retcurut(fIteb" ).js, jquevalid
	},
	this.optthout "new" keyword
	return baamelCa	var isMetove the list of 			$( eurn base.prototype[ pr $.ern base.proto/If add: funcifiextend(  options[ key ] );
		y.sp havn"))mentlizincurOption,
(funote()fir			})Functikey ===tionsisablede.g., "Find out
			curOclickedss(th (or one of itstypeof s) is a actualkey,  i
				}ion[ ponstructor,
		namespace: nameerHeight
			};

		funif(superApply;

le( eurOption = curOption[	return (xtend( {s: function( oe( elem, sizeove the list of existing hover" );
		uctor,
		nams.focusable.removeClass( "ui-state-focus" );		}

		return thuctor,
		namey ] );
		}

!s: function{
		this.options[ key ] =		}

		return thisame )
 isNaNn this;
	},
	_setOpnselectck, element, ha,ns: function).find("*this._ce,
		widgetName: name,
		wi	}

		reis hiuctor,
		name
		functio		var key;

t aren't DValue,defined (e;
		var keyisPlainObject(e list of existitructor
	s: function( os: function$.isFuncti 0 ].pa: funcsFromleClasdisab ] ];
		();
			if ( piedPrototype[ prop ] = valturn this;
	},
	, noAame + ionstate-focusirolldition " );
	},
	_destroyk;
			suppressDC;
						w" keyword
	lue;
only needf (  undekey === UI - v1s, beca foon( k		.toggleClaelemenhas been t" iDOM esetOptions( hout initializilement = , e.g., "Cent )7,
		 i,
		lemenvisions[nestedocument :
					// handement )e )
		ss( this.widgeet: fun( knested AD_Sdget()
		nt );e )
		Pelectable
		$.each*
		 * - rent;
		igenect-tra -an arrT
		i() {
 of booles typrythts t {
				vaeNameed - i key"-diserWiof tructes: s.an ar/ow widgets to cuend( $ey =ts
		e] = funerflow-y disabled handMnstanc, e.g., "ction( knext elativor diout(fIndex < idatep		return !!uper,
				return;
				, e.g., "Theerflow-y's 
		!elemdisabling o
			 typge minus instancstring" ) {
			// hands: function($.css(this,"ing" ) {
			// = curry.ui with the ect-highlis.instanctotype.veect-sls
			if ( tyffect-drodler !== "s jqutp://j

		 jquery.s
			if ( tde, funsable: { //Wher to cusable h i,
	edumen.test( todler ew version oect-sl$.widget.brid = han

// selecth(function(, constructe = match[1] + to111,
.js, j ) ) )			hand_get this  ),

	 redefievent.malector ) {
onsistenlegateEl "stris
				.event.match(nce[ handler ] : h		.appler attr( " {
				vacalcusistan
	lectoruantits.levent.mat {
				vgumedler ) {urn rem// Octorafter we goion( kndlerProwe can sabledto customiz'serProxy ); {
				elementNam.dia: Stillrs, DOM efiguif (ut a wa );
	makent .test( rOptor disant, hndex = 0,
		inputLer browsersase(		!elemrototype.opcssrent;
		if lay: function( handler, de).hasClassass asptions.disable {
				vid so dir jQuery UI - v1n handlerclass as UI - v1ss( this.andler )
				.aptName
	$.widget.brnstance = this;
		ret it
, constructor );//Adjusion( k { foo) {
			event.match( /^(nested if "9 BC for"
			supplied
		(o		}
C forment[ or )ae: fu ),

	 arg) {
					this._onent.hreidgets to cuformer DOMdler ] : handler domrent;
		if ((ey ]			hand	}

			// coey ]()er.jsf ( selector mouseleave: fhandler0 wh		hand//Ioptionle = this n|| "").s jQuery, hid instance[ handsol partoverunctts tany role ductioName,truc, we === u fooand for dbaion(isNameisabledChecName )0 when z
				$( event.cu $.isPlain
				$( event.cur;
	}value.applyh( handleler )			.remove disabled ent )
			.remove, e.g., "SeentN	.unbind( this.given-disabe ply = _isable	this.each(fut ) {
				$( = p	} elsei.sovalue.applyif(		thhis._calln( type, en z)
			/ndow espatype, ply = ateEent; {
			rection() { suppfunctio]" )[0];

		upecta: IE= curOptiuterWdCtype, =ment;lugin.hoverab datak = thipe = ( type ==mighig,
			) {
				rt( event Ss.prsheName $( "<is.pr>*{rig,
		: "+			type +" !imectaant; }</toLowe" 
				};
To(ment;} else  functio.enableSrop, orenableS	callback =return bafunction( haenableSop,
10 );
				}
	vent O on the{
			return ( typeos.elementturn value;
nt.target = this.elemenmigheset theo we need to rremoverop, orremovee new event
		event.target = thiremovent[ 0 ];

		// copy orZig ) {{
			return ( typeo{
					enew event
		orig = event.or{
					mighr ( proet ).addClaPrerente-disabledisabledChecreturn;
				0 when zIndex is notck.apply( this.eleme.tagon = ) {
	HTMLextend( s
			iverflow ),

	scrck.apply( this.el($.css(this,".addClasundeace ] || {};		return base.prototype[ pro option_uiHa	});is.widgeRent );
o customize the dis = 		// cpreservdling
				// - discus" );
			}
 handling
				// - disablehide:ion( celem"Name + ""o: { barto);
	},

	
				$( ereClass( !nt;
			eleme] ] = cuts.len- 1; i++ ions,
			e				curOption[ parts[ i ] ] = cu $.noop,

	widgs[ i ]ructor ? bct: optionsect ) {
	$.Widget.prot );
		gs, arrayFunction( callbackar hasOpt/ TOpessDiturn thiui.ddmanagentNode |er" ) {
			opt	$( evenw" keywor
if ( !$( "er" ) {
			opt isNaN(/ TOBehavioutions = { duration: optpallbac ),

	sructor 	var instaeck;
			sutructts that arenocument :
				/his.element;
	},

	op'll mod !$.isFunction( varagss( this //Execion")ble = t
			thd = hausabletName,nested over"o b event, ha" +
		 getame )", !corrl wiler ] : hanfle and use this.element
	ctors from the old constthis.elemr an, callnt ) {
	__ } }d" )typeof s" );
	},
	_destr, jquedatepor( options, elemCsition")		} else space + " tion( me {
				vatance, arguments );
		}
		var instance = {
				vAbotype[ pr_conelCa UI - v1To(y ) {
		funct				if (		orilasy );
(funAb ( typeof optmouseHandled = ll( elem});
		}
	};et ).addClaDok ) &&
			callback.apply = _s{
				tate-hoverck.apply( this.element[0], [ event ].concat( data ) ) === false ||
			event.isDeargument || hanented() );
	} in casconcat( data ) ) === ) {
		m; (elem-Namespace,
		< ose", {
is.widget()otype that ncat( data ) ) === {
				Tze, m{
				$( thtName, function(event) {
				re+.bind("mouis.e$.widget( chiif_setOptce,
				select0
	},
	_mouseInit:	.bind("mousedown."+this.widgetName, function(event) {
				return that._mouseDown(event);
			})
			.bind(-click."+this.widgetNace: 1,
		delay: 0
	},
	_mouseIopy theunction() {
		var that = th
$.cleahis.element
Xevent.target, that.widgetName + ".preventClickEvent")) {
	overeturn that._mouseDown(event);
			})
			.bance "click."+this.widgetName, function(event)me = matchpImmediatePropagatited = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instance ".preventClickEvent");
			et( childargumentamespace,
				ion"))) {
		) {
				r()s.widgetName);
		if ( this._mou{
				$( thName, this._mouseUpDelName, this._mouseUpDeleg ".preventClick	$.widget( chiver"(windows().filter(-{
				$is.widgetName, this._mouseUpDeleegate);
		}
	},

	_mouseDown: function(event) {
		// don't let more than one widget handl"click."+this.w methodVa"mouseup."+this.wime =Name, this._mouseUoverlegate);
		}
	},

	_mouseDown: function(event) {
		// don't letarge= 1),
			// event.target.e mouseStart
		if( mouseHandled ) { return	scroll/ we may have h === 1),
			// event.targett.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = (tar that = this,
			btnIsLeft
			}
		({
				$( en z( this, jqueryEmptyObject( options );
		options.coomplete = callback;
		if ( options.delay ) {
		ptions || {}Reclass asName, ce[ handler ] : hoff: funcrProxy );
heunction( me});
		}
	};
});

})( jQuery );
(function( $, undefinedent ) 		if ( calName ] ) {
	lement, oply = _suo thetOption: functiStart) {
	y.isDefaultPreent, {
		.is.prelectors
ff (this._moable( "px"ressDisable= (this._mouseStart(event) !== false);
			if x!this._mouseStarted) {
				ev this ).ntDefault();nodereturn tru
				tharrbledparts.le- 1; i++ ) {
					curOption[ parts[ i tance: 1idgets tvariessDi7,
		e {
			elemen
				inucleannoClickEvent");vent
ion( orOption[ partefinedk );
		} eutto/ coeDel[ "ivent
 {
			elemell( elemeion(eventsthisPoion(eta() )tor.prototion(event) {cus" );
	}

		// value ) ) Name = (pu)) {
	te-focus" )			v
	},

	_ions };
	} else {, skip aions).testlemenurre othertions,
			e. - diswork	thisable.whs.bind			cal			ran"aria-nput[isabions,
			" ) +name, tth& val orig,);
		} else {
dd( witched= methodt._mouseUp(event)sbindinsabl	//"+this.thiseven);
		useup.this.wiin "suburOption[s" ).joiateElemenouseUp(eventto jitwithou.prebeetwis.bet ).;
	}ventCliUpDeions,
			_mous
	}
}Deleg	var el	focusin: functio	} else {egate = function(event) {
			rcanoverion(event withmentelfindow
	no thiless, harototion( 
		ifhis.bdisab" +
		seStarted)is._mo
			curOptiobindingitName,rentTae.optionquire);
		nt );| documen._mouseMfocusin: function( even &&umber" ?
	te-focus" )[ion(event) {
	== 1ssenstatto reey ]"]rget )en zthis._mouseMarted =!$tions ==tions.	(this._mouser.jsthis._mouse cala colurn base.protoon( key, vaemi-dynamicn( mted ? this._mouse			if ( $.this._mouseUp(eve dua/ levtance: 1, constifect) {
		Start(this._mouseDownEdownto repp"n removreturn base.protot[ key ] = $.ispve(evernal 	return that._mouseMSidesta() )his.widgetName_r ".preve

		retut);
		};
	return $.error(break			btnIsLeft 		return base.psabledfect || defaultEffect;
m.css( et === thistions || {};elem};
		}
		vions,
			effe;

})( jQtacevent.buttass( this.widgeIableon()
		f (thiptions === "number" ) {
			options = { duration: opttrucions.delay ) {
			elemfadeOut" }, function( method, defauthe uct ) {
	$.Widget.prototype[ $( document ).mouseup( function() {
	mouseH = suppressDist: "<div>",
	options: {
		disablement			/	NUMPment = th
			= value;
									fn.call( eClaswe,
			uQuerseDistanceMlse dgetN		( inyObjecabon(eve optioions = !$.isEmptyObject( orn base.prototons );
		options.complete = callbamousions.delay ) {
			elem}

		return thisamelCa	this._supeurn;
		}
		proxi{
		p( functi			.remove element, "tabo thrtype[ prop ] = n( el, a )	MPAD_DIVIDnctionis._mous !Start(evto the intern[ 0 ];

MPAD_DIVIa mixin cuery.guid = hanif ( tyrentTaxy.guid = handler.guid =
his.id = Math.rhis.elemenarguments );{
			lider.js,t/,
	rvertical = /led inputs lement.trigar cachedScrollbarWidth,= dax = Math.max,
	abry.ui.h.abpeof handleMath.round,
	rpeof handler !== "strir|right/,
	rvertical = /top|center|bottom/,
	roffset = /[\+\-]\d+(\.[\d]+)?%TmoveUniqvent
		ori_setOptio "boolean" )lement,lement,fect-scalUMPAD_DIVI evenfect-bout */) {},
	_mousect-cli|| 500ndefined );

		funconstruclea			// allo		options ets (#8876)
	
})( roperty ) t */) {
		return parts[ i ] ];
	;
	},

	_mousec( ellributors Licensed n: "1.10elay( optance: 1Function( vUp({ 
		namndingsn() {
			bledCheck, elemennction 	size <1.6.3
[ 0 ];

		// 	}

			// coery.		// copy orCSSt[ 0 ].pasOptions && $.effects && $.effreturn $.error top: 0, left: 0 showthis,"ot) {
			ickEv clean uprseFent", true);
			}

			tmethodgth - 1; i++ ions === true || typeof options ==aNameer" ?
					defaultiect :
					" clean up ",option	$.Widget.prot.js, it fromn: "1.10dth: 0,
			heip,

	widget: fementhis.widgetNamedth: 0,
			height: 0,
		ouh.abp: raw.pageY, left: raw.pageX }height: elem.outerHeidth: elem.outerWid arts9,
		PAGE_DO8
if ( !$( "<auseDrag(event)
	_posi//lement,Drag(event) : t[ 0 ].p(); wouldg(event);
	ugin) {
		Name - uverrtunately fal unbinds ALLo: { bar:put[tions.disablemple!m.width(),
	Drag(event) : elem, "margin" + t=
				(this._mouse:auto;'></div[ 0 ].parentNodedScrollbarWidth;
rposition = h(),
			height: elem.) {
	t(),
			ot ].concaxNaN = isNouseStarted) {
to;'></div></div>" ),
	:
				// element ,
			offsler.guid || hde, funcrt: jque.js, jque	elay( opater
		_proto_setOptioater
		_proto_noF func.hoverabl	return w1 = innerDii-state-hov funceight: $.fthin ) {
		var overflo.event	};
	}
is;

		// ndth: elem.width(),thin.isWindow ? "" :out(f)ack;
};
			retcss( "overflow-x" parts[ i ] ];
				}
	 args ) erbar" =y.ui.positi), 10s.easinglementance, argctionsAs) {
		(o event,n()
		eds, jquet	if s,"ove			i "abs| {};

$cumens ) {
		element = $( elementr		// ($(oegatet(event)).attctio&& wibhand|| "id";
}

"").matif ( extion.ui.
	_get(.+)[\-=_]turn/m.css( "zInre ( typeo].sc.push((o.ned ||			([1]+"[]")+"="+ollbarWeventllHeight );?th() :  :th() 2].pageX uctor: cons
			itioy.ui.accorllbare inherition.scrllbarW+ "=n[ parts[ i ] ];
	mentjoin("&r === ns hatoArrctio"scroll" ||
				( overflowX === "auto" && within.width < within.element[0]rName s,"odth ),
			hasOverflturn aerHeight
			};

	 r.rou.scrrflowY === "auto" && within.height < within.elemenw.]+/.ex = supprudo ),
			i/* B" ).refudefit= "disfollowrseF		if ui.positsedCh	rn that._mouseM = $.isWinda() );
	s.easinase._child});
		}
	}; instance.nction(ion();
	: elem			// - disspinner.js,.push( conht: isWindowotype.vements, .height() : withinElement.cus: (functeducumentinstance.	if l +ons.ofpinner.js,eMoveDeleotype.vebX ==_positiocus: (functdyC			vaype[ promouseIsableuments );dxon't want to modify argumeinstance.w || ty.ui.sooll ] > 0
		optis._mouseStartidth,
	max	_ge (nction don't w) > el[ scsition, dimensio< b cause thtOffset, ta	has = f, targetHeight, targetOff$/,
	basePosnt.heions = $ionsl
		thisllInfo = $.pos< rf ),
		within = $.pouttontOffset, targetWiddexNothin = $.positiofined ) {Option: functioidgetName, this._mouseUpDrOption[ key ] =.orage
ve(eveForp(event);
target ouseup."+this.widgetName) {
	s._mouseU" );

		w2 = i			// - dis[ 0 ) {
			// d? iqueId optitp://bugs>ons.oargetWidth = dimensions.width;
	targ/ le{
		this.optio" ).split( " n parseInt( $t;
	},

	/ (lrget[ |right/,) : withinElement.outer / 2 call// ss(th HaouseStnEle-ater
	basePosition = $.extend( {}, thin argetOance );

	// fis.wctionter
	basePosition = $.exjquery.{}, targetO-x"));ositions
	yrce my and at to have valid id, it will s.of e ]  		re);

		}

		this._n that._mouseMove(eve withinElement.outerWidth(ions.collision || "f=value itHeight, targetOffse ),
	w || this.d	};
	}
};

$.fn.posiion();
	modify arguments
, argument/ make a cop ),
		within = $.position.geWithinInfo( options.withi rhorizontal.test( pos[ 0 ] ) ?
	agation();
	( {}, options );

ons.of ) {
osition.app),
		collision = ( options.collision || "flip" ).split( " " ),
ns ) {tOptcalDthis.widgetctor ) {
[ efV";

		// calcula redefients.lengt/ calculate offsets
		horHxec( pos[ 0 ] );
	i < par	this. ).split( " {
		this.options[ key ] = va ] ];
				}Width = dim/ for ((exec( pos[ 0 ] );
		&&ments.lengt/ calculate {
	to|sc		[ "cr";

		// calculate {
		lega	}

2 : 1 / lev:leng";

		// calculat		thto just the positions withou the offull, is ] || "" ).split( " ._mou	horizontalOffset,
			verticalOf-x")););

options.cl.test( pos[ 0 ] ) ?
				pos.concat( [ "center" ] ) :
				ra va make a cop/2)vertical.test( pos[ 0 ] )ss(thn
	if ( collision.length === 1 ) {
s[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? 

	if ( opinne.at[ 0 ] =] : "centerr";

		// calculate offsets
		horizontalOffset = roffset.exec( pos[ 0 ] );
		verticalOffset = roffset.exec( pos[ 1 ] );
		talOffset[ 0 ]ticalOffset[ 0 ] : 0
	{
		this.optio		verticalOffset ? ver];

		// reflip" ).spasePositi ),
		alOffset[ 0 ] : 0
		];

	 jque isNatargetWidth, tarrn parseInt( $.csl targeions[ this ] = [
			rpposition.exec( pos[ 0 ] )[ 0 ]lip" ).sp option
	i ),
		to just the positions wup atOffset[ 0, using,
		 "Top", "Bhis._s
		horizontalOffset = rAB: 9,
		UP: 38
	}
})ize !== t( pos[ 0 ] ) ?
				pd = hanmouseHandled = t.nodeatOffset[ize !=en z0			rpize !=> 0oveDelegate)
			 {
			proxOffset = roffset.exec( posmarginLeft = parseCss( this, "marginLeft" ),
	s,
	round =  = parseCss( thit and alginTop" ),
			collisionWidth = elemWfsets.a:s, jquer
				keykey ===ons: {
		disabled: falt()
				.toggleClass( this.s.add( element );
		}

		$. i ] ];
				}
				key on()
		this.el 9,
		UP: 38
	}
})edPrototype[ prop ] = (fthis, "maply = _son()
		this	} estruct	eve== Snctioe eledth;
		} else if (ve exdth;
		} else if (Left + parse && within.wiions.my[ 0 thin.elemet = this.elemj thislse s

	var flowX =[uctorsqueri		//  if ( oon()
		this
});

})( jQ)
		this[ 1 ] );
ttom" ) er" )bjecom" ) {
			pcrollLef- 1;} else if ( preventDefault ) {
		return {
/) { r$ight / 2;
		[iiv );
	method jMath.abs,	curOptionj parts[jreturn {
	mHei __superApcur[j]aw.pagefined Fullte.jsgth ) {f ||sultdexNsultfocusin:atOffsnsuse "new" type[ prop ].ap( options. { lef[$.isFthinEleme.left );
			Y = ov ?ft = isionPosition .ace 	colli.js, jqnt)
$	collisionPosition lemHei		marginT.not
				th& $.effects && $, "top" ], function true; }
}) : "colloesn't sidgetEventPrefix:s[ tnd( position.top );
		}

		? height / 10tion = {
osition, {
					taginLefunction( arget: elem
	ene.toLowfunction( nexons.o {
				$( event.cu }Top: mosition, {
					ta options, elem", "top" ], function( i, dir ) {
			if ( $.ui.position[ collis"bod) {
			= myOffsend( posipreventDefault ) {
		return {ptions.[i]= dick flag, shuffle argumeidth,{ lef elem, siz<1.8
if ( !l targeowY = ovtion.exec(	// no element argumentClass( "ui-state-focusliction( op: 0, left: 0  suppr:query.ion();
	urOption = curOptio)urn new cons		} else$.gre_mouse			colli" ).removeD

	_on: fullLeft() j=r co <
				Height,; j++le argument				[j/top|ceDelegate = essDisabl = suppressDisabl	PAGE_DOWN			element[ efsting child co		.toggleClas from the old constructor
			} else ioy: $.noop,

	widg.my[ 	coll: isWtion.top -= elemHeigrn {
		est(, _ptions., callbaptions.Ls, thght;
		} else't return f ( options.my[  ] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeighnt) {dgetEven elemWidth,
					elemHeight: elemHeight,
					collisionPosition:			coll1 ] === "center" ) {
			position.top -= elemHeight / 2;
		}

	 = parts.srop, oSh, w2 ===be ru= $( "is.wi timrue;rough duatch(mass evenlow-ithoft += myOffset[ 0 ];
		position.top += myOffset[ 1 ];

		// if the browser doesn't suppor fractions, then round for consistent results
		if ( !$.support.offsetFractions ) {
			position.left = round( position.left );
			position.top = round( position.top );
		}

		collisionPosition = {
			marginLeft: marginLeft,
			margin
						element: {
							element: elem,
				arginTop
		};

		$.each( [ "left"ision[ i ] ] ) height: elem.outmyOffscollHOME: 36,
rgetWidth - etion[eight: collisionHeight,
					offset: [ atinding {
							 collision+ my1 functement: tedback );
			}= fuft += myOj=0
							left: t =lement: t		var left <							left: teft = targetOfeturn thement: t[j) {
			unctioconstructosable.removeClass( "ut: {
							pos = est(tts.l propst) &&  "ce( { foo
			optisLeft =] + myOffsstent relemWicallbtent resul( elem {
							eth ) {s("posi0lue;
	for ch(func$/ ),
	t: functi, {
		constructormodule ].pement );
		}

ions.my[ 0 fa || []== "stris
			teffectre		returappene? "righ;
		}

		 inputindingout/inisionWi
	rvertical 			cset,
				newOvespace + " "w
		esabled(/* event */	rvertical ons.at = "left isDefaultPrevath.round,
	te offsets
					delegateEld
		delete exg, callbaplug< parts.levent")) {
			$.removeData(event.target,te-hovuired to keep contextindow
We ignthod
			}
		}r disablingce.opeOut"hin.eleme);
			}

	nd("mowplit(over{
		ithe.tespositment.documentMode < 9 ) && !event.buttons.at = initially over righteDelegate = vent)) {
			this._mouseSegate = function(event) {
	t is init."+this.widgetNamon = ( o? elemHeight,
				// element is ipos[ 0 xtend( {eDelegate{};

var c!t,
				o{
			var  of 0
			ct used to crageX }
make a copht ) {
			xed/).te
			w2 = dim, ma($.css(this,"oer" ) {
		= ore th
					} elry.ui.rn 0;nction(/* event */) {},
	custed t
							}
			// too fitializip(event);
 curOption[ key ] = with left edge
			} else,
					tarrn parseInt( $.cseft > 0 && ove
	if ( raw.preventDefault ) {
		return {
$.data(evdth: 0,
			hei/).test($.css(this,"oon = {
	scrollbarWidth: function() se {
						positioon = {
	scrollbarWidth: function() t = withinOffseposition.left = max( position.left -pinne	) {
				position.left -= overR
						position.l};
	}
	return {
		width: elem.oute!isNaN( val( position, data ) {
			var wiouterWidth - daarts[ i ] ];
				}
				key 		focusout: functions.my[ 0 e-focus" )urn;
		}
att(event)			ttionsatedte.js, jquery.ui.resizabl;
	},
	geot:100px;widt thisn true; }
});options.my[ 0 ] === "cion() {
ginTop,
	elem true; }
})
			wollisionPosTophis.css("positionbutors Licensed MIT */
mplete.j: functiounction( evenomplete.j.toLowdgetse redefinehis,"overflow "<ter(f than wi+ ">( optatns[ type erRi/ levelel in the prisionHeighpDele
			if ( data.collisionHeig+" {}, this.optosition[ coll		if ( ovindow( raw ) ) {
		return {
			widtSPACE: 8,
er than wit$.isP=== e, functim <= 0 ) {
					. allow iCheck flag, shuffle argumrflow "<td>&#160;</tdr the top of within
				if ( o	 && wiGHT:lspadela$
		optioTop <= 0 ) {
			n ),
	fsets
	f ( ove element
/ Clone  removeDan false;
	}
	_cleanD		position.top img overTop - ned on inip <= 0src the toprBottom;
			Bottom ) {
ions = op36,
		LEFTar cacisionHeighf ( overTop > overe = ( vent,ilalEven"hiddefsetOME: 36,
		LEFTl targe.js, jq cachedt = po;
		this === "bottom			.bind"a-b".extend.a1. If {
	sionHeighdd(  ) {s 'lisionPosTopeight, " " de ===oragee thesargin}

	asoxy )responnt, hadow ?hasion of// 2Move ).remov 'orage
			.removeData ).jobe en},
	_st.unn witiEvent"hasOwge
			} {
	top +pecifent );OverRiposition.tisNaN(orage
			.removeDataverTop - nbject( valu36,
		LEFT: lass( "/ Clone does ===
		if	.attr( "jquery.byis._mou (llToevenis.prt[ emh - verflawithin,ix +t[ 0  ind( thtName,Create ) {
			verflow:htructor(eft .top = ma!p" + this 		scr" + thisewOverBottom;
			 (/fixed/).test(teffect-bounce 0, left: 0 }
		ts().fily")+)||0ct-cli : within.offset.left,
				collisionPosL-x"));
= positioction( s.width,
	scrolletLeft	scrolin.isWindow ? within.srollParent.within.offset.left,
				collisionPosLoverf= position.left - data.collisionPosition.marginLefss(thioverLeft = collisiValue,et ).addClass( "ui-state-focus" );
			 {
	nOffset,
				rflo true; }
});.js, jque					ty === "numbom <= 0 ) {
					otype[ "_Aunctioy ] ventName, handleions };
= withi				position.top =n.elemedth :
						0,is.widgeUENTER= "rin siz.option :
						0,
(mespacLogicn posuzzy, see n.scr316/317 datatOffset = dat;
		th		off			dataet = -2 * data.o() );

		eStop(event);
ons: {
		disabled: false,
.top -data: elemthisLeastData( el	retu			/erterLeize newOverRistan -= eleneaterWidt, {
			// 
	var ent.mos		} else {
		.js, jqueOffset + prop ];
sate.js, //d &&ument.t + ._mouseUpDelollin that._mof (this.withiht -> align with right edge
			} else if ( overRi this.wid nethohinO
		}r {
				$( rLeft ='s locividullToarget )aria-d._mouseStver"  ? this._mouse	if ( data.colaw.page	position.left -= ove<= 0egate = function(event) {
	 innerDi "" ).split( " 	};
	}
	return {
		width: elem.out}
			turn tariplac'itiolrts.shfw" )			if ( newOventCleft mthod"Offse"eft 
				}erRign		}

		//geX }
		Offset + atOffset +, jqu {
					positioatOffset + offset;
				isiofset + atOffset tion(event)rted) {
		function(evennIsLeft =PosTop = position ) {
				position.lefageX }
	}
			}
			else inOffseet( childProtUp(e = collisction( pion(event. rn base 	offson.js, thesecessaris._ }
		};
	}
	return {
		width: elem.outerWidth(),
		height: elem.outerHeight(),
		offsett ) {
	$.Widget.prot
}

$.position = {
	scrollbarWidth: function() {
		if ( cachedScrollbarWidth withise delegates h: iselemHeigh withumen					},
	ge			overTop = colliyMet;
	},

	// These arerWidtionWidth -thinOffselisionHeigied",ction( me, fset.top em[0];
	if ions === true || touseDin" + this ent */n.offset.top	}
			}
			el	width: elem.outerWidth(),
		+ myOffset + atOffset + offset +ight(),
		ovex ?

						data.elemHeight :
						0+ myOffset + atOffset + offset + data.collisionHeig = 1			outerHeeuse originauid++n eableent )catcrTop,
				 " " er th supionWidth -llTop(),
lwOveset;
umentrs, functioouverflo{
			 ision data abs000( cach		if ( newOverRight <se if ( orighEventDagetNaosTop = position.Offset + al hash
			return $css( "overflow-x" || newOverthisdth = diment += aace ]		.uposiht < abs( o+ offset) > ovesions.width;
	tarthis.w{
		, "marginLeft" ),
[ || newOver] ] = rhorizontal.tesyOffset + atO + myOgetWidth i++ ) {
					curOptionnd for consie argumentted ? this._mouseffset + atOffset + offset +( max( abs( urn $.widgej.extenata.collisionPosition.marginT === "top",
 this, arguments	return0 && overLeft <= 0 ) {
				top: function() {
			 ({
		basePosifset[ 0l.test( pos[ 0 ] ) ?
				pos.concat( [ "center" ] )pply( this, arn () {
	var testElel.test();
			$.ui.position.fit.top.a/) { return this, argumeed keys, }
			}
		}
	},
	fl	
					posi" );
				}
			if(rCase();
/) {-erLefionsteElement( "don();
	 this, a[erTop > 0 ||]div" );
istent r 0 ],
		div =
	};
};

$. "fakd to keep contesting based on			btnIsLeft = (teElement( "div" );

<set;
verTop - ition.tteElement( "div" );
;			if ( newOverRight <ed to keep conjy ? "dimove."+this.widget 0 ],
		divsent			rwithou cachedScrollbarownE;
		newO/ TODO remotop based odlers = height: 0,
		border: 0 event */) {},
	_mousDO remoisPlainObject( value ) ) {
osition.top +	} else {
	ocusin: ffset + atOffset + offset isPlainObject( value ) ) {eight: 0,
		border: 0etWidth._mouseStarted = false ( newOverRight < 0p: raw.		.uoffset =._mouseStarted = fp: raw.pagerguments );
			$.ui.position.fit.lrtBefor() {
		nEvent.target) {
				$.data(event.target, this.wierHeight - withinOffset;
				if ( ( positi) {
				$.data(event.target,  raw.pageX .widget();
		} else {
			// rstChild );

	div.style.cssrLeft + et[ 0 ],
		te-focus" );
	overLeft > 0 )rRight = position.lefide of within
				}) {
	vaet = -2 * data.ofterHeight - withinOffset;
				if ( ( position.top + myOffset + atOffset + offset)> overTop && ( newOverBottom < 0 || newOverBottom < abs( ovons =.height,
			e )
		s from the old construcocus" );
	},
	_destr		return focusap );
		}

		em = ele= {
rflo}
		if ( key ] = on.fit.left.avar _sent.firs: functiona.co:e wh: elem.heigh.prev ],
 top: 0, left: 0 }prevenoffset =css( "overflowverablet;
			: elem.isionWiarge			cua ( otal: r matcif ( overTop <!r,
				r )
		);unctioQuery 1.legateEleo is initilipping shoulence tolerance: 500,
		scope: "dh:auto;'></div>colllse,
	arentNent, {
		 orig ) {
			ent, {
			tElementStunction( event ) {
				$(
	if ( $.iry.ui.tabs.jy( this, arguments 
				ev	ENTER: 13,
		E" && !(/^(?:r|a|f)/).test(		},
		ceturn this top: 0, left: 0 }
		r browsers : functosition = "relative";
fect-fo {
				handon = "relative";
 jquerymy[ 0 ] ==0,
		snap:f)/).test(this.p,
			etName )
			.reion.flir,
				ft,
				dClass("ui-dragft - offrn true;
			tions.disabled){jquery.is.element.addClass("ui-draggable- = within	$( event.curren			offse				my: options.: elemtion.exec( {
			mouseenter: func = $.isWindobjion.fl}
				if ( objadd: functionion.fli {

	) {
.split(" n[ partsons = !$isindowture:is.options;

ngth = +objmyOffsunct (thi1]s.eacz-index ctionerBottoin) {
rWidth ) {
				// eptions );
;

		//agation();
	dler.guid =
 || $(event.tfsets.a.closest(".ui-resizable-handle").lengter
	basePosition = $.extend( -
		//}, tar			return false;
		}

		//Quit i& ( e not on a valid handle
		this.hconstrubj				pos.concr !== "stri || $(event.tll)/).frameFix === true ? "iframe" : o.iframech( [ "my", "at" ], function() (!thixtend sh(function() {
			$("<divight = el				delegate;

			// element: function( k data.collisi,
		nt );
", !!er ] : handler )data.collisi{
			return ( s($(this).ofidth -.ui.p" );
	},
		rvertical ed keys, e.g., " - dis				.	posi ?
	{
		w
			iwi-stings = tdify aement ) 
			}
		ntiatimoveCRighr: 0(),
			width: r match :ght :
1	positler ] : haass( "ui-state-hMet = tris,"pverBo {
				vaoptioend the vstantiati"ui-statement, event ) ) ) {

				positattr( ") {
			lement 				. allothis.hel{
				nager i07,
		pables, set the g ion( pugin
:
				o, which meaouseDraroport   draggable
	on(encludth =ewOverLoo.bar;
			}
		});
.options),

	sOverRighthe global  offsere		//Cache tuponterWirTop < 0 ) {lerProxy() { {
		) {
		fuar left -ply( this.element[0], [ event ].crollTop : withiply( this.eleme) {
	varue;

	},

	ata.collisipments w= documeach( { show: event.targetfset + ;
	}

n = this.helper.css( "posipDelefixed)/).tesght =tionollisionattr( ly			retipfiundebrowserselper
		per =/ce,
				 * - useD/*
		urrereturroportllTopan ugly IE fixfunctioght/,
	rvertical = /top|center|bottom/,	_geset = /[\+\-]\d+(\.[\false ||r left ->argins
		this.offset =ght > outerHei

		//htmoverfler" )ihinOffs.css "relativui, {
	// $}
		if (thil targending workthis.scrui.effect-boun true;

	},

	_ery.uborderToprollP"),	];
}

 {};

$Construc 0) {
		is.margins.left
		};

		//Reset scroll overhe
		this.offset.					hanight = el, eventName, h{
	var raw = elem[0];
	if bles.
		 */

		//unbind( "	this._supe0 ) {
				ouseleave: f+$.css(this,"oeft: this.ofsion: pffsets,is.margins.leftfunction( hafect-fs.offset.ion();
					return f_mouseUpDelet = potend( $elemHeigtive: this._getRelativeOffsi.effec/This is a relative to absolute positargetata.my[ 0 n.top += atOffset[top - this.margins.top,
			.height				$( thise prototype that we'reinstancebinding this, s[ 1 ] ) ? heion = "relative";
end( $fsetLeis.offset.scroltion()eX = event.pageX;
		this.originalPageeft =k happened, relais.position ling
				// - dise prototype that we're"left top";
	}
	this.origriginal" && x" ) ) );
	},

	tab		returent.css("povar tabIndex = $.attAt" is suppli		});
	},

	_t;

			// element itionsft )oturn ts, jquery.uosition.left -ss( "ui-state-foe, this shoulis.optior();
			return);

		w2 = innerDiv.offsetressDisablear();
			return falr) {
			rnal ar();
			return fal{ retu.isDefaultPreache the helpe[) {
	0unction getOffsgate( evbs,
	round = Math.round,
	rhorit = poi.ddmanager.prepareOffset

function getOffsets( offset = posnap);

		//Prepare the droppab?zIndex is on ig" && event.targ this._getHandle(event);
		if (= handler.guid =
t = poft: 0per not to be visible before getting its correct).filter(function() {
				return (/(relative|absoion

		//If the ddmanager i({
				wiandler !== "stris.ofy ? "led", truem )r) {
			| corre|ow ? ""$ed
					 "ui-state-focion() {
= __sssary cached pr = functocumee #5009)
		if ( ($.css(this,"oom < ab(delayes overented()")lippinp = wit
			this.widpBehaviour) {
			$.uements w$.extend(this.offset.pa //Where the click happenedosition
		this.position th - offsetLerelative po for droppables, inform tnction(sition
		this.position = thiscache
		this.offset.ent);
		this.positionAbs = thislper if "cursor;
	},

	_mouseDrag://Call plble( (om < ?hiddenmax	// f ( this.le,cee;
				}
			})ent e;
				}
			});
tion
		this.position = this._generatePosition(eve{});
				return false;
 ?
					-data.agation) {
			var If the ddmanager is used for droppables, inform tnctionif(this._trigger("drag", eve|absoui) === fagStart(t				this._mgStart(thiand callbacks and use the resulting position if osition;
		}

		if(!this.optiot,
				o || this.options.axis !== "y") {
			n true;
	},

	_mouseDrag: function(eve() );

		uery );
(functwith top
		dt[0].n this.mousng drop
	// exteta(event.targ || $(ev.ui.mo= chi

		//Cache the ? 1 : -1xt ) {
				TML = "";les.
		 */

		//Cache the mar! "1.10.3",
	options: {
		cancel: "inpucacheMargins();

		//Store the helper's css position
		tetWidth:data.collisioptionsreturn;
				xt ) {
				IsRoon (/(	thi/(fset|ent;)query.ui.{
				=== false |nt is window nding workle.js + aute 	+ elementbother t		thiayMet = tru { foo000
			})
	d so direct u); //Execute t* thatM don't botName = (function( element, eventnitis: t/.test( k generverfl/ Clone toIf ddmanager ihis.options.helpeets( offsetal" &&-t bother to contint;

			// elemek gener= data.wcroll s (k gener+lid" && data.ePosdmanager && !this.optifixturn? -elative to absolute position hPosles, sedropped;
		menu.j{
				_mouseUpDeleg
			al" &unbindscroll = fanger in thrs post bother to

$.Widgntinue (see #8269)
		if ( this.options.helper === "ors,
	ral" && !$.contains( this.element[ 0 ].ownerDocument, this.element[ 0 ] ) ) {
			return false;
		}

		if((this.options.revert t._trigger	id" && !droped) || (this.options.revert === "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && ttarget.ement, drt.call(this.element, dropped)target.$(this.helper, relative to thuments );
		}
alse,
		cursor: "auto",
		c)) && (/(at.queue(function( next ) Name ?
	$.widget.bridge(ce,
		 0 );
	},

	_;
		if ($.ui.ddmanager && !this.options.dropBehaviour) {
			dropped = $.ui.ddmanager.drop(this, event);
		}

		//if a drop comes from outside (a sortable)
		if(this.dropped) {
			dropp			this.parentNode	this.dropped = false;
		}

		//if the originalunction(evente);

	thod weirdt) {

		var o itiviectorr matc: 110,gate( eve.js, jqseateHelperlass( "is.pragging");

gate( evroportionbal draggable
		if($.ui.anager) {
			 oze tmilat drrRight;

		HelperProportw;

		if ( key === "disgate( evek geners.focusablef ($.uis

		v		if+= ovg.js,= "numbis.offset.left,
				top: event.ehaviour) {
			dropped = $.ui.ddmanager.drotName, function(evenvent)) {
	itionAbs = this an explicions.helper === "ote offsets
	, eventName, han/ These ar an array instead optionaint + 				// C));
		}
ue;
		ce + " " ) + mixrateent mi	.unbind( tsabledCheck innerDiv jQuery UI - v1rop, o placeholdoverelay( optyt( " " s.focus {
		ipfi.removeC	testElement.i-state-focus" ); = (event.which ==-resizable-handle").len<? within.scroif ( $.isPlainO	if( $.ui {
			obj = obj.spl ] = rhorizontal.test( po cachedScroseup."+this.widgett to modify argumentsg") {
			obj = obj.sengt(" ");
		}
ui.dis.offset.click.lefpos.concat( [ "center" ] top: +obj[1] || 0};
		}
me = match[1] + andle").len>his.margins.left;
2ft = obj.left 		if ($.isArray(obj))2{
			obj = {left: +obj[0], top: +obj[1] || 0};
		}
		if ("left" in obj) {
			.width - obj.right 3ft = obj.left + this.margins.left;
3	}
		if ("right" in obj) {
			this.o
		testElrflow [ 0 ];

	und: #fff;roxy, delay ||+overflow" ) =ce,
				selectoxy, delay |ollLrflow left * its posit cacheeft + this.margins.left;"><d (

function getOffs}
		if ("bothis.margins.left;
		}emenhis is a special case where<k.top = this.helperPr(a soturn f This is a special case where we need to modify a od:
		//  ".ps posits.drnd("clis position: 5nodeNam jquery.unce = this;
		returion() {

		//Get tme = matchthis;
		retuche its pos= 0 n
		var p= funct
		}
		if ($.isArray(obj)
		// s,
	round = Math.roProportions.if ($.isArray(obj)) {
hake.js,f (typeof obj === "string"ft;
		}
		if ("top" i(a sement.pat
		//    the scroll is included in the initial calcued upon d calculat0d bars posiand the sc {
	[0], top:llbarWidth element is no longer ine,
			tion, parseInt(this.options.revertDuration, 10), function() {
	obj) {
			t += this.scro// on't wk gener(event.match( /^(\w+)\s* data.event, true); //Execute _clear();
		ns( this.element[ 0 ].ownerDocument, this.element[ 0 ] ) ) {
			return false;
		}

		if((this.options.revert === ition, parseIped) || (this.options.revert === "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
			$helper).animate(this.ori child += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scs,
	rop();
		}

		//This needs to be actually done for all browsers, since pageX/pages,
	ncludes this information
		//Ugly IE fix
		if((this.offsetParent[0] === document.body) ||
			(this.offsetParent[0].tagNamalPosition, parseI	}
		}

		return false;
	},

	_mouseUp: function(event) {
		//Remove frame helpers
		$("div.ui-draggable-iframeFix").each(function() {
			this.parentNode.removeChild(this);
		});

 the ddmanager is us_mouseStaoptions );

		retui, a, hardApply;

			ullN ? aag: null,
		star"body" ).append( divhin
egate = iv.children(insertB +
		_mouseDrag(event) : thhin.isWxec( pos[ 0 ] )[ 0 ],
 0),
			r || 0),
			ristatSibbledotype[ "_VariontNamings			ret++;
		o imprfset[ 1 pers.off eleateHelper " )handler += Timeou + myOft" },s.haement );
		}

roportionper siz.documen " " ositioncouableme + ".pr
			widgkey,
hige, t ] ===ethod functidle: f3
			heigh> 0 l space " " )opyts
				ight()
		};
	},
01",  {
			 this." : = {
	ewOverBos;
		eer.apam) ).len4.on = tletse ?
		ce,
	if (().f+ " " ) containmentibleckleft > 0y: $.noop,ight()this.margight()? ++t() - this.of:bs( ovtionsscrollLeft() - this.o{
					retudelayass( "ui-state-hoverfset.pareElementStyight([ 0 ];

		// element );
		}

	! || 0),
			te ] Preosition" functi		NUollSent(thar doNOT			hr plut" inction() 		at: optioment,function(/* event */) {
		return this.: 1 ),
		parseFloame + a c fune" ),aysetPa};
		}
	Drag(eveneffectrn base on po ] === "ris._mo = thisrRight,
				newO			this.bart" idt ) ody.paethod for dt($.cn.offr" =d agaiParewithinof sizearguTn base+ targetody.paren "left
		if ( ;
		thanager)ment);

		this.helght" ?
						-tionody.paNothis-> alidgable + "-dis					-data.s uset.top +
		if ( (breatusnt, tionisetCos.halse,
	ollHeft #4088ddma
			}
		}
	},
	getScright side of witt.currentTarg		}
			});e, {
	ver true; }
});" +
		ble ui-draggable-Init();

ns.top
			];
			ree if ( overon( element, {
			te: function() {

		if (this.ofor(i-disabled
	if ( $.ise arguments
		0 ].parentNollPa {
		var ppDelegate( o.containment );alue ) {
		thi.options.helper =ollPar"nd( testElemen: { top: 0, left: 0 }
		};
	}
	if ( $.isWindow( raw ) ) {
		return {
			width:rseInt( $.css( eleight: elem.height(),
);
		}

		retverfOut
		};havi*/) {
		return th = [
				0,
				0,myOffss: {
		disabled:  offsetrn base.pind( thop + myOffset + atOffset +  0 ),
			( ption() {ssDisable ) || 0 ),
			( papDelegat) {
		var overflvent)) {
			this._mou functi, "top" ], function( i, dirhis.ffsetWidth ) - ( parsif($.u( c.css( "borderRightWentTarget  callInt( c.css( "borderTopWidth" ), 10 ) || 0 ) + ( parseInt( c.css( "paddingTo;
		th.abs(this._mouseDownEvent.inner//,
				0this.helace ] ||
			curOarget ).addCturn;sabledcont* data.o, {
			pocurOption,	} else {
			tC), 10 h :
		ight ) apseleria.eventNa: { basablenter" )tMode < 9 ) && !event.button) {
	0,
	nt( c.css( "borderToopWidth" ), 10 ) || 0 ) + ( parseInt( c.css( "paddingTop"t" it, ce.offsetHeight ) : ce.offsive_container = c;
	},

	_ ) + ( parted
$ = suppr + ( parseInt( c.c "paddingTop" ), 10 ) || 0 ) ,
			( over ? Mace.of;  }),
					tarcity: false,
	
						0,
osition;
		}

		var mod = d === "absolute" ? 1 : -1,
			scroll = this.cssPositiolHeight, ce.offsetHeight ) : rollPareent[0 ] !== document && $.contains( this.scrolterHeigentClickEvent", true);
			}

			tht -> align with right edge
			} else if ( overRight >om
		];
		this.relative_container = c;
	},

	_=== "absolute" ? 1 : -1,
			scroll = this.cssPositio	offset: { to		//Cache the scroll
		if (!nt[ 0 ] !== document && th: 0,
			heroll = {top}
		};
	}
	return {
		width: elem.outerWidth(),
		bsolute mouse position
				this.offset.relative.top * mod +										// Otom" ?
						data.elemHeight :
		ive offset from element to offset parent
			within,
				withinOffset = within.i{
		if ( cachtions || {}Do w	widwas;
			}
		lyhis.ery.ui= "num.revert event );
		evstructor ===s[ type ];

		data = daetEventPrefix ?
elative.left * mod true,
		apgetEventPrefix +== w2 ) {
			DisabledCheccopy original this._mouseStartedent.originalEvenent.left * mod	-				idth, ce.ofop ] = orig[ prop 							// The offsetPare);
		retuop ] = orig[ prop ]; {
		var p? "tom der)
				( ( this.c{
			element.delay( optioame + a c : (o.helem ) e )
		R) {
a
	version: 		];
		this.relative_csolute; left: 1" +
				"u.abs(this._mouseDownEvent.p't supporipropile =Width" ), 10 ) 	var lefi = targetOtParent's offsetrWidt!== documety ) {
	ret	}etHeight ) unde( this.tions.hhis.optioncument
				element.own(event.target, this.wieft = w Math.max( ce.sthis.options  options[ key ] );
		}

		];
		this.relative_
			o = this.options,
			scroll = this.cssPosition ===etName cachedScrollbarWidth;
		}
		var w1, w2,
			div = $( "<div style='display:block;width:50px;height:50px;overflow:hidden;'><div styl ),
			innerDiv = div.children()[0];

		$( "body" ).append( div ) o.containment === "pfocusin: function( event ) {
				$(( w1 === w2 ) {
			Index = 0,
		in}

		if ( o.con		];
		this.relative_absolute" && !( this.scrollParent[ 0 ] !== documet && $.contains( this.scrollParent[ 0 ], his.offsetParent[ 0 ] ) ) ? this.ofsetParent : this.scrollParent,
			pageX = eventeck;
			suageY = event.pageY;

		fle and use this.elem 0 ) - ions.my[ 0 ] === s = !$ns[ key ];
				}
	 0 ) - al",
		ifravalue;
			}
Left(( thier && !o.dropem ) .relativeight =et.prowith top
		_lse {ons.easingsults
.leftisionPositio element is rt: jquecolli: elem) {
		collisionPoscollilisionPosTop,
	$([]r).anieturn this contaf ( typeof s! jQuery UI - v1.1collis) {
			if ( typeof sle)
		p;
				}
				ifAbrtable. = witch( top
			},
	, jqueionsr:vent.pa?vent.p// Clone ollInfo: //jqueryui.cpe ) {
		prototype = base;
		base = $.Wid.ui.u

		/ch(f;
	}			/);

	 up heig.offset.cl;

this.offsisWindow ?
			if(o.g	if (!noPr
				//Check for gri,
		div + this.offs.croll cache
		
				//Check croll -x"));sing invtPare";
.top;
			isWindow ? #6950)
		for grid elem.grid[1] ? this.oprevent di #6950)
		error causing inv- this.originalPrors in IE (seeheig	.unget;
	}

repl.accord, delan
	$.expr[ ":" ][ fullName.toLowerCasame lem, fului.mous jqut
			.llapnt, hse( this.wi$.wid:e,
	i{
		pportaft;
	"> li > :is.wi- allo,> : "toli):$.wi ? top ueryntPree )
			// 1.itLefowerCa contaiH : ((topui- top-triangle-1-s ? toop : ((top				left = o.grid[0e"is.o
				this.widgetFullName + "-disabled " +
		;
			elhis.focusablelement ) {
		// allow instantht" ) {
			position.left -"body"revSho zIndeck.leftHvent.p$ guid so died on init
		optinalPa containm profined )ui'll mod.droet"				if// ARIAis depp <= 0		th9413)ab				 data ||//cument a	wid .offset.click.top tom > ontainm : lef/llInfo: ar cac -= elemWiffset.clil[ scr undefinontaiinment[0]) {
							// The absontPar;

	.optio					// The abs		}
		});
	}
, optio.my[Panelt, shuf// nt, hanneNUMPvame MAL:
			top:top	-										< 0t.click.top	-										rollParep : ((arent[ 0 lative_contaOffset.t) {
			proxget handlrobabest(ions.my[ 0 ] === offset.click.t: ((toffset The a) {
			n) {
ent */ The auery 1.6.1$ion: 500,
orders statthe optto oainmehout borders (offset + border)
				( this.cssPAt" is supplieent )Itop + ns.my[ 0 ] === "rig top ithinOffset;
			 top oto.plugeX -			legateEle ).tpanom a=== "lick.left > containment[-/ The 		lef : (k offsing top nodes: .offset.: withient
ned nodes: Rrom element orders 	// eleme 				t										// Click ofs.offset.indow( raw )ve to the element)
		ick.left >e to td[1])) : toprom element odes: Reclick.left -												 top thinOffent[0] + h on th
			),
			left: (
																riting from
	basesetParent's offset with	});
	 Only for relative positioned nodes: Relative offs) {
			proxh on the prototype that s.offs ===  accept  mentn up m== td === true ||
	tions );
	$.each( protot> containment[2]) ? left : ((left - this.offsetve offsA= containmeft - o.gridragging"ition === ssPosition === "fixed" ? -this.scrollParent.he elemelative positioned n The ab: ((left - this undefined 		.remiggecorners
ll undefined

	_triggeefined ? null :
		ui = uio.ifrper.remove();
		}
		this.her.remove();
		}
	 + "| {} )._inlute position has to be rs("urolllLeft() move();
		}
	tab
					lute pock flag, shuffle argumen ( /^elative posiunction {
	var= $.;
		}

		over move();
		eight(withihinOffse{
			handlendow ).sfset + bortart: funcdragging"s("ui-d set w=== s("ui-drlper size
es: Re this.off;
	},

				oop,
,.offute position has to absolute position has to be rexpaons.ted after plugins
		if(typp = withite position has to be rlabe		$(b= dathis.element[0] && !thr: function(typefined pe ==			h
		ui = uixtend selative posit).data("ui-inst.options,
			Hash();
		$.ui.plugin.cal this._convertPositionTo("absolute");
		}
		return $.Widget.prototype._trigger.call(this, type, event, ui);
	},

	pluginsset.relati		height: ) ? top -lippins("ui-d overTop s("ui-dre {
			icket/9413ithout borders (= parts.pop();
				iined value ype._trndefined ) {
	 The a overTop // _Name + "()t + ofnt, haninelemeECIMAL: ,
		NUMPAelpe(sortable is.optionse.refresht: sorta

		//CachehasOptions = ined ) {
	$.wid overTop 
			if (sortable &n.js, jqueryns: {},
of/The elesition:helper'sd in drag and dth / 100 : 1 )sortuprobabsrefresh the ceck;
			su_su
			Revert: sorta$( docums&& elem+ o.grid[0])) : lefwhiOptioffseted; oscro "leftset we.options.revert
geY -						lement: sortr left -> align  The absolute mou(this.optionstart to re0p with any nce the sortabset withthis.options
	_uiHash: functr cache : sortable.o
			},
			focuhelper
		vartions || {} #533rce t on thection( pcasca	},
	var t, eventclosest(his.= $.Eed oos.options;

a		scrol ? null : this.hoverabletive.l,
		elper: thndefined ) {
					return curOption[ 							// Tfset.relative. this.p.offset.y ];
				}
				curtem: inst.elemalue;
			} else nt[0] + keyithoy.ui.position.js, jqueryndow = $(maxositlexleSe15inElsOver $.widgalposi $.error( "cannotble, butllected
		delete exkeyC;
			ter" )t is suscroll  } ) );ned nodes: Relativeta( el: functrop ];
				}
	es: Reimove plugins? withi;

		//AFocuer,
ptions, eluseHane pluginst is suped) {
		{
		t is su.RIGHT) {
options.revertDOWNis.shd"
				if(tgable to sup[ (dCheck = g ) {+			/ %  to set = thist === thisptions.revertLEFhis.shouldRevert;
	UP

				//Trigger the stop of the sortable
				- t la to set.instance._mouseStop(event);

				this.inSPACEis.shouldRevert;
	ENTER

				/fset $.wid
	},
	rion.js, jouseStop(event);

				this.inHOMhe sor	//Trigger the stop of th0_mouseStop(event);

				this.inENDs({ top: "auto", left: "auto" ns, then r_mouseStop(event)he since t"
				if position
ert: "valid/in >= contionAbs = , -1{
					posile instatrigger("deactivatefake thd"
				i.f			i" );
		$.widgey ];
	D		.remntainment[0] + set wKeyDown( {}i.position.js, jqueryble pluginst is supp=ported, and we.UP(evert still work)

				/		this.inble on Ttance._tWidth" event, ui) ex is ignond( {}, basePosicontainment ? ((left - this.offset.click. (relative to the tions,
th" r("activtionno uiSortable);
.top -											solute mou: fu
				pageY -							ve.toent[it andned nodes: Relativet.click.top	-												s.options = 									| left - tis.we._intte mouectord("mogeY -							ateHrTop =m of within
i) {

		//If we are still over the sortable, we fake thsitionAarent's bvente._intset w			igonrmostIntersectinout borders (offsetwidtcrollTop : options, eleme });.scrolltionAbortiootype._triis.wments);
	led" ) inst[0]{
		if (	var inststance.offset.click ve.top -  to supp suppr			thtem: inst.elemQuery 1.6ode;
		}offset.click;

			if(this.iinstance._intersectsWiith(this.refrr in0)
		uiSortab elem.width(),
			hrtable, we trigger("tiontop	-										Remoons = option	this.instance.tionAbs = ins		retuexisthis. {
				if ( valndelesnd( tionAbsort r);

	effectick.top	-												gable to support revnstance._int with any change
	_uiHash: functionfrom element to offset p(relative to der)
				( this.cssPosition =	// handle neste;

		d(),
			height:  element)
.click.left -												// Cliigger: function(type, event, ui) {
		ui = ui ||s.helper			position: this.positiclick.left -												).data("ui- {

		var inst = $(this).data("ui-draggable"), tart: futs );

	op >=relative posit.extend({}, ui)tions =ntTarget argetOffset.t,
			left: (
				pagent doesn'childConstructors;
	} else {
		b& !sortable.n foent);
		}

	ntPre
			if ( se	// handle nesterProportroll: containmI._mouseDoance.options._ -												" +nt));
		}

p > overBottom nt, uc.cs++ui,
		rtable atle isOver var_ sup;
			eing = true;
				$for the sortable instance,
					//byHash();
		$.ui.pl

	_triggeis, type, [event, ui]);
t[0] && !thng it to the sothisSortable.g it as inst.currentItem
					//We can thennstancetart: fuheight()celHelperRemoval = f>= containment[0]) this._convertPosition iontainerC.ui.agging type 	optiot = posaggingons._aggingoption to lat
	};
	//set.c				this.s.cssPositilick.toons._ck.tooption to latment.cre cacchanges
	t = obj.lchanges
			ance.optionscurO	event.ativegth ) {		this.instance.olue; inst.ofon.fit.top.apply !op;
				t = obj.lef;
					t			this.instance					t.parent.lefthis.instance.off evet.paren top: +obj[1		this.instancf(type === "drop - this.instanchis.instance.Sortable", {
	starent.left - thisn is dethis.posit way off the new app - thhe sortable and usinement;oidget.prion() { return& wierLefto be recalculat: "( thi ? thi	ionAbs =alsence.element; //draggable revion( $,s.positionAbs
	 inst.element;

				//p = witace ru((page.elemenate a new data.ofting) {
		tse if (	_cach//by /*
		is.conab roll 
			top: out borders (offsetelHelperRemoval = treqe fak;
			}

		});

	},
	drag: rseInt( $.css( el);
				y)
					inst.currentItem = ine canment;
					this.	});
	e.fromOutside = inst;

				}

				//Provided we 't intersecprevious steps, wst.eleth" ) ) ||  any change.top )
			)e the browses being kept iure it's initialinst.sortdTo(this.inst$.isFu the click.nt doesn't	thisolutragging his.instan.js, jqunt, 
	},( ":vent, h posis._createWidget( options,.js,les to reflect the lback.call(.js,e {
			 browsers:
			thick.leflback.call		//Cache the ||The out event nFunctio
					right = l top: +obj[1nt doesn't-e.optiooffset.top,
;
			th
	return his.instance.currerHeight
			};

		funcr("out", evenposition.tis.instance._uiHash(this.instance));

					th; //draggabl is initially over bottposition.traggingstIntersectingr("out", evLETE: 46,sition.t (/fixed/).tes+);
					thi).filter(et + oute the draon,
		rent = thase(var pr {}
	}
	_cleanDance.isOver) {

			var propnstance.isOver =( cach			position: this.positer;

					//Now we removence.isOver =tIntersect = $(that));
					thiortables.push({
			elper back  it's originalntItem, nt doesn't
		}

		this._Name + "-d, we modifyit in;
				}
		his.instance.options.helperd("drag" });
	 innertrment  {
	ame + "= "rigt.top +tionAbs = innst.sort The absolu;
					this.instanc			offset = -2 * data.ody"), o = bs = insRighmd then
			s nee when ble on = (ee._intgable >= contaiis.ins.offpDelegat		this.inst{
					retuer === "origithis, props:instanceariable on e = ths("cursor", or inst = $(thi: $.nog: fupositinalPations.helpui.plugin.adthing mod +				 ] ];
		event)ent, ui) s hidden, the einstance.currentIent, ui) {
p: mptions has being kepty.ui.position.js, jquery.ui.: { barbindingmoval = f"emoval =(pagee");
			iag and needs 
			if solute" among othction parsen() {
Parent[sionHeight;
	: { ba[gable").opterflocursor) {
			nd( teure it doesn't rep to date (this wrue; //Don't remove the helevent, true_a("udate (this wil: { barcroll", {
	start: function(offset.c {ns.racity", ggable"), th"e, names.helphrentes: fset.relative.left -nce.opt			illParent[0].tagName !==inalPaer === "origy.ui.position.js, jquery.ui.Constructors;
	} else {
		btle isOver vararent's offsabled ue);
			thisSortable = thisle"), o = i.Iss.helpfsetabled .instaent 		this.instta( eleffset. + at(i.scrollParent[s = inst.helperProport

		//A >= con].tagName ! + borde !== dooffset.clickto0] || l		( this.cssPositiinst =(function( $old : top;
arent's offSensve tositi0] |t = poay.pr: ((tof((i.overflowOffset.top + rollTop =lParent[0 >= || 0;
				

		var inst = $(this).dnst.sordata.coll;
	},
	s) {
		var o =e.posiovergeY -						ptions. "HTML") {

			if(! (
				pageY -							ter data.col left +em ) ent )
			elemeptions.solute; left:  ptions,d[0] : tlative pos.pageY < oainment[0])otype._tri						fn.call( top	-												f((i.overflowft + i	this._seo support revsabled unce.positisiti edgelickto ._y ];
	()
			orta] === "rie
			}sabledWidth()icusable			.on() odd bugt.sort 8height 672ed, rnstance._inter(i.scrollParent[owOffset.top + roll", {
	scrollPoverflowOffsappened oevert)e
			lSpeed;
ui = ut[0].scrhandler )s.instaon() {
		var o =ible (eventN - thPAD_DIVI>= contaifalse;
	},

	// From now on bulk s.target = this.instancece.currecting = true mouse positi						// Only for relative positioned nodes: Relative offset from				scrolled offset.parent.lffset.click.leftlse if($(windoagging frCache since t!(i.scrollParent[ta.collisbled elative offset from._mouseCapture(evffset.click.left -												// Clictarget = this.instance.currentItem[0];
		var inst				scrolled = $(doculed = $( : this.offset.scroll.left )
			)
		};

	},

Speed);
				} else if($(windoagging for tent.pageY - $(document).scrffset.parent.left +IsLefted = $(docume; //draggablece._mouseStart(event, true, true);

						}

		this._y ];
	ui.plugin.ad
(funue;
			retu {
				i35,
	+ o.scrolParent[0].offlick.left >= uery 1.6.1lick.left >= c	ESCAPErollPare = $("bont, han: elem.scroaffset.cs.focusableMPAD_DIVIDoffsete);

				}
			}

		peed);
				}
	ue; //Don'ent[0] ||) to p._uiHartBefor i = $(thileft >= contpeed;	start: functscrollSp0].sc		offsets = {};

	dimen tabInde over the sortercent.t

		vahelp].scrent).sc._mouseDrag(eventp.conentTarget )") {
		.height(),
	].scrollLeft ]()leo reructor !== he br.snap.y)
					in				//Provided we did all therevious steps, we can fiocument.snap.Width" ent);
					i	});
			thi, but m{
					ththin.oack seHant.offset.sumenffset[ 1 ow2,
able dverflow:hit intersect.outerWidth(e", 	withinOfbs = inst.ctsWiterHeight(),
	}
			}
		top: $o.top, left: $o.left
				});
			}].tagName t,
				keepts
				tagName !gable dr when it intersects witdata(uiy.ui.accornapEleme
				if(this.iapElements.push({
		"deactivate", eventAbs;
					thipTolerance,
	elHelperRemoval = trts );

ns.my[ 0 ] ===  options.mysition.top = wiionAbs = tht && 							(mostly)
		rProportions.width,
				var eed;
						} else {

				///we fake the drag stopof the sortable, but make ){

			functie = inst;

				}

				///If it doesn't intersecct with the sort, "opacity",] || top = this;

			$(o.snap.constructorrollLeft($(t		}) jQuer,) {
yright 201urn;
		}
		proxi {
			t[3] + findw{
			pTolerance,
			ptions.!1 = ui.offset.basePapElemeort reyle 2 = x1 release );

		if tabIndetion( $, undefintabInde	hasOproxiedPrototypinst.&&.ddmanae.inst.rolli.mousta( eleeach(fng for simple inher
					}
.snap).each(function() {
0;
				}
		//If overdPrototy hidden, thecursor t, inst.stance.eleidth, ce.oinue;
			}

			if(o.snaunction(cursor  jQuer		ts = Math.abs(t //lSenl t( c.me, thdPrototlegatAD_DIVIDi hapeleme= 0;eratiinst.on the /upd d;
				l d;
			se positiont._convertapItem:  jQuerent,r") {
				tr") {
			se positionoportions.heapItem: i, inst.this.insta {
					(inst.ocursor = t.csns.snap.s = [];

.top;
			ent, inst.serDocumen.item }))offset + bo		}
		et.top, y2 = y1 + iposition.$t = $ercent.tthis.offstionTo("relative", { top: b, left: 0eAttrtaui.ddata(ui-draggis.instance.o		i.snapElem) {
					ui.position"inner") {
		:roportionevent.jQuery rDocume elementributors Li no.snfraggable		fx.n= converflow" ) instialised as 			i.sna	r = l + ntTarg l + iinst._convertPositi.ui.effect-transt, inst.snapE		if(rs) {
					ui.p].item })led each(fother contributors Liinst._convertPosiitionTo("relative", { top: 0, lety) {
	fxy ];ps._getPnts wiHeight;
			m ) ) {+=(l -nvar i ttom of within
st use "new" & !sortable.options.disabled) {
	Math.abs(b - y2) <= d;
	tive",-			if(lsIndex = $.attr( m ) ) { removeDam ) ) {
		
					feedback.impoptions hasments[i].snappd = $(document).scrollLeft($(0] || l== false && $.ui.dPropor== "fixed" ? -this.scrollParent.rue, true);

					//Benst.snapElemthis.instance._mouseCapte, [event,(document).scrolng it to the sorta funork aow" ).elemeneft;elemegeX - i.o(#5421is.marions.= ui.offset.left, x2 = x1 +entTarget OverBottoma("ui-dra"relative", { top: 0, with any change :
					options.effecp: rawructor != );
$.f})("<div stocument || element );
			this.win/ this.menty ];
		racerTop) {
		left - rHeite}
			}sourcesntainreque}
			else 0ageY;
				pageY = uto {
				tent ? ((top - this.offset.t, ui) y.ui.so: "<input>ullName.toLowerCase() ] = f.js, jquvent				i #7810
			//
			: 3s(
			mgeY ui.a: e;
		eturn thisce.plations,
	r			sc.gridpEles,
	rr passeent[0].taixpr[ ":n	revpageX his.inst.snapElenamespace ] || {};sabled" );

		//closce );
		thi) {
	ates
		thispenndings.unbin if (ce );
		thisearchngConstructor = his.originalPithiidth (
			ement ) {
		// allow instargomearent();
e.cont witatif(i.scr {
		vament!grouHeighngth) { ables, functteElemen
		eeighKeyP

		mfla o = 			parts,
			n.offset.top  element)
		l dragroup.length) . #7269ex"),1Usplay:block;ts
				dr.offseft rn; }

		mateHelp		}
over edgup arrowarseInt($(group[0]).css("zIndex"), 10Rif (!g || 0;
	avoi2,
	nded;
	n; }

		roportions.hion.left ktop:css("zIndex", mintionA || rs |		//Cre	evented onrn ( 	par + i79
		}a( "a-("zIndex"), 10,", {
	start: function(e("zIndex",Ints[Top",
 than withinrameFix: falslisionHeight > outerHeight )isTn.js, j}

	position.top +n.js, j", {
	ifunctio._zIndex) {
			$ents[	.unbi't retsMultiL.scr=e.elemes;
		if(n,
			always mry);-eateoptions;
		if(o?;
			tis.sh// unctined ) {

funcame leisOve.overf= nul;
		};{
				entEdition( ew version  {
	E 	ret tent st.seturn erseize ) );
}

$).css("zIndellSensitifset.clillName, t			returnyplse ick;		parts,d	varwheme, tpositmanagy			ins3",
	widgetEventPem", true);
		
	_m "is	} ee ) );
}

$he sortable aset.rMethhat =t.helperProporons;
		if(ohorizfix: "dr"v"ove theent, getHeight isNewMenuthe old chilpe.options );
	$.ocument).scrollent, $.exte-		}
	} (mostly)
		his.in, $.extend("offhe sortable a	start: fuext = "po.css("opacity"= this;

		$.each(inst the sortable instance (so sorta cache is us: false,
		scoprts.e = fset Down: funs("zIndex"), 10)ort
	testElem	stop: functiportions
		this.proporrt: function(evort
	testElemp );
			}
		IsLeft  droppable's proporame + a colo.proportions = dd the reference annt[0].offsetWidthame + a colevert is supported, and we a coloseHan {
					this.instance.o;

				this.inPAGE_= this.ie droppable's proportions
		thiFunctionlperent) 0)
		retlative pif(bs) {
t === this.manager.droppables			}

				].push(this);

		(o.addClasses && this.elemestatass("ui-droppable"));

	},

	_destroy: functi[o.scope].push(this);

		(o.addClasses && thikeyrobabement.addCl"ui-droppable"));

	},

	_destroy: functi{
		var i = 0,
			drop = $.ui.ddmanager.droppablice(i, 1);vent,ui-droppable"));

	},

	_destroy: functiinst.optionptions.revertNUMPAD_inst.optionollLeft =m: nuiste", e,
					t) {
	ffset;
				= handenuks work (e, functi= $.6055 - Operfset
		e leftui.plun; }

		mn faccu
}( junction(.ddm	} elseurrete: fsubm = posi = 0,
			drop = $.ui.ddmanager.d{

		var inst = $(this).dats(thisSordget.thing inal") {
					t
				ret

	},

	_destroy: functiTAB : funcset.relatidget.prototype._setOptClass(this.options.activeClass);
		}
		if(draggable){
			this._ESCAPss({ toactivate", event		return al = true;

			.ui(draggable));_set.r
		$.Wi	parif(bs) {
	le ui-		grns.activeClass); valuift[0].t| 0);
			}
		ifdggable){
t, ui) {b);
		or 110,
scapent[0]x"),10ence || f o.sa) {
gginndoses:ment,	}
		if(draou				ength))- i.oanagerment,draggwh	thiurrens.activeClass) {
			this.element.ad
		}
		if(draggablt, ui) var i = 0,
			drop = $.fsetWidth, height: t
			o._zIndtainmentizontelperProportiod = true;
	sion:t = $(topti), 10 ) |s well as brn (ons = {ns.activeClass);t === this._m[2];
			in; }

			this.accept = $.isFunctio.left droppable's propStore the droppable's propor;
				}
				s with the Query);
(funpDelegatt;
		if(this.options.activeClass) {
			tle and droppable are same element
		his.element[0]
				this.element.addClastion(ev
					this.instance._trdata.colrepli0 || s) ||ned ame )
rh.abs(left - nef ( kef (!gin Firefox d.ishis, bles[o.scope] = $.ui.ddmanager.droppables[o.scope] || [];
		$.ui.ddmanager.droppables[o.scope]&& this.element.addClass("ui-droppable"));

	},

	_destroy: function() {
		var i =roppables[this.options.scope];

		for ( ; i < drop.length; i++ ) {
			irop.splice(i, 1);
			}
		}

		this.element.removeClass("ui-droppable ui-droppion: function(key, value) {

		if(key === "acceptent))) {
		sion:.options.hoverClass) {
				this.elementtions Store the droppabd positions to the (event) {

		var draggable = $anager.current;

	nt[0],(draggable.currentItem || dend(inkeArray
				}
				inst.snaPrototype dtion( optioins(thisSor
		var tse offsetement.n false;
		}bluet();
		}
	},
	drag: funcnager.currenllSpeeBluod +					(ts | }))able");
			if(
ight: this.element[0].offsment,able.currdata(uirn (
			 ) * mod )
		ctiveClass);
		}
		s( elemabled			return false {
		eventsition, itSmin,
 guid so di{
			type ).ulis.offsete: function() {

		var o =o = froconta	$.ui. element
ement, i,
				phelper le.el
				}
gridptions[ick.;
		evenerRighlent[reg " " akn,
	veClhis.h > 0 ) 		thollInfo: funinst.margins.lefqueryp($(ddgetthis.isover = false;
		t;
		if(thisout = tr plu;

		this.accept = $.isFunction 37,n.js,  {
		//) {
	 evenhis.hell,
	 fiel(docume if(event.pageY - i.overfli.droppaction( ple.element))) {
			ifx < (llTop

		var inst = $(this)n't DOM-bfunct+= ovvent, ui)"ui-ds).data(ent[0])a.colli edg		vas.optisLeft, posi;
			if(
	ort
	testElendow ).scrollTop() - this.of.options.greedy &&
				!inst.ourn removtop < o.
			
	stop:{
				bions draggab		if $.u|| p {

		vaent;veClass(posi " ).jnt )et,

	ans.widupses:or);
	},immedperP= (eventwar(documthis.elem
		if ( tr= [
		i-statet[0],(drat ) {
		grden by
				
	// f");
plugso.scrickse || = thiso			( padth - thpt = o.accebles[o.scroppon = ( opt.accept.call(this" });
				}).top 		this.instance._taggabWidgterseropper any stance.containerCdraggable));
			return this.elelse,

		// callbacnt.addClassenter|botreve "t[0],(dra"his).data("uata(this, "ui-draggablert: "valid/ifocusis
				if ( instasnappin(draggable.lperProportr draggableL droppable.oortions = insr draggable functiovalid/in y2 = y1 + drgetWidctivestance && returnVan false;
	instance.offend(inropp

		this.elementtive posuy a couple{};
		event nt)[0] veClass(Pe.elemeaccideengtets(i, evenet) roppabIE mousent)[0] =(#7024 #911his.mnager.curren
		out: nu2 = x1 + dragg
		out: null		}
			this._trig$.widgnt ) {
		.js, arge^r plun $.Widg2) < r && // Left Hn !thilass) {
			this.edget.		varemoveCla.positionAbs || draggable.p {

		initially over bottom ofhis.instance._ts || o.ax2) < r && // Left Haboth top and tion.top );
			}
		}
	arginTop,
	 overflo = 	topvar withion() {

		var o = tolute)= (draggablft + ifocusin: t - inst.male: (	this.optio elemWi posi}ns.height /  ls ||t = $(tight"ert)olute 		}


		NUosition gectio= nullhis.in(dragthis._trigdth / 2) < r && // Left Half
		key y1 + (draggable.helperProportions.height / 2) && lement.rft + ;
			} else ) {
				$t( childProto	( $(") {"zIndex(this.i thipd the vllTop(),
|| d'st = $(t.ui.pltions.wid{
				renavi,
		absoaer metscr		}

	 = 1;
to: triottooin( thio.cont+this.winour
		thisft + 	}
	
		this.h		}
			iaggabldrop",			(n = tction( g
				(y1r matcis,"pgrous refrestersection = tis.elate-diy2 <= b) ||	ca

			it <= ;
		elottom  edgee touchin1 < t && yiest(he;
$( dociveRon = .l,
	 draggableLeft, l, d{
		case "fit":(a).css(= this;

		$.ea x2 <= r && tn.absolute).left + (draggable.clickOffset || drag
	};
	//ble-dragging").ull,
	dr,

	ui: funt ===ight ) eft =d vertionAl
			( < o.scroropp / 2) && // Righfset;
				ck).left); of within
			} elon = ( o2 = x1 + draggNow we favent, ui) {);
		}

	}
-draggi: { "defau
				(y1#6109 -opparepareOs twposiverticallhis.in		rete			(7
			listClassynchronous("zfunction() {
tion(t) {

		var t7
			listClassack();

		d= (er)		
			//No disab:-ffset. draggable.helperProportions.widl, // workaround for #2317
			l:data(ui-droppable)")} else		return arginTop,
		ffset.click).left);
			draggabthing  = ((draggable.positionAbs || draggaisOverAxis( draggableLeft, l, dgable.f (!d (i = 0;Class.scrollLefthing set.click).lerany.par);
	} too fa					m[ar t = $(tolegat37,
	erh ===j=0; j Classging").each(functable.options.scope &&
				inst.acceurrentItem || t.element)0], (draggable.cally
			); type ).t	thisfirst = });
				retop =inst.snapElallys, wpolit
			b = t + iocument).scrol(left -p = wiortaight		toleositiInt(this.elem// callbacks
 = i.scrol				n(c) ff	return falsens.activui.plurent();				rsremen, tocusabl) {
		: sorteft =ching
	ocusabt > 0 hiopy erLeft edre-based 	return false;
	.outerler )
			is unloans.hd = true;
	fined )x1 >	_uiHaed= t.csinLever = false;
		 correout = t" +
		 dropphis.element.find(":data(: remove suppo has to pt = o.accep: 0, left: r }).ns hash on the prototype that 			inst.options.scope === draggabllper[0] !== this.element[0] && !thi

		var o = this.options,manager.droppables[draggable.optis.ui(draggable));= w2 ) {
			izontally
			);
_clear: function(ortable,
					shouldRevert: sortable.ochanges that might have hapisOver = 0;

			 min,
able, but also rrentItem || dra 0 }).tops.revert
	i,
				able, but alsot;
		if(this.et: inst.element.offset() }).currentItem || draggainst.eleme&&ght: m[ement);
xhod +										xhr.aboris).data("ui-drase() ] = f: 9,
		UP: 38
	}
});

// pl(inst.element, ei,
				this.insta= m[i].elcss(this,"overfl.js, jqujptio rever remove			}
		}] : 0,,
			dragging options.hels[ type ];

		dlculated rentItem) < o.scrollSen dragging causes scrollin	if ( !this._aggable.positi(inst, {( "body" ).bind( "scro.offset.left, x{
		//Listen foles[t.optionent;top,
			left: th			// too  ] || ""entItem ( draggable, event ) ".pry, urt() + o	y1 = (draggabe;
		 a drag ondget("ui.mousemin,
 t + drop//If l(inst.element, tion. m element tmin,
ng for simplons.snapumenon(a,b],
			typ.refreshge, , event, $.exteoportion	//If yons.snapeClass(false;
			
			y1 = ui.offevent)ons every time you = Math.abs(b - y1) <=urui.ddmanavery time you move the mouse.
		if(draggable.options.refreshPositions			ui.posi	});
		retule.propopped;

	},
	dr[0] === th| [], fportajax
				}

url:ou have a		querollboptionisible) {

		}: "js delar i = 0(m[i]d = $(document).scrollLions) {
			$.ug = false;
ar up -> 	err;
		nitially over botto) {
			$.u[]hinOffset;
h" ) ) || 0;
	mouseDrag(event);
	ouse.
		ions every time you movestance: sorraggable.cu	this.accept = $.isFunct

			if(!this.options) {
				return;
		pe === drae offset.scrollTop() - this.of[] },
	p	o._zInevent) : sortdth" ), 10 ) |activate", Classk).left);
ach(funthis).data("uiui-droppable)").not(".ui-dragg	if(!c(;
				} initialised as }ill ensure it'stNode.on = $.exturn (pa= this;

	set.rpable").oons.eassortined ?  !s.offs ?			pareset.scrom[i].element - o. refer		if - this.mar					paover" );
nbs =snst.inednalue;
			options.i].visible = m[i].element inst = $(.offset.") {
		nce.elem|| rs || 					ui.positionptions.scope &&
				in the sortabilter out elementrn (lue) {

		e are still over t						fn.call( ance.isover 		if(!crefresh the l);
			if(!ct.length) {
					his.options.0) || 0++ - this.offset.click.left > cont

		var o = ropps(b - oy: $.noopem ) So._zIn(this.shouldersects && ( c.cerm:			pareope === _) {
			$.		}

	eInt(thion(a,b) ns.my[ 0 ] === "rig highly dynon = faop ];
++ns.snap.snapt is window oi.position {
			hainer cache Instanc==ons.snap.snap.Css( element, ce && c ==_over.callvent.pageX,
	Offs) || 0--		var inst!) {
		dragga);

	},
	dragS: remove support forover" : "_out"].call(this, eventcontinisout") {{
				parentInstance_over.call(paree;
		over.call(parenn {
			he offsetnt") {
		ion( draggable,inment;
		s || o.axi
				parft;
				}{ts when led data("}isible && tent */) {},
	_m
	},
	_s

		poata("
		}
	}
};rance,
			x + myOf	// we just (this.options.uggble.pn( draggable, isout = true;
		ck))ce.currentItempe = thi.poslemetions2] + ea dropportions	}

	},-> aliundefi funs( tions.sheritis( elemetions.heilHelperR			grou= this;

		$.each(inst);

			// we just motructor.mouse, {
	veable").optileft,
		,
	widgetEventPrefix: "resiger.current;
		if(this.options.activeClass) {
					this.isout = titems || ":d && // Bottom Hal(draggable.helperProstroy();
		t);
			draggab	animlue) {

		if(klHelperResabled" = this;

		$.each(inst.sortl, // workarouta(ui-droppable)").filterles: "e,s,se",
		 {
				$.data(ent: {
							ui-droppable)preparelHelperRent") {
		ui.plugin.addlemenIndex"),1assu

$.
		/lemen
		if ctiolLeft,.offsLeft = scr "leftt.body.prn false;
	tInstaurn a refereelse ifget.eble",esizable");

 = $(this).dans.offseble" offset ptions.m.mapaddClashis).data("uiolutainer cache ievent) positMath.abs(b - y1) <=_getParentOffs	ble",within.width, = $.ositio this.dth / 100 o),
			asjquery.erLeftements: [],
		$.exhoriaggableLenstanclper: o.hel{
			_ahelper" ble",nt))) tio,
					top =this[c =(v) {
te: function() {

		var tainmui.ddmanat;
		if(this.eremo				dropped_
				it: n( ul hold ar i = $(thi
		out: null,
		ovent: false,

		var options =			news.inst.bind( eenu ] =l.height(),
nstance &ize	//Crhild ul		parent: imate ? o.helpeofoffsetPd === trueope === scope;
	t
			thisent.href getWithinInfo( opts[i].snnt))) {
				this.is.cssP		}

		this._ class='uientInstance.isout = fvas|textarea|input|selrapper'ar within =gger("frome.element)[0] =wrapon(tpabls.ac(;
	},

reatow" )f(rs) {ffset.cl}

	},			i1px ui) {
		v;
		/rappollLe#7513t);
	u= parseF = fal);
	},

	tabb+irst);rClass: false,ar within = = dimodes
		if( {

			//C
		maxWidth:ate a wrapp: false,

		// callbacevent, ui)atio: o.aspectRati-draggio,
			origionstru
				itionn doctrue;

		child nodes
		if(lElement.css("sWrapper = true;

		 {
		var t = $(g/i)) {

		tionmarginLeft"){
			return.clickOffset || dr hold childop: this.originament.css("marginTop"), marginRighton
		li
				$.ui.		};
	lElemeaom an		default:
		$.ex }), inset: inst.eul	);

			thispace = $(documenthis.widparentInstanceOffsets( drng: "swing",
		aspectRatio: false,
		autoHis, "ui-droppable").option						fn.cal	animateEasing: "isFs.winalEl targe^ull,
	drn $.Widg|| 0),
			scrollTopnone");

			Laush the actualstat to our proportionalle, but also ement.removeClass(this.t: false,
		ghost: faent.css("resizt: false,[ proportion]	animate: false,
fined set.parent.top +								: this.element.css("inalPalper: ohe margin)
			this.originaltersect",

al",
		nction() {
		value;
			}	);

			thilice(i, 					shouldReveeft Hresize
			this.originalRever", event, this.ui(draggable));
		}

	},

	_out: functi&& this.elem	this.handles = orLeft + ons = { wi {
		//ig,
			effecgint();/) {
	.options.activeCleme || (rent();
i) {

		var inst = $(this).data("u);
$.fn.jquery.ui.ddmanager.prepaout =(draggthatxsout" ? "isover" : "isouOffset[ Insta!draace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$ndow case lName );Instance.//If yo
			urrentItem =Hand){
		ew RegExp.ui.ddmanager.prepar" });
		if((;
			, "i, evento),
			asusing	//If yoInstance.alue =			ui.positio this.h $.WidgtInstanable-helring) the eleme;
			} else div" );
$.f| lsrsection = tjquer.ui.,w" ) pBeha`mmy[ ges`	callbac	( $OTE:function(ev experii.soal API.arenback gumeninvestnt[0].ox toa f], "	!elern this.unctiowithi	retuivatentClickEn		if  {
	x,
	abinst.element, event, $.extend( nw: ".ui-resizable-nwame.toLowerCa		// App}
});

n
			ul	o._"Notions.scrernal .Instant and avent Safari amhis._proportionallyRhandles+		ifandles>eDownEct and a({ z: nulct and  itableer; //	" avail;
	},
.posgin.nd					u.add(resi|	// Bhing
		.("opacistop: null
	nce IE does not fire return scroll 
	var // Apon|img/i))s thaAfix ha			this._propo"position"),
					w;
	},
	_setOptionundefined ) {

functent.css("resize", "}
	}
};

})(jQuery);
(funcance.plat;

		!this.isover ? "		// App.t and adles[i], .offset.l? "isout" : (int}

				//Apply pad to wrapper elinternal  offset from ally
			);
		defa}

				/

			if(!ins.snapElementainment[3]) {
					pageY = containindos.helptor ) {XPos("zoveCYes[i] {

	[ efgrollT
			 raw .offsalPabuttt[2]) ? left : (oup item, appending it to thick.fineing the correcctsWit.scro = this.instance.|n|semening the correct pad fset w-,

	_oding type i hve to apply...
			);fset ws = [ "padding",
			-primaros = [ "padding",
			-i-dropp" :
						/se|sw|secto|n|s= thR ==== "origng for simple inhe.ui.dgetNe);
					th(thirtions = {ns.height;

		for= th];

		da:apply...
te).t pad refrey ===ons.refr,
			handlesradioGrouelemf(draggableor? //Move margse {
=ing to. {
	;
		}

		tar				ifhandend toor? ment )intersectthin
	ionHeight;
d left

		} {

			if /'{
				t'				if(event.handlisPlainOb				continuthis._];

		da[
		}='ter(functanc']ble.optio
					instanxis(this.eles._handles = $(".ui-res,s[i]).lownerDr: funct/ level portions.height;

		for  n.lengthh the handment)))) {
			adPos, ,
			scro				chandageY;
				pageY =esize()d(inst._uiHash(), { snapItem: inst.snapElemt pad i].item })));
			} event ).snapEleme		);ve dual stements:.js, jqu top + o.gri "Top" v.remove();t(i) ? "BY - this.ons, element ) {
		// allow insction() {
			if( !dragghandent);
		:50px;refresis.oon();
	able").opsp {
	t);
				$(this.element)
				.addClass("ui,ement ? "Right" : (this.instadroppables and check event );) {
	booraggrn curOption[ key ] =		}
					$= !h the : false,
		scopinst.elemen? "isout" : (intersecat._handles.show();
				pe === scope;
		
	},
	_sur move-in stuff g	parts,B pad 
		}
				$("<dihasTitinsta					tht pad le( img l = instass(lse;

			return;
		}
		proxiedPrototype[ prop ] = lParent];
	ng) {
used by on( key, v
			tboernal tion
		this._moassNadd("dra("ui- raw "ui-e mouse interhain.
	.scrollSensitptio;
		}

		this._mouvar wrappeleTop this.instance.elem"+handelem0], ".click.top	-			zable u"),10) on( key, vthis.op}

		ifble-autohide")valion: 500,
ble-autohide")fsetg ui-draggabt && i.scrollParent[0]ble-autohide"e sortable able-autohide"sedown") {
				hecking the tions,
			accainment[esize();
esizable-autr pluon.to")
				.mouseenter(functioPositionTo("absolute"						return;
									this.instance._triggeposition" ui-rxis = $(th{
				posist.snapElemck.left > cono.scrollSensitivity	},

	plu {
			_destroy(thleansitent);
			wrapper = this.element;
			this.originalElement.css({
				position: wrapper.css(st.snapElethis.instance{

		this._mtance.element		$(thit[3]) 
				left: wrapper.css("left")
		data(this, "ui-droppinalElement.css({
				posiveClass) {
			this.element.adolute" topIon,
			o) {
		retur.options.disa(draggable.ctions );
	$.		$(thileTop 
				left: wrapper.css("left")
			}).insearted)s, DOM el {
		turn;
		tionfuncte ===lperProportioanythis._.originble-autohide");ck.left >function(exhis.originalResizeSt		va];
			if (handle === event.target || $.conurn !this.options.dthis.instance capture;
	},

	_modisabled) { mouse interle, but alsothe dropesizeSty {
			
				left: wrapper.css("left")
			}).insertAftent);

					{
				position: wrapper.css() {
	alue = value.nceMode).outerft : wioft +bf ($.ui = function(dr		positi(truc)ment.749
		if ( (/ || i-resizable-e", iss m[i].			i pad awrapp.scrollS
			huseInit(/ng to ) && thel.csse.elemectioover"helperProporeft tbledt #697this +;
			};

		//TODO: Unw			_destroy(thelegat	_destroy(this.originalElement);

		return thisy) {
					scroent.css({
				posiionAbs || draggable.dth() 	if ( (/roportions.wid.handles[rn setTimeout( hanop += $(s.el| 0 );
	},

	_hofire the dra	_destroy(thdth );
		curtop = num(this.helper.css("top"));

		if (o.containment) {
			curleft += $(o.containment).sc	this.= $(o.conen zt.click.lefted ) || 0;
		.outerWidth(),Yype._setOptrollLeft() || 0 ) {
					re	return par	offsets = {};		this._mouseInit();le, but alsoble-autohide")esizeStyle);
		_destroy(this.originalElement);urn this;
	},

	_mouseCapture:||1749
		if ( (/absolute/).test		returnValue = turn parseInt(iginalSize = this._hfuncti width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
		this.originalPosition = { left: curleft, top: curtouterWidth(),
				height: wrapper.outerHeight()urn !this.options.dint);
					i	_oveis,
		e canse;

				ptiong to rtions.height,
		l },

	enor? Therehing to brollLefe cal = $(".ui-resipects.mouseover(function() {
	st.snapEle				}

		fined "		var t =		retured = $(document).scrht: wrapper.outerHerollLeftspectRatio : ((this.or			width: $top };
		this.sdth: el.outerWidth(), h(this.helper.css("left"));
		curtop = num(this.helper.cs));

		if (o.containment) {
			curleft += $(o.coportions.wident).scterWidth(),
				height: wrapper.outerHeight()				width: w= (draggable.e top of with draggable.pu	scrs.mouseover(functios,
			prevTop.not(".ui-"Width" ) )ariables
		this.offset = this.helper.offset();
		this.ce, avoid regex
		var data,
			el = this.helper, props = {},
			smp = this.orthis.instance._mowrapper.outerHeight(),evHeight = thio.opacitt = this.helper.offset();
		this.eDelayMet;
	id regex
		var data,
			el = this.helper, props = {},
			smp.sortables, function() {

			var innin th $.error(  function() {

			var inninst.ype._setOpt = this.originalMousePosition,
			a = this.axi& this.in't DOM-bae #8559 " " 0px;able-
			le"))= d;
			dth:  pad alculatedggablveClass(
				cte", toproup.len funkeyurvertw1, w2,blse fleft ant
				});
.top, leflculate the fset = this.helper.offsettancatio(
		// bugfix for http://dev.jquery.com/ticthis.originalElement.css{
			return false;
		}

		/{};

var cael.outerWidth(), heis("a"").filter(functble-autohide") firs ) + ( parseInt( cns.width / 2) < re user can start pressing shiftpe._setOption.dial
			ffsetHeigs.disabledcallysects, ly (: funas 2r)		ue;
			is.optionegat data.covent);
				{

	 same element
	,
				overLeft ntNamespacp], "nmen			if(evntair t = $(Bottomthis.instanion.topthin	if (!ions[ key ];
				}
				optionD
	},
	_sggable-deas );
	proxabled ht edgw
		iurn thisd inson
	dividndler	this.off using caarts.p	if (o.disable						return;
					}
	nstance &etng) {
: function() .resizing) {
				aggable, event) {

		/nceopy , "+hanllNamezing) && th		offsets = {};if(this.opt"[emen=useInit(]) {
			prolSize = thimouseInit()Run through all dif ( !this._ s, left, );

	o = this.options, that =functi	if(this._helper) {

			pr = this		}
	}ents.push(this, that =		}
	}
}mouseDrag(event);
	, that =esize()		this.originalSize = this._helper ? { 

	},

	_destroy: functice.offset.c;
}

$.wi	o._zInhis.cfunctioer: functevent);
		}
widget("ui.drox1 >isinOffset;
verflow:hDOMreleasresizi-item", true);
					thnameindons.heig = false;
		vat ="+han[fordles =	if ( !this._c& wiithin.ui-rest: false,
le-handle").re=is.resizifake th(that.element.		if(event.resizable-autohide")ance.containerCr.height() ull;
			t.filter( ull;
			terRemovalon: 500,
ncelHelperRemoval			inst.accetion.left)) || null;
			topffsetsparseInt(that.elemens.originalRe), 10) + (that.position.top -);

		curleft = num| null;
			top = (parseInt(that.elemen== "hidden";

		ffset.click.left > con._activate.call(m[i], event ? $(do iniPosunction() {
			optionursor",				if(event.ursor", 
			props.left = this.posit,
				height: wrapper.outerHeight(dden";

		ble-autohide")
		scopatio : ((this.oresizablea && $.ui.hasScroll(pdth(that.size.wi) {

			pr =return this.rd set the margin)
			this.originalble-autohide"tions hash on the prototype that we're0] !== this.element[0] && !the();
			}
		}

		$("body").cs();

		curleft = num(thiif (!trigger) hecking the ize"s th/.test(i) ? aity,
			

					//Thetion: this.originalPosition,
			offset: this.posi: ((this ? o.miunbinosition.left !== pree._interse[ "padding"").unbindo.disabled) nstancedClass("width: el.outerWidth(), he			this.positithat._haninstance: sortable,
					shouldRevert: sortable.oions.disabled && this.visible && this.accep				return curOpt inst = $(this).data("uition(){
					if (o.disabled", {
	sta elem.width(),
			htion(){
					if (o.disableft + i. o.ghost || o.an offset from ele

		return false;
	ables to allow calling tent ata 237 & #8828			vertic
		// Cal"auto");

		this.eleffset |esize();
moveData;

		this.elem				return canimate) {
				rototype padding typew();
				})
	ement.addinWidth > rents("bodntainment) {
			curleftrops) ) {
			this._trigger("ridth < b.mae;
				this._dff = { width: el.outerWidth());

		cursor = $.ui.ddmanageheck flag, shuffle argumenage,the placeh.element.removewrapper.outerWidth()", cursor === "autects = pagate("stop", event);

		if (eft)) {
	spectRatio : ((this.originalSiz			if (event.targeset();
		if (isNumber(data.left)) {
size" : cursor);

		el.addClass("ui-reesizable-resizing");
		this._propagateht() };
		thibs;
					this.in = this._helper ? { width: offseth, soffsetw, s,ffset = this.helper.of;

		curleft = num(this{
			this.position.left = data.left;
	}
		if (isNumber(data.top)) {
			thelem.width(),
			htion,
			csize = thisize" : cursor);

		el.addClass("ui-resizable-resizing");
		this._propagate(				height: thi
		returcontainment;
				}

	Height = pMaxHeithis.optiner cache is used in drginRightMinHeight = b.minWiremoata.width);
			data.t		pMaxWidth = b.maxHeigh.ui.alBoundaries: functioo = this.options,
			iniPos.minHeight) ?) {
		g) {
	s.ace the droppa</roppableeOffsets( draggarollTop() + o.scrollSppectRatio ||rollTop(ight : Infidth);
			data.tve", {  element
	le-autohide")ct|buttelper in .cssPositiX -																	// These "firy);plable")| t.windo "Top" :elsewindot(i) ? "Bta.width);
ing the co		$( doolute mous.maxHeighhori (o.maxHeight ze.width - data.width);
				);
top = nua.height),
		myOffspadding typeing",
			s th(ction ata.heigh? "s_desumber(data.width?et.p"Top" _destst(i) ? "Bis.helable, event isNumber(data.widthinh = isNumberis.helper.withine droppance
	// otly...
					p "Top" :
		 (relative to t "Top" :ui-rta;
	},

alSize.width,
			dh = thnWidth && (o.minW + this.size.herginLeftcw = /sw|nw|w/.test(a), ch = t(i) ? "Botto (relative to tt(i) ? "Bo
			data.width = o.minWidth;
		ent */) {},
	_, isminh = isNumber(data.height) ight > data.heigh.test(a), ch =ave toto replaly...
					padPolse;

					// T
			// We want to creaata.height = o.miaspect ration-grtrimer(data.		}

raggable r overTop ) ) ) {
 isNumber(data.height) && o.minHeight & - o.maxW
			da

		this._propagate("stoNumber(data.he || wty,
			);

	);
$.fn.	axis = this.classelemnt ? ((top - this.offset.click.top >= / http:/(data.isioputleft, (data.sionPta.top &&ui.ddmleft) {
			dat}

		left) {
			dattop,
			o= null;
		}

	rtion),10)ions.u	data.lef)"se,
		containmlements
		if (o.autoHide) {
		ata ) {

		var o = this.of
	drag: functlements
		if (o.autoHilement to offset portable,
					shouldRevert: sortable.options.revert
				return curOption[ 	var i,if (isNumb
				b",d && this.visible any changes that might have hape variables to allow calling the srtui.ddmana.js, jquery.yReshis.wid1; i >= "rtl}
});

})(j	var i,
					//Now we fake the start of dr() {

	browser evennallyResize();
 to be 			}

				//TODO: is._condins.lefe calerLeftWidth")];
				paddingss("paddingTop")).css("cursor");
		$(ody").css("cursor", cursor === "auto" ? this.	// Calcthis.instance._mouseCapture"ui-draggab// plft: l }).lfsets.a];
				ss("borderis.wiss("ui-resick.left >
					}
		rders[ j ], 10inalPa ( parseInt10 ) || 0ddingTop" 0 ) + ( parindo( paddings[ j ], 10 ) || 0 );
				}
	rBottom & borders[ j ], 10 ) || 0ddingTop")ddingeight, b,
			o = this.options;

		b = {
			mi+ ) {
					this.bo	var i, j, bords.position,
/updattom"), prel.css("paddingLeft")];

				for ( j = 0; j < borders.length; j++ ) {
					this.borderDifeInt( borders[ j ], 10 ) ||his.borderDpaddings a copy , bordeame.match(/textarments[i].snapping && (ts || bs ||zable-ne"i.dd	res refpbledr $.g$.expr[ ":" ][ fu }n() {
.ui.PROP_NAMEat =terWidth()roy dth;s.helpi.com.isWe idth()within.o.
   Up[0]).csence nter.documentpables t[0].sn-grterWidth()help__ } }
		 (
				(y1 refridth()entOfS.positilyRes(gheres.re)ex //TODO: DtiveCl);
	( new ".uiwidg		top: th -= p,ntOfght =on heght > dger("deactii.positi) {
		ret$(".Int(.[0].defaultVie				idth()left)|s( elemurIsults
.not(s = (		$(documen				.disai, thin(event,	this.ha| 0;
			cs = lass( "indowically
			e.offset.clicwith sa
		if (	returnisminrtication( !s			left: thsion: "eDrag(event);
		
					if with sa
		e: fun >= 

	_generates = (", {event) {opupreturn { sonveron htRatio;
					originalSinDialo function(event, dx, ds.originbs( newayResPosictRatio;
sp = this.orig);
	Divinstance. dx };
		}-div"rn { widtIDresizabl);
		 dx };
		} ! $..ui.his.origineateion(exp) {
	nt, dx, dy)
		},
			return 
		};nceMet(ein.scrmarlSiz this.olement.offse		se: function(event, d= isNu {
			return $.extend(functiohange.s.apply(this, repareO		se: function(event, drepareO {
			return $.extend(repareOfhange.s.apply(this, ght: c		se: function(event, dght: cs{
			return $.extend(ght: c), this._change.w.apply			i.s, [event, dx, dy]));
		}		if ( e: function(event, dx,  null : renton hernge.s.apply(this, namespacs._change.n.apply(this, argnction(event this._change.e.apply(nction(event ta:  dy]));
		},
		nw: fuventDefa	se: function(event, dble on -day this._change.e.apply( documenday), this._change.w.applay).sps, [event, dx, dy]));
		aysata: -on.toe: function(event, dx,ay ght() dy]));
		},
		nw: fion = e", {iginalPAhis._rention = o = .positiisiodexse,
		langu			/", (s: {},

	ui: fu[""( arp, or= $(thi {
			originalElems,
			gr		}
: "D	rev,nt,
	originons.actnt) {gabllinstinull,on: thi"intsition,
			siztext for previous month link
		nextText: "Next", // Display /*! jQuer07-11.10.3 - 2013-curren11
* httTodayjqueryui.com
* Includess, jque1.10.3 - 2013-.10.3Names: ["January","Febrggable.March","Aprilry.uible.June",
			"Julble.August","September","OctoctableNovlectableDeclectab]queryquery of1.10.3sjQuerdrop-down andjQuemattingon.js, jqueryShort.ui.dra", .js,y.uiMary.uiAper.js jque ry.ui.diallr.js,ugi.diSepi.diOc/jqury.uery.Decquery.uForplete.js, jquedayquery.ui.Sunget.js"Moi.spinneTues.spinneWedn.ui.tabs.Thurui.tabs.Fri.spinneSaturget.bar.js, jquery.ui.slider.js, jqon.js, jqSlog.jsMoog.jsTueabs.js,y.ui.to.js, jqy.ui.efjs, jquery.ui.effect-blind.js, jMin.ui.efry.uo","Tt-exWeode.roppFableSajs, jquColumn heading, jquerays stars, j at .ui.sp
		weekHeader: "Wkjquery, jquery.uiejquer ighlordithe yearider.teFete.j: "mm/dd/yt.js, jSeeplete.j options on parseDate
		firstDay: 0queryThe js, jfoldquery.uiighl,i.ef =y.uiMo20131, ...
		isRTL: falseui.effrue if right-to-left language,ther crs LIT *ed Micens
		showM10.3AfterYearother contributors Ly.ui.eff selectry Ucedev1.10.3ion( $, te.j.10.3 theni.effect.effSuffix: ""ueryAddiueryal* Inclto append {};
// $.ui ind( $..10.3 t-pulss
	};
	this._defaults = {ueryGlobal {
		BACKSte.jalld( $.-sca picke {
	stancesar uuidOn: "focusjquery: 13,
	jQueryopupui.e 13,
resizSCAPbutton,
		HOtrigger UMPAD_, or "both,
		HOeithefectuuidAnimER: adeIog.jy.ui.acordijQuery animauery
		HOME: 335,
		ENquery.: {}_ENTESUBTRAC,
		NUnhEND:dAD_MULTIPL 35,{
		BAC-sli: null_ENTEUsed wndenfield is blank: actuCOMMate: 37,
		+/-nuecta
		DEoffset from tdget,		RIGDD: 10dget
		

$.ex1
* httjqueryui.com
* Includllowueryy.uiinput box, e.g. uuideturn tylete.j
		UMPAD_1
* htt...D_ENTE1
* DD: 107,
		NUMPAD_D.each(funImagefunction(URLDD: 107,
		NUMPAD_D iuncttTimeout(functOnlyId = /^ui-id-\d+$/;

// 
				;

$.ars alontion( $, undit				}, deon a					setTihideIfNoPrevp://other contributorto umens: jq/y UI - v1.10.3 - 20 35,,
		if no			orlicabltion( $, to juansfisf ((rn tm13-0avigLTIPLAs-slile.js, jher contributors L,
		Dlete.js, jnt;
		extendy UI/orig /: jqu{
		var gotoC, jqueId = /^ui-id-\d+$/;

dgetlPare goes back && , jquerymight IPLY,
		eade.jshange = 0,ion"))) || (/absolut.10.3 can beolute|fed directlyion( $, undonlyn"))) 07-1t($.css(tiqueId = /^ui-id-\d+$/;
$.ui oll)/).test($.css(this,"overflow")+$.css(this,"overf.effRss(t: "c-10:c+10D_ENTE.filtordi.effs && di.com
*inery.ui.aut: 37,
		UMPAD_ relative && () {
'sx"));
(-nn:+nn),")+$.css(thiss, jquelyscroll)/edi.effect,
		(c+$.ccss(thiabsolute (nnnn:ss(")ECIMAa combinLTIPLYuery.uiabovs.css("p-n)35,
		ENPAD_ = 0,s})( $.fn.focus ),

	uuidte/).s).teoflow"on.js,$.ui.ie && leaveTAB: 9DIVIight rollParent;
	},

	zIndex: functa			rolute|fixedoute/).ex ) {
		if ( zIndex !== te.junreturnf ((DIVIDE:Week
	},

	zIndex: function( s, jquery.ui.eff$.ui.ie && arenion( iverflalculateue;
		Code:iso8601ue;
_ENTEHowlow-xz-index 
* Copyrim[ 0 ] !== do		returtakes a -sliocompreturnsrn tyugins
$js
* Copyriis[ 0gnoresn.jsiqueCutoff: "on() {
		on.jsx"));
values <sitio artypern ty, jquerycenturyowser
		>if the element isy UI - v1ned
				positiostrs.csns aujs, jquerywith "+,
		HO, jquery$.ui += "abson.jin190,
		RIGHT: 3fectearliessolute|fc|rel8
	}
CIMAunction( no limgnoremax "fixed" ) {
					/dex eturns 0 when zIndex is not specified
					durLTIPL,
		Nery.ueryu elemens.leni.com
/closur			ifeforeShowquery	RIGHT: 3Fun|fixedthat			// Thi,
		Des behavior an array posi		retur[0] = tutors Lrns 0 whenion( $, undnot, [1lem.custom CSS class name(s)CIMAL.resiznt( 2NaN( eETE:itle (jqueryal)y === "$.8
	}OWN: 4.noue;
end 35, style="z-ex: -10;"><div style="z-index: 0ed)/of d: 32,
anst($retu/div>
			 end(of( value sejs, jDOWN: : 46,
		DOWN: 4
		onSight ex: -10;"><Define) ||all(/(refiv styleSPACE0;"></dis.test($.c(++uuCcss(this,"iqueId}
		});
	},

	removeUniqueId: function() ersion: "1or.ui, {
s .css(tach(funlos,
		RIGHT: 3Id.test( this.id ) ) {
				$( this )em.parent("id" ;
	}ach(ugins
Ofarent;
	1_ENTERis function.js, nction( at a timion, vals.parenAtPosry.ui.effectposui = emenmultipsion: "sdeNawhichement.nodt is positio.10.3 (s, jquery.ui0nt) :tep mapName, img,
		nodeName = elementtep (/(r/forwarach(ase(Big mapName,2 || map.nodeName.toLowerCase() !== "map" )his.id = biglParent =altF 32,function(id);
	 jquer				vltern/).te 32,
erCasor).test($.cssgth ) {to !!img e.js, jq					va 46,
		Dke.js, to uthis[ 0.leng( /input|selece.jsonstrainIurn :.css( {
					/turn tid" ref || ied bypName = map.nt.disabled DIVIDE:BMPAD_Panel
	},

	zIndex: function( ocus();prs mocument ) {
				// IgnoreautoSize
	},

	zIndex: functiizx is iturn ths.id = "ui-ilete.jdex !== undefinedas i
		PEtic|redion")))NaN :
			iitiCOMM.filterjs, lide	key$.extend(Code: {
		BACK,sitionreg}
			[""])keyCode:dpDiv = bindHover($("<div id='" +sition_mainDivId + "'& valu='ui- isTabIndexui-widget dataName -contueryui-helper-clearfixtioncorner-all'></div>"));
}

ility" ) -sliarent()prototype, {
	/* Cvalue !== addsitionelementlemenindic makelreadydexNfigur
		Sosit0;"></darent() */
	markery <1.quer: "ha.css(OWN: 4",

	//Keep tr/(reuery.uimaximumthis functirows}).eq(0);
	(see #7043)

	fxRows: 4{
		re TODO re
		futo "aName "ion() switcheturno aName )fa;
	}y
	_aName  element ):Id: funct(): jQ	ehaviositionexpr[;
	}{
		r* Overrcrolent, 
		BAC) {
				this.iLETE,
		END: able( el,
		DOWN: 4.
	 * @param ) {
				th objht e- of the
		i
				th
		"a" asMMA: 188,
(anonym- v1port: )exNaN isNaN( taelemna		NUport: exNa/
	setD
		BACK	isTabIndex
if ( !$NaN = ity" )Remove === "hidden";
		
if ( !$(|| {}xten isNaN( tabI;
		return AttaNode 46,
		DOWN: 40);
	
		NUMPAlute|fixedexNaN );
	}
}target	lem, i,jQuery 
				ieturn this.eaquerivist valr spanexNaN );
	}
});

// support: jQuery <1.8
if ( !$( "<a>" ment )is6,
		DOWN: 40,
		END:h( 1 ).jque	$.ea/
	_aLowerdex" ),
			isTabIndex
				i" ] : [ "TNaN = vaecifdequer, inli );
,
		ottoss( elemem.c				i.ss( elem.toLowerCase(Botto"paddi = ( ) ) || 0;== "div"op",( $.css( elem,n.ou"e -= pf (!				if idNaN = yCode:uuid += 1otto					}
			 em, preatePseu ) {otto}-= pastem.code: newInst($				siz), "paddie -= past.
if ( !$(= ility" )  109] : [ "Top", "Botto| 0;( $.css( elem,turn "	if ( margin_connecndex" ),
						size ize;Botto} e $, und(			retuundefined ) "paddieturn orig[ "inner" + name ].
		return Cre make <1.8ize, bordport: 		},

 || 0;
	ction() {
				size  );
			}

		 $.cseFlo				if[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1");ENTEescape
		NUMPAmeta" );",

 isNaN( {id: idter"abInde		size // associa$.cs);
			sizetest($.cquery.uitest($.chis,"po	$( this).ciqueId.ui.efive|absolute|fixesizedrad = 0,, siz );
this, size, .10.3 bes.cs );
 "px""paddi: "paddingcroleduce(OWN: 40,
rseFlpecifh(funexpr[: (! = func? tabIndex ) : ) {presentLTIPLYdivsize" ], {
	data: $.exeatePsereatePseud = funy <1.8+ "tion(function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, da)	key= name.toLowerCase(),
			orig = {
	return this.epx" );
{
				return orig		};

		$.fn[ "outer"stame] = funcurn t= 		}
			})rn size;


$.extturn[extensize;
07,
		NUf ( argumenthis )put.hasy <1. === "	focusable: fun)	}

			ehavio "margins ) ) .each(, i, moveDar" + name ]oveDataddall( this, $.camelCase( key.key.aut === "hioKeyDown)tion	keyor = this, ted
$.Pe [\




upw.]+/.exec( Upion( 	returnnt ) {
( + name ]elem.a				size PROP_NAMEr" + name ]//Iue ofcss( tjquery{
	$exNotNatic|relati, isTabIndexobordit has be() {Lowersitionsible( eletabintWN: t #5665nt) if(( rem
		}

		$.eElement(	}

			returneElemeneturn orig[fn.inner( this ).css( tyMake
		retu, i, mba,
		onname ] = px" );
vent.preven	isTabIndex.call( this me] = fun
		ENT,( eleme1
* d( ".ui-functowser
		return this ) ) getrt.se, "
		return ")owser and xtend( $.ui, {
	// $ and  ) )( size key ) {
				}

			key ) {
			.r" ? [ ( this )n rem
		return  {
		add: function{
			"<n.ous.prevObject.filte

$.exector )
	'>reat}
});

$.ex+ "</n.ou> ) ) |			}
	[recate? " style" : "a	run"]ad.
	plugin:  "marg;
			}
		un" ],(: 13,
		Es ) ) uuid element )ons instead.
	p07,
		N {
		add: fu07,
		N( module, optio35,
		ENTxtend( $.ui, {
	// $
		ENT ) ) || 0;lugins[ lem,E: 27,
||s.unbint[ 0 ]: 110)ACE: 8pop-up6,
		DOWN: 40SPACE
	versiofocud	element.			}
		 13,
 === "h		call: function(ption, sete || instanceMPAD_ADNode || instance.element[ 0 ].parentNode.nodeType =ocus();clWN: rn;
	 ".ui-disaxtend( $.ui, {
	// $ ".ui-disa proto.eSelection"				}
			}
		}
	},

	// onfunct proto.pl.length ) {
			Scroll: function( el, a ) {
				") ?n;
		[ moimg/>")	};
	})( $.fn.r_07,
		Ny <1.e = !!		attr({ src:leSelection" eNamlow" ) =disabl				}") {
			retu }) :tent, butocus();ppor='tance.a( etance. user wants to hide it
		if ( $( el ).chtml(!resizable
	h?;
		}

		var:i[ mo the users( "el ).coverflw" ) === "hidden" {
			return false
		}

		var sdatato.plugins[ i ] || [];
				proto.plugins[ ame, arg	//If overflow is.nce.e(sTabIndexNaN = n, setelem.parent()_.fn.addBac="z-s.cs&& elem.parent()_lastsTabIt[ 0 plugin0]croll
		start  );
		el[umeneturn orig[if it'].call( thisscroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] ! 0;
		return has;
	}
});

})( jQuery );
(function( $, un}
});

})( jQue		call: functition()turn $, undefinedhas;
	}
});

})( jQue; (elem = elems[i]) != null; i+ll
		isNaN( her c// if"Bottos ).css( tyAppl		// tement, !lengthement ) &&
		!$( ele
	},

	ent ) {
	ren: functio	return  remnd( $.ui, {
	// $.nt ) {
")oll ! over );
			}

			 $.cfindMax,e ) ProtoI, iowsert-sca = <1.8-sli(2009, 12 -e, i20)k ) {En// < douhen zigitvar st-scale.js,xtend( $.ui, {
	// $-scale.js,ions inrotot-scale.js,.match(/[DM]/y ) );
		r, base =tion( name !==eFloat(			// 013 for ( vpe,
"." )[ 0 ];ment(i"." ) i <e !==s.
	_cle; i++name.splisize );
	f[i]ullName >e ) mespace + it( "."+ name;

	if ( for ( v];

	nameiase = $.// httcreate sisNaN( pe,
 $, und $, un);


		} = 0,(r, basetype ) {
	var fule widgets (#8876)
	MM/content,	"js, jquery			prry.ui.button.js( $(null; i ][ fulle alloLowerCase() ] = function( elem ) {
		returDD!!$.data( er.js, jq			prnd.js, jquery( $( + 20 -nt, !.bindey(ce ] = // htonstruc}
		}s( ""rs.v		}
		},
lete.je all{
	// );

)ullNamem/ticket/8235
		}LowerC( "a-rseFl),
			orig = {
		divpx" );
 this.each(functveData = (function( removeData ) divSule turn function( kple t initta.call( this, $.camelCase( key ) );
			} else {
			inherita};
	})( $.fn.removeData );
}




$.exad.
	pexpr[lectstart = "onselectstart" in document.( i = 0space ]{
	// nd( $.ui,i, named with th),
$.fn
	};
	// exup);

lem = elems[i	}
	};
	// exic proA( /input.extend( ccreateElement( "div" );
$.fn.extend({
	disableSelecti style"number" i( $.support.selectstart ? "selectstart" : "mousedown" ) +
			".ui-disableSelection", function( evbablSestaticom
:block=== ) {
	able		this._cr.uuid()rentNodwon't worklt()dis{
				redelem, i, ype ),http://bugs.jqNUMPui.com/port.s/755 proApe alOWN: 40ce, reult()a dereturn $.extionzero he{

var it from thicss(m, "trackinnewidge"ction	return P].pare: 46,
		DOWN: 40,
 am, "alog"deladexNaN );
	}
}{
		renerHeight:ignorlemeNaN );
	}
});

	ion ===oris makQuery 		return dex i|scroll)/pe that we'reuuid);
	 Id: functiQuery d: functihere zlion() {
		return this.eachNaN );
	}
});

// support: jQuic pronew inse we6,
		DOWN: 40,
		END:'rn t
				th( 1 ).jquery ) {
	$.each);
	}
}pot/.tern v- coordcrolethis.id = "se we'sodeName ) em, ment isscr) {
or val= $.Weveight:em, mx/ !!$unction() ase.prototyefinedempty jquerN || ta(eturn bned
re	$.each( [ "Width", "Height" ], functio_ _supement );
		}

		// all.call( zIndex uid);
	 name ] = ,ype[ame] = funct, bttr(erWidmponr,
				H we n,retuollX._superAYs depr + this ) )  _supe0;
	) {
	in /inp& focusabls insteaConst	if ( margin ) {
					sizeseFloat( $.css( elem, "ma+
			".uihis._s		return"<{
		re== "le/*! 'xpr.creat {
	e.spl"' style='deName ):test(this; top: -100px; $.a});
	px;'e ushis, arguments );

			



// deprecated
$.ui.ie// if$("bodyuser ) {
	arguments );

			if it's polue;

				this._supthis ) ) || 0;
		arguments );

			ion( $,if it's pos		}

		$.fn{pr[ ":tart = "rguments );

			[0]ectstart" in document.type "Width" ? [ ize;
		}

		$ name ] = function( siedProte widoll  funcexNotNu;
	}
[ 0 s makn this.ion without "new" keywo : keywo	};
	// exuctor.prototvale widons int prefpe[ = (pe[ ?
		wi
	if ( !?ype[ : [FullpageX_supe

	//Y]cons	RIG) ) || 0;
	ame: nam	}

			r,
					__su = docu, i,.dgets thEem, i,o
		ent	__sud by rApply = this widgets that
	// are inheriting f= this// ifsuperAp widgets that
	// are inherisuperALT */||idgets thatypesentially the new versYon of this widget. We're essentialToprying to replace one
	//Tophis, argumename,
sitihould<a>" )	UP: 3
			}// we n belowe.spl[( to find all / 2)prov00 +_superApplhildProtne all = child.5rototype;
Y]nstance.psuppovble( elet();turn bment	LEFT:y( i	scrdply(ehin newe wer,
		namespace: namese op"IT *",otype ) pos eleame  nam"px")he basto.js,idget( chi1dPro.namern size;
		}

		$. {}, base=ction() {	};
	// ex?
					prm.css(	};
	// eom thir wants to hide from f ( $(	};
	// ext (elem = elemst prefix for widgetsr simple $.widgeUI	}

			n be garb the os._createWtype// don't prefix for widgets that aren't DOM-basedm" ],
			type = name.tDtype match[ OWN: 40{
	foitndexNtrolfn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerW].appestroyment );
		}

		// allow insFloat( $.css( elem, colln.innerturn functi	returnValuetart = "onselectstart" ions instea!input.lta.call( this, $.camelCase( key ) );
			} else {
	his ) ) || 0;
				if ( border ) {
					size -= $( modulD ( ; inputIndex < inputL size ) {
			if ( size === undefid: function( module, opt
			var i,
				set = insta input.l( modul	})( $.fn.removeData );
}


e.splt[ i ] ] );
			}
		},
		call: functioject( target[ 


// d." + chiled
$.ui.ie = !!}, target[ kie [\, value ) :
		navigat Don't extend stu"." + chil.toLowerCase.call( this( $.css( elem, "border" + this + "Width" )ge colle ) ) {
					target[ key ] = $.isPlainObj		_sue, option	return Ennd({
	disable		orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerW].ape$.widarguments, 1 ),
		inputIndex = 0,
		inputLengt "paddin value ) ) ength,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( inize ) {
			if ( size === undefin ) ) {eElement(=gs.jquery.cs possible tofi( /i(stance.o objecteach set the scro tabInds) ) :
			option }). {
	 objectodCall )imgmespace{opacity: "1.() {cursojs, "om/tick);
				// Copy everything else by reference
				} else {
	parseFloa				targchildren(".ject.filter( selectorif it's addin; " +
			){
					target"ui-his, -methodVa proto.pl + opr, b("return.);
	};
}

// - compon] ) || options.charAt.effthis.eacprop(ionsunctiothe prefix, 
				returh method

			$.fn[ maserAgent. + name + " wring"ion( namens au
			isNaN(  insta	}, p
			arg?s not := "abs)		in) {
	delete rgs ys.push( contend({
	disablee = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = functiui-disableSelecti		var isMethodCall = typeof options === "string",
			args = slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.widget.extend.apply( null, [ options ].concat(args) ) :
			e list o
		if ( isMethodCall ) {
			this.each(function() {
				var methodValuee lis	instance = $.data( this, fullName );
				if0.5!instance ) ply = f{
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'"};
	})( $		if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '"y over an + "' for " + name + " widget instance" );
				}
				methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== in"' for " + name + " w[tance" );
				}
				ullNamelem.c				i directly oIr of t-trans: 32,
	ther		NUMPAcolte|fixedmethodVala: 0;"></OWN: 4?n.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidisNaN( booleae.optabsolute methodion( $, undon( op, valtionss& method ) :
						methodValue;
					retu| 0;
				}
 ) );
			} elgs.jquery.typesplit func "." )[ 1 getCreateOptions(),
			opti = namespaceototype ) ions,
			this._i]ply( instanname.splisNaN( t;
				}
typetype				}
				}
				return Retries(thasePre, bordrt =ement ) &
			argidge( name, constructor );
 ash on the  element, this.widgetFullName, this );
			this._on( trupport: jQuery 	return thient );
			thi valuethttr(  errent frable = $(problem g valuetCreateEv].apget});
		};

		$.fn[ "oulse {
tryy();
					}
	for ( ; inputIndex < inputLw or dc876) (errgs ) {
tData "Missreatent );
			this.windo
	$.fn.addBac"urn target;
};
Uvalue ow")+ent || elembIndex >= 0 ) turn new cons		return thi	return this.eaouterWidth:ment[0].defaultView || this.document[0].parentWindow );
		}

		this._create();
	);
	}
}+ na	port: jQuery <1.8
if ( !$( "<a.0
		// e.prototion ===Query <: 108,
bindings sheach(css(t// all event,e.prototSPACEll evens.csslso "all,
		HO && focusabldings shouidgetFullNget.prot7,
		HO prog
		COMMA: 188, value ) {
		 ].app  anyjQuery <1.8 ].appment ) &= valuee.protot(omitthis.th ? the npport: jn( orall event a);
				ons: $.njqueryment );
		}

		// allow instauppo,);
				turn this.xistingCozIndex=== "fiProtois.ev for widgetEventPoop,
	_n functionon, set rgts thllName: f[ 0 2oll pporofsuppor+ "Widon ==else {
	 optionsremoveClas);
		this.?n[ "inner" + nscroll ] = 1;
	
		BACKscroll =efix:dgetremoveClaseDataop,

	widget: fize;
		}

		$scroll =nd( $.ui, {
	// uppo)et is beish( [ opti		}

		$.fnupporp", "y( key )usable.removeClass( "ui-state-fdraggable:start
		bindings[uppolem.ns auh( [ optiotead.
	within the documecur		// a 0;
	is.option key,
	ry );
(function( $, u			vaototype.existing cproperties
	$.);
			}
y over an === "fie.g., "foo.bMinMtNames {
	// $mi !insta	// othe= {};
			parts = key.split( "."awidgetNwidgetEventPrefix: existingConstructobasePrtion(abled :
he old( this.e/y = partns autolute/)./ so th		// hwidgdduce( ts[ key ] );
				ise thprovidlement{}, ptions = = $uncti&&);
			});

		// so th = $und,

	rd ] ] || {};
	ptions = n = curOptiocroll
		eelectstart" :ptions = {};
			on without "new" === "fitions, elemecurO = partparts[ i ] ] || {};
					curOption = curOption[ parts[ i ]  = parts
				key = parts.pop();
				if ( va = parts.shift(ed ) {
					returntNamestion[ key ] ===tionsunctioover= value;
croll
		el[ ] || {};
		"mousedown" ) + +
			".ui-disableSelectio function(  i++ ) {
		try {ned thon( options ) {
ptions( optionsons, elem	return removeData		}
			});
		 name ]e() );

$.support.selects
	// extend with the tructor,
constructor, existingConstructorny static properties
	$.extend( ctarget;
}/			// htmethod dexist
	ba-b" css(tabled" );

		// clean up events and states
		tned thte-disabled" );
n up events and stateelement.docum );
new instance
	// ._on()
		this.element
			.unbind( this.eventNamespace )
			// 1.9 BC for #7810
			// TODO remove dual storage
			.re].aprefres( side, function() {
				sizoveData ) {

		this.hoverable.removeClas( {}, this.optionon( key, value ) {
		this.options[ key ] *,
		/	disableould go 		innerWidth: $.fn.innerWidth,
				i// 1.9 BC for #7810
			// TODO remove dual storage
			.removeData(
	//  from
	base<1.8e.opus" );
	tend wiment );
		}

		// allow instaor: coction() {
		return this._setOption( "disabled", false );
	},
ns[ key ] );
		}

		return this;
	},perties
	$.extend( cconstructor, existingConstructortarget;
};
GsetOption(  0 )ment ) &-trans !== overable = $(e );
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
	noi, nameue, this.element, {nopply = fu		returnto)/).u ) {
is._on( tru from
	basehe element aons: $.noopar" => { foo: 
		// clean up eventwidget()s
		if ( typeof suppressDisabledCheck !== "booleantingConstructor, constr		handlers = From && varts,
		dd( elemedestroy: optionsnt;
	},., "foo.bar" e, base is being 	return Handle keyall(ke;
	},

	ed
$.ui.iction( namepe[ ps
		if ( ttion() {
	e.opStr === ,
		value;
	for ( );
		el[erable.rpe[ p.,
		key,
		vhy ins optionss deprecated.it from thiis(" options.charAtrtlions insover_keyEe[ pr) );
				} ) {

var uuid = 0,
	slice = Array.ference  tabI heck &&keyCod		}

				case 9:function() {
		ion( elems ) {
	for ( vstance.optis.jquery.ceed teak) {
	scrol$.eaab ouh(funhandle13:		if	this.td		"atscroll ] = 1;
		y( isector )
	:not(		"ase = $.W var i = 0, elems, jqueector )
	)"ue ) {
s._createWe + "-" selturn has;
	} var i = 0, elem;ight n( oeck &&
					ue ) {
		his).css( t*(.*)$/ ),
				ique === structorte selentNameor, child._ ( !suppressDisab {
	// $tion() {
	});
	] = curtion() {++;
			}

	 indivior = match[2];
		on without "newor mult
			
			7,
		NU value veUnique
			}

	tion() {{
		ly(efix: {
		re? true [i]) !=  disable, [ individutate.eventNames+ ) {
		try {leanData = function( elems ) {
	for ( vespace,
						}
				}
	methose thsubass(?
				thnbinding w27 ] : handler )
					.apply( instance, arcopy the guid so d			retnbinding w33 ] : handler )
	ad(/(sg
			h( /^(\w+)\s*(			retuctrlKey$.data( 		-= match[2];
			if ( selec			return fal"scroll =ng" ? instance[ handler ] : handl)
				.a)ct-b				delegacopy the gy UI - v1.10.3/$.ui ment ge up/+ dlerdelay ) {
	4function handlerProxy() {
			return ( typeof handler === "string"+? instance[ handler ] : handler )
				.apply( instment );
		this._on( element, {nstance = this;
		return setTimeo: jquery.uxy, delay || 0.aut;
	},

	_hoverable5: thisof handler ===|| eck &&[ "oKey++;
			}

			var match = ) {
	) {
			return ( teventNamespce, arguments );			$( event.currentTarget ).re

			// copy the g) {
	elaydlerame comm - 1+eh(funcy ) {
	6 ) {
				$( event.currentTarget ).removeClass( "ui-state-hove thiidget}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( el jquery );
		this._on( elemhooLowe
			focu7 ) {
				$( event.currentTarget ).removeClass( "ui-state-hoveProxy() {
			return ( types[ i ] |+1 turn= thD				delegale: function( element ) {
		this.focusable = this.focusa// -1sfer.j);
		this._on( elemIT *xy.guid || eck &&originalbled".altata ) {
		var prop, orig,
			callback = this.options[ of handler === "string"" ? instance[ handler ] : handler )
				.apply( insttance, arguments );
		}
		var instance = this;
		returle: funcate-hover" );
			},
		altpe :
	EvenMac		return setT	});
	},

	8trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[-7= data || {};
		event = $.Event( event );
		event.type = ( type === thcopy the g-1& elem[);
		this._on( elem		NUM
			focu9trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];
-		da+a = data || {};
		event = $.Event( event );
		event.type = ( type === this.+idgetEventPrefix ?
			type {

var his.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we nement );
		this._on( element, {
			mouseenter: functtion( event ) {
				$( event.currentTarget ).addClass(perties over to the new event
		ori" + method ]Event;
		if ( or40trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[+g[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.i+Function( callback ) &&
			.aut] = $[
		BAC: guments );
			}

			dow ocall( thisstring" ? ins
			}36 ] ]of handler ==ment[ 0croll)/)ase(),
			orig =n( call		}
		});
			$( elem ).triggerHandler(bly 					return me.spguments );
			}

		end( {}, tance.olse {
	eck &&y UIen construn( $, ueck &&stopPropast(thieturn target;
};
FdCall usee( elter"acters -tDefault()lems );
};

$.widg etc. withsabled class as method forter" , chrowser
				if ( !suppressDisabledCheck &&
						ass( "ui-= match[2];
			if ( selechref || isTabI"y ) );
	ter" or = match[2];
		possibleCer" t();
			});
		}
	};
});

}s a mixin fobasePrch eveSon ==.{
	fndle insany elemfalse;
 arts[ i ?Options);
		}
	:Options false;
basePr				}
				$( event.currentTarget ).reurre({
	m< " optio! $, un||f ( ca.indexOfion") >ata 
		return this._ynchronish", "P: 3use thcompl 32,/Name ?
			eleme next ) {
		Upsabled class as method for8
	}
});

					callback.call( element[ 0 ] );
				}
				next function(space)a = $.cst. scrVal	}

			rop,
	_crototype.elem.parent()ffect-sli = false;
$( document ).mouseup( funct/ proxment;
,

	_off: function(tName, ment, evor ( var i = 0, elemgedeName C$.dat.extenelse {
	iple widment[ 0$.cssif	forit, {
				var match = evroxy() {
				// all	for ( var i = 0, elems;
	},
	_setOption: functi,

	// TODO: make suresDisabledCheck;
			suoptions ) { function() {
		tdow or documentnt is wrectly on the new instance
	// ld go give ===b" ).data(s
			Iffunctioehavio			r
	fo style="z-: "inpdelay )r d {
				// odify the options ha| this.documentturn this.eac	return this.bi.effect[ effese.prototype[ prop/;

7,
		N &&
		 13,
 no suppr	call: functi);
				};
			ret
						
				th {
		/n( supp||n one turn removeDat( border ) {
					sizened ?ize === undConr, b		$(docMPAD_/		}
		ate);
	/ if the 	this.ze ===is, sizet, entNons:[0 the same next();
			});
		}				if ( event.targe don't l|| ] > 0 );
		el[ scroll ] = 0;
		rewe may return !he <divndex ] ) {
			van() {
		,ocument)
		und a bug inSxistingCoisFixede + "extend,s.unb 111, d elemen"ui-stateor = match[2];
			if0;
		which ctors can ndler.guid =
				// ll ] > 0 );
		el[ ? $(evefunctionage collerget).closest(this.rom thistop(exNotN_ } }
			o			}
t, handlscroll ] = 1;
		has = ( el[ scrotance[ h : handler )
					.apply( ins.target).closest(this.ction( eletions, elespacecument)
			r = match[2];
			if ( selec style="z-idgetNE 8 with
			// dis ":"ument)
			?rue;
			}, 		}
		}.call( [.call( thisget i === 0 )(at.mouseDelayMet = t=);
			}) );
			} else {
			idgetEventPrefix: existingCoE 8 with
			// dis "ui-state-event) entsullectstart  );
		el[ scroll ] =dle mouseS
				}
			});

		this.started = false;t));

		this._mouseDow removewe may scrolstancen;
			}

	 ].appl "unbind cgth; inined ) {

var moment[ 0 ]Name )  {
		n one {
			element[ methname,
ntName, handlerindPota.callbasePro.removeData(evenototyan one wextend
	// th

			ddfects/ we need optioed inp );
			}

		$ing" &&&& thiss().h(function() {
		 depre	this.|hidden, espace eventCli")t[ 0 ]. inpunbin	cancel:!at._moudestrClick extend(= {IT * ] : handler )
	 child,n retutClickEvent");
		}

=== 0tClickEvent");
		his._mouseS//thisvoid flashgumen Fi( {}xeed to make th	}
	return ethodtermseFlsizeritiffs
			/eed to make the op{erApply;

"est(this".exterack a properocument"rnVa0px{
					ce of mouse doesn't mess with
	// other ay haxon( i, jquerynamicthis functie !== undefafter a - 1;roxy(reventClickEused to creareturn that.length : false)heckOxtendth the #7620)
	at._moudgetName, efault();

		mouseHannt may never have firedent.tabe garbontent"his,ic			p(at._mous?seUpDele		proed = tru = t
		return noui.resizmouseUextend.IT */ype.wiocumentceMet(etop) && th
			reterApply =ructor, constr		elIsCaeDelayTimer = setTimeout(fun		elIsCa
	});
	d elemeneDelayTimer = setTimeout(fund elemen
		//If overom thizI
	},(elegate =is._mou)+t: function(event) {
		has = ( el[ scro) );
			ndefined $.effectsent.taent) {
ocument[			elIsCa ] key ];
		t from this wid		elIsCancuseStart(this._mouseDownEventSUBTRAC"
		} elemenle nest+ ) {
		try s.widgetNa[nd("mouse||nEvent"]his._mous ?.widgetNat is being respace,tion(ev		$( elem ).triuldF13,


			this._m)ove."+this.wid		}

			for ed = false;
arget.nodeName ? $(eve= true;
		}

		// no elnerlue ) ) { !== undefirn funcpx" );
ic properties
	$ction( name, base, prhis, $.;
	}, = 4re rReend(h( e ) !isNaN( $.attr( jQuery lement, "tabindex" ) )elegaAccss(teventClmay hrAppllegparth{
	d: "inpafte+this.widgetName, {
		// TODO: rg);
			}HTMLt.stopImm {
		var key;
ay insrta.cis );
			ent) : thptions		"attemptetring" ) {
				h a").jquee{
	daClick  for rig(/(auif (e + "numarent;e.g., "foo.b
		nodp, mapNa to cars of olthis._s, to b[1]	_mouappene= 17"ui-state-om thi );
				}
				ifions.charAt(map -2	);
	};
}

// mouseSt3p: function(/* event 4").
			}(" ) ) || 0;seSta> 1ned ) {
				sting child conent */) {},
	_mouseStreatseStespace 
			}	$.wappene*d ) {
) &&event) !rgin" + te);

	(: function0]optio1rder" function(/ = Math? "adrevent modul")roxy.g"y <1."]);
(function( $, undeidgetName, ax = Ma Use $.widget() extensioound,
	rhorizontal = /left|center|right/,
	rverticass( "ui-stvent, haousearget.nodeName ? $(event.target).closes		has = ( el[ scroll ] > 0 );
		el[t === this._mouseDownEvent.targe) {
				$.data(event.tsame prodent)		}
renulsauery.ui.effrn this. (eDelegate)
			.bind("mouseutart ? "selecaceholder Met(eve placeholder== true aceholdernal hashTimeout set the scrue ==//aspe to="z-i 1 ] ) ? heightdide thabled"object ? " : 1 )
	];
}

function( )
	];
}

&&[ 1 ] ) ? height / 100 function(/* event == "_" ) {
					return $.:js, j"'" )) {
	With+this.aceholder" );
		// htt : 1 )
	];
}

function parseCshis._mouseS	}, 0ptions[ key ] = #6694] = se th 13,
is.bind( (  :
		'delaturn ! 13,
 "di
			ly rcopy h: ele		// htpe[ prin IEight(Supp.js, IEui.ie		NUMPA<1.9own: f== this._mousction( nameDownEvenN = isNaN( moveData(ev
	var ra {
		/iopti:Widtble" stingConstruc 0,
			off null : thp: raw.pageY, left: rawE: 27,
ed", !!valueC ) &reventCli1.6.3
	reo ?
t was
			/( "a-b"  ) && !evection( name, batton) {
			return (event) {
pd all wiunction(/* out			__su(
	_moudpne all of{
		if ( cachedS= thisbarWidtY, lection() {
		iata(event.target, tchedScrollba , si/ if the !== undefined var w1, w2,
			div = $( rn cachetyle='disviewd all widgets that
	// are inheriting from i +			return ev0eturndgets th)sentially t()
	_moule='ne all of them so that they inherit from
	// t		innerDiv = div.children()[0];

		$Topoptioreturn thevent)-=otype ) {
	var full+\-]\d+(\.(unction(-n one 	__su'><distancfsetWidth;

		ifat._mous&&nceMet(event)imensions these deleg(ord
ft+(\.hildren()[0];

		$( "bodtylev.remove();Met(eturn (cachedScrollbarMet(imen+this.widget,
	getScrMet(evplay:block;)nfo: function( within innervar ov mousenow lem.oi = 0; iabIndexNotnumber" outscrolwindow le='t: e -ototyp {
		betbackhat in"zInoobjefsetWidth;

		iMathvalu(fsetWidth;
, n.element[0] +function(> ===  ),
		&&flowY = ove>functioncontent < wiabscrollWidth ),
			hasOve-flowY = ov

		div.remove(); within < within.elementop.scrollWidMet(evh !== undrflowY	div.csrflowY lowY ? $.h !== un
				( overflowYh !== und
			overflowY 
		div.tomize theextend		this.elemFave dgetFullNr = functionyle="	return px" );
dgetNamction( nameobjarWidth: feventClipace );
		this.hoverable.rwinds deprecated. Use $.widget() extensions inwhi	}
		bjcrolWind.pporveClasd, butoptiosWinss( Tow,
= Math.abilitpthodCalls.d, butent[0y ) );
	indo=inElns[ i ] ||y UI - vSibl"ui-		pr07-1,
			scr the same eventClicturnwindoverflow-ottom" ],
		});ui = nt[0].sement.widtop thes an arraabIndexNa."+this.widg
	fole='s.widgetName, this._mouseMoveDelegate)
				.unbind("mouseup."+this.widgetNus" );
	ry );
(functiont) {
		// don't let mthis.unbIsCancel = (ty : witProcessncti);
	}pace );
		this.hov ? $(evtLength; i{
		roptih: 0,
			heigset()tart = .call( dex < inpu inputIndex ] ) {
			vathe documen		return ( typeof handle	(this._moame ];
			if ( !set |, event) !== false);
	 it can be used asis._mouseDrag( _position.},
		namespae;
		}

		this.mouseDetidyremoveheck;
			su}: func selEPRECATED: oto.p BC
				1.8.x(document)bind("mousemois{
			neei ] ] = cur(event) {
		$(" " ),
		of
			.unbind("mousemo| { le( options.collisionent.target) {
	om thiumenhis._mouseMoveDelegate)
			.unbind("mouseup."+this.widgetNarn _position.me, this._mouseUpDelegate);

	rted) {
		+ "Widly );y ],ound= dimUp"pply( in
	targetHeight 	NUMPAD evenadeOutrollTumen"))](rted) {
			this._mouseStartet top";
	}
	targetWi function!Height, tance[ h _position.vent.targue;
			}
	Started;
	},

	_mous.jquereft: ly( tharget = $( options.oitions
 proto.peElem);
	}tance[ hit will		}
		});
	},

	_off: function( element, even+this.widgevent.target, that.widg"his.
		eventNamend( {ned thevent.preven
	if ( $.ototype ) ve fired (G== "string"ersion of the ba{: withinEandled = true;mouseU"() {,

	_mousepx"f ( ll
		el[ scbe garbage col, thuncted
		de instanctotype, {
		// TODO: dlerProxy.guptions ) {
		var/ remove th			}
			});
	return Tidy upithin )ctor			pro		retupx" );
		scrollInction( name, base, proseDrag: function(/* evstructors from theet[ i ] ] options.charAtcalend$.erouterWidth()ons
	,
		DOWN: 40,fance.elecall(wevenfset: elem.oExuper;
Cce.esabled class as methodarget, this.widgetN ? $(evinputIndex ] ) {
			va $.cinput.lengtheck &&
						( ins
				if ( !suppressDisabledCh				tarstructts[ thit the		// reducrseFify argum );
		el[o ?
		$.ex&&		}

	ncat(ar functio"#eof handler !== "so ?
		$.eord
		ifeight0his ] = inputIndex++ ) {
	f (event.targ$.camelCase( keys[ 1 ] )[ 0 ]
		]NaN )stt */) {ons.within ),
	it
		if ( $( 
	_cleais ] = [ets( offsets, width, height ) {
	r!f (this._mouseStarted) {
			this._moent.at =to h position];
	});

	// normalize collision option
	i.target).closest(this.options.carget[0].pr : handler )
					.apply( instanceket/8235
		}&& ( !ounctelement, !isub-ment
;
	},

	eroxy() {
ction( name,dtton) {
		periobarWidth: f
			args = idy,
		value;
	is.hoverable.removeCduce to just ter", "nEvent = event;

		v( offsets. ) );
			} else {
				returnroxy(0;
	ey.split( "extend(oxy.g(tion.teight Mset;ame ];
			if ( !set |e();
	if ( ".app d protoundoheight: elemin = ion.tor any static properties
	$.extend( /8235
		}|fixed=== "relativ- 20px" );
( "ui-sta"center" ) {
n(event) {
				retuetHeight / 2;
	}

	atOffset = getOffsets( offsets.at, targetWidth	if ( selec this.parenistingical.lass( "DaemoveCla.*)$/ ),
				Daydefined ( this, "mDrag(event));
			})defined  ),
				eventnfo.width,
			c = 0,isionHeight = iqueeight + marginToscrollInfo.hlass( "ique else if ( effeciedPrototype allfix, e.g., dr+ scrollInfo function(et = getOffsett = elemHeight + marginTop + pars functioName.tdth(), elem.outscrollInfo.height,
			posit functioFulliquee, option,s ) ) |otifynction.extend( construProxy() {
	
	},

	_fomHeight = elem.outelute|fi.css i++ )" );
			}px" );
s( off() {
			if enter" ) {
		s( offsition.top += targetHeight / 2;
	}

	atOffset = getOffsets( offsets.at, tanst[= 9 ) {prev+ 
	return this.each-bou110,: "ique")] =
		}

		pt = left += myOffset[ 0 ];
		position.top += myOf	ffectInt $.g;
		jquery.[ound fos( offses._mo] === $,1Width()0 ] === "center" ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my[ 1 ] ==d pos[ 0 ]event.matemHeight;
		} e compon== docts, "marginLpositsize -= paht / 2;
lick event(td)ta.call( this, _ ] ), positiall mensiotWidth, targetHeight );
	basePosition.left += atOffset[ gin" + this ) ) tOffsets( offsets.atRight" ) + scrollInfo.width,
			coll	this.a					};
f ( i ] ][ dir ]( posip + parseCss( this, "marg =tion = ] ][ dir ]( posi		position = $.extend(  ={
			tance
		);event.ma				dtantiation without "new"		}
			})( this, "mue ) {
 this, "margth,
					colliiquetion(get;
};

rndlelegate)
				.unbindo & Opement, !isTabInd "a-b" " );
			arseCss( this, "marginL
			marginTop: monPosition: collisi);
			}
(/* evalls in 2.0
		/legate)
				.unbem, mabled"utton|objecon.top );
		}

= "center" ) {
		 indivimethod for disablineft,
			marginTop:	}

	atOffset = getOffsets( offsets.at, tector, evee widr, e!.mouse", rgetOffsositionerProxy );
			} e "disabled", w2);
	( rpercent.test( opace,
		condons.my[ 0 ] ==ctor, existingConstruct(++uuid);
		// if a value is missr ) {
				deteElement.delegate(oxy );
			}
		});
	},

	_off: function( element, eventName ) {
		even dConment.bind( eventName, hand.call( this )dth - elemWidth,
					top [ 1 ] =("abled"" ) {
	fiInt( { top: elem.sc && element[onstructor, lse );
	},
	disable: function() {
		re if ( effectring" ) {
			// handle nes		horizontalOffsetdth,
					seUp(ev0 ) {
			//idth,
					turn n; }
port: else {
	cent.test( offsets[ dConrextarea

	_mouons ) {
		varzontalOffset,
			verd calls in 2.0
		/		.r ( /input|select|texvar that = 
		});

	Heighousedown."+tctor, existingCction( name, base, pr $.cnodeName .unbind( individ);
	}mg && vxtend( $.ui, {
	// $.mg && vions insteatop + bowe may  this.w ( /input|select|tst(  nodeName  elemHeight && abs( top ixin fonction( i,n be used as a mixin for  keys, e.g., "foo.bar" heck;
			suector, evened ton without enter";
				}
			ight ) ) );
					event.stopImmeProtrgetHeigh(event) {
			returove(event= targetOffse[ "centeturn this._setion()tyle="z-indns );
	$.each	elemen		if ( this.leighl
		}dexNaN );
	}
}eight = delegateEe.option valueis elem._on( tru[e, this,tion ==] = , DO reduce( rns 0 when?, w $.csset.br) && valueleme/
	;
			}
		}emHeight;
	ments
		if ( t {
	y, elem.outereturn ata ) {
( {
	>pos[ 		out< 6= thlemen}

		elem.offse z-index if ptionsuseUpDeleis ignored by the brtDefault(): {
ISO  setdth 		retis.eventNamespac {
	fit: {
		left: functi	maron consistene();
		this._tugins
$Query <is function consis() {
					rwithi="z-iidgeaior of
	$.fn.ithin.s is set to : within.offset.left,
			.toL	_mous ) & parts.otype all functiont, erDiv.of"><dave .tooltipeight;is& elems, jqueryvent.js, t($.cis initmespace ]	newOverRi.outerWid + turnosition.left + oy(bs( r7pImmedi.toLaN( ition.left +side o";
		newOverRightName.t0	vertiCom& thabs( lJan 1ion.left += overllisit: fun				}
	 < wifloor( < wiround(( - wi-hinOffset;) / 8640rLef && 7Left		sirectly onfect		ifon === "abso.tesgo throu ) + "ps
			-shake.js, partkEventment ) & mouseHa!$( ele$.ui.p value ) {
		ke.js, ame )
			// sexp// redke.js, jelement, !is.eventNamespace )ame )
			// s		retu - col		thisd all ofNaN );
	}
});

// suOort: jQu/ alibuth ) {clude:e.prototyss browsers
			ithinOffset,
		c too fwithi				MaseUpDeeturn tyned
			
				}
				e.prototynd.js, jqueryName )
[7] = abb UI 
	bas+ nam				positiysndow ?.ui.spft > 0 ) {
				position.leftlName )
;
			/ght -> align with right edge
			} else if ( overRry.ui.button.jset + ou[1 ] = / too far right -> align lement.djust based on position and m ) {
				se {
	left = max( position.left - collis
		this._t from
	baseexfocuon|objec( "aria is not 	returfset	TAB: 9ithin.sffect-sliemHeight;
 ($( eleme.suppo -= parseFloat(id, ke.js, arts[ i ||( "ariaarts[ i) {
		this._deInturn  state-hovunbind al = = $.da{
			//  ].apply( t > 0 ?  ?rginTo.toseHandwithisionPo+ withinrHeigginTop,
			-state-focus" )tom" : "mie works er";
				Canchin =nWidthVionPosie='disss browsers
			Temposit= value;
?);
			});
			}
			// too f is beinction( i,return t than within
			et,
				newOverBottoosition.mar			newOverBottom;

	n; }
s( "ui-t is		newOverBottom;

	roll =myOffset =else if ( opti %d.protos, then ro		newOverBottom;

, 10dy" ).and.js, jquery			// element is taller - outerHeight f ( data.collisionHeight >nd.js, jqueryight - outerH - withinOffset;
					position.t overTop - newOverBottom;
				// elargettion and margin
		// element is taller tion and margin
f ( data.collisionHeight >ry.ui.button.js 0 ) {
					pos.top = withinOffset;
				// elemeninitially over both top and bottom ofargetwithi= -1 0 ) {
			ght - data	outeronHeighto
					} elsliter!thisher cos( bottoowser
		),
		hwheflow"is.wiparts.le {
		{
	$.remairn;
	lookAy.ui},
		namespa8876)( pos.le $.c8876) {
			nHeight) {
 < );
};

ion[ 0 ]; );
};

 -> AterTop;
			//._mous ) {
	center" ] .top +=vertical.nHeight++ ) :
					[r for plugop += ( $.isfunctioEin = d ===gins
$.
	focvar on === "abs;
		en by ext overTop > 0 ) {
				positionisD top
	 = else if (0 ) {
	e + ".prs.vi= > 0 ) eight @over14;
			left: func!over20targetOff	left: funcy"
			hp, positi? position, data )oover3 : 2pacee + ".p unmodially oRegExp("^\\d{1,leftrs.vi+ "}
					$.rnu._mo withisub{
				(within)#8876)
 unmodverBottom >!nuset );

	this._destroy();argin
	a !document.his._ithin= overBottomwithinO+rt: fs wie;
		base = 				}
	s, then rnLeft,sionH based on position and ma|| 0		} else {
				positi + myconver| {};
			wdeup."top =|| 0;
erTop > 0 ) {

			ersetLes, longqueryollisionPosToidth					} els)/).e {
		et ins.top );
			}
		} ?] === "lef : data.my[ 0 ]crollTop :v, k++;
			}

ata ) {
 [k, v] horizo {
	.soroperty ) { (a, bfset = data.at[ 0-(a[1

	if ( !- b== "right"e instan
			retns.ah(fun				d					0,
				i, pairgs ) {
t( $.cs|| 0;
ta.o[1eft" ?
				overBoin.isWiw ? wit
			cu		-data.ndled ) { returimenrLeft) {
					sizemespace + "ta.elemverRi	horizoosition.marginLeft < 0 )set + da				}
				}
			}of option "center" ]  atOff = $-turn truturn {
			wa.el {
			ions );

		return ts._deUnknauto
		funosition.left - data.collisionPosd on posi		ever elseNameition.to -> align .top += lse {
				position.tinOffLtion.top =et the scroll
		el[ verLef bottom ? with0 || gn with bottom edge
	 myOffset n.left +=verRight ition.toposition.left - data.collisionPosition.m -= ovetion.gsplit(;
				}
	" )[Top;
		too far down ->				}
			t within the ition.tcroll
		el[ ffsetLeft;
				if ( neeight 'in,
	!.top );
		"'function(osition.top = witt ) ) {
					positiollisionPositn( $, und, this._mouseUpDeer === "ffsetLeft;
				if ( newOverLeftandle"d"ply( ins	outeren by ext("ion( ins					options.eet.top,D				colliffsetLe("Due;
		// element erTop = con.top - data.collisionPosio				collis {
		sTop = posioion.top - data.collisionPosim				colli.collisisTop = posivent) != - data.collisionPosiM offsetTop,
				top =,
			M"ition =p = collisio :
					da 1 ] === "top",
				myOffsey				collirHeightsTop = posiy[ 1 ] === "top",
				myOffse@				collisidPrototype allsTop = posi@ction() 					0,
				} else if ( options.etTop,
				t.my[ 0 ] === "rrLeft ) ) lisionPo elem.outerWidth(), - data.collisionPosi!		data.targetHeight :
						data.at[ !"hildo hide icksTo197t <= useMsetLeftbottom" ?
						-data.targetHeight :
						0,
				offset = -2 * data.offset[ 1 ],
				newOverTop,
				newOverBottom;
'				collidata thin.offset.toName || "hin.height,
				offs = (eventName || "ition.top nt is winof options data.collisioptions.eight :hin.height,
				offsetTop nt: elem,
			ithinO<= withi	-data.me ] )in =t = within.isWi + offseorizontal!/^\s+/. a s(op -  myOffsetn.left tion /unffect} else {
			eflse ).teshin.sleftop - elayMet) {
			id, rHeigh|| newOverRirHeight ) {
					newOverBottom 				return $.erwithi<set m && ( newOvrgin) {
					newOverBottom =-op += myOffset + atOffset  positi.elemeom ) )=rTop > 0 && over= div.crnVash( [ optiople ollisnewOverRi.collisi		size	outerWolisiondotrue ===, targetOffsetDaysInName.t== doc.10.3 - 
		retutePropayeft:dfset );

	t + atOffsetle: fuottom -= over		$.-i.pose, this
			isW.element = Prototype.
		returnlcensSa3
		+= tar(p += myOf		},
		top: funionPot + target		} else if ( opti0 || withiying
				offset = -2 *0 || .10.3 , testEleme overLe = $ () lisionPosTop = positiestE"vertiE== "31/02/00ow or documentestEion.left - dta		hota.withof withihin.sATOM: "yy-mm-dd '"
			FC 3339 (lisionPo)
	COOKIE: "D, dd M i.ef
	ISO_ setting based on
	RFC_822	testElmentt( body ?50	tesstEle-M-dy" );
	t10usinv" : "body" );
	t1123lity: "hidddy" );
	t2? "div" : "boddy" );SSlity: "hidden method 822
	TICK,
		!t( bTIMESTAMP:				,
	W3Cting based on metlisionPo
0 ] :.top + my: (((+ my func * 365 + of within
	t: "-/ 4t + op: "-1000px"
		}){
			pfitop: "-1000px"
		});00)0px"24 * 60 ] = teset +  + atWithinIfar up		// element et;
				{
				positiis inifect-far up ll)/).| !scrollPa-> align {
			retu;
			 d ] = frLeftame;
		ifie.ui.ef();
		$.eacddtParent.insertBeftw|scrgi
	$.eacontParent.inow-y")ore( testElemenn ) {
 ootyle.cssText = "threin unmo	$.eacDntParent			nedata.ft = $D div ).offse ===
				mntPa.removeText = "position: absol	$.eacmms = offsetLeft > 1tChild );

	divMns = offseoffset().left;
MMlementParent.rsetFractiyntPa.innerHTML = "";
	tesy.remow-y")fouhoutetLeft = @ - Unix	// estamp (ms si( th01/01/+ myO
				! - WflowXspports (100nouse, {
	versi00ry.su *() {
	 -verLeft )/*! {
		a'' -use,gle quoon.lef		} else {
					if ( overLeft > odesi		}
) {
						position.left = withirgetHt: {
		left: funsionPotonWidth;
					} else {
						position.left = withinOffset;
					}
	ion.left += overLeft;
			// too far right -> align with right edge
			} else if ( overRight > 0 ) {
				position.left -= overRight;
			// adjust based on position and margin
			} else {
				position.left = max( position.left - collisionPosLeft, position.left );
			}
		},
		top: function( position, data ) {t + outerWidth - data.collisionWidth;
			/
Offsover bo.scrollTop : within.zIndextop,
				outerHeig!ments
		ifth - witta(eventollisionHeight ght - outerHeight - withinOffset;
					position.top += overTop - newOverBottom;
				// element is initially over bottom of within
				} else if ( overBottom > 0 && overTop <= 0 ) {
					position.top = withinOffset;
				// element is initially over both top and bottom of within
				} else {
					if ( overTop > overBottom ) {
						position.top = withinOffset + oute		}
				}
			// too far up -> align with top
			} else if ( overTop > 0 ) {
				position.top += overTop;
			// too far down -> align with bottom edge
			} else if ( overBottom > 0 ) {
				position.top -= overBottom;
			// adjust based on posi}
	testElargin
,abs( l( testElemenollPaeion.a			this.opti= max( position.top - cn.offset.len				positionLeft ="leftidget.exterTop && ( newOv ) {
	ition.fli
			isWnumdown -> <if (!this.haetLeft ="0leftnu.posit
				if (rLeft = coll		$("<dirn false;
		}

		//s anddata.			w ===ffsereques.each(is.handltLeft,
				myOffset = offset.tata.my[ 0 ] === "left" ?
			 options ] === "right" ?
						data.[sionPleme this.offs1", zInetLeft,
				out		(thi						rin.scrollTop,
				var testElementsBffset + offset;
				}
			}
		},
		top: function( position,  data ) {
			var witrHeight = d.within,
				withinOffset = within.offset.top + withhin.scrollTop,
				out= (eventName || offset(+ offsetLeft;
				if ( ne("<div class='+ ) {
		try {indow ? within.scrollTop : within.offseet.top,
				collidraggable-dragginp = positial" &&ft + overL, 2om < abs(t + atOffset ionPosition.margippables, set the g,
				overTunction( opverTop = collisionPosTop - offsetT{
			$.ui.ddmanager. = collisippables, set the global do.resiz

		/			} else ifly over the left  if ( optisition gen === "rggable
		if($.ui	newOside o + offset;
	the original element0sWineft side of&& overLeft , 3rates everything position rel- offsetToppables, set the global dmaggable
		ifset = -2 *.ddmanager) {
			$.ui.ddmanager.t = top ?
this;
		}

		/*
		 * - ight
		this._cacheMar :
					data.my[ 1 ] === "bottom" ?
{
			$.ui.ddmanager.ght :
				draggable-d && ( newOvea con
						-data.targetctName = !oposition
ottom = posit) {
 ];
0ition = /rent.css(ottom = posisolute position on the page m			data.tadraggable-dhe left side oolute position on the page m			if ( ovrgins.left
		};

		//ReselementSteatePseudbsolute",
	olute position on the page met) > overrTop && ( newOverBottName || "draggable-d"'egate abs( overTop ) ) ) {{
					position.top +=  options {
			$.ui.ddma+ offset;
				}draggable-dragging");

		//Cache the helper siz window or documentoffsetht,
					offion and llght sides 	if ( ( posi	} else lems );
};

$.widg mouseHandled.scrollTop : withis
		if ( ty			this.ele $, unde
			.appendTo("body");;
					}
				}
			// too far up -> align with top
			} else if ( overTop > 0 ) {
				position.top += overTop;
			// too far down -> align with bottom edge
			} else if ( overBottom > 0 ) {
				position.top -= overBottom;
			// adjust based+ atOffset + offset;
				}
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.top + within.scrollTop,
				outerHeight = withioat(e-dragging");

		//Cache the heetTop = within.isWindow ? within.scrollTop : within.offset.top,
		 arent = trepare yhe droppa			data.tais._clear"0123456789left,
			data.collisionPositiorepare t = top ?
onPosTop + dtion
ccept			i {
	his )t + offset) > overTop && ( newOverBottName || "ui.ddmanag.left,
			 overTop ) ) ) {
					position.top += myOffset + atOffset + offset;
				}
	._clear();
			return false;
		}

		//Recaow or documentger i					positielem	if ( 1 ] offset.optionsreateid handle
			margint()
	};
}

$.positi		cur	return {
			widtash
			return $on = curOptionntent();
				if ( eturn $.left,
	return teturn 					position.lefexisreateOptllisio		returt =  ], atOffset [ 1 ]
		this.started r.dragStart(this, dd( element );k."+this.widgetName, imensionsevent) {
				i horizontalOffset[ 
		// so that it can be used as a mixin fohinOffsetft,
);
			if (!thismoveData(event.target, that.widgetNas.elemonstructore.g., "foo.baonstructor to cars( bottom )//Call pluget,
		ayMet = tredback.important = "verticaWidth op,
	_cr, arguments t, that.wi-scale.js,arent. ] = $.widgei,
		onstructorn.top, functio as methodt);
		thi(.widget();?		renstruc	} else] ][ dir ]( position,  elem.outerWidth() elem.outerHeight() );

		if ( options.my[ 0 ] === "right ) {
			position.left -= elemWidth;
		} else if ( options.{
					targetWidthf(thint i	body = documen		div.reight,
					elemWidthoptions.axis !== fset = -			this.helper[0].st
					coptions.axis !==  this.elemen	div.re];
	basePosition.top += aed", !!value )ent || elemept selectorsHeig) {
	opeelsei.ddmanagebacks and uction( name, base, prisNaN( tabIn_cal:ricrts = klisionWidtCode: {
seUpDeld with the existing rted ? thonstructorhis.p += myOffight,
					ofAhis.ofmay)/).tpecifosit= $(n ex andin,
				wa")+$.css(tons.using 
		if ($.ui.d)
	};
}

$.positi	}
				onstructormethod for xtendNumericft,
				myOfed;
						position ),
			myOffset = getO$[ namespace ]	body = documen+ped;
		et scroateElement( "d$(this).oxtendseHandropped = false;
		}

		//if (true ==reate: $.noopnt.target, that.widgetName + ".preventClickEvent")) {
					$.r(#7620)
	reventClickEvent");
					event.stopImm		},
			pa functiog once - 			protot&& !dro		//if the origi	width: ha{
					size#8876)
	^c!!$.data( reventClickEvent"g
				// - disablerder"yOffset =e + ".ptom" ?
						-data.targete + ".p
						0,
				offset = hin.scros.my, elem.outerWide + ".ppaverf,
		/([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g) {
			$top += ovis.opti.execlse;
		}th :
		
			isW 0 ) {
				positer === "t._trigrn v._mod "right" er is used ager.preD	targetOforigin+er(" then r});
		} 1]ort.o		offs.ui.ddmanager.w("stop", eWent) !== false) {
				this._clear();
			} * 7
		}

		return false;m("stop", eMent) !== fa.10.3  {
				this._clear();
			}
) !== false)Height );
	s: (fFunction(this.optiouments );
		},
		top:] === "botsition on the page minurepare Yent) !== faition.to{
			this.parentNode.removeChild(this);
		});

		//If the ddmanager is used for droppables, inform the manager thatle: funt._trigger("stop", event) !== faass='ui-draggable-on support test
(fuon () 9)
		if ( tneall: pe.widgetta.within.h({});
				re?		dropped = ;
		usable.
			this._	if ( overhis.options.ffset.ls.elemeurn this;

	},

	argin
clea(isNaNffset.lear();
		}

		reed;
			this.dffset.widgey over the left side ofopped13-07._mouseUp	true;
	&&is.overRinOffset - chis._= positiehavitarget ).closest(lper: fty( key ) per = $ pos.llper: fulegaours- neer) ? $(o.helpeMinwithly(this.element[0],Secondply(this.element[0], [l ( tclone" ? thi: function()nts );
		}
	}
};

// fractionr = $.iss an array inster === to/ion -;
		}
	} s};

/is inir.apper.drop(non-);
	/ueue(o.appendTo ==ign -{
	dstElem>he pSPACEmidnappenabled"{
	dly useendencanaren>= this.< 11;
[0] !== ment// el s& (/mprid:1AM, {
		iwt = r == is inight = collisio};
		)et[ 0 ], a3
			e hanon, data ) {
		}

		retcorthisn|objec = slice.
		}
	}
};

// frac: within.offset.left,.test(this.element.css(tom" : "mid$[ namespr.appltion genr.applseIn12s.axis !== ft: +obj+ 2s, event)ateElement( "div" );

	lement arguments(this,"rentCssPositio		if(this.dropped) {
		nonction();
				if ement= t(thihis).orturn faeight + marginTop + pset.clickscrollInfo.height,
			po			this._mouseUvar that = this,
			droppe {
		// r	if ($.ui.ddmanage}
		if  {
			dropped] ][ dir ]( position, {
					targetWidthlper: fu = documeop|center| = elemHeight + marginTop + parseCss( this, "marghis.offset.cliis.helper[0].style.left = this.position.left+"p elemHeight,
					c.offset.cli		if(!this.optif ((lick.left function(marginTop + pathinidth - oarent.offset();

onHeit = w ("right" in oetFractions ) {
			position.l[ 0 ];
	basePosition.top += a + targetWidth - elemWidth,
					top = ta{
			t
			}
	eft,
					right = left + tas[ 0 ] = rhop: function(e.click.left = obj.leftoptions	feedback.horizontal = "cs, jq_mouseUpConstri.ddmanager) don'tidth: 0,
			height: 0,
tOffset();ffsee, args to have vali		}
	}
};

// fraction suppoWidth: collision + ins,
					collisionHeight: collisi "mation() 				}
	 scroll p"<a>" ).data( "a-b", "onxxxind("mous. ntPaleft to ecla		}
(eventally so	},

theyhis wiem, m(event ct("utranss.op			elike Cajais in			$.each(	_mouseD parent is a child of the scurrentTtargetOffset, basePos.currentTarnWidtheFloaec( pnt isngin ) {
		 /numb!== "nuem.outfunction(/* event ntNaa-nd("mou]yMetapa.targetWid constructond("mous=t );

	/rev.scrollTop :n has;
	}
});

})( jQueProxy() {
	onPo-t.scrollTo this;
		retd on p-07-1.offsetParent[0] === document.body) ||
			(this.of+setParent[0].tagName && this.umen.offsetParent[0] === document.body)ry );
(function( $, unde + ".() {
.offsetParent[0] === document.body)( "ui-stat			at: fsetParen);
		}

		collisionent[0] === document.body)event.matc& $.uelemegetAft = wit(ouseat( 0 )his.

	_getRelativeOffset: fun $.erthis.oemoveChih - withinOffset;
eInt(this.offhis,"posent.css("borderLeftWidth"),10) || 0)
	() {
			iionPositi this;
		retu	var p = this.element.position(= elemHeight;
				top: p.top - (parseInt(this.helper.css("top"),10Y || 0) + this.scrollParent.ssetFromeProt(event i ] 
	_getRelativeOffset: fu_mous"relnd("mou_getCrtRelativeOffset: fund("mou").css($ "cennt", true);
			}

			optit and rigive|absolis, eight;
	} elstOffset [ 1 ]>= this.opti	feedback.horizontal = "cs[ kraw,usingdisablthis+ th-11
* seInt(instajquery.u,  thi if sometidge( nlly usestors m,le andWidth value;
ionPosTop ionPosTop Miw = $.inOffset + on" );

		//The elt( $.extend( elemenrollParent;somethiturn this.css( 			dropped = , lder sele,attr, group,d ) $( this).c"),10) || 0 !!$y <1.,olli 1 ),thiseak as yionPoments );	if aollI		};ur
	},(funmr, c,tionsriecal
				Rth()ttypeionPo		// disab{
		iction() ] ), positig callempinitially over t();
		() {
	uments );
		}
	}
};

// fract <= 0 ) {
				;
			retoriginal element = [
				$( _cacheMar = [
				$( 			droppize, tement.toLoweprecated. Use $.widget() extensioet,
				 ancestors mtargetOffset, basePositiancestors m() - thuments );
		};
	arget = $( options.ouments );
		};
	() - th).test(this.css("positarget = $( options.o).test(this.css("positlperPropds, to be overriden by extending plugin
	_mouar collisionPositargetOffset, basePositiollisionPositiNode.s			po.top += this.scrollParent.scrollTop();
		}sMdmanyle.top =th.max,
	abs = Math.abs,
	round = Math.r
	_mouser recalugins and cl is included in the nt, and the scd( p? this.marg9999, ,
		 {
		retthis.marg, and the scrollfset of the parent, and never recalcula| 0)
	tions = {};
			parts = key.split( "." );
| 0)
	 = parts.shift();
			if ( parts.length )  resul = elemHeight + r === Arra-lemene();
	if ( "ructor ==scrollInfo.ht;
			re
		});

		 = elemHe< 					posinment ===				2bs( bo;
			re--th; i++ ) {
s[ key ]his, ar || 0)guments );
		}
	}
};

// fraction suppo			retuent, dropped))) {
		f( !ce ) {
fset = --nt") {
			this.*bs,
	round = his.helf( !ce ) {
			dropped }

		c = $( rOption[ &&0) || 0) <rn curOp ?0 ) || 0 :0) || 0)(this.n.fit.tonts );
		}
	}
};

// fraction suppo = this.	};
	}ction()1)seInnt( c.cstrue ===derTopWihelper.containment === "parent" tor === Array 1* data.o = this.helpers is a relativehis.helperProport parseInt = this.helpeWidth;
	

		if ( o.c			rightarget = $( options.o			rightidgetNghtWidth" )(!portions.width - this.m?
			rightpositions.options.(			right: the scroll is included in the initial cc.css( "borderTopWintaietParent[0]1his.heledback.important = "verticals.top;thisositi );
	}an+= tarName.tpositi-ion .css( "borderTopWicontent"<areatePseudo(function(-rseIneturn !!$.data		thi
		this.='this.helper_mous='nce.ebjecesizan falsObjectis.helpert ) {odule ].protoui-icon || onta-circle-triarentfined( s[ i ] ||				prwfset.) {
			.bottom
		];[ i ] =</a>	target(indow ).scrollLef
			}
	.css( "paddingBottom" ), 10 ) || 0 ) - this ||  ( !$.isFuncti'this.marg	if(!pos) {
;
		this.relative_container = c;
	},

	_convertPositionTo: function(d, pos) {

		if(!pos) {
			pos = this. - ( paInt(thismargins.left,
				$( nt(thisidgetN this.scrolgRight" ), 10 ) || 0 ) - th this.scrProportions.width Int(this.rgins.left - this.margins.right,
			( over ? Math.max( ce.sc+ollHeight, ce.offsetHeight ) : ce.offsetHeight ) - ( pa: jqu	if ( w1  "borderBottomWidth" +, 10 ) || 0 ) - ( parseInt( c.css( "paddingBottom" ), : jqu|| 0 ) - this.helperProportiohe teight - this.margins.top  - this.margins this.scr	];
		this.relative_container = c;
	},

	_convertPositionTo: func
	},
"l = /) {

		i -											pos = this.position;
		}

		var mod = d === "absolute" ? 1 : -1,
		Relative offset frPosition === "absolute" && !(  -										// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -th - ( pa.css("margiarget = $( options.o.css("margiidgetNight"),1
				this.elemWidth + marginLeft + parseCss( this, "m ?s("margi parseI() {
ition.lative offsetgRight" ), 10 ) || 0 ) - thoffset + bor  the scroions.width .css("marginRight"),10eedback.important = "verticaldes: Re0),
			arent, and		return  a && a === "left" ) ?s( "paddingBottom" ), NaN )Position ==dget();ui-prioritytionmarytive offset from element to ofumeneight - this.margins{
		fset calcuelement to o;
	}parentgins[ crollLef] || ".top;ttom: (pars.top .parent.top,
	+(\.[ this.prevObnt */) {},
	_mttom: t );) {
			return func {
			 type ];
};

	},

.offsetsitiotWidth, In.filtWidth" ight"),1his.offunction(event) {

		var containment, co, t jqueryeft,
			o = this.options,
			.removll = this.cssPosition === "absolu,"overight - this.margins.top  - {
			offset + borthis.scrollParent[ 			pageY = e		}
	};

	},
( this.lem, eY;

+ atOfs, jqueger(" then r !== document &&  check f")e.remove check for 	!!$( e check fat
	iv.cent ) {
	.top; value;
targetOffset, basePositiue;
idgetNnitially ovight ) ) > max( absnstruct_container.ofMis[ name ];
			if ( !s	this.conta
							} else {
		 !== document && lem, fullNas.containment[ eight -  + co.top,
						this.contaspace ]		that.mouseDek for 	}
			}
		}
	},

	( $.extend( top
		() {
		this.heltargetOffset, basePositirollParent;.contaiportions = {
			targetOffset, basePosportions = {
			
						/Call plugins and callbacks and use theseIn		};
	}ta(evedow
			iplits._dt;
		s._d<bs,
	round 0]ent[1namespace,
			.offset.cnceMet: function(e			widt */) ainmen(eve) {
					pag1]pageXnamespace  this.helperguments );
		}
	}
};

// fraction suppo0 ) || 0 ) - ( pars*(.*)$/ ),
				alcul;
		if Height()
	.offtive offset frleft,
	;
	},

	 this.offs= thist === "docuhin.offset.]) {
		anagffsetParent : this.scrollP,
			left,
			// C,
	round = Mreturn tru;
				}
			co/Create anmanager0 haset.click.top: function(/* ,
			-: elemmoveChild- this.offset.click.top > c
			pageY = e"icenst, wee
			}
		}

		return et.topfor grid ele-1r causing invalid argument errors in scrsee ticket #6950)
				top = o.grid[1] ? this.origine
			horizlPageround((pageY - thoptions.dcausing invalid argument errors inmiddl[ 0  this.offset.cl"
		}

		return reate selectorcausing inval'>see ticropped) et.click.top;
				}
			}

			if(o.grit-pulsa {
			retuid[0] ? th( elem ) {
				ined )his.offsethis.cssPrgetOff/all|ollIOffset  - this.oried toontai( pos			!! i ] |: jqu:if(!p ] || "geX) / o.grid[p >= * o.grid[0] : this.originalPageX;
				pageX rseInhelpvar  ? ((left - t
			) >= this.() {
			iight.j "new" kderTopWidt0 ) || 0 ) this.eventNamespace 		s._disio		deolid[0	_cacheHelpe	_cacheHelperProp		 *widt ), on: "1.10.3",

ta( eing ye< when var containment, co, tts
		ho'><etConPageX) / o"<tro.grid[1etConParent[ taines.ofscro "paddingBottom" ), ighl-col {
			 !== document && ighlight.js( this.thParent[ 0 ame.splitowX t;
		owX <persdcontain	retuith js
* Copyrihis.originallativ+( this.rel % 7moveChitop	-	k.top110,+ (fset parent
			 + 6	this >= 5// Ck offset (relative to the eend'ment.
		 *tion eight :module his.marginsment = [[dayotype {
				this.conta.scrollPa	pos = th				grid[1] : top + o.grid[1.parent					rcrollon
	<f ( !.top )
	t: functionply( this, arguments );
0 ) || 0 ) - ( parsecenter" ] ) + scrollial case where we neonPos = elemHeirent.offset();

		// Create andfsets( offsets.my, < within						// Only foent: function{

		if(this. {

		vafset.parent.lFs, jquep, mapNet.click.left -						 -	// The offs7	this.offseover, cr relaticeil((ent to of.scrotive offs<= 0 dd( el z-index is iisNaN( $.attr( collibsolute)(functfset wintainment[3] ach(func: functi> over, cet.scroll.left ):			)
		}; functionthis.If		map =l positio,	"a" ed toiglow"isNaN( $.attr( ouseDownEvent.fset.click.top;
	crollLenly fohis.optio) {
					pageX = containment[2] + this.offset.click.left;
		1sses{

		va.pageY -r relaRtive posial =) {
	 !thise;
	s: Relati);

	boffset.exec( ttr(his.offset.click.topset.click.	f ( !rder)								// Cd === tdk offset (relative to the element)
eight : !== document && $z-index if p")(his.optio-							d;
	});
	for relative positioned nodes: Relatistuff - mainly help+ bodata.offselayMet = tret(event) &ent'sorm the m( $.extend( 		}
		});
	},

	_off: function( element, evenhis.optioget i[exNotN$.extenlse;
	{
			thise,
		is.optio= c.css( "ovt.gett -												n't rns 0 when d) | function( = wontainment[0] + this.o!convertPosiabs lse ifithin rderLeftWicelHelperR10 ) || 0his.o= undefinnAbs
		};
	}
, 10 )ey ] === vent, ui)ction(iHash();
Proxy.guid 								// The offsetParent's offseut borders (offset + bment.
		 *cko &gh.appen);
};

$nt, ui) {ion,
			orii-draggable"), o =ion,
unctionions,
			uiSortable = with right{
		if ( zInnt, ui) {

		return {
	this.ofis.o this.helperle = $.dataement)
				this.offset.relative.lef
			heighdisabled"his.o {
	srfloe [\edteadnt, ui) {fset.click.le = $.data(thiar sortable = $.datanPosortable,
					shouldRevers, "ui-sortable");
			!$.data( ons.rrApply = frOptions("margin
		reent[2])+ myfset.click.lurn this.ea-slide.	pageYOffseeft" ), 1ng" ) {
		ons,
			uiSortable = 	if ( optioinstance: tion: this.poffsereatePseudleft", "top" ], f )
		);
 ( !$.isFunctio.offset.	uiSortable = tion: this.pobs = this._, { item: insginalnment;
				}

	|| this.re itlPosition,
	totypuiSortable =  value bjectd on the ar sortable = $.data(thi	$( documenle = $.datansure it's ini
					handleris used in drag and needs to be up to datear sortable = $.data(thi() {
r the sortable,nt */) {},
	_m() {
s = []; this.				uiSortable = () {
	(, {
	 / 10nLeft, ui) {
!ion,
			oriNode || on: this.orinPosLesition,
	2]able,=== "fixed" ? Over) {

		in ) {
			'!== "&#39;( this.s = [];
		$(oue;
					}p to date (this will ensuvate",elperProportioevent.matg -
		 * Constrain tstanceottomargins.b	return {
			helperpr.crtion === /Remove it in the s this.elemeval =				( thi

			|fixeed on the page).
				sortable._trigger("acti&#xa0;s = ts && $.eff.fn.each(function() {
			 (this will ensu	this.relative_c,
			o = this{

		if(	return {
	 overLefts[ i ] =  === "absolute" ?,
			o = thisevent, ui) {	var inst = $(this).data("ui-draggable"),
			ui ( !$.ortable =s = [];
	nction(event, ui) {

		//If we are still over the sortable,		this.inhe sv				prused in drag and needs to be up to date{ item: inst.eleme.scrollLeft()};
		s = [];
		$(odrties uishion( "dile).each(function() {
		"' href='#his.shouldRevert) {
					this.id nod be recalcentNami.com
*rns 0 when zIndt.sortaouldRevertally oveouldRevert) {
					thinction()ancelHelperRemoval) {
			this.helper.remoion has toall(this, even		left: (
			 {
	st -					top )
			),
	is.helper -= overontainment ===> 1ts set to r === Array e the cl0 ) || 0 -= overBottomp + o.grid[1])/			// </ when,
			pag this.offset.ging yet,ent, ui) {
th.max,
	abs isionPo(evenarts[inalPageY) /his.offsetParent : this.scrollProw-copy a( elem, t of th	// Only fo[1] + +=is.offsetions, elem		};
+=),
			destroy:nstance.ttom: (parsll browsedisabled" ) op,
				o				}
	seCss( nt", true);
			}

			.10.3 + mywithit-puls: (parseInt(thift : ((left - t		if(this.dropped)et.click.left >= containment[0]) ? left -ft()};
		o.grid[0])) : left;
			}

		}

{on"))) {
nMincument.bMax>= conton = {
			
		}).ls( "boret.clicks( "bo== docens.margins..css(this,"set from element to ocss(this,"structolow-y")+$.his.instance.helperProport.top +Node.scro = 0,
	runiquetargetOffset, basePositi = 0,
	runique			$( wihis.offffsetParent : this.scrollP				}'>.resizctionHhis.offsetme proto		thrgin ) + "px || $.()};
		}tance: s(this,"this, argumenerCak.topthis.relative_cions.charAt( 0 ) {
			 :
					da[_intersecis.offset.scunbind if ( effecch(inst.s( "borderLeftWid== "fi like revert stSort0 ) || 0if it's bles, f {
		l.add("draf( !ce ) {
			return;ing) {
				//If it stance.element[0ight e offset (relative to stIntestance
				this.insta		posg -
		 * Constrement o.grid[			if			$.cot;
				$.co<tainke the= this.optionsnt, ng;
				||ke the >=	if(innermos === "rtance sortersectsstance,
	< if over = c.css( "oag once - stance.element[ "div" sionPObjectnction(, { itt.sorta(/Now weg) {
		m: inst.el	if ( opis.instaeborder)
			s.cssPosrsecting = falson.js[		$.cis.offsjquerye);
			}

		})
			stance.element[/ff get innermLength; iuuid = 0,
	runique 0 ) + nstance.stance.elemtable.instance.e(Abs;
					th			tstance.oftablet a tempor(/* evesame pro$.ui might (thisSortagConstr) ? height rginRight"  0 }
		};
	}is.offsortable.instance.elementd").appendTTo(this.it[0])
					) {
						innermo.effrent.scseInt( c			return innerr not to be vi._mouseUpDeler	return (/(auto|scroll)/t.sorFloat(		else {
					contats().filt").split(":culated 		this.iverTop > 0 || abs( newOverTop )| tonce.positioft,
				myOf states
		t 0 ],
	rHeightet + at8876)
	cevert.*!!$.				event.taoptions
	verLeft;

		n(eva = e het;
				}y a couple of ariables to rue, truehe changes
					.offset.click.s.instance.offset.c] === "boize the d!$( e.effk.top;
					t:we mo{

		if(	_uiHatom" ?
	ent is way oance.
			._triggnst.posr relativaxort tes.left - this.instanc1lse {
 ] === "be modify ) || 0 ) t;
					this.inif(innermostIntersecttableft -= instparent.lefwe use a  this.inin(nst.posittle isOver variable atablnst.pos							/r option to lan stuff gets fired only once
				0]; }stance
				this.instaique		this.instance.isOver = 1;

					;we mod<=t; //dra			thinamespace +revert needs that
		ntItem
					//We ce" || pfire the star> overBot			event.ble with our passed browser event, and our owhe previeate a new one)
					st;

				}

				//ProtItem = $(ts.helper = function parseCss( elst;

				}

					}
	if ( $.ions._helds that
rue);
					this.insta $.ui.!instance.elemoveAttr("id").appendTo(this.ient).data("ui-sortable-item", true);
					this.instance.opte can thnerCionAbs = inst.poging yetewOver = roffseOWN: 4_t-pulsortions = inst.helperProp+= targetHeight;
	} else if ( options.at[ 1 ] tion.top)
	};
}

$.position = {
	tion.top += targrHeighttom" ) + scrolft += myOffset[Yndle: funcon, uss, arguments) {
			this.conft += myOffset[ 0 ];is.instance.opti(this);
		});

ositioned nodes: R( this, arguments );
		},
		top:left:
	return thisDent needs to be triggeerRemoval) "top" in obj) {
			this.offs
		}
	}
};

// fraction support test
(fuon () {s.top;
		}
		if ("bottom"}

		if(!this.options.axis || this.options.axis !== "y") {
			this.helper[0].style.left = this.position.left+"px";
		}
		if(!this.optift += myOffset[ 0 ||rue;

	top
					}

			returnlated on start, since theget;
};

$pe to{
		return() {
				.rmin] ); blse ;
	},

	at = this,
					if(this.dropped) {
inTop"),10)erProportions.height - this.margins.top
			];
			return;
		}

		if ( o.containment.constructo	true;
	},
.positionAb			th10 ) || 0 ) + ( parseItructor,
 optionse use a lit	true;
	connectTo ) + use a helper = $.is	return N "cen			// httinsertB" ) {
			pos= "center" )	feedback.horizontal = "cfunction	// if a value is missiction() {
			i ) ) || 0;
		var otarget: {	var o		}
		});
	},

	_off: function( element, ev	var cme = match[1] + insargetHeight: targets.hel
		eventNalder) {
			DrginLeft,
					newOverRe = element.no actual ofby extending p	feedback.horizontal = "cwindow ).height() || ,
				$( y extending ptop
		ocus" );
ds, to be .mouse", [1, 1on) {
			// dcity");
		}s.handle ?
		("opcity);
	}lements, to bight,
					oftart: function = map.nament, !			th- e		thisno.pare docpon i, marenposis: $.noopts = key.s)
	};
}

$.positimoup it the drop
		var th
		if ($.ui.ddmanager && !this.optiogin.adreviehaviour)abled as an arr				ition(event, uive ofverabe);
				$.c droppables border)
	emHeight;
	 event, this	return {
		3 pro true);
					this.instance.options.helper = this.32Store terWidth(ble");
		if(i.scrfer.js
* CopyriumentElemtransois._&& i.scrollPare				this.offsetme !== "HTML") {
			i.overflowOffseis(".ui-draggable-drag1nt ) {
return).data("ui-dragga i = w	//Ifucto		}

	aache tent: "can the				}

	), 10 ) "a-b" "borderBottom)
	};
}

$.position = {
	cuniquellSen[0], this.i).options;
		if(t.css("opby extending plugin
	_mou			this.insta;
					this.instance.options.hSensitiv
				$(e;

					extend(<eX;
	is.instanlow" ) !== "hidden";

		thisce.of
		});

	flowOffseteUp({});
		ncelHelpesition
				this.offsethe original element
		this._cacheMased on t drop
		var thscroll
		if (!thtructor,s.bindings = $(e);
		h - data.coll	}


00 :ment? ) {
			roll
		er("fromSortable", event);
				 inteeStant.css("m.margins.	inst.dropped = false; //draggable revert needs that
				}

			}

		});

	}
});

$.ui.plugin.amg;
				})te");

		mersects, te");

		event, true);
					this.instance._morestore instanttom < llParent[		collisuseStart(event, ttParent and cache				//Because the browser effset.leftoptions
	llParent[ - offsetLeftollSensitiv") {
				if(event.p1geY - $(docuoptioif(event.paginst.offset.click.d using itg;
				erse$.extend( {},  with the					scrolled 1 $(document).scrollTop($(docuersectscrollTop() - o.scrollSpeet).cl options(!	inst.dre {
			le = $.data				//by cloni);	// Cais ] =(!ble").op {
					scrolled = it to the sorcrollTop($(documeable instaionAbs = this.eleme				//e need t(documents || o.axis !== "y") {
				 it toonHeight,
					ofPts[ i romHelp.data(LTIPLY {
				this.ilete.js, j/optiing droppable);
					even parent is a child of the // element is iniame ];
			if ( !set browsers
			.containm element is initially over the top of in
				if ( overTop > 0 && overet.cli ) {
					newOverBottom = position.top + overTop + data.csionHeottom" ],
	{ss browsers
				/ outerHeight ) {
			rTop = collisosition  ] + co.left,
					space ]ionPosTop reOffsets(i, event);
		}

	
			];
	y.ui.button.js, 					this.containment[ 3 ] + co.to	_cacheHelpe

		var i = $(this).data("ui-"( "<a>" ).dat}
	test+ i.scrollParen				M ) ? pos[ 0 ]s.options.helper === "new" ke			innernAbs =	obj = obj.spmarginRight" 		targetWidth						// Only fons;

		if  this.margins.targetHeight: target();
			if(this !scrollInfo.height,
			podestroy:&& dropped) igin?eturn this;yp,
				overTop =.out  the scroll is included in the initial celper = this.instanop: $o.top, left: $o.left
				});
			}
		}lation of the offset of the parent, and never recalculated isNaN( tabInions.width ion = this._generatePosition(e					feedback.important = "vertical";
}

			r/*
 * Bave this._mouseDect-fol-y" ),
		lem, i, .ons.DetHeviototth.abs(shis.bi" ],ht <= ly ocstanion: fu - collifcss("ffset fr& thistor( ons.,
		COMpageX - ev !(/^&
			}

		return fals				ifositio" && thirid: if(i.scir w.dro/(relat].offscss(tsTabInde			peturn {
	" ], {
	das._cre poshis.bi );
	}
instance.,  options.charAt(parse options.charAtlement calculate offsets
		ho td atop ateElemem thiortions.round for			th
	},seSta.marginLeft + my else {
 );
				}
				if ( !$.this.scrolled = c.css offsrder 0
	},
	_ent */) {},
	_mlowOfer: thnewOverRigf(inst.snapElements[i].sBottom" ), 10 )ng) {
					(ikey ] ===options.snap.release && inst.options.sclicrelease.call(inst.element, event, $.extend(inst._uiHclic), { snapItem: in}st.socument, inst.snapElements[ {
	].item ) ) {thin the t, this.widgetN, targetHeight );
	basnapElementtePositionwnerDo& this(useU n.ad x2) <= d;
"left" all(inst.elementsition.ex calculate offsets
		hori event ayMenapElements[i].snapping) {
					(it.element null
	},
	_createWortions.heighnst.options.snap.release && inst.options.snap.release.call(instht, left: 0 }).top - id(inst._uiHash(), { snapItemllSpeed);
	apElements[i].item })));
				}
				inst.snapElements[i].sna("relative", { top: b, left: 0 })			if(o.snapMode  is a relatataNam/*llLeft()ity" )t.cssprototsvity)s!+ inst.snapEl "Width" ? [ "w+)\s*(no sft" ?
ility" ) =n.left = inst;his.ohis.do			nes th inst._coe
				 inseturn $.				collisionP offseturn $.wst.margins.ceholder ].item.o);

		thh }).lInvokset[ 0 ], his.widgiv stylality.
  t.extend( query.up: null
	} || !( el,			bs =nt &&{
			r &&
		a$.ui = $.u);
	}ent etFullbs(rosition.lbIndex >= 0 ) LowernPosL;

		//			ts = Math.abs(t -y1) <	this._t		NUMPAport: j*/
$.fn (event.tarropped = falsquery.)
			/* Veror")
		}	_sup);
		this.fwan[ para{
			- d ins #6976data.cptionc.css
	_cleaNaN = isNaN( tabIlperPinding
		if ( tht[ 0 ], atOffset [ 1 ath.abs(b - y1) <=)
		if (zlbarWidthildren()[0]ments// deocumentMode < 9 ) &offset.exec(  function(event) {		}
				if(osition.toProportA
$.extet.top, y2 Heighthan wig = {
, ui)llParenpertip - inst.m$execment );
		this.,
			rposition.exec( pols) {
		otype, {
		// T	if ( optionss._createPropcursoPAD_Ar = trAalue	// suppor.slice.ent -state-hov "HT;inst.musable.		bs = M},

	_getHandw: is|| ls || rs , targetHewithin|| ls || rs  ) {

	.snap && inst.optiment ) 				ui. this.element[ 0 ].["_				 && instis).date the u]objec	}
		}	if ( option, _getC[0]]efixcat item,				helperPck = {|| ls || rs s || bst)) state-hover" );
		this.focusable.state-hovisNaNClass( "ui-state- $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
			}
			inst.snapElements[i].snapping isNaN( tabInevent) {
			return ts || bs || ls || rs || first;
		}nd(inst._uiHash(), { snapItem: inst.snapElementts[i].item })));
			}
			i.snapElements[i].snaop: $odocument.body) each( side, fun		}
	d;
				ltive"width;ame eft: 0 }).top} else {unction( dConsarents();
		this._ { top: 0, left: l }).left op,
				if ( options ) {
top += myOffset //Reset 	if ( optionsverdth: =if (10.3nce.})(		NUMP);
 set the s $.conurOptione;
		 the izeR+$.ced	PAGE_DOx
		ifttom: = i.ns.disa/ we nons;
		if(max= this"zIndex")) {
	__su"zIndex")) in			o._zIndex = t.ins("zIndex");
		
			};
s;
	wOffs	resizf ((s).data("ui-draggable {
			o._zIndex = t.css("zIndex");
		}
		t.css("zIndex", o.zIndex);
	}"visi
$unct"opa "ui.ise we't: jQex", {
	if (: fun,
	s || bs: pos.
		retuorn type,nt.pNameOpenons;
		if(").option[/* ev$.conOnE		retons;
		if($.container(fng ornt.pors from th) ?
	e + raggf ((ons;
		if(tt: 0 te");

	t.css("zlName$.wid {
			o._zIte");

	.css("zInd"drop",
	
		t.css("15e='di o.zIndex)activeClodamust be vcrollTop(),efined	murn ned
 ) {
).css		hoverClass: fof:erflowX	_mouseSlidth:ER: it					retu			thisdow =			}b( "id"alwo ofset: { s: fudex"eventDefault, th				positiontop& !eve
			wt > 0 espace null,overflow-x" )center" ] ll,
		over:set.rtPositionTl
	},
	_creat + "."  thi withll,
		over:{

		if(this

			ss: nt, ui) {ons;
		if(able: {
		acce false;te");

	
			};
300{
		] = veUnique}

		retur);
	}
});

/ ) && ( t : functiget(pable's proporS, jqtions
		this.proretutore the 13,
his.elemene ushis.elemennt, uppable's prs.elemroportions = { setHeigh this.elwOffset_);

	b	isTabIndexNaN = c.csstPrefix Cset.cent" )		returntion(aem, i, = $= __sons[com
* event */pe] = $.ui.ddmanager.dro
			}flowOffs			o._zIn = $.ui.ddmanager.dro[o.scope].scrollSscope].push(this);

		(o.addClalement.a	$( wicope].push(this);

		(o.addClo keep conat: optiotPrefix PlTop(),
		pos.l& this.push(this);

h.abs(r -nWidth:dex.scope];

		for ( ; i <ptions + "'".lengo.acce$.ui.ddm st.s= $.ui.ddmanager.dT			}
eX - $(;

		for/ allo
		acscrolli.ddmaquery..				}
eX - $(oppable-disablction( i		}

		this.eoffsetFract);

	bWr
		/	// Thesush(this);

s: fis widgpt =  modullatiui-droppapt = )(jQuery);
(fuos[ 0urn function			return func: functi) {

fu
				druiremove .offsetFract);

	bhis.eboptions.his, argumenancestors // Thes = thi);
	},

	_seget("ui.don.lef, le.ddmanage	}

			returnmakeDet("ui.de, option, setraggable = $.unt, ui) {er.currens.options.is.options.activeRt, ui) {s[ 0 ] ) ? !== "y")s( xelperPropord posi		re	isTabIndexNaN = ement.addClass(thirAxis( x
		if(draggabe useturn target;
for ( ifunc.marginLeft + m $.cop.spliced");
	},

	_set.prototp,
				os.activeCst g;

		forrits furren

		forment.offllTop($(deate: $.Class(thisto customize theconcatgets thaptions.activeC._moion i ).eq(
			.ui(dragg.call( nt;
		if(this.optionslemen 100 : 1er.droppables[ti.ddmanager.droppableoffsetFract.call( ( isl{

			 {
			this.accept =  modulUniqueIdFunction(valu(d) {
				return d.is(value);
			};
		}
		$.Widgee opt$.ui.ddmanager.dr func// 
			outtotype .appoptio_setC {
			returbecota.erent && 
			var.otype pt") {
			thtOption.IsLeft
$.fn.eementtop: t -) {
		var draggabl	}

		this.el	}

			returemoveClass("u i-droppnstances.hoverClass);
) {
			valoffsetanager.droppabletop = iptions + "'"unctout: function(eve( over - mouseDse th	var{ usat in) ) {
			pr	},

atchtself (#861vent.pveCl	},
down -> ali	},
abs = Maush(this);

		(;
			}
	aggabeturn 
				drop.splicennermostIntersecout: function(event) {


		// T this.element[0]) {
ui(drag_zInde	isTabIndexNaN = isNaN( tabIntOption..ui(dragns[ keynt)
noop,
	on( oprClass) {

e droppa {
		var tpe[ prh ) {
				/ht >rentIt to just tined th", evenction( i,ight
			tainmenting or,ptions.hoouseDelayle){
			this._igger("activate", event, this.ui are same element
		if (!dranTo("relatie usethodCall )th: elf ((latita(eveive", { top: b(thiHifor (is.wem.hes.activeCdoen[ pa07,
		NUMlu {
	vWebKgnoreosititch reparewnts[v
			is._mrid: fdth: x1 ex
		ii			}(drags[i].top;
	is.accept =r a widsget inhewebkientPg/able_bug.cgi?id=47182
		} e, this.ui(drag = $.top;
e inher ).(dratrigger("activatet ) {))) {
			if(thent, thippable- {
	].item ) ) {
				i);
	s.ui(draggabeferencptions.hins = {
			lef", eve	isTabIndexNaN = isNaN( tabInut", ev.ui(dragtotyToTretu the manager
		$.ui._pt.call(i
			if(!o.able.currelass(this.options, silons.hoverClasstoty});
!relatihoverClas	},
All(ffset: { this sertB0] === this.tOption.ap
				overLe (!drgable,ginali.intersect(ctivateui(draggab 13,
		E &&
				inst	start: fugable.ui(dragh, hei;
		if(this.options);
			}
			thdeactivate: ut", evewithin the tePseudole.current		accept eft,
			cusTabbis._triggem: inscustom) {

		var draggable = cnt is wienIntersect: null
	},gging").each(function() {
		(!draggabl_elem

	_activateement.wi

	_activate: funcent
		if (! (draggable.curren ( runis.elem old constructui-droppable");
			if(
				insabletions.greedy &&
				!ins) {
			if(this.optio		!inst.optionse; }
			inst.opoverClassight
				e usrizontalOfturn false;

	rn false;
		}

		 ),
		/width: nts[i]optiont._tr  th// 1.("mond un() {
	in= ove) ) {
			prt._tr[0] [Name) {
	]t: c.p2. 		if(thibs
		};
	}

});

$.urn functis.accept // 3droppable, toleranceMode) {

	arent,
			offset4.ntPartop, l				setTi// 5gableTpos[ 0 same eoptionshasthis.lement.removeClance pagction(drag ) ) || 0; !e.positiaggable and droe.position.absolute).left, x2 :t	if(thiollbarWidthelperProportions.width,
		y1 = (draggable.potOption.ancestors bs || draggable.position.absolute).top, y2 = y1 + draggable.helperProportions.hts);
	},ted toon = falsaggable.position.absolute).top, y2 = y1 + draggable.helperProportions.hionAbs = roportiounctiondata(event.| c.elkeepthis.lass(this.options.hoverCeturn {
	er;

this.ation
		//Ugfunction() {
	rentIteging").each(function() {
", o._isX - eventProportions.h elem==lperProportionsffset: t$efixn witui-droppable"); - of}
			if(this.opti) {
				!(draggabl( pos.length =) {
			if(this.options.a	this {
			element[ effectName < x1 + (dElemenl
	},
	- mouseseft: elem.draggaIEollS8f (!draggsing: usmo3
			 this.port.scrolportions.height / 2) <inter":oable( "oveageigh.dat.absCode: {
		ifl < x1 + (don(event) {key === "accenst.element[0], (draggtOption.athis._lem, dfunction(d) {
);
		return dataName ) {
			return function		),
			left: frontre i !== this.le = $.uirs from th.call(lt ) {solute)s( "ourrentIt		// didires._mo tiveositio$.exe;

		//  !== tis( drai.po", o._rohelpwise we'ry.comWidget.prototype._seger.curreagga		draggablear t-droppable");
	ight 


// dlass(this.options.hoverCdeactivate: functionturn ( x > rerenInportioisbacks a;
		verCdns.rev{
	version: "1is ] = roportio);
		}
		if $.ui// Left .ESCAPE		accept =portions.height / 2) < b )element)efereoptions.hleft;
					th

		if(turrentItsing: usaggarflowX alue oe weunctiooveCla ||	// Left eify aruching
				TAB		accept =// Surrounded out: null	if(thilperProportions.hbs || draggable.poe + ".poptions );
*/
$.uion = false elem.e + ".p scr  "default": [] },
	prenalPaImmediatePro;
		}

};
			marg==  scr			offdmanager.droppablehelperProportionsed to ]( optihif.toL		accept =pareOil if d 1x2 > r)		= r) ||	// Right edge touchiy( options..ddmanager.droppablepareOoptions.scope] || [],
			type = event ? event.ype : null, // workaroun scr #2317
			list = (t.currentItem || t.element).f)
		if ( ttion.left<= b) ||	// Bottom edge touching
			s);
			}
			tions.ho = value;
			}
) {
			if(this.optiooportions.widtdraggaWeate"uon( ht > n insrties (aria-described - xft = wit meartablht(),.constrpos[ 0 rn functi ? t
				up(ts |erlpturrtabelper.csswe br) {
forble andrn functaeLeft,  listquery			childrenIntute).left, x2 = ; j < list.lengludeggable and droxtend(inst, { ns.height )"ss("display") !=".scope];

		forurentItem ass("uiidbsolut
			};
		}

		arguments);
	},rn false;
		}

		if(toppable.offses.options.hoverClats);
	},.position.absolute).top + (				return 
		activa this.originalPageX 		),
			left: + Math.round((paeturn preprototype._setOption.appl/ Top edge touching
				(ts);
	},y2 >= t].accept.call(m[i].element[0],(t.cu		// Bailsing: usnce.efectNp,
		x1 = (leme838st.sorse;
	ce: nut( pos[ 0 ( $.css				etur && uperAbaseult:
	le=' the liscausleLeft, redefit|texuperAte tt;
		le=': (parenOverAxleTopy ofelement:.absolutriggck &&
					
	_cength ===offset();
			m[i]. top, "
				contineryuiionAbsn[ paetCreate this.SPACEt;
		nges(#8060] !== m[i].visible) {ata(event.ta elements in the  = droppable.offset.top, b.positicrollLe"scrollLeftppablttom: eight )lab musg
				(y1 < t && yrollTop()	ontadefinede helpoll :dragg = c;
;
	}thick:
			setParent;
	})( $.f
			return (.element.offset();
			m[i].bled && Widget.prototype._setOption.			}

			Height };

		}

	},
	drop: function(y( thiction( ec( pos[ 1 ] ); Bottom edge to= r) ||	// Right edge touchig
				(x1 < l && x2 > r)nts in the event);
			}
.ui[ moduleisabled able if us= m[i].element.offset();
			m[, height: m[i].element[0].offse			}

		});
		return
		ac(i]._activate.c ||	// Top eisible) {
				contiue;
		le &&l//Activ" ).bind( "sced directly fr= {
			lef", funlass(this.op				}


	_deactivrenInterpable-disablementsByr.preth,
	"&#160;ollbarWidt		//If		thnt.addClass(thie, even	draggableTop =ancestors gable.positionAbs || draggableancestors 	m[i].offset = m[i].element.offset();
arent,
			pageX = event.pagement[0].offsetWidth, !draggable.oancestis.oggable.options.refreshPositions) {
			$.ui.snt, Widget.prototype._setOption.e.
		if(drapply(this, argumenancest t <= y1 && r.droppables[rn false;
		}

		if(this.accept.er.cuons basClass) {
			thisons bas the cur !== ",
			// es().a( element );his,totypeept Proportions.height,
		l  module, opt
		//Run throughetName, thall(this$.isE	_suositio(	x1 = (ll,
plugis, 		}

s.tolerance) = wtoleran = posit;
			}
			thiger = {
	aggable.element)[0] ===toleranscrollecustom) {

		va				0,
.toleran].item ) ) ound: #st.maent) {

bj) {
ickd( ".ui-SUBTRAChin = y) {
e toisdiv styl(edy) {
		;
		}
{d droptainop
		} < ( 			ne}et.clic	paret.extendidget();
				lemee;
		eanage				setTisame scope
ity" ) 				yrefestance.op}eedy) {
	t.extend);
	},
roppables elem = () {

			veUniqueIOM eleeft + rigis.accept ={

			 (ts ||o
		//ith same so
		//.getWithinInfo( opti drop		}
		}the d$.ui.ddmana,.add("drageDelayMed by resiza("ui-draggablent[0],(drppable[0],() {
				thisppableable1
* 
			// we odValued
			if (pa {
				parentInsta=== "iso;
		} ecroll) {
options.diseedy) {
	 gree && thisable parents wstance._t.prototype.a| opn through 		inst.optm[i].visible) {
 check their positions baspable ui-drrtions.height,
		l t.prototype._setOption.applem || driveClass) {
 || [], function() {

			if(this.optis || bs |this.accept.c+ atOfiv styleodCalledUictiole){
			this._t );

	// reedy: ui.isWindow = $.this.optInsthis.op
			// wer("activatger = {
	t;
		if(teight cEND:ln() 			return d.is(va$.conta = false;
				this._d( instance.	});

	},
	dra
		activ) {
		alf
			, i,e "tgets th) {
		s, jqelement)) &&
				$.stance.iso= o.accept; "isover" : "isout"]s, this.event, tru!inswidgeF	rs d = this.		!inst.options.is.propor		});
		eInt		parentInstancg")) {
			thoporti;
		//Call prepareOffsets onwas caused by drag (5003)
		if( !draggable.options.refreshPsLefions ) {
			$.ui.ddmanager.predraggablllTop(),
		[ggablenstance.isodth;

	
			th.ui(dragg;

		$( "bode + ".p(v, 10) || 0= falsection isNumber(valurrent greefset +  o.accept;aggable.element)[0] === fire return scroll evst( poswhen overflow was caused by drag (se "." 3)
		if( !draggable.options.refs( draggable, e){
			this._st moved out of a greedy child
			if (parentInstance && c =( instance.tInslass(this.options on posi;

	s.options.tion			parentI)+$.css(turOption
					re __sshetInsta//y use		retur{
				 "<a>" )st(this.ocumthis.lem = $( this ),	// Bail if drager = {
	);
		};
		this.er.cus.elemay instInstsable. false,
	("zIndex"),10) ||: false,	t;
			"n,e,s,w,se,sw,ne,nw won't out") {
				parentInstance.isout = false;
	anager.droppable				parent;

		// Baiver = trent;

) {
	r"ui-resizab) {
", o._			parentInstance.isover = elemenui.elemnstance._over.call(parentInsnt, ui) {ent);
			}
		});

	},
	dragStop: il( "body" ).unbind( "scroll.dropp.rem			th= $.		drop.spli.scrollSs("zInddraggabl| "ui-rethis.element.addzable-helpees && this.eo.zIndex)zable-helo.zIndeables[o.scope].push(t_[o.scope]
	retur false,	hel		start: nudroppable" );
		//Call prepareOffsets one final time since IE does notarea| return scroll events when overflow was caused by drsetHeight }	animate: false,
		animateDuration null,
		stions ) {
			$.ui.ddmanager.prepareOffsets( draarea|ile, event );
		}
	}
};

})(jQuery);
(function( $, undefined ) {

function num(v) child ) null
	},
	_roy: fset scrodraggablnt */) { o.accept;nctions.height,$.ui.mouse, {
	version: "1.10.3er to the new current  "resize",
	options: {
		alsoResize: d the refe	animate: false,
		animateDuration: "slnnere opti};
		this : withinEoption. It [o.scope].p;
		if(this.options(parentInstance && c === "i to absoent.outerHeighton: fwidgtions.ld child no	div.cs  the < withinold child no= this._is.element.css(s, event);			parentIer: c.helper,
			pNesition		mapNameuring thollisionWifunctioextend(s( "posiventClicplugi	m[iPosTopVet: { i.ddmanager = {
					nst.elemenble.helperarginBotto" : (intersects && !ts widgons.my[ 0 ] =ger = {
	s.elementthis.accept.cae")
			);

		ss({ marginLeft: 0, marginTop: 0, marge.propdraggables
		setSUBTRACT:his.options || bs ction() {

			if(this.optiarea|iop = withinOfnt, ui) {("ui-draggaromHeln;
			}
containm;
			this.okey, heigh 0, margin!inss("resize array
			this: function(kethis.(this).data("ui-drax",
				po;

			/nt is window .originalElemnt, ui) {
		var o = $(th "static", zol element t[inalE $.widget.extling the posbsolu", zoom" ) {
			handllass) {
	tName: namlement.remos.element.addC
			this.origirt = e,
		handles)& this.vislElement: this.element,
ls || rs his,margin)
			thiction( event )nallyResiz);
			this.orray
			this._pro/*jshions;
	elpelex				15		ponPosTop,et("ui.d			r			this._er.curaggable.po)) {
			if(thisin: thisnalEelem, "s from th
		}ight tOption.ance._aggable.elemraggable = $.uieTop, t, droppabte).top + (dts.push(that).clone(sw: ".ui-resageX }
		}ute the helpers posi.hoverCuccepElements.push(this) {

			if ( tt.prototles === "gable.options.r
				(y1 >= t && y1 <= b) ||	 String) {

			if ( t = falsenalElement.cssr.droppables[draggString) {

			if ( t$.contains 0, marginTop: 0, maroffset.top, b && this.visib		// callbacparevisiull,
op =d( div );visible && t	return fa from draggane,nw";
			}

			t;
		if(t				axis i-resizable =i.ddmanagoportionallyRet;
		if(t)scrolled = ui-resizable this			this._prop.ui-resizstance, eve".call( napItem: s.height / 2{
					axis.adClass("ui-icoons.activeClass) {
			thiottom > 0 ) {
sw: ".ui-r};
		thisnalElement.css		// fix handlerne,nw";
			}

			sizable-h ".ui-rese, true, mlyesizable-horticomnPosLon
		handlesnt.left.options. What's going on here?
	size();

		}=== handle)  axis, pads.addClass("ui-icon ui-icon.element,
-diagonal-se");
				}

		this._renderAxis = frue);nges false,|| this.element;

			forion.marginTop,
				if ( ovhis.handles) {

				if(this(!$(".ui-re" false,"ents.push(tconstructor === Stringarget) {

			 function(tt) {

			var i({ margment;

			forsionPo - ofction(event,raggable){
			this._triggeement
				this.handles[h.elemetion = true; re funct= $("<div class='ui-r event *	draggable.elemen this.element).lidden;'></div>per,
			pI: jquees.pution", zoo.data("le");
			eunction( drnstan;

	},
	dragStop: his._moive.plll : 11{
				appene+ myOdiv.cs20)
		e.cliip"  + "-d {
		renbin $.cssnCn func= this._mi :
						/se|sw|sax:
						/se|sw	if (parentInstance && c === "i
			n/.tern funct to th {
			this.acceginRighpos = o.scope] ||
	widgetEvept: "*",
		e='diselement.addthis._mouseroy: funment.aggable, thld child nodes
	 >t anythinappenetarget: .css("top"),
		ld child nodes
	the same pro|n/.tew "accearget.css(._mouseUpDeleed to keepns, sETE: 46argeif (!droppable. $(tp" :
						/se|sx: 90,

		// callbackns.help.10.3",
	widgetEvtion(d) {this.handles[
			return flow:hidden;'.cont/.test(i) ? "Boleft;
					t+ o.is.originalElement-op" :
						/se|sions.rom" :
						/^e$ll,
		stopWrap the element ,
	stop: functicss("margis.mouseover(funcs = this.			if (!that.resizint.css(this._here's not anythinnt.css({ marginLef
			}
			this._trigg $(".ui-re[o.scope].ps/.test(i) ? "Bot(documen	//If we m" :
						/^e$/.tesesizable-handle from dragg,
							width: 
		}
		ip: this_handles.mouseover(fun [ "padw)/i);
				}
				//Ax(i = 0; i < n.t
			this._proportionallyResize();

		}

		this.handles = o.handles || (!$(".ui-re." )= this." + childeName.matc this.element).resize",
	onst.element[0], (draggif	rs BidgetInstance.ui(draggable))"abled)r: fs this inforation
		//Ugabled)
					left: ce.curthis._trigtion.abstance._ $(".ui-reaspectRatiodled = true true ?			};
abled)achedScrollbarWidt		this._halize the mouame.matc		if ( , event);
			}

lize th.abs(r -stance._,
	getS._mouseIn
	getSc useUp(eves, event); "resize",
	o));
		}
	},

	_deactivate: abled) {
					}

			returabled) {
			ainObject( valodValuebled ui-resizable $.ui.ddmanage			rIerClhe sorlass(this.options.hoverCe, thi {
				return;
			}
			if (!this.opt "none";
			if(!m/ element is wisame proe: f: h" ? [ h/(re, thisw-y" ),
			resined after as.outerW	returlogicopti989roy:= functis) {
				return;
			}
			if (!thiinst.snapEolerance)
	les
			if(tyent
		i));
		}
	},

	_deactivction(draggabldClases === "all") {
				thi) {

			if(this.opti_zInde if this.ofmate top"),
				lefresize
			anage() : a.- y2lay0;
	sable(	}

		}

	ally
			"a" in.ancho del009)
(),
	all(thist(i) rototl)/).teandles.optpper )ositi;

	bas === outes,"ovey
			)></div're go[0] ===|| d		}
			sc. (#2804roy: e.offset.cli.marginLeft + myOppaby instfter( w()alse;

	.disabl) (#40tstart;

			if tAfter( wrapper );
			wrapper.remo of exis to repla					i) {
	in	}
	}
});
le, event ) {
		//Listen		children!insa("ui-resizable"nt)))) {
				contin <= r) ||	// Right edge touchin
				correct pafset: {  i, j				//The padding t on spcursoart =  $.attr
				left)			}

			// Filter out op >= contisout = true;rigger("activate);
		_dm[i].offset = m[i].element.off			retue);
		_dt);
			w on specific tolerance {};

			for(i = Top edge touchie);
		_draggable, event) " y2 <= b);.hid: functitAfter( wrapper );
			wrap -= oent) {

		var
				width: wrapper.outerWidth(),
				height: wrapper.outerHeight(),
		ement.addCl);
		_dage colletAfter( wrapper );
			wraphelps.height /e = $(this.handles[i])[0];
			if (hanreturn;
					}t[ i ]  || $.contains(haeDelayMet) nt;

		this.rainObject( valt;

		this.resitom" : "middPropore = $(this.handles[i])[0];
		is).d
tScrollInfo( 
handle = BackrRighodify odeName.mat.preventClic "div" em, maalue nonull ?riabl targe isTabInem, mtion	_destroy.offseto._zIndex);
		}
	}
});
Pos.left })ction(arginTop"), marginRight: t,
			isWindowClass) {
			thisance.isover = myAlass {
	reeturn that.[ositi height:arginBotterProxy();
e")
			);
edge touchingsable.
		zIndex:);
				}

		plugouterWidth(), height:	overTop&& thiss thhelper ? {d using itdth(),ement.widseStafullNaPosition = (" rtabl[inalPositer");p };
		th1"left" ?
		) { cyAable || (ight1is.options.erWiisNaN(ht: effset + dspace,
	n;
			}
[et.clic,this.i ]ndle, event.itOffset[roppables)) {
				captur+ht: e iginaetLeeY };

		g once - ther,
		};

		/spect Ratiase = $.WieY };

		/left: event.pagelement.position(),s.hide();
				ix
		if((se,
		erHeighoverflowOf.heiset.top < o. x1) <ion ther to turn eDelnermostInteht: el.oght) || 1)1

		cursor = $(acityresizable-" +scrot.sortaalseerWidjointop: set;
		rounded horizllTop(),
			 $.data(th: funtAfter( wr		if(!instht() } : { width:le")
			);

		instance.curren("ui-resizabl		this._propagate("start", event);
	ition (textare		/ne|nwlElement.css("marginRight"), marginBottom: this.originalElement.cs.originalSom") });
			this.originalElement.csss({ marginLeft: 0, margginTop: 0, marginRight: 0t to have vottom: 0});

			//Peturn true;
	},on.top,
			prevLeft = this.position.le.originalEnager thwidth }}("relativ				}) {
		var t = $(ui.helper), oo._zIndex);
		menfect
})(jQuery);
(function(ert
			e inher=== ultanceorigi {
			r( $, undefined[0],(draggabe;
	enutItem || draarat-1-eoluteiveClen);
	" jque,
		greedy: false,
		hIT */rent(s: false,p >= nce t

		this.case "!triggreturn d.is(accept);luif ( runment[0].offsetWidt ( x2 rence and positions to the manager
		$.ui..top;
Menulement.removeCl- mouseulagement { using: usfiheriti: jque{

			nd("mouf ($.uiositiont);

bub
$.uie newrough ns({
	 // PutanceMet:entsure = s._mouseMoveD			this.accept = ecalculated (see #5003)
dragg// PlickOffset || draggable.offset.click).top)		that..toggp" ], f);

		if ( || dix a.extendute).left, x2});

	ontar: fve", { tortions.height )hift w.addClass(thisoi-resizportions.wimentstroy: 	var data,
 functpe f dropbind(ns[ key ]// Pex
		varo !doc		a = che(data_+ "px"target | dropreatePseunt);
querypaceze =proxvar i, hand Bottom edge touching
				(y1 < tns[ key ] = value;	if(m[i].options.disabled || (t && l
	},
	aggable, th.css(props);

		if (!this._he			this.accept =ze", event);

		 ( !$.isFunctiohis.handlr("ovess("di method '""s;
	top"));		this.handhis.visive();
		}

 this. === sbsol[0] ==={
		v	}

});
if (tthin ) drop zIndexs.elemmed ));
	x") {
			ull,
stetEvenUL.widnPosL.test(thi objecements.autocorr "px";tem > a"able, event ) {
		//Listen for scrolling so that if terflow== pre soff ( !$.isFunctileft, top,
			o = this.options, that = this;

		if(this._helper) {

			pr =setw, s, :has(a), top,
			o = this.options, options.my,
		{
				return;
			}
			if});

	setw, s, top"));
	childrenIntlbacks need tis.e			if (  */ ? 0 ck if the elementnone";
			if(!mins callbacks need to seUp: func();
		} ( x2 < l && x2 > r)		,
		P	varr.applf the i handler {
			ptions.at*/ ? 0 : th= { width: (that.hel);
		}
xpale)); && x2 > r)		find(":data(f (this.positi		width: elem.o
		this.asoin("s(thistion: c.positiize.widte();
		}

		// eight
			lse; }
		}[_triggseDelelement.cs/.test(.top;
	 s, libind(dow =op levrseIltom:inLefy) {
			 el ).csoffselper.cs,			return false;
 s, lse, {
] |||| "div>"er
		deactt: left  {
			this.top;
	is.esize.widthtop = insss("left"), 10) + (thel.width(), heig	ffsetnt, prop
			if.toL	});
		// create selecto (t && !m[iementsverCl soffsetw, s, th = ista && $.ui.hasScroll(pr[0], "left") /* TODoffset +, function(nt.css(totypptions._helper;& valuevent, 
			scoffset frnew= Mate elem
			l s, 		if (theDelegateation")ables(l - x1janed
elem, i, mply...
	nges d valueem, matbor
				iconcat(are();
		}rop[i] === tzeDiff.widthelper;

ouse, {
	versiallback if  = {
			m if the dra#2317
	3)
		if", function(&& !m[i].accefine		hoollapseAlis in 

		thiefined("left"),axWidth : Infinity,
t[0].ofement)) &&
				$.y2 <X - evIs, lle,
			capt/.testrp ] height: 			vr.height(tight: 
				top;
Height) ? of ( !spectlue ) ) optionpdateVirthis).s, l: wrappty
		};ction( i: "se";
	= this.options: that.sizeDfunction(ehis.optionsht: isNumber(o.maxHeighidth : 0,
			maxWidtate aisout = true;.optioeVirt.size.height + "px";
		}vent) {
		var i, handle,
			cxy();

		alf
				t < y1 = "isover");activeClass);
			}
			if(this.ophat.position.lefidth : Infiat.originalPositi		if ( newOvratio  && y2 <=itiokey ],n {
			draggabl	}

		r// Thesing cps.widX = oves, scr			lidth : Item
	e us// plugins caldge touchi= event.ction( draggable, event ) {
		//Listenptions) {
				return;
			}
			ifss("left"), 10) + (that.positiht * this.aspectRatio;
			pMaxHd horizontt) {
		retubacks need t(dat !== this.ebacks need to be calledon: "slow",
		an

		var draggable = $.uia(ui-all(  (sub)/ plugins cale || (draggable.cue) ? d
		if spectR}
		
		hn
			ze.heon.left !==ft"), 10add		}


	_desinWidth: isNumber(if (this.position.top !== prevTop) {
			props.lper "px";
		}
stance._ata.left)) {
px";is.size.height = data.ortions.is.size.height = data.tions ) {
				$.th)) {
			this.size.width t - thement was rata.left)) {
			thfset: wi data ) {

		var cpos = tthe element was rble.currentItem || d= $.isFu the curthis.hel

	_updatt();
		if (isNum.left;
		}
		if at.sizeD|| draggable.elemtop + "px";	} else if (isNum= data.height;
		}			csize = this.size,
			a = this.ration is thasition,
			csiz	if (isNumber(da(isNumber(data.wi		),
			left: (
				g) {
	t;
		}
		if (isNumber(data.width)) {
			this.size.wheight;
		}
		if (isNumbers = thasME: 3		that._ha	var dragga			}
ight * this.aspections.actass("ui-resiza				capturs
		,
			o op + "px" };
			vent, t(that.elementze: finObject( valHeight = b.mt)) {
			data.widtherWi(
				p.height * this.aspectRatio);
.width)		minWidth: isNumber(h < data.widlue);
			};
		}
		$ent.css("ma && y2 <= b) ||	// Bottom edge e-n", e: ".ui-resizable20", s: ".ule(even(parse -> align, skiphis,gexo = thilement[ effeffsetw), heif(rs) {
				rettructor =y();
					}
		testEo be actua[\-\[\]{}()*+?.,\\\^$|#\s]!== "nu$&ect(props) )er === "		}

};

/*
	Thight >andleanager tracksPAGE_UP  the scroy UI - vPag < l && x2 > r)	}

		retop + this.size.height,
DOWN  the scro	},
st(a), ch = /nw|ne|n/.test(a);
		if (isminw) HOME  the scrol ? [ inalPosEmptismaxw)  ch = /nw|ne|n/.test(a);
		if (isminw) ENDHeight;
		}
		if (nalPa,o.maxHeig ch = /nw|ne|n/.test(a);
		if (isminw) 			cw = /sw|nw|w/.te), ch = /nw|ne|n/.test(a);
		if (isminw) data.width = o.min), ch = /nw|ne|n/.test(a);
		if (isminw) LEFT  the scroidth : I), ch = /nw|ne|n/.test(a);
		if (isminw) RIGHnHeigh(that.size.width);

relati (this.			ofDiff.width;

			s = {/ Bottom Half
t - that.originalPosight axWidth;
		}
		if (ismaxh) {
TER  thop + this.size.heiSPACnHeight;
		}ectRatio), ch = /nw|ne|n/.test(a);
		if (isminw) (x2 >=Height;
		}
		if (ismaxh && ch) {
			data+ offset;
		 isNumber(data.heop,
				ourseInt( /sw|nw|w/.teallbackp -= on() {
> align ouseHandled = false;
}	dh = this.positnal haki+ thertical posllyResize();
			}
	( !drant, 	});
sition.to	return;
		vert:ev.maxHeigh	elemennt is wind+ ) {
		try 	return;
		}llyRe+is._proporition (text, ismt,
				outerWi "^ffsett && (o	return;
	= thi? o.minW	left: 
			if (this		daration is the requested one
	odCall .marginLeft + myO				}
	, ismffset null
	},
	_cw") {
			data.page, tions.ref];
				borders	elemlittltchis ) {
				dr (this.	}
		ta.wease.ctions.s prel.css("paddiectRahe requested one
et.clicpaddiion.getScforceeft = posment.csl.scroll( !draresizisionts[i]) {

	return;
	sh({
		wser
			oototyp.autohat.posic.position,
		ate a		rets, jqWidth, ider treturn;
sition.toppaddinwidth: (that.he	return;
		}

		var i, j, borders, paddings, prel,
		];

			if (!this.borderDif) {
				this.borderDif = [];
					borders = [prel.css("borderTopWidth"), prel.css("borderRightWidth"), prel.ccss("borderBottomWidth"), prel.css("borderLeftWidth")];
			= b.maxWi0; i < thicss({
				height: (eldth : 0,
			maxWidt	left:							// Cif(this._helpe>width(), heillyResizeElements.lethinyResizeEleme			this.;

		for ( uments );minHeight * this.aspect				.removeDasizeElements.lthis.axi.off0ion(evper not to be vish() - 1,
				height: this.elemenetTop = within.isWh() - 1,
				height: this.elemement
				this. isNumber(data.Name ] ) {
			element[ effectNamei.ddmanagectRatio).unbind(".resizable").find("rror on top/left - bug #2330
		if (!data.width (that.size.widthl.css("bordercss("d.left = ='s;
	']= { width: (that.he& !data.height && !data.le+ ) {
		try : (that.helper.height() -
			dy =esiz	}

		rWrapper = true;

			/// PunWidthntainstance && c =if (pain.iinWi;
(funtion;
ion.absolute).left, x2		this._proporn { leismaxw = ions.heizturn

		// pluginturn { lorderRig	handlermber(da)else if ", event);

		if (this.position.top !== prevTop) {
			props.top = the.proportions.height )s.position.left + "px";
		}
	os = this.pos:ptyObje
			return { function,
		Nls dy])	return event) {
			return th this.ori
					left: his.axiate an inWi		hei		data.
	},
	fltion;
Cnt, 
					ables caition,
= this.originalPositicontainer = cft - dion(, [event,unction( data ) {

		var o = ._trigger({
			hdateVirt resized
		if .left = cmptyObjectuments)t: m[i]() };
			_changf[1] - tapplesized
		if  ) {
				$.ased ont, dx, i!data.;
				pad
		// Pu[pre{
			varadhis.element[0],(dra;

		// Bail	}

		r li paddinositestEhis.t : InfidaWidt
		// Pul.css("bordes.originalSiz) {
	)	soffset sp = this.originalPositi) {
			data.hesized
heigh- ( pa== null ?(a === "sw") {
			data.left =ecalculated (s this.originalPo
			props.top = tions.height )portions.width );
	unction(even_ argRo._trs,
			ismaxw = n: functionuance] );_change.wbridgea else s.heialEle/t-fol		.bindly ).ouwidth) && {
			return $.extend(this._change.n.ne
		vent) {
			return th create an ata;
	},

	_recko ypheleme(o._sh insis.sisition.top/[^\-\u2014s.ori3ft +.test( item.text() v1.1{
				uery addClass( "ui-widget-content ui-menu-divider" ); - 2}
		});

		// Add aria-disabled attribute to any s, jqueryudesQuery
		udess.children( ".ui-statejs, jquer" )..ui.( "get.js, jquer", "true.ui.cery.uiIf the activeQuery has been removed, blur.seleudes
		if ( this.ctable.&& !$..comainsdion.jselement[ 0 ],ion.js, jque.ui.b1.10.3 - 2on.jsjs, (i.cor}
	},

	_ueryRole: function(0.3 - return.3 - 2udes: "udesuery", - 2listbox: "opmenu"y.ui[ion.js, jques.role ];.dialog.setO jquery.ui.menu. key, value10.3 - cordikey === "icons"datepicker.js jquery.findable.jsudes:ui.e" ) - 20.sortab
* httppinner.js, jqui.ef.subsitioquery.u-11
* httpuery.ect-drop.jry.ui.dker.js_super.js, jquery.uii.tabs.jfocusui.tooltip.jevent,.js, j0.3 - var nestble.ct-foed.corer.js, jqury.ui.efy.ui.ry.uy.ui..typequery.ct-fojs, jqueui.effecrollIntoViewjQueryi.effect-shactable.=Query firstuery.ury.ui.e =ion.js, jque.ui.draggablaoppab11
* http://j, jqueuery.ui.efry.uiOnly updatedget.jctabledescendant ii.selre's a uerynsed Moar uwise we assumeery.ui is managed elsewr uu.accordion.jsr.js, jquery.ct-blind.js, jquery.ble.js, jque $, undefined ) "uery.ui.epositioniropps, jquernsed MHighlightectable.par.ui.sition.js,{

vanylide.js, jquer - 2.ACKSPA(query.clos*! jQect-bounce.jque.js, j jQuery Found:ect-tESCAPE: n and other contribuctablejs, jquecordiry.ui.effect-scale.js, jqkeydow, jqtepicker.js_ND: 3uery.uiexisttepicker.jstimerCopyrigh_delay(.ui.menu.js, jqER: 108,
		NUMPAD_M	}utton.j: 109ion: "1.10.js, jqy.ui.effui.draggable.jsudes.ui.corcordijs, jq.lengthry.u( /^mouse/./*! jQect-scale.jv1.10.3 - 2ui.effetartOpening(js, jq, jquery.ui.efctableMitio.ui.effDOWN: 40effect-shaktrigg-fadquery.uuery.ui, {Query:.effec}ry.ui.effeke.js, jquery.uui.tooltip.jfect-highlight.borderTop, padding	if (offset, e.js, ,  jqueryHeyCodeffect			}
	
});

// BTRACThasS.js,  v1.13 - 2
						if =BACKseFloat( $.cclip.js, peof delay[0], "
						ifWidthersio || 0.core fn ) {
		s );
		};
	})( $.fn.focus ),

	scrollParent fn ) {
		
		var scrollPa			fn. === "nu			fn.().top -ion.js, jqueelayest(this.css("po arguments-( fn ) {
		.coree.js, Copyright 2013{
			e.js, Top 33,
		 );
						}
	{
				return (/(relh		}
	 33,
				}, delay === "nun")) && (//(autordi/absolu< 010.3 - 20			return (/(relative|absoall( el +ow")+$.ci.core.LTIPLYerflow")+$.c+			}, delay >m );
						}
	this,"overflow-y")+$.css(this,"overflow-x"));
			}).-s.parents().filllParent = thi.core.js, .dialogjs, ld.js, jquery.ui.effromF
// $i.effect.js!"));
			}).eq(0)	clearTimeout	}) :
	UMPAD_on: "1.10.;
		}
on.js, jquer( this,uery.un: "1.10.yright 2013 jQuery Foundatioi.effect-clipr contributors Licensee.js, jquery.unull				this.each(functiojs, 
					var elem = ton.js, jquer					setTimeotion( delayui.tooltip.jct-drop.j this/).test(this.css("position")nsed MDon't openMMA: lready] !== fixed = Firefox bug that cas
* Ca .5 pixelnsed Mshift in.select-drop.posimenu when 
	foing ove jquercarat ui.e !scrollct-dropposition
$.uihiddeMPAD_!ery.ble.js,? $(document) : scrollPareUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34
		PAGE_UP: 33,
		BTRACT !== ), positiory.uiERIOD: 190,
		RIGialog. !== this[ 0 ] ), position, vaght.ored by t= $.extend(3 - 2of	if ( this.le				if ( por.js, jqored by tth && /).test(this.css("position")) d.js, jquery.ui.effect-bouncoppanotof this fuACKSPAx ) 		UP: 38
	}SCAPE: hide40,
		Enction consistent aizable.js, jquect-dropAPE: show40,
		EsortabAction consistent acre of 0
					// <dexpandresizable.js,6,
		Dred by (|| positioy.ui.effecollapseAllld.js, jquery.ui.efallion, value;
			while ( elem.length s returns auto if the element is positionedry.ui.wui-ir	BACson isnry.ui.eflook fo jquerct-drop.f positocompl.seley.ui.ixedght.curKSPAelay == val?te.js, jquery :: 34,$: 110,
		NUMPAD_DIarg}).eEND: 35,
	rn a string
					// we ignore tspecifieId: functfound nofectidn() {
			ancestor, usejqueryainCE: 8,to ND: 3++uuisubCE: 8s: 18wa88,
scrollP "ui-id-" +s
$.fn.e0.3 - 20 "ui-id-" + (+d.js, jquery.core.joned
				positio= "ui-id-" + his,"ovt-pulsate.js, jq(this,"rn typeof delay == "ui-id-" +
				if ( position === "abs// With.id arguuerys,
		});d ) {
 "ui-idlyectable.sitio-lse nothr
		isectableName it !elemen valquery. .ui. {
		returme;
		ifeffe wi}
})earch(func// selBELOW
	,
		NU this[ 0 ] ),tiont.nodeeq(0);
		}
& visible( img )	& visible(opyright 2013id);
			t 2013 DOWN: 40 	if ( tmap, mapNam, img& visibleAPE: 				// we ignore tuery.ut value off 0
					// <div style="z-indexabIndexNotNaN :
		m.css( "zIndfals ), 10 );fixe 10 );ui.effeae.js, jque
		NUMPADuery.ui.effect-clip_ADD: 107,
		NUMPAD_Due ) && value ld.js, jquery.ui.-highlight.jswIffecarea|button|ob&& "area" === nododeName )END: 35,
		ENTER: 13,
		Eutton.j}
		});
}
});

// pl	!$( e&&= "hiddeelement, isTabI
				position = elem.csct-fo.js, jque "hiddenery.ui.dialogm.css(ilters.visible( element ) &&
		!$( element ).parents().addBack().fiabInde
		TAB: 9,
		UP: 38 ment );
}
		TAB: 9,
		UP: 383,
		ESCAPE: be t-transy" ) === "hidden";
		}).length;
}

$.extend( $.( "pos		}).lendeName )  runiqueIdD90,
	soore z-indsemapnot t vaectabledefined ) {changee z-m.css(r
		ct-drop.")); ATextend( $.: 109,
		PAGE_DOWN: 34,
		PAata: $.expr.createPseudo ?
, jquerflow-y")nextilters.visible( element BTRACTrtab( "mentall o,
		Luery.ui.
	return previofold.js, jquery.ui.		isTabIndexNaN = isabInle="laex );
		return ( isTisF8
		!$( ry.ui.menu.js, jquery.uion.js, jquery.uiddBack().filtrevAll
		ENTER: 13,
		ESCs
$.fn. );
	}
});La/ support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jqment ) {
	$.each( [ "Width", "Height" ], NaN =ui.tooltip.jdire.menu, filter);
		retuighlight.jsxy );
				}) :
	.length ? $(doerfloase(),
		js, jqu,
		LE||fn.innerHeight,
!isTa, isTabIn$.fnelement ).pare: 34,	[fn.innerHeight,
				out? elemeAll" :isNaN(lem, ]:
		// support: jQuery <	.eq( -1.eq(0);
		} el				outerHeight: $.fn.outerHeight
			};

	+ "order, margin ) {
			$.each( side, f0(this,"overfloscrollPterHe||at( $.s
$.fn.ess( arent.length ? $(doterHeight: $.fn.oule( e};
		}) :
		// support: jQu[orig =  ]uery.ui.TabIndexata: $.expr.creaxeturn ( isT || Pagfilters.visible( element ) &&
		COMbase, n")) &nction( el+ this + "Width" ) )on.js || e();
	if ( "arcument) : scaccordion.jsfunction( ply( this,	return orig[ "inner" + 			orig.apply( this, asry.uddBack().filst(this.css(.coren")) & {
	var map, maon")) && (/(au" ? [ "Left", "Right" ] : [ "Top", "Boteach,
		PAGE_DOWN: 34,effec= $urn th(this,"query.ui/).test(this.css("po$( th-me ] = css(Index = $" ], {
	data: $.expr.creffect-s_MULTIPLY: 106,
		Nata: $.expr.cr				}
				if ( margin ) {
					size -= pars: 34,[ size ) {
			i?,
				out:terWidth]},

	ferflow-y")abIndexN;
			return size;
		}

		$.fn[ "inner" + name ] = fuction( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + na

// suppl( this );
			}

			return this.each(function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			});
		};

		$.fn[ "outer" + uery ) {
	$.each( [ "Width"gin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name+].call( >his, size );
			}

			return this.each(function() {
				$( this).css( type, reduce( this, size, true, margin ) + "px" 1.8
		fuudo ?
		$.expr			orig.aport: jQuery <1.8
if ( !$( "<a;
			});outer			}
	() <rn this.each(fprverf"e.js, 			}
	 {
	return select, "tabindex" ),
			isTab// TODO: It should ne	// be|| psible.js, {
		ave		imgtable.js, jat, redt" in poi "imbuon: e /*! s d[ 0 ]ch(funcrowseeent( $before click.= undefined ) {
	on.js, jquer||!== Id: function() {
		retur		// support: jQuurn ght.ui =
		}

		if ( this.lengurn this.add( selecto.haements with an ngth;
}

$.extend( $& value !==ss( type, ruery.uiuery.ui.effch(functioselect
					var uiturn (
 jque}( jQuery ));
,
		PAGE_D $, undefinednnerW
$.queryuvisibnt.tgressba zIn{
	versry.ui"1.10.3ery.r.js, j:	sizemax: 100ry.uuery.: 0alog	ment, :			rery.ucompletor ( i return minototype_crea
			.ui.menu.js, jq// Constrid" initialfect-eTabIndexoldVery.uown" ) r.js, jquery.uSUBTRACTi.efprotoetion, ?
				this.e jqueryT: 37,
		NUMPAD_ADDon( module,Inclqueryu.plugins[ i.com
* Inclcorner-aem, ue = parseI3 - 20d MIT */solu, jqicfect-es,dget.juery.now anidget.juery.max aom covalue ere zsretu_refresh instan" ) {
query"on( module, o
				, jquee === in"	if ( tmihavi, jqueryon.jsuery.Dive !== "<div c* ht='set = instancenstancname ];
			headee.plu| !instleft'></div>e.elementppendTourn this.each(i.effect-shak		for ( i = 0;=== "absodestroyplugins[ i ] || [ame, args ) {
			

function visibl = instance.plugins[ name ];
			if ( !set || !instance.elemen 0;"></div></set. "hidden") {
			retur ( instance.opse;
		}

		var scroll = ( a && ax=== "left" ) ? "scrollLeft" : "nowui.effect-sha
					sen") {
	erflow is  ].prottensions inewion, s img );
	}
ermine whueryead.
	plugin: ) {
				re[ i ] ] );
			}
		s( elem, "marg ] );
			}
		},
		call: function( instatermine whi.parent() {

		//If overflow is h: function( inst// TODO: determine which cases actually cause this to happen
	ctually ca the element doesn't have the scrindeterminfunc=actually causeof ith && elesalugize[ i ].puscordioypeofactually css brnumbry.ui );
(function( $,is, slem, 	// if the elice = Array.p?,
	_cl
	},

Math setip.js, jquery.umax, 	$( elaxurn thimincreatine whic			setTimeo jquery.old.js, jquerr.js, jstart" in Ensure "uery."e ) {}
owerurn;aft( $eId =.elemen (lik( "ix; i ght.	}
		},
lement doesn't hade {
	llName, existingry.ui.effect-fad ) {}
	}
or, baseProll set, see if it's possible to
		// se jquery.ui		el[ scroll ] = 1;
		has = ( , jquery.ui.tooltip.js, jquery.ui.effect.js, jquery.scrolluniqueId:m[ 0 ]allNodeotot lesd ) an set[ i 	}
		},
remove" );
		// httpain unmodiflem, "margfect-fade.js, jquery.ui.effe_percent
			return siz <1.8
if ( !$( "<a!= null; i++ ) {100 i[ mo *onents with no duery.upositiomin ) /onents with no d namin
	$.expr[ === "abso		for ( i = plugins[ i ] || [) {
	var fulrototype allows th
				( !prototy},
		call( !prototy?
				this.e
					seAPE: togglener" + nice = Array.p||" )[ 1 >n
	$.expr[ = $[ namesp
* http://j| !instr );

." )[ 1 uery[ fullName.toLowee ][ nw() {( ( !prototy.toFixed(0)" + %ui.effect-sha;
			});ame ] = function(tance.elemenname ];
	cons( this, name ];
	constunction( el		}

		// allow instt-blind.js, jquery. 0;"></div></div>
		if ( el[ scfunction rototyverlay	sethis,"overflowove always [ i ][ 1 ].apply( instance.elemenove alwly used by zable
	hasScroll
					seti.core.js, LTIPLY: 106,
		N, $.ui.positi3 - 20llLeft" : "scro	if ( tgerHandler(  over any static( el:[ i ].pusx = $.aomponents wive always passes args)
		if ( arg		return trus args)
		if ( argume		retus,"overfl components wiption, sss buery.ui.effesh( [ option, setoesn't hatend( $.ui, {
	//ment, 		eventig[ "innent ) {
		// allow instantiat$.extend( $.,
		// tract ) {
	gets that ted. Use) $.widget( extensions instead.
	plugin: {// s ) {
 ose;
gese z-a sluery;

	(howi miy UMPAs can youtype  up/	NUM		}
go throughurn twhery.rnt, )
ght.jum;
		s = 5; {
		add: functiase();", $.ui.
	focoption, set ) {
			var i,queryuE.ui.Prefir.jsase()"alog
				proto = animto.pluf it condisthis ototy= $.ui[ moduleins[ i ]		orirotoery.ui"horiztocol{
			new idget.extendstep: 1dule ].prototy 0 ];

sr ( i in| [];
callbackunct
			for ( i in sase()lue;
			rettion
		}
		proxiop			proto.plug proto.plugins[ i ] || [me = nkeySli.attre,
	_cleaabIndexNaNuse{
					return base.protot = $.wiOfflNamrn't hais.each(ndleIndexype in caseBTRACT: tectO( prototypuery.uprototype[ Ini ?
				this.eargs ) {
			var i,
				setthe opt + over Inclase();-" +// allo( prototyp				var __suqueryu
				var __suqueryui.com
* 
				var __su| !instanceon( el, a ) {

		//totype[ propcket/8235( "ry.ui.resizrties
	$.extes, jquery
				this.eaents );
				}urn basection( elem )		var _super = functionproto.Rnt, totype[ propproto.Hly = serApply = _supeupnherie;
			};
		})croll ] = 1;
		has = ( e returnValuereturn !!$.data( elemi, ply = Count cons ) {}
	}	// allow inst consexistingrnValue+ "px" );
			});ui.effect-bper = tply = ation and other contribudefaulset || !instance.e consply =  = "<a.apply( insg., draggable__suprefix for widgets that are' href='#ly ua>{
				ply =  + a[]or, bve support  =flowctor for plusn";
ctor: construcelement, i|| 1_DECIMAL: 1 use the name s
$.fn.e>ove support  this wi name,
		widgetFslice( fullName
	});ject used to cs use the name + aIf this widget is being0move support on")) || !sfunc( entD name,
		widgetFullNam; i <ove support ; i++ this wi	}, pro.pushng redefon")) || !son.js	}, proxie name,
		widgetFadd(!== widget. joem )"if ( zable
	hasScroll: functiohis, argumenbased
		wg to replace) {
					sying to replaceemoveData = (fu i this wi== "numbe.datafunction() {aggableions,x",var ;

$.widget.extend( bApplyreturn !!$.data( elemidgetEventPrefix
		// alwayapplyroxie""nction( elr.js, jqunt, !rHeight: $.fw version of t
		//	}
}).3 - 201on( sctor: construct.namespawidgetEvonstruct= .spinne_uery.Min()nValue ld._proto ).ui.t0);
		} else {
			namespace: namespacor,
		namespace: namespacss b2otype.widgetName, constructorng child constParen can be garbage ce the list of existi$.isArrayructor: construct.10.3 - 20getName, constructng child constrs bein0d to crig[ e, img,the code abn of tr" + thisn of element, isTabInme, constru[ i ][ 1 ]y used by resisizable
	hasScroll: function( el but inherit refix: exin of 
				var

	bo
			"numbis( ( $ueryost fite the || mannce.framework.apply(functiism );
			 const//	retugth;ed best visually w mapa varietyototthemeunctpply,
					ret
			}
		}
	},

	/anceion() {
				size - );
};

$.w

function visibleputLength =-xpr[efined ) {
				//crollTop"0.3",
ssentin of tswitc.toLot, "totypeto"." /max = slicfn.f	base._	"/ on": "{
				i		"bottomy ] )?
				r, {
		, img,
		no;

$.wn and otheut inher			var(		$.widget( childProt" a ==||strings, arrays, etc.rototy?  __super = t
				/his.w version of t ] )rsion: "1LTIPLY: 106,
		Nion( targe[].fn.removeData();
	});
	creturn !!$.data( elem jquery + a colotion( i,he pr} else {
			};
g = oundatiase.prototoff( target;
} {
	var fullueryarget;
;
		});
ply = });
	ct.prototype.hrotojqueme = object.prototype.ct-fo options ) {
		var w is hidden, the element might havetion( i,ect used to y( key ) && value this, args );
				};
		 value !== undefined ) 
				var __super = tfunction( p				var __super = tverticl && args.lengtthis._superApply,
					returnValue;

				this._super = _shis, argumentype[ Ddden, erflow is hype[ Capturfilters.visible( element ) &&
					if, normion, ,uery}, ba( !elemetbject(,  redern vaowble.			fn.caype[ Over !instarototya + "px" for wientPrefix
		// rom the new.apply( thippen
		// if urn base.lem, "margetFullNSlean=ppen
	ithou?
		!element.dw.]+/.n() {(t DOM-b		}
					if ( !$.isFunctiexec( nal mease.protoetFullNOabsolute= !!/msie [\w.t(this.tors,| position { x:sableSeype X, yor " + name Y,

	en( this, f},
		call( this, fFromMpe[  ( !isNaN( valud( {}, ba},
		calld._proax()erCase()
		// remove+	wids, function( i, child ) {
			var childPght.++ )Dnstance, a	$( eabs(a( this, ferCasatonstruc(i $.fn.rdge( .fn.stance,$[ namue = methe,
	 extendinstance, 		// alue = methts().a		(idValue;at._!isTCent, tion, s||jquery ?
						rValuoexpr[ ).namespainstance, args ue = metthe li			if ( !inste !== "number" ) { rede ===.core.js, jquery					re},
		callxiedPery.ui.effuncti}
});

//  )._init(ce,
	_cl				"attempted to call mete.prototype[ prop ].app,
					_superApply = function$.datecified	if ( !instT: 37,
		NUMPAD_ADD: 107,
		NUMPADust beta: $ '" + /absoluten( /* optionsh method '"		or( "cannot cal = !disableSelection",ted elemion aBack().iements wg., draggable:st
				returnlectturn $.erme: "widget",
	w? { / onotot rop ]0 } oto = 		},
	_ " + name + -urn $.e./ on - 			/.prototype =ithout ":"2't DOM-rop ]dget instancent ) {
	ss("p extend= $( element |n")) && defaulement = $;
		}Int $( element );
	fn.ft: function() {
), 1(thi scr uuid++;
		this.eventNamespace = "." + this.wiB.widgtName + this.uuid;)'t extendthis.eventNamespace = "." + tmargin"pos	this._getCre === "rn this.add( stion( i,hasnd other contribution(
		var	return funcse()e {
					$.datta( this, fs, jquery.ui.effents );
				},
				_s	// if t
				_function() SiedProt: jQuery <1.8
if ( !$(ent, {
				removeDra( this[ 0 ] )ue,
					instance = $.da+ "' for " + name + " widget instancel met
				}
				methodValue = instance[ options ].applyfect-shake$.data( elemeuperApply = functhis.widgetFullN, this.eles._super = __semove: op ]"tabindex" ),
			isTabIndexarguments, 1 )tion visible( element ) {
	re.prototype[ prop ].apply( thifect-shaketverfcument :
				// element sabled: falseent, );
		this._trigger( "create", 	_superApply = function( args ) {
			e,

		// callb( args ) {
			s );

				this._supecument
				element.docum		return base.pro		var _super = functior,
					__sustrurties
	$.exte	// we can pr etc$.widget.etend($.widget.ee, function( p, {
				ralue = instance[ oement );
			 !isNaN( vlative" ||to aTota in s	mespace[ oespace ] = $BC for #78uery.ce )
			//d._prope[ antiation withoe unbind calls inethodCall &&= this mespace )
.error( "no sucs + || thiollPar1.9 BC fos );red by .werCase()					return $		element  $.noop,
	_getCread);
			op,
	_getCre		elemWidgfunction() {
				etFullName )
			// support: jq
		return .3
			// http://bugs.jqyery.com/ticket/9413
		ss("poeData( $.camelCase( this.widgetFullName ss("		this.wid" + o0
			// TODproba3
			// htt/amespace )
a( this, fu	// clean up > 1his.widge// clean up evce &&ig[ "inne);
		this.hovss(this,"ov);
		this.hoverem; (elata( this.widgetName )
			.re 2.0
		// alpace );
		this.hoverants(0
			// TODed" );

	ove dual s, args );
				if ( methodValue !== insvent.p			.remo, args );
				i instan);
		this.hov*it froce )
oop,
	_init:dget is
	mAlign to remain uptionsh ) {
			var elld.js, jquery.ui.effreate"ata( elemuiHash"'" );
	ply = 	if ( t	}, pro[
			ret]torage
				if ( tvar o ) === "_"mponents with no dnstructor,rototype allows th namespace,pen
	et.ext		}
		},
		cal ?
					$.data( thi}
			options  + a colo ?
				, jquery.ents.length === , {
	// tionplugin is de.exte can be useurn;
	he internal hash
			retp://bugturn $.widgeId =V)
			//://bugs.+ name					reveData( this.widsted keys, e.g., "foo.bar" => { foo: { bar: ___ } } ( i = 0= {};
			parts = key.s? }

	/

	focusce + andle nested keys, e.s
$.fn.els i2g., "foo.bar" =>  childPrototype.nn false;
themunctio== 0n";
		}	cur>r ( i = 0.uuidkey ] === un1efined ? nu<r ( i = 0n explic	,
				oute ? nu=r ( i = 0, target[ kses actuall
		//};
			parts = key.sph,
				outearts.le = parts.shift();
		 < parts.le

		if ( prototypethe li.ui.base()e theb;
			ceueryby uery.u					bject	targeion(lue;
		ype[ pption )._init();
				h ) {
				c	baseP				var efalse; this.options );
		}

		if ( typeole ].prot undefhis._setOpti
			undefinehe list.option
					curOption = curOption[ parts[ i ] ]espace +  )._initss bobject( optio] ] ) {
				s = key.tp://bug);
	}
});

$$.widget.reference
				fined ) {
					return thisply( this, ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key,		return this;this.options[ key ] = value;

		if ( key =ed ) {
		is.widget()
				.) {
			varelement );
			this.h
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			iextend( $.ui, {
	// toption = options[ key ] = $.w
			for he internal hash
			return $.the code abn() {
					rterWidth(type[ prop ].a
					returet.extend( {},	for ( key in options ) {
			this._sf key === "string" ) {== "_"// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }}
			options = {};
			parts = key.split(  "." );
			key = parts.shift();
		rget[ k//).reAttr( !isTement, dit fromy ] ==funcreference,he br	}, proxrototyprototype )
		} else {
			thet = functiootype ),
		// track widgion = options[ key ] false );}

		// TODO: determine which cases ame;
		if ngth;
}

$.extend( $ption[ parts[ons: functio0 ) {
			// dt the scroll
	uctor.prototype = $.widgnull, this._getC( i i					sizecument) : scrolents.length = + "-ditrue;
		}

		old.js, jquer"disabled" )  which ca) {
	va+ name parts.length ible = $();bled handling
			tNamespace "foo.bar" => { foo:
				}
				onstead of boolean
				// - disabled class as method for disabling individual parts key.split( cument) : scrol disabled handling
				// - dtor._childConstrme;
		if ery.ui.datepick// aventPrefix
		// s.shiftoptions[ key ]; (++== "string" )) {
		of them so0m
	// lerPrit from
	/+		}
alue;

		lerP[ i === "string" ? instance[ handler ]ch( /^( ) {
		nce, arguments );
			}ion( "disableclass as method for disablference
				ers = element;
			element = this.element;
			delegateElement = tabledCheck &&
								// accept seltor ) {
				dabledCheck &&						( inidget()
				.toggleClass	} else {
				elemenget[ key ] = valuquery.ui.tooltip.js, jquery.ui.effeO: remorage
	sL			if (le.rffect.js, jquery.gth = ie === undefined ) {
					return c	if ( typent ) {
		/c. witpasses args)
	] );
			}
		},
		call	element				size				return ( typeof ype in case w		} else {
tName );
	},rototype = function( handler, delay ) {
		funct"foo.bar" => { foo: { bar:unction()lerProxy() {
			return ( typeof huid so directchildConstrerProxy() {
			retur key ] ==space + " " )"foo.bar" => { foo: { bar:ypeof sup$.Wueryunt.ttoData_superApplyzabll 0 );
	t[ 0;
		if ex: -10; ) {
.js, jq(/fixed/( th"r,
					__s"	},

	 {
					return base.prototypeht have extra conte hashes to be passed on iMethodCall ength ?
			$.widget.et = slicereturn function() {this._super,
					__sur" );
			},
as method for disabl	break},

	( evenms );
get ).addClaents );
				},
				_s: function( element ) {
		thing individual parts
				if rguments );

				this._super	this.focusable = this.fsocusable.add( element );
		this._on( element, {
			focusin: fu.guid || $.guid++;
		e + " var match = event.tance.eventNamespace,
				selector = matcentTarget ).addClass( "ui-state-focus" )e.optallback = tpropusable.add( element );
		this._on( element, {
			focusin: functionentTarget ).addClass( "ui-state-focus" )gth = ];

		data = data || {};
		event = $.Event( evener" );
			},
= ( type === this.widgetEventPrefifalse );//ictstnns[ i ]. getterName 
						(setOptis "strin of mhis._sxpr[e.noer( "a) {
his._s( !$
	{
		fureturn !!$.data( elem, f $, undefined ) {

var uuties over t=== 0 ) {
			// don'his, aruery.uivns[ knt
		// so we need tos reset the target son the new aConsotot) {
					event.target = this.element[ 0 ];

		// prop in ev
			returthe new er
	lanData;
		event.target = this.element[ 0 ];

		// copy ions.disabled === turn $.widgv storage
	-state-disabled" ) ) ) {
					retuunction( e) {
		this.hoverable =

		if ( ss( "	orig = event.originalEvent;
		if ( orrig ) {
			for handler === erProxy() {
			retur., "foo.bar" => { foo: { bar: ___ } }// ctor );) end( bd = copput[ inp
					niqueId++ ) f ( tgetop ] = orig[ prop ];
			 = thte bruery.uedtion( el) {
		this.hoverable = , callbss( ".guid || $.guid++;
			}

			varmatc				handlerPh( /^(\w+)\s*(.*)$/ ),
				evetions === }, target[ kig ) {
			uid =tion( element, evendProelement
		//vent, dat

		rtep-ement[ 0return ods evenring $( el to, betw.ui.(inclusive)rget = this.
	d of boolean
		ement;
			el
		ifssDisabledeven< = key,
			parts,
	appen
		// if the ey, value ) {
		at inherit f > args );
				if ( m		if ( options.delay ) {
	f ( ;

$.extght.f opprobably remove thffect>d;
		d);
			ame ] ) {
			.isFuncadeIModSfect[ eoptiethodValue !== ins) %effecngth -  {
			//nd( {} -ons.e if ( + this.eveValue && ent[ effec) * 2ionsffectlegate(tName ] ) {+struelse if ( eelement[tions )( -ing, cn: "1.10.3",Since,JavaScripxtens problems
			valctio f
	})s, rthis| [];
of ofie need to to 5 digits functiof odecimaln() {
 (see #4124overuery.ui;
		};
	})( tName ] ) ord
		if 5query.com/ti			partsort: jQuery <1.8
if ( !$( "<alName.toLit) : = false;
$(.ui[ument ).mouseup( function() {
	mouseaxper = __super;
	 {
		return !!$.data( elem!isTValP !prot." )[n,select,opt ful			partsce: 1,
	d( consoApply) {
		this.hovern of  name + " prior to inl methods on " + name = $.wiprobaabledChents );
			ent[o.ousedowndget.extend valu+ "'able = $();Widget.prototype[ "_" + method ] = function( element, opt function( i, child ) {
			var childPadeIn,selecprobablery ?
						r.jquery= callback;
		:" ][ tClickEvenf ( methotClickEvent")) {
*;
	}ss( "uvalu.spiatidgetName )
			.removeData( th? t[ keyings$.widge				otarget, thathis.ss( "urototype =ate();1,tch [ ousedown? " = $.wipagatcsser, mvalu,ion(event)  ) {
		this.ClickEwidget( childPrototype.namespae of mouse dgetName )
			.removeData( this.widgnstances				}
(this,"ovemethods, valueis.started = false;
	},

	// TODO: make sure l
	},
	_return false;
		 }roying one instanceelector his.element.uch = event.his.widgetNahis._mouseMoveDelegate ) {
			$(doc			}
		{
			get, tha-ea,button,selec  !this._}r elqueptyObt.ext durtotype,on(event) urn this;Name, thiame, handlerPris.element.unbind("."+this.widgetName);
		if ( this._mouseMoveDelegate ) {
			$(doc$.widgDelegate);
		}
 function(eove."+this.widgetName, this._mouseMoveDelegate)
				.unbind("mouseup."+this.widgetName, this._mo[optionslegate);
		}
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mous		selector ,

	_mouseDown:		return falIndex = $.atLTIPLY: 106ions = {};
			parts ?
						partss = key,
			parts,
arget).closaopti && $.effects && $.e.target, that.wiength : f widget lsest) ?Option[ r pluginseCapture(e:" ]ength : furn true;
		}tName
	},

		e + ".reventCl.widgetName )
			.removeData( thiatePropagation();
					return false;
				}
	tions );
		his.started = false;
	},

	// TODO: make sure destroying one instbase
			$.useInit;
	},

	_., "foo.buse
	_mouseDestroy: function() {
		tey ], valuee);
		if ( this._mouseMoveDelegate ) {
			$(doc			}
		
				.unbind("mousemove."+this.widgeel = anceMet(event) && crol._mouseDelayMet(event)) {
			this._mouseStarted = (thismouseup."+this.widgetName, this._mouseUpDeleis.ourn tuseDown: function(event) {
		// don't let more than one widget 			return true;
			}
		this._mouseDelayMet(event)) {},
	_destroy: $.nted = (this._mouseStart(event) !== false);
			if (!this._mo[optionsted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may nevergates are required to keep c
			btnIsLeft = (event.which === 1),
			// evtName + ".preventClickEvent")) {
			$.removeData(event.target, this.widgetNaemoveData );
	$.fn[ noto = ,
		NUMement );
			this.window 	/*jsh);

maxefinedxity:25*/			retur					retucu = 0;led" ) {
nt[ effecance.optidisableSelection", child.prototype;

			// redef

	focusion( evenect-sckeyCodpe.namespa( evens ha( !docu.HOME];

		mentMode || documeENDocumentMode < 9 ) && !evPAGE_UP.button) {
			return this._moDOWNocumentMode < 9 ) && !evuseUp(event);
		}

		if (tRIGHTocumentMode < 9 ) && !evmouseStarted) {
			this._mouLEF.preven	 " + nary.ui.Dfor wi) {
		thsabledCheck;
			suppressind("."+thnction() {
					ret	this._on(
	removeUnunction() ,
		NUMPAD_ADD: 107,
		NUMPAD_D."+thi )._init();
				} else {
					$.data( thi{
		this.options[new object( optioerProxy );20)
			elIsCancel = (his.focusab, img,ffect[  method ]( optionord (the celement;
			element = this.element;
			delegateElement = tfunctiprototype= {};
			parts = key.split( tor ) {
				ds.widgetName, this._mouseUpDment = delegaif ($.ui.ie && ( !document.documentMode || document.documenlse {
				.delay ) {
			elemennt) {
		$(docntMode < 9 ) && !event.butto		$.data(event.target,btnIsLeftgetName + ".preventClickEvent",s._mouseUp(ev		$.data(event.t of boolean
				s.widge+}
		rgs );
				if ( methodValue !== ins	}

e
	// oth	returnV
		}

		return false;
	},

	_mouseDimouseStartt: function(event) {
		return (Math.maxidge		Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.seDrag(event);
			return event.preveneturn s.widget		returny );
		}
		if ( hascopy the guidhandle mou: function(event) {
		return (Math.max(
xt ) {
					Math.abs(this._mouseDownEvent.	if (this._mouseDistanceMet(event) && ten by extending plugin
	_mouack;
		if ( ction(/* event */) {},
	_mouseDrag: function(/* event */) {},-	_mouseStop: function(/*, img,
		nod	$.data( element, thisetOption( "( elee,

	tDefault();

		mouseHandlhis._mouseDelayMet(event))( elekeyulement );
			this.window s.evenouseup check - mouseup happened when mouse was out of window
		rn this.eacseStarted =
				(thnction() {
					return base.his._create();
		thisp(event));
		ll, this._getCreateEvp(event));
		disableSelection",ument[0].defaultView || this.documenthis._mounher Use .widge() extensions ingin: {.ui.menu modifiobjefthis.event
				urn !!$.data( elemabIndexN.error( "no suchvalransferelement, {
			mouseenter: fu ).toLowerCase();
		/veClasparseInt			return( element, pr this widget is
		// redek widgets that };
}se we'll modify tpinnoptiotion, set ) {
			var i, for wiEjquery: "<input: nam
	// inheriting from
pinr i,
				proto = cul			var( i in sui.ef: functeventD
		iui.e-tria);
	-1-s{
				/[\+ight(),
			offset: {ery.ui(),
	ncrqueryal:_mousrototype.( i in sins[ ( i in ss ) {
FormaPrototype[ ype i[ m	if ( !$.isFuop ] = value;
			retpefault ) {
	xiedPrototype[ prop ] = (function() {
			var _super = fu// essentistrr
		t[ prop ods need			}( "d
		}all(y = _superApply;

	}

nValue = value.ntiatApply = _superApply;

kEve {
	scrollbarWid] = funt()
	};
}

$.positif opdScrollbarWidth xt ) {
	
		heif {
				});istanceretund( ( : functiodefined ) this._[0];
	if ( raw.nod);
	}
});
s ) {
				rawtotype[ propwidgpluginy.ui.name ] = funcerCase();
	ll( eleptions(off autoefined avar rauto;of obrowserons );t() ) {
r
		th	runiquuery.uhe brnavigae thty directhi).rey,nctiwe re-enjqueildren()[0];

		hei

var tions is unloadinput ? "sly onins[ nis idden, ed. #7790='height:100px;widwindow key;


			w2== w2 ;

$.widget("ui.m simple inheritance
		// mustdren()[0];
.ui.core.js, jquled = fgetCroto.t/8235
		} catch( ype that was
			// o{( elem: functi{
	var map, mapNle.adgin ) [cachedScion = {n cach.butd ) {
			vaollected
		}

		// n array i, $.ui.positio	hasOverord (the cuery.uss bead.
	plug&&fect-exlement, isTabIndoesn'trs can b					rethis._on.js, jqueryuery.uir to initled = f$( "bo	event.preventDefault();

		mouseHandlrn this.eac} else {
			n curon getOffs	NUM						this.namespahis._mouseDelayMet(event)) handlfset = /[\+"
	},
{
			ct-fold.js, jque= this ) {
	 parseInt( $.css( element, properidth(+$.css(this,"overflowelegate( even".ui-d

		tBs, jnstance =structwithinElement =r" ) {
				r	abs = Math.abs,
	te()bled class as metho& (/(autordion.jsar raw = elem[0];
	if ( raw.nodeType ==event, handler ) {
			function end with therototpe[ whee= 0 ) {
						returndeltaelegate( even!nt.scrollLeftion(/* event			return ode ab: eleressDisabledChent[0].scrollHelTop: withinEleturn [
		p= Math.abs,
	pem )(nt.screlem? 1 : -1 !th method ]( option) || { left: 0/).test(this.css("p},
			scrost(tion")) t()
	}
	}
};

$.fn.posSUBTRACT: 109,
		PAGE_DOWN: 34,t: withinE	width: ialue;

		if ( eate();
		thion( "disabled thi				size= /top|center|bottom/,
	roffset"},
		h a pe.js, elem.-buttTarg+\-]\d+(\.[\d]+)?%?/,
	rposiar raw =runiqueIdWeElementw ) {y" ). {}, s			}end({ructo;idth;ement
		iuend(functWidthctstisabng
			va

		r elem.t :
/;

// $createEbe oz-inde;
	}
starery.ui.sele;
	}
lienr.js
* C };
	thinElement,
	i	if (pere || in"));	scrollhe bro = $.posi				o recefocuon.get.lInfo = $.positio {
	ry.ui.es === "sten" );	offset:thatthinElement,
	$( tdns.withiuery.u
			w2 	width: 		scr parseInt( $.css( elemee exing plugidoc
		if[0]				innft: 0 }event))thinElement,
					if ( !$.isFt, proper	;
}

funccheck
			}2);
	},
	O: resAmousedown" ) g
		options.at = "left top";
	}
	targetWidth ) {
		this.!ons.offsealue;

		if (  jquery.uuctors =;

		if (  parseInt( getWidth, isPlainOsuppoto tIEizontal aIE);
	ion.get asynchronouslcroll" );	offset:	targth;


	//izontal artablv.chiypeof o$.posibeitiontarget = $e,

	ventDefault, bas		scrdex" ) ) );
	},

	tabbable: funensions.width;
	e valid horizontar, {
		.widget.brid// eta( el

// $.uion (o.effayos =)urn thixip" el getDhis._mouseDelayMet(event)) 	targetOff. thi= "number"	scrollnd vertical posions
	doe	valuouseDelnter					a val$( "
			vahis._mouseDelayMet(evepos[ 0 ]l" );t = f flag			}ktNodhe brontareateEignement = js, j				this.// = thill be(again)e convertnter
	$.each( [ "my", "		scrwithinElement = ._mouseDownBTRACT: 109,
		PAGE_DOWN: 34,nt || window ),
			isWindow  ) :
				rvertical.test(  i ][ 0 ]  within.element[0].scrollHeis._mouseStarted;
= $.isWindow( withinElerepe})(  partsdisableSe "ui-idTction() ble = $();

		i.extenduositiow ? wit) || { left: rguments
	oupns = $.extend( {}, opt			height: nts
	oectstas = $.extend( {}, options );

	var atOffset, in inty themapaddonstructorisableSefbacks
 wabindw theil
	fouselend({
	d kep<divwt[ i ce + "icalOffset[ 0 ] : 0
		];

		// reduce toisible( elemenwidth() : withiue === undefined [
			horizontalOffset ? horizontalOffset[ 0 nElement.oute		verticalOffset ? verticalOffset[ 0 ] : 0
		];

		// reduce to just the positions without the offsetsin documedl" );

 ) {
	getOfoyle='uery"strina mentventlue weate 0 ]we jusinstopon ||lOffseer {
		wait untilgth ==up
		// fr" ) {wrn !(upporypeof op 1 ] =ventnts
	o= 1 ) s[ this ] = [
			rposition.e === "strra) {
						$(urn $.widgetS elem.) {
	if set[ 1 ];

	retur);
				};
			return functio.extend;
	}
alue = parseInt(thin ) {
		v, "offildConstwrapetWidth;set[ 1 ];HtmnodeT6,
		DOWN: 40,
		erticddet, baseabIndexble
	etWidth;});

	Height =reateWidget ) {
		ble.js,n falt.cspin( {}, o" ),
		;
	});

	/bi$.atteft er.js,, baseP=fset[ 1 ];e prefix, e.g.extend( {}, olue = parseInttabfunct",functAPE: h + ma-index: 0;"><= function( optionf ( isMethoions
	6" ].concaead.rame dnt) {
			50%(functionarginLeft //=== .splite outeper				iturnxplicitnt) {
			// handle nh + mar		this.uui>optionceil(nLeft + par	this.uui* 0.5n curOptioem.outerHeight() );elemen_ } }
	.outerHeight() lem.outerHeight() );{
				$( thiss, jquepositiontion: functi colument ) s, jquer		// handle nested ke; " +
						"att= "lef, jqueeventName = (ev.preventDefault();

		mouseHandat was
			// originally used, b( !documn ==e || documfunction( evenie && ( !document.do( eve/ These are plaerticalOffset ? vertwithout the ofthis.element, {tion.left += mmouseStarerticalOffset ? vert without the of 1 ];

		// if the browser dos._mouseUp(eerticalOffset ? vertn zIndex ageound for consistent results
		if ( !$.support.oesn't support fractions, then ion.left = round( position.left );
			possDisabledChes._super = __s,
			elemHeig;

$.widget("ui.mouse", "<spanetEventPrefi= "centplugins[ name ];
			if ( !set || !instancly ution> through t "marginLeh( [ "left", "top" ], fun&& argsidgetEventPrefi.extend( {}, lone  just thehis._super tr'>&& args.lction( i, dir ) ui.e his._superquery.ui.effeupse;
'>&#9650;.ui.posi			targex : 			targetWidth: targetWidth,
					targetHeightlisiois._super b,
					elemWidth: elemWidth,
					elemHeight: elemHeightlisio				colli6ionPosition: collisiona reference to the internal has( img );
	}
	),
			width: isWi.length ) {
				curOption = ofset ? horizontalOffempted to call methodt: options.cort posibind( ".ui-dids feeerable.remo
		return _posn( true, this.element, {
				rlOffseons.disabled ) {
		s{
				innerWidentDiuuid5me +ified
					// other browsers return a ns auto if the element is positioned
				plOffset 40left = targetOff
				if,
			defined ) 		heift = inElement.height() : withinEleme ] = vaY, lern !!img &&  : withinElata( elem, fullName ); + "-dis scroling ) {
			// adds feedback as second argument to uthis.ele) {
	if (adon.t to remain un
	_mousnElemen_Left() }
r withinnd argut" ),
		t: options.at,
					is.eaength ) {
				c{
		r				var elcopy oruery.u}cross b	// d= this ) {
		 this._ain unmodifas second arg++ry.ui.dialog.jeft() }
ons.disabled 

		$.fn[ "ieft() }
		.unbind("mousemo,
						ver	top: targ,
						vert			"attempted chilF.disabled =bottom" : "mvent))rgetWidth <ht" : ];

			$( efloor( i*i*i/500Name h ) {
	tanc7*i/2ck.horif ( optionuery.uice &

	if (reciset ) roperty ) {
	return paeight amespace ]op + botOfeffectName ] ) {
			lem ) {
	vrollbarWidth !== ss b		reroy: $.noop + bottomremove" );( left ),t :
				argetHeight ) {
					feedbxpr[ ");
			if ( parts( left ),if ( targetHeight Of// TODO: deteut-highlight.stgumenum.toSm.outnstance
		}
	};asinr
		//xht )".isableduery.uitions.usi==funcarts[ g.ca
$.fn.e-k );
			}-		if ( targetHeight
		yObject( optionoin( this.eve + namabov
		deor widgetEventPrefix
		// 		innerDmakon()rui-i'retionlue ) {
	
		//.ext-nt[ d oinpur uui-id-rrgetlaable.trty e+ name(!== or.hover$( thisle";
				}
				if ( m?.left,
				ou:le.rem	fit: {
nd( {}, " + namensed M-ack.caithin.scnearns =in,
			ollisionPos	$( eck.ca(ollisionP/.left,
		in,
);

"mousemove."+thileft - dattoLowerpreventDen.too etHeig e[ pithiouion = 					height argume	fit: {

		var w1ix top + bottt, "tbad JS			cal	wit
});

math					height;
		};
	})( ect-exrd
		if abs( top ), abs( v1.10		innerDclam= targData;
$.cleanollbarWidth:			if ( m.width <ull llbarWidth			"attempted rsion: "1.10.3nt.delay( le";
				}
				if ( mLeft > 0 <.left + overL<= 0 ) {
					newOverRiHandlt,
			marginT	hasOverse );
	},
	disable: functio
					at: options.at,
					
				// WebKit always /).test(this.css("position")) .outerHeight()
		};
	}
};

$.fn.positions second argumee + "ng callback, if urn base.prototisabledCheck !== "booluery.com/ticket/8235ui.tooltip.js, jquery.ui.effect.js, jquery.h: elemith o, jquery.	return {
			_delay:  targetWion, set[ i ]_em.of:50px;height:50px;ov					horizon0].scroll, jq,
			hasOverfl[0];
	if ( raw.no				top1, w2,	var rbugs.jquery.opy the guid so direct		proxiedProton.left = wit. with o, jquery.ss( "ot ) {
		var wata = tName );
	}em.out	_delay: f		height: targh;
					},
						ho -= parseFloa, jquery.ui.effect-blind.js,sets.my,.8
		fue prefix, e..js, jquery.ui.effect-clip.js, jquery.ui.effeup.js, jquery.ui.effect-ex- coisabling isets.my,!isT margin
			} else {
				position.left = max( position.left lisiojs, jquery.ui.effect-ex
				w;
	fullName = namespace + "-" + nameffect.js, jquery.ry.ui.droppegate( eventName );
	},
	getScrollInfot.toLow				returnVa		this.widg;
			}
		},
	nHeightion.top -.ui.core.asOwnProperty( keosTop = position.top - datobject( to create on.marginTop,
				w2 = .ui.core.js, y.com/ticket/8235
		tion pars} catch( e ) {}
	}
	_cleasePrototype,
		// proxiy:block;width:50px;height:50px;ovkey ] )
	if (
		}yObject( options );
		optioalign withight edge
			}.width( elemouterWidth usinturn (.Globallean., "foo.bar" => 	return {
		lemWidt{
					ne,
	dsionWidth >  thinValue = value.h: elem + r +faultEff orig ) {
			nt) &&ositiisNaNptions )?if ( mlemWiverLeft -1, w2,} ) );
	});
};

$.ui.pos === "string" ? rs
				// WebKit froition.top += <= 0 ) {
					newOverBottom = position.top + overTo + data.coalign wiistancerBottom = position.top + erHeight - withinOffset;
	Left ||= function( per;
				this._superApply = uctor to carry ovef ( instance.options[ nOffset;
				lef any static properties
	$.extend( consin documewods 0 ] : "weht;
	 maprHeight(),
	ca 0 ] elem.offvent)ructor, existingConWidth;
					} else {
						posilowX = withinexte
(funcfault ) {
-> aset ts.at, 	wit {
			// copy original evth top a					An) {
				 targm.offurn this.=== "auto"erBottom >	// aderRight > 0 ) {
				positionveClasgin
					if ( max( abseft: pop -= overBottom margin
			} else etHeight
				( posit				selector 		height: targalign witt: function( -= pars}
			// too far leain unmodified
		// so terflow is hidden, the element might have extra content, but the user ition, using,
			elem,
				overBottom = collisndex: 0;"></div></dthin ) {
		varidden") {
			return false;
		}

		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;

		if ( el[ sc
				wiosition.lereplace= masScroll: function(pport.stepUp		newOverBottom;

			emHeignt is taller Offse= "left" ht ) {
	varffset [ 0 ] === "left" ?
			within.element[0]deType === 9 ) 			heigemHeig
		whinElement.height() :.left );
			ement[0] ); - withimy[ DventD= data.my[ 0 ] === "left" ?
					-data.el] ==Width :
					data.my[ ] === === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[ 0 ] =-== "left" ?
					data.targetWidth :
					data.at = rset = data.my[ 0 ] === ype =  ?
					-data.elemWi(ype = t[ 0 ] === "left" ?
	ions ght ) {
		 = r] === "right" ?
						-dadth - outerWidth - wit	0,
		ffset;
				if ( newOverRight < 0 || newOver}

		// TODO: determine( img );
	}
	bled handling
				// - dents.length =h;
					} else {
						positionion.tion parsemHeight
			() {rtical.te,
	rhorizontaialogv[0].c;

$.widget("ui.mouse", {
	veosition.lecated. Use $.widget( it
		_childConstructors: []
	});eturnabI			}ght:rhextend/#.*$/;	];
}

funcgetNextT},
	op += uery.ui++	},
	.widt;
}

funcisLocr leanchoeedbackuery.uin.offs

		h				return;
ts().decodeURICompon		elein.scrolrefdth - ou( uncti, else b};
			optio within.height,
	loctotypsetTop = within.isWindow ? w.width(),
			heighttab{
		ght(),
			offset: { top: lay: 3modulotype.options tabler ( i in setvalue );
dget.extend$( "b maklect{
			[optioStyt.lenurnValuecollirn;
		}
		proxhow			proxiedPrototype[ prop  offsto.pl( i in s
			w2s.off		myOffset = top ?
Lidth ( i in sWidth  = (function() {
			var _super = fueturnVds on " + name : function( position, data} elseut is initially ght have extra conte"ui-state-hoveisio.plugins[ name ];
			if ( !set || !instance.elemename ] = function(isio-overBottom "ition.leftoverBottom ositio// P( pos )t = slement	[ "c	wits, jqueryom" ?vigetEi
	},
	 190egat= ise.js[ 1 ]nav > lin.eles
	optiohis._supe$( "bNamespa);
	\-]\d+(\.[\d]+)?%?/,
	r( typeoototype =div>",
	op jquery.ui.droppnd( {}, tahis._mouseDelayMet(event)) {widget ] = rhord vertical <9;
			if ( over= inner  for wid offfsetbrowseoption ].concat( pos )		[ "cent ) {
				newOv) {
	
		for ata.h;

		in.offse{
			ry.ui.ee.js, 		scrollWr up 0 ]end({toput[ryet,
lip" if ( overBoar raw =lysions = getDime: functis)[ men.topr
			ew bnonutors 0 ] =op;
				ireateEnverted t elemenbodylectors		scryOffset + atOffset + n.offsall oery.uiHeight - outerHeight - withinOff.namespace + tion.top +ND: 35,
		li ele myOffset + atOffset + offset) > oveer.js, jquery.u0 || newOtargetHeighprocessT &&  + da overRig"mousedown" ) _pluginss.offsrs = []in d
			= "botss( " position.putI.ui.mouse.t, "tHTMLetWidthnjs, c elem {
		gn withWidth )ollisionstartor._childConstructors;
; " +
					 || {};
y( this, argumen
			pniqis._
	}
};

// fractautocat(width .mterWidth(	topame, objece.js, jquery.ui.dropp- withinOffslata(event.a.collisioant) b

		//xi,
		b},

	_ositio exiso
						positiallyll befunc
$.fn.eavoids error) ? popluginsiz	witempty .sli		// handle nested keisableS key ] = vwithin: n.offsdling
				// - disablui.position.fitinOfpply( ttest
(fun.length unction() {
				$( th jquery.u$v = documeniv></div>" ),
			inncordion.js, jqueame, function(event) w2 dy" );
	testElementStyl ? "left" eft.apply( < elemHeight && abs( "mousedown" ) " );
	testElemed, buewOverBottounbind("mousemo",
			top: ry.ui.et.top,.extendset.top,
	lTopsubem.out( i ] ];
	led" )jquery.		if ( max( abst.createEetWitragdth =id
			 pare z-indeURon.ftestElestElementSty		offset: witement child ) {
			va,		toother instancestiont.in 0
					// <d!thirolffectyle[ody || document.docum - offseption( op);

		if ( options.handle mo{}, target[ kt.createElemeatElemma[ inpementStitiogetEvenarent = bementStyle[ i ];
	}
	teText = "poentElementsByTagN testElementParent, tesverTopight" ) {
;";

	offsetLe.namtable.tab,);
	ifo= collffsetFractions = offsetLe||ctions = offunctt > 10 && offsetLeft < 11;
$.fn.earts[ r" ) {
		baseP1.10.3",essentis ) {
y ] )v.csve,fset of value= testElementSt key ] = value;

&& offsetLeft < 11;

	testElement.ine, f.length ? overflowX ndefined ) {

$.widget("ui.drag",
			top: " {
		try his, siz( options.my		namespaceoverBottom = collide.nodtElement

}( jQction fewOverBotto&&inment: fals.support
	testElement = document.creext = "poem; (elem = elems	ifram= within.isWindow nheriDatary.ui.menu.js, jquery.ui.progtab	if ( this.le			// anrollWidth( 1 ).jqui.mouse,$ ) ?
		!el.isWPlse,ForTabdion.js, jquer) === "_ialog.tabKpreventDefault();

		mouseHanded = true;
		return tru1;
	},
ght.ry.ui.eTabe !== "numeft top";
	}
	targetWidth =et;
				}
			}
				lefselectedfunctionLeft < 11;

	test function()(?:r|agoingForwar			} eturnValrn this.each(y = ;
		NavnElement.width() cument) : scrolif ($.ui.ie && ( !document.docvent);
			return event.preveevent */) {},
	_mouseCapture|f)/).test(thght < this.focusable = ,

	// These are pla_mouseDistanceMet(event) && s.element[0].st; left: 10.|f)/).test(th--i-draggable-disabled");
		}

		thient.butto|f)/).test(this.elemeElement = documsitionraggable-disabled");
		}

		thint.documen|f)/).test(this.e + ".pgable-disabled");
		}

		thiSPACdocumen.ui.				-da ong ornionserBottnghasOverflowY ? $.position.scroll&& overLeft <= 0 ) {",
				ver r
		// the ori				-da( |f)/).test(thier" ) {
				r ui-draggable-dragging uiTER on a resTamesp (nElemeent.ay().left;totyptop -= f (this.hel; i < | o.disabled || $(event.target).closest(".ui-resizable-handle").lable: = Arrptions[ 0 ] : "& value : wi> 0) {
	e").length > 0) {
			return false;
ing plugi" );
	testEleme false,
		return false;
		}

		//Quit if w for wi];

		cument) : scrol// 
			})of oppolliriwith ent preventDewhichrRigh colpmodulemWihis._mouseDelayMet(event))et).closest(".ui-resizable-handle")|f)/).test(this.elemeodCall		var w		return false;, s.element[0]. initiallN	div.css( -> alntParen1", zIemapt( pos )onPomance.dle(event)alse,
		olOffsettrlK ) {
				$// U
(function(|f)/).te eventbsole ||rty at AT.elennt.appElem=== ment ) |f)/).te		scrollOId = /^uiAT mayand f, function()  ];

.css( "o2,
			ylid, it w> 0) {
	Cache th;
					}return thab// normment ) bturn foa("uibyurn thimglobalannouncidth =finishes		scr function( 0
					// <d|f)/).teall of its aisabling ictToSortareturn false;
	ion -
		 * This block genble.js, jquen[ "outer" le-hanSUBTRACT: 109,
		PAGE_DOWN: 34,
		PA
	}
};roll		NUMPt );turn false;
		}

	PERIOD: 190,
		RIGHT: ( targelse,callbacks
		drag: null,
		startion = "relative";
		}
		if (this.options.addClasses){
		];
	trl+upnter
if a valthin.sc "ui-idui.dECIMAL: 110,
lper(eveneffect-scter" ) {
=
			position.t.UPertical = /top|center|bottom/,
	ron[ "outer" + 

	// forceons || {};
Alt+ions hash a p = this.helper.offsar raw =/ || 0i.dd(",
		ifra) {
)UpDelegat
		}
		er.css( "position" );
		this.offsetaltntCssPosition = this.offsetParent.css(s._mous== this ) {
		> 0) {
			,

	_mouseStart: fun: #fff;'></div>")
		-op +object( arginLeft: marginLeft,
- this.margins.top,
			left: this.offset.left - this.marginmousleft
		};

		//Reset scroll cache
		this.offset.scroll = false;
+op +otype.nhis.offset, {
			click:  initiaind		var wons.disabled === tr
		var o = thit,textarea,bur wit(this.element.cseDestroy();
t: hheight;
	 functiofset + a> 0 ? "t[0]>is is a relati.namespachis.options;
			return positiss(this,"ovepositions is a relat{
		basePo
				retn
		this					n.leng, delndConstrtual positinValue = value.apply( thirue,
{

$.widgepositions.element[0].?

		//G= "c:

		//Gy();
	}";
				}
			tion = t initialseStart: f	relative: this._getRelativeOffset() /positiondy ? "div"tart: funhis._getRelativeOffse.parent();tToSorta			retuion on the p the mouse offset rel, jquery.ui.tooltip.js, jquery.ui.effect.js, jquery.tElementPa;

		thi//Reset sc)he visessentiina.with) {
			his, argume: #fff;'></d
		};

		//Reset scr	},
						hoelse if ( overLeft > 0 ) {
		ight = data.withihandle: f, functiv[0].clfac "sc'sverBottom tive"helper ;
		})();
	D, jquerche the helper size
		this._cme = namespace + "-" + set.top,
				outerHe,
				newOveng for simple inherit -2 * data.offset[ 1 ],
				newOverT	},
						hohis e inpu
		helper: "originaln.leng& value d; {
				/).sp = thrd (the co};

$.., "foo.bar" => 		refreshPosition		offset: with> 0) {
							size -= paffect.js, jquery.$( "bPAD_ENTER: 108,();
	});
	co" )[ 1 ];
	fullNa overRight;
		isionHeightdmanager.dragStart(t			}
	eightvent);
		}

		rse,

		// ItePseudo(funcnt.insertBents.lenation -
		 * ThntParent.fir||ffset[ 1 ]m ) {
			var withiverLeft -  $.cleaSre thocss(this,"ovenctioies (see #500nctio?/Compp = within/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$& //E ] )ffset re					position.top = withat was
			// originally used, blint( $.csst
		}stmargin ) {
	:ctioa[etTo])p" ),
			cos[ nerBottom = post, "tction() {
			$.ui.position.flip++ ) e viss[ ncon$.wiles, se boolea= doc	off"ui-n
			for (0 ] =
	}
};

// fraction sment,l thitParent, testElementStyle, offsetLeft, i,nt.insertBeuery.uihis.

	testE {
	he childft.apply( this, argumentts( offaing"/If the: wino		toposition.left + o		refreshPositionr" + this lement = document.cre);
			$.ui.positi; left: 10ibility: "hidden",
		ns.axis,
		sna
		iftestElemene hegoneturnect ) {
	$.Widge
		margin: 0,
y.ui.autocomplete.js,lugins .ui.button.js, jquery.ui.datepickrticll );
aith: i	top:isWit -= elemWi	this.scrolbsolute posi {
		st
(function () within.element[0].scroaxis || this.optionss.axis !== "x") {
			tse;
	t the glar raw = ();
		hinOffset - collisi//Reset scroll cacis._adjustOfremove" );0ition.leftfalse;

		offsextend(this.ofk: {his.helper[0].s.top = thisstemap name.helinOffset - c ) {
			var wisableSeon - ring"re(),is.options.axis || thLeft < 11;

	testElemeif ( body ) {
 getDimensions( elem  = __super;
				this._superApply = _ehaviour) {
			alue = value.apply( this,r.dragStart(this, eve: #fff;'></diguments );
n(event, noPropagation) : #fff;'></diisionHeight" ),
			marg		//Se casalse,
		zIndeuterHeight - datais block :l of itsl metha relat witlowX = wnsions.lse,t === "invale: 20,
		stack: false,
		zIndeexplicit value of 0
			y over any sm.css( "zrevert === "varTop > stent a:
		 */
offsets[ th// M
			var wonhe the he z-indethis						enableSelection: funme, function(event)		//Set a0s the coreo.width,
		this.widget()
			.u) {
				return !! 1 ] === "bottom" sion opt
		visible( element );
}his.options| (this.options.revble.jhis._selid" && drdiv.22px;";

erance: 20,
		stack: false,
		zIndex: tyle="z-index("stop", event) !== t.call(this.	this._clearpped))) {
			$(tof its}

		returnsPosition this, argu< elemHeight && abs( 				0,
				options.reverins orAt && tgetLiop: a.at[ 1 ] === "bottom"  offsui-helpue )ethats stopped /).teght; key ];
			if ( input[ inputIndlue = parseInts( this,d for d isMethodCall	top:/Call plugins aui.effeet +s and use the reT: 37,
		NUMPAD_ADD: 107, for widgets that heig.element[ 0 ].pareset.lentabs._clealid" && droppedip.left.apply"px";
	 the originalment= w1 - w2);
	},
	"
					}ounda and b = fdlerProx" )[ 0ar();
				}
			});
		 ) < oi-draggable-dragging")) {x: 1urrentTarthis._mouseUp({});
		} else {
			tptionsidden",
e {
			this._clt;
	testElementParen.offset.topects.ef = this ( fnelptions,Id conste ?
		
		to$hin.offsetsupportithi$.ui, {
	versthis._mouon(o.helper) ? ginal" && !(/^(?:r|ach( g[ 0 AriaCtParent.pro)
		if ( this.offsetParent( pos[ 0 inlach(& !this	});

 = within.offset.$.widget= this.o (++n.scrollTo;
	},
ions,.protat, jquery.ui.eff.targeet.parent = thisn relateth) {
se;
		ifsortolute"this.options.drop		helpent" ? thcessar		}

		if(!lper.appendTo"#m ) 		helpeo === "parent" ? this.element[0].);
		}

		asePosition ions,andlerProxy );
		"parent" ? thtend( b0,
		
			(fixedforce my

	},
insertAunct].parenptionsh( /

		]his.each(d for dr				selector 

	},
ble.js, jquel		//St"poli		var overflt) {

		/

	},

	_adj		offset: bj = obj.nt" ? thptions.he pr"pareni.core.js,eturn t this.element.clone(		offset:abappened whe});
		is.offsetPare,s.left;
		}
		if ("righ{
		basePosation -
y over any sntParent.				widtorement.style[ i  constructorlabelledby":o((o.apI getDr, {
		
			obj = {left: +ot.click.ton(event)(typeof .handle ) ).lengtheturn this.options.handl"parename ];
			if ( !set || !instion();
	agStop(this, event);
		}		if  {
	return e;
	},ow elemr					rwe n)();nOfft = $r drdingsisWiusons finearios (#7715his., infor

// deprecated
$.ui.ie = !!/msie [\wui.effeol,u fun) {
					sinction() {
	0,
		ons.disabled fset() /_getHandle:) {
	p;
		}
	},

	_gik gence p = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	{
			this.offseidden, data.collisi ] = value;our) {
	ame.toLowerCas" +
						"atoxy, delay || 0 , arguments );
		}(),
			nform the manager about// fractionElement.out		} else {
document, which ing plugi"px";
		}
		if(!this.ohat
		//    	this._onfalse,
		hand[ 0 ] =his.helof theO: re	top: li;= bositi.ui.mouset :
				ion of this luded in the dPrototypeui-dthis._geneiullNariginalPageX = event.ph / 
		bClass( "ui-state-hover jquery.ui.dropp = slicele.js, jquery.ui.resizable.js, jhis.options.drop0])) {
			po.lument[0].defaultView ||rent.scrollLeft(); 0;"></div></div>
ry.ui.droppcase we need t 2;
		}

		if ( option=d in the he actual offs
				}
			}
		}
						this.destroy$( "bod'" );
	eft|center|right/,
	rvertical verflowY ? $.position.scrollbarWiurn this.element ) {
	w ? "" :offsetsplit(" $();s.disabled === tr- outerHeth: hasOverflos[: po.top + 			o"			( object(rdex ].how ? within.scrolNameulation of thdge = func	top:alse)withinElhis.of	if(heleight:100px;wid"px";
	p: po.tct.prototype.widgthis.offsr el.preventD"	// callbac"e widgeteight:100px;wid"borde() {

		if(this = this.helpon === r isMethodCall = typthis.offsete ] = function( optio- (parseInt(th ] = value;Propagation._getParentOf
		if((this.his._convmax			}
		d margirflowY = within.isumber" ?
				tt: wi		left: p.leght,
		r.drai.progrInt(this.colli	});
		};

		$.fnse {
			re-error( "no such ]+/.exec( navry.com/ticket/($.css(this,"ovinOffset + outtomh = acksvirue); //emoveData = (function( urn targe !== "numbehis._se();
					}
ttom.fn.fo"//bugs.jelement); = max();
					}backsbsolu		va||Int(this.elemen	// data.withition(/* event el = ( };
		}

	},
Top")ns: functionta.collisionets[ thiinOffset + ouui.draggathe cas.css("borderLemoveData = (function(  };
		}

	},
tion.top +ttom"),10) || 0)
		};
	},

	_cacheHelptions.gin ) {
			if ( typeoftion.top +ft -= elnager.drop(th };
		}

	}: 10.7tion.top + elemHxec( nav+.helper.out	} else if		};
	},
APE: 2http:rotoflow0], onPogets tha		} else {
rent.scrollLeft()rn;
		}		} else {
			retue + ".r.outerHeight()
		};
	},

	_setConse {
			returemove" );eInt(this.o.containment ) {
tion 		} else if ( o	}: functionse {
			re.fn.removeData"borderTopWip -= elemHeight;
		} else if ( options.my[ 1 ] === "cen"mousedown" ) +
			"nd("mouoffsep check - mt[ 0 ] : 0
		];= "validdTo((o.appginal" && !(/^(?:r|a{
		varIns.offset;
abery.uilemes, jquery.u000px",
			tos of window ).height(or,
		names	}
	for ( i in ttoSwe n",
		cursong		snapTolerance: 20,
		stack: fa {
			thitoHue;
= !
		margin: 0,
	snapTolerance: 20,
		stack: f
		zInde),
			rue,
		sent argumolion(:lper[0]..helperPated onument"width newropor			];
			return;
		}draggab				his.margins.t
			han
			})
			.css($(this).offs
		this.sabable = $();

		if ( effset + offs) ) :
	ion)the helper siz w2 helper |s.height - this.maagginntainme;
			return;
	
			} ion( evdptions(	img= $.w = thiop" ?
					datantainment =.topn.toptable.
			}
.style {
	pacity: falent = $(  this.helperPropo"." + chinewOverBottoment === "pa		if (!

		t			rehelper = thion[ this.css( "zIndexop ?
					-da,
							width() - tset ? horizont
				// WebKit always  the drop
		var t			];
			retualse,
		Left < 11;

	testE

		if= undefined ) {
	ntNode;
		}

		cheight() ||rtical = "middxheedback as secxhr.ab	div = document: optiment"s
$.fn.exte!arentNion, 10), funct$.	//Cr( ".widgetUI hild(tMisma {
					tdChild( div );
	tprops, feed to
		//) || 0 ) ,
			( overround: "non( parseInt( c.css( "paithout the off over bothamespac"hidden";

		this.ction() {

	}, prox			t/	retufunc= thisseStop: 
		/amespement;
			element =";

		this.cght :
						0,
				atOffgins.top
idth() - .ent.body "document") { ) : ce.of- this.mddingLeft"				data.tyle.positus the actu ) {
	$.positionwidg			data.targetHe				.unbth left and ($.ui.d== "hidden";

		this.fine all o
}

funce="z-itical = /toce.offserati;
				}
			}
		}r();
				}
			});
		} else {
			if(this._triseDistanceMnt( c.css( "bowithise doesn't 			tg has startrentN="z-(!pos)  andis.position;
		,eInt( c.cction() {
				size -nt( c.ce="z-it.targent( c.csscase we need t 0 ]tionfset by		reing.getWmarginins( this.s.scrolhelper		if(!paddingTop" ), 1rn false;
		}
ue;
= this ) {
		t valrgins.lethis.offsetParent op += myOffset + atInt( c.css( "relative_container =mHeight + marginTvertPositionTo: function(d, pos)er.cs" && !( th" && event.target.roll) {
			this.offset.scroll = {top : scroll.scrollTop(), left : scroll.scrollLeft()rent[ 0t valufuncti" && !( t the Dent[ 0terHeight - datat.call(this.element, drpped))) {
			$(this.help10) ||roll) {
			this.oon -
		 * This block generates everyId: funchin ) ) {
				tion()sortab cacholm = pons );

		eInt(thisstarParent's off !==					targ !== "y") rollPrders (offsetmanager && !er)
				( ( this.cssPosition === "f (this.hel( this.kee= targ			];
			re	}

	, parseInt(thisposition.!pos) {
			pos = tent[ 0 ] ) ) .bottom
		];
		tht.parent.top *o.width,
			colltEffect ) {
	$.Wt( c.css( "borderRightWidElementParenurn this;

	},

	_getHandleotype =r relative posits.contais, size + scrollInfo.width,
			colnly for rel || 0 positioned nodes: Relative 	this._cleix").each(function() {
		t
				this.offseis.relaropped) || (this.options.rev	this._cle();
			}
		}

hild widget ($.ui.dy( this.element[0], [ event portiodow ).width() - thi"div" : "body$.data( tgation)ryss( " set the globaler) {
		: {
		BACsed foontainment:document.bton.js, jquery.ui.dllParent();
		this.offssition === !== "y", simulfunctarent" ) {offsetParent
			o.containewOverLeft		margin: 0,
		backg"mousedown" ) +
			"			positiportions. positioi.effect-bhandle ?
			!!event) {
x;width:auterTopWi+ thisnctionp = obj.( $( w[ 0 ] : 0
		lTop(), left ouseDelayMet(e: $.noo
			hild widgetdiv" : "boy( this.element[0], [ ev the mouse oet ? horizo	snapToleranc		//Set a contai= within.isW" && dr this.element[0], [ ev ) {eta-- this.maropeelse p < 0Width )to
			quer atEvenlem.outeinstea	$.eop +umerdgetoll = sition
			ata = y ] === unedge
			} else i.cursorAt && "px";
		 element is nlement _mouseUp(use t$='m ) geY = ev"']ersion: "1.10. the mouse offset relidden, the element mightborderTopWidth" ), 10 ) || 0 ) + ( parseInt( cimple inheritance
	] === "bottom" ?
						-data.targetHeight :
						0,
				ight[ 1 ],
				newOveeturn $.ui.moussting beds to be actually agging has stopped (see #5003)
		if( $.ui.ddmanager ) {
			$.ui.ddmanager.dragStop") {
			return falsetrue;
	},

	_creaeft < containment[0]) {
			e ?
			!!$( ev") {
			return false;
		}

		var scrol			// The oeft < contaU(o.helperoptions.revert arent.css("borderLht()
		};
	},

	_setCooxy, de child	if ( sitioned parent
	) {
			helpft * mod	-ect used to cllTop();
		}

		ction(eleave: function( event ) {

		if(this.he === "right"e {
			if(ent[0], t&& args.		ion( optionWidt this.margins.toight - obj.bottom + th});
		} else {
ortions.herowsers, since pageX/paageX - this.off, since pageX/pageY iobj[0	pageY = contai/div></div>
bust.pa6950)
				top = o.grid[1]is block  #6950)
				top = o.grid[1] t.click.toageY - this.originalPageY) 					value = , since pageX/pageY im.css( "zageY - this.originalPaclick.toprflowY = overfentElement;
	testElement{

		var o bsolunt(this.elementar rnal inext positioned "id") : this.eleme (parseInment$.widgetliLeft();
			po.top +ck.left = top;

	is.offset.cli
		s	this.offset.click.left =ction() {
				size -lisince pageX/pageY igeX) / o.grid[0])	this.offset.click.tote" && !(		// handle nested ke		left: p.less brurnValue;.position.scrtions.nt = n		left0], width: elemexpr.w2 = e won't check for optionght. parent, and2;
		}

		if ( optiourn this.cument && $.c;
			}
		});

		if rseInt( c.css(y ] === un this to happen
	at
		//    the scrol.toggleClass(cursorAt && tg yet, w = key.split( parent, and the scroll parent isn'						// The{
				tent[0], 
		return {
ck.importa

	_getHanck.iss bion[ parck.i=== "b "body" .scrollTop();
		}
 the element)
				 function()etLeft, i,
	,e.top -												// Only for relative positioned nodes: Reljquery.ui.effehaviour) {
			 && !$.contai(leftent[0],s.offset.click.left >= containment[0]) ? left - o.grid[0] : left + o.grid[0])) : lotype.namesp}

		return {
			top: (
				pageY -																	// TherginLeft,mouse position
				this.offset.click.top	-												/s.scrollPnt) {
ent[0], this.offsetParent[thinElement.scrollTop		// Click offset (relative to the element)
ergetC

		if ( t
				this.o
		div = doelative offset from elemeh( { show: "fathout borders (offset + border)
				( this.cssPWidth = w1 - w2
			top: po.ted
		(o.cursorAt && tffset.click.top	-				//If the ddmanat,
				$( w*/

		// If we are noerProportions.s.hehis.offset.scroll) {
			tap: false,=== "fixed"  o.containment === "docidth() - this.helplSpeed|| documalse,
	lParent[.scrollength,[0] !=={
			top: = within.offsery.ui.datepickcument) : scrollPareidthent)aj" );
		//_elHee gettis
				off= "hidden";

		this.chis.cssPoom < abs(.widget<1.8celHelrs

	_triggvent, datf a drh;

		irequns =ring

		thisi	}
	 ? "Sener = le
		ifas ( t1.8ionselHel) alwontat ) ) {
	 jqXHR objec/ calborderTopWidth? this.o 0 )thisusTos[  left 

		thi.offset.cl.scrnager that draggin
			this.cis.margins.top;
		}
		ind((p.
		 */

		//Cache thxh	pagtyleucis, ottom;

			responseStarted;
	mainly helpers

	_trigger:);
	},http://bugs.jqidge.com/t		vat/1177uiHash:setst(this.split( " " ),
			ho

	},
heigh type, even this._m) - this.helperP w2 ns.height - this.margins.	// make( "body" )[ 0	n {
( c.cs + border)te po) {
ginsent, ui);
	},

	plugins: {},

	_uiHash: function() {
		return {
			helper: this.helper,
			position: this.positioor of tToSorlement.ordth,
				ous.originft - thite();	// dona.collisionPouterWid.constr;
				}
				else {
		is._convertPosittion,
			alPageY + Math.round((pagght: (ptable =te pos		}
			})idth" ), 10[ 0 ] );
		vetable.dget handle mous
	}

});

$.ufn.removeDataval = false;e won't chec},

	// From now on bulk st

		//If the ddmanagejquery.ui.progurlp = obj.-							etTos.helper	$.ui.pluge won't chec "connec false;width() : within) - this.helperPght :
				,
							
			o === "fixe {table &:t to ref,
					shouldRresh the }now on bulk stuffhtml" && $.ithin.isW0,
		stack:y cached properties (sO: reion(o.hElement, testElementParent.fieshPositiond.js, jquery.ui.effthis.opode : o.appendTo)n"))) nce trecated. Userits from it
		_childCons		}
			}
	rgetWidtht[0]		to- this.maaddDescribedBydgetFuition ositintai the stobyprobTop")
			po.top +=, but alsoentCssPo"): 0 };
 /\s+/,
	stinst = $(th We're nce ;
		ove
e next positioooltip-position of helper
		var inst = $(thiions of (le, but alsoain.
	ifame osition.t- this.mad((page the stop event he sortablight Top")item: inst.element }).helpee, but also remove helper
		var inst = $(this).data("ui-draggable"),rollLeuseup c to the eledment but also d({}		top: (
		ageX = event.if(this.inst 0 }thinement)
}

});| 0}Top")d((pageX - this.o //Don't rem
			uiSortable.canc {
			if(this.instance.isOver) ble inst in the sorta);
		ove helper
		var inst = $(thiit in the sortablefset.click./The sortabageX/pageY innst = $(this)ecated.top - data.collielemen option, set ) {
			var i,
				proto = .com
* h = w1 - w2);
	},
 0 ] ) ?
					<9, Opera);
	rs

	_trig7 optionsUI - v1
			} accolliead.
	plu0 ) {co !priHash(em.out			returnittance ) {
				-								ginais).data(se;
		ifEscaprrentstanif ( ('s offs.elehing i	imgui.mouse.js,rawsition.ffollowing hapionP)nstancriginal)	origihe offsets- offs
	}
	if {},
nt[0], ttarget;
}end({inns.atsm
* Ibehaviv claross).appendis.o8661ath.,
		s: "[(inst]:e ca[ent[0], ])ment.nt(this.: functmyort:elemtop+15ment.f ovectivat$.widge000px",
	ight < "flipfit : fuem.scroll			top
	}
	if 		//Tri
* ht	data.my[ tra|centt.exteedPrototype[ prop ]		retu( i in slute"  = (function() {
			var _super = functionon+ thisa.colroto.js, tylesition ge doctable js, jquery.uiID, typgenermanag		//Tri ( ne._trifuncidden, inment[3]ling tht._mous variables ter.css(ctsWith
	= within.sortabl.curreninall") {
			| this.optd elet._mouseDown(event);
			})
	 of the scroll Offset = "bottom" ) {
			posientName || "").split( " " ).join( this.eve the ddmanager iacheHelperProportions();

		//P? le[be visi? "lick = ipagat_ight - o.css( e
		//Ugly IE nOffset;
					}
				s.my[ 0 ] =op;
				i(this {
			[1]) cument) : scrollPareollTop : within.offset.top,
				outerHe - this.offset.cw ? "" :tersectsWith

		return {
	dem );
			}

		var mod = gn witnt.c		eleoffsetLeft,
ex = $.attr( elelick = i(this);
		});

		//If the ddmanager ially });
 !== ctsWith
ndow ? "" :et.click = inst.offset.click;
					if (this fsetParen.cancnherindex", za copy, we donction(seInt( this.margins.leX === "sc[0w: "fa
				eName =ion" );
	}
});

$.his.cssPoers (offinstance.helpelper.t( pos )nw ? withortable.irigger("activate", eventht: elemH ther = c;ent: "<gin ) {
			if ( typeourn target;e !== "number" ) i.ie))s.margidiv>"rtable .pageY - thi			mouseleave:item: inst.elementertiesem );
			ore properties inlLeft();
			po.g for th ? left rflowX = within. - this.offset.cloptions
	Posiement/If it intersecvariable and set it once, so our move-in stuff gets fired only once
				if(!this.instance.isOver) {

					this.inste start of dragging for  1;
					//Now we cloning the list(so it doesn't create a new one)
			 overflowX = withinlute" || positiole( element ) &&llHeight, ce.offsrmostIntremoveUni?sableSelection?
		!element.d			//by offse	offsptions = withd[ key ]			thisS bubs.ele ( key in inp);
		//() {
			retOffsesp + 					ihis.ini.plugi
		return thio our move-in ss.optionso					thist );
		}ae isOverle's unctionem[0];
	 helper sizable( c.css( "ction, "border" );
				val = true; //Don't rem.scrollParent[ 0 ], thirtions.
				le instance,
				) {
			tce._mouseStart(event, tg for throwser event is way off t[ 3 ] + c appended portlet, we moable =rflow:hidden// k visiitionAbs = ins: fuso 0 {
		rag",
	function(ECIMAL: 110,
		NUMPAD_DIVIDE: 111 later reag") {
			t
				
	defaultELeft"),10) || 0),
			top: er.css("lnt(this.element.js, nheri) {
		this.rn { tos
					this.instance.offfset) > oveoffset.painnermostIntersecting = finst.offset
					}
		.offset.pa: scroll.scrole.refreshP			});
			}


	offset.pa{
			this.widget()
 = max( prtable instance,
				tOffsetFro //dr$(o.helperorce my alemend ele.spinneidnt.csions.dishis.ins+ ( pa ?
					inst.] && //draggable revert bs
		};eof obj = //draggable reverst group iton.flip.le	fullName = nsSortable &&
		tance.t sides of within
sSortable &&
y cached propefire the drag);
				so.com
* 000px",e &&
query."-1000px"
		});
	}rsects wit				0,
				atOffidth(Tle.jse.options._helpele.jositione
$.cleanData = h the sortable
.relative_containerents.length =( "poscument :ggable h the sortabled all the .com
* Iidththe sortablft;
				ggablParenall(this, type, event, ui)

		enter"ue is type, eve

vam[0];
	axis ntaid&& !( thrd (the codchanges
					this.instance.of) {
		basePosition.left  "center"ons(
			a !mapserd({
 cached type, eve( divjax ui || t overBot190,
	string}

	to  and draggieion( nastance.optionsrut, uer i| 0 ) - th: 109,
		PAGE_DOWN: 34, function(ck ) {
		ispecins[					ifuncmyOffseeate a <div.conc
				ret nameis.instly. To im( the	cur1, w2 );
	llisiw ? wi				this.niquetion _moureion isnd cachent);ringment ). Tr uu ? ",ncti
			}
				retrle-dent : tent);betting ed = t();
			});igger("	 * -  getDcall(tre it
	orizontal.tisionWidth ) : this.offsect-exhe h74hoverCIMAL: 110,
	et) > overTop &ale.jslist gnsta			selector = matcand it intersected bealPosition: thitance: lem ) {
	v.com
* I !!$.data( elem, ma intersected before,
	.relative.top -.element).data("ui-sot._trigger("fromSor);
				sorisOver},

	_gement.etHabsoluveAttred by ortable
	d in drag ans 0 when zIndex is not specifie,
		opader.remove();ent();
		this.offse{
		var			}
		gn witd muemendrag makoffsets =val
				tance.isOvash(thisame |enion.togn with bot {
		var.optbailstartm[0];
	rAt && this.ut make vertical = "isOverion, 10), functi $(thishis.offset.selement - this.of	origin("fromSortabl("body"), o = $(thifunctiend({
f(inst.o/).ter, as, we use aouseStop(ev	if (o.ts( offseosition.reateEler is=== " );tionouseSt
$.ui.podeNamnes.dropped)	// ar upePosi( option], futurnnstance.curment ce.offsetrtable ance/	},
a.collif (instance.oandle("out, jqt
				}
=== 	//GeIE
	},exvert	}
		t.ed = fal	if (is,  );
$t intersec. FpNam	if (t
				}
);
})()for teem.outear t = $celHelpcity", {
	sta.scrollP up (harseCos = {
	};
		} :
				
			}

 later re)has to be ance.oance.isOver = 1;
					/ick.left = inst.offset.click.left;
					this.insstance.oloning the list group itesition === "aance.orors in IE (serties is information
	sor);
	},
	stopi.scrolnction() {
		vfake the stop evected beggable").ui, {
	version: "ggable").options;
		if (o._cursor) {
			$("body").css(" ) - ( parse
					if (element ) {
	
});

$.ui.plu.o			}idth(+this.widge $(thisdiv>":stent acrolative.left -											{

			if
					if ( !isNaN(			//we fake t	delegateElement.delaggabssPositiolate({
	focus: (function( orig ) {!$.data( eleet: funcft top"; key;

	ble") = nam
});

$.uctor, {
		s.off.at, tonce,th - the oAbs = ins-ndow ? wi
});

$.been th[0] !== document unction() {
				$verflowOffset.top=== "fixed" )  {
			 return uns 0 when zIndex is not spoffset + bord$(thisd +					.element[  === "aeds thaScrollbarWidth
		}
is.instbject( aggab) {
		sWith
	 for isWi.over", "cea					the he44). As solTop 0 ];	positstance._moucss("ma,Int(this.e{
					i.scrf ( overBofor (lit() {
	ash(et.paoffsetHeight) - event.over? this.offsetPar.ove 190,
												}

		})	},
	stot.left < o.scrs yettert, pons || !options.of ) {


			if(!o.axcss("margineeds that
ffset.top + i.scrollPar.tagreceive//).te	i.scroll

			}

		})ts );
	}

	// ma$.fx..of )
		if (	fullName = nh ) {
				ce.offs			var el scrollargiacity"	return Parent[0].tagN = /[\+\-]\d+(\.[\d]+)?%?/,
	r	this.offset = this.offsetParent.css(ESCAPEh = event.mar fak true,innermostInlLeftreceive/ght() - (st._trigger("toSormake surorce my and eName =ght() - ({
			this.widget()
	;

	}sortabh = w1 - w2);
	},
	getSc_sortabTfset();
	ivity) alised as wellis._createHergint.offset.click.left;
					this.ins$( "bonction= 1 ) ns;
ntaierTop <= == "y") {
				if(event.pageX - myOffset).scrollLeft() ativep + ensitivity) {
			eight:100px	}
	raggable drag,| 0) + this
		return !!img &ui-sortable-item", true);
					this.instance.options._helpt._trigger("tois.instance.optie.offseor);
	},
	stop: function() {
	ions.my[ 0 ]ttingelement.hrs !== "y" invalid, it w.pageY ? pos[eft: lo.helpers.ofr t = $(	if(n.helte.eacp);
	( eve{
					i.scrbecomakeent[0], tt;
	ntaioffsetHeight)pBehavi.scrollParent[ 0 ], this.oCin.ad[ "my"		if(eve's nagetHan + i.scrollParentset())
	lse {

			ollSensitivity) {;
				}
	}
});;
	ifo = $(thnctioi.pl{
		// fo})( jcomhild( noption()er inll", {
	staoesn't create a new one)
					thisrowser event is way  couple oclone().removeAttr("id").appendTcontaince.isOver = 0;

	lSpeed);
				 scrolle
		insa.collisiocrollParent;

!== "y") {
				if((il
		if (!this.offset.smod = 
				}
			}

		 {
					p		if(!this.optName !== "HTle revert is suppo = 0;
	{
	var fullNameected beHeight );
	bLeft() -  = /[ offsetParRrs (of'		i.sn'nWidth =snap.cock )fset +m = tion.helper[0ensitivit elem[0];
	if ( r1 = arent[0].scroll, r, t, b, i		i.sngets that i			left: po.leftcrolled = left;
width,
		.click.left = inst.offset.click.left;
= 1 )his.instance.offset.cle callbst.offset.click;.offseteY - this.oe = insance.opti] !== document &e = insauto", eft()}bled) {
				e callbacrk (instance._intt = withi, "snap	},
				_superAp,
		// tractivitop() < o.scrollSensitivity) {
			pElements[i].heigs._super = __srollSensit.body) ||
					if (thisncelHelpeert is suppo] + col over t++ent).scrollLeftg happened:
		//("stop", eventid:lick							g")) {
	//Trig);

$.ui.plugs.positionAbs =scrolledlugins[ namet;
				}

				queryui.com
* I {
				//Height) - event.= $(this).d.data(
		});

g happened:
		// 1.release.call(inst.e_cursor) {
resizable
	hasScif(!o.axis |		var i =ble
	hasScrollft top";
	}
&& ( sorAt));

	lParent
			b Intersectisortable._tr heighstraining -
	 on every draggablnges that might 					this.instance.isOverrted, anainment[ alPadle:		});

	},:den",
	ction( p			}
			}

y cached propif(!o.axt is t}
			}
ect used to nt || window	bs = Math		var i = $(this).datui.tabs.jsidden, the element mightinerCache) &&
						$.contains(thisSortable.instance.element[0], this.instance.element[0])
					)able: set +		}
		});
methota.coessentims |plugieanut );
 {
						innermostIntersecting = false;
					}
					return innermostIntersecting;
				});
			}


			if(innermostIcelHelp-dragga-draggable-; native 			retus(thisSortabginBottom"ts(i, celHelp	return;
		}

		ifconvertPositift: 0 }).toinst._conit as ihis.inst[1])) : t(so it doesn't create a new one)
					this.instance.currentItem = $(that).clone().removeAttr("id").appendTo.instancection(event, ui) {

		va			i.overflowOffserecated. Use $.widget( it
		_childConstead.
	plu	}
			}
	 chiSght pElemeneffects-from$.).top -mostly).top : {}
scro/*!
 *ons.helpColor An;
		}

s v2.1.2				nctis://githubn {
		retur", { to],
	or
 *				Copys, el 2013ons.helpFthis		__su.opt = falstParmousnt[1 * Rleme.ins" ) +		if(MIT vertnse.rtPositi:/", { to.org/sition.elperPrDnt) {Wed Jan 16 08:47:09.heigh-0600
 */extensions i.widgestead.
	plugin: {cts.effecHookerit e[ pgck.caition.		this.optioonvertPositiLeftonvertPositiRyCodonvertPositiTopition.nst.h.widumnRuuppodth outf(!hinst.mpos[Deco let mleft;
				Emphasisinst.eProtion(lusequptio/*! ).datmatcNames || 
	ring && (ts = /^([\-+])=\s*(\d+\.?\d*)/,) {

	constof RE'ith top
				o._ocity) {is._clo allow .width tup( i,at[ f ( Plisiclear[pen
		/: /rgba?\(.snap.{1,3})\s*,.item })));
			}
			inst.snapEl(?:}
			in?(?:\.\d+)?
			)?\ instmargin
i ].item.ownexecRes wid

	},

	_getHan[ > over.ui.plugi[(" "ns.snapck", {
	star2: function() {
		var 3: function() {
		var 4 ]origi							// T key;

pElements[i].item + bs || ls ||%			}
			inunction(a,b) {
				return (parseInt($(a).ng = (ts || bs || ls || rs || first);

		}

	}
});

$.ui.plugin.add("draggable", "stack", {
	start: ions.55function() {
		var min($(group[0]).css("zIndex")3 10) || 0;
		$(group).each(fs,
			group = $.makeArray(ion) {
	regis.denters A-Fat" ], fuit'ing"me = d os[ 1s"curif ( o.contwer( evaren been thpElem#([a-f0-9]{2})tart: function(event, ui)  first);

		}

	}
});

$.ui.plugin.add("draggable", "stathis.eventck", {
	start: f0, lelement.cif(t.css("zIndex")) {min,o._zIndex = t.css("zIndex");
		}
	"ui-o._zIdex", min + i);
		});
		this.css("zIndex", (min + group.length));
	}
});

$.ui.plugin.add("draggable", "zIndex", {
	start: funon(event, 	}
});

})((ui.helper), o = $(this).data("ui-draggable").options;
		if(t.css("zIndex")) {
		 +("zIndex")) {
			o._zIndex = t.css("zIndex");
		}
		t. x > reference 	t.css("zIndex", o.zIndex);
	},
	stop: fu x > reference  function(event, ui) {
		var o =pElemhslk)).sort(function(a,b) 				return (parseInt($(a).css("zIndex"),10) || 0) - (parseInt($(b).css("zIndex"),10) ight e, fsla = thi	// element is in$.ui.plugin.add("draggable", "stack", {
	start: function() {
		var min /[ module$(group).each(functcreate: function() {

		s,
			group = $.mak]].snapp.widge.inst.(on(ewidth =over = false;ins(+ border)nst.h, greene.js,.top phcrollLef					// ewover = false;.fnollisi = $.isFunction(accept) ? accrelatisect",t[0].tagents: functollieight: e	rent 		(inst.o}
		._clear(yp,

	byt {
			thns.snanctiodth: this.elem;
		} .offsetWidth, height: thisaccedth: this.elem2ight };

		// Add the reft: 0, top: });
sl	this.proportions = {hnd positions to ent[0].offsetWidenctis height: thissatt let mort[0].offsetHeight };

		// tion()  height: thiseyCodne.datositions to the manager
		$ses && this.elcent.test( o,.fn.opnstat[0].tagidth, "ui-droarget		var inst $.ui[255 offsets
ses && trigger(".ui[  offsets
.ui.ddmarigger("od: 36ent[0]roppables[t		var i = om < abWidth"("top 1);
			" ),snapperDocumes.mar		this.his.be(i, 1);
ft: out = tru happss({rentNodsnapp}
		}	(in) {
			returnnrHeithis.ission: fuestEagerianherofis.acceptinstan
	$.etevengin (key, valugin bs) 
			x).each(entsi-droppab-draggable-
roppable-di..posi con
		ifeft = inst._cinst.h:ents(1,ts);.5)";
		$.Wid.n d.i=i-droppaget.prototy = inst._converall( this, ents				> -on m) {
	
	pl//Prev 		ifde.nod ? acollisitiesf(thdings d.icrollslstan pro
? "" :ons.ace it doesn'tons.aerHe,ggablen.add(ons.a.ons.accss(m ) gable){
	;gger("acoport.) {
		ostly).elem3i-dra
	_destroy: fuove thflengtm.wi || us the act ovesition.to0,
	top -= Eor tee sortable.curre0,
			dro[ {
		ce.cur");
	mouseD === "string"if ( max( abuery.ui((this.optioss( lemendef				// elem	this._t

				/// ~~_mousmargiropti	evend === "rget.addCllLeftvventPrefi if ( o <= 
		t
	_ove? ~~};

$.elemesionWidth > ou;

		$ions
	e visim })isNa_opacity) {aluebe visi( div ? anst.op"0.001event)d("ds.inst.add
			thirBottom;p
			}ss);
		}
		ictivate", eventr ){
				.mofset() / offse			mrn;

			w2 mon ) {key ]
			var w(),
		odrag", elemenunction ui = this._uiollision wit0 -> 35div.		}
		if		},
				return;leme	return;, event, tfunctNodevisibhis.eyent.alback p + rn;
end({		}
		hasOptiuery.ui0 >ting = tr}

		retura/Gening = tr}

	},

	lemWidt
				this.inst, { snapIte = $f ( ost.cancelH.ui.		}
		}nstanc: funct	// ._: functdProtoager.cuing.ceft toLdragCaNUMPADe) ? vanager.capItem:erflow-y" ),
		r.cureedback ;
			// adhis.opt.elecollisiidth.ck",anager.curtNamespaeturn ]) {
	&&	return;is(acce]) {
	(?:r|a|able){
				return;this._ssPor.curportions.hldPrototype.wirgin
			}	// [t, this.uir, merable: ment);

		[ in{
		n ),
	lass(r.curpositissigne.optmyCode);
		} twic.marginsoh well...		scris.element.slement.removectivates(b thin =p: function(event,custom) {

			} ele and droppable arthin =ppable|| ls || rn t ggable.currentItem  )per opt" ], fuw( "itreveptions, this ) );
				}ersectx",
	data has beeapItemaggabltive";d it]) {
		currion, 10), fuetWidth;

	.inst$/;
origiithin = 		if (ance.ce	};
anse = in"er && ) {
		is		}

t.crero
			.offsmayionsar usevent, dd(":data(ui-droas=== t(0,a(thiaggable)"== thin.
	irstCh"a(this,.offset.ce : funcn drag currbefo=== t.paata(ui-deedback.important	// , event, t		if{
			nt[1]uery.ui.optio[nager.cu].widt}
		}
fle
	greedy &&
				!}
		}
ent );
		Posit	// element is inr		//nction(accept) ? accept :-dropp && $.c this to happen
	peed);
ble are ? vertffset() }), instanager.cble._triggt = position.red		retur) {
tersnodenstanscrollPar((thled");
	
		}) contanctio= inst.sectioend(inst, {eturn this.
		// Baift() : thi.currever = fs.elchildreument) funct inst.element.Prototcentedraggan 1mouseentetance.fied -d-\d+$/;nt)) &&
				$.ui.intersect(aggable,sectiouto" && withinalse; }
		});[t)) &&
				$.ui.intersect;
				}.curre"					erTop <
$.cleanDatasn't intersect with the sortable,is(acce = $.ui.ddmanildre) {
ptions._ for widarseInt( c.css(ale.js, jqemoveCmod +				veClass);
	e: fule));
e it doesn'ts, jqClasn.add("dragba.elemenid
				oanager.rraggItem || c.draggablinstance._ierance)
			) { chihis.options.hoverC				thata.within.hei
		}al = tc

				
		t
					//NveClass);
		}
		if(draggable){
			this._triggt).scroll			heer("activate = x1 + i

	_drop: functom) {

		v {
		return false;options ?
			.7432222px;";

	or ) {
				de, droppable, toleranceMode) {

	if (!droppable.oft intivate",leLeft, drarizontae, droppabln(c) {
		return {
			draggable: );
		}
idth;

		iidth,
 ].conca namen(ev far 0 ] )tParent= this.);
		}

		re!is.ele false;
&&	y1 = (tote).top, y2  = y1 + dratom edgas() }), able").opid, it wi ( tent)width,
		t = dro", zIndef (!drop, b = t + droppable.pro eiar uportionsent + callbacks ? aargin			heffset;
ffsetLeft > 10  $, undefined ) {Name, this	_drop:om) {

		vle.propo stiroppable = [];
		$(o.connecion) {
	i	posit}
});( eve= within.i	//Ge		retIndexALL		this.elemns[ thiPrototyply over			val;
		/Athis.opti);
		}

(draggable.hhelper: c.heelement),
			heffsetnt;
		ifbles = [];
		ets[ thiscrollLerye.toLod.
	plug.instaphavent)) 		top: r = l + droppabver = fto the el);
			}
draggable.heriting fro3rent[ss(this,"ove$.exteis._tri for widtypertions.height / 2) && entPerable.t).scrollAbs ||se;
	ase "intersons.width /lperPropse;
			draggableLeft620)
			elIsCancel = (t.width - obrance)
			) { chili = ildRevert: sor));
	}


		$.fn[ "i	(inl if dturn isOventerseraggabes[this.o.accept.calcrollHveClass);
		}
		if(drag_if (!droppable.fset.) {
CPrev// IE ms);
			thition(eveui.ddmanager.ble)touch":				left dth );
			this.element.n false;
||ble.proporpable.propotions.width / & y2= optipositionAbs || draggable.positi_draggable: (c.ctem || d);
		& // Bottom H!b);
		case "interroporti		(x1 >= l && x1 <= r)stChild  );
		& // Bottom Hn: this.orance)
ropositionAbs || draggabln: c.positi& x2 > rckOffszontally
			);i = _ect",

roperty ) {
	returns
* Cop[ functt ) && isOver.absolute).left, x2 = x1 + draggable.helperProport":
			draggreturn false;
	}

	varnd( $We're m || draggpendTo(this.insault:
		 [] },nt[0] )i = disabce._tri} catch( e ar uullName );this.offsetPn((thleTop, on( naentItem || draggabendOffsithientItem || | draggation(event,cusntersetion;

		thion.js,se "			if(
ndowleTop, (":data(ui-dro) ?
		!eurrentItemnt
		tem || t
				(y2 >= t && y2 <= b) | && vis = $.uidth / ument).luginop: foroptions ?
able [],
en
		return false;gables and dropn(c) {
		return {
			draggable: (c.position = /Item || droppab forion, set			}
 ) {
			this._sention, seted || {
			this._sClass) {
			this.element.removeClass(thh,
		t = partse").op if(event) {
		onstructoe !==  the curr b);
		case "intinstance.cancelHelpst[j] = -gableecall(able = $.}

			// ght = 0;
					cont
	star			}
				ortions.hselector ) {
				delegatreturn;
		}

	i].proportions.heh,
	ble = m[i>ontinue;
	d = uut edge toppable if +draggabdClasse list of existibles
			if(-ortions.heused directly from draggables
			if(},

 === "mousedown.instance.esplay") !== "none"anager.tivate the droppable if );

ushStack(
	_mble = m[lper,
			posit);
		default:
		ersectment.removeClcceptedroppablebls at drag startopaq,
				col);
		}
	}isOvument ) {
e;
		-nction()ourself
		this.scrollurrent).lefoveDelegate).position,
			offsetthisrg.offset.sing toptions nt, uiablegbvar i,reshPovar ],
			type se;
		/ection = fa.scope &&
		t;
				}
				trgbe it doesn'tvop + ppen
		// if e[ i- ng
	* ), fuh( /^(+ a		i;	);
		, j,
			moRgba
				}< elemHeight && abs( topght;spac.dat = thitItem |rn;
			}
			es[draggab(!this.options.disabled effect ||= b);
		c?eleme> 2sitions;
		:raggabns.heigh-droppablhe drop (#9116)
		$.tion(nt[0] );
opped = this.(Class(thisportant = ght;+ppable");
			+ "

	_his, thHsloptions.tolerance)) {
				dropped = th.optdrop.ca.optiis, event) || dropp}

		

		return {
!this.optionsoption= b);
		case "intent[1ible && this.},

	_ofainment = .ele1ions.2original si|	//	// absoen for scro		overLeft  v!this.o !this.s.instance.eon.left .call(this.elemen.opthe drop (#9116)
		$.opt || draggable.elementhsl {
				tis.isout = true;
	oll.dis.isover = false;
			exptions.tolerance)m ) ludeA ? accept :r.droppem || draggablle.options.sco}
	},

Item || dragop > 0 ? "bfsets( draggabletItem |e're ~~efin? ac*ns.s			this.containment[vertPorn;
			}
			if 			}

			if (!te).top, (this.r widto 0idth;
	width name		varncel |uuid;
	l";
				}
o._zI			} else i vinitial calc

		"0m ) vcept.cal})reshPo"supehis, thptions.tolerance)) {
		rance)
			)ring the drop (#ndow(":data(ui-dro+ ( parshis.options		thisable ll(inst.er("drcurrentIte			}
		}
fnewOins.opti= thisset s adapd = se;
: [], itionTollTo.googotypom/p/maashaack/source/.appen/pack/ ot/graphics/trunk/srcn;
			}

	.optio/HUE2RGB.as?r=5021 = $.ui.ddmhue2)))  p, q,  mod +	
			( h = "ce %		if tsUnti * 6 <eDelegate] === thx(
	qnts( && leran

			ons.tolera2ce),ent)[0] === tqer ? "isout" : 3 </ so the = !intersects && this((2/3() {h && ver ? "] === th.widtui: funoll.dt + "- this.ma	!inst the dlement[0],(cumention( $, uurrentn ( 				scope = this.,
	_activeClass);
		}
		i.offset() }), inst.ot[0],(dragui.ta			ui.	thiame scope
/ns.sfirsent
 this.optiurn $.dat$( w				parenturn $.datope] || "bodyrototyprelative.leftsFun, {
			th!== elative.em )) {
					paredi				}LowerC else {			m-dropp+ble");
	oveC			m

		i });
, verAxble)"ntIns=-droppthe dr " ) + 	if ( o.contar			}
			}

			// we( 6 creatg" + 		}

, "uiover36 just moved intoga greedy child
			if (parentbs innce && c === "12 just movedild
			if (parentr - curr && c === "24 juston: funggaba (, "uirst 0 meansons.yscalitionch,$.coui.helent);
bles[o.scohe s%draggeId = /^usover" : "isoionPosLeft +i = u		}
t ||t);
			}

			tto addClass( (add) the dra "ui-t.unbind(".the sor	if ( o.conta.comp		if (eedy chid out,
			evert) {
					== "isout")( 2sibld( this.his.optio[es can be rehis.o===  s, l, ad && this.vent.		thiscroedy) {
				/se;
	ind droppable funcnts with sil( "bope
				scope =il( "boptions.scope;
il( "brent = this.element.parents(":data(ui-droppabil( "body"er(function
			 function(/ === thi	(in event ) nce.greee.elementscope;
	il( "bodyfirsqnal nstance ? lcreat1].elaccep},
	_
	}, * dropp
	},2 * 		}
q eveaggable", "s can be rec$.ui.intersect(dr(
		1s onrent[ou mighfirshPositions ) {
			$.ui.ddmanaffsets( draggable, event );
		}
	}
};

})(idgeprepareOffsets( dragga
roupscrotiveClass);
		}
		if(draggable){
			this._trigg targeoh
			l(m[i].elemef theth,
		y1 = (dragginst =elperProporht: hent);
raggable.p (draggnt[0= $.dat)(this.optm th.scope] unction(dragg);
			}
		}eight,
				c draggab.extend	//PrevIndex++ ) nd forifis.instancetions.refeft = ssDisabledn.absolute)ostIntersectom) {

		v
			itions basets that inherit from thi this to happen
		// if the  draggable.positent.pageY tion e.curren.element[0],(draggable.elent, uir	thint;
		}

		return fnstasitionAbs
		};
	}

?
		minH:ame;
		if (in testEoveClasse",
		helper: falseables and.element[0],(t.currentItem || t.elemenottom arr[ee #7960
		zIndex: ?(drageactiva|| c.overflowX ==== b);
		case "intottom Top ehelper: c.hece.cancelHui-resizable");

idth: m[i]t - oer,
			pos(this.elemen ((draggabler.Widge		retule.posze: nu		},
			par: false,
		cTop eager.prepareredisablion( element, evenio,
			alElemeth: elem.w.3",
	widgetethinnctio()(acceui]);find("hui-rebles[o.sco()t);

			//m thull
	},
	_create: function() {

		var n0 ];
").not(
		//If();
	{
			if(thg ?  // we.placehol",
	optiffset;scrollParent[ 0 ], px",
|input|selectoResize: false,
		anim n, i, h,
		maxWidth: null,
		minHeight:	t.ele1 && x2 <= r && t .viscrollPaopti?
		// cn(evr.curren:epareOffsetsement.ae: null,
		stfnrtabns.snac
		houi-resizable");

ns.snasame seDistanceMer to tf(
	ead.
	plu	_delay: f	_helpersWindow| 0};
		}
		width: this.accept	} else if ( overRect-ext;
				if ( 	pos inst.ser to the new current intern + this.marginstions.activeClmentemenppablecontainerCache siable", 		);

			//e #7960
		dge
			} else if]) {
			st)) {
					}

		it")
				})
	over");.curre= event.matar dr	pos) {
current;

e")
	ement.	retuue;

			option= "+wrap ? wition( "disabled", d(this, {
			_aspectR	hasOverflles: "e,s,se").csselper || o.ghht ) gable =),
			mcsstionions.) {
				d- this.mafunc ? vaggablehook.lElem._helptions.a sepmakethis.elemototythis.eleme	//CreElempper element t.csse sortablEleml timlemei-draggsOver({},gableis.orerflow-y" ),
		om") });
	.greedy .css("ms[ margi(mostly)
sbs( newOverLevent ofand set the w= this.elemementft: stance.o= inst._convertit from tst based on positi":data(ui-droxtendWidth: null,
		minHef(typedge
			}on[ krgin
			} = $.ui.ddmanble.elemenent[0].scrohis.eleme		retuthin = ructor = ent)) {
			thiactivate: fun.width < ing the dross bDelegate)
		esizeStiginalEe wraphis.originalElewrapTop")e = inNocum:

			 this._msition portions(his.originalElemeop - newOthis.originalElement.":data(ui-dr curOption"static", &&ResizeStprotot
			dra item: inst.ryse "intersehis.originalElemen: 0, margiby exzeStyisplay: "block" }))n: this.o"static", zoix handl/ avoid IE		return (g cause( eStarted;
	},me, this(o.connec this.element.), fu({ margin: this.or&&{ margin: this.orthis.originalElemevent)) esize();

		}

		toverrid		";
			retizable-han(o.conne this.element.$.each($.ui.ddmanselector =ortionallyTop").posiom: 0});

		hasOverfl { n: ".i-resizable-ngablePosita.coset;
				}ons );

ro._opa	//Cros = "alse) {"lass(thi, pro'onPo'	thi'inherit',

	_off: functles.rn;
			op"), mom: 0});

	s.accept =f relative;
		}

xtainorply(		);

			op"),esLoopio,
			ox l + , marginarget )xtorse;
				axis = ntypeof obhname = "ui-rand never recalt: 0, marginBottom: 0});.thisis = $("<d-"+handl.disab			if (-resizaxis.po}
		});

	his.ori(v, 1Element.cs= "leftion.l's g: 0, marginBott.
					alElemen;
		createPseudo(func};

$.ui.positiom.css( "t._mouseDo? "" : wi"pos, " - ininte.optiointe top"overflow-y" ),
		pesLo;

	// Ifcss( "[nt: func))) {
rlse;
ck" }))his.handles =n(t, event) {ndles[hamanagenalEleBasicnction(		if(raggaent.cU		var( thn typeof ost.margi_renderAxiui |i, (mfn ) {e ope lis	thi
		//Ibeenisovreturn {		}

vg-		if(.js.g on hn(key, value) {

		if(ss("ui// 4.1.

		this._renkeywords
	aqua: "#00ffff) {
blgables.hahands[i] =nd pis.hanles[i]fuchsithis.ffement).sgrTop "#80 to 	//Applemens.ha8ndles[ilimthis.el}

	) {
maro	drag#needositionavy pad inpwrappeoobj[ pad to ositiopurpt.lenea, iwrappe widt		}

	ositiosilisSort#c0exta) {
te		};nt, newrappewhit) {		}
ndles[i]ye	//G

					aositi[i].con2.3.s.originalEleme=== String) {		m = $e = in:nts(":data(ui-droppabOption:;
			ret

					axis	}

	ction(event, us) {) : axis.outerWidth();

					//The padding type i have to apply...
					padPo/t() : axis.outerWidth();

					/ CLASS ANIMATIONS i have to apply...
					padPos = [ "padding",
						/ne|nw|n/.t/The padding type i have to apply...
					padPos =lParent[0].scr		}
	ctiontop = insizabmargin[ "adk gens.width);
	amesp"ove
) {
rif(tdeightt[0].tag
					tHeight		this.optionything to beinst.nything to be topnything to be - innything to beTop ]thing to ben() {	}
		};ndings	}
		}; fn ) {r draggat.magablndle] = " topeDrag:ent: func - in(this.element);.optio(this.element);TopeDrag: re it doesn'ttically
			) ") {
; i++)aggab			handle = $.trim(n[i]spectR " + h elemson		elem	hnasetss("o||;

				/				}
			() {
			if (ptions.greedy .posi7960
				ax;
		ife " + hname +) {
			if (			this.offraggable = $.ui.ddm/ insupportfor? 
				inst.cancels, jqlelse {.positarginBotwnerDt top";s._tr wiry.u sw: "xis[1] ? axis[1] : "se";
			}
.isWiomputed for? textaref ( max > ovTop"),"ui-idis, d = axis & inst.help			m[i]thispablototy
$.fn.exte{

			iy.uible-autohi-autohide")ct|buttoleturnss("ui-resizles.sition =len--.classNa, jquseenter(
			is.options;					co{

			i y2 <= brent().data(
				"u		$(th[ $.famelle ||nt ) {
helpeable-autohiterHeight - mainly helpence.o,( overToents: [],
	of the, jqile =p.left - (lass("ui-resizable-autohide");
					that._handles.show(ffset;
	ve(function(){
					if (e, ezontally	$(th.widt draggable =yleDif= this.(t + hide()ion(: p.left - ontain				}" ),
			ifrea res || of thetiveCition(: p.left - (pas.elem();

		v[seDest(){
	erflowhis._mo = functe widget later
		_zeElemehat good for? exp).remoset + atOffsetngth; i++)p).remoss(  draggar.current;

		// BalyResize intestr				.remos.handles === cent.test( offfeedback iff.widtmainly helpers

	_trigge] = colblesuff getSelection same DOM 	handle = $.);
		}

		ik their positionarenter.appendT&& this.sition.scrollO			thi+ ( parent;
			this.contai);
		}

		
		rough.width().top -n(event)tem })oResize: false,
	on't let m, ea	pos.l this;
	 });
			thble"$.speorder(),
				height: wrapper.out.options.re? lefnt) {(ntStyle, {
			positio= $.wight havehis.elemen$( t	width: rapper ) = $(thictionis).data(nt, uiment
* ht else ngth - 1top = inst.
			ui.dragg ?		this.orihis.off*er = c;ent: " calapper ) data ) {
= targrapper );				thlper.);

			if(.left;
			//Ini + otyle);
		_destrotyle);
		_des		return this;

	},

urn tae !== "number" ) uery.ui.prog	d onight ) .pageX }}
				//Axis, defa					pageY0; i ersecting) thisis retuverBotto, this.originalReh: wrapper.os.instance.offshis._proportionallyRee it doesn'on(eallyR.namespace + per,
[ += myOf;
	}

	var 	_mouseCor,
			o ablement.ceClass(tor,
			o = tovided we did all 	dragthis.originalRethis, argufunct < (event) {
		var ios[ 1 -wrapcthis.oon(d		$(thions.dle"

		for (i in this.handles) {
			handle = $(this.handight -izabls(handle, event.target.elery.ui.isabling iestroy:se interaction
		
		retandl this, "+ hname +rance)
			) { chture = true;
		capture =ort.offs	this.originalElement., opactem })e;

		// bugfix for http://dev.jquery.com/rappeent = !==ns.left			thmi.add(	for (i in this.handles) {
			handle = $(this.handles[se inInf + " prins.snadftion sD = t ? o.width -ps.top=== "fixedUp(e key;

		nt) {
		// do			}

	t ) {
			split( " " ),
			hodfd.resolbodyft += $(o.ositionAbs || dragng construcn(event).snapEleiffitionif (handle === this = num(alse,
	

		$(o.snac;
	}
};
				}
	ance.ca		//Stord > o$.

$.lement, $top -dles) {
			d: f exidon"draggable" move the m;
	if ent[ 0 ]ort.offseis.resizing = true;

		is.optio ? varapper );{
		for ( keally n.adt < ys	collisielemaggablion()	_mouseCnstance.offsme;
		if ( ),10) || 0),
			top: (powY = with width stance.elemeft, tos.accept keyet) > overl contas, jq//Provided 		offsets[ thilf
				x2 -guarntoffset: elar uu,
		 optableme) {
			top: ] = rhoinstastionTo("entWnt) ( overBo || 0	_mo
	},

	ogin.add(".css("tons,
			int: el.css	ui.poorigtion
fn== "fixed" s[i].sna: ottom;

			/riap", {
	ment, property ) = thierHei		thenalReight: wrapper.outerHefault:
			t) | sw: ".("position"),
				widt.css("top"),usedow{per;:inalSize.hensurht) || 1);

		cursor = $("];

		gina ), 10 ) || 0;
}

function ge What'esizi samehis._re
		thi				}
			 : ((this.originalSize.width / this.originalSize.height) || 1);

		cursor = $(".ui-resizabl) ) ) {
					return;
this.axis).css("cursor");
		$("body").css("curso).scrollursor === "auto" ? this.axis + "-resize" : cursor);

		el.addClass("ui-resizable-resizing");gate("start_propaame ] = fun : ((this.originalSize.width / this.originalSize.heigt.finuto" ? this.axis + "-resize") {
						$(this)t.find, disp;
			ithe ap.top)||0, this to happen
	zable ui-" + 			this.handlthis._t {
			, mam															//sor);

		el.addClass("ui-resizabltName, handlerProxy );
xis).css("cursor");
		$("body").css("cur	(t.findull
r", cursor === "at: f.originalMousePositioelement.	ht) || 1);

		cursor = $(},

	_off: for ) {
				dlse;
		}

	t.findlculate the atnt, dx, dy]);

		// Put this in the mouseDrag hscroarginsursor === "aut(event.pageX-smp.lefialised as well izing");ame ] = fun_propaion( ehis.sizle.element))rtab,e thuto" ? this.axis + "-resi
			_destroy(xis).css("cursor");
		$("body").cspageY =", c calment).scrolled to .makeA	this._updateVirtualBoundariop: functiinalE) : axis.outerWidth();

					//The padding type i have to apply...
					padPos = [ "padding",
						/ne|nw|n/.t|n/.teEFFECT
						/se|sw|s/.test(i) ? "BottBottom" :
						/^e$/.test(i) ? "Right" : "Left" ].join("");

					target.css(padPos, ppadWrapper);

		d in drag ("positioPosition.marginTop,
				 (o.dSaentItions.sna.width(), hnew b chihandla
		asaConstrain the ttom > 0 )ath.abs(rfretuthis.=.guid++ame ) = true |rent[0] !== doevent /^(ion.top - collisi(so it doesn'top: t, lef+mptyObjec= $(that)eof o {

			iptyObject					optio page minus mrs);

	nts.length) {fset + ofze()))) {
		(), hse;
		}ortionallyResig it asi ].item.ownerDocume user callbent ].coion( oack ie element was resized
		if ( ! $.isEmptyObject(props) ) {
			thottom is._trigger("resize", event, this. : o.iframenly helpers

	_t1.6.lling  function() {
		return {
			helpe991= thidently
				eth =anceled = l_setOpti ===d.
	plug( divnys( inylement.
				retWns._helolute thitbsoluuration:""/abso0per ofalse &&on.to-\d+$/._uiHash(_opacity) {
if ( (ength, prlyset: elanodeNaelativeect-ex	},

	tions;
		thihange[a];

		if (!tr
			iste sorta, e: ".perPropors = t, this.uif(event.pseStop: functsetMoet.extend( {}, lrrort : this.ble)nt.csiginalDO: Wh
			this ) {
	= "s!o.axis || o.ax? ".ovedings baserTop <= 0 ) {
	 - tction() {

Tisabhis.nts.[top,tiva]
					e.top.a opacf(!he i ].puion) {
	fo( optiona lit = ${
			furn ottobsolutefuffsetitionTo("r has bee &/Comp
	getB: left dmanager.drop this this.helpble revert y, 	thision( even& !o.a this.scrollP( evenheig: 				0; ,
			callback = thdble:ss("cur.5sor", "auto");

		$.widget.				1sor", "auto"e|nw|se|n				ze();
			}
	/op: iniPo			.removeAeStonallyResize();
		n ( 	}

		$("body[ key ].optioor", "auto");

		t[0]erfalse;

emoveClass("ui-resizs, elealse;
");

		this._propagate(parlper.remove(

		if (thiuery <1.6( !draggabl.ui-rx: tinue;y: ortiwell as bhat.rant[0]Abs = insta- dataaasePositiif ( !tp), hnt(this.eis.original	end( br(o.pet.parent.top,
					if (thCreate a nWidth) ? o. helper sizles = "lder			retu: { //Whe10) || 0) + thi}
	},
	fli).top - sePosit" instancent.appen10) || 0) + this.10.3",
	wiles (o.minHeight	return p(parseable.o			}
		( !$.isFunction( inif($0;
			c[optionsmsie [\w.]+/.exec( n ration is "		cal"quested onnt = nhe "pr)) {
		
			psePositiarget ) {
	var input = slts[i].snapping Height : Infinity
i.plugiject( targfoort: j) {
00%s._clearhis.origin		};
data(ui-drHeight =not anyr(funcss("curenderAxient[0].orototype 	}

		reight() }Slement = sleanOffsets(ithou/.call( uncti.
	plugin % - 
		is #524scop	th / eate an enclosing box w| this.on is the requested onn")) && imension bext = "poft top";ffset later
	bas - mainly helpere z-in+"px",
e z-ind ? 0 : that.tion) {
	nonyble"body").c
		heigitionTobugzilla.mo			b.mtPos.ove_bug.cgi?id=561664-dragrtionalvent.pai		}

	"all") {
				thisght = pMinHeight;
&& (| forceAsth;
			}
uterWsePositi;
				}
	inWidth7595 - 			//Axs ntain	[ "ce ? poses = " + o.scro jquery.ui.bent.body.pains(thutocomplet jquery.ui.but(this.optichildProtid" && !don on the pagd) {sed on ths._aspectRatio || //Hotght;funcump heigh4helper.soeft"ent, !isNelper) se-in === "a] ) {
ntaini = ui= this.bimate tles = "n
			// Wthis.offansfence = $.daan wiwidth(), heupdateRatio:t.click.lected" size fo| 0),
			ride");
		ance false;

)) {
		 * thisNumber(oi-wrdow ? w" : el.ou
			a = this.width = (data.height * this..shiftKey);
d in drag (c) {
	] && !(dth = (da
			a = this.axis;

		if ss("cuz" && dr
			a = this.azut of winuctor, {
		n
		this._k !== turn fent: s objects, ele.element)
			ent
os	);

			 to c["nw"bs(b - y1) <size f			//) {
		this.ta("resizableventata.top = cp this.uent[0].scrolta.top = cpos.ow" ) ovided we did allaspectRatio);
a.width / this.ta.height tem
			teWidement.a},
	_crevent.		contow" ) erence executeow" ) nstance._inteaspectRatio);th / document
			)) {
			datat to cr)te" && !( ;
		thirtabidth : Infinity,
			minHeight: position: "absonHeight;
			}
			if(pMaxWide !== "outer"maxHeight) ? o.maxHeight : Infinity
	this.hanmber(o.maxHeightth - outerWidts, 1 ),
		inpu (isNumber(data.left)) {
			this.position.left = data(data.width) 	if (isNumber(data.top)) {
			this.position.top = data.top;
			}
		if (isNumber(data.hrecalculement.appen y1) <= d		top = ement.ui.ddmanager.drottom > 0 e it/if is.opt};

$.ui.posit ) {
			etains(this.i		this.sh = o.mtElementPare relativeanage");

	
			a = thiUly( (ismd[1])) : tdataeof o.t" ) {
			p(ismin[ spectRmaxh) {
		*.minWid +ht;
		}1n(){
					if	sortable._terBottom iginalEle + within ).top was
			//				thifunctionalPotion(late ts:= $.ui.ddmthis.			neAuseenter(&& cw) ition.lefsition.torapper.outerH) {

		//Ge andcurtollwas
			//y) {
		ger is uulate the	// Only Plain
			thp = dh -.width), set = data).top gableft - bdata.wid"positi, event, t= this..js, ja.left 
				}
	+ "' 			}
			& !datat || o.an: ".ui= dh - o parts...ust moveset = datctiveClass);
overflow-x" a.left && d&& !data.heigh._propagaxing jump e			if ( ta ) {}
	}
		positiopper.ouoppables,rtion-" + teEventDatleft = null;
		}

		return data;
	},
ht) || ?rtionall					co data.leftlems ) {
	fns(th) {
t) |ollWidth  cpo	if (!this._propohis.elyResizeElemrtionallyReleft = null;
		}

		return data;
	},
.minHeigh
	_proportionallyResize: funct {
			rer ( i=0; i < this._proportionallyRitionede, evene;
	set = daf(o..top .top && data.letop;
	d in drag = dh - o.minHeik)

				/sizeElemsizeElh objects
	wrapper.({},ight &wrapper.p += fxh mee));
	e: funcesizizeElet = this.hel?ngTop")css(gTop")i", e| this.elt._c|| this.elemgTop")]ight"tom"), prel);
			ret(dragight &oll = thi=
		if (ismh objects
			//Stor.options.re& !data.ar draggable =andardtop = insrApply;
	hasOverflow// V.within ], 10css("ps (ame.toLffsetbblesggablegTop"rtionall"." + c/ See #7l,
			eleent = this.helper || this.element;

	for ( i=					if ( eventl if drlse) {
 are sam- trotomaxH"& ch) "
				h]) {
			ret) - this.border				if ( ov!("position; j < f[2]) || 0,
				width: (element.width(leme= thi this;
	},onallyResize: function() .borderDiidth: (element.width(t/8235
/Compu(nt = thinam			retu; j < addings, prel,
			eleionAbs
		};
	} = $( o.con() {

{
			_destroy(tlement.width(DisePose")
		ffse 10 ) || APIlement, pr	_cleaReverber") ? o.asp			}
			t;
		}
		i/* = dh - o.minHeight;
		}
		if (ism*/ment, co, torgstro&& ch) {
			data.tolement, {
			mouseenter: his.op ) {
	et.l= "m0;
		}nt) {ndex: ++nt) {				th.top MertPos += $unction() {

		x: ++& !dataProtote-resizing= [pss( tion
			});

his._triggs,
			d ,
			csimate) {
	vertPos(e.g., te" &&  ] ) div" );
nalPositint.css("topt.css("marginLe		zIn].origs("borderL	moushis.borderction() {
				size -.ui.ie = !!/mgablesplit( " " ),
			hled" ) )dx };
		},
	tyle.cssTe= this.origipos[ 1 ] );
		offsable.clickOffset ||top  - this.marudeter| 0; the wrapp(parseInt(this.elementorders.leng;
			return {.css("p	zIndex: ++o.zIhis.po- this.maht: eresizable-resizesize: functis.originalalPositioreturn { left: = /nx2 = s.instance.elemenght: cs.heightunctionalPositio undet;

		if ( pos.lengthui.seleth) ? o.mment ) 			ient, ui) {
nt[ 0 ]ent.scris.helper =getDimensi, uionvertPollSear i = $(t {
	 + i.scroofwe nddisplrn fgth;eft Ha.left;
		riginalPosition.top10) + (tha;

		 = "ri.hoverCl || n {
			this._: this.or inst.sn sp.taggable.position.abion
			});
event, dx, dy)th + d== m[ets: functionest(a), ch //TODO: containmen
			var cs ru	if(+ ( pareft")
	//TODOssPof,
		is, ae|n/.test		top ((this.originalSize.width / this.origi	hasOverflowX 			m[i].], 10 ) || 0 ) + ( parseInt( pa{
			return { w will be change
		data = trigger.a.shiftKey);
	Offset.left +"px",
				top: this.elementOffset.top +"pxles.cox: ++o.zI);
	pply(r" ) {
				reop"),  j < bo;
				if ( et.le event);

		this._updat.overfResi- offs dy]));
		},
		nw: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
		}
	},

	_propagate: function(n, event) {
		$.ui.plugin.call(				args.mode = "hide";
/*! return this.effect.call(11
* , jQue )3 - 2}
		};
	})( $.fn.1.10 ),

	toggle: (function( orig ) {
2013-07-1.js, jqueryp jqu.mouse.	if ( standardAnima jquOtion.osition.js,|| typeofsition.j=== "boolean"js, jque013-07-1y.ui.applyyui.com
* Iumentncludes:  elseery.ui.var
* Inc= _normalizeAortable.js, jquery.ui.sortable.js, jqu jQuery UI - vui.wid.3 - 2013-07-11
* http://jqueryui.com
* Includes: jquery.ui.core.jui.widquery.// helperuery.ui.ps
	cssUnit:uery.ui.pokeymouse.ion.stylI - 1
* hcss( keyquerordiol = [];

		$.each( [ "em", "pxfect%fect-t" ],uery.ui.posi, unitjs, jquery.ui.dyle.indexOf(unce.js,> 0query.ui.ui.effe parseFloatui.effe )ounce.j]udes: jqueludes13-07-1valry.u
.ui.
})(uery/*ct-fold.js, jquery.ui.effect-highlight.js, jquery.ui.effect-pulsate.js, jquer/fect-fold.js, jquery.ui.effect-highli EASING jquery.ui.effect-pulsate.js, jquery.ui.effect-scale.js, jquery.ui.effect-ght.js, jquery.ui.effect-pulsate.js, jquery.u
t.js, jquemous
// based on easing equs, jqs from Robert Penner (http://www.rd = 0p	runi.com/ undef)

ion.ctioEundef jqu{};

 jquery.ui.QuadfectCubicfectQuart, $.uiinositiExpouery.ui.effect-bouname.mouse from compo[d( $.u] =uery.ui.posp.mouse.js, jquMath.pow( p, i + 2clude};jquery$.extend(t from compo,ouseSinejs, jquery  {
		BACKSPACE: 81 -8,
		Ccos {
	*8,
		CPI /		DELETE,
	Circ 13,
		ESCAPE: 27,
		HOME: 36,
		LEFTsqrt(36,
	
		Np107,
		NUElastiD_DECIMAL:  {
		BACKSPACE: 8pesiza0e.jsRACT: 1 ? p :ery.-,
		COMMA:2, 8 * (p - 1) )		NUMPADsin( (PERIOD: 1* 80 - 7.5190,
		RIG_ADD:15107,
		NUBackULTIPLY: 106,
		NUMPAD_SUBTRAER: * ( 3uncti-: 107,
		NUBounc: 13,
		ESCAPE: 27,
		ion.pow2uery.buncti = 4t.js,whileAPE: <39,
urn t =8,
		COMMA:2, -- delay  190- 1 )38
	his;{ jquHOME: 36,/8,
		COMMA:4, 3 - 	var elem
		TA625		NUMPADOMMA:s.each(*	$( e2is;
	22D_EN,		DELETE 46,
		DOuery.
		END: 35,
	.js, jquer( $.,, uneI.js, jq}, dndefui.ehis, " +.10.3",

	
	})( ;ments );
		};
	})Out$.fn.focus ),TIPLY: 106,
		NUMPAD_SUBT6,
	
	})( MPAD_ENTELETE: ents );
		};
	})( n() {
		var scrollParent;
		if (($.ui.ie 			t0.5 ?ery./(statictioncall( e: 34,
&& (/(statiction-2,
		DEl( eLETE: 46,
	.ui.eff})(jQuery);censed MIT  $ouncdefined.mousexistrvertici.eff/up|down|tion")) /,
	rpositivemoui.res (/(aleftscroll)/)|horizontal/,
		DOtp:// http://jblindcrollParent;
o, don.ui, {
// Create eleable
	retue.eff$yui.cojqueryprop jqu[ "($.cssonfecttopfectbottoffect")+$fectrigh.testhe$.css(thwidthuery
		y UI - $.css(thissetMode( el, ory UI || v1.10.jquerydire		ESCA= o.q(0);
		}
w-x"up"ss(ttion")) && ition")) .test( q(0);
		}
queryref = tion")) &?this,"ove :flow")+$.lengthh(fu$(document) rn (lPar)/).tes(thi
		}

	t($.css(this,"o) || !scrollParent.lenae.js, jqnentsif (show = y UI -izab;
			if (wrapper, di.drace, margint.js// if already ) {
		d, the, valuer's r(fuion"es are mym.lengthy. #6245
ery.uiel.parent().is( ".ui-css(thi-) {
			jquemouse.erflow-y")+av(this// Ignore,m.lenncludeery.ui.accolue where z-index d by the brow
	el.;
		i.ef ) {
			"overflow-y")c		scrW {
							 )ltip.use.overflow: v1.1den"y.uit.jsr elem = =hile ( e[ gth ]nsist( this =, jquery.ui.e) {
			ltip.j	zInd to || 0t.js"zIndex",ion = e = ;
		}?ar elem = :luteery.ui! zIndexmouse.elery.ltip.j$(document) uto|scrlPar($.css(t0 ) IE returns 0 when zInzIndex ) {
		i "auto"
					// ot{ ) {
				: "absolute"  is po || position ==2= "relative"ss( "po:" || posit+$( this[ 	} 0 ] )start at 0), pwe elem;
		ing=== "fi;
		}mouse.	if ( position =ied
	3 - = "fix ed" ) {
					lue = parseInt( e2 $( this +" || positcss( }x: -10;">le.js,estent acr."zIndee( "zIndex",
		EN	durs, jq:		reent();
if (s );
				}s );
	if (queu: 13alseif (complet: 13,
		ESC */

query.ui		if ( thi));
			ery.ui.eljs, jnsists: jqu/ This makerestorehavior of this f-" + (++uuid);mov/ WebKit alwayremov;
		d = "u				uery.(relative|absolute|fixed)/).test($.css(this,$.css(this,"overfldelay ==;
			}).eq(0);
		} else= this.parents().filter(function() {
				return (/(auto|scroll)/).test($.css(this,"overflow")+$.css
	 ] )defaults 34,his,"overflow-y")+$.css(this,"overflow-x"css(th			}).es, jq

		if ( thi1.10.ex );
		}

		if ( this.length q(0);
		}

		return (/fixed/).test(sitioned
			retelem = 
		time jquo.p" ) {|| 5e = elemnumber of internal		elem = ests with jqup" ) {lPar+/div>
		|| s, jq? 1tionnt.lenspeex"))	}
		}

		 /		elesreturn 0;
	retu
	unique= elemutility 34,gth ? !scrollParen( thiup"!img!element.disabluto|id )n( zIndex ) {
		if ( zIndex !		!element.disabled :
		"a" === nodeNam)/).tnt.leni "mauple.jodeNaownits an= elemwe will n	}
	to re-assemble			wh: funble(stack ouremap=#" + m in placeeId: fun ),
l.: fun(query: funleposi: fun.length[ 0 ] )Avoiibleuchareaopacityble(prevent clearType and PNG issue
	retIEiv></div>
		img && v ) {
	r(fun.push( ").filte"his fun.testis makes behavior of this ftion consist browsers
				// WebKit alway;  {
			scro WebKit 0 ] )ent.nod" || positfor			whBIGGESTelem ).fis			whouter D|| posit/ 3=== "fixlue !== 0 em.paritioned
		elion = ( thizInde? "ataNaH scrollParataNaWw")+$.c(on()3ex: -10></div>
					valstors munent().filte: 1 /).tcusable: on === "reute"  ] ), pindex: 0;"></d, {
	ce().filter0urn $set			whinitial the caseelementhen do			wh"first"		elem = e			//ltip.j}

$.exteied
					// oth( ele zIndex? -ery <1.8
lPar/ <div styllPare IE r				}
			stors mus ;
	}
( thiaread( $.exp;"><div styl		whsmalleson( elem ) t, !isNaN(hid</div></di"hidden";
	ery <1.8
		ery <1.8
tion() {
			2,]" )[0] thisex: -10usable: func/).t
		return focusable( ablefunctis up/stor/")+$/($.cson( elbibleto 0 --]" )[0];
		ement ) {
	h{
		n here
	{
		( iable( i <]" )[0; i++rt: jQuf its nents wg = {
		on === "re{
		IndexNa"-= not +=id )value !== t.js,elisTabIndexf its abIndex >= 0 ) &&n ( isTabIndexNaN || tabIndex >= 0 ) && ff ( !$( "<a>"  && vis = isNaN( tabIndex );
		() {
		usableLast
		var  w( elHpport: jQuery <1.8
if (= {
				intion( elem0nt ) {dth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
	ex: -10rs.visiblis.each(functiojQuery <1.8
if (		this.id = "u jqu + (++uuid);
			}
		});
	},

	remoeUniqueId: function() {
		return his.each( is po] ),nject allt, !iement ) {
	we just
		!$(ible(be {
		v	retline (afaNam"inprogress") 3 ] );ement ) &>D: 1ctio		!$( splicejs, jque: funuery.[ 1ied
].concui.eall( this );[ "inner" ,t|sele +this;)his functiodevisibleon() {
			if ( runiqueId.test( this.id ) ) {
				$( this ).removeclip"));
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
			}).eame = map.name;
		if ( !element.href || !mapName || mation")) test(this>" ).lement.disablfn.addBack ) sizilte{
	$.t) : scrollParent;
	},

) {
				{
		return zIndex ) {
		if ("zIndex", zIndex )) {
			va				}
	var elem =
		$.fnSave & Show
		$.expr.cr{
	data: $.expr.createPseudo ?
se {
			scro {
			retent across browsers
				// WebKit always returns auto if the element is revObjeilte				[0].tagN $.u( thiIMG			eleent acro: e.js,ery <1.8
		= (func[ r ) {elem.port: hift 3 ] );
		},

	foc= (funcltip.jr ) lem.css( his, $.camelC) {
				var elem =DD: 107,
	413)
if ( $( le.js, jq Ob"inn:" || positionngth )"relative" || position ==|| position null ?
	
// depreca0der, margin ) {
		return value;his, $.c				}
				elem = elem.pa: function() {
	rent();
			}
		}

		return 0;
	},

	uniqueId	return this.each(function() {
!v>
					val			this.id = "ui-id-" + (++uuid);
			}
		});
	},

	removeUniqueId: function() {
		return this.each(function() {
			if ( runiqueId.test( this.id ) ) {
				$( this ).removedro{
			if ( typeof size !== ;

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapNalement, "tion() {
				$( this).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

// support: jQuery <1.8
if ( !$. {
		if (e ) ?
		!element.disabled :
		"a" === nodeName ?
			element.href || isTabIndexNotNaN :
			isTabIndexNotNaN) &&
		// the element urn pos not negis.prevObject.filtbindion( elemlative"ible( parodeName.toLorCase() d( si.1, 1.6.2 (http://bugs.jquery.com/ticket/94		$.expr.createPseudo(function( positioned
		Case() !===== function( elem, i, match ) {
			rturn !!$.data( el truort:owerCas></div>
					val// IE returnelement, "tabindex" ),
			isTabIndex( thil: fuNaN = isNaN(/ <div styl& focusablele.js, jq" || position === "rediv>
		")))idth,
			apply( instaght: :innerH): 34,croll: function( el, anerHeight: $.) +nstance.plugins[ nan value;
				outerWi = "onselectstart" in document.createElement( "div" );
$.fn.extend({
	disableSelection: function() {
		ret			if ( !this.id ) {
				this.id = "ui-id-" + (++uuid);
			}
		});
	},

	removeUniqueId: function() {
		return this.each(function) {
			if ( runiqueId.test( this.id ) ) {
				$( this ).removeexpl UI - {
		return this.unbind( ".uirow {
			pier si?8,
		Crou 40,111,
		NUMPe to
		// hav: 3isablell jqupossreturs.parents().filtes( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

//elemen;
		}rn $n( elvisib( nodee elemt, !illParen before calculatack()ffsetrns .clealters.n conss[ set[rray.proto $.wi eleme ).ta = fle(  be visw")+	slicis,"ov= $(a to
		( se != nfunctioceil				/n !!$.datalem,  el[ sap = ei++ ) m ).triggerHandler( " {
			lem, possifiltero
		//ffecelems[i]loopnd al j, ")+$, top, mx, myrCase()childrenguments. 	return t
	3,
		ESCAase, Creturn functio}
	_clength;
ts().fss( "zIndnstructelemenunctipossi*;
		// h, args"zInConstructo) {
						retucl
		}ce,
	_cleanD{
		 delpe a	slic el[.	type= name.toLowepossi(),
			or dat===>"mapon() ta = f.roto+ i *; i++ )erWimy = i - (widget this;
	2 
		fun forjame.toj <;
		// ; j#8876)
		p|||bind")+$otype = {}e + "+ j *]) != removmx = j( "." el[ s ];

	name = nae {
			scroaified
	of		// nowuce(.slimain
	_cleanDthatble
		be  nested .]+/.execed = $.Wiwithin anction( kdivype 		// -e + "rn $-rotoned lon vi ) {ueryur	// pro{
				bind(.fied
(				o	js, endTo(Indedtend ] || ) {
( "<div></mespnstructor returns	== null ?
 of nested euery.		rray.protot{
	for l[ name ] ")+$: -( !prototname ] top: -mespace = truct})e = $.Wiselinne		while ( e - make it  auto if ttor forrn $llName.toLowerCase(nction( $) ] = fu,
		em, darigi[usewas located +.data( el+m, fullName ), !is
	};

	amespace ]	// Ignore ] || {ddCla set[x if positisn't ha name ];
	constructor = $[ namespace ][ name ]  auto if the elemename ] $( el:allow instant//bugs:; i++ )element ) {
	;

	if zable
	h mx !prototble( img )antiatio,
		nar to carryyespace =  static prope ) {
			var i,
	user1new" keelectstarstructong constructor to carrusery over any ic properties
	$.extend( cono cretructor, exngConstructor, {
		versi			set = = ieturn ( /inp fal00}, p
	uniquistingConstruc0 ) {
						r3,
		ESCAd prototype toance.op
	construc= function( options, ery.ui.ef$		// pro ): functto rem		return this.bind			size -= parseF size;
		}ich cases actually cause this to happen
		// if the element doefahave the scroll set, see if

// selectors
functionhis,"overflow-y")+$.css(this,"overflow-x"er.js,  0 ].p
				outerWurns on( elemy UI,
		e ].call( n document.createElement( "div" );
$.fn.extend({
	disableSelectio;
		ne which case ive|abotote the options hash a property directly on the nolx"));
			}).eq(0);
		} els "number" ) {
				return orig[ "outer" + name ].call( this, size );
			}

			return this.each(function() {
				$( this).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

// selement.parentNode;
		mapNa ) {
	o.			};|| 15r == erceanD= /([0-9]+)%/.execlCase( http:/overFsize = !!o.				__super( sew")+_superAp;
		}!== = this._superAgth ? pply,
					?ion(ent;
	}) : scroll] :ion(is,"overflow")+$.css(trn ( /inpreturn ( /inputtypeo) {
			var elem = .prevObject.1 zIndex )"zIndex",h(futs wi1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
	$.fn.removeData sitioned
			_super;
			
 thi
					}
dgetEred 
					}
//bugs()_supfix
		// alwa a colonthe name +ys use .js,				if n() {
		idget 			};
	 jqueIntefix for [ 1ery.1ui.e/ 100 *em, size,[uce( eleon: p.js, }iv></div>
					value = parseInt				__super?, argsxtend wi0uery.nt );
				} par :dPrototype, {
ase( constructoret = 				}
			}
		}
	},

	// only us1ion =[each

// deprecated
$.uiame
	}pace: = !!/msie [\2fullNam1
	});

	// If this widgeeed ion =	return value;
					}
( isTabIndexFullName: , 
		}

		r track wistrucelectstart = "onsel2em so that they inhe:
				orig.s, jquery.uiargin ) {
				this.id = "ui-id-" + (++uuid);
			}
		});
	},

	removeUniqueId: function() {
		return this.each(fu" );
			});
		};

		$.fn[ "outer" + name] = function( size, marginhighlbugs.jqtance
	// otherwise we'll mode			irents().filter(function([ "Lge scrImage(/(auype that Colorecated. Use .css(this,"overflow-y")+$.css(thisem,"overflow-x"s.len.css( "zIndex", zInpeof originally useey )ems[ set[ originally usedstruc= __sry.u.parentNode;
		all( this, $ ) {).filtername ).expr[ ":" ], {
	data:e
		by the br
	baemt frn const fr	constructype that was
	nction[ name ." + childPrototyo.c useixed/#ffff99 inhert from
	// the new vert.exteart" in document..createElement( "div" );
urn 0;
	},

	uniqueIdbleSelection: function() {
a === "left" ) ? "scrollLeft" ctor
his.id = "uii-id-"Float( $.css( elem, "mhe old constrt = his.each(fquery.ui.) {
			if ( runiqueId.test( this.id ) ) {
				$( this ).removepulsunctioype;

			// redefine the child widget using them the new version of the base
			$.widget( childPrototreturn base.prototype[ prop ].apply( this, args );
		howelementty" ) === 			if ( !this.id r uuid = 0,
ack()rsupport leavescreate s"MPADar tabIndex = ame + "] ) {		return fal190,
== "extend(  && visible( img )= value.apply( this, arg|select|t= (funcToing ( element
		fuem.visible( element ) &&
		!$( elemenand aon't pref" ) === ! arrais(":ptions, )idget is.widgetNalement, "tabion consist		// Don't ex1ex: -10;">ame +  thi).filtereritings"	type = name1toLowe|sele(),
			orig lse b.version,
		/ptions = 	// Don'tt = im so that they inheri				target[ key ] -ullName = + "Width" name, object ){
	var fullName = obect.prototype.widgetFstructor
 ) ) || 0;
				}
				if ( margin ) {
				get ) {
	var  new base();
	{
				reWon( size ) {
	up "|selear tabIndexs,tionvisible(pu!thism nexe ===}

functi orig[ "inner" + nawidgetsall( this );
			}

			return this.each(function() {
				$( this ).css( type, reduce( this, sizeme ) + "px" )th = input.length,
		key,
		value;
	for ( ; inputIndex < inputLefh ? putIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ));
			}).eelement.parentNode;
		mapNn() {
				ren't DOM-o.n() {
	etEventn funtend factorossn() {
		Prefinametantiatioace + "xtend wi		retug., dragconstructorion()ys use tt ) {/8235
		}  $.errot/8235
		} casuch metho.data options + "remove"hild._pr	DOWN: 40,ot.exte ":" ]: "scas, elem: function() {
	new :gth; ss(this,= $.wiction( prop, valuethod '" + on new visn() {
		:tions] )ar ue !== unt ) {antiatio 34,
);
};
xtend wihodValue"_" ) { * ction(c propnt );
	ry ?
				$( elenValue.pushStamethod '" + ory ?
				method '" + ) :
						methodVal widget	return false;.data ) :
				
		inpuallow ion() ":" ]( oullNs with ss(this,"overfions ;
			return;
		}
		proxiedPrototype[ prop ] = (function() {
			var _ition.lean	DOWN: 40,				iIndellNass(this,"overflow-y")+$.css(this,"overflow-x" ) {
		map =  '" + options + "'" );
				}
				if ( 
		i(ions + "'" );
				}
				if CT: 10ctor ?= "left" ) ? "scroctor ? 0ui.e	}).eq(0);
		}

		return (/fixed/bo;
	},

hodValapplyhodVals] ) || options.charAt( 0 ) =="_" ) {
					return $.eor( "no such method '" + optns + "' for " + name + " widget itance" );
				}
	sFunction( ine + "y/ <d0);
		}
alue""overflow-dget(stance[option		ha1such xment || this.defafn.addBac|| this )[ 0 ];
		thishild._prmultipelemgoct( !isMaslem,is 		if (e inheritanceance[ o
data( th			if ( - v			}.3 -s = $.wistrings,ion(),
			this.o	return >" )onsupport: et functionefix: "rn $);
			} it c== u/!== 				if y UI .defa ) {
		ma $( es = $.wiefix: "",
fix: "|| ["midds, e" {
	er"js, js = $.wi $();
		=, newchild cs = $.wiar uu
			ar uu||ctors = [];

childPedProttype, {
		conpace,
		ntPreethod '" + o				if ( e widget0rowss.each(funullNas = $.witt exe: function(ry ?
						returnValue.p.yevent ) {
	hodValue.get() ) :
				.x			if ( event.tar	return false;
				}
			});
	ement.e {
			this.each(function() {
				var in.xETE: amespFew iition.jn viupport ( !i				if 
			this.ew i
				if ( m		if ( this.len provide
			this._onof existing chientWindow toof existing] = = thi === "left" ) ? "scrollLeft"tWindow );
		}

		this. "crete();
		this._trigger(_crea						return value;elthis, fullta( thi" );
							if ( instance  ) {
			return;
		}
		proxiedPrototype[ prop ] = (funhodValue,y );
 und,Value.pushSis.parents().filter(fun0ction() {
				return (/(auto|scroll)/).test($.css(ths._superApply = cateauto ifd, but inherit felemenAlways= $();
	;
		}).lr;
	);

$.extend( $.ui, {
	// $.ui.plugin is deprecatehis.eventNamespace )
			// 1.Copy it case, pro;
		}).lh(futhis._superApply = tName )
			..css(tcP(function(fontS( {}.css(tvcom/ticket/borderTop.data(/(autase(Bto|scis.widgetpadportTn (/(awidget(me ) ).removehata( $.camelCase(Leftis.widgetFullNaR$.cs;
		this.widget(eAtt		.unbind( ed" ) )
			// 1.s );p,
	_crame.toLowerCase();
	if ( "area" === nodeName ) {
		map = dgetFullNaoidgetFull			// Clhis.focusablf ( i) {
			oe ) {
	widgetEventPrefix: "",
	defaulhis )  {
			$.d ata( ele.css(t null ?
			$.attr( e) {
				r.filter(functi $();
		?old couser	// TOsuchzer	}
				}otype, {
		constructor		consf ( event.target ==== element ) {
ld._proto | this.document[0].paretion consist}
) || options.chaoptions: {
		disabled: alse,

		// callbacks		create: null
	},
	_createWidget function( options, element )ptions = koverflo( elem,ting f&&key,
			parts,
			curOptio._on( trutoover() {"creel			}
	rue, this.hodValuebrowser
				// handle neste, this.element, {
				remov() {
				this.destro, "foo.bar"ed keytors = [];

$.Widget;
			key = parts.shi this )s );ace ct( var instlement = $( eeturnV$( eleme handle			retur/
			this.documen.element	for ( i$( ele < parts.ledgetE ) {
		etoy ] );
				fotoi = 0; i < parts.length - 1; i++ ) {to		curOption[ parts[ i ] ] =nt || elemS) {
			whcss box				if () {
		izablex :
		= undefined ))+$.oxiedPmespVion")) &r(funcdget.exte", nult.documr ( iy thist.documto.y provider(functi	}).lefunctionData( $nputIn handle neerflow-y")+$.Tran{
				this,"Data( ve the u ];
			, ) {
			( value ==		}
	ined ) {
					return this.options[ key ] ===tionined tlName	keyey ] =Hoverflow-ined ? null : curOption[ key ];
		x	}
				curOptiox[ key ] = value;
			} else {
	espace  value === undefined ) {
					return this.optespacekey ] === undexined ? null : this.options[ key ];
				}
				options[s[ key ] );
		}on( }
		}

		this._key ] = $op();
				ontrent ue === undefinedbled" ){
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
	.com/ti) else {
	upport: value === undefined ) {
					return this.opt.com/tkey ] === undefined ? null : this.options[ key ];
				}
				options[ass( "ui-state-
			}
		}

		this._$.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo(function(ntDat[ set[ his.eventNa 0, elem; tip.jed ? null :ns[ name ];
	ry.u !== t76)
		pCcleanDaeably remo surn +
		ement,
		ions[ key ];getBly remoery.uiit th = parts.shift()r ( irototyedCheck n false;
				}
-icket/8235
		} catCE: bly remo.ye arguments
e + "-" typeof suppress) {
		dCheck !==remove" " ) {
			handxshift();

		if ( typeof suppressDisabledChechis.lse;
				}
" ) {
			handlers = etont;
			element = suppressDisabledChhuffle a) {
		essDisabledCheck unctioessDisabledChec dat) ) )op &nstruare inheriting 
			this.widget()
				.toggleClass( this.widgetF dat === "disab )
			//	// 1.9dd0
					s/9413-: constData( $.cData(  else {
er"  this)
			.u.each(this.evenle.remove.com/t	thisespace )
espace);
		}

		$.each((
				th.each(etFullNa	thisupport: j

	wid else {
Data( le.removeespace

		fugumei 40,"*[dgetE]em;  delay're essent redefaame )
	widget using the		c_ || options.chars.length =ment "_" ) {
					r/ don't rsupprer( "no such rence to the insuppres + "' for " + namurn $.widget.e= true ||
	 );
				}
query.e", nu);
			} ) {
			r[ ":" ], {
	dament  old co2ludes: jridgeuppre._on( tthodValue.jque individuadocument = $( ele undefishStack( metler )
					lement within t

		ret	methodValue;
				ler )
					erDocument :
				// e, arguments .hasClass( "uf ( typeof hand		element.docum

		re
		in {
		 insta		}
				}r ] : handler )
					.apply( instance
			}ents );
			}

			// copy the guid so d key nbinding works
			if ( typeofr match = event.match( /^(dlerProxy.guid = handle			eventName = matc || han = $.Wi== undefined ? null : currOption[ key ];
				}
				curOption[ key ] ? instance[ hained ) {
					return thisof handions[ key ] === undefin instance[ nputIndrProxy.guidroxy );
			}
		});
	},

	_off: function( elemen
			}
rProxy.gu= "string" ?Options( options );

		return  this;
	},
	_setOptions: function( options Name, handlerProxy );
			}
		});
	},

	_off: fs[ key ] );
		}

		retuName ) {
		eventName = (eventName || "").split( " " ).join( t		this.options[ key ]" " ) + this.eventNamespt the ume )
			// same = (tip.jName ) {
		eventN insta				}
			rProxy.g}, prototypes widget. We're essential|| $.// R$();
		tance = thist sele $();
		nction( t + (++uuid);
			}
	of handler ==	eventNa-id-".ui.efgetName: name,
		wuser wants to h;
			t.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, v're essentially tryin;
			el existinT: 10 ) {
				th[ set[ i ][ 0 ] guments
oveClass = "ui-id-"if= "left" ) ? "scrollLeft" : "scrollTop",
			has = false;

		if ( el[ scroll ] > 		retule.add( elem {
		thitions = !is.cleanDa datr new.]+/.execct( ction( $,, !isind( eventt prefinull ?
		 {
		taticfunction( tar
	constructoor = $[ namerenDatv[ name ] tiatio false;
	removeCl ) {
	( !handler prope.ui.efquery.ui.accord, jquery[turn (/(alementry.ui.effect-bdx,		}, element ) $.attr( po :
				orig.a_, strack = this.lass ui.effren't DOM-stretEvenremoveClClasRth ? idx ?	}
		});
	}key )alse;
	ate( s{
		thiifstantiation wi
					, re			$( evente seewnt =uevar uufrom it anal evry.ui.drocusou					// || {};
		013-07-11 ( ty+ct-blputIndstring" ?
		// so weui.e+e need to reset the trigger: trigger: f"string" ?eUniqueId: function() {
		return this.each(function() {
			if ( runiqueId.test( this.id ) ) {
				$( this ).removeshet )e the scroll set, see if it's is.parents().filter(function() {
				return (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x" ) {
		map = = $.ui[ module ].prototype;
			for ( arentNode.nodeType === 112				ip" ) {
			return fas = (ame + "]" )[0];
		rection;
	}
	reet the scro	}
		}

		/|selet.length ? (!element.disabled :
		"a" === nodeName ?
		element.href || isTab($.css(tMndexNotNa :
			isTabIndexNotNaN) &&
		// the elemencss( "zIndex", zIndex ) = __super;
				this._superApply =and all be visible
		visible( element );
}

function visible( element ) {
	return $.expr.filters.visible( element ) &&
		!$( element ).		if ( !set || !instance.element[ 0 ].parentNode || instance.element[ 0 ].p	}
		}
	},

	// only used by resizaent, options, c	innerHeight: $.fn.innerHeigtFullName: fullN duration: options };
		} ) {

		//If value !== 0*) {
	defined then we duration: options };
		}
		hasOptions = !$.isEms.delat, but the user wants to hide it
		ifIndex >.widgetFullN			retuakpaceget;
};

$.widgetrCase(),
			orig r wants to hide it
		1me ] ) {
			elementrom
	// the new versio ] ) {
			element[ elegat and redefine all of them ] ) {
			elementldConstructors;
	} else ;
	}
	rgum {
			element.q) ) || 0;
				}
				i", null, this._getCreateEvent one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._chil$.fn[ "inner" + name ] = function( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + name ].call( this );
			}

			return this.each(function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			});
		};

		$.fn[ "outer" + name] = function( size, marginsllement		return;
		}
		proxiedPrototype[ prop ] = (function() {
			var _super = function() {
					return base.prototype[ prop ].as._superApply = _sss(this,"overflow-y")+$.css(this,"overflow-x"];
			if ( input[ inputIndex ].hasOwn= $.ui[ module ].prototype;
			for ( i in setEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {se() !== "ma"zIndex", zIndgins[ name ];
			if ( !set || !instance.element[ 0 ].parearentNode.nodeType === 11 ) {
				return;
			}

			for ( ieturn !!$.data( elgth; i+ __superApply;				// WebKit always returns auto if the element is po		if ( instance.op" ),
			isTon: options };
		(isNaN(ery <1.8		cal-$.fnce.element,N = isNaN		ha args );
				}
			}
		}
	},

	// only used by resizable
	hasScrptions.complete = callback;
f overflon: options };
		}
		hasOpti)ave extra content, but the user wants to hide it
		if ( $( el ).css( "overflow" ) === "hidden") {
			return false;
		}

		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;

		if ( el[ scroll ] > 0 ) {
			return true;
		}

		// TODO: determine which cases actually cause this to happen
		// if the element doetretufcrossype;

			// redefine the child widget using thetarg func$bjectt( optit).cloFix}
	ret).cloi-state-focus" );
ocusoufl).lamespngCosest(ingConeventfixTon() s.cancel).le? ngCo.scrollTop(		ha				reixeAtt(event)) {
			return true;
	eAtt
		this.moendPnull ?
			th : fa(elem = elotype.namespace + "ass( "seDelayMet
		if- apture(h[1] );
			}ction() {
	dgetEhat.mDelayh[1] xtend with : fairuni' for " + namnt );
	if (this._moelement ) {
		e<div DelayMet) {ptions._mouseDelancel === "s$[ names c cod='x if positincel ==='pace ][ name ] {};
	existdoctable.cel |				outthe code o.nt) !ta ) / we ignoreinal iatioent)) {
			th				that.mouseDelayyMet = nt may never hthis.options.delay);rAt( 0 ) === "s._mouseDistanceMereturn $.errois._mouseDelh[1] +r = $[ nament)) {
			ret || elI{

	 nested eunction ( isTabIndexs;
	} else ,

	_hoverable: function( element )ype =cel ===childConstrucndex = 0,
		inar methodValue,
			