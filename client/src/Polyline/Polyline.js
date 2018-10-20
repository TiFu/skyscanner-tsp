import React, { PureComponent } from 'react'
import t from 'prop-types'

export class Polyline extends PureComponent {
  static propTypes = {
    path: t.arrayOf(t.shape({
      lat: t.number,
      lng: t.number,
    })).isRequired,
    maps: t.object.isRequired,
    map: t.object.isRequired,
  }

  componentWillUpdate() {
    this.line.setMap(null)
    this.markers.forEach(marker => marker.setMap(null))
    this.markers = []
  }

  componentWillUnmount() {
    this.line.setMap(null)
    this.markers.forEach(marker => marker.setMap(null))
    this.markers = []
  }

  render() {
    const { maps, path, map } = this.props

    this.line = new maps.Polyline({
      geodesic: true,
      strokeColor: '#AAAAAA',
      strokeOpacity: 1,
      strokeWeight: 4,
      path,
    })

    this.markers = path.map((coords) => new maps.Marker({
      position: coords,
      map: map,
      title: coords.title,
    }))

    this.line.setMap(map)
    return null
  }
}

export default Polyline
