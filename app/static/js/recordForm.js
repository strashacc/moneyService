const params = location.search;

onload = async () => { 
    await loadSelectors();   
    await loadRecord();
    const filterSection = document.querySelector('#filter-section');
    const typeSelector = filterSection.querySelector('#type');
    const categorySelector = filterSection.querySelector('#category');
    const saveButton = filterSection.querySelector('#save-button');
    saveButton.onclick = saveRecord;
    typeSelector.onchange = async () => {await loadCategories(); await loadSubCategories();};
    categorySelector.onchange = loadSubCategories;
}

async function saveRecord() {
    const formSection = document.querySelector('#filter-section');
    const inputs = {
        status :        formSection.querySelector('#status'),
        type :          formSection.querySelector('#type'),
        sub_category :  formSection.querySelector('#sub-category'),
        category :      formSection.querySelector('#category'),
        amount :        formSection.querySelector('#amount'),
        comment :       formSection.querySelector('#comment'),
    }
    if (formSection.querySelector('#date_created'))
        inputs.date_created = formSection.querySelector('#date_created')
    // TODO: refactor validation
    for (i in inputs) {
        if (inputs[i].hasAttribute('required') && !inputs[i].value) {
            alert(`Требуемые поля должны быть заполнены!`);
            return;
        }
    }
    if (inputs.date_created && new Date(inputs.date_created.value) > new Date(Date.now())) {
        alert(`Дата создания не может превышать текущую дату`);
        return;
    }
    if (inputs.amount.value < 0) {
        alert(`Сумма действия должна быть неотрицательной!`);
        return;
    }
    const statusList = await fetchStatuses();
    if (!statusList.includes(inputs.status.value)) {
        alert(`Неверный статус`);
        return;
    }
    const typeList = await fetchTypes();
    if (!typeList.includes(inputs.type.value)) {
        alert(`Неверный тип`);
        return;
    }
    const categoryList = await fetchCategories(inputs.type.value);
    if (!categoryList.includes(inputs.category.value)) {
        alert(`Неверная категория`);
        return;
    }
    const subCategoryList = await fetchSubCategories(inputs.category.value);
    if (!subCategoryList.includes(inputs.sub_category.value)) {
        alert(`Неверная подкатегория`);
        return;
    }
    try {
        const id = document.querySelector('#id');
        const requestBody = {
            status :        inputs.status.value,
            type :          inputs.type.value,
            sub_category :  inputs.sub_category.value,
            category :      inputs.category.value,
            amount :        inputs.amount.value,
            comment :       inputs.comment.value,
        };
        if (inputs.date_created)
            requestBody.date_created = inputs.date_created.value;
        if (id) {
            requestBody.id = id.textContent;
        }
        const response = JSON.parse(await fetch(
                `${loc}records`, {
                    method: id ? 'PATCH' : 'POST',
                    body: JSON.stringify(requestBody)
                }
            ).then(res => res.json())
        );
        console.log(response);
        location.assign(loc);
    }
    catch (error) {
        console.log(error);
        alert(`Не удалось сохранить запись`);
        return;
    }
}

async function loadRecord() {
    const recordId = document.querySelector("#id");
    if (!recordId) {
        return;
    }
    const record = await fetchRecord(recordId.textContent);
    if (!record) {
        alert("Запись не существует");
        return;
    }
    const formSection = document.querySelector('#filter-section');
    const dateSelector = document.createElement('input');
    const dateLabel = document.createElement('label');
    
    dateLabel.for = 'date_created';
    dateLabel.textContent = 'Дата создания: ';
    dateSelector.type = 'date';
    dateSelector.name = 'date_created';
    dateSelector.id = 'date_created';
    dateSelector.toggleAttribute('required');
    formSection.insertBefore(dateSelector, formSection.querySelector('label'));
    formSection.insertBefore(dateLabel, formSection.querySelector('input'));
    inputs = {
        status :        formSection.querySelector('#status'),
        type :          formSection.querySelector('#type'),
        category :      formSection.querySelector('#category'),
        sub_category :   formSection.querySelector('#sub-category'),
        date_created :          dateSelector,
        amount :        formSection.querySelector('#amount'),
        comment :       formSection.querySelector('#comment')
    }
    for (i in inputs) {
        inputs[i].value = record[i];
        console.log(inputs[i].value)
        if (i == 'type'){
            await loadCategories();
            await loadSubCategories();
        }
        if (i == 'category')
            await loadSubCategories();
    }
}

// Данные функции устанавливают варианты dropdown полей (Разные функции загрузки для разных страниц нужны в связи с наличием опции "Любой" на главной странице)
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
    for (i in categoryList) {
        const option = document.createElement('option');
        option.value = categoryList[i];
        option.text = categoryList[i];
        category.appendChild(option);
    }
}
async function loadSubCategories() {
    const filterSection = document.querySelector('#filter-section');
    const category = filterSection.querySelector('#category');
    const subCategory = filterSection.querySelector('#sub-category');
    const subCategoryList = await fetchSubCategories(category.value);
    for (i in subCategory.children)
        subCategory.remove(subCategory.children[i]);
    for (i in subCategoryList) {
        const option = document.createElement('option');
        option.value = subCategoryList[i];
        option.text = subCategoryList[i];
        subCategory.appendChild(option);
    }
}