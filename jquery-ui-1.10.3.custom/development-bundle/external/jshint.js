/*!
 * JSHint, by JSHint Community.
 *
 * This file (and this file only) is licensed under the same slightly modified
 * MIT license that JSLint is. It stops evil-doers everywhere.
 *
 * JSHint is a derivative work of JSLint:
 *
 *   Copyright (c) 2002 Douglas Crockford  (www.JSLint.com)
 *
 *   Permission is hereby granted, free of charge, to any person obtaining
 *   a copy of this software and associated documentation files (the "Software"),
 *   to deal in the Software without restriction, including without limitation
 *   the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *   and/or sell copies of the Software, and to permit persons to whom
 *   the Software is furnished to do so, subject to the following conditions:
 *
 *   The above copyright notice and this permission notice shall be included
 *   in all copies or substantial portions of the Software.
 *
 *   The Software shall be used for Good, not Evil.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *   FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *   DEALINGS IN THE SOFTWARE.
 *
 */

/*
 JSHINT is a global function. It takes two parameters.

     var myResult = JSHINT(source, option);

 The first parameter is either a string or an array of strings. If it is a
 string, it will be split on '\n' or '\r'. If it is an array of strings, it
 is assumed that each string represents one line. The source can be a
 JavaScript text or a JSON text.

 The second parameter is an optional object of options which control the
 operation of JSHINT. Most of the options are booleans: They are all
 optional and have a default value of false. One of the options, predef,
 can be an array of names, which will be used to declare global variables,
 or an object whose keys are used as global names, with a boolean value
 that determines if they are assignable.

 If it checks out, JSHINT returns true. Otherwise, it returns false.

 If false, you can inspect JSHINT.errors to find out the problems.
 JSHINT.errors is an array of objects containing these members:

 {
     line      : The line (relative to 1) at which the lint was found
     character : The character (relative to 1) at which the lint was found
     reason    : The problem
     evidence  : The text line in which the problem occurred
     raw       : The raw message before the details were inserted
     a         : The first detail
     b         : The second detail
     c         : The third detail
     d         : The fourth detail
 }

 If a fatal error was found, a null will be the last element of the
 JSHINT.errors array.

 You can request a data structure which contains JSHint's results.

     var myData = JSHINT.data();

 It returns a structure with this form:

 {
     errors: [
         {
             line: NUMBER,
             character: NUMBER,
             reason: STRING,
             evidence: STRING
         }
     ],
     functions: [
         name: STRING,
         line: NUMBER,
         character: NUMBER,
         last: NUMBER,
         lastcharacter: NUMBER,
         param: [
             STRING
         ],
         closure: [
             STRING
         ],
         var: [
             STRING
         ],
         exception: [
             STRING
         ],
         outer: [
             STRING
         ],
         unused: [
             STRING
         ],
         global: [
             STRING
         ],
         label: [
             STRING
         ]
     ],
     globals: [
         STRING
     ],
     member: {
         STRING: NUMBER
     },
     unused: [
         {
             name: STRING,
             line: NUMBER
         }
     ],
     implieds: [
         {
             name: STRING,
             line: NUMBER
         }
     ],
     urls: [
         STRING
     ],
     json: BOOLEAN
 }

 Empty arrays will not be included.

*/

/*jshint
 evil: true, nomen: false, onevar: false, regexp: false, strict: true, boss: true,
 undef: true, maxlen: 100, indent: 4, quotmark: double, unused: true
*/

/*members "\b", "\t", "\n", "\f", "\r", "!=", "!==", "\"", "%", "(begin)",
 "(breakage)", "(character)", "(context)", "(error)", "(explicitNewcap)", "(global)",
 "(identifier)", "(last)", "(lastcharacter)", "(line)", "(loopage)", "(metrics)",
 "(name)", "(onevar)", "(params)", "(scope)", "(statement)", "(verb)", "(tokens)", "(catch)",
 "*", "+", "++", "-", "--", "\/", "<", "<=", "==",
 "===", ">", ">=", $, $$, $A, $F, $H, $R, $break, $continue, $w, Abstract, Ajax,
 __filename, __dirname, ActiveXObject, Array, ArrayBuffer, ArrayBufferView, Audio,
 Autocompleter, Asset, Boolean, Builder, Buffer, Browser, Blob, COM, CScript, Canvas,
 CustomAnimation, Class, Control, ComplexityCount, Chain, Color, Cookie, Core, DataView, Date,
 Debug, Draggable, Draggables, Droppables, Document, DomReady, DOMEvent, DOMReady, DOMParser,
 Drag, E, Enumerator, Enumerable, Element, Elements, Error, Effect, EvalError, Event,
 Events, FadeAnimation, Field, Flash, Float32Array, Float64Array, Form,
 FormField, Frame, FormData, Function, Fx, GetObject, Group, Hash, HotKey,
 HTMLElement, HTMLAnchorElement, HTMLBaseElement, HTMLBlockquoteElement,
 HTMLBodyElement, HTMLBRElement, HTMLButtonElement, HTMLCanvasElement, HTMLDirectoryElement,
 HTMLDivElement, HTMLDListElement, HTMLFieldSetElement,
 HTMLFontElement, HTMLFormElement, HTMLFrameElement, HTMLFrameSetElement,
 HTMLHeadElement, HTMLHeadingElement, HTMLHRElement, HTMLHtmlElement,
 HTMLIFrameElement, HTMLImageElement, HTMLInputElement, HTMLIsIndexElement,
 HTMLLabelElement, HTMLLayerElement, HTMLLegendElement, HTMLLIElement,
 HTMLLinkElement, HTMLMapElement, HTMLMenuElement, HTMLMetaElement,
 HTMLModElement, HTMLObjectElement, HTMLOListElement, HTMLOptGroupElement,
 HTMLOptionElement, HTMLParagraphElement, HTMLParamElement, HTMLPreElement,
 HTMLQuoteElement, HTMLScriptElement, HTMLSelectElement, HTMLStyleElement,
 HtmlTable, HTMLTableCaptionElement, HTMLTableCellElement, HTMLTableColElement,
 HTMLTableElement, HTMLTableRowElement, HTMLTableSectionElement,
 HTMLTextAreaElement, HTMLTitleElement, HTMLUListElement, HTMLVideoElement,
 Iframe, IframeShim, Image, importScripts, Int16Array, Int32Array, Int8Array,
 Insertion, InputValidator, JSON, Keyboard, Locale, LN10, LN2, LOG10E, LOG2E,
 MAX_VALUE, MIN_VALUE, Map, Mask, Math, MenuItem, MessageChannel, MessageEvent, MessagePort,
 MoveAnimation, MooTools, MutationObserver, NaN, Native, NEGATIVE_INFINITY, Node, NodeFilter,
 Number, Object, ObjectRange,
 Option, Options, OverText, PI, POSITIVE_INFINITY, PeriodicalExecuter, Point, Position, Prototype,
 RangeError, Rectangle, ReferenceError, RegExp, ResizeAnimation, Request, RotateAnimation, Set,
 SQRT1_2, SQRT2, ScrollBar, ScriptEngine, ScriptEngineBuildVersion,
 ScriptEngineMajorVersion, ScriptEngineMinorVersion, Scriptaculous, Scroller,
 Slick, Slider, Selector, SharedWorker, String, Style, SyntaxError, Sortable, Sortables,
 SortableObserver, Sound, Spinner, System, Swiff, Text, TextArea, Template,
 Timer, Tips, Type, TypeError, Toggle, Try, "use strict", unescape, URI, URIError, URL,
 VBArray, WeakMap, WSH, WScript, XDomainRequest, Web, Window, XMLDOM, XMLHttpRequest, XMLSerializer,
 XPathEvaluator, XPathException, XPathExpression, XPathNamespace, XPathNSResolver, XPathResult,
 "\\", a, abs, addEventListener, address, alert, apply, applicationCache, arguments, arity,
 asi, atob, b, basic, basicToken, bitwise, blacklist, block, blur, boolOptions, boss,
 browser, btoa, c, call, callee, caller, camelcase, cases, charAt, charCodeAt, character,
 clearInterval, clearTimeout, close, closed, closure, comment, complexityCount, condition,
 confirm, console, constructor, content, couch, create, css, curly, d, data, datalist, dd, debug,
 decodeURI, decodeURIComponent, defaultStatus, defineClass, deserialize, devel, document,
 dojo, dijit, dojox, define, else, emit, encodeURI, encodeURIComponent, elem,
 eqeq, eqeqeq, eqnull, errors, es5, escape, esnext, eval, event, evidence, evil,
 ex, exception, exec, exps, expr, exports, FileReader, first, floor, focus, forEach,
 forin, fragment, frames, from, fromCharCode, fud, funcscope, funct, function, functions,
 g, gc, getComputedStyle, getRow, getter, getterToken, GLOBAL, global, globals, globalstrict,
 hasOwnProperty, help, history, i, id, identifier, immed, implieds, importPackage, include,
 indent, indexOf, init, ins, internals, instanceOf, isAlpha, isApplicationRunning, isArray,
 isDigit, isFinite, isNaN, iterator, java, join, jshint,
 JSHINT, json, jquery, jQuery, keys, label, labelled, last, lastcharacter, lastsemic, laxbreak,
 laxcomma, latedef, lbp, led, left, length, line, load, loadClass, localStorage, location,
 log, loopfunc, m, match, max, maxcomplexity, maxdepth, maxerr, maxlen, maxstatements, maxparams,
 member, message, meta, module, moveBy, moveTo, mootools, multistr, name, navigator, new, newcap,
 nestedBlockDepth, noarg, node, noempty, nomen, nonew, nonstandard, nud, onbeforeunload, onblur,
 onerror, onevar, onecase, onfocus, onload, onresize, onunload, open, openDatabase, openURL,
 opener, opera, options, outer, param, parent, parseFloat, parseInt, passfail, plusplus,
 postMessage, pop, predef, print, process, prompt, proto, prototype, prototypejs, provides, push,
 quit, quotmark, range, raw, reach, reason, regexp, readFile, readUrl, regexdash,
 removeEventListener, replace, report, require, reserved, resizeBy, resizeTo, resolvePath,
 resumeUpdates, respond, rhino, right, runCommand, scroll, scope, screen, scripturl, scrollBy,
 scrollTo, scrollbar, search, seal, self, send, serialize, sessionStorage, setInterval, setTimeout,
 setter, setterToken, shift, slice, smarttabs, sort, spawn, split, statement, statementCount, stack,
 status, start, strict, sub, substr, supernew, shadow, supplant, sum, sync, test, toLowerCase,
 toString, toUpperCase, toint32, token, tokens, top, trailing, type, typeOf, Uint16Array,
 Uint32Array, Uint8Array, undef, undefs, unused, urls, validthis, value, valueOf, var, vars,
 version, verifyMaxParametersPerFunction, verifyMaxStatementsPerFunction,
 verifyMaxComplexityPerFunction, verifyMaxNestedBlockDepthPerFunction, WebSocket, withstmt, white,
 window, windows, Worker, worker, wsh, yui, YUI, Y, YUI_config*/

/*global exports: false */

// We build the application inside a function so that we produce only a single
// global variable. That function will be invoked immediately, and its return
// value is the JSHINT function itself.

