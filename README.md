
## FotoJS

Projeto criado para ajudar a fazer download das imagens geradas por um ESP32Cam do crescimento de algumas plantas aqui de casa, para posterior criação de um timelapse.

Esse aplicativo busca uma foto a cada Minuto (tempo pode ser configurado) e salva em um diretório.

  
## Authors

- [@kadu](https://www.github.com/kadu)

  
## Features

- Tirar foto apenas quando tiver sol (baseado no nascer e por do sol)
- Download das fotos salvas em um diretório por dia

  
## Instalação

Faça o clone do github, configure as variavies de config no topo do arquivo.

```bash 
  npm install
  npm start
```
    
## Lessons Learned

Use Typescript to write this simple project was easy

  
##
// sendVideoToTwitter('my-saida0.mp4');
//console.log(shell.exec('ffmpeg -framerate 30 -pattern_type glob -i "./dist/uploads/2021_05_31/*.jpg" -s:v 800x600 -c:v libx264 -crf 17 -pix_fmt yuv420p -strict -2 -acodec aac my-saida0.mp4').code);