import axios from 'axios';
import { getSunrise, getSunset } from 'sunrise-sunset-js';
import fs from 'fs';
// import { response } from 'express';

const osSlash = process.platform === 'win32' ? '\\' : '/';
let lastSun = true;

let dirToSave = (baseDir: string = '') => {  
  if(baseDir.length === 0) {
    throw new Error("Necessário informar um diretório base");
  }

  let dir = `${__dirname}`;
  if(baseDir.length > 0) {
    dir += `${osSlash}${baseDir}${osSlash}`
  }

  return dir;
}

let pathToSave = (baseDir: string = '') => {  
  if(baseDir.length === 0) {
    throw new Error("Necessário informar um diretório base");
  }

  let dir = dirToSave(baseDir);
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();
  let hour = String(today.getHours()).padStart(2,'0');
  let min  = String(today.getMinutes()).padStart(2,'0');
  let secs = String(today.getSeconds()).padStart(2,'0');

  let formatedDate;
  formatedDate = yyyy + '_' + mm + '_' + dd;  
  
  const imageNameAux = yyyy + '_' + mm + '_' + dd + '-' + hour + '_' + min + '_' + secs + '.jpg';
  const imageName = `${dir}${imageNameAux}`;

  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
    fs.mkdirSync(dir+'ppp', { recursive: true });
  }

  return imageName;
}

const hasSun =(lat: number, lng: number) => {
  const sunset = getSunset(lat, lng);
  const sunrise = getSunrise(lat, lng);
  const check = new Date();
  const result = check <= sunset && check >= sunrise;

  if(lastSun !== result) {
    console.log( result ? "Sol" : "Noite");
    lastSun = result;
  }

  return (result);
}

const download_image = async (_config:any) => {
  if(!hasSun(_config.lat, _config.lng)) return; // cancel download at nigth (without Sun)


  const imagePath = pathToSave(_config.dir)

  axios({
    url: _config.imageURL,
    responseType: 'stream'
  }).then(
    response => 
      new Promise((resolve, reject) => {
      response.data
        .pipe(fs.createWriteStream(imagePath))
        .on('finish', () => resolve(imagePath))
        .on('error', (e:any) => reject(e));
      }),
  );

  console.log(`${imagePath} saved!`);
}

export {hasSun, pathToSave, download_image, dirToSave};