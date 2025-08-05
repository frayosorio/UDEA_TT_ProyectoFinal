app.controller('ControladorRadiacionSolar', function ($scope, $http, ServicioConsultas) {

    $scope.ciudades = [];
    $scope.radiacion = null;
    $scope.grafico = null;
    $scope.desde = new Date();
    $scope.hasta = new Date();
    $scope.desde.setDate($scope.hasta.getDate() - 30);
    $scope.ciudadSeleccionada = null;

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

    //activar actualizacion cuando cambie fechas
    $scope.$watchGroup(['desde', 'hasta'], function (newValues, oldValues) {
        if ($scope.ciudadSeleccionada && $scope.desde && $scope.hasta) {
            $scope.consultarRadiacion($scope.ciudadSeleccionada);
        }
    });

    $scope.consultarRadiacion = function (ciudad) {
        $scope.ciudadSeleccionada = ciudad;
        const inicio = formatearFecha($scope.desde);
        const fin = formatearFecha($scope.hasta);
        ServicioConsultas.consultarRadiacion(ciudad.lat,
            ciudad.lon, inicio, fin
        ).then(function (resultado) {
            datos = resultado.data.properties.parameter.ALLSKY_SFC_SW_DWN;
            $scope.radiacion = datos;
            const x = Object.keys(datos);
            const y = Object.values(datos);
            $scope.actualizarGrafica(x, y);
        }
        );

    }

    $scope.actualizarGrafica = function (x, y) {
        const canvas = document.getElementById("grafico");
        const ctx = canvas.getContext("2d");

        if ($scope.grafico) $scope.grafico.destroy();

        $scope.grafico = new Chart(ctx, {
            type: "line",
            data: {
                labels: x,
                datasets: [{
                    label: "Radiación solar(kWh/m²)",
                    data: y
                }
                ]
            }
        });
    }
});