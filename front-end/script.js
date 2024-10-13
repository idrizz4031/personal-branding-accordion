const item = [];
const LOAD = 'load-bookshelf';

//Merekam hasil di DOM
document.addEventListener('DOMContentLoaded', function () {
    const validForm = document.getElementById('form');
    validForm.addEventListener('submit', function (event) {
        event.preventDefault();
        HasilBookShelf();
    });
    //Mengaktifkan anti refresh
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

//Membuat Hasil Keterangan di DOM 
function HasilBookShelf() {
    const inputJudulBookShelf = document.getElementById('inputJudul').value;
    const inputAuthorBookShelf = document.getElementById('inputAuthor').value;
    const inputTahunBookshelf = parseInt(document.getElementById('inputTahun').value);
    const isComplete = document.getElementById('check').checked;
    const BuatID = buatkanID();
    const BookShelfObject = buatkanBookShelfObject(BuatID, inputJudulBookShelf, inputAuthorBookShelf, inputTahunBookshelf, isComplete);
    item.push(BookShelfObject);

    document.dispatchEvent(new Event(LOAD));
    saveData();
}

//Membuat hasil nomer ID
function buatkanID() {
    return +new Date();
}

//Membuat hasil tampilan di DOM
function buatkanBookShelfObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

//Membuat hasil inputan Belum selesai dibaca dan sudah selesai dibaca
function eksekusiBookShelf(BookShelfObject) {
    const textJudul = document.createElement('h2');
    textJudul.innerText = BookShelfObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = "Author: " + BookShelfObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = "Tahun: " + BookShelfObject.year;

    const textIsi = document.createElement('div');
    textIsi.classList.add('inner');
    textIsi.append(textJudul, textAuthor, textYear);

    const Isi = document.createElement('div');
    Isi.classList.add('side', 'property');
    Isi.append(textIsi);
    Isi.setAttribute('id', `bookshelf-${BookShelfObject.id}`);

        //Membuat tombol selesai dan belum selesai beserta tombol hapus
        if (BookShelfObject.isComplete) {
            const belumSelesaiButton = document.createElement('button');
            belumSelesaiButton.classList.add('belum-button');

            belumSelesaiButton.addEventListener('click', function () {
                belumSelesai(BookShelfObject.id);
            });
            const hapusButton = document.createElement('button');
            hapusButton.classList.add('hapus-button');

            hapusButton.addEventListener('click',function() {
                hapusData(BookShelfObject.id);
            });
            Isi.append(belumSelesaiButton, hapusButton);
        } else {
            const selesaiButton = document.createElement('button');
            selesaiButton.classList.add('selesai-button');

            selesaiButton.addEventListener('click', function () {
                fixSelesai(BookShelfObject.id);
            });
            const hapusButton = document.createElement('button');
            hapusButton.classList.add('hapus-button');

            hapusButton.addEventListener('click',function() {
                hapusData(BookShelfObject.id);
            });
            Isi.append(selesaiButton, hapusButton);
        }

    return Isi;
}


function fixSelesai(bookId) {
    const bookTarget = cariBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(LOAD));
    saveData();
}

function belumSelesai(bookId) {
    const bookTarget = cariBook(bookId);

    if(bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(LOAD));
    saveData();
}

function hapusData(bookId) {
    const bookTarget = cariBookTarget(bookId);

    if (bookTarget === -1) return;

    item.splice(bookTarget, 1);
    document.dispatchEvent(new Event(LOAD));
    saveData();
}

//menghidupkan fungsi saveData();    
function saveData() {
        if (isStorageExist()) {
            const parsed = JSON.stringify(item);
            localStorage.setItem(STORAGE_KEY, parsed);
            document.dispatchEvent(new Event(SAVED_EVENT));
        }
    }

    function cariBookTarget(bookId) {
        for (const index in item) {
            if (item[index].id === bookId) {
                return parseInt(index);
            }
        }
        return -1;
    }

    function cariBook(bookId) {
        for (const bookProperty of item) {
            if (bookProperty.id === bookId) {
                return bookProperty;
            }
        }
        return null;
    }


//Menyimpan data di Storage Key
const SAVED_EVENT = 'bookshelf-saved';
const STORAGE_KEY = 'SHELF_ACTIVITY';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browsermu tidak support local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});



//Eksekusi hasil inputan
document.addEventListener(LOAD, function () {
    console.log(item);
    const listUncompleted = document.getElementById('item');
    listUncompleted.innerHTML = '';

    const listCompleted = document.getElementById('item-terbaca');
    listCompleted.innerHTML = '';

    for (const bookProperty of item) {
        const bookElement = eksekusiBookShelf(bookProperty);
        if (!bookProperty.isComplete) {
            listUncompleted.append(bookElement);
        } else {
            listCompleted.append(bookElement);
        }    
    }
});

//Membuat tetap tersimpan meskipun Browser direfresh
function loadDataFromStorage() {
    const serializeData = localStorage.getItem(STORAGE_KEY);
    let memory = JSON.parse(serializeData);

    if (memory !== null) {
        for(const shelf of memory) {
            item.push(shelf);
        }
    }
    document.dispatchEvent(new Event(LOAD));
}
