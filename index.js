const express = require("express");
const pool = require("./connection");

const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors({
    origin: '*'
}));

let bug = [];


app.get('/', (request, response)=> {
    response.send('Hello Node');
});

app.get('/api/bug', (request, response)=> {
    pool.query("select * from bug", (err, result, fields)=>{
        if(err)
            response.status(404).send('Not Found');
        else
            response.status(200).send(result);
    });
});

app.get('/api/bug/:id', (request, response) => {
    const id = request.params.id;

    pool.query(`select * from bug where id = ? `,[id], (err, result, fields)=>{
        if(err)
            response.status(404).send('Not Found');
        else if(result != null)
            response.status(200).send(result);
        else {
            response.status(200).send('Not found');
        }
    });
});

app.put('/api/bug/:id', (request, response) => {
    const id = request.params.id;
    const name = request.body.name;
    const resolve = request.body.resolve;

    pool.query(`UPDATE bug SET name=?,resolve=? WHERE id = ?`,[name, resolve, id], (err, result, fields)=>{
        if(err)
            response.status(404).send('Not Found');
        else
            response.status(200).send(result);
    });
});

app.post('/api/bug', (request, response) => {
    const name = request.body.name;
    const resolve = request.body.resolve;
    pool.query(`INSERT INTO bug(name, resolve) VALUES (?, ?)`,[name, resolve], (err, result, fields)=>{
        if(err)
            response.status(404).send(err.message);
        else{
            const res = {
                id: result.insertId,
                name,
                resolve
            };
            response.status(200).send(res);
        }  
    });
});

const port =  process.env.PORT || 5000;
app.listen(port, () => console.log(`Listenning on Port ${port}...`));