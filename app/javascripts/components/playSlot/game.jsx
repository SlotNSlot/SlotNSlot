import * as PIXI from 'pixi.js';

const ENTIRE_REEL_COUNT = 5;
const ITEM_PER_ENTIRE_REEL = 12;
const ITEMS_PER_HALF_REEL = ITEM_PER_ENTIRE_REEL / 2;
const ALL_SYMBOL_COUNT = 13;
const SYMBOL_WIDTH = 100;
const SYMBOL_HEIGHT = 100;
const SLOWING_DISTANCE = 50;

// STATE CONST VALUES
const STATE_ZERO = 0; // State which does not load every PIXI Component.
const STATE_WAITING = 1; // State which does nothing, so ready to spin
const STATE_SPINNING = 2; // State which is spinning while waiting slot result.
const STATE_STOPPING = 3; // State which is animating while stopping.
const STATE_DRAWING = 4; // State whcih is drawing slot win line

const WIN_LINE = [
  [0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1],
  [2, 2, 2, 2, 2],
  [2, 1, 0, 1, 2],
  [0, 1, 2, 1, 2],
  [0, 0, 1, 2, 2],
  [2, 2, 1, 0, 0],
  [1, 0, 0, 0, 1],
  [1, 2, 2, 2, 1],
  [0, 1, 0, 1, 0],
  [2, 1, 2, 1, 2],
  [1, 2, 1, 2, 1],
  [1, 0, 1, 0, 1],
  [1, 1, 0, 1, 1],
  [1, 1, 2, 1, 1],
  [0, 1, 1, 1, 0],
  [2, 1, 1, 1, 2],
  [0, 2, 0, 2, 0],
  [2, 0, 2, 0, 2],
  [2, 0, 1, 0, 2],
];
const WIN_LINE_COLOR = [
  0xc21e42,
  0x68d106,
  0xced42d,
  0x2c2d3e,
  0x2be3be,
  0xb47d58,
  0x9ee54e,
  0x73f42a,
  0x3e99a1,
  0x01891c,
  0x2c0d07,
  0xc526b3,
  0xf746b0,
  0xdcd1f7,
  0x6d2ae,
  0x67704a,
  0x7c3669,
  0xab9e06,
  0x5fb616,
  0x33198f,
];

