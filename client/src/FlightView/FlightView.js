import React, { Component } from 'react'
import t from 'prop-types'
import styles from './FlightView.module.css'

import MoreVert from '@material-ui/icons/MoreVert'
import FlightTakeoff from '@material-ui/icons/FlightTakeoff'
import FlightLand from '@material-ui/icons/FlightLand'


class FlightView extends Component {
  static propTypes = {
    flight: t.shape({
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
    }),
    onDirectionChange: t.func,
  }

  render() {
    const { flight: { finalDestination, price, departureTime, legs, duration, onDirectionChange } } = this.props

    return (
      <div className={styles.flight}>
        <div className={styles.header}>
          <div className={styles.buttons}>
            <div className={styles.top} onClick={() => onDirectionChange(-1)}></div>
            <div className={styles.bottom} onClick={() => onDirectionChange(1)}></div>
          </div>
          <h1>{finalDestination}</h1>
          <div className={styles.meta}>
            <div className={styles.date}>
              {`${departureTime} (${duration})`}
            </div>
            <div className={styles.price}>
              {`${price} EUR`}
            </div>
          </div>
        </div>
        <div className={styles.legs}>
          {legs.map((leg, index) => (
            <div className={styles.leg} key={index}>
              <div className={styles.icon}>
                {index === 0 && <FlightTakeoff />}
                {index !== 0 && index < legs.length && <MoreVert />}
              </div>
              <div className={styles.destination}>
                {leg.departure.airport}
              </div>
              <div className={styles.time}>
                {`${leg.departure.time} ${leg.departure.code}`}
              </div>
            </div>
          ))}
           <div className={styles.leg} key={legs.length}>
              <div className={styles.icon}><FlightLand /></div>
              <div className={styles.destination}>
                {legs[legs.length - 1].departure.airport}
              </div>
              <div className={styles.time}>
                {`${legs[legs.length - 1].departure.time} ${legs[legs.length - 1].departure.code}`}
              </div>
            </div>
        </div>
      </div>
    )
  }
}

export default FlightView