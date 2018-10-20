import React, { Component } from 'react'
import t from 'prop-types'
import FlightView from '../FlightView'
import { colorFromStr } from '../utils'
import Card from '@material-ui/core/Card'
import IconButton from '@material-ui/core/IconButton'
import CardMedia from '@material-ui/core/CardMedia'
import Close from '@material-ui/icons/Close'

import styles from './RouteView.module.css'

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

  onDirectionChange = () => {
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
          
          <div className={styles.flights}>
            {flights.map(flight => <FlightView onDirectionChange={this.onDirectionChange} flight={flight} key={flight.startingCity + flight.finalDestination} />)}
          </div>
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