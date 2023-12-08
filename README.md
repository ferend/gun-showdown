# gun-showdown
Multiplayer Phaser 3 game with socket.io (with typescript support).

To get started, adjust /src/scripts/game.ts to configure your game and import scenes. Then, add your scenes to the ./scenes folder. For multiplayer, socket commmunicatioon shouold be added to the /src/scripts/backend/GameCommunication.ts

##  -----------to local test---------------------
npm run start
npm run build to local build 

##  -----------to compile and run on server---------------------
npm run build-front<br />
npm run build-back<br />
npm run server <br />


### Tip:
You can use bash below for errors coming from new Node versions like ("Error: error:0308010C:digital envelope routines::unsupported")
```bash 
run: npm config set legacy-peer-deps true 
```bash