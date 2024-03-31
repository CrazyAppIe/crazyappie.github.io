document.getElementById("searchInput").addEventListener("input", handleSearch);

function handleSearch() {
    var searchTerm = document.getElementById("searchInput").value;
    searchCSV(searchTerm);
}


// Tabla principal

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

                    // Aquí modificamos el rowData para incluir solo las columnas requeridas
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

                // Agregar las filas al cuerpo de la tabla
                groupedRows[studentCode].forEach(rowData => {
                    var newRow = table.insertRow();
                    rowData.forEach((cellData, index) => {
                        var cell = newRow.insertCell();
                        cell.textContent = cellData;

                        // Si la celda es la de créditos, sumar al total
                        if (index === 3) {
                            totalCredits += parseInt(cellData);
                        }
                    });
                });

                // Crear fila de resumen
                var summaryRow = table.insertRow();
                summaryRow.className = 'subtotal-row'; // Clase a la fila de resumen
                var summaryCell = summaryRow.insertCell();
                summaryCell.colSpan = 3; // Celda resumen en la última columnas
                var descriptionCellText = table.rows[1].cells[0].textContent;
                summaryCell.textContent = 'Total de créditos | (' + descriptionCellText + ')';
                var creditsCell = summaryRow.insertCell();
                creditsCell.textContent = totalCredits;

                

                // Agregar la tabla al contenedor
                tableContainer.appendChild(table);

                // Agregar un espacio entre las tablas
                var space = document.createElement('div');
                space.className = 'table-space';
                tableContainer.appendChild(space); 

                //////////////////////////////////////////////



                //////////////////////////////////////////////

        }
        })
        .catch(error => console.error('Error fetching CSV:', error));
}

// Botón para mostrar más

toggleButton.addEventListener('click', function() {
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