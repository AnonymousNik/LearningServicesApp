function validation(values) {
    let error = {}
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/

    if(values.email === "") {
        error.email = "Email should not be empty"
    }
    else if(!email_pattern.test(values.email)) {
        error.email = "Incorrect email format"
    }else {
        error.email = ""
    }

    if(values.password === "") {
        error.password = "Password should not be empty"
    } else if(!password_pattern.test(values.password)) {
        error.password = "Password should contain 1 Uppercase, 1 Lowercase, 1 Number & Minimum 8 characters"
    } else {
        error.password = ""
    }

    if(values.name === "") {
        error.name = "Name should not be empty"
    } else {
        error.name = ""
    }

    if(values.phone === "") {
        error.phone = "Phone number should not be empty"
    } else{
        error.phone = ""
    }

    return error;
}

export default validation;