var JSHINT = (function () {
    "use strict";

    var anonname,       // The guessed name for anonymous functions.

// These are operators that should not be used with the ! operator.

        bang = {
            "<"  : true,
            "<=" : true,
            "==" : true,
            "===": true,
            "!==": true,
            "!=" : true,
            ">"  : true,
            ">=" : true,
            "+"  : true,
            "-"  : true,
            "*"  : true,
            "/"  : true,
            "%"  : true
        },

        // These are the JSHint boolean options.
        boolOptions = {
            asi         : true, // if automatic semicolon insertion should be tolerated
            bitwise     : true, // if bitwise operators should not be allowed
            boss        : true, // if advanced usage of assignments should be allowed
            browser     : true, // if the standard browser globals should be predefined
            camelcase   : true, // if identifiers should be required in camel case
            couch       : true, // if CouchDB globals should be predefined
            curly       : true, // if curly braces around all blocks should be required
            debug       : true, // if debugger statements should be allowed
            devel       : true, // if logging globals should be predefined (console,
                                // alert, etc.)
            dojo        : true, // if Dojo Toolkit globals should be predefined
            eqeqeq      : true, // if === should be required
            eqnull      : true, // if == null comparisons should be tolerated
            es5         : true, // if ES5 syntax should be allowed
            esnext      : true, // if es.next specific syntax should be allowed
            evil        : true, // if eval should be allowed
            expr        : true, // if ExpressionStatement should be allowed as Programs
            forin       : true, // if for in statements must filter
            funcscope   : true, // if only function scope should be used for scope tests
            globalstrict: true, // if global "use strict"; should be allowed (also
                                // enables 'strict')
            immed       : true, // if immediate invocations must be wrapped in parens
            iterator    : true, // if the `__iterator__` property should be allowed
            jquery      : true, // if jQuery globals should be predefined
            lastsemic   : true, // if semicolons may be ommitted for the trailing
                                // statements inside of a one-line blocks.
            latedef     : true, // if the use before definition should not be tolerated
            laxbreak    : true, // if line breaks should not be checked
            laxcomma    : true, // if line breaks should not be checked around commas
            loopfunc    : true, // if functions should be allowed to be defined within
                                // loops
            mootools    : true, // if MooTools globals should be predefined
            multistr    : true, // allow multiline strings
            newcap      : true, // if constructor names must be capitalized
            noarg       : true, // if arguments.caller and arguments.callee should be
                                // disallowed
            node        : true, // if the Node.js environment globals should be
                                // predefined
            noempty     : true, // if empty blocks should be disallowed
            nonew       : true, // if using `new` for side-effects should be disallowed
            nonstandard : true, // if non-standard (but widely adopted) globals should
                                // be predefined
            nomen       : true, // if names should be checked
            onevar      : true, // if only one var statement per function should be
                                // allowed
            onecase     : true, // if one case switch statements should be allowed
            passfail    : true, // if the scan should stop on first error
            plusplus    : true, // if increment/decrement should not be allowed
            proto       : true, // if the `__proto__` property should be allowed
            prototypejs : true, // if Prototype and Scriptaculous globals should be
                                // predefined
            regexdash   : true, // if unescaped first/last dash (-) inside brackets
                                // should be tolerated
            regexp      : true, // if the . should not be allowed in regexp literals
            rhino       : true, // if the Rhino environment globals should be predefined
            undef       : true, // if variables should be declared before used
            unused      : true, // if variables should be always used
            scripturl   : true, // if script-targeted URLs should be tolerated
            shadow      : true, // if variable shadowing should be tolerated
            smarttabs   : true, // if smarttabs should be tolerated
                                // (http://www.emacswiki.org/emacs/SmartTabs)
            strict      : true, // require the "use strict"; pragma
            sub         : true, // if all forms of subscript notation are tolerated
            supernew    : true, // if `new function () { ... };` and `new Object;`
                                // should be tolerated
            trailing    : true, // if trailing whitespace rules apply
            validthis   : true, // if 'this' inside a non-constructor function is valid.
                                // This is a function scoped option only.
            withstmt    : true, // if with statements should be allowed
            white       : true, // if strict whitespace rules apply
            worker      : true, // if Web Worker script symbols should be allowed
            wsh         : true, // if the Windows Scripting Host environment globals
                                // should be predefined
            yui         : true  // YUI variables should be predefined
        },

        // These are the JSHint options that can take any value
        // (we use this object to detect invalid options)
        valOptions = {
            maxlen       : false,
            indent       : false,
            maxerr       : false,
            predef       : false,
            quotmark     : false, //'single'|'double'|true
            scope        : false,
            maxstatements: false, // {int} max statements per function
            maxdepth     : false, // {int} max nested block depth per function
            maxparams    : false, // {int} max params per function
            maxcomplexity: false  // {int} max cyclomatic complexity per function
        },

        // These are JSHint boolean options which are shared with JSLint
        // where the definition in JSHint is opposite JSLint
        invertedOptions = {
            bitwise     : true,
            forin       : true,
            newcap      : true,
            nomen       : true,
            plusplus    : true,
            regexp      : true,
            undef       : true,
            white       : true,

            // Inverted and renamed, use JSHint name here
            eqeqeq      : true,
            onevar      : true
        },

        // These are JSHint boolean options which are shared with JSLint
        // where the name has been changed but the effect is unchanged
        renamedOptions = {
            eqeq        : "eqeqeq",
            vars        : "onevar",
            windows     : "wsh"
        },


        // browser contains a set of global names which are commonly provided by a
        // web browser environment.
        browser = {
            ArrayBuffer              :  false,
            ArrayBufferView          :  false,
            Audio                    :  false,
            Blob                     :  false,
            addEventListener         :  false,
            applicationCache         :  false,
            atob                     :  false,
            blur                     :  false,
            btoa                     :  false,
            clearInterval            :  false,
            clearTimeout             :  false,
            close                    :  false,
            closed                   :  false,
            DataView                 :  false,
            DOMParser                :  false,
            defaultStatus            :  false,
            document                 :  false,
            event                    :  false,
            FileReader               :  false,
            Float32Array             :  false,
            Float64Array             :  false,
            FormData                 :  false,
            focus                    :  false,
            frames                   :  false,
            getComputedStyle         :  false,
            HTMLElement              :  false,
            HTMLAnchorElement        :  false,
            HTMLBaseElement          :  false,
            HTMLBlockquoteElement    :  false,
            HTMLBodyElement          :  false,
            HTMLBRElement            :  false,
            HTMLButtonElement        :  false,
            HTMLCanvasElement        :  false,
            HTMLDirectoryElement     :  false,
            HTMLDivElement           :  false,
            HTMLDListElement         :  false,
            HTMLFieldSetElement      :  false,
            HTMLFontElement          :  false,
            HTMLFormElement          :  false,
            HTMLFrameElement         :  false,
            HTMLFrameSetElement      :  false,
            HTMLHeadElement          :  false,
            HTMLHeadingElement       :  false,
            HTMLHRElement            :  false,
            HTMLHtmlElement          :  false,
            HTMLIFrameElement        :  false,
            HTMLImageElement         :  false,
            HTMLInputElement         :  false,
            HTMLIsIndexElement       :  false,
            HTMLLabelElement         :  false,
            HTMLLayerElement         :  false,
            HTMLLegendElement        :  false,
            HTMLLIElement            :  false,
            HTMLLinkElement          :  false,
            HTMLMapElement           :  false,
            HTMLMenuElement          :  false,
            HTMLMetaElement          :  false,
            HTMLModElement           :  false,
            HTMLObjectElement        :  false,
            HTMLOListElement         :  false,
            HTMLOptGroupElement      :  false,
            HTMLOptionElement        :  false,
            HTMLParagraphElement     :  false,
            HTMLParamElement         :  false,
            HTMLPreElement           :  false,
            HTMLQuoteElement         :  false,
            HTMLScriptElement        :  false,
            HTMLSelectElement        :  false,
            HTMLStyleElement         :  false,
            HTMLTableCaptionElement  :  false,
            HTMLTableCellElement     :  false,
            HTMLTableColElement      :  false,
            HTMLTableElement         :  false,
            HTMLTableRowElement      :  false,
            HTMLTableSectionElement  :  false,
            HTMLTextAreaElement      :  false,
            HTMLTitleElement         :  false,
            HTMLUListElement         :  false,
            HTMLVideoElement         :  false,
            history                  :  false,
            Int16Array               :  false,
            Int32Array               :  false,
            Int8Array                :  false,
            Image                    :  false,
            length                   :  false,
            localStorage             :  false,
            location                 :  false,
            MessageChannel           :  false,
            MessageEvent             :  false,
            MessagePort              :  false,
            moveBy                   :  false,
            moveTo                   :  false,
            MutationObserver         :  false,
            name                     :  false,
            Node                     :  false,
            NodeFilter               :  false,
            navigator                :  false,
            onbeforeunload           :  true,
            onblur                   :  true,
            onerror                  :  true,
            onfocus                  :  true,
            onload                   :  true,
            onresize                 :  true,
            onunload                 :  true,
            open                     :  false,
            openDatabase             :  false,
            opener                   :  false,
            Option                   :  false,
            parent                   :  false,
            print                    :  false,
            removeEventListener      :  false,
            resizeBy                 :  false,
            resizeTo                 :  false,
            screen                   :  false,
            scroll                   :  false,
            scrollBy                 :  false,
            scrollTo                 :  false,
            sessionStorage           :  false,
            setInterval              :  false,
            setTimeout               :  false,
            SharedWorker             :  false,
            status                   :  false,
            top                      :  false,
            Uint16Array              :  false,
            Uint32Array              :  false,
            Uint8Array               :  false,
            WebSocket                :  false,
            window                   :  false,
            Worker                   :  false,
            XMLHttpRequest           :  false,
            XMLSerializer            :  false,
            XPathEvaluator           :  false,
            XPathException           :  false,
            XPathExpression          :  false,
            XPathNamespace           :  false,
            XPathNSResolver          :  false,
            XPathResult              :  false
        },

        couch = {
            "require" : false,
            respond   : false,
            getRow    : false,
            emit      : false,
            send      : false,
            start     : false,
            sum       : false,
            log       : false,
            exports   : false,
            module    : false,
            provides  : false
        },

        declared, // Globals that were declared using /*global ... */ syntax.

        devel = {
            alert   : false,
            confirm : false,
            console : false,
            Debug   : false,
            opera   : false,
            prompt  : false
        },

        dojo = {
            dojo      : false,
            dijit     : false,
            dojox     : false,
            define    : false,
            "require" : false
        },

        funct,          // The current function

        functionicity = [
            "closure", "exception", "global", "label",
            "outer", "unused", "var"
        ],

        functions,      // All of the functions

        global,         // The global scope
        implied,        // Implied globals
        inblock,
        indent,
        jsonmode,

        jquery = {
            "$"    : false,
            jQuery : false
        },

        lines,
        lookahead,
        member,
        membersOnly,

        mootools = {
            "$"             : false,
            "$$"            : false,
            Asset           : false,
            Browser         : false,
            Chain           : false,
            Class           : false,
            Color           : false,
            Cookie          : false,
            Core            : false,
            Document        : false,
            DomReady        : false,
            DOMEvent        : false,
            DOMReady        : false,
            Drag            : false,
            Element         : false,
            Elements        : false,
            Event           : false,
            Events          : false,
            Fx              : false,
            Group           : false,
            Hash            : false,
            HtmlTable       : false,
            Iframe          : false,
            IframeShim      : false,
            InputValidator  : false,
            instanceOf      : false,
            Keyboard        : false,
            Locale          : false,
            Mask            : false,
            MooTools        : false,
            Native          : false,
            Options         : false,
            OverText        : false,
            Request         : false,
            Scroller        : false,
            Slick           : false,
            Slider          : false,
            Sortables       : false,
            Spinner         : false,
            Swiff           : false,
            Tips            : false,
            Type            : false,
            typeOf          : false,
            URI             : false,
            Window          : false
        },

        nexttoken,

        node = {
            __filename    : false,
            __dirname     : false,
            Buffer        : false,
            console       : false,
            exports       : true,  // In Node it is ok to exports = module.exports = foo();
            GLOBAL        : false,
            global        : false,
            module        : false,
            process       : false,
            require       : false,
            setTimeout    : false,
            clearTimeout  : false,
            setInterval   : false,
            clearInterval : false
        },

        noreach,
        option,
        predefined,     // Global variables defined by option
        prereg,
        prevtoken,

        prototypejs = {
            "$"               : false,
            "$$"              : false,
            "$A"              : false,
            "$F"              : false,
            "$H"              : false,
            "$R"              : false,
            "$break"          : false,
            "$continue"       : false,
            "$w"              : false,
            Abstract          : false,
            Ajax              : false,
            Class             : false,
            Enumerable        : false,
            Element           : false,
            Event             : false,
            Field             : false,
            Form              : false,
            Hash              : false,
            Insertion         : false,
            ObjectRange       : false,
            PeriodicalExecuter: false,
            Position          : false,
            Prototype         : false,
            Selector          : false,
            Template          : false,
            Toggle            : false,
            Try               : false,
            Autocompleter     : false,
            Builder           : false,
            Control           : false,
            Draggable         : false,
            Draggables        : false,
            Droppables        : false,
            Effect            : false,
            Sortable          : false,
            SortableObserver  : false,
            Sound             : false,
            Scriptaculous     : false
        },

        quotmark,

        rhino = {
            defineClass  : false,
            deserialize  : false,
            gc           : false,
            help         : false,
            importPackage: false,
            "java"       : false,
            load         : false,
            loadClass    : false,
            print        : false,
            quit         : false,
            readFile     : false,
            readUrl      : false,
            runCommand   : false,
            seal         : false,
            serialize    : false,
            spawn        : false,
            sync         : false,
            toint32      : false,
            version      : false
        },

        scope,      // The current scope
        stack,

        // standard contains the global names that are provided by the
        // ECMAScript standard.
        standard = {
            Array               : false,
            Boolean             : false,
            Date                : false,
            decodeURI           : false,
            decodeURIComponent  : false,
            encodeURI           : false,
            encodeURIComponent  : false,
            Error               : false,
            "eval"              : false,
            EvalError           : false,
            Function            : false,
            hasOwnProperty      : false,
            isFinite            : false,
            isNaN               : false,
            JSON                : false,
            Map                 : false,
            Math                : false,
            NaN                 : false,
            Number              : false,
            Object              : false,
            parseInt            : false,
            parseFloat          : false,
            RangeError          : false,
            ReferenceError      : false,
            RegExp              : false,
            Set                 : false,
            String              : false,
            SyntaxError         : false,
            TypeError           : false,
            URIError            : false,
            WeakMap             : false
        },

        // widely adopted global names that are not part of ECMAScript standard
        nonstandard = {
            escape              : false,
            unescape            : false
        },

        directive,
        syntax = {},
        tab,
        token,
        unuseds,
        urls,
        useESNextSyntax,
        warnings,

        worker = {
            importScripts       : true,
            postMessage         : true,
            self                : true
        },

        wsh = {
            ActiveXObject             : true,
            Enumerator                : true,
            GetObject                 : true,
            ScriptEngine              : true,
            ScriptEngineBuildVersion  : true,
            ScriptEngineMajorVersion  : true,
            ScriptEngineMinorVersion  : true,
            VBArray                   : true,
            WSH                       : true,
            WScript                   : true,
            XDomainRequest            : true
        },

        yui = {
            YUI             : false,
            Y               : false,
            YUI_config      : false
        };
    // Regular expressions. Some of these are stupidly long.
    var ax, cx, tx, nx, nxg, lx, ix, jx, ft;
    (function () {
        /*jshint maxlen:300 */

        // unsafe comment or string
        ax = /@cc|<\/?|script|\]\s*\]|<\s*!|&lt/i;

        // unsafe characters that are silently deleted by one or more browsers
        cx = /[\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/;

        // token
        tx = /^\s*([(){}\[.,:;'"~\?\]#@]|==?=?|\/=(?!(\S*\/[gim]?))|\/(\*(jshint|jslint|members?|global)?|\/)?|\*[\/=]?|\+(?:=|\++)?|-(?:=|-+)?|%=?|&[&=]?|\|[|=]?|>>?>?=?|<([\/=!]|\!(\[|--)?|<=?)?|\^=?|\!=?=?|[a-zA-Z_$][a-zA-Z0-9_$]*|[0-9]+([xX][0-9a-fA-F]+|\.[0-9]*)?([eE][+\-]?[0-9]+)?)/;

        // characters in strings that need escapement
        nx = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/;
        nxg = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

        // star slash
        lx = /\*\//;

        // identifier
        ix = /^([a-zA-Z_$][a-zA-Z0-9_$]*)$/;

        // javascript url
        jx = /^(?:javascript|jscript|ecmascript|vbscript|mocha|livescript)\s*:/i;

        // catches /* falls through */ comments
        ft = /^\s*\/\*\s*falls\sthrough\s*\*\/\s*$/;
    }());

    function F() {}     // Used by Object.create

    function is_own(object, name) {
        // The object.hasOwnProperty method fails when the property under consideration
        // is named 'hasOwnProperty'. So we have to use this more convoluted form.
        return Object.prototype.hasOwnProperty.call(object, name);
    }

    function checkOption(name, t) {
        if (valOptions[name] === undefined && boolOptions[name] === undefined) {
            warning("Bad option: '" + name + "'.", t);
        }
    }

    function isString(obj) {
        return Object.prototype.toString.call(obj) === "[object String]";
    }

    // Provide critical ES5 functions to ES3.

    if (typeof Array.isArray !== "function") {
        Array.isArray = function (o) {
            return Object.prototype.toString.apply(o) === "[object Array]";
        };
    }

    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (fn, scope) {
            var len = this.length;

            for (var i = 0; i < len; i++) {
                fn.call(scope || this, this[i], i, this);
            }
        };
    }

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
            if (this === null || this === undefined) {
                throw new TypeError();
            }

            var t = new Object(this);
            var len = t.length >>> 0;

            if (len === 0) {
                return -1;
            }

            var n = 0;
            if (arguments.length > 0) {
                n = Number(arguments[1]);
                if (n != n) { // shortcut for verifying if it's NaN
                    n = 0;
                } else if (n !== 0 && n != Infinity && n != -Infinity) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }

            if (n >= len) {
                return -1;
            }

            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
            for (; k < len; k++) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }

            return -1;
        };
    }

    if (typeof Object.create !== "function") {
        Object.create = function (o) {
            F.prototype = o;
            return new F();
        };
    }

    if (typeof Object.keys !== "function") {
        Object.keys = function (o) {
            var a = [], k;
            for (k in o) {
                if (is_own(o, k)) {
                    a.push(k);
                }
            }
            return a;
        };
    }

    // Non standard methods

    function isAlpha(str) {
        return (str >= "a" && str <= "z\uffff") ||
            (str >= "A" && str <= "Z\uffff");
    }

    function isDigit(str) {
        return (str >= "0" && str <= "9");
    }

    function isIdentifier(token, value) {
        if (!token)
            return false;

        if (!token.identifier || token.value !== value)
            return false;

        return true;
    }

    function supplant(str, data) {
        return str.replace(/\{([^{}]*)\}/g, function (a, b) {
            var r = data[b];
            return typeof r === "string" || typeof r === "number" ? r : a;
        });
    }

    function combine(t, o) {
        var n;
        for (n in o) {
            if (is_own(o, n) && !is_own(JSHINT.blacklist, n)) {
                t[n] = o[n];
            }
        }
    }

    function updatePredefined() {
        Object.keys(JSHINT.blacklist).forEach(function (key) {
            delete predefined[key];
        });
    }

    function assume() {
        if (option.couch) {
            combine(predefined, couch);
        }

        if (option.rhino) {
            combine(predefined, rhino);
        }

        if (option.prototypejs) {
            combine(predefined, prototypejs);
        }

        if (option.node) {
            combine(predefined, node);
            option.globalstrict = true;
        }

        if (option.devel) {
            combine(predefined, devel);
        }

        if (option.dojo) {
            combine(predefined, dojo);
        }

        if (option.browser) {
            combine(predefined, browser);
        }

        if (option.nonstandard) {
            combine(predefined, nonstandard);
        }

        if (option.jquery) {
            combine(predefined, jquery);
        }

        if (option.mootools) {
            combine(predefined, mootools);
        }

        if (option.worker) {
            combine(predefined, worker);
        }

        if (option.wsh) {
            combine(predefined, wsh);
        }

        if (option.esnext) {
            useESNextSyntax();
        }

        if (option.globalstrict && option.strict !== false) {
            option.strict = true;
        }

        if (option.yui) {
            combine(predefined, yui);
        }
    }


    // Produce an error warning.
    function quit(message, line, chr) {
        var percentage = Math.floor((line / lines.length) * 100);

        throw {
            name: "JSHintError",
            line: line,
            character: chr,
            message: message + " (" + percentage + "% scanned).",
            raw: message
        };
    }

    function isundef(scope, m, t, a) {
        return JSHINT.undefs.push([scope, m, t, a]);
    }

    function warning(m, t, a, b, c, d) {
        var ch, l, w;
        t = t || nexttoken;
        if (t.id === "(end)") {  // `~
            t = token;
        }
        l = t.line || 0;
        ch = t.from || 0;
        w = {
            id: "(error)",
            raw: m,
            evidence: lines[l - 1] || "",
            line: l,
            character: ch,
            scope: JSHINT.scope,
            a: a,
            b: b,
            c: c,
            d: d
        };
        w.reason = supplant(m, w);
        JSHINT.errors.push(w);
        if (option.passfail) {
            quit("Stopping. ", l, ch);
        }
        warnings += 1;
        if (warnings >= option.maxerr) {
            quit("Too many errors.", l, ch);
        }
        return w;
    }

    function warningAt(m, l, ch, a, b, c, d) {
        return warning(m, {
            line: l,
            from: ch
        }, a, b, c, d);
    }

    function error(m, t, a, b, c, d) {
        warning(m, t, a, b, c, d);
    }

    function errorAt(m, l, ch, a, b, c, d) {
        return error(m, {
            line: l,
            from: ch
        }, a, b, c, d);
    }

    // Tracking of "internal" scripts, like eval containing a static string
    function addInternalSrc(elem, src) {
        var i;
        i = {
            id: "(internal)",
            elem: elem,
            value: src
        };
        JSHINT.internals.push(i);
        return i;
    }


