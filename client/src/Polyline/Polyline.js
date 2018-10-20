import React, { PureComponent } from 'react'
import t from 'prop-types'

export class Polyline extends PureComponent {
  static propTypes = {
    user: t.string,
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

  hashCode = (str) => {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      var character = str.charCodeAt(i);
      hash = ((hash<<5)-hash)+character;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  render() {
    const { maps, path, map, user } = this.props

    const colors = [
      "#83be54",
      "#f0d551",
      "#e5943c",
      "#a96ddb",
    ];

    this.line = new maps.Polyline({
      geodesic: true,
      strokeColor: colors[this.hashCode(user) % colors.length],
      strokeOpacity: 1,
      strokeWeight: 4,
      path,
    })

    this.markers = path.map((coords) => new maps.Marker({
      position: coords,
      map: map,
      title: 'title',
    }))

    this.line.setMap(map)

    return path.map(({ lat, lng }) => <div lat={lat} lng={lng}>Test</div>)
  }
}

export default Polyline
