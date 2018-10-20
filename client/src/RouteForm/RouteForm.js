import React, { Component } from 'react'
import uuid from 'uuid/v4'
import t from 'prop-types'
import moment from 'moment'

import Card from '@material-ui/core/Card'
import AddIcon from '@material-ui/icons/Add'
import LocalAirport from '@material-ui/icons/LocalAirport'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import CircularProgress from '@material-ui/core/CircularProgress'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Input from '@material-ui/core/Input'
import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import Commute from '@material-ui/icons/Commute'
import FlightLand from '@material-ui/icons/FlightLand'
import Add from '@material-ui/icons/Add'
import CalendarToday from '@material-ui/icons/CalendarToday'
import FlightTakeoff from '@material-ui/icons/FlightTakeoff'
import Button from '@material-ui/core/Button'


import AlgoliaPlaces from '../PlacesInput'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import './Calendar.style.css'
import styles from './RouteForm.module.css'
import { CardActions } from '@material-ui/core';

class RouteForm extends Component {
  static propTypes = {
    loading: t.bool,
  }

  state = {
    open: false,
    startPlace: null,
    startDate: null,
    cities: [],
    cityCounts: [],
    cityIgnored: [],
  }

  toggle = () => this.setState(state => ({ open: !state.open }))

  parseCity = (value) => value && value.split(',')[0]

  handleStartChange = ({ suggestion }) => {
    if (suggestion) {
      this.setState({ startPlace: this.parseCity(suggestion.value) })
    }
  }

  handleNewChange = ({ suggestion }) => {
    if (suggestion) {
      this.setState(({ cities, cityCounts }) => ({ cities: [...cities, this.parseCity(suggestion.value)], cityCounts: [...cityCounts, 1] }))
    }
  }

  handleRemove = (index) => {
    const newCities = this.state.cities.filter((_, i) => index !== i)
    const newCityCounts = this.state.cityCounts.filter((_, i) => index !== i)

    this.setState({ cities: newCities, cityCounts: newCityCounts })
  }

  handleCountChange = (index, value) => {
    const newCounts = [...this.state.cityCounts]
    newCounts[index] = Math.max(1, value)
    this.setState({cityCounts: newCounts })
  }

  handleIgnoreToggle = (index) => {
    if (this.state.cityIgnored.includes(index)) {
      this.setState({ cityIgnored: this.state.cityIgnored.filter(i => i !== index)})
    } else {
      this.setState({ cityIgnored: [...this.state.cityIgnored, index]})
    }
  }

  submit = () => {
    const { startPlace, cities, cityCounts, startDate, cityIgnored } = this.state
    this.props.onSubmit({
      routeName: uuid(),
      startingCity: startPlace,
      cities: [startPlace, ...cities],
      ignoreFlight: [startPlace, ...cities].filter((_, index) => cityIgnored.includes(index)),
      durationOfStay: cityCounts.reduce((memo, count, index) => ({ ...memo, [cities[index]]: count }), {[startPlace]: 0}),
      earliestDeparture: startDate,
    })
  }

  handleDayChange = (newDate) => {
    this.setState({ startDate: moment(newDate).format('YYYY-MM-DD') })
  }

  render() {
    const { loading } = this.props
    const { startPlace, startDate, open, cities, cityCounts, cityIgnored } = this.state
    return (
      <div className={styles.container}>
        { open && 
          <Card className={styles.overlay}>
            <List>
              <ListItem>
                <AlgoliaPlaces disabled={loading} language="en" type="city" placeholder="Start city" onChange={this.handleStartChange} />
                <ListItemSecondaryAction>
                  <IconButton>
                    <FlightTakeoff />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <DayPickerInput disabled={loading} format="YYYY-MM-DD" onDayChange={this.handleDayChange}  placeholder="Earliest departure"  inputProps={{ className: styles.calendarInput }} />
                <ListItemSecondaryAction>
                  <IconButton>
                    <CalendarToday />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              
              
              <Divider />
              <ListItem>
                <AlgoliaPlaces disabled={loading} language="en" type="city" placeholder="Next place"  onChange={this.handleNewChange} destroyOnValid />
                <ListItemSecondaryAction>
                  <IconButton>
                    <Add />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              
              <Divider />
              <div className={styles.cityList}>
                {cities.map((city, index) => (
                  <ListItem key={index + city} className={styles.city}>
                    <ListItemText className={styles.name}>{city}</ListItemText>
                    <Input disabled={loading} type="number" style={{ width: '30px', marginRight: '1rem' }} value={cityCounts[index]} data-index={`${index}`} onChange={(e) => this.handleCountChange(index, e.target.value)} />
                    <ListItemSecondaryAction>
                      <IconButton aria-label="How do I get there" disabled={loading} onClick={() => this.handleIgnoreToggle(index)}>
                        { cityIgnored.includes(index) ? <Commute /> : <FlightLand /> }
                      </IconButton>
                      <IconButton aria-label="Remove" disabled={loading} onClick={() => this.handleRemove(index)}>
                        <Close />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </div>
            </List>
            <CardActions>
              <Button size="small" color="primary" disabled={loading || !(cities && cities.length > 0 && startPlace && startDate)} onClick={this.submit}>
                Search for route
              </Button>
            </CardActions>
          </Card>
        }

        <div className={styles.fab}>
          <Button variant="fab" disabled={loading} color="primary" aria-label="Add" onClick={this.toggle}>
            { open ? <Close /> : <LocalAirport /> }
          </Button>
          {loading && <CircularProgress size={68} className={styles.fabProgress} />}
        </div>
      </div>

    )
  }
}

export default RouteForm