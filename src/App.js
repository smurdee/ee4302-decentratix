import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import { MARKET_ABI, MARKET_ADDRESS } from './config'
import Market from './Tickets.js'

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData()
  }
  
  async loadBlockchainData(to) {
    const web3 = new Web3(window.ethereum)
	try {
		const accounts = await web3.eth.getAccounts()
		this.setState({ account: accounts[0] })
		const market = new web3.eth.Contract(MARKET_ABI, MARKET_ADDRESS)
		this.setState({ market })
		const ticketCount = await market.methods.totalTickets().call()
		this.setState({ ticketCount })
		for (var i = 0; i <= ticketCount; i++) {
		  const ticket = await market.methods.ticketInformation(i).call()
		  this.setState({
			tickets: [...this.state.tickets, ticket]
		  })
		}
		const owner = await market.methods.owner().call()
		this.setState({ owner })
		this.setState({ loading: false })
	} catch (error) {
		console.error("Error while connecting to MetaMask:", error);
	}
  }
  
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      ticketCount: 0,
      tickets: [],
	  owner: '',
	  loading: true
    }
	this.createTicket = this.createTicket.bind(this)
	this.buyTicket = this.buyTicket.bind(this)
	this.setSaleTicket = this.setSaleTicket.bind(this)
  }
  
  createTicket(eventDate, eventTime, row, seat, price, section) {
    this.setState({ loading: true })
    this.state.market.methods.createTicket(eventDate, eventTime, row, seat, price, section).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
	  window.location.reload(false);
    })
  }
  
  buyTicket(ticketId) {
	this.setState({ loading: true })
    this.state.market.methods.demoBuyTicketPublic(ticketId).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
	  window.location.reload(false);
    }) 
  }
  
  setSaleTicket(ticketId, price) {
	this.setState({ loading: true })
    this.state.market.methods.resaleTicket(ticketId, price).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
	  window.location.reload(false);
    }) 
  }    
  
  render() {
	return (
	  <div>
		<nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
		  <a className="navbar-brand col-sm-3 col-md-2 mr-0" >EE4032 | DecentraTIX | Wallet: {this.state.account}</a>
		  <ul className="navbar-nav px-3">
			<li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
			  <small><a className="nav-link" href="#"><span id="account"></span></a></small>
			</li>
		  </ul>
		</nav>
		<div className="container-fluid">
		  <div className="row">
			<main role="main" className="col-lg-12 d-flex justify-content-center">			  
			  {this.state.loading 
				? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div> 
				: <Market tickets={this.state.tickets} account={this.state.account} createTicket={this.createTicket} buyTicket={this.buyTicket} setSaleTicket={this.setSaleTicket} owner={this.state.owner} /> }
			</main>
		  </div>
		</div>
	  </div>
	);
  }
}

export default App;