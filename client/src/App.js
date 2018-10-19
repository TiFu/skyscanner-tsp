import React, { Component, PureComponent } from 'react'
import { GOOGLE_MAP_KEY } from './config'
// import socketIO from 'socket.io'
import GoogleMap from 'google-map-react'
import './App.css'


// const io = socketIO(80)

// io.on('connection', (socket) =>{
//   socket.broadcast.emit()
// })

class Polyline extends PureComponent {

  componentWillUpdate() {
    this.line.setMap(null)
  }

  componentWillUnmount() {
    this.line.setMap(null)
  }

  getPaths() {
    const { origin, destination } = this.props

    console.log('get paths')

    return [
      { lat: Number(origin.lat), lng: Number(origin.lng) },
      { lat: Number(destination.lat), lng: Number(destination.lng) }
    ];
  }

  render() {
    const Polyline = this.props.maps.Polyline
    const renderedPolyline = this.renderPolyline()
    const paths = { path: this.getPaths() }

    const polylineConfig = Object.assign({}, renderedPolyline, paths)

    this.line = new Polyline(polylineConfig)


    console.log('rendering', polylineConfig, this.props.map)

    this.line.setMap(this.props.map)

    return null
  }

  renderPolyline() {
    throw new Error('Implement renderPolyline method')
  }

}



class Normal extends Polyline {

  renderPolyline() {
    return {
      geodesic: true,
      strokeColor: this.props.color || '#AAAAAA',
      strokeOpacity: 1,
      strokeWeight: 4
    }
  }
}


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
            defaultCenter={{
              lat: 59.95,
              lng: 30.33
            }}
            defaultZoom={10}
            onGoogleApiLoaded={({ map, maps }) => { this.setState({ map, maps, mapLoaded: true }) }}
            yesIWantToUseGoogleMapApiInternals
          >
          </GoogleMap>
          { this.state.mapLoaded && <Normal
              origin={{
                lat: 59.95,
                lng: 30.33
              }}
              destination={{
                lat: 58.95,
                lng: 29.33
              }}
              map={this.state.map} maps={this.state.maps} /> }
        </div>
      </div>
    )
  }
}

export default App
