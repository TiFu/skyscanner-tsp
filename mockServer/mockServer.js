const io = require('socket.io')(80)

io.on('connection', (socket) => {

  socket.on('new_session', (args) => {
    socket.emit(`new_session`, {
      "id": 'roomHash'
    })
  })

  socket.on('restore_session', () => {
    socket.emit('restore_session', {
      "id": '1234',
      "users": [
        {
          "name": 'tvoje mama', // unique
        }
      ],
      "routes": [ // Route: which cities do we visit in which order
        {
          "owner": 'tvoje mama', // user name
          "routeName": 'route 1', // has to be unique
          "cities": ['Prague', 'Czech Republic'],
          "ignoreFlight": [ // implies: B and A have to be neighbors 
            [ "cityA", "cityB" ]	
          ],
          "durationOfStay": {
            'Prague': 5,
            'Czech Republic': 20,
          },
          "earliestDeparture": "yyyy-mm-dd",
          "trip": { // which flights do we take
            "totalPrice": 3010.12,
            "flights": [
              {
                "startingCity": "Prague", // city name
                "finalDestination": "Czech Republic", // final city
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
                      "airport": "string",
                      "code": "ARP",
                    },
                    "arrival": {
                      "coordinates": "41.390195, 2.123388",
                      "time": "2018-12-30 12:30",
                      "airport": "string",
                      "code": "ARP",
                    }
                  },
                  {
                    "carrier": "string",
                    "flightNumber": "string",
                    "departure": {
                      "coordinates": "41.390195, 2.123388",
                      "time": "2018-12-30 12:30",
                      "airport": "string",
                      "code": "ARP",
                    },
                    "arrival": {
                      "coordinates": "41.400195, 2.133388",
                      "time": "2018-12-30 12:30",
                      "airport": "string",
                      "code": "ARP",
                    }
                  }
                ]
              },
              {
                "startingCity": "Prague", // city name
                "finalDestination": "Czech Republic", // final city
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
                      "airport": "string",
                      "code": "ARP",
                    },
                    "arrival": {
                      "coordinates": "41.390195, 2.123388",
                      "time": "2018-12-30 12:30",
                      "airport": "string",
                      "code": "ARP",
                    }
                  },
                  {
                    "carrier": "string",
                    "flightNumber": "string",
                    "departure": {
                      "coordinates": "41.390195, 2.123388",
                      "time": "2018-12-30 12:30",
                      "airport": "string",
                      "code": "ARP",
                    },
                    "arrival": {
                      "coordinates": "41.400195, 2.133388",
                      "time": "2018-12-30 12:30",
                      "airport": "string",
                      "code": "ARP",
                    }
                  }
                ]
              }
            ]	
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