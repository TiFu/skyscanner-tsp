import React, { Component } from 'react'
import PropTypes from 'prop-types'
import place from 'places.js'

import styles from './PlacesInput.module.css'

class Places extends Component {
    
  componentDidMount() {
        
    let options = {
      container: this.autoCompletePlace,
      language: this.props.language,
      useDeviceLocation: this.props.useDeviceLocation,
      autocompleteOptions: this.props.autocompleteOptions,
    }
        
    const optionnalPropsKeys = ['type', 'countries', 'aroundLatLng', 'aroundRadius', 'templates', 'appId', 'apiKey', 'apiKey']
        
    for (let optionnalPropKey of optionnalPropsKeys) {
      if (this.props[optionnalPropKey]) { options[optionnalPropKey] = this.props[optionnalPropKey]}
    }
        
    this.autocomplete = place(options)
    if (this.props.value) {
      this.autocomplete.setVal(this.props.value)
    }

    this.autocomplete.on('change', (e) => {
      this.props.onChange(e)
      if (this.props.destroyOnValid) {
        this.autocomplete.setVal(null)
      }
    })
  }

  componentDidUpdate({ value }) {
    if (this.props.value !== value) {
      this.autoCompletePlace.value = this.props.value
      this.autocomplete.setVal(this.props.value)
    }
  }

  componentWillUnmount() {
    try {
      if (this.autocomplete) {
        this.autocomplete.close()
      }
    } catch (err) {}
  }
    
  render() {
    return (
      <input
        className={styles.input}
        placeholder={this.props.placeholder}
        disabled={this.props.disabled}
        ref={(input) => {this.autoCompletePlace = input}}
      />
    )
  }
}

Places.propTypes = {
  apiKey: PropTypes.string,
  appId: PropTypes.string,
  aroundLatLng: PropTypes.string,
  aroundRadius: PropTypes.number,
  countries: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  language: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  templates: PropTypes.object,
  type: PropTypes.oneOf(['city', 'country', 'address', 'busStop', 'trainStation', 'townhall', 'airport']),
  useDeviceLocation: PropTypes.bool,
  destroyOnValid: PropTypes.bool,
}

Places.defaultProps = {
  disabled: false,
  destroyOnValid: false,
  language: navigator.language,
  useDeviceLocation: false,
  onChange: (e) => console.log(e),
    
}

export default Places