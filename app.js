const addRecordForm = document.querySelector(".add_record");
const addRecordTableBody = document.querySelector(".add_record_table_body");
const addRecordDateInput = document.querySelector(".add_record_date_input");
const addRecordId = document.querySelector(".add_record_id");
const statusWrapper = document.querySelector(".status_wrapper");
addRecordDateInput.min = new Date().toISOString().split("T")[0];

let records = [
   
];


const generateId = () => {
    return Number(Math.random().toString().split(".")[1])
}

const render = () => {
    addRecordTableBody.innerHTML = records.map(record => {
        return `<tr class="record_item" id="${record.id}">
            <td>${record.date}</td>
            <td>${record.name}(${record.phone})</td>
            <td>${record.type === "manicure"? "Маникюр" : "Педикюр"}</td>
            <td>
                ${record.status ? "Завершен" : "В процессе"}
                <button class="edit_button" >Изменить</button>
                <button class="delete_button" >Удалить</button>
            </td>
            
        </tr>`
    }).join("");

    const recordItems = document.querySelectorAll(".record_item");
    
    recordItems.forEach(item => {
        item.addEventListener("click", (e) => editDeleteItem(e, item.id));
    });
}

const editDeleteItem = (e, id) => {
    if(e.target.classList.contains("edit_button")){
        const currentItem = records.find(item => item.id === Number(id));
        
        statusWrapper.style.display = "block";
        addRecordForm[0].value = currentItem.date;
        addRecordForm[1].value = currentItem.type;
        addRecordForm[2].value = currentItem.name;
        addRecordForm[3].value = currentItem.phone;
        addRecordForm[4].value = currentItem.status;
        addRecordForm[5].innerHTML = "Изменить";
        addRecordId.innerHTML = id;
        document.querySelectorAll(".delete_button").forEach(button => button.disabled = true);
    }

    if(e.target.classList.contains("delete_button")){
        records = records.filter(item => item.id !== Number(id));

        render();
    }
}

addRecordForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if(e.target[5].innerHTML === "Изменить"){
        const addRecordData = new FormData(addRecordForm);
        const id = addRecordId.innerHTML;
        
        records = records.map(item => {
            if(item.id === Number(id)){
                return {
                    id: Number(id),
                    date: addRecordData.get("datetime"),
                    name: addRecordData.get("name"),
                    phone: addRecordData.get("phone"),
                    type: addRecordData.get("type"),
                    status: JSON.parse(addRecordData.get("status"))
                }
            }
            return item;
        });
       
        e.target[5].innerHTML = "Добавить запись";
        addRecordId.innerText = "";
        statusWrapper.style.display = "none";
        render();
        return;
    }
    if(e.target[5].innerHTML === "Добавить запись"){
        const addRecordData = new FormData(addRecordForm);
        records.push({
            id: generateId(),
            date: addRecordData.get("datetime"),
            name: addRecordData.get("name"),
            phone: addRecordData.get("phone"),
            type: addRecordData.get("type"),
            status: false
        });

        render();
    }
});

