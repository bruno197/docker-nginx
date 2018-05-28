(function() {

    var app = angular.module('Burger', ['ui.mask']);

    app.filter('meioPagamento', function(){
        return function(input) {
            switch (input) {
                case 1:
                    return "Boleto Bancario";
                    break;
                case 2:
                    return "Boleto Web";
                    break;
                case 3:
                    return "Débido em conta";
                    break;
                case 4:
                    return "Crédito em conta";
                    break;
                case 5:
                    return "Cartão de crédito";
                    break;
                case 0:
                    return "";
                    break;
            }
        };
    });

}());
