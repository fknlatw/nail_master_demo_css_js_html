const addRecordForm = document.querySelector(".add_record");
const searchForm = document.querySelector(".search_form");
const addRecordTableBody = document.querySelector(".add_record_table_body");
const addRecordDateInput = document.querySelector(".add_record_date_input");
const addRecordId = document.querySelector(".add_record_id");
const statusWrapper = document.querySelector(".status_wrapper");
const filters = document.querySelector(".filters");
const filtersToggleButton = document.querySelector(".filters_toggle_button");
const filtersCloseButton = document.querySelector(".filters_close_button");
const filtersTime = document.getElementById("filtersTime");
const filtersDate = document.querySelector(".filters input[type=date]")
const year = document.querySelector(".year");

year.innerHTML = `${new Date().getFullYear()}г.`;
filtersDate.value = new Date().toISOString().split("T")[0];
let records = JSON.parse(localStorage.getItem("records")) || [];

addRecordDateInput.value = new Date().toISOString().split("T")[0] + "T12:00";
addRecordDateInput.addEventListener("change", () => {
    addRecordDateInput.value =`${addRecordDateInput.value.split("T")[0]}T${addRecordDateInput.value.split("T")[1].split(":")[0]}:00`;
});

filtersToggleButton.addEventListener("click", () => {
    filters.classList.add("filters_active");
});

filtersCloseButton.addEventListener("click", (e) => {
    e.preventDefault();
    filters.classList.remove("filters_active");
    render(records);
});

const submitFilters = () => {

    const filtersData = new FormData(filters);

    if (!filtersData.get("date")){
        render(records);
        return;
    }

    const filteredList = records.filter(item => {
        const itemDate = item.date.split("T")[0];
        if (filtersData.get("date") === itemDate) {
            if (filtersData.get("type") === item.type) {
                if (filtersData.get("status") === "") {
                    return item
                } else if (JSON.parse(filtersData.get("status")) === item.status) {
                    return item
                }
            } else if (filtersData.get("type") === "") {
                if (filtersData.get("status") === "") {
                    return item
                } else if (JSON.parse(filtersData.get("status")) === item.status) {
                    return item
                }
            }
        }
    });

    render(filteredList);
}

filters.addEventListener("submit",e => {
    e.preventDefault();
    submitFilters()
});


searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const searchData = new FormData(searchForm).get("search").toLowerCase();
    searchForm[0].value = "";

    const tableItems = Array.from(addRecordTableBody.querySelectorAll("tr"));

    if(!searchData){
        if(filters.classList.contains("filters_active")){
            submitFilters();
        } else {
            render(records);
        }

        return;
    }
    
    const searchResult = [];
    tableItems.filter(item=>{
        const name = item.childNodes[3].innerHTML.split("(")[0];
        const phone = item.childNodes[3].innerHTML.split("(")[1].slice(0, -1);
        const type = item.childNodes[5].innerHTML === "Педикюр"? "pedicure" : "manicure";
        const status = item.childNodes[7].innerHTML.split("<")[0].trim() === "Завершен"? true : false;
        const date = item.childNodes[1].innerHTML.replace(",", "T");
        
        const obj = {
            id: Number(item.id),
            date: date,
            name: name,
            phone: phone,
            type: type,
            status: status
        }

        if(name.toLowerCase().includes(searchData)){
            searchResult.push(obj);
        } 
        else if(phone.includes(searchData)){
            searchResult.push(obj);
        } 
    });

    render(searchResult);
});

const generateId = () => {
    return Number(Math.random().toString().split(".")[1])
}

const render = (array) => {
    array.sort((a, b) => {
        return new Date(a.date) > new Date(b.date);
    }).reverse();

    addRecordTableBody.innerHTML = array.map(record => {
        return `<tr class="record_item" id="${record.id}">
            <td>${record.date.split("T").join(",")}</td>
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

render(records);

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

        addRecordForm.scrollIntoView();
    }

    if(e.target.classList.contains("delete_button")){
        records = records.filter(item => item.id !== Number(id));
        localStorage.setItem("records", JSON.stringify(records));
        render(records);
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
        localStorage.setItem("records", JSON.stringify(records));
        if (filters.classList.contains("filters_active")){
            submitFilters()
        } else{
            render(records);
        }

        document.getElementById(`${id}`)?.scrollIntoView({behaviour: "smooth", block: "end"});
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

        localStorage.setItem("records", JSON.stringify(records));
        render(records);
    }
});


