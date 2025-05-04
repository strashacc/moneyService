const catalogs = {
    status: 'Статус',
    type: 'Тип',
    category: 'Категория',
    sub_category: 'Подкатегория'
}

onload = async () => {
    const formSection = document.querySelector('#filter-section');
    const catalog = formSection.querySelector('#catalog');
    const saveButton = formSection.querySelector('#save-button');
    saveButton.onclick = saveObject;
    catalog.onchange = async () => {await loadForm(); await loadCatalog()};

    await loadCatalog();
}

async function saveObject() {
    const formSection = document.querySelector('#filter-section');
    const catalog = formSection.querySelector('#catalog');
    const name = formSection.querySelector('#name');
    const reference = formSection.querySelector('#reference');
    const url = `${loc}catalogs/${catalog.value}`;
    if (!name.value) {
        alert('Название не должно быть пустым');
        return;
    }
    const requestBody = {
        name: name.value
    }
    if (reference)
        requestBody[catalog.value == 'category' ? 'type' : 'category'] = reference.value;

    try {
        response = JSON.parse(
            await fetch(
                url,
                {
                    method: 'POST',
                    body: JSON.stringify(requestBody)
                }
            ).then(res => res.json())
        )
        console.log(response);
        location.reload();
    }
    catch (error) {
        console.log(error);
        alert("Ошибка сохранения");
        return;
    }
}

async function loadCatalog() {
    const formSection = document.querySelector('#filter-section');
    const catalog = formSection.querySelector('#catalog');
    const tableSection = document.querySelector('#table-section');
    tableSection.innerHTML = "";

    const list = [];
    switch (catalog.value) {
        case 'status':
            list.push(... (await fetchStatuses()));
            break;
        case 'type':
            list.push(... (await fetchTypes()));
            break;
        case 'category':
            list.push(... (await fetchCategories('any')));
            break;
        case 'sub_category':
            list.push(... (await fetchSubCategories()));
            break;
    }
    const tableObject = document.createElement('table');
    const tableHeaders = document.createElement('tr');
    const header = document.createElement('th');
    header.textContent = catalogs[catalog.value];
    tableHeaders.appendChild(header);
    tableObject.appendChild(tableHeaders);
    for (let i = 0; i < list.length; i++) {
        console.log(list[i])
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.textContent = list[i];
        row.appendChild(cell);
        tableObject.appendChild(row);
    }
    tableSection.appendChild(tableObject);
}

async function loadForm() {
    const formSection = document.querySelector('#filter-section');
    const catalog = formSection.querySelector('#catalog');
    const reference = formSection.querySelector('#reference');
    if (reference){
        formSection.removeChild(formSection.querySelector('#label'));
        formSection.removeChild(reference);
    }
    switch (catalog.value) {
        case 'category':
            await loadTypeSelector();
            break;
        case 'sub_category':
            await loadCategorySelector();
            break;
    }

    async function loadTypeSelector() {
        const formSection = document.querySelector('#filter-section');
        const typeSelector = document.createElement('select');
        const typeLabel = document.createElement('label');
        typeLabel.textContent = 'Тип';
        typeLabel.id = "label";
        formSection.insertBefore(typeLabel, formSection.querySelector('#save-button'));
        typeSelector.name = 'reference';
        typeSelector.id = 'reference';
        const types = await fetchTypes();
        for (i in types) {
            const newOption = document.createElement('option');
            newOption.value = types[i];
            newOption.textContent = types[i];
            console.log(types[i]);
            typeSelector.appendChild(newOption);
        }
        formSection.insertBefore(typeSelector, formSection.querySelector('#save-button'));
    }
    async function loadCategorySelector() {
        const formSection = document.querySelector('#filter-section');
        const categorySelector = document.createElement('select');
        const categoryLabel = document.createElement('label');
        categoryLabel.id = "label";
        categoryLabel.textContent = 'Категория';
        formSection.insertBefore(categoryLabel, formSection.querySelector('#save-button'));
        categorySelector.name = 'reference';
        categorySelector.id = 'reference';
        const categories = await fetchCategories('any');
        for (i in categories) {
            const newOption = document.createElement('option');
            newOption.value = categories[i];
            newOption.textContent = categories[i];
            console.log(categories[i]);
            categorySelector.appendChild(newOption);
        }
        formSection.insertBefore(categorySelector, formSection.querySelector('#save-button'));
        
    }
}