import { PureComponent } from 'react'
import t from 'prop-types'
import { colorFromStr } from '../utils'

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
    color: t.string,
    onSelect: t.func,
  }

  componentWillUpdate() {
    this.line.setMap(null)
    this.startMarker.setMap(null)
    this.endMarker.setMap(null)
  }

  componentWillUnmount() {
    this.line.setMap(null)
    this.startMarker.setMap(null)
    this.endMarker.setMap(null)
  }

  handleClick = () => {
    if (this.props.onSelect) {
      this.props.onSelect(this.props.id)
    }
  }

  render() {
    const { maps, path, map, user } = this.props

    this.line = new maps.Polyline({
      geodesic: true,
      strokeColor: colorFromStr(user),
      strokeOpacity: 1,
      strokeWeight: 4,
      path,
      map,
    })

    this.startMarker = new maps.Marker({
      position: path[0],
      title: path[0].title,
      map,
    })

    this.endMarker = new maps.Marker({
      position: path[path.length - 1],
      title: path[path.length - 1].title,
      map,
    })

    this.line.addListener('click', this.handleClick)
    this.startMarker.addListener('click', this.handleClick)
    this.endMarker.addListener('click', this.handleClick)
    return null
  }
}

export default Polyline
