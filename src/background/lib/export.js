(function () {
    'use strict';

    window.rester = window.rester || {};

    /**
     * Exports all data in the specified format.
     *
     * @param {Object} options
     * @param {String} options.format - Export format. One of: 'postman'.
     * @param {Boolean} options.includeHistory - If true, the export will
     * include the history entries. Otherwise it will only include saved
     * requests.
     */
    rester.export = async function (options) {
        const provider = rester.exportProviders[options.format];
        const data = await provider({
            includeHistory: options.includeHistory
        });
        const json = JSON.stringify(data, null, 4);
        const file = new File([json], 'rester-export-postman.json', {
            type: 'application/json'
        });
        const url = URL.createObjectURL(file);

        chrome.downloads.download({
            filename: file.name,
            saveAs: true,
            url: url
        });
    };

})();
