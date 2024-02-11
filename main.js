// {"name": "Air Hockey Challenger", "author": "Alex Dev", "version": "04012023", "icon": "ic_launcher.png", "file": "main.js"}
var font = new Font("fonts/LEMONMILK-Regular.otf");
let canvas = Screen.getMode();

canvas.width = 640;
canvas.height = 448;
Screen.setMode(canvas);

Sound.setVolume(100);
Sound.setVolume(100, 0);
let timer = Timer.new();
let tracks = {
  thema: Sound.load('assets/sound/snd01.wav'),
  gol: Sound.load('assets/sound/snd02.adp'),
  winner: Sound.load('assets/sound/snd17.adp'),
  loser: Sound.load('assets/sound/snd10.adp'),
  paddle_0: Sound.load('assets/sound/snd13.adp'),
  paddle_1: Sound.load('assets/sound/snd14.adp'),
  ball_to_wall: Sound.load('assets/sound/snd15.adp'),
  efect: Sound.load('assets/sound/snd03.adp')
}
var track = tracks.thema;
var duration = Sound.duration(track);
Timer.reset(timer);

let particles = []; 

const Players = {
  Player1: [{ X: 569, Y: 195, gols : 0}],
  Player2: [{ X: 13, Y: 195, gols : 0}]
};

const GameImage = {
  bg: new Image("assets/game/arena.png",RAM),
  ball: new Image("assets/game/game_img_puck0.png",RAM),
  red: new Image("assets/game/game_ing_paddle0_0.png",RAM),
  blue: new Image("assets/game/game_ing_paddle0_1.png",RAM),
  winner: new Image("assets/game/result/result_text_youwin.png",RAM),
  loser: new Image("assets/game/result/result_text_youlose.png",RAM),
  gool: new Image("assets/game/result/result_text_youlose.png",RAM)
};



var screen = 0;
const Ball = { X: 285, Y: 190,dx: 3,
  dy: 3,
  radius: 16,};
let valueAfterX = 0;
let valueAfterY = 0;
let new_pad = Pads.get();
let old_pad = new_pad;
let pd = Pads.get();
let pd2 = Pads.get();
var velocidade = 8;
var ballSpeedX = 8;
var ballSpeedY = 8;
var speed_cpu = 8;
var life_particle = 0.0;
let Nums = {
  nums_red : new Image("assets/num/num_blue_"+Players.Player2[0].gols+".png",RAM),
  nums_blue : new Image( "assets/num/num_blue_"+Players.Player1[0].gols+".png",RAM)
}
let op_seta = 
  [{ x: 388, y: 135 },
  { x: 388, y: 187 },
  { x: 388, y: 243 },
  { x: 388, y: 295 },
  { x: 388, y: 347 }];
let seta = 
  [{ x: 388, y: 317 },
  { x: 388, y: 357 },
  { x: 388, y: 397 }];

let seta_pos = seta[0]
let seta_option_pos = op_seta[0];
let Count = 0;
var selected = 0;
var difficulty = 0;
var c = 0;

