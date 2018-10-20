import React, { Component } from 'react'
import t from 'prop-types'
import { Card, CardContent, Avatar, ListItem, ListItemText, CardActionArea } from '@material-ui/core';
import { colorFromStr, getInitials, formatTime } from '../utils'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'

import styles from './GeneralView.module.css';

class GeneralView extends Component {
  static propTypes = {
    routes: t.arrayOf(t.shape({
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
    }))
  }

  groupByAuthor = (routes) => routes.reduce((memo, route) => {
    if (typeof memo[route.owner] === 'undefined') {
      memo[route.owner] = []
    }
    memo[route.owner].push(route)
    return memo
  }, {})

  getSelectedFlights = (flights) => flights.map(flight => Object.assign({}, flight, flight.alternatives[flight.selectedAlternative]))
  getPeriodString = (selectedFlights) => {
    return `${formatTime(selectedFlights[0].departureTime)} – ${formatTime(selectedFlights[selectedFlights.length - 1].arrivalTime)}`
  }

  getDuration = (selectedFlights) => selectedFlights.reduce((acc, flight) => acc + flight.duration, 0)
  getPrice = (selectedFlights) => selectedFlights.reduce((acc, flight) => acc + flight.price, 0)
  
  render() {
    const { routes } = this.props
    const byAuthor = this.groupByAuthor(routes)
    return (
      <div className={styles.list}>
        {Object.entries(byAuthor).map(([owner, routes]) => (
          <div>
            <header>
              <Avatar color={colorFromStr(owner)}>{getInitials(owner)}</Avatar>
              {owner}
            </header>

            {routes.map((route, index) => {
              console.log('route', route)
              if (!route.trip || !route.trip.flights) return null
              const selectedFlights = this.getSelectedFlights(route.trip.flights)
              return (
                <Card key={route.routeName + index}>
                  <CardContent>
                    <ListItemText>
                      <div className={styles.name}>
                        {route.cities.reduce((memo, city, index) => {
                          if (index !== 0) {
                            memo.push(<KeyboardArrowRight key={`dash-${index}`} />)
                          }
                          memo.push(<span key={`city-${index}`}>{city}</span>)
                          return memo
                        }, [])}
                      </div>
                      <div className={styles.period}>
                        {this.getPeriodString(selectedFlights)}
                      </div>
                    </ListItemText>
                  </CardContent>
                  <CardActionArea>
                    <ListItemText>
                      <div className={styles.duration}>
                        {this.getDuration(selectedFlights)}
                      </div>
                      <div className={styles.price}>
                        {this.getPrice(selectedFlights)}
                      </div>
                    </ListItemText>
                  </CardActionArea>
                </Card>
              )
            })}
          </div>
        ))}
      </div>
    )
  }
}

export default GeneralView