import React from 'react'
import { Avatar } from '@material-ui/core'
import { colorFromStr, getInitials } from '../utils'
import styles from './PointerUser.module.css'

const PointerUser = ({ user }) => <Avatar style={{ background: colorFromStr(user) }} className={styles.pointer}>{getInitials(user)}</Avatar>

export default PointerUser