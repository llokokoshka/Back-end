function berries(str){

  const param = String(str).split(' ');

  if (param.length != 3){
      throw new Error('Количество аргументов не соответствует условию'); 
  }
  
  for (let params of param) {
    if (params.indexOf('0') == 0 && params.length > 1) {
    throw new Error('Элемент(-ы) содержат ведущие нули');
    }
  }
    
  const [x, y, z] = [Number(param[0]), Number(param[1]),Number(param[2])];

  if (isNaN(x) || isNaN(y) || isNaN(z)){
      throw new Error('Аргумент не является числом');
    } 
  if (!Number.isInteger(x) || !Number.isInteger(y) || !Number.isInteger(z)){
      throw new Error('Аргумент не является целочисленным');
    } 
  if((x<0 || x>1000) || (y<0 || y>1000)||(z<0 || z>2000)){
      throw new Error('Аргумент выходит за границы допустимых значений');
    } 
  if (x+y<z){
      throw new Error('Третий аргумент больше, чем сумма двух предыдущих');
  } 
const k = (x + y) - z;
return k.toString();
}

module.exports = berries  
