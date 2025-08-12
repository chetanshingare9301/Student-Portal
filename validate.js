let nameValidate=false;
let emailValidate=false;
let contactValidate=false;

let validateName=(str)=>{
 let name=str.toLowerCase();
 let span=document.getElementById("nmsg");
 for(var i=0;i<name.length;i++)
 {
    if(!(name.charCodeAt(i)>=97 && name.charCodeAt(i)<=122))
    {
        nameValidate=false;
        break;

    }
 }
 if(nameValidate)
 {
    span.innerHTML="";
    span.style.color="white";
    
 }
 else{
     span.innerHTML="invalid name include only alphabets";
     span.style.color="red";
     nameValidate=true;
 }
}


let validateEmail = (str) => {
    let span = document.getElementById("emsg");
    emailValidate = true; // assume valid

    for (let i = 0; i < str.length; i++) {
        let ch = str.charCodeAt(i);

        if (
            !(
                (ch >= 97 && ch <= 122) || // a-z
                (ch >= 65 && ch <= 90) ||  // A-Z
                (ch >= 48 && ch <= 57) ||  // 0-9
                ch === 46 || ch === 95 || ch === 64 // . _ @
            )
        ) {
            emailValidate = false;
            break;
        }
    }

    if (emailValidate) {
        span.innerHTML = "";
    } else {
        span.innerHTML = "invalid email include only alphabets,digits and . _ @";
        span.style.color = "red";
    }
};

let validateContact=(str)=>{
    let span = document.getElementById("cmsg");
    contactValidate = true;

    for (let i = 0; i < str.length; i++) {
        let ch = str.charCodeAt(i);
        if (!(ch >= 48 && ch <= 57)) { // only digits allowed
            contactValidate = false;
            break;
        }
    }

    if (str.length !== 10) {
        contactValidate = false;
    }

    if (contactValidate) {
        span.innerHTML = "";
    } else {
        span.innerHTML = "invalid contact number include only 10 digits";
        span.style.color = "red";
    }
}