function hello() {
    try {
        let x = 1;
        throw new Error("angst")
    }
    catch (e) {
        throw e;
    }
}

try {
    hello();
}
catch (e) { 
    console.log(e.message + "aaa");
}