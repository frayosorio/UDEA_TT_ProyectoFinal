app.controller('ControladorRadiacionSolar', function ($scope, $http, ServicioConsultas) {

    $scope.ciudades = [];
    $scope.radiacion = null;
    $scope.grafico = null;
    $scope.desde = new Date();
    $scope.hasta = new Date();
    $scope.desde.setDate($scope.hasta.getDate() - 30);


    $http.get('./datos/CoordenadasColombia.json')
        .then(function (respuesta) {
            $scope.ciudades = respuesta.data;
        })
        .catch(function (error) {
            console.error("Error al cargar las ciudades:", error);
        });

    function formatearFecha(fecha) {
        const year = fecha.getFullYear();
        const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const day = fecha.getDate().toString().padStart(2, '0');
        return `${year}${month}${day}`;
    }

    $scope.consultarRadiacion = function (ciudad) {

        const inicio = formatearFecha($scope.desde);
        const fin = formatearFecha($scope.hasta);
        ServicioConsultas.consultarRadiacion(ciudad.lat,
            ciudad.lon, inicio, fin
        ).then(function (resultado) {
            $scope.radiacion = resultado.data.properties.parameter.ALLSKY_SFC_SW_DWN;

            $scope.actualizarGrafica();
        }
        );

    }

    $scope.actualizarGrafica = function () {
        const canvas = document.getElementById("grafico");
        
    }
});