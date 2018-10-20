import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'

import styles from './RouteForm.module.css'

class RouteForm extends Component {

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.fab}>
          <Button variant="fab" color="primary" aria-label="Add">
            <AddIcon />
          </Button>
        </div>
      </div>

    )
  }
}

export default RouteForm