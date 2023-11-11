import React, { Component } from 'react'

class Market extends Component {
	
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
					?  <div className="ticketTemplate" className="checkbox">
						<label>
						  <span className="marketcontent">
							{ticket.ticketId}-
							{ticket.eventDate}-
							{ticket.eventTime}-
							{ticket.row}-
							{ticket.seat}-
							{ticket.section}-
								{ticket.owner}
						  </span>
						  <button onClick={() => this.handleButtonClick(ticket)}>Sell This Ticket for {ticket.price}</button>
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
				return(
				  <div className="ticketTemplate" className="checkbox">
					<label>
					  <span className="marketcontent">
					    {ticket.ticketId}-
						{ticket.eventDate}-
						{ticket.eventTime}-
						{ticket.row}-
						{ticket.seat}-
						{ticket.section}
					  </span>
					  <button onClick={() => this.handleButtonClick(ticket)}>Buy This Ticket for {ticket.price}</button>
					</label>
				  </div>
				)
			  })}
			</ul>
			<ul id="completedTicketList" className="list-unstyled">
			</ul>
			<form onSubmit={(event) => {
			  event.preventDefault()
			  this.props.createTicket(this.ticket.value)
			}}>
			  <input id="newTicket" ref={(input) => this.ticket = input} type="text" className="form-control" style={{ width: '200px'}} placeholder="Add ticket..." required />
			  <input type="submit" hidden={true} />
			</form>
		  </div>	
		</div>
	  </div>
		
    );
  }
}

export default Market;