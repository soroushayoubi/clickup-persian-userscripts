
// ==UserScript==
// @name         ClickUp Dynamic RTL/LTR based on Input
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  فعال کردن فونت فارسی و راست‌چین خودکار در ClickUp
// @author       soroushayoubi
// @match        https://app.clickup.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const fontLink = document.createElement('link');
    fontLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/vazir-font/26.0.0/font-face.css';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    const style = document.createElement('style');
    style.innerHTML = `
        body, * {
            unicode-bidi: plaintext;
            text-align: start;
            font-family: Vazirmatn, -apple-system, BlinkMacSystemFont, "Segoe UI", roboto, "Helvetica Neue", helvetica, arial, sans-serif !important;
        }
    `;
    document.head.appendChild(style);

    function isFirstCharPersian(text) {
        const firstChar = text.trim().charAt(0);
        const persianRegex = /[\u0600-\u06FF]/;
        return persianRegex.test(firstChar);
    }

    function watchEditors() {
        const observer = new MutationObserver(() => {
            const editors = document.querySelectorAll('.cu-task-description [contenteditable="true"], .ql-editor, textarea, input[type="text"]');
            editors.forEach(editor => {
                if (!editor.hasAttribute('data-rtl-listener')) {
                    editor.addEventListener('input', (e) => {
                        const value = e.target.innerText || e.target.value;
                        if (value.trim().length === 0) return;
                        if (isFirstCharPersian(value)) {
                            e.target.style.direction = 'rtl';
                            e.target.style.textAlign = 'right';
                        } else {
                            e.target.style.direction = 'ltr';
                            e.target.style.textAlign = 'left';
                        }
                    });
                    editor.setAttribute('data-rtl-listener', 'true');
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    watchEditors();

})();
