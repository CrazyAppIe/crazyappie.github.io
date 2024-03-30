document.getElementById("searchInput").addEventListener("input", handleSearch);

function handleSearch() {
    var searchTerm = document.getElementById("searchInput").value;
    searchCSV(searchTerm);
}

function searchCSV(searchTerm) {
    fetch('Csv_test .csv')
        .then(response => response.text())
        .then(data => {
            var rows = data.trim().split('\n');
            var tableContainer = document.getElementById('tableContainer');
            tableContainer.innerHTML = '';

            var groupedRows = {};

            // CSV
            for (var i = 1; i < rows.length; i++) {
                var rowData = rows[i].split(',');

                // Código de estudiante comparado con el recuadro
                if (rowData[0] === searchTerm) {
                    // División de la tabla por la columna 2 (Código de evento)
                    var studentCode = rowData[2];

                    // Mostrar (nada) si el código de estudiante no existe
                    if (!groupedRows[studentCode]) {
                        groupedRows[studentCode] = [];
                    }

                    // Agrupación
                    groupedRows[studentCode].push(rowData);
                }
            }

            // Crear una tabla para cada grupo de estudiantes y agregarla al contenedor
            for (var studentCode in groupedRows) {
                var table = document.createElement('table');
                table.id = 'dataTable'; // Asignar un ID único para cada tabla
                table.className = 'dataTable';

                // Encabezado de la tabla
                var headerRow = table.insertRow();
                var headers = ["CÓDIGO DEL ESTUDIANTE", "CÓDIGO DE EVENTO", "TIPO", "TIPO DE EVENTO", "NOMBRE", "CRÉDITOS"];
                headers.forEach(header => {
                    var th = document.createElement('th');
                    th.textContent = header;
                    headerRow.appendChild(th);
                });

                // Suma de créditos para la fila de resumen
                var totalCredits = 0;

                // Agregar las filas al cuerpo de la tabla
                groupedRows[studentCode].forEach(rowData => {
                    var newRow = table.insertRow();
                    rowData.forEach((cellData, index) => {
                        var cell = newRow.insertCell();
                        cell.textContent = cellData;

                        // Si la celda es la de créditos, sumar al total
                        if (index === 5) {
                            totalCredits += parseInt(cellData);
                        }
                    });
                });

                // Crear fila de resumen
                var summaryRow = table.insertRow();
                summaryRow.className = 'subtotal-row'; // Clase a la fila de resumen
                var summaryCell = summaryRow.insertCell();
                summaryCell.colSpan = 5; // Celda resumen en la última columna (5)
                summaryCell.textContent = 'Total de créditos';
                var creditsCell = summaryRow.insertCell();
                creditsCell.textContent = totalCredits;

                // Agregar la tabla al contenedor
                tableContainer.appendChild(table);

                // Agregar un espacio entre las tablas
                var space = document.createElement('div');
                space.className = 'table-space';
                tableContainer.appendChild(space);
            }
        })
        .catch(error => console.error('Error fetching CSV:', error));
}
