const loc = location.origin + "/finance/";
const default_filters = {
    date_created: -1
}
var RecordFilters = {
    date_created: -1
}

// Fetch функции для получения данных о ДДС
async function fetchRecords() {
    try{
        const params = new URLSearchParams(RecordFilters);
        const response = JSON.parse(
            await fetch(
                `${loc}records?${params}`
            ).then(res => res.json())
        );
        for (i in response) {
            let id = response[i].pk;
            response[i] = response[i].fields;
            response[i].id = id;
        }
        return response;
    }
    catch (error) {
        console.log(error)
        return -1;
    }
}
async function fetchRecord(id) {
    try {
        const response = JSON.parse(
            await fetch(
                `${loc}records/${id}`
            ).then(res => res.json())
        )[0].fields;
        return response;
    }
    catch (error) {
        console.log(error);
        return -1;
    }
}
async function fetchStatuses() {
    try {
        const response = JSON.parse(
            await fetch(
                `${loc}catalogs/status`
            ).then(res => res.json())
        );
        for (i in response) {
            response[i] = response[i].pk;
        }
        return response;
    } catch (error) {
        console.log(error);
        return -1;
    }
}
async function fetchTypes() {
    try {
        const response = JSON.parse(
            await fetch(
                `${loc}catalogs/type`
            ).then(res => res.json())
        );
        for (i in response) {
            response[i] = response[i].pk;
        }
        return response;
    } catch (error) {
        console.log(error);
        return -1;
    }
}
async function fetchCategories(type) {
    try {
        const params = new URLSearchParams({type: type});
        const response = JSON.parse(
            await fetch(
                `${loc}catalogs/category?${params}`
            ).then(res => res.json())
        );
        for (i in response) {
            response[i] = response[i].pk;
        }
        return response;
    } catch (error) {
        console.log(error);
        return -1;
    }
}
async function fetchSubCategories(category) {
    try {
        const params = category ? new URLSearchParams({category: category}) : null;
        const response = JSON.parse(
            await fetch(
                `${loc}catalogs/sub_category?${params}`
            ).then(res => res.json())
        );
        for (i in response) {
            response[i] = response[i].pk;
        }
        return response;
    } catch (error) {
        console.log(error);
        return -1;
    }
}

// Функции для загрузки селекторов фильтров
async function loadSelectors() {
    loadStatuses();
    loadTypes();
    loadCategories();
    loadSubCategories();
}