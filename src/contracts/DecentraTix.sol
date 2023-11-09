pragma solidity ^0.5.0;

contract DecentraTix {
	uint public ticketCount = 0;

	struct Ticket {
		uint id;
		string content;
		bool completed;
	}

	mapping(uint => Ticket) public tickets;
	
	event TicketCreated(
		uint id,
		string content,
		bool completed
	);
	
	event TicketCompleted(
		uint id,
		bool completed
	);
  
	constructor() public {
		createTicket("Test Ticket #1");
    }

	function createTicket(string memory _content) public {
		ticketCount ++;
		tickets[ticketCount] = Ticket(ticketCount, _content, false);
		emit TicketCreated(ticketCount, _content, false);
	}
	
	function toggleCompleted(uint _id) public {
		Ticket memory _ticket = tickets[_id];
		_ticket.completed = !_ticket.completed;
		tickets[_id] = _ticket;
		emit TicketCompleted(_id, _ticket.completed);
	}

}