# gun-showdown
! WIP !
Multiplayer Phaser 3 game with socket.io (with typescript and webpack support).

To get started, adjust /src/scripts/game.ts to configure your game and import scenes. Then, add your scenes to the ./scenes folder. For multiplayer, socket communication should be added to the /src/scripts/backend/GameCommunication.ts

##  To Local Test
npm run start / start-server<br />
npm run build <br /> (to local build) 

##  To Compile and Run on Server
npm run build-front<br />
npm run build-back<br />
npm run serve <br />


### Tip:
You can use bash below for errors coming from new Node versions like ("Error: error:0308010C:digital envelope routines::unsupported")
```bash 
run: npm config set legacy-peer-deps true 
