import React, { Component } from 'react'

class Market extends Component {
	
  handleButtonClick = (ticket) => {
    // Your logic when the button is clicked
    console.log(`Button clicked for ticket with content: ${ticket.content}`);
    // Add your custom logic here
  };	

  render() {
    return (
      <div id="content" style={{ textAlign: 'right', paddingLeft: '160px' }}> 
        <form onSubmit={(event) => {
          event.preventDefault()
          this.props.createTicket(this.ticket.value)
        }}>
          <input id="newTicket" ref={(input) => this.ticket = input} type="text" className="form-control" placeholder="Add ticket..." required />
          <input type="submit" hidden={true} />
        </form>
        <ul id="ticketList" className="list-unstyled">
          { this.props.tickets.map((ticket, key) => {
            return(
              <div className="ticketTemplate" className="checkbox" key={key}>
                <label>
                  <span className="content">{ticket.content}</span>
				  <button onClick={() => this.handleButtonClick(ticket)}>Buy This Ticket</button>
                </label>
              </div>
            )
          })}
        </ul>
        <ul id="completedTicketList" className="list-unstyled">
        </ul>
      </div>
    );
  }
}

export default Market;