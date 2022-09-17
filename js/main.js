// variables

let title =  document.getElementById("title"),
    price =  document.getElementById("price"),
    taxes =  document.getElementById("taxes"),
    ads   =  document.getElementById("ads"),
    total =  document.getElementById("total"),
    count =  document.getElementById("count"),

    discount =  document.getElementById("discount"),
    category =  document.getElementById("category"),
    search   =  document.getElementById("search"),

    createBtn =  document.getElementById("create"),

    searchTitleBtn    =  document.getElementById("searchTitleBtn"),
    searchCategoryBtn =  document.getElementById("searchCategoryBtn"),
    filterName =  document.getElementById("filter-name"),
    filterCategory =  document.getElementById("filter-category"),
    filterPrice =  document.getElementById("filter-price"),
    filterAlphabet =  document.getElementById("filter-alphabet"),
    table = document.getElementById("table");
    clearBtn = document.getElementById("clear");

    let createMode = "create";
    let searchMode = 'title';
    let productIndex;
    let filteredProducts = [];

// Data 
// get data from local storage
let products;
let storageProducts = localStorage.getItem("products");


if (storageProducts != null) {
    products = JSON.parse(storageProducts)
} else {
    products =  [
        {
            title: "I phone",
            price: 520,
            taxes: 5,
            ads: 4,
            discount: 3,
            total: 520 + 5 + 4 - 3,
            category: "phone"
        },
    
        {
            title: "Samsung",
            price: 250,
            taxes: 5,
            ads: 2,
            discount: 3,
            total: 250 + 5 + 2 - 3,
            category: "phone"
        },
    
        {
            title: "Smart Tv",
            price: 160,
            taxes: 3,
            ads: 2,
            discount: 6,
            total: 160 + 3 + 2 - 6,
            category: "electrons"
        },
    ]
}

// events

title.addEventListener("keyup", countTotal);
price.addEventListener("keyup", countTotal);
taxes.addEventListener("keyup", countTotal);
ads.addEventListener("keyup", countTotal);
discount.addEventListener("keyup", countTotal);
category.addEventListener("keyup", countTotal);
title.addEventListener("keyup", countTotal);
createBtn.addEventListener("click", createProduct);
searchTitleBtn.addEventListener("click", () => setSearchMode("title"));
searchCategoryBtn.addEventListener("click", () => setSearchMode("category"));
search.addEventListener("keyup", searchFun);
clearBtn.addEventListener("click", clearAll);
filterName.addEventListener("change", filterChangeName);
filterCategory.addEventListener("change", filterChangeCategory);
filterPrice.addEventListener("change", filterByPrice);
filterAlphabet.addEventListener("change", filterByAlphabet);


// functions

// 1 => render data in table

function renderTable() {
    let tbody = document.querySelector("tbody");
    let newRow = '';
    products.map((pro, index) => {
        newRow += `
            <tr>
                <td>${index + 1}</td>
                <td>${pro.title}</td>
                <td>${pro.price}</td>
                <td>${pro.ads ? pro.ads: "-"}</td>
                <td>${pro.discount ? pro.discount: "-"}</td>
                <td>${pro.total}</td>
                <td>${pro.category ? pro.category: "---"}</td>
                <td><button id="update" onclick="updateProduct(${index})">Update</button></td>
                <td><button id="delete" onclick="deleteProduct(${index})">Delete</button></td>
            </tr>
        `
    })

    tbody.innerHTML = newRow;
}

renderTable();

// 2 => count total

function countTotal() {

    if (title.value != '' && price.value != '' && category.value != '') {
        let totalValue = +price.value + +ads.value + +taxes.value - +discount.value;
        total.innerHTML = totalValue;
        total.style.background = "green";
    } else {
        total.style.background = "red";
        total.innerHTML = ''
    }
}

//  3 => clear inputs

function clearInputs() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    total.innerHTML = '';
    category.value = '';
    count.value = '';
    discount.value = ''
}


// 4 => create object of product;

function createProduct() {

    let product = {
        title: title.value,
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        category: category.value
    }
    
    if (title.value !== '' && category.value !== '' && price.value !== '') {
        if (createMode === "create") {    
    
            if (count.value > 1) {
                for (let i = 0; i < count.value; i++) {
                    products.push(product);
                }
            } else {
                products.push(product);
                }
    
            
        } else {
            products[productIndex] = product;
            createMode = "create";
            createBtn.textContent = "Create";
            count.style.cssText = "flex: 0 0 49.5%;  max-width: 49.5%";
            category.style.cssText = "flex: 0 0 49.5%;  max-width: 49.5%"
        }

        localStorage.setItem("products", JSON.stringify(products));
        clearInputs();
        countTotal();
        setSelectFilterByNameValues();
        setSelectFilterByCategoryValues();
        renderTable();
    }
        
}

// 5 => delete product


function deleteProduct(index) {
    let deletedPro = products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    renderTable();

    deletedPro.map(d => {
        products.map(p => {
            if (! (p.title.toLowerCase() === d.title.toLowerCase())) {
                setSelectFilterByCategoryValues();
                setSelectFilterByNameValues();
            }
        })
    })
}

// 6 => update product

