// import shell from 'shelljs';
// import sendVideoToTwitter from "./twitter";
import { CronJob } from 'cron';
import { download_image } from "./utils";

const debug = true;

const config = [
  {
    imageURL: 'http://192.168.11.52/capture?_cb=1619016818033',
    cron: '* * * * *', // once per minute
    lat: -22.594164,
    lng: -47.386982,
    tz: 'America/Sao_Paulo',
    dir: 'manjericao_daily'
  },
  {
    imageURL: 'http://192.168.11.52/capture?_cb=1619016818033',
    cron: '*/30 * * * *', // 30 minutes
    lat: -22.594164,
    lng: -47.386982,
    tz: 'America/Sao_Paulo',
    dir: 'manjericao_weekly'
  },
  {
    imageURL: 'http://192.168.11.52/capture?_cb=1619016818033',
    cron: '0 * * * *', // every hour
    lat: -22.594164,
    lng: -47.386982,
    tz: 'America/Sao_Paulo',
    dir: 'manjericao_monthly'
  }
];

let cjDaily = new CronJob(config[0].cron, async () => {
  try {    
    download_image(config[0]);    
  } catch (e: any) {
    console.log(e);
  }
}, null, true, config[0].tz);

let cjWeekly = new CronJob(config[1].cron, async () => {
  try {    
    download_image(config[1]);    
  } catch (e: any) {
    console.log(e);
  }
}, null, true, config[1].tz);

let cjMonthly = new CronJob(config[2].cron, async () => {
  try {    
    download_image(config[2]);    
  } catch (e: any) {
    console.log(e);
  }
}, null, true, config[2].tz);

console.log("⚡️ Starting cronjobs");
if (!cjDaily.running) {
  console.log(' ⏰ - Daily OK');
  cjDaily.start();
}

if (!cjWeekly.running) {
  console.log(' ⏰ - Weekly OK');
  cjWeekly.start();
}

if (!cjMonthly.running) {
  console.log(' ⏰ - Monthly OK');
  cjMonthly.start();
}