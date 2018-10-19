import React, { Component } from 'react'
import { GOOGLE_MAP_KEY } from './config'
import GoogleMap from 'google-map-react'
import Polyline from './Polyline'

import './App.css'


class App extends Component {
  state = {
    map: undefined, maps: undefined, mapLoaded: false,
  }
  render() {
    return (
      <div className="App">

        <div className="map">
          <GoogleMap
            bootstrapURLKeys={{ key: GOOGLE_MAP_KEY }}
            defaultCenter={{ lat: 41.389195, lng: 2.113388 }}
            defaultZoom={10}
            onGoogleApiLoaded={({ map, maps }) => { this.setState({ map, maps, mapLoaded: true }) }}
            yesIWantToUseGoogleMapApiInternals
          >
            { this.state.mapLoaded && (
              <Polyline
                path={[
                  { lat: 41.389195, lng: 2.113388 },
                  { lat: 41.390195, lng: 2.123388 },
                ]}
                map={this.state.map}
                maps={this.state.maps}
              />
            ) }
          </GoogleMap>
          
        </div>
      </div>
    )
  }
}

export default App
