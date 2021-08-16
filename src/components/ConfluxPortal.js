import React, { PureComponent } from 'react'
import { Drip } from 'js-conflux-sdk' //util, 

import conflux from '../lib/conflux'
import confluxPortal from '../lib/conflux-portal'

const PORTAL_STATE_DISCONNECTED = 0
const PORTAL_STATE_CONNECTING = 1
const PORTAL_STATE_CONNECTED = 2

export default class ConfluxPortal extends PureComponent {
  state = {
    status: PORTAL_STATE_DISCONNECTED,
    connecting: false,
    account: '',
    balance: '',
  }

  connectConfluxPortal = async () => {
    this.setState({ status: PORTAL_STATE_CONNECTING })
    await confluxPortal.enable()
    const account = confluxPortal.getAccount()
    this.setState({ status: PORTAL_STATE_CONNECTED, account, balance: '' })
    this.refreshBalance()
  }

  refreshBalance = async () => {
    // console.log("balance1: ")
    if (!this.state.account) {
      return
    }
    // console.log("balance2: ")
    this.setState({ balance: '' })
    // console.log("balance3: ")
    const balance = await conflux.getBalance(this.state.account)
    // console.log("balance4: ", balance)
    // console.log(balance); // "4999998839889983249999999950307784"
    // console.log(Drip(balance).toGDrip()); // "4999998839889983249999999.950307784"
    // console.log(Drip(balance).toCFX()); // "4999998839889983.249999999950307784"
    this.setState({ balance: Drip(balance).toCFX() })
  }

  renderPortalButton = () => {
    if (this.state.status === PORTAL_STATE_CONNECTED) {
      return (
        <button className="btn btn-success">
          Connected to Conflux Portal
        </button>
      )
    } else if (this.state.status === PORTAL_STATE_CONNECTING) {
      return (
        <button className="btn btn-primary">
          Connecting...
        </button>
      )
    } else {
      return (
        <button className="btn btn-primary" onClick={this.connectConfluxPortal}>
          Connect to Conflux Portal
        </button>
      )
    }
  }

  renderConnectedAccount = () => {
    if (this.state.status === PORTAL_STATE_CONNECTED) {
      return (
        <div className="mt-3">
          <div>Account: <code>{this.state.account}</code></div>
          <div className="d-flex align-items-center">
            <div className="mr-1">Balance: {this.state.balance ? `${this.state.balance} CFX` : 'Loading...'}</div>
            <span
              className="badge badge-primary"
              style={{ cursor: 'pointer' }}
              onClick={this.refreshBalance}
            >refresh</span>
          </div>
        </div>
      )
    }
    return null
  }

  render() {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Conflux Portal</h5>
          {this.renderPortalButton()}
          {this.renderConnectedAccount()}
        </div>
      </div>
    )
  }
}
