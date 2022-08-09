

function setBorrowButton() {

    console.log(`function setBorrowButton`);
    let btn = document.querySelector(".borrow");


    let chkBooks = document.getElementsByName("chkBook");
	btn.disabled = true;
	chkBooks.forEach( e => {
        console.log(`e.id = ${e.id} e.checked = ${e.checked}`);
        if (e.checked) {
            btn.disabled = false;
        }
	});
}

function submitBorrow() {

    console.log(`function submitBorrow`);

    document.getElementById("frmLibraryHome").action = "/home/borrow";
    document.getElementById("frmLibraryHome").submit();
}

function setReturnButton() {

    console.log(`function setReturnButton`);
    let btn = document.querySelector(".return");


    let chkBooks = document.getElementsByName("chkBookBorrowed");
	btn.disabled = true;
	chkBooks.forEach( e => {
        console.log(`e.id = ${e.id} e.checked = ${e.checked}`);
        if (e.checked) {
            btn.disabled = false;
        }
	});
}

function submitReturn() {

    console.log(`function submitReturn`);

    document.getElementById("frmLibraryHome2").action = "/home/return";
    document.getElementById("frmLibraryHome2").submit();
}

$(document).ready(function(){
    let chkBooks = document.getElementsByName("chkBook");
	
	chkBooks.forEach( e => {
		e.addEventListener("change", setBorrowButton);
		
	});



	let chkBookBorrowed = document.getElementsByName("chkBookBorrowed");
	
	chkBookBorrowed.forEach( e => {
		e.addEventListener("change", setReturnButton);
		
	});

})

