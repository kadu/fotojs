import axios from 'axios';
import fs from 'fs';
import { getSunrise, getSunset } from 'sunrise-sunset-js';
import { CronJob } from 'cron';
import shell from 'shelljs';
import sendVideoToTwitter from "./twitter";


const configDaily = {
  imageURL: 'http://192.168.11.52/capture?_cb=1619016818033',
  cron: '* * * * *', // once per minute
  lat: -22.594164,
  lng: -47.386982,
  tz: 'America/Sao_Paulo',
  dir: 'uploads'
}

const configWeekly = {
  imageURL: 'http://192.168.11.52/capture?_cb=1619016818033',
  cron: '* */1 * * *', // once per minute
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

let pathToSave = (addDir: string = '') => {  
  let dir = configDaily.dir;
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();
  let hour = String(today.getHours()).padStart(2,'0');
  let min  = String(today.getMinutes()).padStart(2,'0');
  let secs = String(today.getSeconds()).padStart(2,'0');

  let formatedDate;
  if(addDir.length > 0) {
    formatedDate = addDir + osSlash + yyyy + '_' + mm + '_' + dd;
  } else {
    formatedDate = yyyy + '_' + mm + '_' + dd;
  }
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
  if(!hasSun(configDaily.lat, configDaily.lng)) {
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

let cjDaily = new CronJob(configDaily.cron, async () => {
  try {    
    let imageFilePath =  pathToSave('allDay');
    download_image(configDaily.imageURL, imageFilePath);    
  } catch (e: any) {
    console.log(e);
  }
}, null, true, configDaily.tz);

let cjWeekly = new CronJob(configWeekly.cron, async () => {
  try {    
    let imageFilePath =  pathToSave('weekly');
    download_image(configWeekly.imageURL, imageFilePath);    
  } catch (e: any) {
    console.log(e);
  }
}, null, true, configWeekly.tz);

console.log("⚡️ Starting cronjobs");
if (!cjDaily.running) {
  console.log('⏰ - Daily OK');
  cjDaily.start();
}

if (!cjWeekly.running) {
  console.log('⏰ - Weekly OK');
  cjWeekly.start();
}

// sendVideoToTwitter('my-saida0.mp4');
//console.log(shell.exec('ffmpeg -framerate 30 -pattern_type glob -i "./dist/uploads/2021_05_31/*.jpg" -s:v 800x600 -c:v libx264 -crf 17 -pix_fmt yuv420p -strict -2 -acodec aac my-saida0.mp4').code);