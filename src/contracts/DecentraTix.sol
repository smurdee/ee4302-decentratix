// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract DecentralizedTicketingPlatform {
    
    struct Ticket {
        address artist;
        uint256 eventDate;
        uint256 eventTime;
        uint256 price;
        string section;
        uint256 row;
        uint256 seat;
        bool isAvailable;
    }
    
    // Mapping of ticketId to Ticket object
    mapping(uint256 => Ticket) public tickets;
    
    // Mapping of artist to subscribed addresses
    mapping(address => mapping(address => uint256)) public artistSubscriptions;
    
    // Mapping of address to list of owned tickets
    mapping(address => uint256[]) public ownedTickets;
    
    // Parameters for contract owner
    address public contractOwner;
    uint256 public resaleTaxPercentage = 5;
    bool public isResaleAllowed = true;
    bool public isTransferAllowed = true;
    
    // Total tickets count
    uint256 public totalTickets;
    
    // Events
    event TicketCreated(uint256 ticketId);
    event TicketBought(address buyer, uint256 ticketId);
    event SubscriptionBought(address subscriber, address artist);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == contractOwner, "Only the contract owner can perform this action");
        _;
    }
    
    modifier onlySubscribed(address artist) {
        require(block.timestamp - artistSubscriptions[artist][msg.sender] < 30 days, "You are not subscribed to this artist");
        _;
    }

    constructor() {
        contractOwner = msg.sender;
    }
    
    // Contract Owner functions
    function createTicket(
        address artist,
        uint256 eventDate,
        uint256 eventTime,
        uint256 price,
        string memory section,
        uint256 row,
        uint256 seat
    ) public onlyOwner {
        tickets[totalTickets] = Ticket(artist, eventDate, eventTime, price, section, row, seat, true);
        emit TicketCreated(totalTickets);
        totalTickets++;
    }
    
    function modifyTicketPrice(uint256 ticketId, uint256 newPrice) public onlyOwner {
        tickets[ticketId].price = newPrice;
    }
    
    function modifyResaleTax(uint256 newPercentage) public onlyOwner {
        resaleTaxPercentage = newPercentage;
    }
    
    function modifyResaleAllowed(bool flag) public onlyOwner {
        isResaleAllowed = flag;
    }
    
    function modifyTransferAllowed(bool flag) public onlyOwner {
        isTransferAllowed = flag;
    }
    
    // User functions
    function buyTicket(uint256 ticketId) public payable {
        require(tickets[ticketId].isAvailable, "Ticket not available");
        require(msg.value == tickets[ticketId].price, "Insufficient payment");
        
        if(block.timestamp + 2 days < tickets[ticketId].eventDate) {
            require(block.timestamp - artistSubscriptions[tickets[ticketId].artist][msg.sender] < 30 days, "You are not subscribed to this artist");
        }
        
        tickets[ticketId].isAvailable = false;
        ownedTickets[msg.sender].push(ticketId);
        emit TicketBought(msg.sender, ticketId);
    }
    
    function subscribeToArtist(address artist) public payable {
        require(msg.value > 0, "Subscription fee required");
        
        artistSubscriptions[artist][msg.sender] = block.timestamp;
        emit SubscriptionBought(msg.sender, artist);
    }
    
    function getOwnedTickets() public view returns(uint256[] memory) {
        return ownedTickets[msg.sender];
    }
    
    function resaleTicket(uint256 ticketId, uint256 newPrice) public {
        require(isResaleAllowed, "Resale is not allowed");
        require(ownedTickets[msg.sender].length > 0, "You do not own this ticket");
        
        uint256 tax = (newPrice * resaleTaxPercentage) / 100;
        tickets[ticketId].price = newPrice + tax;
    }
    
    function transferTicket(uint256 ticketId, address newOwner) public {
        require(isTransferAllowed, "Transfer is not allowed");
        require(ownedTickets[msg.sender].length > 0, "You do not own this ticket");
        
        for(uint256 i = 0; i < ownedTickets[msg.sender].length; i++) {
            if(ownedTickets[msg.sender][i] == ticketId) {
                // Remove ticket from original owner
                delete ownedTickets[msg.sender][i];
                
                // Add ticket to new owner
                ownedTickets[newOwner].push(ticketId);
                break;
            }
        }
    }
}
