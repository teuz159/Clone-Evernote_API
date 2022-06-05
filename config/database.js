const mongoose = require('mongoose');

// existe alguns metodos do mongoose que retornam uma promessa, e no caso para usar await e funções assincronas usamos isso
// assim fica estabelecido que esses metodos que retornam uma query, que não é bem uma promise como dito, também podem usar o async e await.

//ou seja, uma promessa do mongoose é igual a uma promessa do proprio js, com isso podemos usar suas formas de tratamento do js.

//logo pegamoso  objeto mongoose, definimos que suas promessa são iguais as promessas do js e depois utilizamos um metodo para connectar o mongoose
// com um banco de dados nosso. No mesmo connect definimos alguns parametros ou caracteristicas, algumas configurações da nossa ligação. Como dito,
// isso vai retornar uma promesa do mongoose, logo podemos usar o then catch, isso porque está fazendo uma query mongoose é o mesmo que promessa mongoose.

//show de bola
mongoose.Promise = global.Promise;

require('dotenv').config()
const MONGO_URL = process.env.MONGO_URL

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true
}).then(()=> {
    console.log('Conectado com sucesso')
}).catch((err) => {
    console.log(err)
})

module.exports = mongoose