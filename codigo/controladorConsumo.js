app.controller('ControladorConsumo', function ($scope, $http, ServicioConsultas) {

    $scope.ciudades = [];
    $scope.ciudadSeleccionada = null;
    $scope.resultado = null;
    $scope.consumoMensual = 0;
    $scope.fechaInicio = new Date();
    $scope.fechaFin = new Date();
    $scope.fechaInicio.setDate($scope.fechaFin.getDate() - 30);

    function formatearFecha(fecha) {
        const year = fecha.getFullYear();
        const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const day = fecha.getDate().toString().padStart(2, '0');
        return `${year}${month}${day}`;
    }

    $http.get('./datos/CoordenadasColombia.json')
        .then(function (respuesta) {
            $scope.ciudades = respuesta.data;
        })
        .catch(function (error) {
            console.error("Error al cargar las ciudades:", error);
        });


    $scope.calcularEquivalencia = function () {
        const inicio = formatearFecha($scope.fechaInicio);
        const fin = formatearFecha($scope.fechaFin);
        ServicioConsultas.consultarRadiacion($scope.ciudadSeleccionada.lat,
            $scope.ciudadSeleccionada.lon, inicio, fin
        ).then(function (resultado) {
            datos = resultado.data.properties.parameter.ALLSKY_SFC_SW_DWN;

            radiaciones = Object.values(datos);

            const promedioRadiacion = radiaciones.reduce((suma, item) => suma + item, 0) / radiaciones.length;

            const consumoTotalKWh = $scope.consumoMensual / 30 * radiaciones.length;
            const panelesRequeridos = ServicioConsultas.calcularPanelesNecesarios(consumoTotalKWh, promedioRadiacion);
            $scope.resultado = {
                panelesRequeridos: panelesRequeridos,
                promedioRadiacion: promedioRadiacion,
            };
        });
    }
});