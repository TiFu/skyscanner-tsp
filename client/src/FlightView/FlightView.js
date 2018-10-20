import React, { Component } from 'react'
import t from 'prop-types'
import styles from './FlightView.module.css'

import MoreVert from '@material-ui/icons/MoreVert'
import FlightTakeoff from '@material-ui/icons/FlightTakeoff'
import FlightLand from '@material-ui/icons/FlightLand'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import {formatTime, printLeadingZero} from '../utils'


class FlightView extends Component {
  static propTypes = {
    flight: t.shape({
      startingCity: t.string,
      finalDestination: t.string,
      selectedAlternative: t.number,
      alternatives: t.arrayOf(t.shape({
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
    }),
    onDirectionChange: t.func,
    onAlternativeChange: t.func,
  }

  render() {
    const { flight: { finalDestination, selectedAlternative, alternatives } } = this.props
    const { price, departureTime, legs, duration, onDirectionChange } = alternatives[selectedAlternative];

    return (
      <div className={styles.flight}>
        <div className={styles.header}>
          <div className={styles.buttons}>
            <div className={styles.top} onClick={() => onDirectionChange(-1)}></div>
            <div className={styles.bottom} onClick={() => onDirectionChange(1)}></div>
          </div>

          <div className={styles.heading}>
            <h1>{finalDestination}</h1>
            <div onClick={() => {
                const prevValue = this.props.flight.selectedAlternative;
                this.props.flight.selectedAlternative = Math.max(0, prevValue - 1);
                if (this.props.flight.selectedAlternative !== prevValue) {
                  this.props.onAlternativeChange(this.props.flight.selectedAlternative)
                }
              }}>
              <IconButton className={styles.close} component="span">
                <ChevronLeft />
              </IconButton>
            </div>
            <div onClick={() => {
                const prevValue = this.props.flight.selectedAlternative;
                this.props.flight.selectedAlternative = Math.min(alternatives.length - 1, prevValue + 1)
                if (this.props.flight.selectedAlternative !== prevValue) {
                  this.props.onAlternativeChange(this.props.flight.selectedAlternative)
                }
              }}>
              <IconButton className={styles.close} component="span">
                <ChevronRight />
              </IconButton>
            </div>
          </div>

          <div className={styles.meta}>
            <div className={styles.date}>
              {`${formatTime(departureTime)} (Flight Duration: ${printLeadingZero(Math.floor(duration/60))}:${printLeadingZero(duration - 60 * Math.floor(duration/60))}h)`}
            </div>
            <div className={styles.price}>
              {`${price.toFixed(2)} EUR`}
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
                { index >= 1 ? formatTime(legs[index - 1].arrival.time) + " " : ""} 
                { index >= 1 ? legs[index - 1].arrival.code : "" }<br />
                {  formatTime(leg.departure.time) +" "}
                { leg.departure.code }
              </div>
            </div>
          ))}
           <div className={styles.leg} key={legs.length}>
              <div className={styles.icon}><FlightLand /></div>
              <div className={styles.destination}>
                {legs[legs.length - 1].arrival.airport}
              </div>
              <div className={styles.time}>
                {`${formatTime(legs[legs.length - 1].arrival.time)} ${legs[legs.length - 1].arrival.code}`}
              </div>
            </div>
        </div>
      </div>
    )
  }
}

export default FlightView
