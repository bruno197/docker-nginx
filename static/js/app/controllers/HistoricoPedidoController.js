(function() {

    angular.module('Alelo')
        .controller('HistoricoPedidoController', ['$q', '$window', 'ApiService', 'UtilsService', '$filter', '$log', HistoricoPedidoController]);

    function HistoricoPedidoController($q, $window, ApiService, UtilsService, $filter, $log) {
        var vm = this;
        init();

        function init() {
            vm.default = ApiService.getAllBurgers();
            vm.dadosBD = null;
            vm.errors = [];
            vm.showResultado = false;
            vm.nrPedido = "";
            vm.nrCpf = "";
            vm.nrContrato = "";
            vm.nrCnpj = "";
        }

        function errorCallback(error) {
            $log.error('Error Message: ' + error.mensagem);
        }

        function bdSuccess(data) {
            if(data.saida.objeto) {
                if(data.saida.objeto.length === 0) {
                    addError("Nenhum resultado encontrado. Por favor, confira os dados digitados e tente novamente.");
                    vm.dadosBD = null;
                    vm.showResultado = false;
                }else{
                    vm.dadosBD = data;
                    vm.showResultado = true;
                }
            }else if(data.saida.status != 'OK') {
                addError("Falha inesperada");
                vm.dadosBD = null;
                vm.showResultado = false;
            } else {
                vm.dadosBD = data;
                vm.showResultado = true;
            }
        }

        function addError(message) {
            vm.errors.push(message);
        }

        function diffBetweenDates(dataInicial, dataFinal) {
            var date1 = UtilsService.stringToDate(dataInicial);
            var date2 = UtilsService.stringToDate(dataFinal);
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            return Math.ceil(timeDiff / (1000 * 3600 * 24));
        }

        function compareDates(date1, date2){

            var int_date1 = parseInt(date1.split("/")[2].toString() + date1.split("/")[1].toString() + date1.split("/")[0].toString());
            var int_date2 = parseInt(date2.split("/")[2].toString() + date2.split("/")[1].toString() + date2.split("/")[0].toString());

            if (int_date1 > int_date2) {
               return true;
            }
            return false;
        }

        vm.consultaHistoricoPedido = function() {
            $log.debug("Inicio Histórico de Pedido");
            vm.showResultado = false;
            vm.errors = [];

            if(!$("#formHistoricoPedido").valid()) {
                return false;
            }

            if(diffBetweenDates(vm.dtInicial, vm.dtFinal) > 90) {
                addError("A diferença entre a data inicial e data final deve ser no máximo 90 dias.")
                return false;
            }

            if (compareDates(vm.dtInicial, vm.dtFinal)){
                addError("Data final da pesquisa é menor que a data inicial");
                return false;
            }

            $window.showProcessBar();

            var promises = [
               HistoricoPedidoService.getHistoricoPedido(vm.nrCnpj, vm.dtInicial, vm.dtFinal, vm.nrContrato, vm.nrPedido, vm.nrCpf)
               .then(bdSuccess)
               .catch(errorCallback),
            ];


            $q.all(promises)
               .then(function () {

                  vm.errors.push(UtilsService.consolidatedMessage());

               }).finally(function(){
                 $window.hideProcessBar();
               });
            $log.debug("Fim Histórico de Pedido");
        };

        vm.imprimirTabela = function () {
            var a = document.getElementById('printing-css').value;
            var b = document.getElementById('print-area-2').innerHTML;
            window.frames["print_frame"].document.title = document.title;
            window.frames["print_frame"].document.body.innerHTML = '<style>' + a + '</style>' + b;
            window.frames["print_frame"].window.focus();
            window.frames["print_frame"].window.print();
        }

        vm.imprimirPDF = function() {
            var docDefinition = {
                pageOrientation:"landscape",
                pageSize: 'A4',
                pageMargins: [40, 100, 40, 40],
                header: {
                    margin: 20,
                    columns: [
                        {
                            image: 'data:image/png;base64,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',
                            width: 100
                        },
                        {
                            text: 'Relatório de pedidos ' + $filter('date')(new Date(), "dd/MM/yyyy"),
                            style: 'header'
                        }
                    ]
                },
                content: [
                    {
                	    stack: [
                		    table(vm.dadosBD.saida.objeto, ['Data do Pedido', 'Nome do Cliente',
                		    'Número do Contrato', 'Número do Pedido WEB', 'Nome do Produto', 'Qtde Beneficíarios',
                		    'Valor Total do Pedido', 'Data de Disponibilização', 'Status do Pedido'])
                		]
                	}
                ],
                footer: function(currentPage, pageCount) {
                    return [
                        {
                            text: currentPage.toString() + ' de ' + pageCount,
                            alignment: 'right',
                            margin: [0, 0, 20, 0]
                        }
                    ]
                },
                styles: {
                	header: {
                		fontSize: 18,
                		bold: true,
                		alignment: 'right',
                	    margin: [10, 10, 10, 10]
                    }
                }
            };
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
				//Para IE, somente o download é suportado
               pdfMake.createPdf(docDefinition).download();
            } else {
               pdfMake.createPdf(docDefinition).open();
            }
        }

        function formatValue(index, value) {
            switch (index) {
                case 1:
                case 10:
                    return $filter('dateUTC')(value, 'dd/MM/yyyy');
                    break;
                case 3:
                    return $filter('cnpj')(value);
                    break;
                case 9:
                    return $filter('currency')(value, 'R$', 2)
                    break;
                default:
                    return value;
                    break;
            }
        }

        function buildTableBody(data, columnsName) {
            var body = [];
            var columnsPrint = [1, 2, 4, 6, 7, 8, 9, 10, 12];

            body.push(columnsName);

            data.forEach(function(element, indexRow, array) {
                var dataRow = [];
                var row = array[indexRow];
                columnsPrint.forEach(function(element, indexColumn, column) {
                    dataRow.push(formatValue(column[indexColumn], row[column[indexColumn]]));
                })

                body.push(dataRow);
            });

            return body;
        }

        function table(data, columns) {
            return {
                table: {
                    headerRows: 1,
                    body: buildTableBody(data, columns)
                }
            };
        }
    }
}());