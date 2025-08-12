let ajaxImpl = (str) => {
    let xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let tableBody = document.getElementById("tblBody");
            tableBody.innerHTML = "";  // Ensure the table body is cleared before populating it with new rows

            try {
                let responseData = this.responseText;
                let jsonObj = JSON.parse(responseData);

                if (jsonObj.length === 0) {
                    // No data found, show a message
                    let row = document.createElement("tr");
                    let column = document.createElement("td");
                    column.setAttribute("colspan", "4");
                    column.innerHTML = "<h3>There is no data in the database</h3>";
                    row.appendChild(column);
                    tableBody.appendChild(row);
                } else {
                    // Populate table with filtered data
                    jsonObj.forEach((item, index) => {
                        let row = document.createElement("tr");

                        // Index column
                        let column = document.createElement("td");
                        column.innerHTML = "" + (index + 1);
                        row.appendChild(column);

                        // Course Name column
                        column = document.createElement("td");
                        column.innerHTML = item.name;
                        row.appendChild(column);

                        // Delete Course column
                        column = document.createElement("td");
                        column.innerHTML = `<a href="/deletecoursebyid?courseid=${item.courseid}" class="btn btn-danger btn-sm" title="Delete Course">
                            <i class="fas fa-trash-alt"></i> Delete</a>`;
                        row.appendChild(column);

                        // Update Course column
                        column = document.createElement("td");
                        column.innerHTML = `<a href="/updatecoursebyid?courseid=${item.courseid}" class="btn btn-primary btn-sm" title="Update Course">
                            <i class="fas fa-edit"></i> Update</a>`;
                        row.appendChild(column);

                        tableBody.appendChild(row);
                    });
                }
            } catch (e) {
                console.error("Error parsing response data:", e);
            }
        }
    };

    // Send the request to the server
    xhttp.open("GET", "/search?sd=" + encodeURIComponent(str), true); // URL-encode the search term
    xhttp.send();

};