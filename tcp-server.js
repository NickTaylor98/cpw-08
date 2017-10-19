const net = require('net');
const fs = require('fs');
const child_process = require('child_process');
//let clients = [];
const port = 1824;
let clients = new Map();
let filename;
const server = net.createServer((client) => {
    client.setEncoding('utf8');
    client.on('data', (data, err) => {
        console.log(data.toString());
        let obj = JSON.parse(data);
        if (!obj.method) obj.method = 'get';
        switch (obj.method) {
            case 'create':
                {
                    const id = Math.floor(Math.random() * 1000000);
                    filename = __dirname + '/JSON/' + id + '_rand.json';
                    let pid = child_process.spawn('node', ['worker.js', filename, obj.X], { detached: true }).pid;
                    let date = new Date().toString();
                    let object = { pid: pid, id: id, startedOn: date };
                    //console.log(object);
                    clients.set(id, object);
                    write(client, object);
                }
                break;
            case 'delete':
                {
                    const id = parseInt(obj.id);
                    const clt = clients.get(id);
                    process.kill(clt.pid);
                    fs.readFile(__dirname + `/JSON/${id}_rand.json`, 'utf8', (err, data) => {
                        clt.numbers = JSON.parse(data);
                        write(client, clt);
                        clients.delete(id);
                    });
                }
                break;
            case 'get':
                {
                    const array = [];
                    clients.forEach(function(element) {
                        array.push(element);
                    }, this);
                    console.log(array);
                    write(client, array);
                }
                break;
        }
    });
    client.on('end', () => {
        console.log('Client disconnected');
    });
});
server.listen(port, () => {
    console.log(`Server listening on localhost: ${port}`);
});
function write(client, data)
{
    client.write(JSON.stringify(data));
}