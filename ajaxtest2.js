let ajaxImpl = (str) => {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let tableBody = document.getElementById("tableBody");
            tableBody.innerHTML = ""; // Clear existing rows

            try {
                let jsonObj = JSON.parse(this.responseText);

                if (jsonObj.length === 0) {
                    // No data found
                    let row = document.createElement("tr");
                    row.setAttribute("id", "tri");
                    let column = document.createElement("td");
                    column.setAttribute("colspan", "7");
                    column.innerHTML = "<h3>There is no data in database</h3>";
                    row.appendChild(column);
                    tableBody.appendChild(row);
                } else {
                    // Populate table
                    jsonObj.forEach((item, index) => {
                        let row = document.createElement("tr");

                        row.innerHTML = `
                            <td>${index + 1}</td>
                            <td>${item.name}</td>
                            <td>${item.email}</td>
                            <td>${item.contact}</td>
                            <td>${item.courseid}</td>
                            <td>
                                <a href="/deletestudbyid?sid=${item.sid}" class="btn btn-danger" title="Delete Student">
                                    <i class="fas fa-trash"></i> Delete
                                </a>
                            </td>
                            <td>
                                <a href="/updatestudbyid?sid=${item.sid}" class="btn btn-primary" title="Update Student">
                                    <i class="fas fa-edit"></i> Update
                                </a>
                            </td>
                        `;

                        tableBody.appendChild(row);
                    });
                }
            } catch (e) {
                console.error("Error parsing JSON:", e);
            }
        }
    };

    xhttp.open("GET", "/searchstudent?sd=" + encodeURIComponent(str), true);

    xhttp.send();
};