const MenuImage = {
  menu: new Image("assets/mainmenu/mainmenu.png",RAM),
  menu_pause: new Image("assets/mainmenu/menu_pause.png",RAM),
  menu_opçoes: new Image("assets/mainmenu/menu_opcões.png",RAM),
  hand_difficulty: new Image("assets/mainmenu/difficulty.png",RAM),
  seta: new Image("assets/mainmenu/Check.png",RAM)
};
class main {
  SetScreen() {
    if (screen == 0) {
      this.Menu();
    }
    if (screen == 1) {
      this.Play();
    }
    if (screen == 2){
      this.menu_pause();
    }
    if (screen == 3){
      this.menu_opçoes();
    }
    
  }
  Menu() {
    Sound.play(tracks.thema);
    Sound.repeat(true);
    old_pad = new_pad;
    new_pad = Pads.get();
    
    
    if (Pads.check(new_pad, Pads.UP) && !Pads.check(old_pad, Pads.UP)) {
      Sound.play(tracks.efect);
      if (Count > 0){
        seta_pos = seta[Count -= 1];
      }
    }
    if (Pads.check(new_pad, Pads.DOWN) && !Pads.check(old_pad, Pads.DOWN)) {
      Sound.play(tracks.efect);
      if (Count < 2){
        seta_pos = seta[Count += 1];
        
      }
    }

    if (Pads.check(new_pad, Pads.CROSS) && !Pads.check(old_pad, Pads.CROSS) && Count == 0) {
      Players.Player1[0].gols = 0;
      Players.Player2[0].gols = 0;
      Nums = {
        nums_red : new Image("assets/num/num_blue_"+Players.Player2[0].gols+".png",RAM),
        nums_blue : new Image( "assets/num/num_blue_"+Players.Player1[0].gols+".png",RAM)
      }
      screen = 1;
      Sound.play(tracks.gol);
      this.ResetBall();
      this.ResetPlayers();
    }
    if (Pads.check(new_pad, Pads.CROSS) && !Pads.check(old_pad, Pads.CROSS)&& Count == 1) {
      Players.Player1[0].gols = 0;
      Players.Player2[0].gols = 0;
      Nums = {
        nums_red : new Image("assets/num/num_blue_"+Players.Player2[0].gols+".png",RAM),
        nums_blue : new Image( "assets/num/num_blue_"+Players.Player1[0].gols+".png",RAM)
      }
      screen = 1;
      Sound.play(tracks.gol);
      this.ResetBall();
      this.adjuste_difficulty();
    }
    if (Pads.check(new_pad, Pads.CROSS) && !Pads.check(old_pad, Pads.CROSS)&& Count == 2) {
      screen = 3;
      Sound.play(tracks.gol);
      
      
    }
    MenuImage.menu.draw(0, 0);
    MenuImage.seta.draw(seta_pos.x, seta_pos.y);
  }

  menu_pause(){
    old_pad = new_pad;
    new_pad = Pads.get();
    
    MenuImage.menu_pause.draw(0,0);
    MenuImage.seta.draw(seta_pos.x,seta_pos.y);

    if (Pads.check(new_pad, Pads.UP) && !Pads.check(old_pad, Pads.UP)) {
      Sound.play(tracks.efect);
      if (selected > 0){
        seta_pos = seta[selected -= 1];
      }
    }
    if (Pads.check(new_pad, Pads.DOWN) && !Pads.check(old_pad, Pads.DOWN)) {
      Sound.play(tracks.efect);
      if (selected < 2){
        seta_pos = seta[selected += 1];
      }
    }
    if (Pads.check(new_pad, Pads.CROSS) && !Pads.check(old_pad, Pads.CROSS)&& selected == 0) {
      Nums = {
        nums_red : new Image("assets/num/num_blue_"+Players.Player2[0].gols+".png",RAM),
        nums_blue : new Image( "assets/num/num_blue_"+Players.Player1[0].gols+".png",RAM)
      }
      screen = 1;
      Sound.play(tracks.gol);
      this.ResetBall();
    
    }
    if (Pads.check(new_pad, Pads.CROSS) && !Pads.check(old_pad, Pads.CROSS)&& selected == 1) {
      Players.Player1[0].gols = 0;
      Players.Player2[0].gols = 0;
      Nums = {
        nums_red : new Image("assets/num/num_blue_"+Players.Player2[0].gols+".png",RAM),
        nums_blue : new Image( "assets/num/num_blue_"+Players.Player1[0].gols+".png",RAM)
      }
      screen = 1;
      Sound.play(tracks.gol);
      this.ResetBall();
      this.ResetPlayers();
      Players.Player1[0].gols = 0;
      Players.Player2[0].gols = 0;
    }
    if (Pads.check(new_pad, Pads.CROSS) && !Pads.check(old_pad, Pads.CROSS) && selected == 2) {
      screen = 0;
      Sound.play(tracks.gol);
      
      
    }
  }

