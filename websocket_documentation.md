# API Documentation

## WebSockets


## New Session

CLIENT request
```
{
	"action": "new_session"
	"user": string
}
```

SERVER Response
```
{
	"id": string
}
```

	
## Restore Session
CLIENT Request
```
{
	"action": "restore_session",
	"user": string,
	"id": string
}
```

Server Response:
```
{
	"id": string,
	"users": [
		{
			"name": string, // unique
		}
	]
	"routes": [ // Route: which cities do we visit in which order
		{
			"owner": string, // user name
			"routeName": string, // has to be unique
			"cities": Array<string>,
			"ignoreFlight": [ // implies: B and A have to be neighbors 
				[ "cityA", "cityB" ]	
			],
			"durationOfStay": Map<string, number> // Maps from city name to duration of stay in days,
			"earliestDeparture": "yyyy-mm-dd",
			"trip": { // which flights do we take
				"totalPrice": number,
				"flights": [
					{
						"startingCity": string, // city name
						"finalDestination": string, // final city
						"alternatives": [
							{
								"deepLink": string,
								"price": number,
								"numberOfStops": number // === legs.length - 1
								"departureTime: "yyyy-mm-dd hh:mm",
								"arrivalTime: "yyyy-mm-dd hh:mm",
								"duration": number,
								"legs": [// legs is sorted by arrival time & departure time
									{
										"duration": number,
										"carrier": string,
										"carrierImg": string,
										"flightNumber": string,
										"departure": {
											"coordinates": "",
											"time": "yyyy-mm-dd hh:mm",
											"airport": string,
										},
										"arrival": {
											"coordinates": "",
											"time": "yyyy-mm-dd hh:mm",
											"airport": string
										}
									}
								]
							}
					}
				]	
			}
		}		
	]
}
```

## Reorder Cities
CLIENT Request: 
```
{
	"requestId": string, // use some unique request id e.g. random 6 char string
	"action": "reorder_cities",
	"id": string, // session id
	"routeName": string, // unique
	"order": string<cities>,
	"ignoreFlight": [ // implies: B and A have to be neighbors 
		[ "cityA", "cityB" ]	
	]
}
```
SERVER Response

- Reorder Cities is broadcasted to all connected clients
- Reorder Cities triggers recalculation of route price and broadcast of this to all clients (see server response for Submit City List)


## Submit City List:
CLIENT Request:
```
{
	"requestId": string, // use some unique request id e.g. random 6 char string
	"action": "city_list",
	"id": string,
	"routeName": string, // has to be unique
	"startingCity": string,
	"cities": Array<string>,
	"ignoreFlight": [ // implies: B and A have to be neighbors 
		[ "cityA", "cityB" ]	
	],
	"durationOfStay": Map<string, number> // Maps from city name to duration of stay in days,
	"earliestDeparture": "yyyy-mm-dd"
}
```

SERVER Response:
```
{
	"requestId": string,
	"routeName": string,
	"totalPrice": number,
	"flights": [
		{
			"startingCity": string, // city name
			"finalDestination": string, // final city
			"price": number,
			"numberOfStops": number // === legs.length - 1
			"departureTime: "yyyy-mm-dd hh:mm",
			"arrivalTime: "yyyy-mm-dd hh:mm",
			"duration": number,
			"legs": [// legs is sorted by arrival time & departure time
				{
					"duration": number,
					"carrier": string,
					"flightNumber": string,
					"departure": {
						"time": "yyyy-mm-dd hh:mm",
						"airport": string,
					},
					"arrival": {
						"time": "yyyy-mm-dd hh:mm",
						"airport": string
					}
				}
			]
		}
	]	
}
```

## Update Selected Alternative
CLIENT request:
```json
{
	"action": "update_selected_alternative",
	"id": string,
	"routeName": string,
	"flightId": number,
	"selectedAlternative": number,
}
```

SERVER response:
None, just a new state from `restore_session`/`state`.


## Delete Route
```json
{
	"action": "delete_route",
	"id": string, // session_id
	"routeName": string
}
```
