import React from 'react';
import * as PIXI from 'pixi.js';
import { connect } from 'react-redux';

let gameLoopAnimation = null;

function mapStateToProps(appState) {
  return {
    root: appState.root,
  };
}

class PlaySlot extends React.PureComponent {
  componentDidMount() {
    let type = 'WebGL';

    if (!PIXI.utils.isWebGLSupported()) {
      type = 'canvas';
    }

    PIXI.utils.sayHello(type);
    // Create the renderer
    const renderer = PIXI.autoDetectRenderer(800, 600, {
      antialias: true,
      transparent: false,
      resolution: 1,
    });

    renderer.backgroundColor = 0xefefef;
    renderer.view.style.border = '1px solid black';
    renderer.view.style.display = 'block';
    renderer.view.style.margin = 'auto';
    renderer.autoResize = true;

    // Create a container object called the `stage`
    const stage = new PIXI.Container();
    let sprite;
    let symbols = new Array(13);
    let reels = [];
    for (let idx = 0; idx < 5; idx++) {
      reels[idx] = [];
      for (let j = 0; j < 20; j++) {
        reels[idx].push(Math.floor(Math.random() * 13));
      }
    }
    const reelContainer = new PIXI.Container();
    const UIContainer = new PIXI.Container();
    // Add the canvas to the HTML document
    this.canvasDom.appendChild(renderer.view);

    PIXI.loader
      .add('assets/images/symbolsMap.json')
      .on('progress', (loader, resource) => {
        console.log(loader);
        console.log(resource);
        console.log('LOADING...');
      })
      .load(() => {
        // Symbols make and make reel sprites.
        let sprites_num = [9, 7, 6, 7, 6, 9, 24, 19, 23, 24, 24, 24, 24];
        for (var i = 1; i <= 13; i++) {
          let imglist = [];
          for (var j = 0; j < sprites_num[i - 1]; j++) {
            let val = j < 10 ? '0' + j : j;
            let frame = PIXI.Texture.fromFrame('Symbol' + i + '_' + val + '.png');
            imglist.push(frame);
          }
          symbols[i - 1] = imglist;
        }

        reels = reels.map(reel => reel.map(e => new PIXI.extras.AnimatedSprite(symbols[e])));
        console.log(reels);

        for (let reel_num = 0; reel_num < 5; reel_num++) {
          for (let idx = 0; idx < reels[reel_num].length; idx++) {
            let symbol = reels[reel_num][idx];
            symbol.width = 100;
            symbol.height = 100;
            symbol.x = 100 * reel_num;
            symbol.y = symbol.height * (idx - 1);
            // symbol.vy = 70;
            symbol.animationSpeed = 0.3;
            symbol.play();
            reelContainer.addChild(symbol);
          }
        }

        reelContainer.x = 150;
        stage.addChild(reelContainer);

        let button = new PIXI.Graphics();
        button.beginFill(0x6495ed, 1);
        // button.lineStyle(2, 0x6495ed, 1);
        button.drawRect(0, 0, 100, 50);
        button.endFill();
        button.x = 700;
        button.y = 525;
        button.interactive = true;
        button.buttonMode = true;
        button.on('pointerdown', () => {
          // alert('hi!');
          reels.forEach(reel => reel.forEach(e => (e.vy = 80)));
        });
        UIContainer.addChild(button);

        stage.addChild(UIContainer);
        // Tell the `renderer` to `render` the `stage`
        renderer.render(stage);
        // When load function is ended, then start gameLoop
        gameLoop();
      });

    function gameLoop() {
      // Loop this function at 60 frames per second
      gameLoopAnimation = window.requestAnimationFrame(gameLoop);

      reels.forEach(reel =>
        reel.forEach(e => {
          if (e.y > e.height * (reel.length - 1)) {
            e.y -= e.height * reel.length;
          } else {
            e.vy = e.vy > 0 ? e.vy - 0.4 : 0;
            e.y += e.vy;
          }
        }),
      );
      // Render the stage to see the animation
      renderer.render(stage);
    }
  }

  componentWillUnmount() {
    if (gameLoopAnimation) {
      window.cancelAnimationFrame(gameLoopAnimation);
    }
    if (this.canvasDom) {
      this.canvasDom.innerHTML = '';
    }
  }

  render() {
    const { root } = this.props;

    return (
      <div>
        <div>
          My Balance {root.get('balance')}
        </div>
        <div ref={el => (this.canvasDom = el)} />
      </div>
    );
  }
}

export default connect(mapStateToProps)(PlaySlot);
