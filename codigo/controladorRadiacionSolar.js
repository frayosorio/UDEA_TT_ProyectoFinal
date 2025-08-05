app.controller('ControladorRadiacionSolar', function ($scope, $http) {

    $scope.ciudades = [];
    $scope.radiacion = null;
    $scope.grafico = null;
    $scope.fechaInicio = new Date(2024, 0, 1); // Enero es 0
    $scope.fechaFin = new Date(2024, 11, 31);  // Diciembre es 11

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
});