angular.module("appProyecto", [])
    .controller("controladorProyecto", function ($scope, $http) {

        $scope.ciudades = [];
        $scope.ciudadSeleccionada = null;
        $scope.desde = new Date();
        $scope.hasta = new Date();
        $scope.desde.setDate($scope.hasta.getDate() - 30);
        $scope.radiacion = null;

        $http.get("./datos/CoordenadasColombia.json")
            .then(function (respuesta) {
                $scope.ciudades = respuesta.data;
            })

        function formatearFecha(fecha) {
            const año = fecha.getFullYear();
            const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
            const dia = (fecha.getDate()).toString().padStart(2, "0");
            return `${año}${mes}${dia}`;
        }

        $scope.consultarRadiacion = function (ciudadSeleccionada) {
            if (!ciudadSeleccionada) {
                return;
            }
            const url = "https://power.larc.nasa.gov/api/temporal/daily/point";
            const parametros = {
                parameters: "ALLSKY_SFC_SW_DWN",
                start: formatearFecha($scope.desde),
                end: formatearFecha($scope.hasta),
                latitude: ciudadSeleccionada.lat,
                longitude: ciudadSeleccionada.lon,
                format: "JSON",
                community: "RE"
            }

            const consulta = Object.entries(parametros)
                .map(([clave, valor]) => `${clave}=${valor}`)
                .join("&");

            const urlDefinitiva = `${url}?${consulta}`;

            $http.get(urlDefinitiva)
                .then(function (respuesta) {
                    const datos = respuesta.data.properties.parameter.ALLSKY_SFC_SW_DWN;
                    $scope.radiacion = datos;
                });
        }
    });