  menu_opçoes(){
    old_pad = new_pad;
    new_pad = Pads.get();
    
    if (Pads.check(new_pad, Pads.UP) && !Pads.check(old_pad, Pads.UP)) {
      Sound.play(tracks.efect);
      if (c > 0){
        seta_option_pos = op_seta[c -= 1];
      }
    }
    if (Pads.check(new_pad, Pads.DOWN) && !Pads.check(old_pad, Pads.DOWN)) {
      Sound.play(tracks.efect);
      if (c < 4){
        seta_option_pos = op_seta[c += 1];
      }
      
    }
    if (Pads.check(new_pad, Pads.CROSS) && !Pads.check(old_pad, Pads.CROSS)) {
      Sound.play(tracks.gol);
      if (c >= 0 && c <= 3){
        difficulty = c;
      }
      if (c == 4){
        screen = 0;
      }
    }
    MenuImage.menu_opçoes.draw(0,0);
    MenuImage.hand_difficulty.draw(423, op_seta[difficulty].y);
    MenuImage.seta.draw(seta_option_pos.x, seta_option_pos.y);
    
  }
  
  pause_thema(){
    let scrm = screen;
    if (scrm == 1){
      Sound.pause(tracks.thema);
    }else{
      Sound.play(tracks.thema);
    }
  }
  
  ResetPlayers(){
    Players.Player1[0].X = 569;
    Players.Player1[0].Y = 189;
    Players.Player2[0].X = 13;
    Players.Player2[0].Y = 189;
  }
 

  normalize_value(add_value){
    return ((add_value - -448) / (640 - -448) * (15 - -15) + -15);
  }

  adjuste_difficulty(){
    if (difficulty == 0){
      speed_cpu = 4;
    }else if (difficulty == 1){
      speed_cpu = 8;
    }else if(difficulty == 2){
      speed_cpu = 12;
    }else if(difficulty == 3){
      speed_cpu = 15;
    }
  }


  updateParticles() {
    for (let i = 0; i < particles.length; i++) {
      particles[i].x += particles[i].dx;
      particles[i].y += particles[i].dy;
      particles[i].life -= 2.0;
      // Remover partícula quando atingir o tempo de vida
      if (particles[i].life <= 0) {
        particles.splice(i,1);
        i--;  // Decrementar i para evitar problemas ao remover elementos do array
      }
      for (let i = 0; i < particles.length; i++) {
        particles[i].color.draw(particles[i].x, particles[i].y);
      }
    }
  }
  track_inPlay(audio){
    if(Sound.isPlaying()) {
      Sound.pause(track);
      Timer.reset(timer);
    }
    track = audio;
    Sound.play(track);
  }
  createParticles(x, y, num,sprite) {
    particles = [];
    for (let i = 0; i < num; i++) {
        particles.push({
            x,
            y,
            dx: Math.random() * 6 - 3, // velocidade aleatória em x
            dy: Math.random() * 6 - 3, // velocidade aleatória em y
            life: 66.0,
            color: sprite
        });
    }
  }
  
