
import { scene, camera, screen, util, vector2 } from './basix.js';

const mainScreen = new screen();

const mainScene = new scene({
   screen: mainScreen
});

const mainCamera = new camera({
   screen: mainScreen,
   x: mainScreen.frame.width / 2,
   y: mainScreen.frame.height / 2
});

util.loop = delta => {
   mainScene
      .refill('#fff')
      .update(mainCamera);
}

Array.prototype.copy2d = function () {
   const copy = [];
   for (let i = 0; i < this.length; i++) {
      copy[i] = this[i].slice(0);
   }
   return copy.slice(0);
}

class state {
   constructor(blueprint) {
      if (blueprint === undefined) {
         this.map = Array(3).fill().map(() => Array(3).fill(''));
      } else {
         this.map = blueprint.map.copy2d();
      }
   }
   isFinish() {
      return (this.check() !== false);
   }
   check() { // o wins = 1, x wins = -1, draw = 0
      const { map } = this;
      for (let j = 0; j < 3; j++) {
         if (map[j][0] === map[j][1] && map[j][0] === map[j][2]) {
            if (map[j][0] === 'x') {
               return -1;
            } else if (map[j][0] === 'o') {
               return 1;
            }
         }
      }
      for (let i = 0; i < 3; i++) {
         if (map[0][i] === map[1][i] && map[0][i] === map[2][i]) {
            if (map[0][i] === 'x') {
               return -1;
            } else if (map[0][i] === 'o') {
               return 1;
            }
         }
      }
      if (map[0][0] === map[1][1] && map[0][0] === map[2][2]) {
         if (map[0][0] === 'x') {
            return -1;
         } else if (map[0][0] === 'o') {
            return 1;
         }
      }
      if (map[0][2] === map[1][1] && map[1][1] === map[2][0]) {
         if (map[1][1] === 'x') {
            return -1;
         } else if (map[1][1] === 'o') {
            return 1;
         }
      }
      for (let i = 0; i < 9; i++) {
         if (map[i % 3][Math.floor(i / 3)] === '') return false;
      }
      return 0;
   }
}

