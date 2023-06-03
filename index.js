const axios = require('axios');
const fs = require('fs');
const crypto = require('crypto');

function fetchData(url) {
    return axios.get(url)
        .then(response => response.data.data)
        .catch(error => {
            throw new Error(`Error al obtener los datos: ${error}`);
        });
}

function splitData(data) {
    const dataSplit = data.split(',');
    const dataSplitList = [];

    for (let i = 0; i < dataSplit.length; i += 2) {
        const pair = dataSplit.slice(i, i + 2);
        const obj = {};

        pair.forEach(item => {
            const [key, value] = item.split('=');
            obj[key.trim()] = value.trim();
        });

        dataSplitList.push(obj);
    }

    return dataSplitList;
}

function filterDataByAge(dataList, age) {
    return dataList.filter(item => parseInt(item.age) === age);
}

function generateOutputFile(dataList, filename) {
    const keyValues = dataList.map(item => item.key);
    const keyOutput = keyValues.join('\n');
    //console.log(keyValues)

    try {
        fs.writeFileSync(filename, keyOutput);
        console.log(`Archivo "${filename}" generado.`);
    } catch (error) {
        throw new Error(`Error al generar el archivo "${filename}": ${error}`);
    }
}

function generateEncryptedFile(dataList, filename) {
    const ageValues = dataList.map(item => item.age);
    const ageOutput = ageValues.map(age => {
        return crypto.createHash('sha1').update(age).digest('hex');
    }).join('\n');

    console.log(ageOutput)

   /* try {
        fs.writeFileSync(filename, ageOutput);
        console.log(`Archivo "${filename}" generado.`);
    } catch (error) {
        throw new Error(`Error al generar el archivo "${filename}": ${error}`);
    }*/
}

function processData(url) {
    fetchData(url)
        .then(data => {
            const dataSplitList = splitData(data);
            const setFilterAge = 32;
            const outputList = filterDataByAge(dataSplitList, setFilterAge);
            const userCount = outputList.length;

            if (userCount === 0) {
                console.log("No existen usuarios con esa edad.");
            } else {
                console.log(`Existen ${userCount} registros de usuarios con ${setFilterAge} años de edad.`);

                generateOutputFile(outputList, 'output.txt');
                generateEncryptedFile(outputList, 'encrypted_age.txt');
            }


        })
        .catch(error => {
            console.log('Error:', error.message);
        });
}

// Llamada a la función principal para iniciar el procesamiento
processData('https://coderbyte.com/api/challenges/json/age-counting');
