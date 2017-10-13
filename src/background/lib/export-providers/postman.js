(function () {
    'use strict';

    window.rester = window.rester || {};
    rester.exportProviders = rester.exportProviders || {};

    rester.exportProviders.postman = async function () {
        const requests = await rester.data.requests.query();

        return {
            info: {
                name: 'RESTer',
                schema: 'https://schema.getpostman.com/json/collection/v2.1.0/'
            },
            item: createItems(requests)
        };
    };

    class Folder {
        constructor(name) {
            this.name = name;
            this.item = [];
        }
    }

    class Item {
        constructor(request) {
            this.id = String(request.id);
            this.name = request.title;
            this.request = {
                url: request.url,
                method: request.method,
                header: request.headers.map(header => ({
                    key: header.name,
                    value: header.value
                }))
            };

            if (request.body) {
                this.request.body = {
                    mode: 'raw',
                    raw: request.body
                };
            }
        }
    }

    function createItems(requests) {
        const rootFolder = new Folder();

        function ensureFolder(path) {
            let currentFolder = rootFolder;
            const segments = path.split(/\s*\/\s*/i);
            for (const segment of segments) {
                let folder = currentFolder.item.find(item => item.name === segment);
                if (!folder) {
                    folder = new Folder(segment);
                    currentFolder.item.push(folder);
                }

                currentFolder = folder;
            }

            return currentFolder;
        }

        for (const request of requests) {
            const folder = ensureFolder(request.collection);
            const item = new Item(request);

            folder.item.push(item);
        }

        return rootFolder.item;
    }

})();
