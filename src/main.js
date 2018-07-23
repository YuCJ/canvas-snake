/* global Tone */

class Vector {
  constructor (x = 0, y = 0) {
    this.x = x
    this.y = y
  }
  add (v) {
    return new Vector(this.x + v.x, this.y + v.y)
  }
  sub (v) {
    return new Vector(this.x - v.x, this.y - v.y)
  }
  mul (s) {
    return new Vector(this.x * s, this.y * s)
  }
  length () {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }
  set (x, y) {
    this.x = x
    this.y = y
    return this
  }
  isEqualTo (v) {
    return this.x === v.x && this.y === v.y
  }
  clone () {
    return new Vector(this.x, this.y)
  }
}

class Snake {
  constructor () {
    this.body = []
    this.maxLength = 5
    this.head = new Vector()
    this.speed = new Vector(1, 0)
    this.direction = 'right'
  }

  update () {
    const newHead = this.head.add(this.speed)
    this.body.push(this.head)
    this.head = newHead
    while (this.body.length > this.maxLength) {
      this.body.shift()
    }
  }

  setDirection (dir) {
    let target
    switch (dir) {
      case 'up':
        target = new Vector(0, -1)
        break
      case 'down':
        target = new Vector(0, 1)
        break
      case 'left':
        target = new Vector(-1, 0)
        break
      case 'right':
        target = new Vector(1, 0)
        break
      default:
        break
    }
    if (!target || target.isEqualTo(this.speed.mul(-1))) {
      // do nothing
    } else {
      this.speed = target
    }
  }

  checkBoundary (xMax, yMax) {
    const xInRange = this.head.x >= 0 && this.head.x < xMax
    const yInRange = this.head.y >= 0 && this.head.y < yMax
    return xInRange && yInRange
  }
}

class Game {
  constructor () {
    this.start = false
    this.boxSize = 12
    this.boxMargin = 2
    this.horiBoxes = 40
    this.vertiBoxes = 40
    this.speed = 30
    this.snake = null
    this.foods = []
  }
  getBoxLocation (x, y) {
    return new Vector(
      x * this.boxSize + (x - 1) * this.boxMargin,
      y * this.boxSize + (y - 1) * this.boxMargin
    )
  }
  drawBox (v, color) {
    this.ctx.fillStyle = color
    const boxLocation = this.getBoxLocation(v.x, v.y)
    this.ctx.fillRect(boxLocation.x, boxLocation.y, this.boxSize, this.boxSize)
  }
  drawFoodEffect (x, y) {
    const rMin = 2
    const rMax = 100
    let r = rMin
    const position = this.getBoxLocation(x, y)
    const _this = this
    const effect = function () {
      r += 1
      _this.ctx.strokeStyle = `rgba(255,0,0, ${1 - (r / rMax)})`
      _this.ctx.beginPath()
      _this.ctx.arc(position.x + _this.boxSize / 2, position.y + _this.boxSize / 2, r, 0, Math.PI * 2)
      _this.ctx.stroke()
      if (r < rMax) {
        requestAnimationFrame(effect)
      }
    }
    requestAnimationFrame(effect)
  }
  init () {
    this.canvas = document.getElementById('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = this.boxSize * this.horiBoxes + this.boxMargin * (this.horiBoxes - 1)
    this.canvas.height = this.boxSize * this.vertiBoxes + this.boxMargin * (this.vertiBoxes - 1)
    this.snake = new Snake()
    this.render()
    this.update()
    this.createFood()
  }
  startGame () {
    this.start = true
    this.snake = new Snake()
    document.getElementById('panel').classList.add('hide')
    this.playSound('C#5', -10)
    this.playSound('E5', -10, 200)
  }
  endGame () {
    this.start = false
    document.getElementById('score').innerText = `Score: ${(this.snake.maxLength - 5) * 10}`
    document.getElementById('panel').classList.remove('hide')
    this.playSound('A3')
    this.playSound('E2', -10, 100)
    this.playSound('A2', -10, 300)
  }
  createFood () {
    const x = parseInt(Math.random() * this.vertiBoxes, 10)
    const y = parseInt(Math.random() * this.horiBoxes, 10)
    this.drawFoodEffect(x, y)
    this.foods.push(new Vector(x, y))
  }
  render () {
    this.ctx.fillStyle = 'rgba(0,0,0,0.3)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    for (let x = 0; x < this.horiBoxes; x += 1) {
      for (let y = 0; y < this.vertiBoxes; y += 1) {
        this.drawBox(new Vector(x, y), 'rgba(255,255,255,0.03)')
      }
    }
    this.foods.forEach((p) => {
      this.drawBox(p, 'red')
    })
    this.snake.body.forEach((boxPos, i) => {
      this.drawBox(boxPos, 'white')
    })
    requestAnimationFrame(() => {
      this.render()
    })
  }
  update () {
    if (this.start) {
      this.playSound('A2', -20)
      this.snake.update()
      this.foods.forEach((food, i) => {
        if (this.snake.head.isEqualTo(food)) {
          this.snake.maxLength += 1
          this.foods.splice(i, 1)
          this.playSound('E5', -20)
          this.playSound('A5', -20, 50)
          this.createFood()
        }
      })
      if (!this.snake.checkBoundary(this.horiBoxes, this.vertiBoxes)) {
        console.log('撞牆ㄌ')
        this.endGame()
      }
      this.snake.body.forEach((body) => {
        if (this.snake.head.isEqualTo(body)) {
          console.log('吃自己ㄌ')
          this.endGame()
        }
      })
    }
    setTimeout(() => {
      this.update()
    }, 150)
  }

  playSound(note, volume = -12, when = 0) {
    setTimeout(function() {
      const synth = new Tone.Synth().toMaster()
      synth.volume.value = volume
      synth.triggerAttackRelease(note, '8n')
    }, when)
  }
}

function handleLoad () {
  const game = new Game()
  game.init()
  window.addEventListener('keydown', (evt) => {
    evt.preventDefault()
    const dir = evt.key.replace('Arrow', '').toLowerCase()
    game.snake.setDirection(dir)
  })
  document.getElementById('start-game').addEventListener('click', (evt) => {
    game.startGame()
  })
}

window.addEventListener('load', handleLoad)
