# API Documentation

## WebSockets

Events:

New Session
	CLIENT request
	{
		"action": "new_session"
	}
	SERVER Response
	{
		"id": string
	}

	
Restore Session
	CLIENT Request
	{
		"action": "restore_session",
		"id": string
	}

	Server Response:
	{
		"id": string,
		"routes": [ // Route: which cities do we visit in which order
			{
				"route_name": string, // has to be unique
				"cities": Array<string>,
				"ignore_flight": [ // implies: B and A have to be neighbors 
					[ "cityA", "cityB" ]	
				],
				"durationOfStay": Map<string, number> // Maps from city name to duration of stay in days,
				"earliestDeparture": "yyyy-mm-dd",
				"trip": { // which flights do we take
					"total_price": number,
					"flights": [
						{
							"starting_city": string, // city name
							"final_destination": string, // final city
							"price": number,
							"numberOfStops": number // === legs.length - 1
							"departure_time: "yyyy-mm-dd hh:mm",
							"arrival_time: "yyyy-mm-dd hh:mm",
							"legs": [// legs is sorted by arrival time & departure time
								{
									"carrier": string,
									"flight_number": string,
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
			}		
		]
	}

Reorder Cities
	CLIENT Request: 
		{
			"request_id": string, // use some unique request id e.g. random 6 char string
			"action": "reorder_cities",
			"id": string, // session id
			"route_name": string, // unique
			"order": string<cities>,
			"ignore_flight": [ // implies: B and A have to be neighbors 
				[ "cityA", "cityB" ]	
			]
		}
	SERVER Response

	- Reorder Cities is broadcasted to all connected clients
	- Reorder Cities triggers recalculation of route price and broadcast of this to all clients (see server response for Submit City List)


Submit City List:
	CLIENT Request:
	{
		"request_id": string, // use some unique request id e.g. random 6 char string
		"action": "city_list",
		"route_name": string, // has to be unique
		"cities": Array<string>,
		"ignore_flight": [ // implies: B and A have to be neighbors 
			[ "cityA", "cityB" ]	
		],
		"durationOfStay": Map<string, number> // Maps from city name to duration of stay in days,
		"earliestDeparture": "yyyy-mm-dd"
	}

	SERVER Response:
	{
		"request_id": string,
		"route_name": string,
		"total_price": number,
		"flights": [
			{
				"starting_city": string, // city name
				"final_destination": string, // final city
				"price": number,
				"numberOfStops": number // === legs.length - 1
				"departure_time: "yyyy-mm-dd hh:mm",
				"arrival_time: "yyyy-mm-dd hh:mm",
				"legs": [// legs is sorted by arrival time & departure time
					{
						"carrier": string,
						"flight_number": string,
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

