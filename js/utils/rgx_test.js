export const isHex = (str) => {
  const re = /[0-9A-Fa-f]{6}/g;
  return re.test(str);
};

export const is256BitHex = (str) => {
  const re = /[0-9A-Fa-f]{64}/g;
  return re.test(str);
};

export const isBase64 = (str) => {
  try{
    atob(str);
    return true
  }catch(err){
    return false
  }
}