use starknet::ContractAddress;

#[starknet::interface]
pub trait IStampTag<TContractState> {
    fn mint_stamp(ref self: TContractState, tag_id: felt252);
    fn has_claimed(self: @TContractState, user: ContractAddress, tag_id: felt252) -> bool;
    fn get_claim_count(self: @TContractState, tag_id: felt252) -> u32;
    fn add_tag(ref self: TContractState, tag_id: felt252, max_claims: u32, metadata_uri: felt252);
    fn get_tag_metadata_uri(self: @TContractState, tag_id: felt252) -> felt252;
} 