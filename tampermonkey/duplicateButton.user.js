// ==UserScript==
// @name         Adobe Express Duplicate Button Clicker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Click a 'duplicate' button on Adobe Express a set number of times
// @author       U-TUBE.AI
// @match        https://new.express.adobe.com/id*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// ==/UserScript==

// Copyright (c) 2024 Dmytro Rutkovskyi and others

// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function() {
    'use strict';

    // query to find the original duplicate button
    let dupShadowQuery ="body > x-app >>> x-theme > x-coachmark-underlay > x-editor >>> #page-grid-view > hz-virtual-slot >>> x-page-grid-wrapper >>> x-page-grid >>> #grid-header-desktop > sp-action-group > overlay-trigger:nth-child(4) > sp-action-button";
    // delay between clicks when duplicating
    let delayInMilliseconds = 1000;
    // static button link
    let staticButton = null;

    // Add custom CSS for the static button
    GM_addStyle(`
        #staticButton {
          position: absolute;
          top: 5px;
          left: 5px;
          z-index: 10000;
          background: #555;
          color: white;
          border: 2px solid transparent;
          border-radius: 5px;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        #staticButton:hover {
             background: #222;
             border-color:darkred;
        }
    `);

    // Create the simplest "static" button
    function createStaticButton() {
        let staticButton = document.createElement('button');
        staticButton.id = 'staticButton';
        staticButton.textContent = 'Duplicate';
        staticButton.style.display = 'none'; // Initially hidden
        document.body.appendChild(staticButton);

        staticButton.addEventListener('click', function() {
            var targetButton = shadowQuery(dupShadowQuery);
            if (targetButton)
            {
                var numberOfClicks = prompt("How many times would you like to click the 'Duplicate' button?");
                for (let i = 0; i < numberOfClicks; i++) {
                    setTimeout(() => targetButton.click(), i * delayInMilliseconds); // Waits between each click
                }
            }
            else {
                this.style.display = 'none';
            }
        });


        return staticButton;
    }

    // query with >>> for go through shadow nodes
    // thanks https://www.abeautifulsite.net/posts/querying-through-shadow-roots/ for the function
    function shadowQuery(selector, rootNode = document) {
        const selectors = String(selector).split('>>>');
        let currentNode = rootNode;

        for (let i = 0; i < selectors.length; i++) {
            if (i === 0) {
                currentNode = rootNode.querySelector(selectors[i]);
            } else if (currentNode instanceof Element && currentNode.shadowRoot) {
                currentNode = currentNode.shadowRoot.querySelector(selectors[i]);
            }

            if (currentNode === null) {
                break;
            }
        }
        return currentNode !== rootNode ? currentNode : null;
    }

    function checkButton() {
        var targetButton = shadowQuery(dupShadowQuery);
        if (targetButton) {
            if (staticButton && staticButton.style)
            {
                console.log("Duplicate button exists. Show custom button");
                staticButton.style.display = 'block';
            }
        }
        else{
            if (staticButton && staticButton.style){
                console.log("No Duplicate button. Hiding custom button");
                staticButton.style.display = 'none';
            }
        }

    }


    // Observe the page for changes and add the button
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length || mutation.removedNodes.length) {
                checkButton();
            }
        });
    });

    staticButton = createStaticButton();

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check
    checkButton();
})();
