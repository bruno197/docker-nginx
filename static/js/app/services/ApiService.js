(function () {

    angular.module('Alelo')
        .factory('ParameterService', ['$q', '$http', 'UtilsService', ParameterService]);

    function ParameterService($q, $http, UtilsService) {

        var parameters = [];
        var chave = 'GRL';

        return {
            getAllParameters: getAllParameters,
            getParameterByChave: getParameterByChave
        };

        function getAllBurger() {
            $.get( "ajax/test.html", function( data ) {
                return data;
            });
        }
        
        function getParameterByChave(parameters, chave) {
            return parameters.filter(function (parametro) {
                return parametro.chave === chave;
            })[0];
        }

        function sendResponseData(response) {
            return response.data;
        }

        function sendGetParametersError(response) {
            return $q.reject(UtilsService.messages.ERRO_SERVICO_BD);
        }

    }

}());