  ResetBall(){
    ballSpeedX = 0;
    ballSpeedY = 0;
    Ball.X = 304;
    Ball.Y = 208;
  }

  
  Move_paddles() {
    old_pad = new_pad;
    new_pad = Pads.get();
    if (Pads.check(new_pad, Pads.START) && !Pads.check(old_pad, Pads.START)) {
      this.start();
    }
    pd = Pads.get();
    if (pd.rx < -50) {
      Players.Player1[0].X = Players.Player1[0].X - velocidade;
    }
    if (pd.rx > 50) {
      Players.Player1[0].X = Players.Player1[0].X + velocidade;
    }
    if (pd.ry > 50) {
      Players.Player1[0].Y = Players.Player1[0].Y + velocidade;
    }
    if (pd.ry < -50) {
      Players.Player1[0].Y = Players.Player1[0].Y - velocidade;
    }
    // move paddle 1
    pd2 = Pads.get();
    if (pd2.lx < -50) {
      Players.Player2[0].X = Players.Player2[0].X - velocidade;
    }
    if (pd2.lx > 50) {
      Players.Player2[0].X = Players.Player2[0].X + velocidade;
    }
    if (pd2.ly > 50) {
      Players.Player2[0].Y = Players.Player2[0].Y + velocidade;
    }
    if (pd2.ly < -50) {
      Players.Player2[0].Y = Players.Player2[0].Y - velocidade;
    }
    
    // Verificar colisão com os jogadores (paddles)
    if // paddle esq
    //right colison e down
    ((Ball.X <= Players.Player2[0].X + 70 && Ball.X + 32 >= Players.Player2[0].X) && 
    (Ball.Y <= Players.Player2[0].Y + 70 && Ball.Y + 32 >= Players.Player2[0].Y))
    { 
      ballSpeedY = -ballSpeedY;
      ballSpeedX = -ballSpeedX;
      this.track_inPlay(tracks.paddle_0);
      this.createParticles(Ball.X,Ball.Y, 5, new Image('assets/effect/light_green.png'));
      if (Players.Player2[0].Y < valueAfterX){
        ballSpeedY = +this.normalize_value(Players.Player2[0].Y);
      }else if(Players.Player2[0].Y === valueAfterX){
        ballSpeedY= 0;
      }else{
        ballSpeedY -= this.normalize_value(Players.Player2[0].Y);
      }
      ballSpeedX = -this.normalize_value(Players.Player1[0].X);
      valueAfterX = Players.Player2[0].Y;
    } 
    //leff colision e top
    else if((Ball.X + 32 >= Players.Player2[0].X && Ball.X <= Players.Player2[0].X + 70) && 
    (Ball.Y + 32 >= Players.Player2[0].Y && Ball.Y <= Players.Player2[0].Y + 70))
    { 
      ballSpeedY = -ballSpeedY;
      ballSpeedX = -ballSpeedX;
      this.track_inPlay(tracks.paddle_0);
      this.createParticles(Ball.X ,Ball.Y + 32, 5,new Image('assets/effect/light_green.png'));
      if (Players.Player2[0].Y < valueAfterX){
        ballSpeedY = +this.normalize_value(Players.Player2[0].Y);
      }else if(Players.Player2[0].Y === valueAfterX){
        ballSpeedY = 0;
      }else{
        ballSpeedY -= this.normalize_value(Players.Player2[0].Y);
      }
      
      ballSpeedX = +this.normalize_value(Players.Player1[0].X);
      valueAfterX = Players.Player2[0].Y;
    }
    
    
    if // paddle right
    //right colison e down
    ((Ball.X <= Players.Player1[0].X + 70 && Ball.X + 32 >= Players.Player1[0].X) && 
    (Ball.Y <= Players.Player1[0].Y + 70 && Ball.Y + 32 >= Players.Player1[0].Y))
    { 
      ballSpeedY = -ballSpeedY;
      ballSpeedX = -ballSpeedX;
      this.track_inPlay(tracks.paddle_0);
      this.createParticles(Ball.X,Ball.Y, 5,new Image('assets/effect/light_red.png'));
      if (Players.Player1[0].Y < valueAfterX){
        ballSpeedY = +this.normalize_value(Players.Player1[0].Y);
      }else if(Players.Player1[0].Y === valueAfterY){
        ballSpeedY = 0;
      }else{
        ballSpeedY -= this.normalize_value(Players.Player1[0].Y);
      }
      ballSpeedX = +this.normalize_value(Players.Player1[0].X);
      valueAfterY = Players.Player1[0].Y;
      
    } 
    //leff colision e top
    else if((Ball.X + 32 >= Players.Player1[0].X && Ball.X <= Players.Player1[0].X + 70) && 
    (Ball.Y + 32 >= Players.Player1[0].Y && Ball.Y <= Players.Player1[0].Y + 70))
    { 
      ballSpeedY = -ballSpeedY;
      ballSpeedX = -ballSpeedX;
      this.track_inPlay(tracks.paddle_0);
      this.createParticles(Ball.X ,Ball.Y + 32, 5,new Image('assets/effect/light_red.png'));
      if (Players.Player1[0].Y < valueAfterX){
        ballSpeedY = +this.normalize_value(Players.Player1[0].Y);
      }else if(Players.Player1[0].Y === valueAfterY){
        ballSpeedY = 0;
      }else{
        ballSpeedY -= this.normalize_value(Players.Player1[0].Y);
      }
      ballSpeedX -= this.normalize_value(Players.Player1[0].X);
      valueAfterY = Players.Player1[0].Y;
    }
    if(Count == 1){
      if  ( Players.Player2[0].X > Ball.X + 32){
        Players.Player2[0].X -= speed_cpu; 
      }
      if (Players.Player2[0].Y + 35 < Ball.Y + 16)
        {
          Players.Player2[0].Y += speed_cpu;
        }
        else if (Players.Player2[0].Y + 35 > Ball.Y + 16) {
          Players.Player2[0].Y -= speed_cpu; 
        }
      if(Ball.X > 320){
        Players.Player2[0].X -= speed_cpu;
      }else{
        Players.Player2[0].X += speed_cpu;
        
       
      }
    }
    // red color arena 
    if ((Ball.Y <= 10 && Ball.X + 32< 320 )){
      this.track_inPlay(tracks.ball_to_wall);
      ballSpeedY = -ballSpeedY;
      this.createParticles(Ball.X + 16,Ball.Y, 5,new Image('assets/effect/light_red.png'));
    }else if((Ball.X <=10 && Ball.Y + 32<= 135)){
      this.track_inPlay(tracks.ball_to_wall);
      ballSpeedX = -ballSpeedX; 
      this.createParticles(Ball.X ,Ball.Y + 16, 5,new Image('assets/effect/light_red.png'));
    };
    // yellon color arena 
    if ((Ball.Y <= 10 && Ball.X +32> 320 )){
      this.track_inPlay(tracks.ball_to_wall);
      ballSpeedY = -ballSpeedY;
      this.createParticles(Ball.X + 16,Ball.Y, 5,new Image('assets/effect/light_white.png'));
    }else if((Ball.X + 32 >= 630 && Ball.Y + 32<= 135)){
      this.track_inPlay(tracks.ball_to_wall);
      ballSpeedX = -ballSpeedX; 
      this.createParticles(Ball.X + 16,Ball.Y + 16, 5,new Image('assets/effect/light_white.png'));
    }
    // green color arena 
    if ((Ball.Y + 32>= 438 && Ball.X + 32< 320 )){
      this.track_inPlay(tracks.ball_to_wall);
      ballSpeedY = -ballSpeedY;
      this.createParticles(Ball.X + 16 ,Ball.Y + 16, 5,new Image('assets/effect/light_green.png'));
    }else if ((Ball.X <=10 && Ball.Y + 32 >= 315)){
      this.track_inPlay(tracks.ball_to_wall);
      ballSpeedX = -ballSpeedX; 
      this.createParticles(Ball.X,Ball.Y + 16, 5,new Image('assets/effect/light_green.png'));
    }
    // Blue color arena 
    if ((Ball.Y + 32 >= 438 && Ball.X + 32> 320 )){
      this.track_inPlay(tracks.ball_to_wall);
      ballSpeedY = -ballSpeedY;
      this.createParticles(Ball.X + 16 ,Ball.Y + 16, 5,new Image('assets/effect/light_blue.png'));
    }else if ((Ball.X + 32 >=630 && Ball.Y + 32>= 315)){
      this.track_inPlay(tracks.ball_to_wall);
      ballSpeedX = -ballSpeedX; 
      this.createParticles(Ball.X + 16 ,Ball.Y + 16, 5,new Image('assets/effect/light_blue.png'));
    }
    
    //Colisão dos paddle com a parede
    if (Players.Player1[0].X < 285) {
      //meio
      Players.Player1[0].X = 285;
    }
    if (Players.Player1[0].Y > 378) {
      //baixo
      Players.Player1[0].Y = 378;
    }
    if (Players.Player1[0].Y < 0) {
      //cima
      Players.Player1[0].Y = 0;
    }
    if (Players.Player1[0].X > 570) {
      //fim direita
      Players.Player1[0].X = 570;
    }

    //player 2
    if (Players.Player2[0].X > 285) {
      //meio
      Players.Player2[0].X = 285;
    }
    if (Players.Player2[0].Y > 378) {
      //baixo
      Players.Player2[0].Y = 378;
    }
    if (Players.Player2[0].Y < 0) {
      //cima
      Players.Player2[0].Y = 0;
    }
    if (Players.Player2[0].X < 0) {
      //fim esquerda
      Players.Player2[0].X = 0;
    }
  }
  draw() {
    GameImage.bg.draw(0, 0);
    GameImage.ball.draw(Ball.X, Ball.Y);
    GameImage.red.draw(Players.Player1[0].X, Players.Player1[0].Y);
    GameImage.blue.draw(Players.Player2[0].X, Players.Player2[0].Y);
    Nums.nums_blue.draw(272,25);
    Nums.nums_red.draw(330,25);
  }
  
