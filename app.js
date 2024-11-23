const addRecordForm = document.querySelector(".add_record");
const addRecordTableBody = document.querySelector(".add_record_table_body");
const addRecordDateInput = document.querySelector(".add_record_date_input");
addRecordDateInput.min = new Date().toISOString().split("T")[0];

const records =[
   
]
const generateId = () => {
    return Number(Math.random().toString().split(".")[1])
}

const render = () => {
    addRecordTableBody.innerHTML = records.map(record => {
        return `<tr id="${record.id}">
            <td>${record.date}</td>
            <td>${record.name}(${record.phone})</td>
            <td>${record.type}</td>
            <td>
                ${record.status ? "Завершен" : "В процессе"}
                <button class="edit_button">Изменить</button>
                <button class="delete_button">Удалить</button>
            </td>
            
        </tr>`
    }).join("");
}

addRecordForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const addRecordData = new FormData(addRecordForm);

    
    // addRecordTableBody.innerHTML += `
    //     <tr>
    //         <td>${addRecordData.get("datetime")}</td>
    //         <td>${addRecordData.get("name")}(${addRecordData.get("phone")})</td>
    //         <td>${addRecordData.get("type")}</td>
    //         <td>В процессе <button>Изменить</button></td>
    //     </tr>
    // `;

    records.push({
        id: generateId(),
        date: addRecordData.get("datetime"),
        name: addRecordData.get("name"), 
        phone: addRecordData.get("phone"),
        type: addRecordData.get("type"),
        status: true
    });

    render();
    console.log(records);
});

