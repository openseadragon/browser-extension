/*
 * Copyright (C) 2015 OpenSeadragon contributors
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * - Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 *
 * - Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * - Neither the name of OpenSeadragon nor the names of its contributors
 *   may be used to endorse or promote products derived from this software
 *   without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 * Copyright 2017-2024 OpenSeadragon contributors
 *
 * Updated 2025
 * Script is adapted for Chrome Manifest V3.
 * Context menu creation is now performed during extension installation
 * to avoid duplication each time the service worker wakes up.
 * The `onClicked` event listener is persistent.
 */

'use strict';

const CONTEXT_MENU_ID = "openseadragon-image";

// La fonction de rappel pour l'événement onClicked.
function onClickHandler(info, tab) {
    // Vérifie que le clic provient bien de notre élément de menu.
    if (info.menuItemId === CONTEXT_MENU_ID) {
        // Construit l'URL de la page de visualisation avec l'URL de l'image en paramètre.
        const viewerUrl = chrome.runtime.getURL('common/index.html?img=' + encodeURIComponent(info.srcUrl));
        
        // Ouvre la page de visualisation dans un nouvel onglet.
        chrome.tabs.create({
            url: viewerUrl
        });
    }
}

// Ajoute un écouteur d'événements pour les clics sur le menu contextuel.
// C'est la méthode requise dans Manifest V3.
chrome.contextMenus.onClicked.addListener(onClickHandler);

// Met en place l'élément du menu contextuel lors de l'installation de l'extension.
// L'événement `onInstalled` est le bon endroit pour initialiser des éléments persistants.
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: CONTEXT_MENU_ID,
        title: "Ouvrir dans OpenSeadragon", // Titre affiché dans le menu contextuel
        contexts: ["image"] // Le menu n'apparaîtra que lors d'un clic droit sur une image
    });
});