// lexical analysis and token construction

    var lex = (function lex() {
        var character, from, line, s;

// Private lex methods

        function nextLine() {
            var at,
                match,
                tw; // trailing whitespace check

            if (line >= lines.length)
                return false;

            character = 1;
            s = lines[line];
            line += 1;

            // If smarttabs option is used check for spaces followed by tabs only.
            // Otherwise check for any occurence of mixed tabs and spaces.
            // Tabs and one space followed by block comment is allowed.
            if (option.smarttabs) {
                // negative look-behind for "//"
                match = s.match(/(\/\/)? \t/);
                at = match && !match[1] ? 0 : -1;
            } else {
                at = s.search(/ \t|\t [^\*]/);
            }

            if (at >= 0)
                warningAt("Mixed spaces and tabs.", line, at + 1);

            s = s.replace(/\t/g, tab);
            at = s.search(cx);

            if (at >= 0)
                warningAt("Unsafe character.", line, at);

            if (option.maxlen && option.maxlen < s.length)
                warningAt("Line too long.", line, s.length);

            // Check for trailing whitespaces
            tw = option.trailing && s.match(/^(.*?)\s+$/);
            if (tw && !/^\s+$/.test(s)) {
                warningAt("Trailing whitespace.", line, tw[1].length + 1);
            }
            return true;
        }

// Produce a token object.  The token inherits from a syntax symbol.

        function it(type, value) {
            var i, t;

            function checkName(name) {
                if (!option.proto && name === "__proto__") {
                    warningAt("The '{a}' property is deprecated.", line, from, name);
                    return;
                }

                if (!option.iterator && name === "__iterator__") {
                    warningAt("'{a}' is only available in JavaScript 1.7.", line, from, name);
                    return;
                }

                // Check for dangling underscores unless we're in Node
                // environment and this identifier represents built-in
                // Node globals with underscores.

                var hasDangling = /^(_+.*|.*_+)$/.test(name);

                if (option.nomen && hasDangling && name !== "_") {
                    if (option.node && token.id !== "." && /^(__dirname|__filename)$/.test(name))
                        return;

                    warningAt("Unexpected {a} in '{b}'.", line, from, "dangling '_'", name);
                    return;
                }

                // Check for non-camelcase names. Names like MY_VAR and
                // _myVar are okay though.

                if (option.camelcase) {
                    if (name.replace(/^_+/, "").indexOf("_") > -1 && !name.match(/^[A-Z0-9_]*$/)) {
                        warningAt("Identifier '{a}' is not in camel case.", line, from, value);
                    }
                }
            }

            if (type === "(color)" || type === "(range)") {
                t = {type: type};
            } else if (type === "(punctuator)" ||
                    (type === "(identifier)" && is_own(syntax, value))) {
                t = syntax[value] || syntax["(error)"];
            } else {
                t = syntax[type];
            }

            t = Object.create(t);

            if (type === "(string)" || type === "(range)") {
                if (!option.scripturl && jx.test(value)) {
                    warningAt("Script URL.", line, from);
                }
            }

            if (type === "(identifier)") {
                t.identifier = true;
                checkName(value);
            }

            t.value = value;
            t.line = line;
            t.character = character;
            t.from = from;
            i = t.id;
            if (i !== "(endline)") {
                prereg = i &&
                    (("(,=:[!&|?{};".indexOf(i.charAt(i.length - 1)) >= 0) ||
                    i === "return" ||
                    i === "case");
            }
            return t;
        }

        // Public lex methods
        return {
            init: function (source) {
                if (typeof source === "string") {
                    lines = source
                        .replace(/\r\n/g, "\n")
                        .replace(/\r/g, "\n")
                        .split("\n");
                } else {
                    lines = source;
                }

                // If the first line is a shebang (#!), make it a blank and move on.
                // Shebangs are used by Node scripts.
                if (lines[0] && lines[0].substr(0, 2) === "#!")
                    lines[0] = "";

                line = 0;
                nextLine();
                from = 1;
            },

            range: function (begin, end) {
                var c, value = "";
                from = character;
                if (s.charAt(0) !== begin) {
                    errorAt("Expected '{a}' and instead saw '{b}'.",
                            line, character, begin, s.charAt(0));
                }
                for (;;) {
                    s = s.slice(1);
                    character += 1;
                    c = s.charAt(0);
                    switch (c) {
                    case "":
                        errorAt("Missing '{a}'.", line, character, c);
                        break;
                    case end:
                        s = s.slice(1);
                        character += 1;
                        return it("(range)", value);
                    case "\\":
                        warningAt("Unexpected '{a}'.", line, character, c);
                    }
                    value += c;
                }

            },


            // token -- this is called by advance to get the next token
            token: function () {
                var b, c, captures, d, depth, high, i, l, low, q, t, isLiteral, isInRange, n;

                function match(x) {
                    var r = x.exec(s), r1;

                    if (r) {
                        l = r[0].length;
                        r1 = r[1];
                        c = r1.charAt(0);
                        s = s.substr(l);
                        from = character + l - r1.length;
                        character += l;
                        return r1;
                    }
                }

                function string(x) {
                    var c, j, r = "", allowNewLine = false;

                    if (jsonmode && x !== "\"") {
                        warningAt("Strings must use doublequote.",
                                line, character);
                    }

                    if (option.quotmark) {
                        if (option.quotmark === "single" && x !== "'") {
                            warningAt("Strings must use singlequote.",
                                    line, character);
                        } else if (option.quotmark === "double" && x !== "\"") {
                            warningAt("Strings must use doublequote.",
                                    line, character);
                        } else if (option.quotmark === true) {
                            quotmark = quotmark || x;
                            if (quotmark !== x) {
                                warningAt("Mixed double and single quotes.",
                                        line, character);
                            }
                        }
                    }

                    function esc(n) {
                        var i = parseInt(s.substr(j + 1, n), 16);
                        j += n;
                        if (i >= 32 && i <= 126 &&
                                i !== 34 && i !== 92 && i !== 39) {
                            warningAt("Unnecessary escapement.", line, character);
                        }
                        character += n;
                        c = String.fromCharCode(i);
                    }

                    j = 0;

unclosedString:
                    for (;;) {
                        while (j >= s.length) {
                            j = 0;

                            var cl = line, cf = from;
                            if (!nextLine()) {
                                errorAt("Unclosed string.", cl, cf);
                                break unclosedString;
                            }

                            if (allowNewLine) {
                                allowNewLine = false;
                            } else {
                                warningAt("Unclosed string.", cl, cf);
                            }
                        }

                        c = s.charAt(j);
                        if (c === x) {
                            character += 1;
                            s = s.substr(j + 1);
                            return it("(string)", r, x);
                        }

                        if (c < " ") {
                            if (c === "\n" || c === "\r") {
                                break;
                            }
                            warningAt("Control character in string: {a}.",
                                    line, character + j, s.slice(0, j));
                        } else if (c === "\\") {
                            j += 1;
                            character += 1;
                            c = s.charAt(j);
                            n = s.charAt(j + 1);
                            switch (c) {
                            case "\\":
                            case "\"":
                            case "/":
                                break;
                            case "\'":
                                if (jsonmode) {
                                    warningAt("Avoid \\'.", line, character);
                                }
                                break;
                            case "b":
                                c = "\b";
                                break;
                            case "f":
                                c = "\f";
                                break;
                            case "n":
                                c = "\n";
                                break;
                            case "r":
                                c = "\r";
                                break;
                            case "t":
                                c = "\t";
                                break;
                            case "0":
                                c = "\0";
                                // Octal literals fail in strict mode
                                // check if the number is between 00 and 07
                                // where 'n' is the token next to 'c'
                                if (n >= 0 && n <= 7 && directive["use strict"]) {
                                    warningAt(
                                    "Octal literals are not allowed in strict mode.",
                                    line, character);
                                }
                                break;
                            case "u":
                                esc(4);
                                break;
                            case "v":
                                if (jsonmode) {
                                    warningAt("Avoid \\v.", line, character);
                                }
                                c = "\v";
                                break;
                            case "x":
                                if (jsonmode) {
                                    warningAt("Avoid \\x-.", line, character);
                                }
                                esc(2);
                                break;
                            case "":
                                // last character is escape character
                                // always allow new line if escaped, but show
                                // warning if option is not set
                                allowNewLine = true;
                                if (option.multistr) {
                                    if (jsonmode) {
                                        warningAt("Avoid EOL escapement.", line, character);
                                    }
                                    c = "";
                                    character -= 1;
                                    break;
                                }
                                warningAt("Bad escapement of EOL. Use option multistr if needed.",
                                    line, character);
                                break;
                            case "!":
                                if (s.charAt(j - 2) === "<")
                                    break;
                                /*falls through*/
                            default:
                                warningAt("Bad escapement.", line, character);
                            }
                        }
                        r += c;
                        character += 1;
                        j += 1;
                    }
                }

                for (;;) {
                    if (!s) {
                        return it(nextLine() ? "(endline)" : "(end)", "");
                    }

                    t = match(tx);

                    if (!t) {
                        t = "";
                        c = "";
                        while (s && s < "!") {
                            s = s.substr(1);
                        }
                        if (s) {
                            errorAt("Unexpected '{a}'.", line, character, s.substr(0, 1));
                            s = "";
                        }
                    } else {

    //      identifier

                        if (isAlpha(c) || c === "_" || c === "$") {
                            return it("(identifier)", t);
                        }

    //      number

                        if (isDigit(c)) {
                            if (!isFinite(Number(t))) {
                                warningAt("Bad number '{a}'.",
                                    line, character, t);
                            }
                            if (isAlpha(s.substr(0, 1))) {
                                warningAt("Missing space after '{a}'.",
                                        line, character, t);
                            }
                            if (c === "0") {
                                d = t.substr(1, 1);
                                if (isDigit(d)) {
                                    if (token.id !== ".") {
                                        warningAt("Don't use extra leading zeros '{a}'.",
                                            line, character, t);
                                    }
                                } else if (jsonmode && (d === "x" || d === "X")) {
                                    warningAt("Avoid 0x-. '{a}'.",
                                            line, character, t);
                                }
                            }
                            if (t.substr(t.length - 1) === ".") {
                                warningAt(
"A trailing decimal point can be confused with a dot '{a}'.", line, character, t);
                            }
                            return it("(number)", t);
                        }
                        switch (t) {

    //      string

                        case "\"":
                        case "'":
                            return string(t);

    //      // comment

                        case "//":
                            s = "";
                            token.comment = true;
                            break;

    //      /* comment

                        case "/*":
                            for (;;) {
                                i = s.search(lx);
                                if (i >= 0) {
                                    break;
                                }
                                if (!nextLine()) {
                                    errorAt("Unclosed comment.", line, character);
                                }
                            }
                            s = s.substr(i + 2);
                            token.comment = true;
                            break;

    //      /*members /*jshint /*global

                        case "/*members":
                        case "/*member":
                        case "/*jshint":
                        case "/*jslint":
                        case "/*global":
                        case "*/":
                            return {
                                value: t,
                                type: "special",
                                line: line,
                                character: character,
                                from: from
                            };

                        case "":
                            break;
    //      /
                        case "/":
                            if (s.charAt(0) === "=") {
                                errorAt("A regular expression literal can be confused with '/='.",
                                    line, from);
                            }

                            if (prereg) {
                                depth = 0;
                                captures = 0;
                                l = 0;
                                for (;;) {
                                    b = true;
                                    c = s.charAt(l);
                                    l += 1;
                                    switch (c) {
                                    case "":
                                        errorAt("Unclosed regular expression.", line, from);
                                        return quit("Stopping.", line, from);
                                    case "/":
                                        if (depth > 0) {
                                            warningAt("{a} unterminated regular expression " +
                                                "group(s).", line, from + l, depth);
                                        }
                                        c = s.substr(0, l - 1);
                                        q = {
                                            g: true,
                                            i: true,
                                            m: true
                                        };
                                        while (q[s.charAt(l)] === true) {
                                            q[s.charAt(l)] = false;
                                            l += 1;
                                        }
                                        character += l;
                                        s = s.substr(l);
                                        q = s.charAt(0);
                                        if (q === "/" || q === "*") {
                                            errorAt("Confusing regular expression.",
                                                    line, from);
                                        }
                                        return it("(regexp)", c);
                                    case "\\":
                                        c = s.charAt(l);
                                        if (c < " ") {
                                            warningAt(
"Unexpected control character in regular expression.", line, from + l);
                                        } else if (c === "<") {
                                            warningAt(
"Unexpected escaped character '{a}' in regular expression.", line, from + l, c);
                                        }
                                        l += 1;
                                        break;
                                    case "(":
                                        depth += 1;
                                        b = false;
                                        if (s.charAt(l) === "?") {
                                            l += 1;
                                            switch (s.charAt(l)) {
                                            case ":":
                                            case "=":
                                            case "!":
                                                l += 1;
                                                break;
                                            default:
                                                warningAt(
"Expected '{a}' and instead saw '{b}'.", line, from + l, ":", s.charAt(l));
                                            }
                                        } else {
                                            captures += 1;
                                        }
                                        break;
                                    case "|":
                                        b = false;
                                        break;
                                    case ")":
                                        if (depth === 0) {
                                            warningAt("Unescaped '{a}'.",
                                                    line, from + l, ")");
                                        } else {
                                            depth -= 1;
                                        }
                                        break;
                                    case " ":
                                        q = 1;
                                        while (s.charAt(l) === " ") {
                                            l += 1;
                                            q += 1;
                                        }
                                        if (q > 1) {
                                            warningAt(
"Spaces are hard to count. Use {{a}}.", line, from + l, q);
                                        }
                                        break;
                                    case "[":
                                        c = s.charAt(l);
                                        if (c === "^") {
                                            l += 1;
                                            if (s.charAt(l) === "]") {
                                                errorAt("Unescaped '{a}'.",
                                                    line, from + l, "^");
                                            }
                                        }
                                        if (c === "]") {
                                            warningAt("Empty class.", line,
                                                    from + l - 1);
                                        }
                                        isLiteral = false;
                                        isInRange = false;
klass:
                                        do {
                                            c = s.charAt(l);
                                            l += 1;
                                            switch (c) {
                                            case "[":
                                            case "^":
                                                warningAt("Unescaped '{a}'.",
                                                        line, from + l, c);
                                                if (isInRange) {
                                                    isInRange = false;
                                                } else {
                                                    isLiteral = true;
                                                }
                                                break;
                                            case "-":
                                                if (isLiteral && !isInRange) {
                                                    isLiteral = false;
                                                    isInRange = true;
                                                } else if (isInRange) {
                                                    isInRange = false;
                                                } else if (s.charAt(l) === "]") {
                                                    isInRange = true;
                                                } else {
                                                    if (option.regexdash !== (l === 2 || (l === 3 &&
                                                        s.charAt(1) === "^"))) {
                                                        warningAt("Unescaped '{a}'.",
                                                            line, from + l - 1, "-");
                                                    }
                                                    isLiteral = true;
                                                }
                                                break;
                                            case "]":
                                                if (isInRange && !option.regexdash) {
                                                    warningAt("Unescaped '{a}'.",
                                                            line, from + l - 1, "-");
                                                }
                                                break klass;
                                            case "\\":
                                                c = s.charAt(l);
                                                if (c < " ") {
                                                    warningAt(
"Unexpected control character in regular expression.", line, from + l);
                                                } else if (c === "<") {
                                                    warningAt(
"Unexpected escaped character '{a}' in regular expression.", line, from + l, c);
                                                }
                                                l += 1;

                                                // \w, \s and \d are never part of a character range
                                                if (/[wsd]/i.test(c)) {
                                                    if (isInRange) {
                                                        warningAt("Unescaped '{a}'.",
                                                            line, from + l, "-");
                                                        isInRange = false;
                                                    }
                                                    isLiteral = false;
                                                } else if (isInRange) {
                                                    isInRange = false;
                                                } else {
                                                    isLiteral = true;
                                                }
                                                break;
                                            case "/":
                                                warningAt("Unescaped '{a}'.",
                                                        line, from + l - 1, "/");

                                                if (isInRange) {
                                                    isInRange = false;
                                                } else {
                                                    isLiteral = true;
                                                }
                                                break;
                                            case "<":
                                                if (isInRange) {
                                                    isInRange = false;
                                                } else {
                                                    isLiteral = true;
                                                }
                                                break;
                                            default:
                                                if (isInRange) {
                                                    isInRange = false;
                                                } else {
                                                    isLiteral = true;
                                                }
                                            }
                                        } while (c);
                                        break;
                                    case ".":
                                        if (option.regexp) {
                                            warningAt("Insecure '{a}'.", line,
                                                    from + l, c);
                                        }
                                        break;
                                    case "]":
                                    case "?":
                                    case "{":
                                    case "}":
                                    case "+":
                                    case "*":
                                        warningAt("Unescaped '{a}'.", line,
                                                from + l, c);
                                    }
                                    if (b) {
                                        switch (s.charAt(l)) {
                                        case "?":
                                        case "+":
                                        case "*":
                                            l += 1;
                                            if (s.charAt(l) === "?") {
                                                l += 1;
                                            }
                                            break;
                                        case "{":
                                            l += 1;
                                            c = s.charAt(l);
                                            if (c < "0" || c > "9") {
                                                warningAt(
"Expected a number and instead saw '{a}'.", line, from + l, c);
                                                break; // No reason to continue checking numbers.
                                            }
                                            l += 1;
                                            low = +c;
                                            for (;;) {
                                                c = s.charAt(l);
                                                if (c < "0" || c > "9") {
                                                    break;
                                                }
                                                l += 1;
                                                low = +c + (low * 10);
                                            }
                                            high = low;
                                            if (c === ",") {
                                                l += 1;
                                                high = Infinity;
                                                c = s.charAt(l);
                                                if (c >= "0" && c <= "9") {
                                                    l += 1;
                                                    high = +c;
                                                    for (;;) {
                                                        c = s.charAt(l);
                                                        if (c < "0" || c > "9") {
                                                            break;
                                                        }
                                                        l += 1;
                                                        high = +c + (high * 10);
                                                    }
                                                }
                                            }
                                            if (s.charAt(l) !== "}") {
                                                warningAt(
"Expected '{a}' and instead saw '{b}'.", line, from + l, "}", c);
                                            } else {
                                                l += 1;
                                            }
                                            if (s.charAt(l) === "?") {
                                                l += 1;
                                            }
                                            if (low > high) {
                                                warningAt(
"'{a}' should not be greater than '{b}'.", line, from + l, low, high);
                                            }
                                        }
                                    }
                                }
                                c = s.substr(0, l - 1);
                                character += l;
                                s = s.substr(l);
                                return it("(regexp)", c);
                            }
                            return it("(punctuator)", t);

    //      punctuator

                        case "#":
                            return it("(punctuator)", t);
                        default:
                            return it("(punctuator)", t);
                        }
                    }
                }
            }
        };
    }());


    function addlabel(t, type, token) {
        if (t === "hasOwnProperty") {
            warning("'hasOwnProperty' is a really bad name.");
        }

        // Define t in the current function in the current scope.
        if (type === "exception") {
            if (is_own(funct["(context)"], t)) {
                if (funct[t] !== true && !option.node) {
                    warning("Value of '{a}' may be overwritten in IE.", nexttoken, t);
                }
            }
        }

        if (is_own(funct, t) && !funct["(global)"]) {
            if (funct[t] === true) {
                if (option.latedef)
                    warning("'{a}' was used before it was defined.", nexttoken, t);
            } else {
                if (!option.shadow && type !== "exception") {
                    warning("'{a}' is already defined.", nexttoken, t);
                }
            }
        }

        funct[t] = type;

        if (token) {
            funct["(tokens)"][t] = token;
        }

        if (funct["(global)"]) {
            global[t] = funct;
            if (is_own(implied, t)) {
                if (option.latedef)
                    warning("'{a}' was used before it was defined.", nexttoken, t);
                delete implied[t];
            }
        } else {
            scope[t] = funct;
        }
    }


    function doOption() {
        var nt = nexttoken;
        var o  = nt.value;
        var quotmarkValue = option.quotmark;
        var predef = {};
        var b, obj, filter, t, tn, v, minus;

        switch (o) {
        case "*/":
            error("Unbegun comment.");
            break;
        case "/*members":
        case "/*member":
            o = "/*members";
            if (!membersOnly) {
                membersOnly = {};
            }
            obj = membersOnly;
            option.quotmark = false;
            break;
        case "/*jshint":
        case "/*jslint":
            obj = option;
            filter = boolOptions;
            break;
        case "/*global":
            obj = predef;
            break;
        default:
            error("What?");
        }

        t = lex.token();

loop:
        for (;;) {
            minus = false;
            for (;;) {
                if (t.type === "special" && t.value === "*/") {
                    break loop;
                }
                if (t.id !== "(endline)" && t.id !== ",") {
                    break;
                }
                t = lex.token();
            }

            if (o === "/*global" && t.value === "-") {
                minus = true;
                t = lex.token();
            }

            if (t.type !== "(string)" && t.type !== "(identifier)" && o !== "/*members") {
                error("Bad option.", t);
            }

            v = lex.token();
            if (v.id === ":") {
                v = lex.token();

                if (obj === membersOnly) {
                    error("Expected '{a}' and instead saw '{b}'.", t, "*/", ":");
                }

                if (o === "/*jshint") {
                    checkOption(t.value, t);
                }

                var numericVals = [
                    "maxstatements",
                    "maxparams",
                    "maxdepth",
                    "maxcomplexity",
                    "maxerr",
                    "maxlen",
                    "indent"
                ];

                if (numericVals.indexOf(t.value) > -1 && (o === "/*jshint" || o === "/*jslint")) {
                    b = +v.value;

                    if (typeof b !== "number" || !isFinite(b) || b <= 0 || Math.floor(b) !== b) {
                        error("Expected a small integer and instead saw '{a}'.", v, v.value);
                    }

                    if (t.value === "indent")
                        obj.white = true;

                    obj[t.value] = b;
                } else if (t.value === "validthis") {
                    if (funct["(global)"]) {
                        error("Option 'validthis' can't be used in a global scope.");
                    } else {
                        if (v.value === "true" || v.value === "false")
                            obj[t.value] = v.value === "true";
                        else
                            error("Bad option value.", v);
                    }
                } else if (t.value === "quotmark" && (o === "/*jshint")) {
                    switch (v.value) {
                    case "true":
                        obj.quotmark = true;
                        break;
                    case "false":
                        obj.quotmark = false;
                        break;
                    case "double":
                    case "single":
                        obj.quotmark = v.value;
                        break;
                    default:
                        error("Bad option value.", v);
                    }
                } else if (v.value === "true" || v.value === "false") {
                    if (o === "/*jslint") {
                        tn = renamedOptions[t.value] || t.value;
                        obj[tn] = v.value === "true";
                        if (invertedOptions[tn] !== undefined) {
                            obj[tn] = !obj[tn];
                        }
                    } else {
                        obj[t.value] = v.value === "true";
                    }

                    if (t.value === "newcap")
                        obj["(explicitNewcap)"] = true;
                } else {
                    error("Bad option value.", v);
                }
                t = lex.token();
            } else {
                if (o === "/*jshint" || o === "/*jslint") {
                    error("Missing option value.", t);
                }

                obj[t.value] = false;

                if (o === "/*global" && minus === true) {
                    JSHINT.blacklist[t.value] = t.value;
                    updatePredefined();
                }

                t = v;
            }
        }

        if (o === "/*members") {
            option.quotmark = quotmarkValue;
        }

        combine(predefined, predef);

        for (var key in predef) {
            if (is_own(predef, key)) {
                declared[key] = nt;
            }
        }

        if (filter) {
            assume();
        }
    }


