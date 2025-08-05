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

        this.calcularPanelesNecesarios = function (consumoTotalKWh, promedioRadiacionDiaria) {
            // Suponiendo panel de 0.3 kWh/día, eficiencia del sistema del 80%
            const kWhPorPanel = promedioRadiacionDiaria * 0.8;
            const paneles = Math.ceil(consumoTotalKWh / kWhPorPanel);
            return paneles;
        }
    }
]);