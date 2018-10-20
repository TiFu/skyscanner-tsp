import React, { Component } from 'react'
import io from 'socket.io-client'
import { GOOGLE_MAP_KEY } from './config'
import GoogleMap from 'google-map-react'
import RouteForm from './RouteForm'
import Polyline from './Polyline'
import RouteView from './RouteView'
import { colorFromIndex } from './utils'

import './App.css'

let roomHash = window.location.pathname.includes('/room/') ? window.location.pathname.replace('/room/', '') : null
const username = window.localStorage.getItem('username') || window.prompt('Username:')
window.localStorage.setItem('username', username)

class App extends Component {
  state = {
    map: undefined,
    maps: undefined,
    mapLoaded: false,
    data: null,
    selectedRouteId: null,
    requestLoading: false,
  }

  initialLoad = true

  componentDidMount() {
    this.socket = io(':8989')
    window.socket = this.socket;
    if (!roomHash) {
      this.socket.emit('new_session', { user: username })
    } else {
      this.socket.emit('restore_session', { user: username, id: roomHash })
    }

    this.socket.on('new_session', (data) => {
      window.location = `/room/${data.id}`
    })

    const handleStateReceive = (data) => {
      if (this.initialLoad && this.state.mapLoaded) {
        this.initialLoad = false
        this.fitMarkers(data, this.state.map, this.state.maps)
      }
      this.setState({ data, requestLoading: false })
    }

    this.socket.on('state', handleStateReceive)
    this.socket.on('restore_session', handleStateReceive)
  }

  onClose = () => this.setState({ selectedRouteId: null })

  onReorder = (data) => {
    this.setState({ requestLoading: true })
    this.socket.emit('reorder_cities', Object.assign({}, data, {
      id: roomHash,
      action: 'reorder_cities'
    }))
  }

  onNewSubmit = (data) => {
    this.setState({ requestLoading: true })
    this.socket.emit('city_list', Object.assign({}, data, {
      id: roomHash,
      action: 'city_list'
    }))
  }

  onAlternative = (data) => {
    this.setState({ requestLoading: true })
    this.socket.emit('update_selected_alternative', Object.assign({}, data, {
      id: roomHash,
      action: 'update_selected_alternative',
    }))
  }

  onMapLoaded = ({ map, maps }) => {
    this.setState({ map, maps, mapLoaded: true })

    if (this.state.data && this.initialLoad) {
      this.initialLoad = false
      this.fitMarkers(this.state.data, map, maps)
    }
  }

  fitMarkers = (data, map, maps) => {
    const bounds = new maps.LatLngBounds()

    data.routes.forEach(route => route.trip && route.trip.flights.forEach(flight => {
      flight.alternatives[flight.selectedAlternative].legs.forEach(leg => {
        const coordDeparture = (leg.departure.coordinates && leg.departure.coordinates.split(',').map(item => Number.parseFloat(item.trim(), 10))) || []
        const coordArrival = (leg.arrival.coordinates && leg.arrival.coordinates.split(',').map(item => Number.parseFloat(item.trim(), 10))) || []

        bounds.extend(new maps.LatLng(coordDeparture[1], coordDeparture[0]))
        bounds.extend(new maps.LatLng(coordArrival[1], coordArrival[0]))
      })
    }))

    map.fitBounds(bounds)
  }

  render() {
    const { map, maps, mapLoaded, selectedRouteId, data, requestLoading } = this.state
    const selectedRoute = selectedRouteId && data && data.routes && data.routes.find(route => route.routeName === selectedRouteId)

    return (
      <div className="App">
        { selectedRoute && <RouteView loading={requestLoading} route={selectedRoute} onReorder={this.onReorder} onAlternative={this.onAlternative} onClose={this.onClose} /> }
        <div className="map">
          <GoogleMap
            bootstrapURLKeys={{ key: GOOGLE_MAP_KEY }}
            defaultCenter={{ lat: 41.389195, lng: 2.113388 }}
            defaultZoom={10}
            options={{
              styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}],
            }}
            onGoogleApiLoaded={this.onMapLoaded}
            yesIWantToUseGoogleMapApiInternals
          >
            { mapLoaded && data && data.routes && data.routes.reduce((memo, route, index) => {
                if (route && route.trip && route.trip.flights && route.trip.flights) {
                  memo.push.call(memo, route.trip.flights.map(flight => (
                  <Polyline
                    id={route.routeName}
                    showSelected={!!selectedRoute}
                    selected={route.routeName === selectedRouteId}
                    onSelect={(id) => this.setState({ selectedRouteId: id })}
                    color={colorFromIndex(index)}
                    user={route.owner}
                    path={flight.alternatives[flight.selectedAlternative].legs && flight.alternatives[flight.selectedAlternative].legs.reduce((acc, leg) => {
                      const coordDeparture = (leg.departure.coordinates && leg.departure.coordinates.split(',').map(item => Number.parseFloat(item.trim(), 10))) || []
                      const coordArrival = (leg.arrival.coordinates && leg.arrival.coordinates.split(',').map(item => Number.parseFloat(item.trim(), 10))) || []

                      return [...acc,
                        { lat: coordDeparture[1], lng: coordDeparture[0], title: leg.airport },
                        { lat: coordArrival[1], lng: coordArrival[0], title: leg.airport },
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
        <RouteForm loading={requestLoading} onSubmit={this.onNewSubmit}/>
      </div>
    )
  }
}

export default App
