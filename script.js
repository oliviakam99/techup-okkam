var age = 20;
age = 65;
console.log(age);

var username = "olivia";
var password = "password";
var isFemale = false; 
var isLoggedIn = false; 
var blog_posts = ["hello, how are you?", "I am well", "Thank you!"]; 


console.log(age);
console.log(username);
console.log(password);
console.log(isFemale);
console.log(isLoggedIn);
console.log(blog_posts);

if(isFemale == true) {
    console.log("I am a girl!"); 
} else {
    console.log("I am a male");
}

while(age<70){
    console.log("My age is "+ age);
    age = age + 1; 
}

function sayHello () {
    var x = 1;
    while(x < 2) {
        alert("You did it..");
        x = x +1;
}
}

function showAge() {
    var user_input = document.getElementById("user-input").value 
    document.getElementById("header-age").textContent = user_input;
}