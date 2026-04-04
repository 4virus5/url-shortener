const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function generateCode(length = 6){
    let code = ""
    let idx;
    for(let i=0;i<length;i++){
        idx = Math.floor(Math.random()*chars.length)
        code += chars[idx]
    }
    return code
}

module.exports = generateCode