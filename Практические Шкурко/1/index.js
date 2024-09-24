const fs = require('fs');
const { format } = require('date-fns');
var readline = require('readline');

// Создаем потоки для записи файлов input_IN.txt и input_OUT.txt
  const input_IN = fs.createWriteStream('output_in.txt');
  const input_OUT = fs.createWriteStream('output_out.txt');
  
// поток для создания потока для чтения файла
  const inStream = fs.createReadStream('input.txt');

  const rl = readline.createInterface({
  input: inStream,      //открытие потока для чтения файла
  crlfDelay: Infinity // для распознавания переноса строки в Windows
  });

  rl.on('line', (line) => {
    const [date, time, type, id] = line.split(' ');
    const D = date + ' ' + time;
    const date1 = new Date(D);
    if (type === 'IN') {
        input_IN.write(`${format(date1, 'dd.MM.yyyy HH:mm')} ${type} ${id}\n`);
    } else if (type === 'OUT') {
      input_OUT.write(`${format(date1, 'dd.MM.yyyy HH:mm')} ${type} ${id}\n`);
      }
  });
      
// Обработчик события close для закрытия потоков записи
  rl.on('close', () => {
    input_IN.end();
    input_OUT.end();
  });