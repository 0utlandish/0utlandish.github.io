
const VERSION = '1.1.0';

// basix utility stuff
export const util = {
   // user can use this loop to implement the logic and render objects
   loop: e => {},
   // linear interpolation (yea i know)
   lerp: (a, b, n) => {
      return a + (b - a) * Math.min(1, Math.max(0, n));
   },
   // store time in ms since loop is running
   now: 0,
   // ease value change
   ease(o, p, v, d, t = 'linear', c = e=>{}) {
      const ease = {
         startedAt: (util.now || 0),
         endsAt: (util.now || 0) + d,
         initialValue: o[p],
         o,
         p,
         v,
         t,
         c
      };
      util.easeStorage.push(ease);
      return {
         stop: (f = false) => {
            util.easeStorage = util.easeStorage.filter(e => e != ease);
            if(f)
               ease.c();
         }
      }
   },
   easeStorage: [],
   easeTypes: {
      linear: t => t,
      easeInQuad: t => t * t,
      easeOutQuad: t => t * (2 - t),
      easeInOutQuad: t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
      easeInCubic: t => t * t * t,
      easeOutCubic: t => (--t) * t * t + 1,
      easeInOutCubic: t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
      easeInQuart: t => t * t * t * t,
      easeOutQuart: t => 1 - (--t) * t * t * t,
      easeInOutQuart: t => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
      easeInQuint: t => t * t * t * t * t,
      easeOutQuint: t => 1 + (--t) * t * t * t * t,
      easeInOutQuint: t => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
   },
};

// (pre)loads assets
export class preloader {
   constructor() {
     this.files  = [];
     this.log    = true;
     this.ac     = new AudioContext();
     this.gfx    = [];
     this.sfx    = [];
   }
   // insert a file to storage
   insert(type, name, src) {
     this.files[type] = this.files[type] || [];
     this.files[type][name] = {
       agent: undefined,
       loaded: false,
       src
     };
   }
   // load all files
   async load(done, failed) {
     this.done = done || (e=>{});
     this.failed = failed || (e=>{});
     const all = [];
     this.log && console.log('%c[Basix] > %cLoading resources : ', 'color: #E91E63', 'color: #333');
     for (let type in this.files) {
       switch (type) {
         case 'sfx':
            for (let file in this.files[type]) {
              this.files[type][file].loaded = new Promise((resolve, reject) => {
                let buffer;
                window.fetch(this.files[type][file].src)
                  .then(response => response.arrayBuffer())
                  .then(arrayBuffer => this.ac.decodeAudioData(arrayBuffer))
                  .then(audioBuffer => {
                     buffer = audioBuffer;
                     this.log && console.log(`%c[Basix] > %c${type} : ${file} %c(Loaded)`, 'color: #E91E63', 'color: #1976D2', 'background: green;color: #fff;font-size: 9px');
                     resolve(true);
                  }).catch(() => {
                     reject(false);
                  });
                this.sfx[file] = {};
                this.sfx[file].play = (volume = 1, loop = false) => {
                  const source = this.ac.createBufferSource();
                  source.buffer = buffer;
                  const gainNode = this.ac.createGain()
                  gainNode.gain.value = volume;
                  gainNode.connect(this.ac.destination)
                  source.connect(gainNode);
                  source.loop = loop;
                  source.start();
                  this.sfx[file].stop = () => {
                     source.stop();
                  };
                  this.sfx[file].volume = (v) => {
                     gainNode.gain.value = v;
                  };
                }
              });
              all.push(this.files[type][file].loaded);
            }
            break;
         case 'gfx':
            const image = new Image();
            this.gfx[file] = image;
            this.files[type][file].loaded = new Promise((resolve, reject) => {
              this[file].onload = () => {
                this.log && console.log(`%c[Basix] > %c${type} : ${file} %c(Loaded)`, 'color: #E91E63', 'color: #1976D2', 'background: green;color: #fff;font-size: 9px');
                resolve(true);
              }
              this[file].onerror = () => {
                reject(false);
              }
            });
            all.push(this.files[type][file].loaded);
            image.src = this.files[type][file].src;
            break;
       }
     }
     Promise.all(all).then(this.done).catch(this.failed);
   }
}

