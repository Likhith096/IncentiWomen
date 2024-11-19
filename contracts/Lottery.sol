// SPDX-License-Identifier: MIT
pragma solidity >=0.5.1 <0.9.0;

contract IncentiWomen {
    address public organization; // Organization's address
    address payable public lastIncentivizedWoman; // Tracks the last woman who completed a course

    struct Woman {
        uint totalEtherPaid; // Total ether paid by the woman
        uint totalEtherEarned; // Total ether earned as incentives
        bool hasCompletedCourse; // Whether the woman has already completed the course and received an incentive
    }

    mapping(address => Woman) public womenProfiles; // Mapping to store women's profiles
    address[] public women; // List of all women who registered

    constructor() {
        organization = msg.sender; // Organization is the contract deployer
    }

    // Women pay ether to enroll in the organization's courses
    receive() external payable {
        require(msg.value == 1 ether, "Please pay exactly 1 ether to enroll.");
        
        // Add the woman to the profiles if not already registered
        if (womenProfiles[msg.sender].totalEtherPaid == 0) {
            women.push(msg.sender);
        }

        // Update the ether paid by the woman
        womenProfiles[msg.sender].totalEtherPaid += msg.value;

        // The ether remains in the contract's balance
    }

    // Fetch all women details along with their total ether contributions and earnings
    function getProfile() public view returns (address[] memory, uint[] memory, uint[] memory) {
        require(msg.sender == organization, "Only the organization can view profiles.");

        uint womenCount = women.length;
        address[] memory addresses = new address[](womenCount);
        uint[] memory paidAmounts = new uint[](womenCount);
        uint[] memory earnedAmounts = new uint[](womenCount);

        for (uint i = 0; i < womenCount; i++) {
            address woman = women[i];
            addresses[i] = woman;
            paidAmounts[i] = womenProfiles[woman].totalEtherPaid;
            earnedAmounts[i] = womenProfiles[woman].totalEtherEarned;
        }

        return (addresses, paidAmounts, earnedAmounts);
    }

    // Women call this function upon completing a course to earn ether incentives
    function completedCourse() public {
        // Ensure the woman is already enrolled in a course
        require(womenProfiles[msg.sender].totalEtherPaid > 0, "You need to enroll first.");

        // Ensure the woman hasn't already claimed an incentive for this course
        require(!womenProfiles[msg.sender].hasCompletedCourse, "You have already received your incentive.");

        // Send 1 ether incentive to the woman
        require(address(this).balance >= 1 ether, "Contract has insufficient balance for incentives.");
        payable(msg.sender).transfer(1 ether);

        // Update the woman's total earnings
        womenProfiles[msg.sender].totalEtherEarned += 1 ether;

        // Track the last incentivized woman
        lastIncentivizedWoman = payable(msg.sender);

        // Mark this woman as having completed the course and received the incentive
        womenProfiles[msg.sender].hasCompletedCourse = true;
    }

    // Function to reset a woman's course completion status (e.g., after a certain period or new course)
    function resetCourseCompletion(address woman) public {
        require(msg.sender == organization, "Only the organization can reset course completion status.");
        womenProfiles[woman].hasCompletedCourse = false;
    }

    // Function to check the contract's balance (only accessible by the organization)
    function getContractBalance() public view returns (uint) {
        require(msg.sender == organization, "Only the organization can view the contract balance.");
        return address(this).balance;
    }

    // Function to withdraw funds from the contract (only accessible by the organization)
    function withdrawFunds(uint amountInWei) public {
        require(msg.sender == organization, "Only the organization can withdraw funds.");
        uint etherAmount = (amountInWei * 1e18); // Convert Wei directly into ETH for calculation.
        require(etherAmount <= address(this).balance,"Insufficient contract balance.");
        payable(organization).transfer(etherAmount);
    }

    // Function to view all registered women
    function allWomen() public view returns (address[] memory) {
        require(msg.sender == organization, "Only the organization can view profiles.");
        return women;
    }

    function addFunds() public payable {
        require(msg.sender == organization, "Only the organization can add funds.");
        require(msg.value > 0, "Must send a positive amount of ether.");
    }
}
