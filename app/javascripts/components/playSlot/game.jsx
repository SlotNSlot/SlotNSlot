import * as PIXI from 'pixi.js';

const ENTIRE_REEL_COUNT = 5;
const ITEM_PER_ENTIRE_REEL = 10;
const ITEMS_PER_HALF_REEL = ITEM_PER_ENTIRE_REEL / 2;
const ALL_SYMBOL_COUNT = 13;

export default class SlotGame {
  constructor(canvasElement) {
    if (!canvasElement) {
      return;
    }
    this.canvas = canvasElement;
    this.renderer = null;
    this.stage = null;
    this.gameLoop = this.gameLoop.bind(this);

    // Set Entire Canvas Properties
    this.renderer = PIXI.autoDetectRenderer(940, 660, {
      view: canvasElement,
      antialias: true,
      transparent: false,
      resolution: 1,
    });

    this.renderer.view.style.display = 'block';
    this.renderer.view.style.margin = 'auto';
    this.renderer.backgroundColor = 0xefefef;
    this.renderer.autoResize = true;

    // Create a container object called the `stage`
    this.stage = new PIXI.Container();
    const symbols = new Array(ALL_SYMBOL_COUNT);
    let reels = [];

    for (let idx = 0; idx < ENTIRE_REEL_COUNT; idx++) {
      reels[idx] = [];
      for (let j = 0; j < ITEM_PER_ENTIRE_REEL; j++) {
        reels[idx].push(Math.floor(Math.random() * ALL_SYMBOL_COUNT));
      }
    }
    const reelContainer = new PIXI.Container();
    const UIContainer = new PIXI.Container();

    this.reelGroup = new Array(ITEM_PER_ENTIRE_REEL).fill(1);
    this.reelGroup.forEach((reelItem, index) => {
      this.reelGroup[index] = new PIXI.Container();
      this.reelGroup[index].vy = 80;
    });

    // Add the canvas to the HTML document
    PIXI.loader
      .add('assets/images/symbolsMap.json')
      .on('progress', (loader, resource) => {
        console.log(loader);
        console.log(resource);
        console.log('LOADING...');
      })
      .load(() => {
        // Symbols make and make reel sprites.
        const spritesNum = [9, 7, 6, 7, 6, 9, 24, 19, 23, 24, 24, 24, 24];
        for (let i = 1; i <= ALL_SYMBOL_COUNT; i++) {
          const imglist = [];
          for (let j = 0; j < spritesNum[i - 1]; j++) {
            const val = j < ITEM_PER_ENTIRE_REEL ? `0${j}` : j;
            const frame = PIXI.Texture.fromFrame(`Symbol${i}_${val}.png`);
            imglist.push(frame);
          }
          symbols[i - 1] = imglist;
        }

        reels = reels.map(reel => reel.map(e => new PIXI.extras.AnimatedSprite(symbols[e])));

        for (let reelNum = 0; reelNum < ENTIRE_REEL_COUNT; reelNum++) {
          for (let idx = 0; idx < reels[reelNum].length; idx++) {
            const symbol = reels[reelNum][idx];
            symbol.width = 100;
            symbol.height = 100;
            symbol.x = 0;

            symbol.y = idx < ITEMS_PER_HALF_REEL ? symbol.height * idx : symbol.height * (idx - ITEMS_PER_HALF_REEL);

            symbol.animationSpeed = 0.3;
            symbol.play();
            if (idx < ITEMS_PER_HALF_REEL) {
              this.reelGroup[reelNum * 2].addChild(symbol);
            } else {
              this.reelGroup[reelNum * 2 + 1].addChild(symbol);
            }
          }
          reelContainer.addChild(this.reelGroup[reelNum * 2]);
          reelContainer.addChild(this.reelGroup[reelNum * 2 + 1]);

          // set reel group position
          this.reelGroup[reelNum * 2].y = 0;
          this.reelGroup[reelNum * 2 + 1].y = 500;
          this.reelGroup[reelNum * 2].x = 100 * reelNum;
          this.reelGroup[reelNum * 2 + 1].x = 100 * reelNum;
        }

        reelContainer.x = 150;
        this.stage.addChild(reelContainer);

        const spinBtn = new PIXI.Graphics();
        spinBtn.beginFill(0x6495ed, 1);
        // Btn.lineStyle(2, 0x6495ed, 1);
        spinBtn.drawRect(0, 0, 100, 50);
        spinBtn.endFill();
        spinBtn.x = 700;
        spinBtn.y = 525;
        spinBtn.interactive = true;
        spinBtn.buttonMode = true;
        spinBtn.on('pointerdown', () => {
          // alert('hi!');
          this.reelGroup.forEach(reel => (reel.vy = 80));
        });
        UIContainer.addChild(spinBtn);

        this.stage.addChild(UIContainer);

        const stopBtn = new PIXI.Graphics();
        stopBtn.beginFill(0x6495ed, 1);
        stopBtn.lineStyle(2, 0x6495ed, 1);
        stopBtn.drawRect(0, 0, 100, 50);
        stopBtn.endFill();
        stopBtn.x = 800;
        stopBtn.y = 525;
        stopBtn.interactive = true;
        stopBtn.buttonMode = true;
        UIContainer.addChild(stopBtn);
        // Tell the `renderer` to `render` the `stage`
        this.renderer.render(this.stage);
      });
    // When load function is ended, then start gameLoop
    this.gameLoop();
  }

  gameLoop() {
    window.requestAnimationFrame(this.gameLoop);
    this.reelGroup.forEach(reel => {
      if (reel.y > reel.height) {
        reel.y -= reel.height * 2;
      } else {
        reel.vy = reel.vy > 0 ? reel.vy - 0.4 : 0;
        reel.y += reel.vy;
      }
    });
    // Render the stage to see the animation
    this.renderer.render(this.stage);
  }

  removeCurrentGame() {
    PIXI.loader.reset();
    this.canvas.remove();
  }
}