export default class SlotGame {
  constructor(canvasElement) {
    if (!canvasElement) {
      return;
    }
    // Function List
    this.gameLoop = this.gameLoop.bind(this);
    this.loopStart = this.loopStart.bind(this);
    this.stopSpin = this.stopSpin.bind(this);
    this.drawUI = this.drawUI.bind(this);
    this.stopReel = this.stopReel.bind(this);
    this.changeSlot = this.changeSlot.bind(this);
    this.drawLine = this.drawLine.bind(this);
    // PIXI Element
    this.canvas = canvasElement;
    this.renderer = null;
    this.blurFilter = new PIXI.filters.BlurYFilter(10);
    this.winLines = new PIXI.Graphics();
    // Game Variable Initialization
    this.stage = null;
    this.gameStatus = STATE_ZERO;
    this.spinStatus = new Array(ENTIRE_REEL_COUNT).fill(true);
    this.rotateStatus = new Array(ENTIRE_REEL_COUNT).fill(false);
    this.slowingDistance = null;
    this.drawingLineIndex = null;
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
    this.symbols = new Array(ALL_SYMBOL_COUNT);
    let randomNumbers = [];
    // Make Random variable for inital slot.
    for (let idx = 0; idx < ENTIRE_REEL_COUNT; idx += 1) {
      randomNumbers[idx] = [];
      for (let j = 0; j < ITEM_PER_ENTIRE_REEL; j += 1) {
        randomNumbers[idx].push(Math.floor(Math.random() * ALL_SYMBOL_COUNT));
      }
    }

    this.UIContainer = new PIXI.Container();
    const tempContainer = new PIXI.Container();
    this.reelContainer = new PIXI.Container();

    this.reelGroup = new Array(ENTIRE_REEL_COUNT * 2).fill(1);
    this.newReelGroup = null;

    this.reelGroup.forEach((reelItem, index) => {
      this.reelGroup[index] = new PIXI.Container();
      this.reelGroup[index].vy = 0;
    });
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
        // Make frame list from spriteSheets symbol by symbol.
        const spritesNum = [9, 7, 6, 7, 6, 9, 24, 19, 23, 24, 24, 24, 24];
        for (let i = 1; i <= ALL_SYMBOL_COUNT; i += 1) {
          const imglist = [];
          for (let j = 0; j < spritesNum[i - 1]; j += 1) {
            const val = j < 10 ? `0${j}` : j;
            const frame = PIXI.Texture.fromFrame(`Symbol${i}_${val}.png`);
            imglist.push(frame);
          }
          this.symbols[i - 1] = imglist;
        }
        // Random number of Symbol image frames are integrated to animated sprite.
        randomNumbers = randomNumbers.map(reel =>
          reel.map(randomNum => new PIXI.extras.AnimatedSprite(this.symbols[randomNum])),
        );
        // Random symbol's coordinates are set per reelGroup.
        for (let reelNum = 0; reelNum < ENTIRE_REEL_COUNT; reelNum += 1) {
          for (let idx = 0; idx < randomNumbers[reelNum].length; idx += 1) {
            const symbol = randomNumbers[reelNum][idx];
            symbol.width = SYMBOL_WIDTH;
            symbol.height = SYMBOL_HEIGHT;
            // Anchor to center
            symbol.anchor.set(0.5, 0.5);
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
          this.reelContainer.addChild(this.reelGroup[reelNum * 2]);
          this.reelContainer.addChild(this.reelGroup[reelNum * 2 + 1]);

          // Set reel group position
          this.reelGroup[reelNum * 2].y = 0;
          this.reelGroup[reelNum * 2 + 1].y = SYMBOL_HEIGHT * ITEMS_PER_HALF_REEL;
          this.reelGroup[reelNum * 2].x = SYMBOL_WIDTH * reelNum;
          this.reelGroup[reelNum * 2 + 1].x = SYMBOL_WIDTH * reelNum;
        }

        this.reelContainer.x = 150;
        this.stage.addChild(this.reelContainer);

        // Add UI Elements.
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

        stopBtn.on('pointerdown', this.stopSpin);
        tempContainer.addChild(stopBtn);

        this.stage.addChild(tempContainer);
        this.stage.addChild(this.UIContainer);
        // Tell the `renderer` to `render` the `stage`
        this.renderer.render(this.stage);
        // When load function is ended, then start gameLoop
        this.gameLoop();
      });
  }

  loopStart() {
    if (this.gameStatus === STATE_WAITING) {
      this.winLines.clear();
      this.gameStatus = STATE_SPINNING;
      this.reelGroup.forEach(reel => {
        reel.filters = [this.blurFilter];
        reel.vy = 100;
      });
      this.spinStatus.fill(true);
    }
  }

  gameLoop() {
    if (this.gameStatus === STATE_ZERO) {
      this.gameStatus = STATE_WAITING;
    } else if (this.gameStatus === STATE_WAITING) {
      console.log('WAITING...');
    } else if (this.gameStatus === STATE_SPINNING) {
      this.reelGroup.forEach(reel => {
        reel.y += reel.vy;
        if (reel.y > reel.height) {
          reel.y -= reel.height * 2;
        }
      });
    } else if (this.gameStatus === STATE_STOPPING) {
      this.reelGroup.forEach((reel, index) => {
        if (!this.spinStatus[Math.floor(index / 2)]) {
          if (this.reelGroup[index] !== null) {
            this.reelGroup[index].destroy();
            this.reelGroup[index] = null;
            this.reelContainer.addChildAt(this.newReelGroup[index], index);
          } else if (this.slowingDistance[index] > 0) {
            this.reelContainer.children[index].y += 10;
            this.slowingDistance[index] -= 10;
          }
        } else {
          reel.y += reel.vy;
          if (reel.y > reel.height) {
            reel.y -= reel.height * 2;
          }
        }
      });
    } else if (this.gameStatus === STATE_DRAWING) {
      if (this.drawingLineIndex < this.drawingPercentageList.length) {
        if (this.drawingPercentageList[this.drawingLineIndex] < 1) {
          this.drawingPercentageList[this.drawingLineIndex] += 0.05;
          const p = this.drawingPercentageList[this.drawingLineIndex];
          let moveX;
          let moveY;
          let partP;
          let angle = 0;
          const lineNum = this.testWinLines[this.drawingLineIndex];
          this.winLines.lineStyle(4, WIN_LINE_COLOR[lineNum], 0.8);
          const startY = this.reelContainer.y + 100 + WIN_LINE[lineNum][0] * SYMBOL_HEIGHT;
          this.winLines.moveTo(this.reelContainer.x, startY);
          for (let j = 1; j < ENTIRE_REEL_COUNT; j += 1) {
            if (j * 0.25 > p && p > (j - 1) * 0.25) {
              partP = (p - (j - 1) * 0.25) / 0.25;
              angle = (WIN_LINE[lineNum][j] - WIN_LINE[lineNum][j - 1]) * SYMBOL_HEIGHT / SYMBOL_WIDTH;
              moveX = this.reelContainer.x + SYMBOL_WIDTH * (j - 1) + SYMBOL_WIDTH * partP;
              moveY = this.reelContainer.y + 100 + WIN_LINE[lineNum][j - 1] * SYMBOL_HEIGHT;
              moveY += SYMBOL_HEIGHT * partP * angle;
            } else if (p > (j - 1) * 0.25) {
              moveX = this.reelContainer.x + SYMBOL_WIDTH * j;
              moveY = this.reelContainer.y + 100 + WIN_LINE[lineNum][j] * SYMBOL_HEIGHT;
            } else {
              break;
            }
            this.winLines.lineTo(moveX, moveY);
          }
        } else {
          this.drawingLineIndex += 1;
        }
        this.stage.addChild(this.winLines);
      } else {
        this.drawingPercentageList = null;
        this.gameStatus = STATE_WAITING;
      }
    }

    // Render the stage to see the animation
    window.requestAnimationFrame(this.gameLoop);
    this.renderer.render(this.stage);
  }

  async stopSpin() {
    if (this.gameStatus === STATE_SPINNING) {
      this.gameStatus = STATE_STOPPING;
      this.slowingDistance = new Array(ENTIRE_REEL_COUNT * 2).fill(SLOWING_DISTANCE);
      await this.changeSlot();
      for (let i = 0; i < ENTIRE_REEL_COUNT; i += 1) {
        await this.stopReel(i);
      }
      // After reels stop, draw win lines.
      await this.drawLine();
    }
  }

  drawLine() {
    this.gameStatus = STATE_DRAWING;
    this.testWinLines = [0, 4, 8, 10, 12, 16, 18];
    this.drawingPercentageList = new Array(this.testWinLines.length).fill(0);
    this.drawingLineIndex = 0;
  }

  stopReel(reelNum) {
    return new Promise(resolve => {
      this.spinStatus[reelNum] = false;
      this.rotateStatus[reelNum] = true;
      setTimeout(() => {
        this.rotateStatus[reelNum] = false;
        if (reelNum === ENTIRE_REEL_COUNT - 1) {
          this.gameStatus = STATE_DRAWING;
          this.reelGroup = this.newReelGroup;
        }
        resolve(reelNum);
      }, 2000);
    });
  }

  drawUI() {
    const TextureCache = PIXI.utils.TextureCache;
    const Sprite = PIXI.Sprite;

    const mergedBackground = new Sprite(TextureCache['mergedImage.png']);
    mergedBackground.position.set(0, 0);
    mergedBackground.width = 940;
    mergedBackground.height = 660;

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

    const betAmount = new Sprite(TextureCache['bat-amount.png']);
    betAmount.position.set(42, 580);
    betAmount.width = 149;
    betAmount.height = 65;

    const betSize = new Sprite(TextureCache['bet-size.png']);
    betSize.position.set(190, 580);
    betSize.width = 185;
    betSize.height = 65;

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

    this.stage.addChild(slotBackground);
    this.UIContainer.addChild(mergedBackground);
    this.UIContainer.addChild(ribbon);
    this.UIContainer.addChild(yourStake);
    this.UIContainer.addChild(bankRoll);
    this.UIContainer.addChild(betAmount);
    this.UIContainer.addChild(betSize);
    this.UIContainer.addChild(maxBet);
    this.UIContainer.addChild(lineNum);
    this.UIContainer.addChild(spinBtn);
    this.UIContainer.addChild(autoBtn);
  }

  changeSlot() {
    this.newReelGroup = new Array(ENTIRE_REEL_COUNT * 2).fill(1);
    this.newReelGroup.forEach((reelItem, index) => {
      this.newReelGroup[index] = new PIXI.Container();
      this.newReelGroup[index].vy = 0;
    });

    for (let reelNum = 0; reelNum < ENTIRE_REEL_COUNT; reelNum += 1) {
      for (let idx = 0; idx < ITEM_PER_ENTIRE_REEL; idx += 1) {
        const symbol = new PIXI.extras.AnimatedSprite(this.symbols[1]);
        symbol.width = SYMBOL_WIDTH;
        symbol.height = SYMBOL_HEIGHT;
        // Anchor to center
        symbol.anchor.set(0.5, 0.5);
        symbol.x = 0;
        symbol.y = idx < ITEMS_PER_HALF_REEL ? symbol.height * idx : symbol.height * (idx - ITEMS_PER_HALF_REEL);

        symbol.animationSpeed = 0.3;
        symbol.play();
        if (idx < ITEMS_PER_HALF_REEL) {
          this.newReelGroup[reelNum * 2].addChild(symbol);
        } else {
          this.newReelGroup[reelNum * 2 + 1].addChild(symbol);
        }
      }

      // Set reel group position
      this.newReelGroup[reelNum * 2].y -= SLOWING_DISTANCE;
      this.newReelGroup[reelNum * 2 + 1].y = SYMBOL_HEIGHT * ITEMS_PER_HALF_REEL - SLOWING_DISTANCE;
      this.newReelGroup[reelNum * 2].x = SYMBOL_WIDTH * reelNum;
      this.newReelGroup[reelNum * 2 + 1].x = SYMBOL_WIDTH * reelNum;
    }
  }

  removeCurrentGame() {
    PIXI.loader.reset();
    this.canvas.remove();
  }
}
