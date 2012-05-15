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
    
    exports.CONVERT_UPPERCASE = "convert.uppercase";
    exports.CONVERT_LOWERCASE = "convert.lowercase";
    exports.CONVERT_HTML_ENTITIES = "convert.htmlentities";
    
    //Hack for keybindings
    //from : https://github.com/jrowny/brackets-snippets/blob/master/main.js
    var currentKeyMap = KeyBindingManager.getKeymap(),
        key = "",
        newMap = [],
        newKey = {};
    
    currentKeyMap['Ctrl-U'] = exports.CONVERT_UPPERCASE;
    currentKeyMap['Ctrl-L'] = exports.CONVERT_LOWERCASE;
    currentKeyMap['Ctrl-T'] = exports.CONVERT_HTML_ENTITIES;
    
    
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
    
    var _convertToHTMLEntities = function () {
        var activeEditor = _activeEditor();
        
        var escaped = activeEditor.getSelectedText();
        var findReplace = [[/&/g, "&amp;"], [/</g, "&lt;"], [/>/g, "&gt;"], [/"/g, "&quot;"]];
        var len = findReplace.length;

        var i;
        var item;
        for (i = 0; i < len; i++) {
            item = findReplace[i];
            console.log(item);
            escaped = escaped.replace(item[0], item[1]);
        }
    
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
    
    /*
    var $item = $("<li></li>");
    $("<a href='#' id='hello-world'>Hello World</a>")
        .click(function () {
            alert("Hello Document: " + DocumentManager.getCurrentDocument().file.fullPath);
        })
        .appendTo($item);
    $("#menu-experimental-usetab").parent().after($item);
    */
    
    CommandManager.register(exports.CONVERT_UPPERCASE, _convertSelectionToUpperCase);
    CommandManager.register(exports.CONVERT_LOWERCASE, _convertSelectionToLowerCase);
    CommandManager.register(exports.CONVERT_HTML_ENTITIES, _convertToHTMLEntities);
    
});