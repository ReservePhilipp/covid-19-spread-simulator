import { BALL_RADIUS, COLORS, MORTALITY_PERCENTATGE, TICKS_TO_RECOVER, RUN, SPEED, STATES, MORTALITY_PERCENTATGE_AT_HOSPITAL, HOSPITAL_CAPACITY, HOSPITAL_NEEDED_PERCENTATGE, MORTALITY_HOSPITAL_NEEDED_PERCENTATGE   } from './options.js'
import { checkCollision, calculateChangeDirection } from './collisions.js'

const diameter = BALL_RADIUS * 2

export class Ball {
  constructor ({ x, y, id, state, sketch, hasMovement, isinfectious }) {
    this.x = x
    this.y = y
    this.vx = sketch.random(-1, 1) * SPEED
    this.vy = sketch.random(-1, 1) * SPEED
    this.sketch = sketch
    this.id = id
    this.state = state
    this.timeInfected = 0
    this.hasMovement = hasMovement
    this.hasCollision = true
    this.survivor = false
    this.willneedhospital = (sketch.random(100) <= HOSPITAL_NEEDED_PERCENTATGE) ? true : false  //chance ball will need to be admitted if infected.
    this.isinfectious = isinfectious
  }

  checkState () {
    if (this.state === STATES.inhospital || this.state === STATES.needshospital || this.state === STATES.infected) {
      if (RUN.filters.death && !this.survivor && this.timeInfected >= TICKS_TO_RECOVER / 2) {
      
      	if (this.state === STATES.inhospital) this.survivor = this.sketch.random(100) >=  MORTALITY_PERCENTATGE_AT_HOSPITAL
      	if (this.state === STATES.needshospital) this.survivor = this.sketch.random(100) >=  MORTALITY_HOSPITAL_NEEDED_PERCENTATGE 
      	if (this.state === STATES.infected) this.survivor = this.sketch.random(100) >= MORTALITY_PERCENTATGE   //higher mortalitiy if need hospital and infected
       
        if (!this.survivor) {
          this.hasMovement = false
          
          if (this.state === STATES.needshospital) RUN.results[STATES.needshospital]--
          if (this.state === STATES.inhospital) RUN.results[STATES.inhospital]--
         
          this.state = STATES.death
          this.isinfectious = false
          RUN.results[STATES.infected]--
          RUN.results[STATES.death]++
          return
        }
       
      }
     
      if (this.timeInfected >= TICKS_TO_RECOVER) {
        if (this.state === STATES.inhospital) RUN.results[STATES.inhospital]--
        if (this.state === STATES.needshospital) RUN.results[STATES.needshospital]--
        this.state = STATES.recovered
        this.isinfectious = false
        RUN.results[STATES.infected]--
        RUN.results[STATES.recovered]++
      } else {
        this.timeInfected++
      }
    }
  }

  checkCollisions ({ others }) {
    if (this.state === STATES.death || this.state === STATES.inhospital) return  //if dead or in hospital is considered non infectious

    for (let i = this.id + 1; i < others.length; i++) {
      const otherBall = others[i]
      const { isinfectious,state, x, y } = otherBall
      if (state === STATES.death || state === STATES.inhospital) continue         //if dead or in hospital is considered non infectious

      const dx = x - this.x
      const dy = y - this.y

      if (checkCollision({ dx, dy, diameter: BALL_RADIUS * 2 })) {
        const { ax, ay } = calculateChangeDirection({ dx, dy })

        this.vx -= ax
        this.vy -= ay
        otherBall.vx = ax
        otherBall.vy = ay

        // both has same state, so nothing to do
        if (this.state === state) return
        // if any is recovered or inhospital, then nothing happens
       if (this.state === STATES.recovered || state === STATES.recovered || this.state === STATES.inhospital || state === STATES.inhospital) return
        // then, if some is infected, then we make both infected
        if (this.isinfectious || otherBall.isinfectious) {
          
          this.isinfectious = otherBall.isinfectious = true
          
          if (this.willneedhospital) {
        	if (RUN.results[STATES.inhospital] < HOSPITAL_CAPACITY) {      
          		RUN.results[STATES.inhospital]++     
            	this.state = STATES.inhospital
            	this.isinfectious = false       //not infectiosu in hospital
          	} else {
          		RUN.results[STATES.needshospital]++     
            	this.state = STATES.needshospital
            }
            this.hasMovement = false      //sick people dont move
          } else this.state = STATES.infected
          
           if (otherBall.willneedhospital) {
        	if (RUN.results[STATES.inhospital] < HOSPITAL_CAPACITY) {      
          		RUN.results[STATES.inhospital]++     
            	otherBall.state = STATES.inhospital
            	otherBall.isinfectious = false       //not infectiosu in hospital
          	} else {
          		RUN.results[STATES.needshospital]++     
            	otherBall.state = STATES.needshospital
            }
            otherBall.hasMovement = false      //sick people dont move
          } else otherBall.state = STATES.infected
          
          RUN.results[STATES.infected]++
          RUN.results[STATES.well]--
        }
      }
    }
  }

  move () {
    if (!this.hasMovement) return

    this.x += this.vx
    this.y += this.vy

    // check horizontal walls
    if (
      (this.x + BALL_RADIUS > this.sketch.width && this.vx > 0) ||
      (this.x - BALL_RADIUS < 0 && this.vx < 0)) {
      this.vx *= -1
    }

    // check vertical walls
    if (
      (this.y + BALL_RADIUS > this.sketch.height && this.vy > 0) ||
      (this.y - BALL_RADIUS < 0 && this.vy < 0)) {
      this.vy *= -1
    }
  }

  render () {
    const color = COLORS[this.state]
    this.sketch.noStroke()
    this.sketch.fill(color)
    this.sketch.ellipse(this.x, this.y, diameter, diameter)
  }
}
