onload = async() => {
    const filterSection = document.querySelector('#filter-section');
    const filterBtn = filterSection.querySelector('#apply-filter');
    const typeSelector = filterSection.querySelector('#type');
    const categorySelector = filterSection.querySelector('#category');
    filterBtn.onclick = applyFilters;
    typeSelector.onchange = async () => {await loadCategories(); await loadSubCategories();};
    categorySelector.onchange = loadSubCategories;

    loadSelectors();
    renderData();
}

// Отвечает за построение таблицы по данным о ДДС
async function renderData() {
    const data = await fetchRecords();

    const table = document.querySelector('#table-section');
    table.innerHTML = "";
    if (data == -1) {
        alert('Ошибка загрузки');
        return;
    }
    else if (data.length == 0) {
        alert('Записей не найдено');
        return;
    }
    const tableObject = document.createElement('table');
    const tableHeaders = document.createElement('tr');
    for (i in data[0]) {
        if (i == 'id')
            continue;
        const cell = document.createElement('th');
        cell.textContent = i;
        tableHeaders.appendChild(cell);
    }
    tableObject.appendChild(tableHeaders);
    for (let i = 0; i < data.length; i++) {
        const row = document.createElement('tr');
        for (j in data[0]) {
            if (j == 'id')
                continue;
            const cell = document.createElement('td');
            cell.textContent = data[i][j];
            row.appendChild(cell);
        }
        row.onclick = () => {location.assign(`${loc}recordForm/${data[i].id}`)};
        tableObject.appendChild(row);
    }
    table.appendChild(tableObject);
}

async function applyFilters() {
    const filterSection = document.querySelector('#filter-section');
    const from = filterSection.querySelector('#from');
    const to = filterSection.querySelector('#to');
    const sortBy = filterSection.querySelector('#sort');
    const order = filterSection.querySelector('#order');
    const status = filterSection.querySelector('#status');
    const type = filterSection.querySelector('#type');
    const category = filterSection.querySelector('#category');
    const subCategory = filterSection.querySelector('#sub-category');

    // Проверка правильности введенных дат
    if (new Date(from.value) > new Date(to.value)) {
        console.log("Validation failed: 'from' date should be less or equal to 'to' date");
        alert("Начальная дата должна быть не больше конечной!");
        return;
    }

    // применение фильтров
    Object.keys(RecordFilters).forEach(key => delete RecordFilters[key]);
    RecordFilters = default_filters;
    RecordFilters = {
        from: from.value,
        to: to.value,
        status: status.value,
        type: type.value,
        category: category.value,
        sub_category: subCategory.value
    }
    RecordFilters[`${sortBy.value}`] = order.value;
    if (sortBy.value == "amount") 
        RecordFilters["amount"] = order.value * -1;
    renderData();
}


async function loadStatuses() {
    const filterSection = document.querySelector('#filter-section');
    const status = filterSection.querySelector('#status');
    const statusList = await fetchStatuses();
    for (i in statusList) {
        const option = document.createElement('option');
        option.value = statusList[i];
        option.text = statusList[i];
        status.appendChild(option);
    }
}
async function loadTypes() {
    const filterSection = document.querySelector('#filter-section');
    const type = filterSection.querySelector('#type');
    const typeList = await fetchTypes();
    for (i in typeList) {
        const option = document.createElement('option');
        option.value = typeList[i];
        option.text = typeList[i];
        type.appendChild(option);
    }
}
async function loadCategories() {
    const filterSection = document.querySelector('#filter-section');
    const type = filterSection.querySelector('#type');
    const category = filterSection.querySelector('#category');
    const categoryList = await fetchCategories(type.value);
    for (i in category.children)
        category.remove(category.children[i]);
    const anyOption = document.createElement('option');
    anyOption.text = 'Любой';
    anyOption.value = 'any';
    category.appendChild(anyOption);
    for (i in categoryList) {
        const option = document.createElement('option');
        option.value = categoryList[i];
        option.text = categoryList[i];
        category.appendChild(option);
    }
}
async function loadSubCategories() {
    const filterSection = document.querySelector('#filter-section');
    const type = filterSection.querySelector('#type');
    const category = filterSection.querySelector('#category');
    const subCategory = filterSection.querySelector('#sub-category');
    const subCategoryList = [];
    if (category.value == 'any') {
        const categoryList = await fetchCategories(type.value);
        for (i in categoryList)
            subCategoryList.push(...(await fetchSubCategories(categoryList[i])));
    }
    else {
        subCategoryList.push(...(await fetchSubCategories(category.value)));
    }
    for (i in subCategory.children)
        subCategory.remove(subCategory.children[i]);
    const anyOption = document.createElement('option');
    anyOption.value = 'any';
    anyOption.text = 'Любой';
    subCategory.appendChild(anyOption);
    for (i in subCategoryList) {
        const option = document.createElement('option');
        option.value = subCategoryList[i];
        option.text = subCategoryList[i];
        subCategory.appendChild(option);
    }
}