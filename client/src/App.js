import React, { Component } from 'react'
import io from 'socket.io-client'
import { GOOGLE_MAP_KEY, SKYSCANNER_API_KEY } from './config'
import GoogleMap from 'google-map-react'
import RouteForm from './RouteForm'
import Polyline from './Polyline'
import RouteView from './RouteView'
import GeneralView from './GeneralView'
import { colorFromIndex } from './utils'
import { Snackbar } from '@material-ui/core'

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
    errorMsg: null,
    airports: [],
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

    this.socket.on('error', (msg) => {
      this.setState({ errorMsg: msg, requestLoading: false })
      // if (msg === 'Unknown session! Session was not restored!') {
      //   window.location = '/'
      // }
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

  // fetchPoints = async () => {
  //   await fetch(`http://partners.api.skyscanner.net/apiservices/geo/v1.0?apiKey=${SKYSCANNER_API_KEY}&languageid=en-US`).then(a => a.json())

  //   this.setState({ airports: })
  // }

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

  onDuplicate = (data) => {
    this.socket.emit('copy_route', Object.assign({}, data, {
      id: roomHash,
      action: 'copy_route',
    }));
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
    let hasBounds = false
    data.routes.forEach(route => route.trip && route.trip.flights.forEach(flight => {
      flight.alternatives[flight.selectedAlternative].legs.forEach(leg => {
        const coordDeparture = (leg.departure.coordinates && leg.departure.coordinates.split(',').map(item => Number.parseFloat(item.trim(), 10))) || []
        const coordArrival = (leg.arrival.coordinates && leg.arrival.coordinates.split(',').map(item => Number.parseFloat(item.trim(), 10))) || []

        hasBounds = true
        bounds.extend(new maps.LatLng(coordDeparture[1], coordDeparture[0]))
        bounds.extend(new maps.LatLng(coordArrival[1], coordArrival[0]))
      })
    }))

    if (hasBounds) {
      map.fitBounds(bounds)
    }

  }

  render() {
    const { map, maps, mapLoaded, selectedRouteId, data, requestLoading, errorMsg } = this.state
    const selectedRoute = selectedRouteId && data && data.routes && data.routes.find(route => route.routeName === selectedRouteId)

    return (
      <div className="App">
        <span className="overlayWrapper">
          <RouteForm loading={requestLoading} onSubmit={this.onNewSubmit}/>
          { selectedRoute &&
            <RouteView
              loading={requestLoading}
              route={selectedRoute}
              onReorder={this.onReorder}
              onAlternative={this.onAlternative}
              onClose={this.onClose}
              onDuplicate={this.onDuplicate}
            />
          }
        </span>
        { data && <GeneralView routes={data.routes} onSelectRoute={id => this.setState({ selectedRouteId: id })} /> }
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

                  <div
                    lat={59.955413}
                    lng={30.337844}
                    text={'Kreyser Avrora'}>
                    <svg width="10" height="10">
                      <circle cx="5" cy="5" r="4" fill="red" stroke-width="0"/>
                    </svg>
                  </div>

          </GoogleMap>

        </div>
        <Snackbar open={!!errorMsg} onClose={() => this.setState({ errorMsg: null })} autoHideDuration={3000} message={errorMsg} />
      </div>
    )
  }
}

export default App
