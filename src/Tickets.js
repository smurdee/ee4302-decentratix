import React, { Component } from 'react'

class Market extends Component {

  render() {
    return (
      <div id="content">
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