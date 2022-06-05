const mongoose = require('mongoose')

let noteSchema = new mongoose.Schema({
    title: String,
    body: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

//como se fosse um novo campo que vai ter todos os itens
// é como se ele estivesse gerando um operador para as querys que vamos fazer ai quando uso esse operador ele especifica que queremos valores desses dois cmapos
// ou seja, criando um operador
// já o search é um operador que identifica nos campos de consulta aqueles que se parecem com tal coisa
noteSchema.index({'title': 'text', 'body': 'text'})

module.exports = mongoose.model('Note', noteSchema)