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
    var CommandManager = brackets.getModule("command/CommandManager");
    var Menus          = brackets.getModule("command/Menus");
    
    var CONVERT_UPPERCASE = "convert_uppercase";
    var CONVERT_LOWERCASE = "convert_lowercase";
    var CONVERT_HTML_ENCODE = "convert_html_encode";
    var CONVERT_HTML_DECODE = "convert_html_decode";
    var CONVERT_DOUBLE_SINGLE = "convert_double_to_single";
    var CONVERT_SINGLE_DOUBLE = "convert_single_to_double";
    var CONVERT_TOGGLE_QUOTES = "convert_toggle_quotes";
    var CONVERT_ENCODE_URI = "convert_encode_uri_component";
    var CONVERT_DECODE_URI = "convert_decode_uri_component";
    var CONVERT_STRIP_TRAILING_WHITESPACE = "convert_strip_trailing_whitespace";
    
    var _getActiveSelection = function () {
        return EditorManager.getFocusedEditor().getSelectedText();
    };
    
    var _replaceActiveSelection = function (text) {
        EditorManager.getFocusedEditor()._codeMirror.replaceSelection(text);
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
        var out = s.replace(_singleQuoteReg, "\"");
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
        
        try {
            var encoded = btoa(s);
            _replaceActiveSelection(encoded);
        } catch (e) {
            console.log("StringConvert : Base64 Encoding failed.");
        }
    };
        
    var _base64Decode = function () {
        var s = _getActiveSelection();
        
        try {
            var decoded = atob(s);
            _replaceActiveSelection(decoded);
        } catch (e) {
            console.log("StringConvert : Base64 Decoding failed.");
        }
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
    
    
    var buildMenu = function (m) {
        m.addMenuDivider();
        m.addMenuItem(CONVERT_UPPERCASE, "Ctrl-U");
        m.addMenuItem(CONVERT_LOWERCASE, "Ctrl-L");
        m.addMenuDivider();
        m.addMenuItem(CONVERT_HTML_ENCODE);
        m.addMenuItem(CONVERT_HTML_DECODE);
        m.addMenuDivider();
        m.addMenuItem(CONVERT_DOUBLE_SINGLE);
        m.addMenuItem(CONVERT_SINGLE_DOUBLE);
        m.addMenuItem(CONVERT_TOGGLE_QUOTES);
        m.addMenuDivider();
        m.addMenuItem(CONVERT_ENCODE_URI);
        m.addMenuItem(CONVERT_DECODE_URI);
        m.addMenuDivider();
        m.addMenuItem(CONVERT_STRIP_TRAILING_WHITESPACE);
    };
    
    CommandManager.register("To Upper Case", CONVERT_UPPERCASE, _convertSelectionToUpperCase);
    CommandManager.register("To Lower Case", CONVERT_LOWERCASE, _convertSelectionToLowerCase);
    CommandManager.register("HTML Entity Encode", CONVERT_HTML_ENCODE, _encodeHTMLEntities);
    CommandManager.register("HTML Entity Decode", CONVERT_HTML_DECODE, _decodeHTMLEntities);
    CommandManager.register("Double to Single Quotes", CONVERT_DOUBLE_SINGLE, _convertToSingleQuotes);
    CommandManager.register("Single to Double Quotes", CONVERT_SINGLE_DOUBLE, _convertToDoubleQuotes);
    CommandManager.register("Toggle Quotes", CONVERT_TOGGLE_QUOTES, _toggleQuotes);
    CommandManager.register("Encode URI Component", CONVERT_ENCODE_URI, _convertToEncodeURIComponent);
    CommandManager.register("Decode URI Component", CONVERT_DECODE_URI, _convertToDecodeURIComponent);
    CommandManager.register("Strip Trailing Whitespace", CONVERT_STRIP_TRAILING_WHITESPACE, _cleanTrailingWhitespace);
    
    var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    buildMenu(menu);
    
    var contextMenu = Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU);
    buildMenu(contextMenu);
});