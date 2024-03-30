function handleSearch() {
    var searchTerm = document.getElementById("searchInput").value;
    console.log("Search term entered:", searchTerm);
    searchCSV(searchTerm);
}

function searchCSV(searchTerm) {
    fetch('Csv_test .csv')
        .then(response => response.text())
        .then(data => {
            var rows = data.trim().split('\n');
            var table = document.getElementById('dataTable');
            table.innerHTML = '';

            // Add table headers
            var headers = rows[0].split(',');
            var headerRow = table.insertRow();
            headers.forEach(header => {
                var th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });

            // Search and display matching rows
            for (var i = 1; i < rows.length; i++) {
                var rowData = rows[i].split(',');
                if (rowData[0] === searchTerm) { // Check if the first column matches the search term
                    var newRow = table.insertRow();
                    rowData.forEach(cellData => {
                        var cell = newRow.insertCell();
                        cell.textContent = cellData;
                    });
                }
            }
        })
        .catch(error => console.error('Error fetching CSV:', error));
}