// represent a 2D vector
export class vector2 {
   constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
   }
   // returns a copy of this vector
   clone() {
      return new vector2(this.x, this.y);
   }
   // gets x & y from another vector
   scan(vector) {
      this.x = vector.x;
      this.y = vector.y;
      return this;
   }
   // set x & y
   set(x, y) {
      this.x = x;
      this.y = y;
      return this;
   }
   // check if two vectors are equal
   equals(vector) {
      return this.x == vector.x && this.y == vector.y;
   }
   // return length of the vector
   len() {
      return (this.x ** 2 + this.y ** 2) ** 0.5;
   }
   // changes the length of the vector to 1 in the same direction
   normalize() {
      const vectorLength = this.len();
      this.scale(1 / vectorLength);
      return this;
   }
   // scale vector (if `ys` is empty first parameter applies to both)
   scale(xs, ys) {
      if(ys !== undefined) {
         this.x *= xs;
         this.y *= ys;
      } else {
         this.x *= xs;
         this.y *= xs;
      }
      return this;
   }
   // negate the vector
   negate() {
      this.scale(-1);
      return this;
   }
   // vector + vector
   add(vector) {
      return new vector2(this.x + vector.x, this.y + vector.y);
   }
   // vector - vector
   subtract(vector) {
      return new vector2(this.x - vector.x, this.y - vector.y);
   }
   // return vector angle in radian
   getAngleInRadian() {
      return Math.atan2(this.y, this.x);
   }
   // return vector angle in degree
   getAngleInDegree() {
      return this.getAngleInRadian() * (180 / Math.PI);
   }
   // return angle between two vectors
   getAngleBetween(vector) {
      const dot = this.dot(vector);
      const mult = this.len() * vector.len();
      if(mult == 0) {
         return false;
      } else {
         const costheta = dot / mult;
         return Math.acos(costheta);
      }
   }
   // get distance from two vectors
   getDistanceFrom(vector) {
      return ((this.x - vector.x) ** 2 + (this.y - vector.y) ** 2) ** 0.5;
   }
   // rotate the vector
   rotate(angle) {
      const x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
      const y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
      this.x = x;
      this.y = y;
      return this;
   }
   // dot operation
   dot(vector) {
      return this.x * vector.x + this.y * vector.y;
   }
   // normal vector of this
   normal() {
      return new vector2(this.y, -this.x);
   }
   // return true if this vector is longer than `vector`
   isLongerThan(vector) {
      return this.len() > vector.len();
   }
   // return string representing this vector
   toString() {
      return `(${this.x},${this.y})`;
   }
}

// screen object
export class screen {
   constructor({
      canvas = null,
      frame = {
         width: window.innerWidth,
         height: window.innerHeight
      },
      backgroundColor = "#000",
      origin = {
         x: 0,
         y: 0
      }
   } = {}) {
      // create canvas DOM element if its not passed to constructor
      this.view = canvas || document.createElement("canvas");
      // apply some css to canvas to make it cleaner
      const canvasStylesToApply = {
         "position": "absolute",
         "background-color": backgroundColor,
         "left": 0,
         "top": 0,
      }
      for(const style in canvasStylesToApply) {
         this.view.style[style] = canvasStylesToApply[style];
      }
      this.view.setAttribute("width", `${frame.width}px`);
      this.view.setAttribute("height", `${frame.height}px`);
      this.view.setAttribute("oncontextmenu", "return false");
      if(canvas === null)
         document.body.appendChild(this.view);
      this.context = this.view.getContext('2d');
      this.frame = frame;
      this.aspectRatio = frame.width / frame.height;
      this.backgroundColor = backgroundColor;
      this.origin = origin;
   }
};

