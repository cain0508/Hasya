
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Hasya {
    address public owner;

    uint256 public constant MIN_SCORE     = 50;   // minimum score to earn
    uint256 public constant MAX_REWARD    = 0.001 ether;
    uint256 public constant COOLDOWN      = 1 hours;

    struct Entry {
        uint256 score;
        uint256 reward;
        uint256 timestamp;
    }

    mapping(address => Entry[])  public history;
    mapping(address => uint256)  public lastClaim;
    mapping(address => uint256)  public totalEarned;

    address[] public players;
    mapping(address => bool) private _isPlayer;

    event Rewarded(address indexed user, uint256 score, uint256 reward);

    constructor() payable {
        owner = msg.sender;
    }

    function submitScore(address user, uint256 score) external payable {
        require(msg.sender == owner, "Only backend can submit");
        require(score >= MIN_SCORE, "Score too low");
        require(block.timestamp >= lastClaim[user] + COOLDOWN, "Cooldown active");

        // reward scales linearly: score 50 → 50% of MAX, score 100 → 100%
        uint256 reward = (MAX_REWARD * score) / 100;
        require(address(this).balance >= reward, "Contract underfunded");

        lastClaim[user]    = block.timestamp;
        totalEarned[user] += reward;
        history[user].push(Entry(score, reward, block.timestamp));

        if (!_isPlayer[user]) {
            _isPlayer[user] = true;
            players.push(user);
        }

        (bool sent, ) = user.call{value: reward}("");
        require(sent, "ETH transfer failed");

        emit Rewarded(user, score, reward);
    }

    function getHistory(address user) external view returns (Entry[] memory) {
        return history[user];
    }

    // top-10 leaderboard sorted off-chain (gas-free read)
    function getLeaderboard() external view returns (address[] memory, uint256[] memory) {
        uint256 len = players.length;
        address[] memory addrs   = new address[](len);
        uint256[] memory amounts = new uint256[](len);
        for (uint256 i = 0; i < len; i++) {
            addrs[i]   = players[i];
            amounts[i] = totalEarned[players[i]];
        }
        return (addrs, amounts);
    }

    function fund() external payable {}

    function withdraw() external {
        require(msg.sender == owner, "Not owner");
        (bool sent, ) = owner.call{value: address(this).balance}("");
        require(sent, "Withdraw failed");
    }

    receive() external payable {}
}