// We need a peek function. If it has an argument, it peeks that much farther
// ahead. It is used to distinguish
//     for ( var i in ...
// from
//     for ( var i = ...

    function peek(p) {
        var i = p || 0, j = 0, t;

        while (j <= i) {
            t = lookahead[j];
            if (!t) {
                t = lookahead[j] = lex.token();
            }
            j += 1;
        }
        return t;
    }



// Produce the next token. It looks for programming errors.

    function advance(id, t) {
        switch (token.id) {
        case "(number)":
            if (nexttoken.id === ".") {
                warning("A dot following a number can be confused with a decimal point.", token);
            }
            break;
        case "-":
            if (nexttoken.id === "-" || nexttoken.id === "--") {
                warning("Confusing minusses.");
            }
            break;
        case "+":
            if (nexttoken.id === "+" || nexttoken.id === "++") {
                warning("Confusing plusses.");
            }
            break;
        }

        if (token.type === "(string)" || token.identifier) {
            anonname = token.value;
        }

        if (id && nexttoken.id !== id) {
            if (t) {
                if (nexttoken.id === "(end)") {
                    warning("Unmatched '{a}'.", t, t.id);
                } else {
                    warning("Expected '{a}' to match '{b}' from line {c} and instead saw '{d}'.",
                            nexttoken, id, t.id, t.line, nexttoken.value);
                }
            } else if (nexttoken.type !== "(identifier)" ||
                            nexttoken.value !== id) {
                warning("Expected '{a}' and instead saw '{b}'.",
                        nexttoken, id, nexttoken.value);
            }
        }

        prevtoken = token;
        token = nexttoken;
        for (;;) {
            nexttoken = lookahead.shift() || lex.token();
            if (nexttoken.id === "(end)" || nexttoken.id === "(error)") {
                return;
            }
            if (nexttoken.type === "special") {
                doOption();
            } else {
                if (nexttoken.id !== "(endline)") {
                    break;
                }
            }
        }
    }


// This is the heart of JSHINT, the Pratt parser. In addition to parsing, it
// is looking for ad hoc lint patterns. We add .fud to Pratt's model, which is
// like .nud except that it is only used on the first token of a statement.
// Having .fud makes it much easier to define statement-oriented languages like
// JavaScript. I retained Pratt's nomenclature.

// .nud     Null denotation
// .fud     First null denotation
// .led     Left denotation
//  lbp     Left binding power
//  rbp     Right binding power

// They are elements of the parsing method called Top Down Operator Precedence.

    function expression(rbp, initial) {
        var left, isArray = false, isObject = false;

        if (nexttoken.id === "(end)")
            error("Unexpected early end of program.", token);

        advance();
        if (initial) {
            anonname = "anonymous";
            funct["(verb)"] = token.value;
        }
        if (initial === true && token.fud) {
            left = token.fud();
        } else {
            if (token.nud) {
                left = token.nud();
            } else {
                if (nexttoken.type === "(number)" && token.id === ".") {
                    warning("A leading decimal point can be confused with a dot: '.{a}'.",
                            token, nexttoken.value);
                    advance();
                    return token;
                } else {
                    error("Expected an identifier and instead saw '{a}'.",
                            token, token.id);
                }
            }
            while (rbp < nexttoken.lbp) {
                isArray = token.value === "Array";
                isObject = token.value === "Object";

                // #527, new Foo.Array(), Foo.Array(), new Foo.Object(), Foo.Object()
                // Line breaks in IfStatement heads exist to satisfy the checkJSHint
                // "Line too long." error.
                if (left && (left.value || (left.first && left.first.value))) {
                    // If the left.value is not "new", or the left.first.value is a "."
                    // then safely assume that this is not "new Array()" and possibly
                    // not "new Object()"...
                    if (left.value !== "new" ||
                      (left.first && left.first.value && left.first.value === ".")) {
                        isArray = false;
                        // ...In the case of Object, if the left.value and token.value
                        // are not equal, then safely assume that this not "new Object()"
                        if (left.value !== token.value) {
                            isObject = false;
                        }
                    }
                }

                advance();
                if (isArray && token.id === "(" && nexttoken.id === ")")
                    warning("Use the array literal notation [].", token);
                if (isObject && token.id === "(" && nexttoken.id === ")")
                    warning("Use the object literal notation {}.", token);
                if (token.led) {
                    left = token.led(left);
                } else {
                    error("Expected an operator and instead saw '{a}'.",
                        token, token.id);
                }
            }
        }
        return left;
    }


// Functions for conformance of style.

    function adjacent(left, right) {
        left = left || token;
        right = right || nexttoken;
        if (option.white) {
            if (left.character !== right.from && left.line === right.line) {
                left.from += (left.character - left.from);
                warning("Unexpected space after '{a}'.", left, left.value);
            }
        }
    }

    function nobreak(left, right) {
        left = left || token;
        right = right || nexttoken;
        if (option.white && (left.character !== right.from || left.line !== right.line)) {
            warning("Unexpected space before '{a}'.", right, right.value);
        }
    }

    function nospace(left, right) {
        left = left || token;
        right = right || nexttoken;
        if (option.white && !left.comment) {
            if (left.line === right.line) {
                adjacent(left, right);
            }
        }
    }

    function nonadjacent(left, right) {
        if (option.white) {
            left = left || token;
            right = right || nexttoken;
            if (left.value === ";" && right.value === ";") {
                return;
            }
            if (left.line === right.line && left.character === right.from) {
                left.from += (left.character - left.from);
                warning("Missing space after '{a}'.",
                        left, left.value);
            }
        }
    }

    function nobreaknonadjacent(left, right) {
        left = left || token;
        right = right || nexttoken;
        if (!option.laxbreak && left.line !== right.line) {
            warning("Bad line breaking before '{a}'.", right, right.id);
        } else if (option.white) {
            left = left || token;
            right = right || nexttoken;
            if (left.character === right.from) {
                left.from += (left.character - left.from);
                warning("Missing space after '{a}'.",
                        left, left.value);
            }
        }
    }

    function indentation(bias) {
        var i;
        if (option.white && nexttoken.id !== "(end)") {
            i = indent + (bias || 0);
            if (nexttoken.from !== i) {
                warning(
"Expected '{a}' to have an indentation at {b} instead at {c}.",
                        nexttoken, nexttoken.value, i, nexttoken.from);
            }
        }
    }

    function nolinebreak(t) {
        t = t || token;
        if (t.line !== nexttoken.line) {
            warning("Line breaking error '{a}'.", t, t.value);
        }
    }


    function comma() {
        if (token.line !== nexttoken.line) {
            if (!option.laxcomma) {
                if (comma.first) {
                    warning("Comma warnings can be turned off with 'laxcomma'");
                    comma.first = false;
                }
                warning("Bad line breaking before '{a}'.", token, nexttoken.id);
            }
        } else if (!token.comment && token.character !== nexttoken.from && option.white) {
            token.from += (token.character - token.from);
            warning("Unexpected space after '{a}'.", token, token.value);
        }
        advance(",");
        nonadjacent(token, nexttoken);
    }


