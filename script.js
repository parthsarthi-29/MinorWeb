// Event Listener for File Input
document.getElementById('file-input').addEventListener('change', handleFileUpload, false);

// Handle File Upload and Parse the Excel File
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });

            // Read the first sheet
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convert sheet data to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Read as an array of rows

            // Call function to populate table with parsed data
            populateTable(jsonData);
        };
        reader.readAsBinaryString(file);
    }
}

// Populate the Table with Data
function populateTable(data) {
    const table = document.getElementById('data-table');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    // Clear previous table content
    thead.innerHTML = '';
    tbody.innerHTML = '';

    // Add column headers
    let headerRow = '<tr>';
    data[0].forEach((column, index) => {
        headerRow += `<th>${column}</th>`;  // Add header for each column
    });
    headerRow += '</tr>';
    thead.innerHTML = headerRow;

    // Add data rows
    data.slice(1).forEach((row) => {
        let rowHtml = '<tr>';
        row.forEach((cell) => {
            rowHtml += `<td>${cell}</td>`;  // Add each cell of the row
        });
        rowHtml += '</tr>';
        tbody.innerHTML += rowHtml;
    });
}
