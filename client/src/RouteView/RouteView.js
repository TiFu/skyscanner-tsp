import React, { Component } from 'react'
import t from 'prop-types'
import FlightView from '../FlightView'
import { colorFromStr } from '../utils'
import Card from '@material-ui/core/Card'
import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import FilterNone from '@material-ui/icons/FilterNone'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { printLeadingZero } from '../utils'
import styles from './RouteView.module.css'
import { CircularProgress, Tooltip } from '@material-ui/core';


const SortableFlightItem = SortableElement(FlightView)
const SortableFlights = SortableContainer(({ onDirectionChange, onAlternativeChange, flights, scrollDisabled }) => (
  <div className={[styles.flights, ...(scrollDisabled ? [styles.loading] : [])].join(' ')}>
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
      trip: t.shape({
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
      }),
    }),
    loading: t.bool,
    onClose: t.func,
    onReorder: t.func,
    onDuplicate: t.func,
    onAlternative: t.func,
  }

  state = {
    sorting: false,
  }

  onDirectionChange = ({ oldIndex, newIndex }) => {
    this.setState({ sorting: false })

    if (oldIndex !== newIndex) {
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
  }

  onAlternativeChange = ({ selectedAlternative, flightId }) => {
    this.props.onAlternative({
      selectedAlternative,
      flightId,
      routeName: this.props.route.routeName,
    })
  }

  render() {
    const { loading, route: { owner, trip }, onClose, onDuplicate } = this.props
    const { sorting } = this.state

    let { totalPrice, flights } = trip

    totalPrice = trip.flights.reduce((prev, flight) => {
      const alternative = flight.alternatives[flight.selectedAlternative];
      return prev + alternative.price;
    }, 0);

    let totalDuration = trip.flights.reduce((prev, flight) => {
      const alternative = flight.alternatives[flight.selectedAlternative]
      return prev + alternative.duration
    }, 0)

    return <div className={styles.route}>
      <Card>
        <div className={[...(loading ? [styles.cardLoading] : []), ...(sorting ? [styles.cardSorting] : [])].join(' ')}>
          {loading && <div className={styles.progress}><CircularProgress size={60} /></div>}

          <div className={styles.ownerHeader} style={{ backgroundColor: colorFromStr(owner) }}>
            <div className={styles.owner}>
              {owner}'s route
            </div>
            <Tooltip title="Duplicate route" placement="top">
              <IconButton className={styles.close} onClick={() => {onDuplicate({routeName: this.props.route.routeName})}} component="span" size="small">
                <FilterNone />
              </IconButton>
            </Tooltip>

            <Tooltip title="Close" placement="top">
              <IconButton className={styles.close} onClick={onClose} component="span" size="small">
                <Close />
              </IconButton>
            </Tooltip>

          </div>

          <SortableFlights
            scrollDisabled={loading}
            flights={flights}
            lockToContainerEdges
            onSortEnd={this.onDirectionChange}
            helperClass={styles.helper}
            lockAxis="y"
            onDirectionChange={this.onDirectionChange}
            onAlternativeChange={this.onAlternativeChange}
            onSortStart={() => this.setState({ sorting: true })}
          />

          <div className={styles.footer}>
            <div className={styles.length}>{`Total Duration: ${printLeadingZero(Math.floor(totalDuration/60))}:${printLeadingZero(totalDuration - 60 * Math.floor(totalDuration/60))}h`}</div>
            <div className={styles.total}>{`${totalPrice.toFixed(2)} €`}</div>
          </div>
        </div>
      </Card>
    </div>
  }
}

export default RouteView