  WinnerPlayer(){
    if(Players.Player1[0].gols == 5){
      this.track_inPlay(tracks.loser);
      GameImage.loser.draw(((640 - 373)/2), ((448 - 83)/2));
      this.ResetBall();
      this.ResetPlayers();
      font.print(110,375 , "pressione X para continuar!");
      if (Pads.check(new_pad, Pads.CROSS) && !Pads.check(old_pad, Pads.CROSS)){
        Players.Player1[0].gols = 0;
        Players.Player2[0].gols = 0;
        this.track_inPlay(tracks.gol);
        screen = 0;
      
      }
    }else if(Players.Player2[0].gols == 5){
      this.track_inPlay(tracks.winner);
      GameImage.winner.draw(((640 - 402)/2), ((448 - 84)/2));
      this.ResetBall();
      this.ResetPlayers();
      font.print(110,375 , "pressione X para continuar!");
      if (Pads.check(new_pad, Pads.CROSS) && !Pads.check(old_pad, Pads.CROSS)){
        Players.Player1[0].gols = 0;
        Players.Player2[0].gols = 0;
        this.track_inPlay(tracks.gol);
        screen = 0;
      }
    }
  }
  check_gol(){
    if ((Ball.X <= 5) && (Ball.Y >= 125 && Ball.Y + 32 <= 325)) {
      Players.Player2[0].gols += 1;
      this.track_inPlay(tracks.gol);
      ballSpeedX = 0;
      ballSpeedY = 0;
      Ball.X = 242;
      Ball.Y = 208;
      this.ResetPlayers();
      this.createParticles(Ball.X + 16,Ball.Y + 16, 5, new Image('assets/effect/light_red.png'));
      Nums = {
        nums_red : new Image("assets/num/num_blue_"+Players.Player2[0].gols+".png",RAM),
        nums_blue : new Image( "assets/num/num_blue_"+Players.Player1[0].gols+".png",RAM)
      }
        
    }

    if ((Ball.X + 32 >= 635) && (Ball.Y  >= 125 && Ball.Y + 32 <= 325)) {
      Players.Player1[0].gols += 1;
      this.track_inPlay(tracks.gol);
      ballSpeedX = 0;
      ballSpeedY = 0;
      Ball.X = 364;
      Ball.Y = 208;
      this.ResetPlayers();
      this.createParticles(Ball.X + 16,Ball.Y + 16, 5, new Image('assets/effect/light_green.png'));
      Nums = {
        nums_red : new Image("assets/num/num_blue_"+Players.Player2[0].gols+".png",RAM),
        nums_blue : new Image( "assets/num/num_blue_"+Players.Player1[0].gols+".png",RAM)
      }
  }
  }
  start(){
    old_pad = new_pad;
    new_pad = Pads.get();
    if (Pads.check(new_pad, Pads.START) && !Pads.check(old_pad, Pads.START) && screen == 1) {
      screen = 2;
    }
    
    
  }
  MoveBall() {
    Ball.X -= ballSpeedX;
    Ball.Y -= ballSpeedY;
    //desacelacao do vetores positivos
    if (ballSpeedX > 8) {
      ballSpeedX--;
    }
    if (ballSpeedY > 8) {
      ballSpeedY--;
    }
    // desacelaracao dos vetores negativos
    if (ballSpeedX < -8) {
      ballSpeedX++;
    }
    if (ballSpeedY < -8) {
      ballSpeedY++;
    }
  }

  Play() {
    this.Move_paddles();
    this.draw();
    this.updateParticles();
    this.start();
    this.MoveBall();  // Adicionando a movimentação da bola
    this.pause_thema();
    this.check_gol();
    this.WinnerPlayer();
  }
  
}
const Game = new main();
os.setInterval(() => {
  Screen.clear();
  Game.SetScreen();
  Screen.waitVblankStart();
  Screen.flip();
},0);
