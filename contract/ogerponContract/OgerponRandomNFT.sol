// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract OgerponRandomNFT is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    uint256 private constant ORACLE_PAYMENT = (1 * LINK_DIVISIBILITY) / 10; // 0.1 * 10**18
    string public randomNumber;
    address private requestAddress;

    //For NFT
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => string) private _tokenHomes;
    mapping(uint256 => bool) private _tokenForSell; 

    string private _name = "Pokemon";
    string private _symbol = "PKM";
    uint256 private tokenCount = 0;
    uint256 private NFT_Price = 1 ether;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    event Received(address indexed sender, uint256 amount);

    event RequestRandomNumberFulfilled(
        bytes32 indexed requestId,
        string indexed rn
    );

    /**
     *  Sepolia
     *@dev LINK address in Sepolia network: 0x779877A7B0D9E8603169DdbD7836e478b4624789
     * @dev Check https://docs.chain.link/docs/link-token-contracts/ for LINK address for the right network
     */
    constructor() ConfirmedOwner(msg.sender) {
        setChainlinkToken(0xd19546Bd95724ae3be2Db9F10B333311F6a93f8A);
        _tokenHomes[1]="http://bafybeidxeq4v6v3jurghf2jtwv6nehjm2u46l2hwofop5awfbwigwlat3u.ipfs.localhost:8080/";
        _tokenHomes[2]="http://bafybeigxk5hpsrrcab3w5i2y3ez6mqmd67qisk7gjezlpplr2jd2sdkd7m.ipfs.localhost:8080/";
        _tokenHomes[3]="http://bafybeiazfrkrjukat74j5cgspdrhie6iyskvodcmenozlyaet6lhspqbri.ipfs.localhost:8080/";
        _tokenHomes[4]="http://bafybeidmyfnwibvpyv7y5kj3wdadc6qla426lq5u5cntsjymsostbemcwe.ipfs.localhost:8080/";
    }

    modifier onlyOwnerNFT(uint256 tokenId) {
        require(msg.sender == ownerOf(tokenId), "Not the owner");
        _;
    }

    receive() external payable {
        emit Received(msg.sender, NFT_Price);
    }

    function mintEasy(address to) public{
        require(to != address(0), "Cannot mint to zero address");
        // require(msg.value == NFT_Price, "Incorrect ether amount");
        // require(_owners[tokenId] == address(0), "Token already minted");

        _balances[to]++;
        _owners[tokenCount] = to;
        _setTokenURI(tokenCount, _tokenHomes[answerStringToUint()]);

        emit Transfer(address(0), to, tokenCount);
        // emit Received(msg.sender, msg.value);
        tokenCount++;
    }

    function requestRandomNumber(
        address _oracle,
        string memory _jobId
    ) public payable {
        require(msg.value == NFT_Price, "Incorrect ether amount");
        requestAddress = msg.sender;
        Chainlink.Request memory req = buildChainlinkRequest(
            stringToBytes32(_jobId),
            address(this),
            this.fulfillRandomNumber.selector
        );
        // req.add(
        //     "get",
        //     "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
        // );
        // req.add("path", "USD");
        // req.addInt("times", 100);
        sendChainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
        emit Received(msg.sender, msg.value);
    }

    function fulfillRandomNumber(
        bytes32 _requestId,
        string memory _rn
    ) public recordChainlinkFulfillment(_requestId) {
        emit RequestRandomNumberFulfilled(_requestId, _rn);
        randomNumber = _rn;
        mintEasy(requestAddress);
    }

    function getChainlinkToken() public view returns (address) {
        return chainlinkTokenAddress();
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }

    function cancelRequest(
        bytes32 _requestId,
        uint256 _payment,
        bytes4 _callbackFunctionId,
        uint256 _expiration
    ) public onlyOwner {
        cancelChainlinkRequest(
            _requestId,
            _payment,
            _callbackFunctionId,
            _expiration
        );
    }

    function stringToBytes32(
        string memory source
    ) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            // solhint-disable-line no-inline-assembly
            result := mload(add(source, 32))
        }
    }

    function answerStringToUint() public view returns (uint256) {
    bytes memory strBytes = bytes(randomNumber);
    bytes memory result = new bytes(strBytes.length-2);
    for(uint i = 1; i <= strBytes.length-2; i++) {
        result[i-1] = strBytes[i];
    }
    return (stringToUint(string(result)) % 4) + 1;    
    }

    function stringToUint(string memory s) public pure returns (uint256) {
        bytes memory b = bytes(s);
        uint result = 0;
        for (uint256 i = 0; i < b.length; i++) {
            uint256 c = uint256(uint8(b[i]));
            if (c >= 48 && c <= 57) {
                result = result * 10 + (c - 48);
            }
        }
        return result;
    }

    function balanceOf(address owner) external view returns (uint256) {
        return _balances[owner];
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "Owner not found");
        return owner;
    }

    function transfer(address to, uint256 tokenId) external onlyOwnerNFT(tokenId) {
        _transfer(msg.sender, to, tokenId);
    }

    function _transfer(address from, address to, uint256 tokenId) internal {
        _owners[tokenId] = to;
        _balances[from]--;
        _balances[to]++;
        emit Transfer(from, to, tokenId);
    }

    function mint(address to, uint256 tokenId, string memory tokenURI) external {
        require(to != address(0), "Cannot mint to zero address");
        // require(_owners[tokenId] == address(0), "Token already minted");

        _balances[to]++;
        _owners[tokenCount] = to;
        _setTokenURI(tokenCount, tokenURI);

        emit Transfer(address(0), to, tokenId);
    }

    function mintForTest() external payable {
        require(msg.sender != address(0), "Cannot mint to zero address");
        require(msg.value == NFT_Price, "Incorrect ether amount");
        // require(_owners[tokenId] == address(0), "Token already minted");

        _balances[msg.sender]++;
        _owners[tokenCount] = msg.sender;
        _setTokenURI(tokenCount, _tokenHomes[1]);

        emit Transfer(address(0), msg.sender, tokenCount);
        emit Received(msg.sender, msg.value);
        tokenCount++;
    }

    function _getTokenURI(uint256 tokenId) external view returns(string memory) {
        return _tokenURIs[tokenId];
    }

    function _setTokenURI(uint256 tokenId, string memory tokenURI) internal {
        _tokenURIs[tokenId] = tokenURI;
    }

    function _getTokenCount() external view returns(uint256) {
        return tokenCount;
    }

    function _getHome(uint256 num) external view returns(string memory) {
        return _tokenHomes[num];
    }

    function getBalance() external view returns(uint256) {
        return address(this).balance;
    }

    function _getPrice() external view returns(uint256) {
        return NFT_Price;
    }

    function _setPrice(uint256 newPrice) public onlyOwner {
        NFT_Price = newPrice;
    }

    function _getForSell(uint256 tokenId) public view returns(bool){
        return _tokenForSell[tokenId];
    }

    function _setForSell(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender);
        _tokenForSell[tokenId] = !(_tokenForSell[tokenId]);
    }

    function NFT_Transaction(uint256 tokenId) public payable{
        require(_getForSell(tokenId) == true);
        require(msg.value == NFT_Price, "Incorrect ether amount");
        address payable toAddress;
        toAddress = payable(ownerOf(tokenId));
        toAddress.transfer(msg.value);
        _transfer(ownerOf(tokenId), msg.sender, tokenId);
        _setForSell(tokenId);
    } 
}
