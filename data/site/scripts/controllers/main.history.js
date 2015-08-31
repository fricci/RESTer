'use strict';

angular.module('app')
    .controller('HistoryCtrl', ['$scope', '$state', '$data', function ($scope, $state, $data) {
        
        $state.current.data = {
            title: 'History'
        };

        $scope.initialCount = 50;
        $scope.historyEntries = [];

        $data.getHistoryEntries(-$scope.initialCount).then(entries => {
            $scope.historyEntries = entries;
        });

        $scope.loadAll = function () {
            $data.getHistoryEntries().then(entries => {
                $scope.historyEntries = entries;
            });
        };

        $scope.openHistoryEntry = function (entry) {
            $state.go('main.request.existing.history', {
                id: entry.request.id,
                historyId: entry.id
            });
        };
        
        $scope.deleteHistoryEntry = function (entry) {
            $data.deleteHistoryEntry(entry).then(() => {
                var index = $scope.historyEntries.indexOf(entry);
                $scope.historyEntries.splice(index, 1);
            });
        };

    }]);
