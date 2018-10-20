import React, { Component } from 'react'
import t from 'prop-types'
import styles from './FlightView.module.css'

import MoreVert from '@material-ui/icons/MoreVert'
import FlightTakeoff from '@material-ui/icons/FlightTakeoff'
import FlightLand from '@material-ui/icons/FlightLand'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import ShoppingCart from '@material-ui/icons/ShoppingCart'
import {formatTime, printLeadingZero} from '../utils'


class FlightView extends Component {
  state = {};
  static propTypes = {
    backgroundImage: t.string,
    flight: t.shape({
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
          })
        }))
      })),
    }),
    onDirectionChange: t.func,
    onAlternativeChange: t.func,
  }

  updateImageBackgrounds(destination) {
    fetch("https://api.teleport.org/api/cities/?search=" + encodeURIComponent( destination ), {
      method: "GET"
    })
    .then(response => response.json())
    .then(async (data) => {
      // Find the most populous city
      const cities = [];
      for (let city of data._embedded["city:search-results"]) {
        cities.push(city._links["city:item"].href);
      }

      const cityDetails = await Promise.all(cities.map(city => fetch(city).then(a => a.json())))

      if (cityDetails.length > 0) {
        const details = cityDetails.filter((item) => !!item._links["city:urban_area"]).sort((a, b) => a.population < b.population);
        if (details.length > 0) {
          const data = await fetch(`${details[0]._links["city:urban_area"].href}images/`).then(a => a.json())
          this.setState({
            backgroundImage: data.photos[0].image.web,
          })
        }
      }
    });
  }

  clearCache() {
    this.setState({ cachedDestination: null });
  }

  componentWillUpdate(newProps) {
    if (this.props.flight.finalDestination !== newProps.flight.finalDestination) {
      this.updateImageBackgrounds(newProps.flight.finalDestination)
    }
  }

  componentDidMount() {
    const { flight: { finalDestination } } = this.props;
    this.updateImageBackgrounds(finalDestination)
    /*
    fetch("https://api.unsplash.com/search/photos?query=" + encodeURIComponent( finalDestination ) + "+city&orientation=landscape", {
      method: "GET",
      headers: {
        Authorization: "Client-ID 3f09b566bf59be5f5e0ee22b1941cf5b6d87b117bb9ff9e65a020e01f50ff88d",
      },
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      console.error(data.results[0].urls.regular);
      this.setState({ backgroundImage: data.results[0].urls.regular })
      // this.forceUpdate();
    });
    //*/
  }

  render() {
    const { backgroundImage } = this.state;
    const { flight: { finalDestination, selectedAlternative, alternatives } } = this.props
    const { price, departureTime, legs, duration, onDirectionChange, deepLink } = alternatives[selectedAlternative];

    return (
      <div className={styles.flight}>
        <div className={styles.header} style={{backgroundImage: "-webkit-linear-gradient(top, transparent, rgba(0, 0, 0, .7)), url('" + backgroundImage + "')"}}>
          <div className={styles.buttons}>
            <div className={styles.top} onClick={() => onDirectionChange(-1)}></div>
            <div className={styles.bottom} onClick={() => onDirectionChange(1)}></div>
          </div>

          <div className={styles.heading}>
            <h1>{finalDestination}</h1>
            {deepLink && <IconButton className={styles.close} onClick={() => window.open(deepLink, '_blank')} component="span" color="secondary">
              <ShoppingCart />
            </IconButton> }
            <div onClick={() => {
                const prevValue = this.props.flight.selectedAlternative;
                this.props.flight.selectedAlternative = Math.max(0, prevValue - 1);
                if (this.props.flight.selectedAlternative !== prevValue) {
                  this.props.onAlternativeChange(this.props.flight.selectedAlternative)
                }
              }}>
              <IconButton className={styles.close} component="span" color="secondary">
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
              <IconButton className={styles.close} component="span" color="secondary">
                <ChevronRight />
              </IconButton>
            </div>
          </div>

          <div className={styles.meta}>
            <div className={styles.date}>
              {`${formatTime(departureTime)} (Flight Duration: ${printLeadingZero(Math.floor(duration/60))}:${printLeadingZero(duration - 60 * Math.floor(duration/60))}h)`}
            </div>
            <div className={styles.price}>
              {`${price.toFixed(2)} €`}
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
                <img className={styles.logo} src={leg.carrierImg} alt={leg.carrier} />
              </div>
              <div className={styles.time}>
                { index >= 1 ? formatTime(legs[index - 1].arrival.time) + " " : ""}
                { index >= 1 ? <>{legs[index - 1].arrival.code}<br /></> : "" }
                { formatTime(leg.departure.time) +" "}
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
