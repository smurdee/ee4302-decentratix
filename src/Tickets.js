import React, { Component } from 'react'

class Market extends Component {
	
  constructor(props) {
	super(props);
	this.state = {
	  eventDate: '',
	  eventTime: '',
	  row: '',
	  seat: '',
	  price: '',
	  section: ''
	};
  }
  
  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }
  
  handleSubmit = (event) => {
    event.preventDefault();
    const { eventDate, eventTime, row, seat, price, section } = this.state;
	//console.log(`createTicket: ${eventDate} ${eventTime} ${row} ${seat} ${price} ${section}`);
    this.props.createTicket(eventDate, eventTime, row, seat, price, section);
  }
  
  handleBuyTicket = (ticket) => {
	  this.props.buyTicket(ticket.ticketId);
  }
  
  handleSetSaleTicket = (ticket) => {
	  this.props.setSaleTicket(ticket.ticketId, ticket.price);
  }
	
  handleButtonClick = (ticket) => {
    console.log(`Button clicked for ticket with content: ${ticket.section}`);
    // Add your custom logic here
  };	

  render() {
	const { tickets, account, createTicket } = this.props;
    return (
	  <div id="content" class="cntainer"> 
		<div class="row">
		  <div id="mytickets" class="col-md-6"> 
		    <h1>My Tickets</h1>
			<ul id="ticketList" className="list-unstyled">
			  { tickets.map((ticket) => {
				return( ticket.owner == account
					?  (!(ticket.isOnSale))
						?  <div className="ticketTemplate" className="checkbox">
							  <label>
							    <span className="marketcontent">
								  {ticket.ticketId}-
								  {ticket.eventDate}-
								  {ticket.eventTime}-
								  {ticket.row}-
								  {ticket.seat}-
								  {ticket.section}
							    </span>
							    <button onClick={() => this.handleSetSaleTicket(ticket)}>Sell This Ticket for {ticket.price}</button>
							  </label>
						    </div>
						:  <div className="ticketTemplate" className="checkbox">
							  <label>
							    <span className="marketcontent">
								  {ticket.ticketId}-
								  {ticket.eventDate}-
								  {ticket.eventTime}-
								  {ticket.row}-
								  {ticket.seat}-
								  {ticket.section}
							    </span>
							    <button disabled>Pending Buyer</button>
							  </label>
						    </div>					
					: <div className="ticketTemplate" className="checkbox">
					  </div>
				)
			  })}
			</ul>
		  </div>

		  <div id="marketcontent" class="col-md-6"> 
			<h1>Marketplace</h1>			
			<ul id="ticketList" className="list-unstyled">
			  { tickets.map((ticket) => {
				return( ticket.owner == account
					?  <div className="ticketTemplate" className="checkbox">
						<label>
						  <span className="marketcontent">
							{ticket.ticketId}-
							{ticket.eventDate}-
							{ticket.eventTime}-
							{ticket.row}-
							{ticket.seat}-
							{ticket.section}
						  </span>
						  <button disabled >You own this ticket</button>
						</label>
					  </div>
					  
					  
					: ( !((ticket.ticketId == "0") && (ticket.eventDate == "0") && (ticket.eventTime == "0") && (ticket.section == "")))
					    ? (ticket.isOnSale)
							? <div className="ticketTemplate" className="checkbox">
								<label>
								  <span className="marketcontent">
									{ticket.ticketId}-
									{ticket.eventDate}-
									{ticket.eventTime}-
									{ticket.row}-
									{ticket.seat}-
									{ticket.section}
								  </span>
								  <button onClick={() => this.handleBuyTicket(ticket)}>Buy This Ticket for {ticket.price}</button>
								</label>
							  </div>  
						    : <div className="ticketTemplate" className="checkbox">
								<label>
								  <span className="marketcontent">
									{ticket.ticketId}-
									{ticket.eventDate}-
									{ticket.eventTime}-
									{ticket.row}-
									{ticket.seat}-
									{ticket.section}
								  </span>
								  <button disabled>Ticket Unavailable</button>
								</label>
							  </div>  
						: <div>
						  </div>
					
				)
			  })}
			</ul>
			<ul id="completedTicketList" className="list-unstyled">
			</ul>
			<form onSubmit={this.handleSubmit}>
				<input
				  id="eventDate"
				  name="eventDate"
				  type="number"
				  value={this.state.eventDate}
				  onChange={this.handleInputChange}
				  placeholder="Event Date"
				  required
				/>
				<input
				  id="eventTime"
				  name="eventTime"
				  type="number"
				  value={this.state.eventTime}
				  onChange={this.handleInputChange}
				  placeholder="Event Time"
				  required
				/>
				<input
				  id="row"
				  name="row"
				  type="number"
				  value={this.state.row}
				  onChange={this.handleInputChange}
				  placeholder="Ticket Row"
				  required
				/>
				<input
				  id="seat"
				  name="seat"
				  type="number"
				  value={this.state.seat}
				  onChange={this.handleInputChange}
				  placeholder="Ticket Seat"
				  required
				/>
				<input
				  id="price"
				  name="price"
				  type="number"
				  value={this.state.price}
				  onChange={this.handleInputChange}
				  placeholder="Ticket Price"
				  required
				/>
				<input
				  id="section"
				  name="section"
				  type="text"
				  value={this.state.section}
				  onChange={this.handleInputChange}
				  placeholder="Event Section"
				  required
				/>
				<input type="submit" hidden={true} />
			  </form>
		  </div>	
		</div>
	  </div>
		
    );
  }
}

export default Market;