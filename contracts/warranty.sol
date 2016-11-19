pragma solidity ^0.4.2;

contract Warranty {
    function stringsEqual(string storage _a, string memory _b) internal returns (bool) {
        bytes storage a = bytes(_a);
        bytes memory b = bytes(_b);
        if (a.length != b.length)
            return false;
        // @todo unroll this loop
        for (uint i = 0; i < a.length; i ++)
            if (a[i] != b[i])
                return false;
        return true;
    }  

    // Contract
    uint insurerAddress = 0;
    uint repairCutoff = 70;
    uint nextPolicyID = 0;
    
    struct Policy {
        uint policyID;
        string serialNumber;
        uint inceptDate;
        uint expiryDate;
        uint retailPrice;
        address retailerAddress;
        bool active;
    }
    
    struct Claim {
        address customerAddress;
        string serialNumber;
        uint itemRetailPrice;
        uint claimDate;
        uint costRepairQuoted;
        address repairShopAddress;
        address retailerAddress;
        bool replacementChosen;
        bool approved;
        bool closed;
    }
    
    mapping(address => Policy[]) Policys;
    mapping(uint => Claim) Claims;
    
    function policySale(address customerAddress, string serialNumber, uint inceptDate, uint expiryDate, uint retailPrice, address retailerAddress) {
        var policy = Policy(nextPolicyID, serialNumber, inceptDate, expiryDate, retailPrice, retailerAddress, true);
        
        var addressPolicys = Policys[customerAddress];
        for (uint i; i < addressPolicys.length; i++)
        {
            if (stringsEqual(addressPolicys[i].serialNumber, serialNumber) && addressPolicys[i].active == true)
            {
                throw;
            }
        }
        
        Policys[customerAddress].push(policy);
        nextPolicyID++;
    }
    
    function voidPolicy(address customerAddress, string serialNumber) {
        var addressPolicys = Policys[customerAddress];
        for (uint i; i < addressPolicys.length; i++)
        {
            if (stringsEqual(addressPolicys[i].serialNumber, serialNumber) && addressPolicys[i].active == true)
            {
                addressPolicys[i].active = false;
                return;
            }
        }
        throw;
    }
    
    function getActivePolicyIndex(address customerAddress, string serialNumber) internal returns (uint index) {
        var addressPolicys = Policys[customerAddress];
        for (uint i; i < addressPolicys.length; i++)
        {
            if (stringsEqual(addressPolicys[i].serialNumber, serialNumber) && addressPolicys[i].active == true)
            {
                return i;
            }
        }
        throw;
    }
    
    function getPolicyDetails(address customerAddress, string serialNumber) public constant returns(uint, string, uint, uint, uint, address, bool) {
        var policy = getPolicy(customerAddress, serialNumber);
        return (policy.policyID, policy.serialNumber, policy.inceptDate, policy.expiryDate, policy.retailPrice, policy.retailerAddress, policy.active);
    }
    
    function getPolicy(address customerAddress, string serialNumber) internal returns(Policy){
        uint policyIndex = getActivePolicyIndex(customerAddress, serialNumber);
        Policy[] addressPolicys = Policys[customerAddress];
        return addressPolicys[policyIndex];
    }
    
    function newClaim(address customerAddress, string serialNumber, uint claimDate, address repairShopAddress, address retailerAddress) {
        var policy = getPolicy(customerAddress, serialNumber);
        var claim = Claim(customerAddress, serialNumber, policy.retailPrice, claimDate, 0, repairShopAddress, retailerAddress, false, false, false);
        Claims[policy.policyID] = claim;
    }
    
    function getClaim(uint policyID) internal returns(Claim){
        return Claims[policyID];
    }
    
    function getClaimDetails(uint policyID) public constant returns(address, string, uint, uint, address, address, bool, bool, bool){
        var claim = getClaim(policyID);
        return (claim.customerAddress, claim.serialNumber, claim.claimDate, claim.costRepairQuoted, claim.repairShopAddress, claim.retailerAddress, claim.replacementChosen, claim.approved, claim.closed);
    }
    
    function quoteClaim(uint policyID, uint costOfRepair) {
        var claim = getClaim(policyID);
        claim.costRepairQuoted = costOfRepair;
        if (claim.itemRetailPrice * repairCutoff / 100 > costOfRepair){
            //PAY CLAIM TO REPAIR
        }else{
            //NEW ITEM
        }
    }
    
    function transferPolicy(address from, address to, string serialNumber) {
        var policyIndex = getActivePolicyIndex(from, serialNumber);
        var policy = Policys[from][policyIndex];
        voidPolicy(from, serialNumber);
        policySale(to, serialNumber, policy.inceptDate, policy.expiryDate, policy.retailPrice, policy.retailerAddress);
    }
    
}