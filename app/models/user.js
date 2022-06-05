const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

let userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
})

//rodar script antes de fazer operações no banco de dados, então quando for dar um create ou save por exemplo, ele primeiro executa isso aqui
userSchema.pre('save', function (next) {
    //next passa para o proximo middleware
    if(this.isNew || this.isModified('password')){
        //no caso o item que está sendo salvo no banco de dados, é um objeto, então usa o this
        bcrypt.hash(this.password, 10,
            (err, hashedPassword) => {
                if(err)
                //passamos para o middleware que vai realiza o save mesmo, só que como passamos um erro, seria como se fosse caisse no catch da rota, quaando o save não funciona
                next(err)
                else{
                    this.password = hashedPassword
                    next();
                }
            }
            )
    }
});

userSchema.methods.isCorrectPassword = function (password, callback) {
    bcrypt.compare(password, this.password, function(err, same){
        if(err)
        callback(err);
        else
        callback(err, same);
    })
}

module.exports = mongoose.model('User', userSchema);