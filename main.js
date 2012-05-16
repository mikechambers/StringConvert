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
/*global define, $, brackets */

define(function (require, exports, module) {
    'use strict';
    
    // Brackets modules
    var EditorManager = brackets.getModule("editor/EditorManager");
    var KeyMap = brackets.getModule("command/KeyMap");
    var CommandManager = brackets.getModule("command/CommandManager");
    var KeyBindingManager = brackets.getModule("command/KeyBindingManager");
    var CommandMananger = brackets.getModule("command/KeyMap");
    
    var _activeEditor = function () {
        return EditorManager.getFocusedEditor();
    };
    
    exports.CONVERT_UPPERCASE = "convert_uppercase";
    exports.CONVERT_LOWERCASE = "convert_lowercase";
    exports.CONVERT_HTML_ENTITIES = "convert_encode_htmlentities";
    exports.CONVERT_DECODE_HTML_ENTITIES = "convert_decode_htmlentities";
    exports.CONVERT_TO_SINGLE_QUOTES = "convert_to_singlequotes";
    exports.CONVERT_TO_DOUBLE_QUOTES = "convert_to_doublequotes";
    
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
    
    var _convertSelectionToUpperCase = function () {
        var activeEditor = _activeEditor();
        
        activeEditor.replaceSelection(activeEditor.getSelectedText().toUpperCase());
    };

    var _convertSelectionToLowerCase = function () {
        var activeEditor = _activeEditor();
        activeEditor.replaceSelection(activeEditor.getSelectedText().toLowerCase());
    };
    
    var _encodeHTMLEntities = function () {
        var activeEditor = _activeEditor();
        
        var escaped = $("<div />").text(activeEditor.getSelectedText()).html();
        
        activeEditor.replaceSelection(escaped);
    };

    var _decodeHTMLEntities = function () {
        var activeEditor = _activeEditor();
        
        var escaped = $("<div />").html(activeEditor.getSelectedText()).text();
        
        activeEditor.replaceSelection(escaped);
    };
    
    var _convertToEncodeURI = function () {
        var activeEditor = _activeEditor();
    };
      
    var _converyToEncodeURIComponent = function () {
        var activeEditor = _activeEditor();
    };
    
    var _convertToEscape = function () {
        var activeEditor = _activeEditor();
    };
    
    var _doubleQuoteReg = /\"/g;
    var _convertToSingleQuotes = function () {
        var activeEditor = _activeEditor();
        
        var out = activeEditor.getSelectedText().replace(_doubleQuoteReg, "'");
        activeEditor.replaceSelection(out);
        
    };
    
    var _singleQuoteReg = /\'/g;
    var _convertToDoubleQuotes = function () {
        var activeEditor = _activeEditor();
        
        var out = activeEditor.getSelectedText().replace(_singleQuoteReg, "\"");
        activeEditor.replaceSelection(out);
        
    };
    
    //toggle quotes
    //strip line returns
    //wrap in double quotes
    
    var menu = $("<li><a href='#'>Convert</a>" +
        "<ul>" +
        "<li><a href='#' class='string-convert-item' data-action='" + exports.CONVERT_LOWERCASE + "'>To Lower Case</a></li>" +
        "<li><a href='#' class='string-convert-item' data-action='" + exports.CONVERT_UPPERCASE + "'>To Upper Case</a></li>" +
        "<li><a href='#' class='string-convert-item' data-action='" + exports.CONVERT_HTML_ENTITIES + "'>HTML Entity Encode</a></li>" +
        "<li><a href='#' class='string-convert-item' data-action='" + exports.CONVERT_DECODE_HTML_ENTITIES + "'>HTML Entity Decode</a></li>" +
        "<li><a href='#' class='string-convert-item' data-action='" + exports.CONVERT_TO_SINGLE_QUOTES + "'>Double to Single Quotes</a></li>" +
        "<li><a href='#' class='string-convert-item' data-action='" + exports.CONVERT_TO_DOUBLE_QUOTES + "'>Single to Double Quotes</a></li>" +
        "<li><hr class='divider'></li>" +
        "</ul></li>");
    
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
            }
            
        }
    );
    
    CommandManager.register(exports.CONVERT_UPPERCASE, _convertSelectionToUpperCase);
    CommandManager.register(exports.CONVERT_LOWERCASE, _convertSelectionToLowerCase);
    CommandManager.register(exports.CONVERT_HTML_ENTITIES, _encodeHTMLEntities);
    CommandManager.register(exports.CONVERT_DECODE_HTML_ENTITIES, _decodeHTMLEntities);
    CommandManager.register(exports.CONVERT_TO_SINGLE_QUOTES, _convertToSingleQuotes);
    CommandManager.register(exports.CONVERT_TO_DOUBLE_QUOTES, _convertToDoubleQuotes);
});