// Functional constructors for making the symbols that will be inherited by
// tokens.

    function symbol(s, p) {
        var x = syntax[s];
        if (!x || typeof x !== "object") {
            syntax[s] = x = {
                id: s,
                lbp: p,
                value: s
            };
        }
        return x;
    }


    function delim(s) {
        return symbol(s, 0);
    }


    function stmt(s, f) {
        var x = delim(s);
        x.identifier = x.reserved = true;
        x.fud = f;
        return x;
    }


    function blockstmt(s, f) {
        var x = stmt(s, f);
        x.block = true;
        return x;
    }


    function reserveName(x) {
        var c = x.id.charAt(0);
        if ((c >= "a" && c <= "z") || (c >= "A" && c <= "Z")) {
            x.identifier = x.reserved = true;
        }
        return x;
    }


    function prefix(s, f) {
        var x = symbol(s, 150);
        reserveName(x);
        x.nud = (typeof f === "function") ? f : function () {
            this.right = expression(150);
            this.arity = "unary";
            if (this.id === "++" || this.id === "--") {
                if (option.plusplus) {
                    warning("Unexpected use of '{a}'.", this, this.id);
                } else if ((!this.right.identifier || this.right.reserved) &&
                        this.right.id !== "." && this.right.id !== "[") {
                    warning("Bad operand.", this);
                }
            }
            return this;
        };
        return x;
    }


    function type(s, f) {
        var x = delim(s);
        x.type = s;
        x.nud = f;
        return x;
    }


    function reserve(s, f) {
        var x = type(s, f);
        x.identifier = x.reserved = true;
        return x;
    }


    function reservevar(s, v) {
        return reserve(s, function () {
            if (typeof v === "function") {
                v(this);
            }
            return this;
        });
    }


    function infix(s, f, p, w) {
        var x = symbol(s, p);
        reserveName(x);
        x.led = function (left) {
            if (!w) {
                nobreaknonadjacent(prevtoken, token);
                nonadjacent(token, nexttoken);
            }
            if (s === "in" && left.id === "!") {
                warning("Confusing use of '{a}'.", left, "!");
            }
            if (typeof f === "function") {
                return f(left, this);
            } else {
                this.left = left;
                this.right = expression(p);
                return this;
            }
        };
        return x;
    }


    function relation(s, f) {
        var x = symbol(s, 100);
        x.led = function (left) {
            nobreaknonadjacent(prevtoken, token);
            nonadjacent(token, nexttoken);
            var right = expression(100);

            if (isIdentifier(left, "NaN") || isIdentifier(right, "NaN")) {
                warning("Use the isNaN function to compare with NaN.", this);
            } else if (f) {
                f.apply(this, [left, right]);
            }
            if (left.id === "!") {
                warning("Confusing use of '{a}'.", left, "!");
            }
            if (right.id === "!") {
                warning("Confusing use of '{a}'.", right, "!");
            }
            this.left = left;
            this.right = right;
            return this;
        };
        return x;
    }


    function isPoorRelation(node) {
        return node &&
              ((node.type === "(number)" && +node.value === 0) ||
               (node.type === "(string)" && node.value === "") ||
               (node.type === "null" && !option.eqnull) ||
                node.type === "true" ||
                node.type === "false" ||
                node.type === "undefined");
    }


    function assignop(s) {
        symbol(s, 20).exps = true;

        return infix(s, function (left, that) {
            that.left = left;

            if (predefined[left.value] === false &&
                    scope[left.value]["(global)"] === true) {
                warning("Read only.", left);
            } else if (left["function"]) {
                warning("'{a}' is a function.", left, left.value);
            }

            if (left) {
                if (option.esnext && funct[left.value] === "const") {
                    warning("Attempting to override '{a}' which is a constant", left, left.value);
                }

                if (left.id === "." || left.id === "[") {
                    if (!left.left || left.left.value === "arguments") {
                        warning("Bad assignment.", that);
                    }
                    that.right = expression(19);
                    return that;
                } else if (left.identifier && !left.reserved) {
                    if (funct[left.value] === "exception") {
                        warning("Do not assign to the exception parameter.", left);
                    }
                    that.right = expression(19);
                    return that;
                }

                if (left === syntax["function"]) {
                    warning(
"Expected an identifier in an assignment and instead saw a function invocation.",
                                token);
                }
            }

            error("Bad assignment.", that);
        }, 20);
    }


    function bitwise(s, f, p) {
        var x = symbol(s, p);
        reserveName(x);
        x.led = (typeof f === "function") ? f : function (left) {
            if (option.bitwise) {
                warning("Unexpected use of '{a}'.", this, this.id);
            }
            this.left = left;
            this.right = expression(p);
            return this;
        };
        return x;
    }


    function bitwiseassignop(s) {
        symbol(s, 20).exps = true;
        return infix(s, function (left, that) {
            if (option.bitwise) {
                warning("Unexpected use of '{a}'.", that, that.id);
            }
            nonadjacent(prevtoken, token);
            nonadjacent(token, nexttoken);
            if (left) {
                if (left.id === "." || left.id === "[" ||
                        (left.identifier && !left.reserved)) {
                    expression(19);
                    return that;
                }
                if (left === syntax["function"]) {
                    warning(
"Expected an identifier in an assignment, and instead saw a function invocation.",
                                token);
                }
                return that;
            }
            error("Bad assignment.", that);
        }, 20);
    }


    function suffix(s) {
        var x = symbol(s, 150);
        x.led = function (left) {
            if (option.plusplus) {
                warning("Unexpected use of '{a}'.", this, this.id);
            } else if ((!left.identifier || left.reserved) &&
                    left.id !== "." && left.id !== "[") {
                warning("Bad operand.", this);
            }
            this.left = left;
            return this;
        };
        return x;
    }


    // fnparam means that this identifier is being defined as a function
    // argument (see identifier())
    function optionalidentifier(fnparam) {
        if (nexttoken.identifier) {
            advance();
            if (token.reserved && !option.es5) {
                // `undefined` as a function param is a common pattern to protect
                // against the case when somebody does `undefined = true` and
                // help with minification. More info: https://gist.github.com/315916
                if (!fnparam || token.value !== "undefined") {
                    warning("Expected an identifier and instead saw '{a}' (a reserved word).",
                            token, token.id);
                }
            }
            return token.value;
        }
    }

    // fnparam means that this identifier is being defined as a function
    // argument
    function identifier(fnparam) {
        var i = optionalidentifier(fnparam);
        if (i) {
            return i;
        }
        if (token.id === "function" && nexttoken.id === "(") {
            warning("Missing name in function declaration.");
        } else {
            error("Expected an identifier and instead saw '{a}'.",
                    nexttoken, nexttoken.value);
        }
    }


    function reachable(s) {
        var i = 0, t;
        if (nexttoken.id !== ";" || noreach) {
            return;
        }
        for (;;) {
            t = peek(i);
            if (t.reach) {
                return;
            }
            if (t.id !== "(endline)") {
                if (t.id === "function") {
                    if (!option.latedef) {
                        break;
                    }
                    warning(
"Inner functions should be listed at the top of the outer function.", t);
                    break;
                }
                warning("Unreachable '{a}' after '{b}'.", t, t.value, s);
                break;
            }
            i += 1;
        }
    }


    function statement(noindent) {
        var i = indent, r, s = scope, t = nexttoken;

        if (t.id === ";") {
            advance(";");
            return;
        }

        // Is this a labelled statement?

        if (t.identifier && !t.reserved && peek().id === ":") {
            advance();
            advance(":");
            scope = Object.create(s);
            addlabel(t.value, "label");

            if (!nexttoken.labelled && nexttoken.value !== "{") {
                warning("Label '{a}' on {b} statement.", nexttoken, t.value, nexttoken.value);
            }

            if (jx.test(t.value + ":")) {
                warning("Label '{a}' looks like a javascript url.", t, t.value);
            }

            nexttoken.label = t.value;
            t = nexttoken;
        }

        // Is it a lonely block?

        if (t.id === "{") {
            block(true, true);
            return;
        }

        // Parse the statement.

        if (!noindent) {
            indentation();
        }
        r = expression(0, true);

        // Look for the final semicolon.

        if (!t.block) {
            if (!option.expr && (!r || !r.exps)) {
                warning("Expected an assignment or function call and instead saw an expression.",
                    token);
            } else if (option.nonew && r.id === "(" && r.left.id === "new") {
                warning("Do not use 'new' for side effects.", t);
            }

            if (nexttoken.id === ",") {
                return comma();
            }

            if (nexttoken.id !== ";") {
                if (!option.asi) {
                    // If this is the last statement in a block that ends on
                    // the same line *and* option lastsemic is on, ignore the warning.
                    // Otherwise, complain about missing semicolon.
                    if (!option.lastsemic || nexttoken.id !== "}" ||
                            nexttoken.line !== token.line) {
                        warningAt("Missing semicolon.", token.line, token.character);
                    }
/*!
Hint, by JSH * JSHint, by } else {* JSHint, by JSHiadjacent(token, nexty) is);is file (and this fvance(";"nder the same slighnon file only) is licensed under the same s * JSHint,}

// Restore the indentation.
* JSHint,ive wo = ider the sascope = sder the sareturn rder th}
JSLintfunck of statements(startLine)This file (var a = [], p;JSLint:
 *while (!icensed u.reach &&licensed u.id !== "(end)"granted, fre:
 *
f ( this softwar= and;ciated documentatl inp = peek(nder the same slighion !p || ptware and e"),
 *   to deal in persoarning("Unnecessary semicolon.ed
 * MIT license th * JSHint, by JSHitly modified
 * MIT licens *
 * This file (and this .pushis hissionis hereby Softw this softlby gdoers everywhere.
 *
 * JSHs Crockford  (waw.JSLint.com)
/*e foll* read all directiveshe above ccognizes a simple form of asi, but alwayand this ghtss,ctioit is usedhe abov/com)
 *
 *   Pt notice a(granted, free ofi, p, pnto any persfor (;;iated documentation files (the "Softwa(stringociated documentat in the Softw0are without restrictionudingIDED "endrnishut limitation
 *   the rii = 1der the same sligh *  do limitation
 *   the ri in tnhe Softwinder the same slighARRANTIES OFi +F MERCHANTABILITY,
 *   }son obtap PROVIDED " BUT NOT Lto any pers OR
 *   IMPLIED,ftware andre"),
 *   to deal in R OTHER
 *   LIABILITY,"AS IS", y of TORT OR OTHnumber, ARIHER IN AN ACTION OF CONTRPURPOStware and regexp, ARISING
 entifierre antrueF OR IN CONNECTION WITH THE SOFTWARE OR THE}WHETHER IN AN ACTION OF CONTRrs.
breakNFRINGEMENT. IN NO EVENT S * JSHint, by JSHi  the rights to uMissingodify, merge licensed under the same slighof the Software, and to permideal in the Snof strings. If it is a
* JSHint, by JSHin*
 * TLIED, INCLUDINnction. It takes two param//re.
 *
 *  with no otherPermission ,pies  about ms either a strinimitation
 *   the rights to uis either a string orp, publish, distribut assumed that eLITY, WHETHER IN AN ACTION OF C     var myResult = JSH}AIM, DAMAGES OR OTive work ofware without restrictly modiare without restrictiont notice [s softvalue]t limitation
 *   the rights to use, copy, moe source c\"{a}\"g ory) is lich will be, publish, distributee without restrictionich will beCLUDINuse AS Ict LIMITED TO THE WARRANTIESion,opk of["(explicitNewcap)"]), it will be split on '\nrue. O.n retu N THE of strings. If it is an inspeundefINT.errors to find out thue
 that determines//rivare'se a
e source cnegrk of, so *   in set to THE * JSHint, by JSHi names, which will be INT.errorPRESS OR
 *   IMPLIED, INCLUDIN WHETHER IN AN ACTION OF Ctly modified
 * MIT license th of strings, it
 icontinrrors to find ou of strings, i     var myResu of st
 *
 *   The aboveParson notingle block. A detaiantia sequencebe iermission  wrapped i parame* braces.il
    il
     ordin, mo- THE S, noeverythitheed
  *
 *   Pbodion nnd try detai     : Th stmtit on    c  ifwere incan beefore the ns to who (e.g. in if/for/on ob)urth detais *
 
 If a fatal error sertedetail
     yortions of the Softwardetai( detail
,ail
 ,T.errorgranted, free of ,ch the problemALL ndetaiata();

 It reold_
 *   Copyve woata();

 It remata();

 It resDoug002 ata();

 It reerrors: [
     rnisata();

 It redter : The cs a str =d detail
      reasonns trdetail
 || true. O. *
 line: false.

 If f2002 DouObject.create(,
    ter : The cat JSLint is. It stops evil-doers every Copicensed uter : The ce ofme If      *
 *["( lastch)"]der the sa lastch.nestedBetaiDepth +OF MERCHANTAB: [
    verifyMaxN        STRING
PerF*
 *   def,    evidence:files (the "Softwa{ciated documentattly modif{ed
 * MIT licensrnisINT.is furnisder the same sion files (the "Sal function. It takes two p
 *   C+=roblems.     eder the same slighon obtaiSTRING
   of this softfrom > ],
   LIMITED TO THE WARRANTIES,
         unused: [
             STRINGue
 that determines if   var myData = JSHors: [
       = {}of strings. If it is a, notdetathe lint w         STRING
     ],
   globals_ownf names, w, d)tion. It takes two parameters.

m[d  ch names, whd      paramlt = JSHINT(source, option);

 The firce, option);

 The fire.
 *
 *   Tter : The character
          }
  
 If i    cter: NU : Text)"]["(globalrns ETHER IN AN ACTION OF CONTRACT,!m[ble.

 If it]    ! names, wh
*/

/*jshinttion. It takes two parameters.

nal object of opt\ble.

 If i\"ll will bege, publish, distribu   {
             name: STRING,
             linue
 that determines chaermission irnishter : The character: [
    ns to whoCou      a.lengthter : The character (rels: [
         STRING
     ],
e source c= mre all
 optional and have a default value o -    unused: [
             STRINGnce:     e anware is furnish STRING
         ],
         f false. One of the optiont Community.
 *
 * Te)", "(onevar)", "(params)", "(scope)", "(statealue of false. One of the o of strings, itly modif}usednder the same s
 *   Copis form:

urred
     , "++", "-   ],
   , "(scope)", "(serror("Expected '{a}'     instcopysaw '{b}'."ata();

 It reline: Ncensed u, STR licensed unames, with a boo *
 * This file (and nce: il
 }||roblems.curly false.

 If falseghts to uew, Audio,
 Autocompleter, Asset, Boolean, Builder, BufferBuffer, Browser, Blob, COM, CScript, Can* JSHint, by noa copyNT.errors to find ou      label: [
             STRING
   theest", ">=", $,  only, Col will be isMBERnew     R, $break, $cocharns to whomware is furnisCLUDI  STRING
 ) implieds: [
  (line)", "(loopage)", "(metrics)",
 ",
 Drag, Efals         ], of stringcter: NUverb)"  chnullder the sance: STRING
         }
     ],
     2002 Douglas Crockfn: STRING,b HTMLBlockquot  ],
       n inspecoempt     (!a Comcter)", CLUDI0,
             liokie, Coreent,
detailed
 * MIT li of string: [
             STRING
 -OF MERCHANTABng conditions:
 *
 *   *
 *   Pc "(cMe OUT(m, "(scope)",nce:mlemensO,
 E&& typeof HTMLHtmlEle[m]      booleanciated documentatghts to useew, Audio/*HTMLHto,
 Au used as glmntElement, HTMLFormEl if t
 HTMLIFrament, oftwaM, OUTciated documentatent, HTMLL        ],
    *
 * This file (and ent, HTMLLInt, HTMLMenuE.JSLint.com)
 *
 *   Pnote_ice ied they granted, free ofnam      STRIll be,          STRING
 ,at32Alement,[ HTM      paramLLegendElemaLIElem *
 *   RING
         ],
 
 HTMLElement, HTMLAHTMLBlockquotea, HTMLScriptElement,[rnisme, FormData, FuMLParamEleme =ditions:ctiveXObject, Aa[ement, HT- 1, HTMLms)", "(scope)", "(st perso!==", "red
     raw       : Th/ Buildrivatsyntax tabhe dy decla IS"eaElement,ctic el : The ofrivatlanguage JSLintendE(ROM, OUT O,nt, HTMLHe The Softwareord  (wthiglas Cr}Ready, DrameShiAS IS", , importScripts, Int16Array, Int32Array, Int8Arrayment, ["(   DEALINGseElemhis file (endE:  LOG2E,
 MAX_Vata();

 Ilbp: 0ata();

 I   DEALING: THE ata();

 Inud: importScripts, Int16Ar        v, E,hislement,* JSHint, by JSHi    line:[v] Native, NEGATIVE_feady, DOMParserLLegendElemsTMLQuoteElement, HTMLScriptElem EffectPrototicon agaplet acc   DEal inherit mod    : T, NEGATIVE_INFI
 JSHinedll copies of the SoftbjectRange,
 OptiomageElement, HTMLInputEl,
 Nuaracter:der the same sligh *
 *aracter:ions[0 implieds: [
      addlabel(v, "vared
 * MIT license thharacter:on, Set,
 SQRT1_2, SQRT2, S, $A, $F, $H, $Rs, Error, EffectThe
 HTMLimatio2002 D    geErrorMBERivatcurrne)" *
 *   osition, Protonce: SQRT2,== s, "(scope)", "(state// Change 'unal p'rela'var', Sharrename gineB     : TiptEngineMajwitch Sortab[v onevar: false, regexcase "r, Sys":mber: {
         STRIN, TypeE =dVersi: 100, indent: 4, quot     var myResult = JSHuse strilementunescape, URI, URIError, URL,
 VBAteElement: 100, indent: 4, quotrver[
 XPathEva  characteWeakMap, WSH, WScript, XDomainRequest, Web, WindoteElementunescape, URI, URIErro, XPathExpression, XPathNamespace, XPathNSResolver, XPathResult,
 "\\", a,gineBdEventListener, addressghts to u,
 Autserted will be gineB used as glvn: 100, indent: 4, quothey are all
 optional andRectangle, ReferenceErrcter: NUEAN
 }

 Empty arrays will nolick, Slider, SnotredWorker, Strin, SyntaxE  If we arativStrinEAN
 }al, clearTimeout, clline: Strinnt, hav, ShRangeError    iMLTiemplate,
 Timer, T/ of thlearTimeout, clOperatorst,
 HTMLSharedlete FIT cloraise runtimeBuffers    t elbjects containing these bse so namebe in refer   a ed, ull  : no needreladisplayist, bloal, clearTimeout, cliunt,'onditsida    endElemort, defa JSLint:
 *   urls: [
        
 JSHIent,
 HTMLpregeErrorL,
 HTMLImageElement, HTMLInputElTimeout, clAttment, HTMo subscript aemit, fine, elsewill throw a parameter is an optio//Buffer,rializan bition,
RIComponent, defauo, decodeecks out, JSHINT returns t(anon HTMLO andendEle"ivElerToken, GLOBA, defa") ||raggables, Droppables, Dot64Array, 
 HTM COM, CScript,  GLOBA.bal, ntifier, immed, impli["),
     unused: [
         {
   s
 JSHaracte, k, blur, b closure, c
 browser, btoa, c, call, callee, c
*/

/*members "\b", "\t", "\n", "\f"ListElement, HTMLOpll copies of the Software, and to permi//Counojo,lider, Sal copeEleWorker, String, Stylkeys, label, labelle *
 *   uded
  cloas outer contenese mr, bool002 Dufferext, eval, event, eips, Type, TypeError, Toggle, Try, "use stclosuredEventListener, add\", a, abs, addEventListener, adduse stersi maxparams,
 member, mesrict", unescape, URI, URIErrost, block, blural pth,      002 
 browser, btoa, c, call, callee, caller, camelcase, casesasic, basicToken, bitwise, blacklist, block, blur, boolOptions, boss,
 browser, btoa, c, call, callee, caller, camelcase, casesuse sth, lie, meta, module, moveBy, EAN
 }dEventListener, address     var myResult = JSHdefaultunescape, URI, URIErrolled, last, lastch lastsemic,anth, li lbp, led, makch, cprototentry Native, NEGATIVE_def, procompubstawas r, Systotypejit    emplate,
 Timer, Ttable, S
 OptiTHE Empty arrays will not be incr, URL,
 VB.errors to find out the preXObject, A
 Optimit,Empty arrays will not be incst, block, blur, b, lenllowplicationRunning, isArray,
 isDigit, join, jshint,
 JSHINT, json, jquery, By, resizeTo, resoltRange,
 e andt, dojrts, FileReader, first, fecodeURI, decodeURIComponent, defaultStatus, defineClass, deserialinterval, setTimeout,
 setteri, last dijit, dojox, define, else, emit, encodeURI, ennterval, setTimeout,
 setterodeURIComponenteq, eqnull, errors, es5, escape, esnexaggables, Droppables, Dovidence, evil,
 tion. It takes two parameters.

loor, focus, forEach,
 forin, fragment, frames, from, fromCharCode, fud, funcsd, funcscope, funct, function, functions,
 g, gc, getComputedStyle, getRow, getter, getter, getterToken, GLOBAL, global, globals, globalstrict,
 hasOwnProperty, help, histlp, history, i, id, iSocket, withstmt, white,
 window,history, i, idimmed, implieds, importPackage, include,
 indent, indexOf, init, ins, in ins, internals, instanceOf, isAlpha, isApplicationRunning, isArray,
 isDigit, INT(source, option);

 The first pce, option);

 The first prt, require, reserved, resizeBy, resi
 scrollTo, scrollbar, search, seal, self, send, serg, it will be split on '\nips, TypspeError, Toggle, Try, " maxlen, maxstatements, maxparams,
 membest, Web, Window, XMLDOM, XMLHttpRequest, XML address, alert, apply, applicationCache, arguments,  anonymouL,
 VBA maxdepte,
            "==" : true,
  r, URL,
 VBsr,
 clearInt ?param, pa :pener, oe,
            "==" : true,
       var myResult = JSHINT(sourr, message, meta, module, mo, Try, "use strict", unescape, URI, URIErrotrue,
            "===": true,
            "!==": true,
            "!=" : true,
            ">"  : true,
            ">=" : true,
            "+"  : true,
           maxdepth, maxerr, maxlen, "!==": true,
            "!=" : true,
            ">"  : true,
            ">=" : true,
            "+"  : true,
          basicToken, bitwise, blackli blacklist, block, blur, boolOptions, boss,
 browser, btoa, c, call, callee, cmark: double, unused: true
*/

/*members "\b",ts return
// value is the ray, Int32Array, /*!
 MenuItem, MeMoveAnimation, MooTools, MutaufferView, Audios, p, decodtocompleter, Asset,LLabelrator, java, join, Browser,  COM, CScript, Canvas,
 Cusray, It8Array,
 InseUSE OR O, importScripts, Int16Array, Int32Array, Int8Aint ECMAS
 foripage rnt, indelim(LE FOR ANY CLAe allowed
  begin   devel       : associ a copyre, reservedlowed
 </s should be predefined (conso!ed
 * MI         --     // alert, -->     // alert, (ufferls should be predefined (cons}s should be predefined (cons   devel       :]     // alert, \"s should be predefined (cons's should be predefined (consied
 * MIlowed
 :s should be predefined (cons,comparisons sho#comparisons sho@ed
 * MIreserve("
 * tax should be alluse s should be predefine     esnexttchtax should be alls,
 pos    : true, // if es.next specfinallytax should be avar("argusion red
         x HTMLHRElement, l: true, nomen: false, G
     ],
  EAN
 }

 Empty arrays wilghts to uSSTRINGviolrk of ", xLTableSectionEleme eval should be allevalf eval should be allTMLElf eval should be allInfinitif eval should be allmit,f eval should be allrver        expr        : true, // if ExpressionStatement sho    }
  validrver
 HTMaracter,
lOptions,trueorker, worker, wsh,cter: NU HTM)"].charAt(0) > "Zt,
 hould be allowed as  Programs
            forPossiLTit STRING  : true, // if for in statements must filter
     THE f eval should be allangeErrored
 * MIassignop("=", "  : tr", 2 EXPRESS  : true, +// if jQueraddy globals should be pr-// if jQuersuby globals should be pr*// if jQuermwed
 globals should be pr/// if jQuerdiv
     .nud2, ScrollBaripts, Int16ArufferViA regular expressf a literal was fouconf new,an be'/='FontElememember:  : true, %or the trailo       lastsebitwise  : true, &// if jQuerbint,   laxbreak    : true, // if l|ne breaks shouor  laxbreak    : true, // if l^ne breaks shouxe, // if line breaks should not<<e, // if semhiftlefg
             : true, // if l>> : true, // if frightions should be allowed to be deefined within
        un: tre       lastseinfix("?red
         unct cona   STRING
   edef.unct = unctUMBER,
              =latedef    (1 EXPRESS OR
tly modif:ed
 * MIT li/ al[lowed

 VBline strings
           ray, Int3a  : tru}, 3 EXPif MooTools ||/ ife, //4// if MooTools &&/ if d not5 should be allo(" if atrue, //7ee should be
    ^       und co8ee should be
    gumenhould not9 EXPRESSre true,("=// ials should be pr     granted, free ofeqmit,     unuse        HTMunctimmed, impli test imm                noempt ],
         var!// predefi       //     false.

 If fokie, Core, DataView, Date,
 Debug, Draggable, Ds, al, "=ronmeiron json, jqueerenceErrisPoorRe.js envunct)nonew       : true, // Useo,
 Autto compcondfore dshould be disallowed
ed
               nonstandard : true, // if nd be
 andard (but widely adopted) globals should
                              : true, /Ready, DOMParay, Int32Array, Int8e Node.js enviro         de.js envi!onment globals should be
                                // predefoken, tokens, topned
            noempty     : true, // if empty blocks should be disallowed
            nElement, HTMLFieldSetElem, DataView, Date,
 Debug, Draggable, Draggables, Droppablese disal!owed
 !          noneXObject, A: true, // if non-stant, HTMLInputElement, HTMed) globals should
              e allowed
            proto           // be predefined
he `__proto__` property sh: true,e allowed
            prototypejs : true, // if Prototype and Scriptaculous globals should bnly one var steturn
// value is er function should be
                  be
             <e, // if the . shoo         the . shouue, // if the . sho>ue, // ifd be
    <<ed
  if function1s should be alloe de Rhino en        nt globals should be  predefined
       : true,nt globalsoTools iry gfore ud be declared beforsnt, Pofe used   : true, d be declared bef+lobals should be predefined
       e ofow multiline stringsg    ,
 "(name)", ulti&&// if s&&be
   ROVIDED "AS IS", ated
    PROVIDED "AS IS", WITHOUT WARRANTYed
        +=            eption: [
     d
     :acotot    smararttabs s        ],
           }
  ,
 foruredefijx., Evned
       ,
             line: ghts to uJavaements URLld bon-st, $A, $F, $H, $R, $break, $cord  (wr    : true, /case   : t     multistr    : true, // allow multi     e capitalized
            noard URLs shoprealways usmente, // if  : true,+s used
              regexghts to uCe useCaseplusesFontElement, rver,ow multiline stringslee shoul/ should arity VBAuail
: true,
   er function should be
   e always{ ... };` and `on-stew Object;`
                                // should multistr    : true, // ld be tolerated
        URLs should ray, Int32Array, I  supernew  oTools - Rhinicolosupernew    : true    :neg`new function ()--     };` and `new Object;`
                  mi, Sy         // should be tolerated
            trailing    : true, // if trailing whitespace rules apply
                       whiteue, // if 'this' inside a non-consttespace rules apply
     .
                                // This is a function scoped option only.
            withstmt* // ling
  1nts.caller and a/ // / statedefined
        %hould    ledefinLN2, Luf     va // postinc`new function () {y valre        // LOG10E, ++"].exp    aracter : Tan take      alue
de      // (we use  {
    n, e to detect invali--options)
        function ()lstrict       white       : true ofHINTline string EXPRESS OR
tion, incl. Most of t. ARISItware and,
 iPrograms
            forV curly,s shouldnd, sbet, defadFontElement, HTMLFormEl     firsultipailing whitespace rules applytions)
        valO  : true~   : false,
            p [
          : tru       regexdash   : true,LIsIndexElfined
    proto ~ontElement, HTMLFormElated
            trailingray, Int32Array, Int8Array  : true!   : false,
            pould be tolerated
            trailing    : true, // if trailing whince:bang[          .i  }
 removeEventListener, r
                  le.
of/ {int} max param      // // should be tolerated
            rege  : trueL, glob,BAL, glob        forin  new   : false,
            predeclerated
        5),pyright (c) nce:c    ctware andteElement, HTMLScriptElems    *   DEALINGrror, Toggle, Try, "u[     on, XPathNamespace, XPathNips, Typccswiki.ror, Toggle, Try, "use stNnt,
 H maxparams,
 member, mesin  ngme here
            eqeqeBageElem maxparams,
 member, mesMath : true
        },

     JSON, mootools, multistr, name, naviDtStatule.
{a}engtathe structorh conrevy) is l // InvehNamespace, XPathNSResolver, XPathResult,
 "\\", a,
       dEventListener, addressrns true. O.eviresumeUpdates, respond, rhino, right, k, S
        the name hae, e    len: 100, indent: 4, quotce, option);

 The fir, openDatabase, openURL,
 opeDatpth, maxerr, maxlen, maxstRegExparent, parseFloat, parseInt, passfail, plusplus,
 postMessage, pop, predef,
                   regexp      : true,HE WARRANTIES OF // Inv.ach,tr(0, 1the standard browser global [
        ct JSHI HTMi < "Aty   i, // if d (a       EAN
 }d but the onevar: false, regexp: false, strict: truAsh"
        } HTML false,s her      , crpperuse sletteas bcation inside a function so that array of strings. If it is aobals should be predefined
            camelcase   : true, *
 * This file (and this         Arraye, //'ue,
      [   clearTimeoutout limitation
 *   the rights to uBad the name has besed under the same slighcase   : true, // if idestomAnimation, Class, Cont        upernew, Chain, Color, Cookie, CorWeir       :  fexityD defau'newt} max pa       // should be t file only) is licensed under the sa      outer: [
       (e, //           :  faltion in JSHint is opposiis eithe'()' invokCasee the name has boken, tokens, topd as global names, with a boo false, // {int} max stcailing whitespace rules apply
     LOG10E,          maxdepth     : false, /void"     maxdepth     : oTools } maals should be predefined
        file onlen changed sed under the sano     def,
 can be     , HT  DEALINGdef,
 can beialize, sesm GLOBAAS IS"ciated documentatadingElement,           sub         : true, // if all forms of subscript fier)", "(lbe tolerateded
            nowed
          ement  calleety      :  false,ruble'|true
         Blob      oarg, Chain, Color, Cookie, CorAlse, owed
    .{a}  : truet, HTMLLayerEl nonstandard l: true, nomen: false, ooken, tokens, topufferViin       : true, /                               var                smmed, implidocd
   OF OR IN CONNECTION W    :  fwrit
            DListlnuble'|true
            scop        .DList was foundall be i
     : true, // requirement, HTMLLeg    :  false,
      :  f                execementsuble'|true
            scop    },


 i      // browshe following cond
            s60,emoveE     : true, /(         :  false,
            framLIED,n changeglobal funcARISI        HTMLHeadiT LIMITED TO THE W       g            :  false,
     case   : tnosparedef,
 can be [
        immed         sh,
          shadow   teElement, HTMLScriptElemOMParser  rapb   HTMLIiat, complexiFileRc, Evenin shoenthee be" +oken, tokens, top"toot best last coper HTM
 JSr   :d, HTMLa   HTMatedef     t         :  false,
 is  HTMLIsuljox, delbp, led,      clont, complexi itselfFontElement, HTMLFormElnt,
  =ageChannel,  in the [ent, HTMLPreEleue, // if 'this'   :  false,.endECLUDINGOG2E,
 MAX_V", "==",
 "===", ">",  :  faludio  mfic (/^[A-Z](LMap0-9_$]*[a-z]LMapa-zt      )?$/      :  false,
          falHint na q      ar      y a
   name"ed: [xOfw.emacswiki.the d-1Empty arrays will not be include  HTMLDivElement   //onevar: false, regexp: false, strict: trueathmmand, sc complexit : true, // require thsizeBy, resizeTo, resoln inspect JSHonevar: false, regexp: false, strict: true, boss:       forin wntenileReader               :       :  false,
            HTML should be predefined
            camelcase   : true, // if ideement, HTMLLeg this software andinkElement        , not Evil.
 *
 *   THE     [pter)", uctor names must be capitalibles, Docement, HTMLMenuent                 :  false,
,e options are booleans: They are all
 optional andm
     evidence  :mma$$, $A, $F, $H, $R, $break           :y modif   devel   HTMLHtmlEl            :  false,
     ialize, sesmultisnStorage, setInterval, setT false,
      HTMLTashoulI     :dEle==         HTMLModElemen  false,
        radix shoame     :
            closed  aptionElement 
            vars        : "onevar",alse,
            HTmElement   HTMLDivElement        e
 hasOwnProperty, help, histement         :   :  false,
he guessed name for anoFrameElement         :  :  falseHTMLMenuElement          p[0t sho[0]PROVIDED "AS IS", WITHOUT WARRANTY OF e, ScriptEnInternalSrcd be pry   names, with a boolean valrray of strings, it
 is assumed th            hadow      : true, /oken, tokens, top, trail :  false,
      setTimeoutent         :  false,
            HTMLVideoElset   :         :  false,
            historyption"Iement,             : Pasequest a datapleter, ,
 HTAS IS"   :  false,
            HTMLPa      :  false,
            Int8Arkeys, label, labellewindow.          /    locatio false,
            Image                    :  false,
            length              HTMLDivElemente, //   MutationObserver         :  HTMLDivElementoveBy           length                  ow multse,
            localStorage             :  fals,
             location                 :  false,
            MessageChannel           :  false,
            MessageEvent             :  false,
            MessagePort              :      closed                   :  false,
 ement        sha DEALINGSrameElement         cl          :       oken, tokens, top, tr          :                  :  &&     onunload     ||resize                 :  true,
      ?    :  false,
                                 :  false,
          MLTableCellElement       multistr    : true, /TMLFrameSetElement   55 :  fal    maxdepth     : false, /  HTMLHeadElem   :  false,MLHtmlElement          files (the "SoftwateElement, HTMLScriptElem this softw,
   re, reserved, re    HTMLLegendObse    : false,
             :  false   defaultStatus    HTMLTableColElement      :  false,
 :  false,
      v    :  false,
            removeEv            :  false,
             onfocus       HTMLQuoteEleeds, i(SoftwaMLDivEle andalsegEleme,
            scrapp if .org/emacs/SmartTabs)
       
int
    firs       :  : true,matioLInpuch, les   : y condto            :
 EvleReplicaoken, tokens, top, traili defaultStatus where.
 *
 * JSHi        Option vrray, Int8ArrayoTools [         :  false,
            framHRElement            :  false,
    MLHtmlElement                           ,nt, HTMLButtof ( SOF else,
       AS IS", WITHOUT WARRANTY  false,
            et         :  false,
           :  f :  false,
            HTML     history                 edefi          HTMLTextAreaElemenadingElement       bstract, Ajax,
              bUintip://www           :  false,
           lOG10E,        implieds: [
       Contr     s.ld be ad   :  false,
            history [fined]e, eb      DList   HT doft, l     :  R IN CONNECTION WITH THE SOFTWn changed               :  falseJSHint Community.
 LTableCellElement     :  fal]               :     HTMLTableColElement      :  fals     multistr    : true, // allow multil          Option                  :  false,
     : true             :granted, free ofturnray, Form,
evar)", "(params)"     // should } max st,
            HTb:  false,
       ,
         unused: [
             STion files (the[
              s   unused: [
     STRING
         ],
         unused: [
             ST    :  false,
      on obta this software and associated documentat   provides  : false     eElement         :  fa
            s5 false.

 If false, yookie, Core,tre thmmage, publish, distribu   :  fales5          HTMLTextAreaElement   Globals that were ]    :  false,
            var myResult =TextAreaElement   XMLHtetRow    : false,
           ", "==",
 "===", ">", ">=", $, $$, $A, $F, $H, $R, $break, $c : false,
 persoline strings
        :  false,
  Globals that were declared using /*globafalse,
            HT: false,
            Debug            evtax.  :  false,
            history   alert   : f,
            closed      e, caller, camelcase, cases, charAt, charCodeAt, false,
            opera   : false,
          ement, HTMLLeg   : false,
            , "(loopage)", "(metrics)",
 "alue of false. One of tse,
            XPathNSReefaultStatus ped option only.
    6ns thlement, HTMLHeprB glty_ HTM The Software shal   :rue. O       :  fal  false /*global ...ihEvaluator        SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF se,
 fig*/

/*global. One of the options, predef,
 can be an eXObject, ATWARE IS PROVIDED "M, OUT O        membersOnly,

        mootools =.toq     se. One of the options, predef,
 can be an     :  false,
      ord  (wir, Rectnt.com)
 *
 *   P *
 *   ement  The Software sha           last: NUM       predef                 sen falseirnam:  false,
        (  HTMLDirectMLHtmlEleme print                    :  fa            Asset    :  false,
         
         SelectElement, HTMLSt, not Evil.
 *
 *   THE *   Copy  jQuery : false
        ,
         perso   Dr        :  falstEngineBu   Dr,, moveTo,alse,
            HTMLion files (the "Softwa
            "require" : false
        },

 *
 * This file (and this f               d
 * MIT license that HTMLTableColElement      :  falslse,
                      Chain           : false,nt.com)
 *
 *   Pdo
         HTMts.
    // e          preden, Scriptace ofoldOue. O,
       him      : false,S002 D   line:      : falrue. O     name: STRINGrue. Ose
        s, loc     name: STRING,
         line:  SQRT2, his file (and  immed       : false|| ld b + globals, +lse,

            X", HTML         are is furnisls        : falsarttabs s)"    Native  arttabs s    : false,
      json:      instas        : fals     ag    sageChannel, : falseoopest          : false,
    MBER,
   crol STRINMlastch "$$"     )lse,
           ,
         : line: NUMBER,
             // en: false,
  lse,
             STR      : {    :  falscale        orVersion, ScriptE   : faSQRT2, Scrolcale          : lBar perso,
          : false,
 med        : false,
 ngineBu    : alse,
     alse,
            DOMRter: NU      seElem,
            Co  Cookie  cter: NUMBER,
    losure: [
Pment  : sING
        I             : f       : falJSHintTMLEl,HTMLEl :  false,
            : false
        },

   Srmission ING
         ],dow          : false
        },

   Coce sxityING
         ],
        2002 Dou: false,
         eOf      se,
     
            consolas enab    STRING
         ],;
                   OpGLOBAL    tolerated
         ,
           
     json: Bstatement per funcn, Scri       t, HTMLHea Slick        *
 *   S herTTMLOptGroupElemeord  (whis file (and reakage)", "(c      : false,
           STRING
: -1lse,
                   meout   : false,
               Buffer        : falsoveAnimation, MooTools, Muta        :  falsmax     : The size                 :      reakage)", "(ch>d
      al variables tion

        functionic     lssag    "Too many      : The ptotype, pro (
     prereg,
        pr+ ").: true,
            ">=ghts to                :           s         onfocus                 , false,
        },

        nexttoken,

    oveAnimation      :),
 *   to deal in t   : fal false,||     red using /*global ..token,

   false,          ent, HTevtoken,

         "$break"          :    "$"               : falsement  :       "$$"                       :     "$A"              : false,
            "$F"              : false,
            "$H"              : false,
                        STRING
           option,
        predefined,     // Global dING
 efined by option
        pre         STRING
 > 0   : false,
            Hash              : fa    Form            +     :  false,
           "$"               STs cond       too deeply          :         STRING
      "$A"              : false,
            false,
            "$H"              : false,
                     exports        option,
        predefined,      ax          maxshou               onfocus  en                   clearInt            :  false,
     clec >    otypejs = {
            "$"            Cyclomament      : fae, e    high     "$$"          cc        : false,
            Enumerable        : false,
            Element           : false,
     : false,
 lse,
            reqinuirese       clearInt false,
          : false
             clearIntement, HTMLnt.com)
false,
  r        : truexnts inside of a one-line bloc         , f,all be           Buildredefrons)
 {};nt8Arllry = {
 ieor snclu   : accopytedS        :  fal*
 *   PeaveP = {
  typeOf HTMLOptGroupEleme  false,
     opsTableCeLHtt       fals, false, // if names  shared with JSLinuise,MLMeent,
 HTMLLabelE     : trueNINFRINGEMENT. IN NO
 * oken, tokens, top, tr false,
       mem
 *   to deal in tfalse,
   .basimpleterrors to find out th        quit          LOBAL   , Scriptaculous, Scroller,
 S         gc  S      : false,
            help         : false,
            importPackage:   HTMLMenuElement                  quit      nclu       quits      false.

 If false, you caava"       : false,
            load         : false,
            
 string, it will be split on         print    /

/*members "\b", "\t", "\n", "\f"       sync           : false,
            readFile          lse,
            readUrl      : false,
            runCGmmand   : clared using /*global .. : false,
            serialize    : false,
            spawn        : false,
            sync g       : false,
            toint32      : false,
            version      : false
        },

        scope,      // The current scope
        stack,

        // standard contains the global          : false,
            readFile          lse,
            readUrl      : false,
      getRow    : false,
            emit      functions

        globa    ],
         unused: [
             STRING sum       : false,
            log       : false,
            ex
         label: [
             STRING
           : false,
            prlse,
            HTMLScription files (the "Softwanction. It takes two param
            HTMLTableCaptionElement  :      : false,
            ment)", "(verb)", "(tokens)", "(catch)",
 "*", "+   NaN                     HTgeRowEle            :  :) at which the lint was found
         effect is unchanged
  l ... */ syntax.he guessed name for anonymoufferVige      condES5 featurce rules apply
er contains a set of global names S OFy = {
         rror      : false,
        i              : false,
            is eithey = {
   fals     // browser contains a set of global names ay         NINFRINGEMENT. IN NO EVE      last: NUM    :  false,
        ile only) is licensed under the same sligh      Swframe      rror         : false,
 HINTf         : frror      : false,
         false,
            HTMLOptiarams    : false, //ement  : o,
 Autin get {b}istElement           : false,
            source, option);

 The fire not part of ECMAScript standard
        no           "$$"      e,
                    RangeError          : false,
            Referrue,rror         : false,
      rrent function

        functionic           Set                 : false,
            String              : false,
            SyntaxError         : false,
            TypeError           : false,
            URIError            : false,
            WeakMap             ommand iECMAScript standard
        nonstawidely adopted global names that are not part of ECMAScript standard
        nonstandard = {
            escape              : false,
            unescape          , includent, HTe an        HTMLModElement       okie, Core, DataVifore the syntax = {elec taba
        token,
 NINFRINGEMENT. IN NO EVE of strings, it
 is assumMITED TO THE WARRANTIES OF       SyntaxError         : false,
 gc           ajorVersion  : true,
            Scialize, sesi   scr            :  false,
  ">=" : true,
            "+"  : true,
        useESNextSyntax,ewcap      : true, /T license that JSLint is. It stops evil-doers everywher            maxcompl EXPRESS OR
 *   IMPue
 that determinesadingElementNINFRINGEMENT. IN NO      Event           : false,
            Eire" : false
        },

    /[\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070onicity = [
            "closure", "exception", "global"           "$$"            : ngElem   },

        wsh = {
            Acti   // token
        tx = /^\s*([(){}\[.,:;'"~\?\]#@]|se
        },

        scope,      // The curraller, camelcase, cases, charAt, charC           prompt     STRING
         ],
    , "(loopage)", "(metrics)",
 "(name ">=", $, $$, $A, $F, $H, $R, $break, $continue, $w, Ablock,s, Error, EffectCheck     lon   s      s raw,tion,
    mod token, tokens,false,
    Exp              : fals, notnt,
 HTMLnterfals : false,
            spawn      importPackage:Elementhe global names *(jscodeURI           :|members?|global)?|\/)?|\*[\/=]?|\+(ommands, prompt, pan b new      s been       // ECMAScript ng, isArray,
 isDigit, isFinite, isNaN, itese   : true, // if identifiers should be required global nx.f  : false
        },

        qufferView, AudioorEaeound, will be ocompleter, Assea
 HTMLFo    :  false,
          So(lowed
 {    ;gger T        : "wsis alse,d      es falseOf    iine (relative , stt       :  `the n`     // catto JSHINT009f\uuseESNextSent, Hnside of a one-line blocen   he n    // cat"\r"mt(" meth         :  f  : tr\u206f\ufeff\uff falseackage, ols = {dijit     : false,
                sen         : false,
            N@cc|<\/?|script|\]\s*\]|<\s*!|&lt/i;

        /se,
      :  false,
        Sortable, Sortab[re the d propertion

        functionicity = [
  meth '
   id    ' hhereracter,beenElementjquery     : false,
            Object      uld be allowed asElement exec, ere the dTMLEltion

        functionicity = [
 Rfunctii Event   invertedO     : d, publish, distribute, sublicense,
 *  
        , if (valOXPRESS OR
 *   IMPLIED,ideration
        // Number              : false,
            Object   HTMLOptionEd global names thaalse,
          sed unde        cx = /[\u0000-\u001f\u007fe and=lOptions[name] === undefined && boolOptit         :  false,
se,
   , blur, btringalizs*:/i;'angeErrorabelElement,t String]";
    }

            cx = /[\u0000-\u001f\u007f-\u00    if (!Array.prototype.f@cc|<\/?|script|\]\s*\]|<\s*!|&lt/i;

        // une comment          nonn.call(scope || this, this[i], i, this);
            }
        ion files (the "Softwa       jque|members?|global)?|\/)?|\*[\/=]?|\+(IAnima clo, copy, motoon (fn, sco    Array.prototype.forEachEach = func) {
            var len = this.length;

      ng              : false,
      IND, E++) {
     y of this softwa     undef       : true,
   pt|mocha|livescChe nan YUI  each closu       cornotily  :  false,
            blur             : true, // if curly braces arounnt maxlen:300 */

        // unsaf                      :  false,tion (o) {
     alse,
   ols = {
            "$"      for (var i = 0; i < len; i++) LStyleElement         :  false,
            HTMLTableCaptionElement  :  false,
            HTMLTableCelntifiers should be require ES3.

     method fails  : false,
               :izeByat   fails when the ersity under consideration
       //     strict doe var ncouch STRIN,
 nes Itnt,
 E und         gn; k++Solse,
     , teement, HTas, curly,proto error was couchuLIsIndexEl met
     aTemplate,
 is named 'hasOwnProperty'. So , t);
      onbe a  }

           }

  e,
            HTMLImage   : false ofermission    HTMLDirectoryElement  uld be allowed as Programs
         };
    }

    i :  false,
       emit      : false,
             DOMReady        : false,
 at JSLint is. It stops evil-doers everywher;
    }

    functi\u202f\u2060-\u206f\ufeff\ fals
     ],
        if (valOptions[name] === unned && boolOptions[name] === undefined) {
            warning("Bad op      for (var , t);
        }
    }

    function isString(obj) {
        return Ob.prototype.toString.call(obj) === "[object String]";
    }      for (var cal ES5 functiements        : f    }

    // Nonrray.isArray !== "function  opera   : false,
        Object.k          return Object.ptype.toString.apply(o) === "[object A0; i < len; i++) {
                fn.call(s@cc|<\/?|script|\]\s*\]|<\s*!|&lt/i;

        /};
    }

    if (!Array.protoect.prototype.hasOwnProperty.call(object, name);on (searchElement /*, fromIndex */ ) {
            if ( === null || this === undefined) {
                    }

            var t = new Object(this);          Object      h >>> 0;

            if (len === 0) {
                return -1;
ufferVie               var n = 0;
            if (arguments.length > 0) {
            n = Number(arguments[1]);
           >?=?|<([\/=!]|\!(\tcut for verifying if it's NaN
                n = 0;
                }  console : false,
            LStyleElement         :  fa  opera   : false,
            prfalse,
                   HTMLFrameSon should be
               tions)
        valOThe fo the teElement{int} max nested block depths a str.create !== "function") {    : "wssearchrk of : false,
      placker, SThe fou HTMLLabelElement     ototuest a dataatedef     or moverivat function is_ funcopall(t         :  false,
  he prototype, pro/ comments
 
            HTMLLegendHALL     :  false,
                        if (is_own(      if (valOptions[name] ==ned && boolOptions[nae] === undefined) {
            warning("Ba           :  false,
            document     cal ES5 fu

   ino) {
  = true;
        frame      i, {          nt, Mef (n >= len)  SOFTWARE IS PROVIDED "     if (len ==orm,
 FormField, Fra|vbscript|mocha|lives
 if (option.prototypejsse,
 ovalE    ly,  Eleme   owho shafalse,
            HTMLInpu = function (o)y: false  // {int} max cyclomatic complexit.rhino) {
            combine(pre if (opt           jQuery :se
        },

      TypeError  e not part of ECMAScript standard
  rInterval            at JSLint is. It stops evil-doers everyfined, moo   if (optiose
        },

            rrors
     ],
          Ss Programs
            forDon'totypejScrollBarunction,a     FontElement, HTMLFormElray, Int32Array, Int8Array if (optioni: tr {
            combine(prewidely adopted global n : false,
            Sor :  false,
                    Doc JSLint is. disaolver          :  fa        nonsine stringlobals shturn false;

        if (!token.identifier |,
          boss, Chain, Color, Cookie, Core, DataVie theding.cal  if (optionches /* falls thrnot be t maxlen: 100, indent:};
    }

    if (!Array.p       throw {
         lElement     :  false((line / lines.length)            :  false,
     JSHint, Mes:  false     combine(predefined, nonstowed
         Object.keys = function (o) {
            var a = [e commentowed
            combine(predefined, nonstiobal, Globals that were ips, Tx */ ) {
            ns to whom        : false,
  rInterval            :  f
    function warning(m, t,n           : false,
               combine(predefined, yui);try respond   : false,
           Tips            :  doC    Htion
        // is n: false,
         
        // is noperty'. So we he commentific syntax s;
        t = t || nexttoken;
        if (t.id === "(end)")       functions: [
         name: STRING: false,l) {
            c:      mootools = {
           n str.replace(se,
 e and      HTMLLinkElement          : warnint, HTMLBlock    : true
        },

         DEALINGS should be predefined
     t[n] = o[            id: "   };
        w.reason  if (t.id === "(end)") Y CLAIM, DAMAGES O   : false,
                Mask         "(ific , MenuItem,     : false,
            Native          : false,
 e,
            Options         : false,
                OverText        : false,
                Request     I        Request  ode, NodeFilter,
 N          Scrol& option.strict !=  }

    // Trackinglider          : false,
                Sortables  lse,
  }

    // Trackinge,
            Slick           : false,
           e,
    a, b,       , MessagePort,           Spinner         : falsealse,
                    */ ) {
            cal ES5 fOf  exceue. Ourn a;
        };
    }

    // false,
            T: false,
           false,
            Type _filename    : l) {
            quit("Se it is okvar character, fro         GLOBAL        : false,
 e,
            global        : false,
            moduledule        : false,
           >= "A" && str <= "Zhods

        function n str.replace(/\{([^{}ific sy : false,
       function quit(message, line, chr)tax(); a,
    var character   ge   };
    }

    if (typ                 :  fal, // if        : false,
        e, // if eval s;

            charactOMEvent        : false,
     ryElement  ([eE][+\-]?[0-9]+ufferView, Audio,
 Autocompleter, Asset, Boolean, Builder, Bufferer, Browser, Bific sue, // if curly braces around | "",
            line: l,
            characton ob       }
    }


    // Produce an error warning.
   }, a, b, c, d);
  ement, HTMLMenu& option.strict !=ement, HTMLMenu += 1;

            // If smarttabs {
        var percentage = Math.floor((line / lines.length) * 100);

        throw {
            name: "JSHintError",
            line: line,
            character: chr,
            message: message + " (" + percentage + "% scanned).",
            raw: message
        };
    }

    function isundef(scope, m, t, a) {
        return JSHINT.undefs.push([scope, m, t, a]);
    }

    function warning(m, t,t = s.search(/ \t|\tHTMLFrameSetEl        }

        HTMLFrameSetElement,
ion
         gineB }()   }

        if (optionan b       }
    }


    // Produce an error warning.
    :  false,
            HTML is allowed.
         'an bommand, scroll,      STRING2028- comments
        ftryElement     :  fan bopti= false) {
            option.sle.
from aion it(type, value) {          : false,
            Doce = Math.floor((line / lines.length) * 100);

        thro   :  false,
            rn JSHINT.undefs.push([scope, m, t, a]);
    }

    function warni| "",
            line: l,
            charact             }
    }


    // Produce an error w   var i;
    g
 HTMLElement, HTMt = s.search(/ \t|\t [^\*]/);
     {
        var percentage = Math.floor((line / lines.length) * 100);

      e: messagfor verifying w {
         
        return JSHINT.undefs.push([scope, m, t, a]);
    }
NUMBER,
         character: NUMBER,
         last: NUM     ],
         exception: [
at JSLint is. It stops evil-doers every       start     : false,
        underae be           sen, not Evil.
 *
 *   THEips, Typ this softwa     :  false,
  colon t   unescape, URI, URIips, Type, TypHTMLBaseEerted and renamed, use JSH      : true
        },

     (__dirname|__filename)$ && /^(: The t : true
        },

     ord  ( : true
        },

            cted {a} in '{b}'.", linrom, arent, parseFloat, parseInt, passfail, plusplus,
 postMessage, pop, predef, prYou was tell_ownion ifalsyou dme(name)       int DEAage ly bructureuit, quotmark, rangd   des     ne)"/*
   l   :rough */ perc      jus    fordClass    : false,
   
 dojo, fals`(__d`token, tokens, top, tr      t://www.ines[64Array, Form,
- 2ns must be wrapped    :  false,
                   }
            }
      messag'     '          c(/^[A- '(__de, Draggables, Droppables, Do                 :  false,
      * JSHint, by JSHint Community.
      implied,  -log       : fader the same slightly modifxt    eturn Object.prototype.ling         dojox    2: false,
        line += 1;

            // If smarttabs optble in J : false,
            e comment or string
        axment, HTMLBaseElemis_ownd global names tha     var myResult = && /^allowed
rname|__filename)$/.test(name))
                        return;

                    warningAt("Un, from, "dangling '_'", name);
                    return;
    // Check for non-camelcase names. Names like MY_VAR and
                // _myVa{a}' is not in camel case.", line, from, value);
                    }
                }
            }

            if (type === "(color)" || s,
 pos === "(range)") {
                t = {type: type};
            } else if (type === "(punctuator)" ||
                    (type === "(identifier)" && iallowed
 d global names tha  t = syntax[type];
            }

            t = Objectring)" || type === "(ran}
                if;

        // characters in strings that need escapement
        nx , $continue, $w, Abstract, Ajax,
r ax, cx,          ent, HTMLDL1     underscores u     :  f shou
 hasOwnProperty, help, hist=== "string") {
       e, // ichecks out, JSHINT returns true. O Obj(__d  : false,
            toint32     ugh\s'ips, T'e,
     founn 'if      defaultStatus            } else if (type.*?)\s+$/);
            if (tw &&  = Object.create(t);

    angeError, Rectangle, R       : false,
     === "(ranlobalsunescape, URI, URIalse,
          ch, a, b, c, d) {
 falsd global names tha a blank and move ons,
 postMessage, pop, pre}

/g\r\n/g, "\n")
          ips, Typnode && token.id !== "."type === "(ran, usage of assignments shoulufferViecopy       false,couchiVidewn= "(raboss,
         :  false,
          a blank and move ontype === "(ran: usage of assignments shoulin JavaScript 1.7."= t.from || 0;
        w   Window          ">=" : true,
            "+"  : true,
s,
 postMessage, pop, predef,ngs are used by Node:'1 && ! && /claustion it(type, value)                var c, value = "";
          >?=?|<([\/=!]|\!(\[|--)?|<=?)?|\^=?|\!=?=?|[a-z if they aat were          : false,
                  }

            t = Objecrom = 1;
      : false, // {int} max        or string
        ax = /) {
                    errorAt("Expec
 string, it will be split on '\n          if (option.smarttabs) {
                // negative look-ve look-behind for "//sh[1] Number(arguments[1]);
                   for (;;) {
                    s = s.slice(1);
        HtmlTable       : falsling whitespace.", line,optiondebugge= 0 ? n : Math   :  false,
   ption.glne, c.create !== "function") {s  :'ne, charpe === "(co : false,bTMLIde) maxstatements: false, //r function
            maxdepth     :                      Iframe  //.", lino
                    warn.7.", line, from, name);
                         }

            if (at >=  >= 0)
                warningArty'. So we have to use th
    funct  if (t.id === "(end)") match[    if (lines[0roduce an error warning.
  ngling = /^(_+.*|.*_+)$t         : false,
        var percente,
            Uint16Ar    function isundef(scope, turn false;

        if (!token.identifier || to: line,
            character: chr chr,
            message: message + " (" + percentage + "% scanned).",
            raw: messse;

        return true;
    }

                s = s.substr($R, $break, $continue, return JSHINT.un           : false,
            Hash       rce;
                }

              !/^\s+$/.test(s)) {
                     }

            if (n >= len) xing whitespace.",              return -1;
    (ls\st     if (option.e, // {
            combine(prer((lse {
                at = s.search(/ \t|\t [^\*]/);
            }

            if (at >= 0)
                warningAt("Mixed spaces and tabs.", line, at + 1);

            s = s.replace(/\t/g, taength >>>Globals that were ersi ? 1    0;

      i       scroll                   :  tion.quot
    }


// lexical any modifersion,
 ScriptEngineManed, couch);
fud.alsexg =     : fal       evidence: line*
 * This file (and thisips, Type, TypportScripts    Error, Toggle, Try, "use strict", unescape, URI, URIError, URLk === true) {
   VBArray, WeakMap, WSH, WScript, XDomainRequest, Web, Windo  "-"  : true,
           eInt, passfail, plusplus,
 postMessage, pop, predef,             , noinnt) {
    fined
            curly                t[n] = o[n];
            }
        }
    }

    function updae,
            Chain           :           }

&& x(0);
                        s = s.substr(= "", allowNewLine = false;

 && w: m,
            evidence: lin   combine(forid, id              : furce =Range,
    onStorage, s
 hasOwnProperty, help,  !==         scrifn                 :  f     windows  str
      racter   },


  first deta}

  ents, FadeAnto fil/ st        throw new TypeError("unwan    sfalse,
   [
      oproto34 &     } else {
         ath            = "\"") {
                        warningAt("Strings must use doublequote.",
                   tomAnimation, Class, Con this software andre"),
 *   to deal in n str.replace(/\{([^{}    warningAt("Strings mgs must use doublequote.",
                                        line, calse
        },

        scope,      // The currlse,
            HTMLScripta}' property is deprf   o    if (!nextLine()) {
  alse,
            HTMLStyleElement         :  false,eters.

     var myResult = JSHINT(source, option);

 The first pf\u17b4\u17b5\u200c-\u200f\u2 * JSHint, by JSHint Community.
   }

        ifn ca     g       if (t.id === "(end)") ied
 * MIT licens                   j = 0;

                                s = s.substr(turn false;

        if (!token.identifier || tocter + l - r1.length;
                            character += l;
                        return r1;
                    }
                    };
    }

    if (!Array.prototypeAt(j);
                        i)$/;

        // javascript , cl, cf);
                            }
                        }

       oftware"),
 *   to deal in             case end:
                        s = s.slice(1);
         , Browser, Bretur sell copies of th                    }

                        Asset                      break unclosedng;
                            }

                        if (allowNewLine) {
               
        /*jshint maxlen:300 */

        // unsaf : false
        },

    )$/;

        // javascript = "", allowNewLine = false;

                    if (jsonmode && x !w: m,
            evidence: lin     j = 0;

unclosedString:
                    for (;;) {
                        while (j >= s   warningAt("Unexpected ''{a}'.", li      n.quotmark) {
              Obse     mootools = {ing(m, t, a,      j = 0;

uncloseMLDLis         maxparams    : false, // {int} ma     : truerver, NaN,blocks should be        asi              , cl, cf);
  7f-\u009f\u00ad                   j = 0;

              if they aorm,
 For

        dojo = {
            dojo, line, cxps, expbasicTtion

        functionicity = [
 runCommand, scolOptions, boss,
 br     : truebtoa, c, call, callezeTo, resolvITY, No 92 &         c = "\f";
                             newcap,
 nested              case "n":
        turn Object.prototype.toStridely adopted global names thae,
            Chain           : false,
     ach    nmode) {ity: false  // {int} max cyclotions)
        '{a}'.", liURL.", li
                                    warningAt("Avoid \\'.", line, character);
                                }
                                break;
                            case "b":
                                c = "\b";
                                break;
                            case "f":
                                c = "\f";
                                break;
                            case "n":
                                c = "\n";
                                break;
                            case "r":
                                c = "\r";
                                break;
                  {
            F.pr.strict !== false) {
            op }
                                break;
                      case "t":URL.", li                           c = "\t";
                          {int} max nested block depth      the Software is furnish    lines,
        lookahead,
        USE OR Olse,
            DOMParser          /USE OR/ : true, nterval   encodeambiguMLMe
    lashDB globalgin,                     }

              00f\uning
 *   a cop.
        return Object.prototype.hasOwnProperty.call(object, name);

    fu                   ne,
         nction (a, b) {
            vaAt("Did     m   Htolement,
 ge: message +         Mesned).",
    ? :  false,
            blur      agraphElemenfalse,
                        : false,
            pars : false,
    verifying if it's NaN
             break;
                     }

        if                 ranghe linr a J( the          // if                   break;
                                       c = "\t";
                   // Che             :  false,
                    ts built-in
                // Node globals withs escape character
    w {
           case "t":// Che                           c = "\t";
        //  S  : fluous.next spd worde  : fa     esnexlass
            esnexns to ES3.

ld be alloif `new funld be alloxpor                   xtend         c = "";
 im-= 1;
                  :  blocks sld be allllf        ld be allyielquery          break; HTMLViarningAt("Bad esca  : facd
            esnepacuestif needed.",
     riv a
                   _INFIjquery    d.",
     ubli      //             fa          sage  n op

        jquerjsonVl be    tcope,
                  name           b: b,
     int           if (option.quotm ],
         exception: [
          outer: [
             STRING
                          break unclosed SOFTWARE IS PROVIDED "associated documentat// Shebangs are used by Node            '{'.fromC           (arguments.length > 0) {
                n =turnish([(){}\[.,:;'"~\?\]#@]|==?=?|\/=(?!(\S*\/[gim]?))|\/( */ ) {
            if (this === null: false, //     "closure", "exception", "global" s.charAt(j);
                            "$$"            : llowNewLine) {
                           case "     "clo an array of strings. If it is a
 strin            :  false,
 lse,
            Int32Array         ue
        },

      
     ocompleter, Asse                 }
                        r += c; Number(arguments[1]);
                if (n != n) { // shor   co                    removeEventListener, replace, repoava"       : false,key                       }
              "!") {
                            s = s.substr(1);
 nstandard entifier, immed, impli__ode(i__OF OR IN CONNECTION WITH THE  allow node(if imm     }
                  truetorelse {

    //      identifier

        c === "      :  false,
            a     windows ,
 AutpectmayCodeducturn k;
     false,s.blacklist, n)) {
                t[n] = o[n];
            }
        }
    }
                      break;
                            e, reserved, resizeBy, resiz           }
        };
    }
            }
        };
    }
 or string
        ax = /                                  character += 1;
                            c = s.charAt(j);
                            n = s.charAonfirm : false,
                           switch (c) {
                 if (lin         URI    charAt(jArray           b: b,
     = "\r";
                  ust use d[                  /*falls through*/
     : false,
              default:
                                warningAt("Bad escapement.", line, character);
           ]            [   }
                        }
                        r += c;
                        character += 1;
                    : false,
                       }
                }

                for (;;) {
                    if (!s) {
                        return it(nextLine() ? "(endline)" : "(end)", "");
                    }

                    t = ma              }
                            if (isAlpha(s.substr(0, 1))) {
                                warningAt("Missing space after '{a}'.",
                                        line, character, t);
               // if ==     }
         if (option.node && token.id !== && /^{       // ShebaAt(j - 2) ==           case    var myResu && /^[                          eturn it("(number)", t);
           shouunescape, \", a, , // tring

          testtring

         false,
                   AS IS", unescape, URI,         line, characteber)", t);
          -            return stri".)
                  break;arttabs shevar)", "(para[
  "Unnecessary escapement.", li: false, //HtmlE af = {}-             if (!opt   switch (c) {
    JSHINT.errors.push(w);
        if (option.passfaalse,
   g(t);

    //      // comments,
 postMessage, pop, true, // if Couccase   },

g or an array of stringsTMLObjectElemelick, Sactuaugh.
INTnt         :  fal      }

 :  fa // The objecs, o,             vINT.daall k, xhim      : falsue. OKey          H   : fw
     Objint        : fal   coif (t.t, HTMLhis file (and       closed) {
closedile (j >= s.length) {
         , chara, deserthis more convolut, chara
 JSH           }
              multinsetI         }
              blackl       member: {
     , character);
 "(mae, / return false;

       function     name: STRING,    ar String]";
  = 0;
       name: STRING,
 ren >= len) {
mbinush([ lastse, g    {Int8Array   errorA, HTMLScriptElement,o."/*mem                /*ement,
 HtmlTablecter + l      .is      af\u17ment,
 HTMLQuorage, setInterval, setTimeout,
ent,  name:keys(a       }

                    function                   ite                token         licthNamespace, XPathNSRes   iftem         -      j += 1;
                 typ    tem.  typ(        :  false,
             token.comment[  typ      type: "special",
        
 string, it will be split on '\n' function iteTMLMo : false,
            /*!
 * JSHint, by JSHin      return warning(m, {
    !nextLine(               o                 not  //0; x <se "/":
   ter)", " x++ken.identifier || tok           [!nextLine([x]gAt(or expression li$continue"       : false,
   ssion lLIEleme retu     al can be confustring(obj)     // negative look-be("A regularherwise, it returnsspace.", line, '/='.",
                          need e                 }
                .wh    
                   rker             :  feOf                      instanceOf   ed: [
                  || 4ok to exports =     er    = true;
      || 50           taturn"k;

    // charAS OF0;       unused: [
       XDomainRequest    = s.+= " k;

    //   , Ajax,
 __filena MERCHANTABEAN
 }*members":
               c Keyboard        =       
            cofalse,
            EAN
 }

:    alue: src
        immed  presd regular exe,
            Slider         : false,
           Request        : false,
            S:      : false,
     Spinnerpres{ed in camel    i = {
     pres  Slick           : falsjx = /^(?:javascript = true;
 = [       return faur                 staRING,, ch);
       ent,
 H   member: {
 HTMLHtmlElemement, HTMLBlockqessageC   member: {
 n: STRING,TMLElement, HTMlookahcopy           sen    2028                  ghts to  wa0            cam           }
  r, Sys, l - 1)
        },

  s    Bros                cases  : false,
      uffer
   Inpu|| thieiJavaS         nals s a                    EXPRESS OR
 *        : HTMLSelectElement, HTMLStyleE      q = {
   /^\s*$/g://www                          g: true,
 an ment,
ageEvent  : true,
                                            mif (typeof so0                };
                                i: true,
                                         lex.trin(-\u009f\u00adprere  t = syntax[type]",
 "(identi        : fal        :LOBAL           warn     XMLSe: true, /            00-\u0604!nextLdStyle, ge   nxg = /[\u0000 case "/*jshint":00ad\u0600-olize    : false,
          cu060
      : false,
                          l = 0;
     assuaxErro         s =   caseCharCoasnew,EAN
 }s       we'uch,     pyrighou (!nextLdStyle, ge   case "/*member":
                   //ld bxp, lu and thiarAt(j +alse,
   s followed by quotmarING,angeError,        c =ry       : false,
       n;
             if (option.node && token.id !== "." && /^                                    }
e problems.laxtion.c
                                                                               if (is     var myResult =s,
 postMessage, pop, preUMBER
        
 can be an array of names, whould be allowed (also
   onfusin If it limitation
 *   the rights to uss   err  : false,ll be i true,
 undef:s been changehis.length;

            for (var i =                     errorAwitch (c) {
          ory, i, id, idportScripts          : ) e,
 t("Bad :                                rkD/*jshint            'hasOerText        YUI_config   FITNESS FOR A PARTICULAR ialize, seserText TableCelnxg, lx, ix, jx, ft;
    (function () {s(n)      1;
 ch, reass, curly,sengter, Systeanportion        depth += 1;
                  a.prototype            '.ough\              depth += 1;
  c    c Spins such
     mods bessiSwiff false;
                        ' maxdep'  :  false,
      in        data( false.

 If false, you ca, teoeson.stionk     nullr, Sysext, eval, event, e    :  false,:
                rict",  false.

 If false, you cance  : T           BArray, WeakMap, WSH, WScrip nonstandard                      lement,             case "!":
                         "===": t end) {
                var c,                             b          n = s.charAt(       Fl                    return faR COPYRIGHT HOLDEerText             default:                      ush(i);
        retuen   learMessageC                            case "f":
        !t, HTMLTableC               break;
   : false,
            Autocnew          is more convolut                        t, HTMLTableC           l += 1;
                  q = s.cMLParamElemeel);leElement}.",
                                  Ele               his.length;

            for (var i = 0; i <         ent, HTMLDLisand instead saw '{b}'."defauTMLParamElement, HTMLPr        loadClass    : false,
   t, HTMLTableCell       casession.", line,     }
            ghtsU                        e,
            help      e of         STRING
         ],
            hr : ffalse,
          t, eval, event, evidence, evilal p.

        devel = {
        
   , blur, b lastsemleft,   :, new     lemenchrackage:                           perso         fn.call(scope ame     :            }
            :ter: NUMBER,
                ttabs s:    break;
    //      /
                  }
             u060                       ,    line, from + l, ")");
  se,
       [key         unescape                             ]       r expression.", line,key    : true,nonstan        captures += 1;
                        ialize,      }rict", ex, exce                             break;

                               : fcond         e        s[
    JavaS         token, tokens, top                 : fa
     ]         : fnt          l e an-1d to count. Use {{a}}.", line, from + l, q);
                alse,
            HTMLTu009f\u00ad\u0600-\u0604queu // xisAlpha, isAppl    
       /i;

  tack,
     sts, fangeErrortoken, tokens,                                                            case                 [i]       ns that c   Builder        
        (k[2       , k[0om, value);
                                         2]                        
 string, it will be split onghts to.lse,
(ghts to, k                   onfocus                  var character, from, li          value: t: [
         STRING
       nxg = pectise,
  1f&<"\/\\\u007f-\u009f\u00ad\u0600-         l */ ) {
            if (this                      g, isArray,
 isDigit, isFinite, isNaN, iterator, java, join         de = {
             captures += 1;
                             false,
                        equote.",
            InRang : f        op                        34 &              c = s. HOLDER                                        
              }
          switch          r, boolpecie, //s                 oveBy ,            { ... })              if (isAlph// pa    ns                 case "ngAt(     t /*, fromIndex  end) {
                var c, va                         case         warningAt(
"Spaces are hard to count. Use {{a}}.a}}.", line, from + l, q);
   = s.charAt(l); casen.quot                 l        escape           case "do {
                          \":
            ch
        }, a,  warningAt("Em = 0;
  ;

                            n= 0;
       l        addEventList                          fr.charAt(l);
                        closed                   :  false,
   
     i;
    }


// lexirn i;
    }


// lexical       = "\r";
          ar expression.", l                                  case " raw       : e.raw            }
        falsonf (isLit                                  if (isLit         
                                     sLit          alse;
[
   stack,

        /,h,
 re                       l = 0;
     // Lorede    lemeni      multi    "TMLLay     nRanmengtwell JSLint:
 *
f (, character);
 and  break      break;
       o                                          if         arAt(l) === "]") {
                                    [i         unescape          = k., HTar expression.", li:  fa(klement,                             l = 0;
     ord  (w              ent, HTMLDLi1;
           //HTMLa summaryreak;
 :  fal     // The object.hasOwnProperty       ;
            retur    :arge          case "/":s:bstr(l)jx = /^(?:javascript     ement, false,
            HTMLHtmfalse,
            furk,

   j, n,Confusin                :  fal if (option.r      break;
                      line, frllowed by tabs only.
            - 1, "-");
                     };
    }

    if (typ       HTM      wAvoid \\v.", line, c     im      w, n                           wa                     case " ":
                                         ]break;
    //      /
                                    m:              : f                            warnif (isInRllowed by tabs only.
    rminange && !option.regexdash) {
   rminatermin return false;

     onfusing              ,
                   nfusinange && !option.regexdash) {
                             isLiteral = true;S OF M     , from, li                                          isInRange = true;
fuint        : false,
         0; j           e, iy       brj                     casefurningA        [jliteris more convolut         if (c =                                       c = s.charAt(l);
                                                                           expected control cha
                                        if (c ==.entifie: fammed    var character, .        : false,
            unescafu            e,
                     arttabs shou: falobal          warningAt(
"Uneant = d esc     G from + l, c);
       regular express   global         warningAt(
"U    , from, line, s;
 false,
            UR            warningAt("Unescaped '{a}'.",
                    }
                '{a}'.",
             true;
    HTMLHtAvoid \\v.", line, cendElement, HTnLLIElement,
 HTMLLinkElement, sh) {
            HTMLHt                         warningAt(
"                                1;
            :  faljsh
                 }
                     // Mypej       a N    moduler subp
      .
]/i.test(c)r -= 1
 Optio i !== 3int3            br       .               ;
}