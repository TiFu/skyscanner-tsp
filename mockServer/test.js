const data = require('./geo.json')
let result = []

data.Continents.forEach(({ Countries: countries }) => {
  countries.forEach(({ Cities: cities }) => {
    cities.forEach(({ Airports: airports }) => {
      result = result.concat(airports)
    })
  })
})

require('fs').writeFileSync('airports.json', JSON.stringify(result), { encoding: 'UTF-8' })