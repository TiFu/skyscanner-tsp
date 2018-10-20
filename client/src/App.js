import React, { Component } from 'react'
import io from 'socket.io-client'
import uuid from 'uuid/v4'
import moment from 'moment'
import { GOOGLE_MAP_KEY } from './config'
import airportData from './airports.json'
import GoogleMap from 'google-map-react'
import RouteForm from './RouteForm'
import Polyline from './Polyline'
import Point from './Point'
import { getDistance } from 'geolib'
import RouteView from './RouteView'
import GeneralView from './GeneralView'
import { colorFromIndex } from './utils'
import { Snackbar } from '@material-ui/core'

import './App.css'

const airports = airportData.map(({ Location: loc, Id }) => {
  const [longitude, latitude] = loc.split(',').map(item => Number.parseFloat(item.trim(), 10))
  return { coords: { latitude, longitude }, id: Id }
})

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

    open: false,
    startPlace: null,
    startDate: null,
    cities: [],
    cityCounts: [],
    cityIgnored: [],
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

  onMapChange = ({ center }) => {
    this.setState({ airports: this.findNearestAirports(center) })
  }

  findNearestAirports = (center, limit = 50) => {
    const coords = airports.map(({ coords, id }) => ({ id, coords, distance: getDistance(coords, center) }))
    coords.sort((a, b) => a.distance - b.distance)
    return coords.slice(0, limit)
  }

  toggle = () => this.setState(state => ({ open: !state.open }))

  parseCity = (value) => value && value.split(',')[0]

  handleStartChange = ({ suggestion }) => {
    if (suggestion) {
      this.setState({ startPlace: this.parseCity(suggestion.value) })
    }
  }

  handleNewChange = ({ suggestion }) => {
    if (suggestion) {
      this.setState(({ cities, cityCounts }) => ({ cities: [...cities, this.parseCity(suggestion.value)], cityCounts: [...cityCounts, 1] }))
    }
  }

  handleRemove = (index) => {
    const newCities = this.state.cities.filter((_, i) => index !== i)
    const newCityCounts = this.state.cityCounts.filter((_, i) => index !== i)

    this.setState({ cities: newCities, cityCounts: newCityCounts })
  }

  handleCountChange = (index, value) => {
    const newCounts = [...this.state.cityCounts]
    newCounts[index] = Math.max(1, value)
    this.setState({cityCounts: newCounts })
  }

  handleIgnoreToggle = (index) => {
    if (this.state.cityIgnored.includes(index)) {
      this.setState({ cityIgnored: this.state.cityIgnored.filter(i => i !== index)})
    } else {
      this.setState({ cityIgnored: [...this.state.cityIgnored, index]})
    }
  }

  submit = () => {
    const { startPlace, cities, cityCounts, startDate, cityIgnored } = this.state
    this.onNewSubmit({
      routeName: uuid(),
      startingCity: startPlace,
      cities: [startPlace, ...cities],
      ignoreFlight: [startPlace, ...cities].filter((_, index) => cityIgnored.includes(index)),
      durationOfStay: cityCounts.reduce((memo, count, index) => ({ ...memo, [cities[index]]: count }), {[startPlace]: 0}),
      earliestDeparture: startDate,
    })
  }

  handleDayChange = (newDate) => {
    this.setState({ startDate: moment(newDate).format('YYYY-MM-DD') })
  }

  render() {
    const { map, maps, mapLoaded, selectedRouteId, data, requestLoading, errorMsg, airports } = this.state
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
            onChange={this.onMapChange}
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
            {airports.map(({ coords: { latitude, longitude }, id }) => (<Point key={id} lat={latitude} onClick={() => console.log(id)} lng={longitude} />))}
          </GoogleMap>

        </div>
        <RouteForm
          open={this.state.open}
          startPlace={this.state.startPlace}
          startDate={this.state.startDate}
          cities={this.state.cities}
          cityCounts={this.state.cityCounts}
          cityIgnored={this.state.cityIgnored}

          toggle={this.toggle}
          handleStartChange={this.handleStartChange}
          handleNewChange={this.handleNewChange}
          handleRemove={this.handleRemove}
          handleCountChange={this.handleCountChange}
          handleIgnoreToggle={this.handleIgnoreToggle}
          submit={this.submit}
          handleDayChange={this.handleDayChange}
        />
        <Snackbar open={!!errorMsg} onClose={() => this.setState({ errorMsg: null })} autoHideDuration={3000} message={errorMsg} />
      </div>
    )
  }
}

export default App
