const fs = require('fs')

const db = 'db.json'

const koders = {koders : []}

function init () {
    const fileExist = fs.existsSync(db);

    if(!fileExist) {
        fs.writeFileSync(db, JSON.stringify(koders));
    }
}

init()

const express = require('express')

const server = express()

server.use(express.json())

server.get('/koders', (request, response) => {
    const content = fs.readFileSync(db)
    response.json(JSON.parse(content))
})

server.post('/koders', (request, response) => {
    const { name, generation, gender, age, isActive } = request.body;

    if (!name || generation === undefined || !gender || age === undefined || isActive === undefined) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const newKoder = {
        name: name,
        generation: generation,
        gender: gender,
        age: age,
        isActive: isActive
    };
    
    const content = fs.readFileSync(db, 'utf8')
    const json = JSON.parse(content)

    json.koders.push(newKoder)

    fs.writeFileSync(db, JSON.stringify(json))
    response.status(200).json({
        success: 'koder add',
        koders : json.koders
    })
})

server.delete('/koders/:id', (request, response) => {
    const content = fs.readFileSync(db, 'utf8')
    const json = JSON.parse(content)
    const id = parseInt(request.params.id)

    if(isNaN(id)) {
        response.status(400).json({ 
            error : 'invalid index, must be a number'
        })
        return
    } 

    if(id < 0 || id >= koders.length) {
        response.status(400).json({
            error : 'index out of range',
        })
        return
    }

    json.koders.splice(id, 1)

    fs.writeFileSync(db, JSON.stringify(json))
    response.json({
        message: 'koder have been deleted',
        koders : json.koders
    })
})

server.delete('/koders', (req, res) => {
    const newContent = { koders: [] };

    fs.writeFileSync(db, JSON.stringify(newContent));

    res.json({
        success: true,
        message: 'All koders have been deleted'
    });
});

server.listen(8080, () => {
    console.log('Server is running')
})