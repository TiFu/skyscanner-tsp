import React, { Component } from 'react'
import t from 'prop-types'

import Card from '@material-ui/core/Card'
import LocalAirport from '@material-ui/icons/LocalAirport'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Badge from '@material-ui/core/Badge'
import Divider from '@material-ui/core/Divider'
import CircularProgress from '@material-ui/core/CircularProgress'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Input from '@material-ui/core/Input'
import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import Group from '@material-ui/icons/Group'
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
import { colorFromStr } from '../utils';

class RouteForm extends Component {
  static propTypes = {
    loading: t.bool,
  }

  render() {
    const {
      owner,
      loading,
      startPlace,
      startDate,
      open,
      cities,
      cityCounts,
      cityIgnored,
      userCount,
    } = this.props
    return (
      <div className={styles.container}>
        <div className={styles.fab}>
          <Button variant="fab" disabled={loading} color="primary" style={{ background: colorFromStr(owner) }} aria-label="Add" onClick={this.props.toggle}>
            { open ? <Close /> : <LocalAirport /> }
          </Button>
          <Badge color="primary" badgeContent={userCount || 1} classes={{ badge: styles.badge }}>
            <Button variant="fab" color="primary" style={{ background: "#4CAF50", marginLeft: "1rem" }} aria-label="Active users">
              <Group />
            </Button>
          </Badge>
          {loading && <CircularProgress size={68} className={styles.fabProgress} />}
        </div>

        { open &&
          <Card className={styles.overlay}>
            <List>
              <ListItem>
                <AlgoliaPlaces
                  disabled={loading}
                  value={startPlace}
                  language="en"
                  type="city"
                  placeholder="Start city"
                  onChange={this.props.handleStartChange}
                />
                <ListItemSecondaryAction>
                  <IconButton>
                    <FlightTakeoff />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <DayPickerInput disabled={loading} format="YYYY-MM-DD" onDayChange={this.props.handleDayChange} placeholder="Earliest departure" inputProps={{ className: styles.calendarInput }} />
                <ListItemSecondaryAction>
                  <IconButton>
                    <CalendarToday />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>

              <Divider />
              <ListItem>
                <AlgoliaPlaces disabled={loading} language="en" type="city" placeholder="Next place"  onChange={this.props.handleNewChange} destroyOnValid />
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
                    <Input disabled={loading} type="number" style={{ width: '30px', marginRight: '1rem' }} value={cityCounts[index]} data-index={`${index}`} onChange={(e) => this.props.handleCountChange(index, e.target.value)} />
                    <ListItemSecondaryAction>
                      <IconButton aria-label="How do I get there" disabled={loading} onClick={() => this.props.handleIgnoreToggle(index)}>
                        { cityIgnored.includes(index) ? <Commute /> : <FlightLand /> }
                      </IconButton>
                      <IconButton aria-label="Remove" disabled={loading} onClick={() => this.props.handleRemove(index)}>
                        <Close />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </div>
            </List>
            <CardActions>
              <Button size="small" color="primary" disabled={loading || !(cities && cities.length > 0 && startPlace && startDate)} onClick={this.props.submit}>
                Search for route
              </Button>
            </CardActions>
          </Card>
        }
      </div>

    )
  }
}

export default RouteForm
