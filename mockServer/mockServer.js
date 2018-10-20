const io = require('socket.io')(80)


const cities = {
  Barcelona: {
    "startingCity": "Prague", // city name
    "finalDestination": "Barcelona", // final city
    "price": 3010.12,
    "numberOfStops": 0, 
    "departureTime": "2018-12-30 12:30",
    "arrivalTime": "2018-12-30 12:30",
    "duration": 20,
    "legs": [
      {
        "carrier": "string",
        "flightNumber": "string",
        "departure": {
          "coordinates": "41.389195, 2.113388",
          "time": "2018-12-30 12:30",
          "airport": "Letiště Václava Havla",
          "code": "ARP",
        },
        "arrival": {
          "coordinates": "41.390195, 2.123388",
          "time": "2018-12-30 12:30",
          "airport": "El Prato Barcelona Airport",
          "code": "ARP",
        }
      }
    ]
  },
  Oslo: {
    "startingCity": "Barcelona", // city name
    "finalDestination": "Oslo", // final city
    "price": 3010.12,
    "numberOfStops": 1, 
    "departureTime": "2018-12-30 12:30",
    "arrivalTime": "2018-12-30 12:30",
    "duration": 20,
    "legs": [
      {
        "carrier": "string",
        "flightNumber": "string",
        "departure": {
          "coordinates": "41.389195, 2.113388",
          "time": "2018-12-30 12:30",
          "airport": "El Prato Barcelona Airport",
          "code": "ARP",
        },
        "arrival": {
          "coordinates": "41.390195, 2.123388",
          "time": "2018-12-30 12:30",
          "airport": "Some Random Airport",
          "code": "ARP",
        }
      },
      {
        "carrier": "string",
        "flightNumber": "string",
        "departure": {
          "coordinates": "41.390195, 2.123388",
          "time": "2018-12-30 12:30",
          "airport": "Some Random Airport",
          "code": "ARP",
        },
        "arrival": {
          "coordinates": "41.400195, 4.133388",
          "time": "2018-12-30 12:30",
          "airport": "Oslo National Airport",
          "code": "ARP",
        }
      }
    ]
  },
}
io.on('connection', (socket) => {
  socket.on('new_session', (args) => {
    socket.emit(`new_session`, {
      "id": 'roomHash'
    })
  })

  socket.on('restore_session', () => {
    socket.emit('restore_session', {
      "id": 'roomHash',
      "users": [
        {
          "name": 'duongtat', // unique
        }
      ],
      "routes": [ // Route: which cities do we visit in which order
        {
          "owner": 'duongtat', // user name
          "routeName": 'route1', // has to be unique
          "cities": ['Prague', 'Barcelona', 'Oslo'],
          "ignoreFlight": [ // implies: B and A have to be neighbors 
            [ "cityA", "cityB" ]
          ],
          "durationOfStay": {
            'Prague': 5,
            'Barcelona': 20,
            'Oslo': 30,
          },
          "earliestDeparture": "yyyy-mm-dd",
          "trip": { // which flights do we take
            "totalPrice": 3010.12,
            "flights": [cities.Barcelona, cities.Oslo]
          }
        }
      ]
    })
  })

  socket.on('reorder_cities', (data) => {
    socket.emit('restore_session', {
      "id": '1234',
      "users": [
        {
          "name": 'duongtat', // unique
        }
      ],
      "routes": [ // Route: which cities do we visit in which order
        {
          "owner": 'duongtat', // user name
          "routeName": 'route1', // has to be unique
          "cities": data.order,
          "ignoreFlight": [ // implies: B and A have to be neighbors 
            [ "cityA", "cityB" ]
          ],
          "durationOfStay": {
            'Prague': 5,
            'Barcelona': 20,
          },
          "earliestDeparture": "yyyy-mm-dd",
          "trip": { // which flights do we take
            "totalPrice": 3010.12,
            "flights": data.order.reduce((memo, city, index) => {
              if (!cities[city]) return memo
              memo.push(cities[city])
              return memo
            }, [])
          }
        }
      ]
    })
  })

  socket.on('city_list', () => {
    socket.emit('city_list', {
      "requestId": 'string', // use some unique request id e.g. random 6 char string
      "action": "city_list",
      "routeName": 'string', // has to be unique
      "startingCity": 'string',
      "cities": ['Brno', 'Prague'],
      "ignoreFlight": [ // implies: B and A have to be neighbors 
        [ "cityA", "cityB" ]	
      ],
      "durationOfStay": {
        'Brno': 5,
        'Prague': 10,
      },
      "earliestDeparture": "yyyy-mm-dd"
    })
  })

})