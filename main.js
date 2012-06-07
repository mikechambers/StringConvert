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
    
    var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    
    menu.addMenuDivider();
    
    menu.addMenuItem(
        "convert_uppercase",
        CommandManager.register("To Upper Case", "convert_uppercase", _convertSelectionToUpperCase),
        "Ctrl-U"
    );
    
    menu.addMenuItem(
        "convert_lowercase",
        CommandManager.register("To Lower Case", "convert_lowercase", _convertSelectionToLowerCase),
        "Ctrl-L"
    );
    
    menu.addMenuDivider();
    
    menu.addMenuItem(
        "convert_encode",
        CommandManager.register("HTML Entity Encode", "convert_html.encode", _encodeHTMLEntities)
    );
    
    menu.addMenuItem(
        "convert_decode",
        CommandManager.register("HTML Entity Decode", "convert_html.decode", _decodeHTMLEntities)
    );
    
    menu.addMenuDivider();
    
    menu.addMenuItem(
        "convert_double_to_single",
        CommandManager.register("Double to Single Quotes", "convert_double_to_single", _convertToSingleQuotes)
    );
    
    menu.addMenuItem(
        "convert_single_to_double",
        CommandManager.register("Single to Double Quotes", "convert_single_to_double", _convertToDoubleQuotes)
    );
    
    menu.addMenuItem(
        "convert_toggle_quotes",
        CommandManager.register("Toggle Quotes", "convert_toggle_quotes", _toggleQuotes)
    );
    
    menu.addMenuDivider();
    
    menu.addMenuItem(
        "convert_encode_uri_component",
        CommandManager.register("Encode URI Component", "convert_encode_uri_component", _convertToEncodeURIComponent)
    );
    
    menu.addMenuItem(
        "convert_decode_uri_component",
        CommandManager.register("Decode URI Component", "convert_decode_uri_component", _convertToDecodeURIComponent)
    );
    
    menu.addMenuDivider();
    
    menu.addMenuItem(
        "convert_base64_encode",
        CommandManager.register("Base64 Encode", "convert_base64_encode", _base64Encode)
    );
  
    menu.addMenuItem(
        "convert_base64_decode",
        CommandManager.register("Base64 Decode", "convert_base64_decode", _base64Decode)
    );
    
    menu.addMenuDivider();

    menu.addMenuItem(
        "convert_strip_trailing_whitespace",
        CommandManager.register("Strip Trailing Whitespace", "convert_strip_trailing_whitespace", _cleanTrailingWhitespace)
    );
    
});