function validateForm(){
    var x = document.forms["myForm"]["name"].value;
    if (x == ""){
        alert("Please insert name!");
        return false;
    } 
}

