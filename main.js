/*
 * Copyright (c) 2012 Mike Chambers. All rights reserved.
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 * 
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, btoa, atob */

define(function (require, exports, module) {
    'use strict';

    // Brackets modules
    var EditorManager = brackets.getModule("editor/EditorManager");
    var KeyMap = brackets.getModule("command/KeyMap");
    var CommandManager = brackets.getModule("command/CommandManager");
    var KeyBindingManager = brackets.getModule("command/KeyBindingManager");
    
    var Handlebars = require("Handlebars");
    
    exports.CONVERT_UPPERCASE = "convert_uppercase";
    exports.CONVERT_LOWERCASE = "convert_lowercase";
    exports.CONVERT_HTML_ENTITIES = "convert_encode_htmlentities";
    exports.CONVERT_DECODE_HTML_ENTITIES = "convert_decode_htmlentities";
    exports.CONVERT_TO_SINGLE_QUOTES = "convert_to_singlequotes";
    exports.CONVERT_TO_DOUBLE_QUOTES = "convert_to_doublequotes";
    exports.CONVERT_TO_ENCODE_URI_COMPONENT = "convert_to_encodeuricomponent";
    exports.CONVERT_TO_DECODE_URI_COMPONENT = "convert_to_decodeuricomponent";
    exports.CONVERT_TO_TOGGLE_QUOTES = "convert_to_toggle_quotes";
    exports.CONVERT_TO_BASE64_ENCODE = "convert_to_base64encode";
    exports.CONVERT_TO_BASE64_DECODE = "convert_to_base64decode";
    exports.CONVERT_TO_STRIP_TRAILING_WHITESPACE = "convert_to_strip_trailing_whitespace";
    
    //Hack for keybindings
    //from : https://github.com/jrowny/brackets-snippets/blob/master/main.js
    var currentKeyMap = KeyBindingManager.getKeymap(),
        key = "",
        newMap = [],
        newKey = {};
    
    currentKeyMap['Ctrl-U'] = exports.CONVERT_UPPERCASE;
    currentKeyMap['Ctrl-L'] = exports.CONVERT_LOWERCASE;
    currentKeyMap['Ctrl-T'] = exports.CONVERT_HTML_ENTITIES;
    currentKeyMap['Ctrl-D'] = exports.CONVERT_DECODE_HTML_ENTITIES;
    
    
    
    for (key in currentKeyMap) {
        if (currentKeyMap.hasOwnProperty(key)) {
            newKey = {};
            newKey[key] = currentKeyMap[key];
            newMap.push(newKey);
        }
    }
    var _newGlobalKeymap = KeyMap.create({
            "bindings": newMap,
            "platform": brackets.platform
        });
    KeyBindingManager.installKeymap(_newGlobalKeymap);
    //end keybinding hack
    
    var _getActiveSelection = function () {
        return EditorManager.getFocusedEditor().getSelectedText();
    };
    
    var _replaceActiveSelection = function (text) {
        EditorManager.getFocusedEditor().replaceSelection(text);
    };
    
    
    var _convertSelectionToUpperCase = function () {
        var s = _getActiveSelection();
        _replaceActiveSelection(s.toUpperCase());
    };

    var _convertSelectionToLowerCase = function () {
        var s = _getActiveSelection();
        _replaceActiveSelection(s.toLowerCase());
    };
    
    var _encodeHTMLEntities = function () {
        var s = _getActiveSelection();
        var escaped = $("<div />").text(s).html();
        _replaceActiveSelection(escaped);
    };

    var _decodeHTMLEntities = function () {
        var s = _getActiveSelection();
        var escaped = $("<div />").html(s).text();
        _replaceActiveSelection(escaped);
    };
    
    var _convertToEncodeURIComponent = function () {
        var s = _getActiveSelection();
        _replaceActiveSelection(encodeURIComponent(s));
    };
    
    var _convertToDecodeURIComponent = function () {
        var s = _getActiveSelection();
        _replaceActiveSelection(decodeURIComponent(s));
    };
    
    var _doubleQuoteReg = /\"/g;
    var _convertToSingleQuotes = function () {
        var s = _getActiveSelection();
        var out = s.replace(_doubleQuoteReg, "'");
        _replaceActiveSelection(out);
    };
    
    var _singleQuoteReg = /\'/g;
    var _convertToDoubleQuotes = function () {
        var s = _getActiveSelection();
        var out = s.replace(_singleQuoteReg, "'");
        _replaceActiveSelection(out);
    };
    
    var _toggleQuotes = function () {
        var s = _getActiveSelection();
        
        var chars = s.split('');
        var len = chars.length;
        
        var i;
        var char;
        for (i = 0; i < len; i++) {
            char = chars[i];
            if (char === "\"") {
                chars[i] = "'";
            } else if (char === "'") {
                chars[i] = "\"";
            }
        }
        
        _replaceActiveSelection(chars.join(""));
    };
    
    var _base64Encode = function () {
        var s = _getActiveSelection();
        _replaceActiveSelection(btoa(s));
    };
        
    var _base64Decode = function () {
        var s = _getActiveSelection();
        _replaceActiveSelection(atob(s));
    };
    
    var _trimRightReg = /\s+$/;
    var _cleanTrailingWhitespace = function () {
        var s = _getActiveSelection();
        
        var lines = s.split("\n");
        var len = lines.length;
        
        var i;
        for (i = 0; i < len; i++) {
            lines[i] = lines[i].replace(_trimRightReg, "");
        }
        
        var output = lines.join("\n");
        _replaceActiveSelection(output);
    };
    
    //toggle quotes
    //strip line returns
    //wrap in double quotes
    
    var menu = $("<li><a href='#'>Convert</a>" +
        "<ul>" +
        "<li><a href='#' class='string-convert-item' data-action='" + exports.CONVERT_LOWERCASE + "'>To Lower Case</a></li>" +
        "<li><a href='#' class='string-convert-item' data-action='" + exports.CONVERT_UPPERCASE + "'>To Upper Case</a></li>" +
        "<li><hr class='divider'></li>" +
        "<li><a href='#' class='string-convert-item' data-action='" + exports.CONVERT_HTML_ENTITIES + "'>HTML Entity Encode</a></li>" +
        "<li><a href='#' class='string-convert-item' data-action='" + exports.CONVERT_DECODE_HTML_ENTITIES + "'>HTML Entity Decode</a></li>" +
        "<li><hr class='divider'></li>" +
        "<li><a href='#' class='string-convert-item' data-action='" + exports.CONVERT_TO_SINGLE_QUOTES + "'>Double to Single Quotes</a></li>" +
        "<li><a href='#' class='string-convert-item' data-action='" + exports.CONVERT_TO_SINGLE_QUOTES + "'>Double to Single Quotes</a></li>" +
        "<li><a href='#' class='string-convert-item' data-action='" + exports.CONVERT_TO_TOGGLE_QUOTES + "'>Toggle Quotes</a></li>" +
        "<li><hr class='divider'></li>" +
        "<li><a href='#' class='string-convert-item' data-action='" + exports.CONVERT_TO_BASE64_ENCODE + "'>Base64 Encode</a></li>" +
        "<li><a href='#' class='string-convert-item' data-action='" + exports.CONVERT_TO_BASE64_DECODE + "'>Base64 Decode</a></li>" +
        "<li><hr class='divider'></li>" +
        "<li><a href='#' class='string-convert-item' data-action='" + exports.CONVERT_TO_ENCODE_URI_COMPONENT + "'>Encode URI Component</a></li>" +
        "<li><a href='#' class='string-convert-item' data-action='" + exports.CONVERT_TO_DECODE_URI_COMPONENT + "'>Decode URI Component</a></li>" +
        "<li><hr class='divider'></li>" +
        "<li><a href='#' class='string-convert-item' data-action='" + exports.CONVERT_TO_STRIP_TRAILING_WHITESPACE + "'>Strip Trailing Whitespace</a></li>" +
        "</ul></li>" +
        "<li><hr class='divider'></li>");
    
    $("#menu-edit-duplicate").parent().before(menu);
    
    $(".string-convert-item").click(
        function (item) {
            var action = $(item.target).data("action");

            switch (action) {
            case exports.CONVERT_UPPERCASE:
                _convertSelectionToUpperCase();
                break;
            case exports.CONVERT_LOWERCASE:
                console.log("lowercase");
                _convertSelectionToLowerCase();
                break;
            case exports.CONVERT_HTML_ENTITIES:
                _encodeHTMLEntities();
                break;
            case exports.CONVERT_DECODE_HTML_ENTITIES:
                _decodeHTMLEntities();
                break;
            case exports.CONVERT_TO_SINGLE_QUOTES:
                _convertToSingleQuotes();
                break;
            case exports.CONVERT_TO_DOUBLE_QUOTES:
                _convertToDoubleQuotes();
                break;
            case exports.CONVERT_TO_ENCODE_URI_COMPONENT:
                _convertToEncodeURIComponent();
                break;
            case exports.CONVERT_TO_DECODE_URI_COMPONENT:
                _convertToDecodeURIComponent();
                break;
            case exports.CONVERT_TO_TOGGLE_QUOTES:
                _toggleQuotes();
                break;
            case exports.CONVERT_TO_BASE64_ENCODE:
                _base64Encode();
                break;
            case exports.CONVERT_TO_BASE64_DECODE:
                _base64Decode();
                break;
            case exports.CONVERT_TO_STRIP_TRAILING_WHITESPACE:
                _cleanTrailingWhitespace();
                break;
            }
        }
    );
    
    CommandManager.register(exports.CONVERT_UPPERCASE, _convertSelectionToUpperCase);
    CommandManager.register(exports.CONVERT_LOWERCASE, _convertSelectionToLowerCase);
    CommandManager.register(exports.CONVERT_HTML_ENTITIES, _encodeHTMLEntities);
    CommandManager.register(exports.CONVERT_DECODE_HTML_ENTITIES, _decodeHTMLEntities);
    CommandManager.register(exports.CONVERT_TO_SINGLE_QUOTES, _convertToSingleQuotes);
    CommandManager.register(exports.CONVERT_TO_DOUBLE_QUOTES, _convertToDoubleQuotes);
    CommandManager.register(exports.CONVERT_TO_ENCODE_URI_COMPONENT, _convertToEncodeURIComponent);
    CommandManager.register(exports.CONVERT_TO_DECODE_URI_COMPONENT, _convertToDecodeURIComponent);
    CommandManager.register(exports.CONVERT_TO_TOGGLE_QUOTES, _toggleQuotes);
    CommandManager.register(exports.CONVERT_TO_BASE64_ENCODE, _base64Encode);
    CommandManager.register(exports.CONVERT_TO_BASE64_DECODE, _base64Decode);
    CommandManager.register(exports.CONVERT_TO_STRIP_TRAILING_WHITESPACE, _cleanTrailingWhitespace);

    
});