function berries(x, y, z, ...rest){
  if (x===undefined || y===undefined || z==undefined){
      return -1;
  }  
  else if(rest.length != 0){
      return -2;
    } else if (!Number.isInteger(x) || !Number.isInteger(y) || !Number.isInteger(z)){
      return -3;
    } else if((x<0 || x>1000) || (y<0 || y>1000) || (z<0 || z>2000)){
      return -4;
    } else if ((x+y-z)<0){
      return -5;
  } else { return x+y-z }
}

module.exports = berries

