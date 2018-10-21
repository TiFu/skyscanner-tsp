import { PureComponent } from 'react'
import { colorFromStr } from '../utils'
import t from 'prop-types'

export class Shadowline extends PureComponent {
  static propTypes = {
    path: t.arrayOf(t.shape({
      lat: t.number,
      lng: t.number,
    })).isRequired,
    maps: t.object.isRequired,
    map: t.object.isRequired,
    user: t.string,
  }

  static defaultProps = {
    user: null,
  }

  componentWillUpdate() {
    this.line.setMap(null)
  }

  componentWillUnmount() {
    this.line.setMap(null)
  }

  render() {
    const { maps, path, user,  map } = this.props

    this.line = new maps.Polyline({
      geodesic: true,
      strokeColor: (user && colorFromStr(user)) || "#90A4AE",
      strokeOpacity: 1,
      strokeWeight: 3,
      path,
      map,
    })

    return null
  }
}

export default Shadowline