// scene is a placeholder for a group of elements that create a scene together, like a level in your game
export class scene {
   constructor({
      screen = null,
      lighting = false
   } = {}) {
      this.screen = screen;
      this.context = this.screen.context;
      this.frame = this.screen.frame;
      this.origin = this.screen.origin;
      // stores all the elements that exists in this scene
      this.storage = [];
      // store lights
      this.lights = [];
      // if lighting is true then this will create a layer of darkness above every thing
      this.lighting = lighting;
   }
   // add a new element to the scene in order to display it
   add(newElements) {
      if(!newElements) return;
      if(!Array.isArray(newElements)) {
         newElements = [newElements];
      }
      for(let newElement of newElements) {
         if(this.storage.includes(newElement)) continue;
         if(!newElement.LIGHT)
            this.storage.push(newElement);
         else
            this.lights.push(newElement);
         newElement.scene = this;
         // whenever an element is added to the scene, onSceneAdd event will be called for that element
         ((newElement.onSceneAdd || (e => {})).bind(newElement))();
      }
      return this;
   }
   // remove an existing elements form scene [UNDONE]
   remove(existingElements) {
      if(!Array.isArray(existingElements)) {
         existingElements = [existingElements];
      }
      for(let existingElement of existingElements) {
         // whenever an element is removed from the scene, remove event will be called for that element
         ((existingElement.remove || (e => {})).bind(existingElement))();
         if(!existingElement.LIGHT)
            this.storage = this.storage.filter(element => element !== existingElement);
         else
            this.lights = this.lights.filter(element => element !== existingElement);
      }
   }
   // remove all the elements
   end() {
      this.storage.forEach(element => {
         this.remove(element);
      });
   }
   // erase the canvas (aka clear)
   erase() {
      this.context.globalCompositeOperation = 'source-over';
      this.context.clearRect(0, 0, this.frame.width, this.frame.height);
      return this;
   }
   // fill canvas with a color
   refill(color = this.backgroundColor) {
      this.context.globalCompositeOperation = 'source-over';
      this.context.fillStyle = color;
      this.context.fillRect(0, 0, this.frame.width, this.frame.height);
      this.context.fill();
      return this;
   }
   // update all visible elements in the storage
   update(camera) {
      if(!camera) return;
      this.context.translate(camera.x + this.origin.x, camera.y + this.origin.y);
      this.context.scale((camera.mirror.x ? -1 : 1) * camera.scale.x, (camera.mirror.y ? -1 : 1) * camera.scale.y);
      this.context.rotate(camera.rotation);
      if (this.lighting) {
         this.lights.forEach(light => {
            const grd = this.context.createRadialGradient(light.x, light.y, light.size, light.x, light.y, light.radius);
            grd.addColorStop(0, `rgba(${light.color.r}, ${light.color.g}, ${light.color.b}, 255)`);
            grd.addColorStop(1, `rgba(${light.color.r}, ${light.color.g}, ${light.color.b}, 0)`);
            this.context.fillStyle = grd;
            this.context.beginPath();
            this.context.arc(light.x, light.y, light.radius, 0, Math.PI * 2);
            this.context.fill();
         });
         this.context.globalCompositeOperation = 'source-atop';
      }
      this.storage.sort(function(Element1, Element2) {
         if ((Element1.z === undefined ? 0 : Element1.z) < (Element2.z === undefined ? 0 : Element2.z)) return -1;
         else return 1;
      });
      for(const element of this.storage) {
         if ((element.visible || element.visible == undefined) && element.update)
            element.update(this.context);
      }
      this.context.rotate(-camera.rotation);
      this.context.scale((camera.mirror.x ? -1 : 1) * 1 / camera.scale.x, (camera.mirror.y ? -1 : 1) * 1 / camera.scale.y);
      this.context.translate(-camera.x - this.origin.x, -camera.y - this.origin.y);
      return this;
   }
}

// camera is the offset from which you are looking at the canvas
export class camera {
   constructor({
      screen = null,
      view = {
         width: screen.frame.width,
         height: screen.frame.height
      },
      x = 0,
      y = 0,
      rotation = 0,
      mirror = {
         x: false,
         y: false
      }
   } = {}) {
      this.screen = screen;
      this.x = x;
      this.y = y;
      this.rotation = rotation;
      this.scale = {
         x: screen.frame.width / view.width,
         y: screen.frame.height / view.height
      }
      this.mirror = mirror;
   }
   // bring those coordination to the center of the canvas
   lookAt({
      x = 0,
      y = 0,
   } = {}) {
      this.x = -x / (this.mirror.x ? -1 : 1);
      this.y = -y / (this.mirror.y ? -1 : 1);
   }
}

// basix internal loop starts here
const internalLoop = (elapsed) => {
   requestAnimationFrame(internalLoop);
   const delta = elapsed - util.now;
   util.now = elapsed;
   if(!isNaN(delta)) {
      util.easeStorage.forEach(ease => {
         ease.o[ease.p] = util.lerp(ease.initialValue, ease.v, util.easeTypes[ease.t]((util.now - ease.startedAt) / (ease.endsAt - ease.startedAt)));
         if(util.now >= ease.endsAt) {
            util.easeStorage = util.easeStorage.filter(e => e != ease);
            ease.c();
         }
      });
      util.loop(delta, elapsed);
   }
}; internalLoop();

// ads
console.info(`%c■ Powered by %cBasix %c${VERSION}`, 'font-weight: bold', 'color: #E91E63;font-weight: bold', 'background: #00E676;color: #FFF;border-radius: 5px;font-size:9px;padding:1px 5px;');