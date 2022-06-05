require('dotenv').config()
const secret = process.env.JWT_TOKEN;

const jwt = require('jsonwebtoken');

const User = require('../models/user');

//estamos criando um middleware. Lembrando que um middleware sempre é executando antes do scripts de uma determinada requisição
// aqui no caso para usar usamos o app.use(), mas como não é algo para ser usado em todas as requisições, vamos usar apenas em requisições
// que seja necessário a autenticação
const WithAuth = (req, res, next) => {
    const token = req.headers['x-acess-token']
    if(!token)
    res.status(401).json({error: 'Não autorizado: sem token na requisição'});
    else{
        jwt.verify(token, secret, (err, decode) => {
            if(err)
            res.status(401).json({error: 'Token inválido'});
            else {
                req.email = decode.email
                User.findOne({email: decode.email})
                .then(user => {
                    req.user = user
                    next()
                }).catch(err => {
                    //aqui no caso esse middleware funciona antes do bloco de códigos de uma requsição, mas ele já pode entregar um erro da requsição
                    //se não funcionar nessaa etapa
                    res.status(401).json({error: err})
                })
            }
        })
    }
}
//não é possível usar o async e await em User.findOne no WithAuth, isso porque é um escopo maior. O certo é enviar na callback, isso porque
//o await iria ser usado dentro da função callback jwt.verify e como não usar async altera o return da função, para a resposta da promise
//poderia dar algum erro, logo é melhor usar then catch, mas caso não de erro, transforma a função callback em async e utiliza await, e não
// na with auth pois o await User iria ficar dentro da call back e não da função with auth

module.exports = WithAuth