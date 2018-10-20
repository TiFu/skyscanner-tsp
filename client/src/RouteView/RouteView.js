import React, { Component } from 'react'
import t from 'prop-types'
import FlightView from '../FlightView'
import { colorFromStr } from '../utils'
import Card from '@material-ui/core/Card'
import IconButton from '@material-ui/core/IconButton'
import CardMedia from '@material-ui/core/CardMedia'
import Close from '@material-ui/icons/Close'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'

import styles from './RouteView.module.css'


const SortableFlightItem = SortableElement(FlightView)
const SortableFlights = SortableContainer(({ onDirectionChange, flights }) => (
  <div className={styles.flights}>
    {flights.map((flight, index) => <SortableFlightItem onDirectionChange={onDirectionChange} index={index} flight={flight} key={`key-${index}`} />)}
  </div>
))

class RouteView extends Component {
  static propTypes = {
    route: t.shape({
      owner: t.string,
      routeName: t.string,
      cities: t.arrayOf(t.string),
      durationOfStay: t.object,
      trip: {
        totalPrice: t.number,
        flights: t.arrayOf(t.shape({
          startingCity: t.string,
          finalDestination: t.string,
          price: t.number,
          numberOfStops: t.number,
          departureTime: t.string,
          arrivalTime: t.string,
          duration: t.number,
          legs: t.arrayOf(t.shape({
            duration: t.number,
            carrier: t.string,
            flightNumber: t.string,
            departure: t.shape({
              coordinates: t.string,
              time: t.string,
              airport: t.string,
              code: t.string,
            }),
            arrival: t.shape({
              coordinates: t.string,
              time: t.string,
              airport: t.string,
              code: t.string,
            })
          }))
        })),
      },
    }),
    onClose: t.func,
    onReorder: t.func,
  }

  onDirectionChange = ({ oldIndex, newIndex }) => {
    const newCities = this.props.route.cities.map((item, index) => {
      if (index == oldIndex) return this.props.route.cities[newIndex]
      if (index == newIndex) return this.props.route.cities[oldIndex]
      return item
    })
    
    this.props.onReorder({
      routeName: this.props.route.routeName,
      ignoreCities: this.props.route.ignoreCities,
      order: newCities,
    })
  }

  render() {
    const { route: { owner, durationOfStay, trip }, onClose } = this.props
    const { totalPrice, flights } = trip

    return <div className={styles.route}>
      <Card>
        <CardMedia>

          <IconButton className={styles.close} onClick={onClose} component="span">
            <Close />
          </IconButton>
          
          <SortableFlights flights={flights} lockToContainerEdges onSortEnd={this.onDirectionChange} helperClass={styles.helper} lockAxis="y" onDirectionChange={this.onDirectionChange} />
          
          <div className={styles.footer}>
            <div className={styles.length}>{Object.values(durationOfStay).reduce((memo, item) => memo + item, 0)}</div>
            <div className={styles.total}>{`${totalPrice} EUR`}</div>
          </div>
          <div className={styles.owner} style={{ backgroundColor: colorFromStr(owner) }}>{owner}</div>
        </CardMedia>
      </Card>
    </div>
  }
}

export default RouteView