class tictactoe {
   constructor() {
      this.ai = 'x';
      this.turn = 'o';
      this.color = {
         r: 0,
         g: 0,
         b: 0
      };
      this.effects = {};
      this.size = 150;
      this.state = new state();
      this.finished = false;
      if (this.turn == this.ai) this.think();
   }
   mark(i, j) {
      if (this.state.map[i][j] !== '') {
         this.ping();
         return;
      };
      this.state.map[i][j] = this.turn;
      this.turn = (this.turn === 'x' ? 'o' : 'x');
      if (this.state.isFinish()) {
         this.end(this.state.check());
         return;
      }
      if (this.turn === this.ai) this.think();
   }
   think() {
      function minimax(currentState, depth, maximizing) {
         if (depth === 0 || currentState.isFinish()) {
            return currentState.check();
         }
         let mi, mj;
         if (maximizing) {
            let maxScore = -Infinity;
            for (let n = 0;n < 9;n++) {
               const i = n % 3;
               const j = Math.floor(n / 3);
               if (currentState.map[i][j] !== '') continue;
               const child = new state(currentState);
               child.map[i][j] = (maximizing ? 'o' : 'x');
               const childScore = minimax(child, depth - 1, false);
               maxScore = Math.max(maxScore, childScore);
            }
            return maxScore;
         } else {
            let minScore = Infinity;
            for (let n = 0;n < 9;n++) {
               const i = n % 3;
               const j = Math.floor(n / 3);
               if (currentState.map[i][j] !== '') continue;
               const child = new state(currentState);
               child.map[i][j] = (maximizing ? 'o' : 'x');
               const childScore = minimax(child, depth - 1, true);
               minScore = Math.min(minScore, childScore);
            }
            return minScore;
         }
      }
      let bestScore = +Infinity;
      let bestMove = { i: 0, j: 0 };
      for (let n = 0;n < 9;n++) {
         const i = n % 3;
         const j = Math.floor(n / 3);
         if (this.state.map[i][j] !== '') continue;
         const s = new state(this.state);
         s.map[i][j] = 'x';
         const score = minimax(s, Infinity, true);
         if (score < bestScore) {
            bestMove.i = i;
            bestMove.j = j;
            bestScore = score;
         }
      }
      this.mark(bestMove.i, bestMove.j);
   }
   update(context) {
      const { size, color } = this;
      context.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(-3 * size / 2, -size / 2);
      context.lineTo(3 * size / 2, -size / 2);
      context.moveTo(-3 * size / 2, size / 2);
      context.lineTo(3 * size / 2, size / 2);
      context.moveTo(-size / 2, -3 * size / 2);
      context.lineTo(-size / 2, 3 * size / 2);
      context.moveTo(size / 2, -3 * size / 2);
      context.lineTo(size / 2, 3 * size / 2);
      context.stroke();
      for (let i = -1; i < 2; i++) {
         for (let j = -1; j < 2; j++) {
            if (this.state.map[i + 1][j + 1] === 'o') {
               context.beginPath();
               context.arc(i * size, j * size, size / 3, 0, Math.PI * 2);
               context.stroke();
            } else if (this.state.map[i + 1][j + 1] === 'x') {
               context.beginPath();
               context.moveTo(i * size - size * ((2) ** 0.5) / 4.5, j * size - size * ((2) ** 0.5) / 4.5);
               context.lineTo(i * size + size * ((2) ** 0.5) / 4.5, j * size + size * ((2) ** 0.5) / 4.5);
               context.moveTo(i * size + size * ((2) ** 0.5) / 4.5, j * size - size * ((2) ** 0.5) / 4.5);
               context.lineTo(i * size - size * ((2) ** 0.5) / 4.5, j * size + size * ((2) ** 0.5) / 4.5);
               context.closePath();
               context.stroke();
            }
         }
      }
   }
   ping() {
      util.ease(this.color, 'r', 244, 200, 'easeOutCubic');
      util.ease(this.color, 'g', 67, 200, 'easeOutCubic');
      util.ease(this.color, 'b', 54, 200, 'easeOutCubic', () => {
         util.ease(this.color, 'r', 0, 200, 'easeInQuad');
         util.ease(this.color, 'r', 0, 200, 'easeOutCubic');
         util.ease(this.color, 'g', 0, 200, 'easeOutCubic');
      });
   }
   end(result) {
      this.finished = true;
      if (result === -1) {
         document.querySelector('.title').innerHTML = `<span id="winner">X</span> برنده شد`;
      } else if (result === 1) {
         document.querySelector('.title').innerHTML = `<span id="winner">O</span> برنده شد`;
      } else {
         document.querySelector('.title').innerHTML = `بازی مساوی شد`;
      }
      this.effects.initialRotation = util.ease(mainCamera, 'rotation', Math.PI / 4, 2500, 'linear', () => {
         this.effects.continuesRotation = util.ease(mainCamera, 'rotation', Math.PI / 3.5 * 20, 100000, 'linear');
      });
      this.effects.xscale = util.ease(mainCamera.scale, 'x', 1.3, 2500, 'easeOutCubic');
      this.effects.zscale = util.ease(mainCamera.scale, 'y', 1.3, 2500, 'easeOutCubic');
      this.effects.cameraMove = util.ease(mainCamera, 'x', mainScreen.frame.width / 2 - 300, 2500, 'easeOutQuad');
      mainScreen.view.classList.add('blur');
      document.querySelector('.shadow').style.backgroundColor = '#0005';
      document.querySelector('.menu').classList.add('show');
   }
   restart() {
      this.effects.continuesRotation?.stop();
      this.effects.initialRotation.stop();
      this.effects.xscale.stop();
      this.effects.zscale.stop();
      this.effects.cameraMove.stop();
      mainCamera.rotation = 0;
      mainCamera.scale = { x: 1, y: 1 };
      mainCamera.x = mainScreen.frame.width / 2;
      mainScreen.view.classList.remove('blur');
      document.querySelector('.shadow').style.backgroundColor = '#0000';
      document.querySelector('.menu').classList.remove('show');
      setTimeout(() => {
         this.finished = false;
      });
      this.turn = 'o';
      this.state = new state();
      document.querySelector('#aiStart').classList.remove('hide');
   }
}

const game = new tictactoe();

mainScene.add(game);

document.body.onclick = e => {
   if (game.finished) return;
   if (game.turn === game.ai) return;
   const origin = {
      x: mainScene.frame.width / 2 - 3 * game.size / 2,
      y: mainScene.frame.height / 2 - 3 * game.size / 2
   }
   let i = Math.floor((e.clientX - origin.x) / game.size);
   let j = Math.floor((e.clientY - origin.y) / game.size);
   if (i >= 0 && i <= 2 && j >= 0 && j <= 2) {
      game.mark(i, j);
      document.querySelector('#aiStart').classList.add('hide');
   } else {
      if (e.target.tagName === 'BODY')
         game.ping();
   }
}

document.querySelector('#aiStart').onclick = () => {
   game.turn = game.ai;
   game.think();
   document.querySelector('#aiStart').classList.add('hide');
}

document.querySelector('.restart').onclick = () => {
   game.restart();
}

// animation - circle / cross