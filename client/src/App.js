import React, { Component } from 'react'
import io from 'socket.io-client'
import { GOOGLE_MAP_KEY } from './config'
import GoogleMap from 'google-map-react'
import RouteForm from './RouteForm'
import Polyline from './Polyline'
import RouteView from './RouteView'

import './App.css'

let roomHash = window.location.pathname.includes('/room/') ? window.location.pathname.replace('/room/', '') : null
const username = window.localStorage.getItem('username') || window.prompt('Username:')
window.localStorage.setItem('username', username)

class App extends Component {
  state = {
    map: undefined, maps: undefined, mapLoaded: false, data: null, selectedRouteId: null,
  }

  componentDidMount() {
    this.socket = io(':80')
    if (!roomHash) {
      this.socket.emit('new_session', { user: username })
    } else {
      this.socket.emit('restore_session', { user: username, id: roomHash })
    }

    this.socket.on('new_session', (data) => {
      window.location = `/room/${data.id}`
    })

    this.socket.on('restore_session', (data) => {
      this.setState({ data })
    })

   }
  
  onClose = () => this.setState({ selectedRouteId: null })
  onReorder = (data) => {
    const payload = Object.assign({}, data, {
      id: roomHash,
      action: 'reorder_cities'
    })
    console.log(payload)
    this.socket.emit('reorder_cities', payload)
  }
  render() {
    const { map, maps, mapLoaded, selectedRouteId, data } = this.state

    const selectedRoute = selectedRouteId && data && data.routes && data.routes.find(route => route.routeName === selectedRouteId)

    return (
      <div className="App">
        { selectedRoute && <RouteView route={selectedRoute} onReorder={this.onReorder} onClose={this.onClose} /> }
        <div className="map">
          <GoogleMap
            bootstrapURLKeys={{ key: GOOGLE_MAP_KEY }}
            defaultCenter={{ lat: 41.389195, lng: 2.113388 }}
            defaultZoom={10}
            onGoogleApiLoaded={({ map, maps }) => { this.setState({ map, maps, mapLoaded: true }) }}
            yesIWantToUseGoogleMapApiInternals
          >
            { mapLoaded && data && data.routes && data.routes.reduce((memo, route) => {
                if (route && route.trip && route.trip.flights && route.trip.flights) {
                  memo.push.call(memo, route.trip.flights.map(flight => (<Polyline
                    id={route.routeName}
                    onSelect={(id) => this.setState({ selectedRouteId: id })}
                    user={route.owner}
                    path={flight.legs && flight.legs.reduce((acc, leg) => {
                      const coordDeparture = (leg.departure.coordinates && leg.departure.coordinates.split(',').map(item => Number.parseFloat(item.trim(), 10))) || []
                      const coordArrival = (leg.arrival.coordinates && leg.arrival.coordinates.split(',').map(item => Number.parseFloat(item.trim(), 10))) || []
                      
                      return [...acc,
                        { lat: coordDeparture[0], lng: coordDeparture[1], title: leg.airport },
                        { lat: coordArrival[0], lng: coordArrival[1], title: leg.airport },
                      ]
                    }, [])}
                    map={map}
                    maps={maps}
                  />)))
                }
                return memo
            }, []) }
          </GoogleMap>
          
        </div>
        <RouteForm />
      </div>
    )
  }
}

export default App
