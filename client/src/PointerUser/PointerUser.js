import React, { Component } from 'react'
import { Avatar } from '@material-ui/core'
import { colorFromStr, getInitials } from '../utils'
import styles from './PointerUser.module.css'

const PointerUser = ({ user }) => <Avatar color={colorFromStr(user)} className={styles.pointer}>{getInitials(user)}</Avatar>

export default PointerUser