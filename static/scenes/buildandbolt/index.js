import '../../src/magic.js';
import api from '../../src/scene/api.js';

import {loadAnimation, prepareAnimation} from '../../src/deps/lottie.js';
import Game from './:closure.js';

api.preload.images(
  'img/car-body.svg',
  'img/car-wheel.svg',
  'img/fence.svg',
  'img/tree.svg',
);

api.preload.sounds('buildandbolt_load_sounds');

let animations = {}

const initPlayerAnimation = (path, playerId, side) => {

  const p = prepareAnimation(path, {
    container: document.querySelector(`.player--${playerId} .player__inner`),
    loop: false,
    autoplay: false,
    rendererSettings: {
      className: `animation animation--${side}`
    },
  }).then((anim) => {
    if (!animations[`player-${playerId}`]) {
      animations[`player-${playerId}`] = {}
    }

    animations[`player-${playerId}`][side] = anim
  })

  api.preload.wait(p)
}

initPlayerAnimation('img/players/a/front.json', 'a', 'front')
initPlayerAnimation('img/players/a/back.json', 'a', 'back')
initPlayerAnimation('img/players/a/side.json', 'a', 'side')
initPlayerAnimation('img/players/death-pow.json', 'a', 'death')
initPlayerAnimation('img/players/b/front.json', 'b', 'front')
initPlayerAnimation('img/players/b/back.json', 'b', 'back')
initPlayerAnimation('img/players/b/side.json', 'b', 'side')
initPlayerAnimation('img/players/death-pow.json', 'b', 'death')

const game = new Game(document.getElementById('module-buildandbolt'), animations, prepareAnimation)

// Debug mode
// const game = new Game(document.getElementById('module-buildandbolt'), 'single')
// controlsScreen.classList.add('is-hidden')
// playerSelectionScreen.classList.add('is-hidden')
// end debug mode

// Todo: implement these
// api.addEventListener('pause', (ev) => game.pause());
// api.addEventListener('resume', (ev) => game.resume());
// api.addEventListener('restart', (ev) => game.restart());

api.config({
  pause: true,
  orientation: 'landscape',
  sound: ['buildandbolt_tutorial_start'],
});

api.ready(async () => {
  // do nothing
});

