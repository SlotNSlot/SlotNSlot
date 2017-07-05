import * as PIXI from 'pixi.js';

const ENTIRE_REEL_COUNT = 5;
const ITEM_PER_ENTIRE_REEL = 12;
const ITEMS_PER_HALF_REEL = ITEM_PER_ENTIRE_REEL / 2;
const ALL_SYMBOL_COUNT = 13;
const SYMBOL_WIDTH = 100;
const SYMBOL_HEIGHT = 100;

export default class SlotGame {
  constructor(canvasElement) {
    if (!canvasElement) {
      return;
    }
    this.canvas = canvasElement;
    this.renderer = null;
    this.stage = null;
    this.gameLoop = this.gameLoop.bind(this);
    this.loopStart = this.loopStart.bind(this);
    this.stopSpin = this.stopSpin.bind(this);
    this.stopStart = this.stopStart.bind(this);
    this.drawUI = this.drawUI.bind(this);
    this.spinning = false;
    this.filter = new PIXI.filters.BlurYFilter(20);
    // spinStatus Array initializes to true
    // true means spinning, false means stopped.
    this.spinStatus = new Array(ENTIRE_REEL_COUNT).fill(true);
    this.rotateStatus = new Array(ENTIRE_REEL_COUNT).fill(false);
    // Set Entire Canvas Properties
    this.renderer = new PIXI.autoDetectRenderer(940, 660, {
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

    for (let idx = 0; idx < ENTIRE_REEL_COUNT; idx += 1) {
      reels[idx] = [];
      for (let j = 0; j < ITEM_PER_ENTIRE_REEL; j += 1) {
        reels[idx].push(Math.floor(Math.random() * ALL_SYMBOL_COUNT));
      }
    }

    const reelContainer = new PIXI.Container();
    this.UIContainer = new PIXI.Container();
    const tempContainer = new PIXI.Container();

    this.reelGroup = new Array(ENTIRE_REEL_COUNT * 2).fill(1);
    this.reelGroup.forEach((reelItem, index) => {
      this.reelGroup[index] = new PIXI.Container();
      this.reelGroup[index].vy = 0;
    });
    // this.reelGroup.forEach(() => (new PIXI.Container()));
    // Add the canvas to the HTML document
    PIXI.loader
      .add('assets/images/symbolsMap.json')
      .add('assets/images/slotMap.json')
      .on('progress', (loader, resource) => {
        console.log(loader);
        console.log(resource);
        console.log('LOADING...');
      })
      .load(() => {
        this.drawUI();
        // Symbols make and make reel sprites.
        const spritesNum = [9, 7, 6, 7, 6, 9, 24, 19, 23, 24, 24, 24, 24];
        for (let i = 1; i <= ALL_SYMBOL_COUNT; i += 1) {
          const imglist = [];
          for (let j = 0; j < spritesNum[i - 1]; j += 1) {
            const val = j < 10 ? `0${j}` : j;
            const frame = PIXI.Texture.fromFrame(`Symbol${i}_${val}.png`);
            imglist.push(frame);
          }
          symbols[i - 1] = imglist;
        }
        reels = reels.map(reel => reel.map(e => new PIXI.extras.AnimatedSprite(symbols[e])));

        for (let reelNum = 0; reelNum < ENTIRE_REEL_COUNT; reelNum += 1) {
          for (let idx = 0; idx < reels[reelNum].length; idx += 1) {
            const symbol = reels[reelNum][idx];
            symbol.width = SYMBOL_WIDTH;
            symbol.height = SYMBOL_HEIGHT;
            // anchor to center
            symbol.anchor.set(0.5, 0.5);
            symbol.x = 0;
            symbol.y = idx < ITEMS_PER_HALF_REEL ? symbol.height * idx : symbol.height * (idx - ITEMS_PER_HALF_REEL);
            symbol.zOrder = 1;

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
          this.reelGroup[reelNum * 2 + 1].y = SYMBOL_HEIGHT * ITEMS_PER_HALF_REEL;
          this.reelGroup[reelNum * 2].x = SYMBOL_WIDTH * reelNum;
          this.reelGroup[reelNum * 2 + 1].x = SYMBOL_WIDTH * reelNum;
        }

        reelContainer.x = 150;
        this.stage.addChild(reelContainer);

        const spinBtn = new PIXI.Graphics();
        spinBtn.beginFill(0x6495ed, 1);
        spinBtn.lineStyle(2, 0x000000, 1);
        spinBtn.drawRect(0, 0, 100, 50);
        spinBtn.endFill();
        spinBtn.x = 700;
        spinBtn.y = 525;
        spinBtn.interactive = true;
        spinBtn.buttonMode = true;
        spinBtn.on('pointerdown', this.loopStart);
        tempContainer.addChild(spinBtn);

        const stopBtn = new PIXI.Graphics();
        stopBtn.beginFill(0xcc0000, 1);
        stopBtn.lineStyle(2, 0x000000, 1);
        stopBtn.drawRect(0, 0, 100, 50);
        stopBtn.endFill();
        stopBtn.x = 800;
        stopBtn.y = 525;
        stopBtn.interactive = true;
        stopBtn.buttonMode = true;
        stopBtn.on('pointerdown', () => {
          this.stopSpin(ENTIRE_REEL_COUNT).then(v => {
            console.log(v);
          });
        });
        tempContainer.addChild(stopBtn);

        this.stage.addChild(tempContainer);
        // Tell the `renderer` to `render` the `stage`
        this.renderer.render(this.stage);
        // When load function is ended, then start gameLoop
      });
    console.log(this.stage);
    console.log('iiiii');
    this.gameLoop();
  }

  loopStart() {
    // It start when it is not spinning
    if (!this.spinning) {
      this.spinning = true;
      this.reelGroup.forEach(reel => {
        reel.filters = [this.filter];
        reel.vy = 50;
      });
      this.spinStatus.fill(true);
    }
  }

  gameLoop() {
    window.requestAnimationFrame(this.gameLoop);
    if (this.spinning) {
      this.reelGroup.forEach((reel, index) => {
        reel.y += reel.vy;
        if (reel.y > reel.height) {
          reel.y -= reel.height * 2;
        }

        // Spin is being stopped
        if (!this.spinStatus[Math.floor(index / 2)]) {
          reel.vy = reel.vy > 0 ? reel.vy - 0.4 : 0;
          reel.filters = [];
        }
        // Spin is being stopped
        if (this.rotateStatus[Math.floor(index / 2)]) {
          reel.children.forEach(i => {
            i.rotation += 0.2;
          });
        }
      });
    }
    // Render the stage to see the animation
    this.renderer.render(this.stage);
  }

  async stopSpin(spinLength) {
    for (let i = 0; i < spinLength; i += 1) {
      await this.stopStart(i);
    }
  }

  stopStart(reelNum) {
    return new Promise(resolve => {
      this.spinStatus[reelNum] = false;
      this.rotateStatus[reelNum] = true;
      setTimeout(() => {
        this.rotateStatus[reelNum] = false;
        if (reelNum === ENTIRE_REEL_COUNT - 1) {
          this.spinning = false;
        }
        resolve(reelNum);
      }, 2000);
    });
  }

  drawUI() {
    const TextureCache = PIXI.utils.TextureCache;
    const Sprite = PIXI.Sprite;
    const pinkBackground = new Sprite(TextureCache['pink-background.png']);
    pinkBackground.position.set(0, 0);
    pinkBackground.width = 940;
    pinkBackground.height = 660;

    const slotBackground = new Sprite(TextureCache['slot-background.png']);
    slotBackground.position.set(43, 120);
    slotBackground.width = 855;
    slotBackground.height = 461;

    const ribbon = new Sprite(TextureCache['ribbon.png']);
    ribbon.position.set(132, 77);
    ribbon.width = 675.6;
    ribbon.height = 491.3;

    const yourStake = new Sprite(TextureCache['your-stake.png']);
    yourStake.position.set(41.8, 12.3);
    yourStake.width = 351;
    yourStake.height = 60;

    const bankRoll = new Sprite(TextureCache['bank-roll.png']);
    bankRoll.position.set(547, 12);
    bankRoll.width = 352;
    bankRoll.height = 61;

    const vsSprite = new Sprite(TextureCache['vs.png']);
    vsSprite.position.set(450, 25);
    vsSprite.width = 45;
    vsSprite.height = 37;

    const betAmount = new Sprite(TextureCache['bat-amount.png']);
    betAmount.position.set(42, 580);
    betAmount.width = 149;
    betAmount.height = 65;

    const betSize = new Sprite(TextureCache['bet-size.png']);
    betSize.position.set(190, 580);
    betSize.width = 185;
    betSize.height = 65;
    betSize.zOrder = 100;

    const maxBet = new Sprite(TextureCache['max-bet.png']);
    maxBet.position.set(375, 580);
    maxBet.width = 63;
    maxBet.height = 65;

    const lineNum = new Sprite(TextureCache['line.png']);
    lineNum.position.set(436, 580);
    lineNum.width = 186;
    lineNum.height = 65;

    const spinBtn = new Sprite(TextureCache['spin.png']);
    spinBtn.position.set(620, 580);
    spinBtn.width = 186;
    spinBtn.height = 65;

    const autoBtn = new Sprite(TextureCache['auto.png']);
    autoBtn.position.set(804, 580);
    autoBtn.width = 93;
    autoBtn.height = 65;

    const edgeBackground = new Sprite(TextureCache['edge.png']);
    edgeBackground.position.set(44, 568);
    edgeBackground.width = 854;
    edgeBackground.height = 78;

    this.UIContainer.addChild(pinkBackground);
    this.UIContainer.addChild(slotBackground);
    this.UIContainer.addChild(ribbon);
    this.UIContainer.addChild(yourStake);
    this.UIContainer.addChild(bankRoll);
    this.UIContainer.addChild(vsSprite);
    this.UIContainer.addChild(betAmount);
    this.UIContainer.addChild(betSize);
    this.UIContainer.addChild(maxBet);
    this.UIContainer.addChild(lineNum);
    this.UIContainer.addChild(spinBtn);
    this.UIContainer.addChild(autoBtn);
    this.UIContainer.addChild(edgeBackground);
    // this.stage.addChild(this.UIContainer);
    this.stage.addChildAt(this.UIContainer, 1);
  }

  removeCurrentGame() {
    PIXI.loader.reset();
    this.canvas.remove();
  }
}
