// Función para manejar la búsqueda
function handleSearch() {
    var searchTerm = document.getElementById("searchInput").value;
    searchCSV(searchTerm);
}

// Función para buscar en el CSV y generar las tablas
function searchCSV(searchTerm) {
    fetch('Csv_test.csv')
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
                    // División de la tabla por la columna 2 (Tipo de evento)
                    var studentCode = rowData[2];

                    // Mostrar (nada) si el código no existe
                    if (!groupedRows[studentCode]) {
                        groupedRows[studentCode] = [];
                    }

                    // Filtrado de columnas
                    var modifiedRowData = [rowData[2], rowData[3], rowData[4], rowData[5]];

                    // Agrupación
                    groupedRows[studentCode].push(modifiedRowData);
                }
            }

            // Crear una tabla para cada grupo de estudiantes y agregarla al contenedor
            for (var studentCode in groupedRows) {
                var table = document.createElement('table');
                table.id = 'dataTable'; // Id tabla Html
                table.className = 'dataTable';

                // Encabezado de la tabla
                var headerRow = table.insertRow();
                var headers = ["Tipo de actividad", "Tipo de crédito", "Nombre de evento", "Créditos"]; // Solo los encabezados requeridos
                headers.forEach(header => {
                    var th = document.createElement('th');
                    th.textContent = header;
                    headerRow.appendChild(th);
                });

                // Suma de créditos para la fila de resumen
                var totalCredits = 0;

                // Agregar las filas al cuerpo de la tabla y calcular total de créditos
                groupedRows[studentCode].forEach(rowData => {
                    var newRow = table.insertRow();
                    rowData.forEach((cellData, index) => {
                        var cell = newRow.insertCell();
                        cell.textContent = cellData;

                        // Sumatoria de créditos
                        if (index === 3) {
                            totalCredits += parseInt(cellData);
                        }
                    });
                });

                // Crear fila de resumen
                var summaryRow = table.insertRow();
                summaryRow.className = 'subtotal-row';
                var summaryCell = summaryRow.insertCell();
                summaryCell.colSpan = 3; // Celda resumen en la última columna
                var descriptionCellText = groupedRows[studentCode][0][0]; // Nombre de fila resumen
                summaryCell.textContent = 'Total de créditos | (' + descriptionCellText + ')';
                var creditsCell = summaryRow.insertCell();
                creditsCell.textContent = totalCredits;

                // Agregar la tabla al contenedor
                tableContainer.appendChild(table);

                // Agregar un espacio entre las tablas
                var space = document.createElement('div');
                space.className = 'table-space';
                tableContainer.appendChild(space);

                //////////////////////////////////////////////////////////

                // Mostrar el resultado encima del botón
                var existingResultElement = document.getElementById('result');
                if (existingResultElement) {
                    existingResultElement.parentNode.removeChild(existingResultElement);
                }

                var resultMessage = ''; // Variable para acumular el mensaje

                for (var studentCode in groupedRows) {
                    // Aquí colocas tu código existente para procesar cada fila y acumular el mensaje
                    // Por ejemplo:
                    resultMessage += groupedRows[studentCode][0][0] + ' = ' + totalCredits + '<br>';
                }

                // Crear un nuevo elemento de resultado y agregar el mensaje acumulado
                var resultElement = document.createElement('div');
                resultElement.id = 'result';
                resultElement.innerHTML = resultMessage;

                // Insertar el elemento de resultado encima del botón
                var buttonElement = document.getElementById('toggleButton');
                buttonElement.parentNode.insertBefore(resultElement, buttonElement);

                // Escuchar cambios en el campo de búsqueda
                document.getElementById("searchInput").addEventListener("input", function() {
                    var searchTerm = this.value.trim(); // Obtener el valor del campo de búsqueda y eliminar espacios en blanco al principio y al final
                    if (searchTerm.length !== 12) {
                        // Si el campo de búsqueda no tiene una longitud de 11 caracteres, eliminar el mensaje
                        var existingResultElement = document.getElementById('result');
                        if (existingResultElement) {
                            existingResultElement.parentNode.removeChild(existingResultElement);
                        }
                    } else {
                        // Si el campo de búsqueda tiene una longitud de 11 caracteres, manejar la búsqueda como lo hacías antes
                        handleSearch();
                    }
                });


                //////////////////////////////////////////////////////////
            }
        })
        .catch(error => console.error('Error fetching CSV:', error));
}


// Escuchar cambios en el campo de búsqueda
document.getElementById("searchInput").addEventListener("input", handleSearch);

// Botón para mostrar más
toggleButton.addEventListener('click', function() {
    var tableContainer = document.getElementById('tableContainer');
    // Cambiar la visibilidad de la tabla
    if (tableContainer.style.display === 'none') {
        // Si la tabla está oculta, mostrarla
        tableContainer.style.display = 'block';
        toggleButton.textContent = 'Ocultar';
    } else {
        // Si la tabla está visible, ocultarla
        tableContainer.style.display = 'none';
        toggleButton.textContent = 'Detalles';
    }
});
