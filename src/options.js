const DEFAULT_FILTERS = {
  death: true,
  stayHome: false
}

export const CANVAS_SIZE = {
  height: 880,
  width: 360
}

export const DESKTOP_CANVAS_SIZE = {
  height: 400,
  width: 800
}

export const BALL_RADIUS = 5
export const COLORS = {
  death: '#000',
  recovered: '#5ABA4A',
  infected: '#c50000',
  well: '#63C8F2',
  inhospital: '#FFA500',
  needshospital: '#6a0dad' 
}

export const STATES = {
  infected: 'infected',
  well: 'well',
  recovered: 'recovered',
  death: 'death',
  inhospital: 'inhospital',
  needshospital: 'needshospital' 
}

export const STARTING_BALLS = {
  [STATES.infected]: 1,
  [STATES.well]: 199,
  [STATES.recovered]: 0,
  [STATES.death]: 0,
  [STATES.inhospital]: 0,
  [STATES.needshospital]: 0
}

export const RUN = {
  filters: { ...DEFAULT_FILTERS },
  results: { ...STARTING_BALLS },
  tick: 0
}

export const MORTALITY_PERCENTATGE = 10               //overall mortality
export const HOSPITAL_NEEDED_PERCENTATGE = 20         //people that get sick that need hospital (old or comorbidity)
export const MORTALITY_HOSPITAL_NEEDED_PERCENTATGE = 95     //Mortality of people that need hospital but dont get it
export const MORTALITY_PERCENTATGE_AT_HOSPITAL = 30      //Mortality if admitted to hospital
export const HOSPITAL_CAPACITY = 5                    //Hospital beds     % x people
export const SPEED = 1
export const TOTAL_TICKS = 3000
export const TICKS_TO_RECOVER = 500
export const STATIC_PEOPLE_PERCENTATGE = 25

export const resetRun = () => {
  RUN.results = { ...STARTING_BALLS }
  RUN.tick = 0
}
