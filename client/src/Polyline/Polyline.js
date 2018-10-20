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
    showSelected: t.bool,
    selected: t.bool,
  }

  static defaultProps = {
    showSelected: false,
    selected: true,
  }

  componentWillUpdate({ showSelected, selected }) {
    const { map, maps } = this.props
    if (showSelected && selected && map && maps && this.line) {
      const bounds = new maps.LatLngBounds()
      this.line.getPath().forEach((e) => {
          bounds.extend(e);
      })
      map.fitBounds(bounds);
    }

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
    const { maps, path, map, user, showSelected, selected } = this.props

    this.line = new maps.Polyline({
      geodesic: true,
      strokeColor: colorFromStr(user),
      strokeOpacity: showSelected ? (selected ? 1 : 0.3) : 1,
      strokeWeight: showSelected ? (selected ? 4 : 2) : 4,
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
