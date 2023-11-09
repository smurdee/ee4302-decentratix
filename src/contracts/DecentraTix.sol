// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./Ownable.sol";

contract DecentralizedTicketingPlatform is Ownable {
    
    struct Ticket {
        address artist;
        uint256 eventDate;
        uint256 eventTime;
        uint256 row;
        uint256 seat;
        uint256 price;
        uint256 ticketId;
        string section;
        bool isPurchased;
    }
    
    // Mapping of ticketId to Ticket object
    mapping(uint256 => Ticket) public tickets;
    
    // Mapping of artist to subscribed addresses
    mapping(address => mapping(address => uint256)) public artistSubscriptions;
    
    // Mapping of address to list of owned tickets
    mapping(uint256 => address) public ticketToOwner;
    
    // Total tickets count
    uint256 public totalTickets;
    uint256 public resaleTaxPercentage = 5;
    bool public isResaleAllowed = true;
    bool public isTransferAllowed = true;
    
    // Events
    event TicketCreated(uint256 ticketId);
    event TicketBought(address buyer, uint256 ticketId);
    event SubscriptionBought(address subscriber, address artist);
    
    modifier onlySubscribed(address artist) {
        require(block.timestamp - artistSubscriptions[artist][msg.sender] < 30 days, "You are not subscribed to this artist");
        _;
    }

    constructor() Ownable(tx.origin) {
    }

    receive() external payable {
    }

    fallback() external payable {
        revert("Uh oh, something went wrong!");
    }
    
    // Contract Owner functions
    function createTicket(
        address _artist,
        uint256 _eventDate,
        uint256 _eventTime,
        uint256 _row,
        uint256 _seat,
        uint256 _price,
        string memory section
    ) public onlyOwner {
        tickets[totalTickets] = Ticket(_artist, _eventDate, _eventTime, _row, _seat, _price, totalTickets, section, false);
        emit TicketCreated(totalTickets);
        totalTickets++;
    }
    
    function modifyTicketPrice(uint256 ticketId, uint256 newPrice) public onlyOwner {
        tickets[ticketId].price = newPrice;
    }
    
    function modifyResaleTax(uint256 newResaleTaxPercentage) public onlyOwner {
        resaleTaxPercentage = newResaleTaxPercentage;
    }
    
    function toggleResaleAllowed() public onlyOwner {
        isResaleAllowed = !isResaleAllowed;
    }
    
    function toggleTransferAllowed() public onlyOwner {
        isTransferAllowed = !isTransferAllowed;
    }
    
    // User functions
    function buyTicket(uint256 ticketId) public payable {
        uint256 ticketPrice = tickets[ticketId].price;
        require(!(tickets[ticketId].isPurchased), "Ticket already purchased");
        require(msg.value >= ticketPrice, "Insufficient payment");
        
        if(block.timestamp + 2 days < tickets[ticketId].eventDate) {
            require(block.timestamp - artistSubscriptions[tickets[ticketId].artist][msg.sender] < 30 days, "You are not subscribed to this artist");
        }
        (bool success,) = address(this).call{value: msg.value}("");
        require(success, "Ticket cannot be purchased");
        tickets[ticketId].isPurchased = true;
        ticketToOwner[ticketId] = msg.sender;
        emit TicketBought(msg.sender, ticketId);
        if (msg.value != ticketPrice) {
            payable(msg.sender).transfer(msg.value - ticketPrice);
        }
    }
    
    function subscribeToArtist(address artist) public payable {
        require(msg.value > 0, "Subscription fee required");
        
        artistSubscriptions[artist][msg.sender] = block.timestamp;
        emit SubscriptionBought(msg.sender, artist);
    }
    
    function resaleTicket(uint256 ticketId, uint256 newPrice) public {
        require(isResaleAllowed, "Resale is not allowed");
        require(ticketToOwner[ticketId] == msg.sender, "You do not own this ticket");
        
        uint256 tax = (newPrice * resaleTaxPercentage) / 100;
        tickets[ticketId].price = newPrice + tax;
    }
    
    function transferTicket(uint256 ticketId, address newOwner) public {
        require(isTransferAllowed, "Transfer is not allowed");
        require(ticketToOwner[ticketId] == msg.sender, "You do not own this ticket");
        
        ticketToOwner[ticketId] = newOwner;
    }

    function getMessageHash(address _owner, uint256 _ticketId, string memory _message) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_owner, _ticketId, _message));
    }

    function getEthSignedMessageHash(bytes32 _messageHash) public pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash));
    }

    function verify(address _signer, uint256 _ticketId, string memory _message, bytes memory signature) public pure returns (bool) {
        bytes32 messageHash = getMessageHash(_signer, _ticketId, _message);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        return recoverSigner(ethSignedMessageHash, signature) == _signer;
    }

    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature) public pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig) public pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "Invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
}
