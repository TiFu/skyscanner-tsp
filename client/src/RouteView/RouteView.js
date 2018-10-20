import React, { Component } from 'react'
import t from 'prop-types'
import FlightView from '../FlightView'
import { colorFromStr } from '../utils'
import Card from '@material-ui/core/Card'
import IconButton from '@material-ui/core/IconButton'
import CardMedia from '@material-ui/core/CardMedia'
import Close from '@material-ui/icons/Close'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { printLeadingZero } from '../utils'
import styles from './RouteView.module.css'
import { CircularProgress } from '@material-ui/core';


const SortableFlightItem = SortableElement(FlightView)
const SortableFlights = SortableContainer(({ onDirectionChange, onAlternativeChange, flights, scrollDisabled }) => (
  <div className={[styles.flights, ...(scrollDisabled ? [styles.loading] : [])].join(' ')}>
    {scrollDisabled && <div className={styles.progress}><CircularProgress size={60} /></div>}
    {flights.map((flight, index) => (
      <SortableFlightItem
        onAlternativeChange={(selectedAlternative) => onAlternativeChange({ selectedAlternative, flightId: index })}
        onDirectionChange={onDirectionChange}
        disabled={scrollDisabled}
        index={index}
        flight={flight}
        key={`key-${index}`}
      />
    ))}
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
          selectedAlternative: t.number,
          alternatives: t.arrayOf(t.shape({
            deepLink: t.string,
            price: t.number,
            numberOfStops: t.number,
            departureTime: t.string,
            arrivalTime: t.string,
            duration: t.number,
            legs: t.arrayOf(t.shape({
              duration: t.number,
              carrier: t.string,
              carrierImg: t.string,
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
              }),
            })),
          })),
        })),
      },
    }),
    loading: t.bool,
    onClose: t.func,
    onReorder: t.func,
    onAlternative: t.func,
  }

  onDirectionChange = ({ oldIndex, newIndex }) => {
    const newCities = this.props.route.cities.map((item, index) => {
      if (index === oldIndex) return this.props.route.cities[newIndex]
      if (index === newIndex) return this.props.route.cities[oldIndex]
      return item
    })

    this.props.onReorder({
      routeName: this.props.route.routeName,
      ignoreCities: this.props.route.ignoreCities,
      order: newCities,
    })
  }

  onAlternativeChange = ({ selectedAlternative, flightId }) => {
    this.props.onAlternative({
      selectedAlternative,
      flightId,
      routeName: this.props.route.routeName,
    })
  }

  render() {
    const { loading, route: { owner, trip }, onClose } = this.props
    let { totalPrice, flights } = trip

    totalPrice = trip.flights.reduce((prev, flight) => {
      const alternative = flight.alternatives[flight.selectedAlternative];
      return prev + alternative.price;
    }, 0);

    let totalDuration = trip.flights.reduce((prev, flight) =>{
      const alternative = flight.alternatives[flight.selectedAlternative]
      return prev + alternative.duration
    }, 0)

    return <div className={styles.route}>
      <Card>
        <CardMedia>

          <IconButton className={styles.close} onClick={onClose} component="span" color="secondary">
            <Close />
          </IconButton>

          <SortableFlights
            scrollDisabled={loading}
            flights={flights}
            distance="12"
            lockToContainerEdges
            onSortEnd={this.onDirectionChange}
            helperClass={styles.helper}
            lockAxis="y"
            onDirectionChange={this.onDirectionChange}
            onAlternativeChange={this.onAlternativeChange}
          />

          <div className={styles.footer}>
            <div className={styles.length}>{`Total Duration: ${printLeadingZero(Math.floor(totalDuration/60))}:${printLeadingZero(totalDuration - 60 * Math.floor(totalDuration/60))}h`}</div>
            <div className={styles.total}>{`${totalPrice.toFixed(2)} €`}</div>
          </div>
          <div className={styles.owner} style={{ backgroundColor: colorFromStr(owner) }}>{owner}</div>
        </CardMedia>
      </Card>
    </div>
  }
}

export default RouteView
