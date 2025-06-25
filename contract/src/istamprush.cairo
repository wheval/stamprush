use starknet::ContractAddress;

/// Interface for the Stamp Rush game contract
/// A flexible, fast-paced stamp collection game on Starknet
#[starknet::interface]
pub trait IStampRush<TContractState> {
    /// Claims a stamp/tag for the caller
    /// 
    /// # Parameters
    /// * `tag_id` - The unique identifier of the tag to claim
    /// 
    /// # Panics
    /// * If tag doesn't exist
    /// * If user already claimed this tag
    /// * If current time is before tag's start time
    /// * If current time is after tag's end time
    /// * If tag has reached maximum claims limit
    fn claim_stamp(ref self: TContractState, tag_id: felt252);

    /// Retrieves the metadata URI for a specific tag
    /// 
    /// # Parameters
    /// * `tag_id` - The unique identifier of the tag
    /// 
    /// # Returns
    /// * `felt252` - The metadata URI of the tag (0 if tag doesn't exist)
    fn get_tag_metadata(self: @TContractState, tag_id: felt252) -> felt252;

    /// Gets the current number of claims for a specific tag
    /// 
    /// # Parameters
    /// * `tag_id` - The unique identifier of the tag
    /// 
    /// # Returns
    /// * `u32` - The number of users who have claimed this tag
    fn get_claim_count(self: @TContractState, tag_id: felt252) -> u32;

    /// Checks if a specific user has claimed a specific tag
    /// 
    /// # Parameters
    /// * `user` - The address of the user to check
    /// * `tag_id` - The unique identifier of the tag
    /// 
    /// # Returns
    /// * `bool` - True if the user has claimed the tag, false otherwise
    fn has_user_claimed(self: @TContractState, user: ContractAddress, tag_id: felt252) -> bool;

    /// Gets the total number of stamps/tags claimed by a user across all tags
    /// 
    /// # Parameters
    /// * `user` - The address of the user
    /// 
    /// # Returns
    /// * `u32` - The total number of tags claimed by the user
    fn get_user_total_claims(self: @TContractState, user: ContractAddress) -> u32;

    /// Adds a new tag to the game (admin only)
    /// 
    /// # Parameters
    /// * `tag_id` - The unique identifier for the new tag
    /// * `max_claims` - Maximum number of claims allowed (0 = unlimited)
    /// * `start_time` - Unix timestamp when claiming becomes available
    /// * `end_time` - Unix timestamp when claiming period ends
    /// * `metadata_uri` - URI pointing to tag metadata (IPFS or on-chain reference)
    /// 
    /// # Panics
    /// * If caller is not the owner
    /// * If metadata_uri is zero
    /// * If end_time is not greater than start_time
    /// * If tag already exists
    fn add_tag(ref self: TContractState, tag_id: felt252, max_claims: u32, start_time: u64, end_time: u64, metadata_uri: felt252);

    /// Retrieves comprehensive information about a tag
    /// 
    /// # Parameters
    /// * `tag_id` - The unique identifier of the tag
    /// 
    /// # Returns
    /// * `(u32, u64, u64, felt252, u32)` - Tuple containing:
    ///   - max_claims: Maximum allowed claims (0 = unlimited)
    ///   - start_time: Unix timestamp when claiming starts
    ///   - end_time: Unix timestamp when claiming ends
    ///   - metadata_uri: URI pointing to tag metadata
    ///   - current_claims: Current number of claims
    fn get_tag_info(self: @TContractState, tag_id: felt252) -> (u32, u64, u64, felt252, u32);
} 