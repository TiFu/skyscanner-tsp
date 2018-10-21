import React from 'react'
import styles from './Point.module.css'

const Point = ({ onClick }) => <div onClick={onClick} className={styles.point} />
export default Point