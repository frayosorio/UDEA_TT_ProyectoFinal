app.service("ServicioConsultas", ["$http",
    function ($http) {
        this.consultarRadiacion = function (latitud, longitud, desde, hasta) {
            const baseUrl = 'https://power.larc.nasa.gov/api/temporal/daily/point';
            const params = {
                parameters: 'ALLSKY_SFC_SW_DWN',
                start: desde,
                end: hasta,
                latitude: latitud,
                longitude: longitud,
                format: 'JSON',
                community: 'RE' // Energías renovables
            };

            const queryString = Object.entries(params)
                .map(([clave, valor]) => `${clave}=${valor}`)
                .join('&');

            const url = `${baseUrl}?${queryString}`;
            return $http({ method: 'GET', url: url });
        }
    }
]);