function updateProduct(index) {
    let findPro = products.find((_, idx) => idx === index);
    const {title:proTitle, price: proPrice, ads: proAds, taxes: ProTaxes, discount: proDiscount, total: proTotal, category: proCategory} = findPro;

    title.value = proTitle;
    price.value = proPrice;
    ads.value = proAds;
    taxes.value = ProTaxes;
    total.innerHTML = proTotal;
    discount.value = proDiscount;
    category.value = proCategory;

    count.style.display = "none";
    category.style.minWidth = "100%";

    createBtn.textContent = "Update";
    createMode = "update";
    productIndex = index;

    scroll({
        top: 0,
        behavior: "smooth"
    });

    countTotal();
}

// 7 => setSearchMode 

function setSearchMode(mode) {
    searchMode = mode;
    search.focus();
    search.placeholder = `Search by ${mode}`;

    search.value = '';
    renderTable();
}

// 8 => search function

function searchFun() {

    let tbody = document.querySelector("tbody");
    let newRow = '';

    products.map((pro, index) => {
        if (search.value !== '') {
            if (pro[searchMode].toLowerCase().includes(search.value.toLowerCase())) {
                    newRow += renderNewRows(pro, index)
                }

            tbody.innerHTML = newRow;

        } else {
            renderTable()
        }
    })
        
}

searchFun(searchMode);

// 9 => filter by title

function setSelectFilterByNameValues() {
    let options = '<option value="all">All</option>';
    let titles = [];
    products.map(pro => {
        if (titles.indexOf(pro.title) == -1) {
            titles.push(pro.title)
        }

    });

    titles.map(title => {
        options += `
            <option value=${title}>${title}</option>
        `
    })

    filterName.innerHTML = options;


}

setSelectFilterByNameValues()

function filterChangeName() {
    let value = this.value;
    filteredProducts = products.filter(p => p.title === value);
    getFilterData(value);
}


function getFilterData(type) {
    let newRow = '';
    let tbody = document.querySelector("tbody");

    products.map((pro, index) => {

        if (pro.title.toLowerCase().includes(type.toLowerCase())) {
            newRow += renderNewRows(pro, index); 
        }
        
    });

    tbody.innerHTML = newRow;

    if (type === "all") {
        renderTable();
    }
}

//  filter by category

function setSelectFilterByCategoryValues() {
    let options = '<option value="all">All</option>';
    let categories = [];
    products.map(pro => {
        if (categories.indexOf(pro.category) == -1) {
            categories.push(pro.category)
        }

    });

    categories.map(category => {
        options += `
            
            <option value=${category}>${category}</option>
        `
    })

    filterCategory.innerHTML = options;
}

setSelectFilterByCategoryValues();


function filterChangeCategory() {
    let value = this.value;
    filteredProducts = products.filter(p => p.category === value);
    getCategoryData(value);
}


function getCategoryData(type) {
    let newRow = '';
    let tbody = document.querySelector("tbody");

    products.map((pro, index) => {

        if (pro.category.toLowerCase().includes(type.toLowerCase())) {
            newRow += renderNewRows(pro, index)
        }
        
    });

    tbody.innerHTML = newRow;

    if (type === "all") {
        renderTable();
    }
}

// filter by price

function filterByPrice() {
    let newRow = '';
    let tbody = document.querySelector("tbody");
    
    if (filteredProducts.length > 1) {
        filteredProducts.sort((a, b) => {

            if (this.value === "high") {
                return b.total - a.total;
            } else {
                return a.total - b.total;
            }
            });
    
        filteredProducts.map((p, index) => {
            newRow += renderNewRows(p, index); 
        })
    
        tbody.innerHTML = newRow;
    } else {
        products.sort((a, b) => {

            if (this.value === "high") {
                return b.total - a.total;
            } else {
                return a.total - b.total;
            }
            });

            renderTable()
    }
}

// filter by alphabet

function filterByAlphabet() {
    let tbody = document.querySelector("table tbody");
    let newRow = '';
    let newData = [];

    if (filteredProducts.length >= 1) {
        newData = filteredProducts;
    } else {
        newData = products;
    }


    newData.sort((a, b) => {
        let x = a.title.toLowerCase();
        let y = b.title.toLowerCase();

        if (this.value === "A - Z") {

            if (x < y) return -1;

        } else if (this.value === "Z - A") {

            if (x > y) return -1;

        }
    });


    newData.map((pro,index) => {
        newRow += renderNewRows(pro, index)
    });

    tbody.innerHTML = newRow;

}



// render data width select change or search input change

function renderNewRows(data, index) {
    return `
        <tr>
            <td>${index + 1}</td>
            <td>${data.title}</td>
            <td>${data.price}</td>
            <td>${data.ads}</td>
            <td>${data.discount}</td>
            <td>${data.total}</td>
            <td>${data.category}</td>
            <td><button id="update" onclick="updateProduct(${index})">Update</button></td>
            <td><button id="delete" onclick="deleteProduct(${index})">Delete</button></td>
        </tr>
        `;
}

// clear all function

function clearAll() {
    localStorage.clear();
    products = [];
    filteredProducts = []
    renderTable();
}
