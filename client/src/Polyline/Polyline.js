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
    id: t.string.isRequired,
    onSelect: t.func,
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

  handleClick = () => {
    if (this.props.onSelect) {
      this.props.onSelect(this.props.id)
    }
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

    this.line.addListener('click', this.handleClick)

    this.markers = path.map((coords) => {
      const marker = new maps.Marker({
        position: coords,
        map: map,
        title: coords.title,
      })

      marker.addListener('click', this.handleClick)
      return marker
    })

    this.line.setMap(map)
    return null
  }
}

export default Polyline
