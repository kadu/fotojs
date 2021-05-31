import axios from 'axios';
import fs from 'fs';
import { getSunrise, getSunset } from 'sunrise-sunset-js';
import { CronJob } from 'cron';

const config = {
  imageURL: 'http://192.168.11.52/capture?_cb=1619016818033',
  cron: '* * * * *', // once per minute
  lat: -22.594164,
  lng: -47.386982,
  tz: 'America/Sao_Paulo',
  dir: 'uploads'
}

const osSlash = process.platform === 'win32' ? '\\' : '/';
let lastSun = true;

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

let pathToSave = () => {
  let dir = config.dir;
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();
  let hour = String(today.getHours()).padStart(2,'0');
  let min  = String(today.getMinutes()).padStart(2,'0');
  let secs = String(today.getSeconds()).padStart(2,'0');

  
  const formatedDate = yyyy + '_' + mm + '_' + dd;
  const imageNameAux = yyyy + '_' + mm + '_' + dd + '-' + hour + '_' + min + '_' + secs + '.jpg';;
  dir += `${osSlash}${formatedDate}`;
  dir = `${__dirname}${osSlash}${dir}`;
  const imageName = `${dir}${osSlash}${imageNameAux}`;

  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }

  return imageName;
}

const download_image = async (url: string, image_path: string) => {
  if(!hasSun(config.lat, config.lng)) {
    return; // cancel download at nigth (without Sun)
  }

  axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve(image_path))
          .on('error', (e:any) => reject(e));
      }),
  );
  console.log(`${image_path} saved!`);
}

let cronJob = new CronJob(config.cron, async () => {
  try {    
    let imageFilePath = pathToSave();
    download_image(config.imageURL, imageFilePath);    
  } catch (e: any) {
    console.log(e);
  }
}, null, true, config.tz);

if (!cronJob.running) {
  cronJob.start();
}
console.log("⚡️ Starting cronjobs");