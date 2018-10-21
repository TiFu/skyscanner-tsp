import React, { Component } from 'react'
import io from 'socket.io-client'
import uuid from 'uuid/v4'
import moment from 'moment'
import { GOOGLE_MAP_KEY } from './config'
import airportData from './airports.json'
import hackathonData from './hackathons.json'
import GoogleMap from 'google-map-react'
import RouteForm from './RouteForm'
import Polyline from './Polyline'
import Point from './Point'
import { getDistance } from 'geolib'
import RouteView from './RouteView'
import GeneralView from './GeneralView'
import { colorFromIndex } from './utils'
import { Snackbar } from '@material-ui/core'
import Button from '@material-ui/core/Button';

import './App.css'
import Shadowline from './Shadowline/Shadowline';
import PointerUser from './PointerUser/PointerUser';

const airports = airportData.map(({ Location: loc, Id }) => {
  const [longitude, latitude] = loc.split(',').map(item => Number.parseFloat(item.trim(), 10))
  return { coords: { latitude, longitude }, id: Id }
})

let roomHash = window.location.pathname.includes('/room/') ? window.location.pathname.replace('/room/', '') : null
let showHackButton = window.location.pathname === '/hack';
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

    coopData: null,

    open: false,
    startPlace: null,
    startDate: null,
    cities: [],
    cityCounts: [],
    cityIgnored: [],

    tempPath: [],
  }

  initialLoad = true

  coopTimer = null

  componentDidMount() {
    this.socket = io(':8989')
    window.socket = this.socket;

    // coop feature
    this.coopSocket = io(':8990')
    window.coopSocket = this.socket

    if (!showHackButton) {
      if (!roomHash) {
        this.socket.emit('new_session', { user: username })
      } else {
        this.coopSocket.emit('register', { user: username, id: roomHash })
        this.socket.emit('restore_session', { user: username, id: roomHash })
      }
    }

    const reserve = () => {
      this.coopSocket.emit('poll')
      clearTimeout(this.coopTimer)
      this.coopTimer = setTimeout(reserve, 250)
    }
    this.coopTimer = setTimeout(reserve, 250)

    this.coopSocket.on('room_state', ({ id, data }) => {
      if (id === roomHash) {
        this.setState({ coopData: data })
      }
    })

    this.socket.on('new_session', (data) => {
      const { hackathonStartPlace } = this.state;

      if (this.state.fetchHackathon) {
        console.log("I am alive!");
        this.setState({ fetchHackathon: false, requestLoading: true });

        const id = Math.floor(Math.random() * hackathonData.length);
        const { hackathonPlace, hackathonDuration, hackathonStart } = hackathonData[id];

        this.socket.emit('city_list', {
          id: data.id,
          action: 'city_list',
          routeName: uuid(),
          startingCity: hackathonStartPlace,
          cities: [hackathonStartPlace, hackathonPlace],
          hackathonId: id,
          ignoreFlight: [],
          durationOfStay: {[hackathonPlace]: hackathonDuration},
          // 14 days before the contest starts
          earliestDeparture: moment(hackathonStart, "YYYY-MM-DD").subtract(14, "days").format("YYYY-MM-DD"),
        });
      }

      window.location = `/room/${data.id}`
    })

    this.socket.on('error', (msg) => {
      this.setState({ errorMsg: msg, requestLoading: false })
      // if (msg === 'Unknown session! Session was not restored!') {
      //   window.location = '/'
      // }
    })

    const handleStateReceive = (data) => {
      const filteredData = Object.assign({}, data, {
        routes: data.routes.filter(route => {
          if (!route || !route.trip || !route.trip.flights) return false
          return !route.trip.flights.some(flight => !flight || !flight.alternatives || !flight.alternatives[flight.selectedAlternative])
        })
      })
      if (this.initialLoad && this.state.mapLoaded) {
        this.initialLoad = false
        this.fitMarkers(filteredData, this.state.map, this.state.maps)
      }
      this.setState({ data: filteredData, requestLoading: false })
    }

    this.socket.on('state', handleStateReceive)
    this.socket.on('restore_session', handleStateReceive)
  }

  componentWillUnmount() {
    if (this.state.map) {
      this.state.map.removeListener('mousemove', this.onMapMouseMove)
    }
    clearTimeout(this.coopTimer)
  }

  componentDidUpdate(_, oldState) {
    if (this.state.tempPath.join(',') !== oldState.tempPath.join(',')) {
      this.coopSocket.emit('temp_coords', this.state.tempPath)
    }
  }

  onClose = () => this.setState({ selectedRouteId: null })

  onReorder = (data) => {
    this.setState({ requestLoading: true })
    this.socket.emit('reorder_cities', Object.assign({}, data, {
      id: roomHash,
      action: 'reorder_cities'
    }))
  }

  onNewSubmit = () => {
    const { startPlace, cities, cityCounts, startDate, cityIgnored } = this.state
    this.setState({ requestLoading: true })

    this.socket.emit('city_list', {
      id: roomHash,
      action: 'city_list',
      routeName: uuid(),
      startingCity: startPlace,
      cities: [startPlace, ...cities],
      ignoreFlight: [startPlace, ...cities].filter((_, index) => cityIgnored.includes(index)),
      durationOfStay: cityCounts.reduce((memo, count, index) => ({ ...memo, [cities[index]]: count }), {[startPlace]: 0}),
      earliestDeparture: startDate,
    })
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

  lastMouseMove = 0

  onMapMouseMove = ({ latLng }) => {
    if (this.lastMouseMove + 25 < Date.now()) {
      const lat = latLng.lat()
      const lng = latLng.lng()

      this.coopSocket.emit('mouse_location', { lat, lng })
      this.lastMouseMove = Date.now()
    }
  }

  onMapLoaded = ({ map, maps }) => {
    this.setState({ map, maps, mapLoaded: true })

    if (this.state.data && this.initialLoad) {
      this.initialLoad = false
      this.fitMarkers(this.state.data, map, maps)
    }

    map.addListener('mousemove', this.onMapMouseMove)
  }

  fitMarkers = (data, map, maps) => {
    const bounds = new maps.LatLngBounds()
    let hasBounds = false
    data.routes.forEach(route => route.trip && route.trip.flights.forEach(flight => {
      flight.alternatives && flight.alternatives[flight.selectedAlternative] && flight.alternatives[flight.selectedAlternative].legs.forEach(leg => {
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
    const coords = airports.map(({ coords, id }) => ({ id, coords, distance: getDistance(coords, center) }));
    coords.sort((a, b) => a.distance - b.distance)
    return coords.slice(0, limit)
  }

  toggle = () => {
    this.setState(state => ({ open: !state.open, tempPath: [], cityCounts: [], cities: [], startPlace: null, startDate: null, cityIgnored: [] }))
  }

  parseCity = (value) => value && value.split(',')[0]

  handleStartChange = ({ suggestion }) => {
    if (suggestion) {
      const newState = { startPlace: this.parseCity(suggestion.value) }
      if (suggestion.latlng) {
        newState.tempPath = [...this.state.tempPath, suggestion.latlng]
      }

      this.setState(newState)
    }
  }

  handleNewChange = ({ suggestion }) => {
    if (suggestion) {
      const newState = {
        cities: [...this.state.cities, this.parseCity(suggestion.value)],
        cityCounts: [...this.state.cityCounts, 1],
      }

      if (suggestion.latlng) {
        newState.tempPath = [...this.state.tempPath, suggestion.latlng]
      }

      this.setState(newState)
    }
  }

  handleRemove = (index) => {
    const newCities = this.state.cities.filter((_, i) => index !== i)
    const newCityCounts = this.state.cityCounts.filter((_, i) => index !== i)
    const tempPath = this.state.tempPath.filter((_, i) => index !== i - 1)

    this.setState({ cities: newCities, cityCounts: newCityCounts, tempPath })
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

  handleDayChange = (newDate) => {
    this.setState({ startDate: moment(newDate).format('YYYY-MM-DD') })
  }

  handlePointClick = (id, coords) => {
    if (!this.state.startPlace) {
      console.log(coords)
      this.handleStartChange({ suggestion: { value: id, latlng: { lat: coords.latitude, lng: coords.longitude } } })
    } else {
      this.handleNewChange({ suggestion: { value: id, latlng: { lat: coords.latitude, lng: coords.longitude } } })
    }

    this.setState({ open: true })
  }

  render() {
    const { map, maps, mapLoaded, selectedRouteId, data, requestLoading, errorMsg, airports, coopData, tempPath } = this.state
    const selectedRoute = selectedRouteId && data && data.routes && data.routes.find(route => route.routeName === selectedRouteId)
    if (showHackButton) {
      return (
        <center className="hackatech">
          <h1>Hackathons are Awesome</h1>
          <Button variant="contained" color="primary" className="hackatechButton" onClick={() => {
            showHackButton = false;
            roomHash = null;

            if (!navigator.geolocation) {
              window.alert("Your browser does not support geolocation :(" );
            } else {
              navigator.geolocation.getCurrentPosition(position => {
                // position.coords.latitude/longitude
                const closestAirports = this.findNearestAirports({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude
                }, 1);

                if (closestAirports.length === 0) {
                  window.alert("Sorry, there was a problem while looking for your flight options");
                } else {
                  this.setState({ hackathonStartPlace: closestAirports[0].id, fetchHackathon: true })
                  this.socket.emit('new_session', { user: username });
                }
              });
            }
          }}>
            Attend One ASAP
          </Button>
        </center>
      )
    } else {
      return (
        <div className="App">
          <div className="overlay">
          <span className="overlayWrapper">
            <RouteForm
              owner={username}
              open={this.state.open}
              startPlace={this.state.startPlace}
              startDate={this.state.startDate}
              cities={this.state.cities}
              cityCounts={this.state.cityCounts}
              cityIgnored={this.state.cityIgnored}
              userCount={coopData && coopData.userCount}

              toggle={this.toggle}
              handleStartChange={this.handleStartChange}
              handleNewChange={this.handleNewChange}
              handleRemove={this.handleRemove}
              handleCountChange={this.handleCountChange}
              handleIgnoreToggle={this.handleIgnoreToggle}
              submit={this.onNewSubmit}
              handleDayChange={this.handleDayChange}
              loading={requestLoading}
            />
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
          </div>
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
                      onSelect={(id) => this.setState({ selectedRouteId: id, tempPath: [] })}
                      color={colorFromIndex(index)}
                      user={route.owner}
                      path={flight.alternatives && flight.alternatives[flight.selectedAlternative] && flight.alternatives[flight.selectedAlternative].legs && flight.alternatives[flight.selectedAlternative].legs.reduce((acc, leg) => {
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
              {airports.map(({ coords, id }) => (<Point key={id} lat={coords.latitude} onClick={() => this.handlePointClick(id, coords)} lng={coords.longitude} />))}
              {mapLoaded && <Shadowline path={tempPath} map={map} maps={maps} />}
              {coopData && coopData.mouseBroadcasts && Object.entries(coopData.mouseBroadcasts).map(([user, coords]) => {
                if (user === username) return null
                return <PointerUser key={`pointer-${user}`} user={user} {...coords} />
              })}
              {mapLoaded && coopData && coopData.tempPaths && Object.entries(coopData.tempPaths).map(([user, tempPath]) => {
                if (user === username) return null
                return <Shadowline key={`shadowpath-${user}`} user={user} path={tempPath} map={map} maps={maps} />
              })}
            </GoogleMap>

          </div>
          <Snackbar open={!!errorMsg} onClose={() => this.setState({ errorMsg: null })} autoHideDuration={3000} message={errorMsg} />
        </div>
      )
    }
  }
}

export default App
