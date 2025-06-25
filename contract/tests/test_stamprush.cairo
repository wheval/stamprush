use contract::stamprush::StampRush;
use contract::istamprush::{IStampRushDispatcher, IStampRushDispatcherTrait};
use snforge_std::{declare, ContractClassTrait, DeclareResultTrait};
use snforge_std::{EventSpyAssertionsTrait, spy_events};
use snforge_std::{start_cheat_caller_address, stop_cheat_caller_address};
use snforge_std::{start_cheat_block_timestamp, stop_cheat_block_timestamp};
use starknet::{ContractAddress, contract_address_const};
use core::traits::Into;
use contract::stamprush::StampRush::{Event, TagAdded, StampClaimed};

// Utility functions
fn ADMIN() -> ContractAddress {
    contract_address_const::<'ADMIN'>()
}

fn USER1() -> ContractAddress {
    contract_address_const::<'USER1'>()
}

fn USER2() -> ContractAddress {
    contract_address_const::<'USER2'>()
}

const TAG1: felt252 = 42;
const TAG2: felt252 = 99;
const URI1: felt252 = 555;
const URI2: felt252 = 777;
const START_TIME: u64 = 1000;
const END_TIME: u64 = 2000;
const CURRENT_TIME: u64 = 1500;

fn deploy_stamp_rush(owner: ContractAddress) -> IStampRushDispatcher {
    let contract = declare("StampRush").unwrap().contract_class();
    let (contract_address, _) = contract.deploy(@array![owner.into()]).unwrap();
    IStampRushDispatcher { contract_address }
}

#[test]
fn test_admin_can_add_tag() {
    let admin: ContractAddress = ADMIN();
    let dispatcher = deploy_stamp_rush(admin);
    
    start_cheat_caller_address(dispatcher.contract_address, admin);
    dispatcher.add_tag(TAG1, 5, START_TIME, END_TIME, URI1);
    
    assert(dispatcher.get_tag_metadata(TAG1) == URI1, 'Metadata URI not set');
    let (max_claims, start_time, end_time, metadata_uri, current_claims) = dispatcher.get_tag_info(TAG1);
    assert(max_claims == 5, 'Max claims not set');
    assert(start_time == START_TIME, 'Start time not set');
    assert(end_time == END_TIME, 'End time not set');
    assert(current_claims == 0, 'Current claims should be 0');
    
    stop_cheat_caller_address(dispatcher.contract_address);
}

#[test]
#[should_panic(expected: ('Caller is not the owner',))]
fn test_non_admin_cannot_add_tag() {
    let admin: ContractAddress = ADMIN();
    let user: ContractAddress = USER1();
    let dispatcher = deploy_stamp_rush(admin);
    start_cheat_caller_address(dispatcher.contract_address, user);
    dispatcher.add_tag(TAG1, 5, START_TIME, END_TIME, URI1);
    stop_cheat_caller_address(dispatcher.contract_address);
}

#[test]
fn test_user_can_claim_tag_once() {
    let admin: ContractAddress = ADMIN();
    let user: ContractAddress = USER1();
    let dispatcher = deploy_stamp_rush(admin);
    
    // Admin adds tag
    start_cheat_caller_address(dispatcher.contract_address, admin);
    dispatcher.add_tag(TAG1, 2, START_TIME, END_TIME, URI1);
    stop_cheat_caller_address(dispatcher.contract_address);
    
    // Set current time within claim window
    start_cheat_block_timestamp(dispatcher.contract_address, CURRENT_TIME);
    
    // User claims tag
    start_cheat_caller_address(dispatcher.contract_address, user);
    dispatcher.claim_stamp(TAG1);
    
    assert(dispatcher.has_user_claimed(user, TAG1), 'User should have claimed');
    assert(dispatcher.get_user_total_claims(user) == 1, 'User total claims should be 1');
    
    stop_cheat_caller_address(dispatcher.contract_address);
    stop_cheat_block_timestamp(dispatcher.contract_address);
}

#[test]
#[should_panic(expected: ('Already claimed this tag',))]
fn test_user_cannot_claim_same_tag_twice() {
    let admin: ContractAddress = ADMIN();
    let user: ContractAddress = USER1();
    let dispatcher = deploy_stamp_rush(admin);
    
    // Admin adds tag
    start_cheat_caller_address(dispatcher.contract_address, admin);
    dispatcher.add_tag(TAG1, 2, START_TIME, END_TIME, URI1);
    stop_cheat_caller_address(dispatcher.contract_address);
    
    // Set current time within claim window
    start_cheat_block_timestamp(dispatcher.contract_address, CURRENT_TIME);
    
    // User claims tag twice
    start_cheat_caller_address(dispatcher.contract_address, user);
    dispatcher.claim_stamp(TAG1);
    dispatcher.claim_stamp(TAG1); // Should panic
    stop_cheat_caller_address(dispatcher.contract_address);
    stop_cheat_block_timestamp(dispatcher.contract_address);
}

#[test]
fn test_tag_respects_max_claims() {
    let admin: ContractAddress = ADMIN();
    let user1: ContractAddress = USER1();
    let dispatcher = deploy_stamp_rush(admin);
    
    // Admin adds tag with max claims of 1
    start_cheat_caller_address(dispatcher.contract_address, admin);
    dispatcher.add_tag(TAG1, 1, START_TIME, END_TIME, URI1);
    stop_cheat_caller_address(dispatcher.contract_address);

    // Set current time within claim window
    start_cheat_block_timestamp(dispatcher.contract_address, CURRENT_TIME);

    // Spy on events
    let mut spy = spy_events();

    // First user claims successfully
    start_cheat_caller_address(dispatcher.contract_address, user1);
    dispatcher.claim_stamp(TAG1);
    stop_cheat_caller_address(dispatcher.contract_address);

    // Check that the first user successfully claimed
    assert(dispatcher.has_user_claimed(user1, TAG1), 'User1 should have claimed');
    assert(dispatcher.get_claim_count(TAG1) == 1, 'Claim count should be 1');

    // Check that only one StampClaimed event was emitted
    let expected_event = Event::StampClaimed(
        StampClaimed { user: user1, tag_id: TAG1, timestamp: CURRENT_TIME }
    );
    let expected_events = array![(dispatcher.contract_address, expected_event)];
    spy.assert_emitted(@expected_events);
    
    stop_cheat_block_timestamp(dispatcher.contract_address);
}

#[test] 
#[should_panic(expected: ('Max claims reached',))]
fn test_tag_max_claims_exceeded_panics() {
    let admin: ContractAddress = ADMIN();
    let user1: ContractAddress = USER1();
    let user2: ContractAddress = USER2();
    let dispatcher = deploy_stamp_rush(admin);
    
    // Admin adds tag with max claims of 1
    start_cheat_caller_address(dispatcher.contract_address, admin);
    dispatcher.add_tag(TAG1, 1, START_TIME, END_TIME, URI1);
    stop_cheat_caller_address(dispatcher.contract_address);

    // Set current time within claim window
    start_cheat_block_timestamp(dispatcher.contract_address, CURRENT_TIME);

    // First user claims successfully
    start_cheat_caller_address(dispatcher.contract_address, user1);
    dispatcher.claim_stamp(TAG1);
    stop_cheat_caller_address(dispatcher.contract_address);

    // Second user tries to claim and should panic
    start_cheat_caller_address(dispatcher.contract_address, user2);
    dispatcher.claim_stamp(TAG1); // Should panic with 'Max claims reached'
    stop_cheat_caller_address(dispatcher.contract_address);
    stop_cheat_block_timestamp(dispatcher.contract_address);
}

#[test]
#[should_panic(expected: ('Tag not yet available',))]
fn test_cannot_claim_before_start_time() {
    let admin: ContractAddress = ADMIN();
    let user: ContractAddress = USER1();
    let dispatcher = deploy_stamp_rush(admin);
    
    // Admin adds tag
    start_cheat_caller_address(dispatcher.contract_address, admin);
    dispatcher.add_tag(TAG1, 5, START_TIME, END_TIME, URI1);
    stop_cheat_caller_address(dispatcher.contract_address);
    
    // Set current time before start time
    start_cheat_block_timestamp(dispatcher.contract_address, START_TIME - 1);
    
    // User tries to claim tag before it's available
    start_cheat_caller_address(dispatcher.contract_address, user);
    dispatcher.claim_stamp(TAG1); // Should panic
    stop_cheat_caller_address(dispatcher.contract_address);
    stop_cheat_block_timestamp(dispatcher.contract_address);
}

#[test]
#[should_panic(expected: ('Tag claim period ended',))]
fn test_cannot_claim_after_end_time() {
    let admin: ContractAddress = ADMIN();
    let user: ContractAddress = USER1();
    let dispatcher = deploy_stamp_rush(admin);
    
    // Admin adds tag
    start_cheat_caller_address(dispatcher.contract_address, admin);
    dispatcher.add_tag(TAG1, 5, START_TIME, END_TIME, URI1);
    stop_cheat_caller_address(dispatcher.contract_address);
    
    // Set current time after end time
    start_cheat_block_timestamp(dispatcher.contract_address, END_TIME + 1);
    
    // User tries to claim tag after it's expired
    start_cheat_caller_address(dispatcher.contract_address, user);
    dispatcher.claim_stamp(TAG1); // Should panic
    stop_cheat_caller_address(dispatcher.contract_address);
    stop_cheat_block_timestamp(dispatcher.contract_address);
}

#[test]
fn test_events_emitted_correctly() {
    let admin: ContractAddress = ADMIN();
    let user: ContractAddress = USER1();
    let dispatcher = deploy_stamp_rush(admin);
    
    let mut spy = spy_events();
    
    // Admin adds tag
    start_cheat_caller_address(dispatcher.contract_address, admin);
    dispatcher.add_tag(TAG2, 3, START_TIME, END_TIME, URI2);
    stop_cheat_caller_address(dispatcher.contract_address);
    
    // Set current time within claim window
    start_cheat_block_timestamp(dispatcher.contract_address, CURRENT_TIME);
    
    // User claims stamp
    start_cheat_caller_address(dispatcher.contract_address, user);
    dispatcher.claim_stamp(TAG2);
    stop_cheat_caller_address(dispatcher.contract_address);
    
    // Check TagAdded event
    let expected_tag_added = Event::TagAdded(TagAdded { 
        tag_id: TAG2, 
        max_claims: 3, 
        start_time: START_TIME, 
        end_time: END_TIME 
    });
    
    // Check StampClaimed event  
    let expected_stamp_claimed = Event::StampClaimed(StampClaimed { 
        user, 
        tag_id: TAG2, 
        timestamp: CURRENT_TIME 
    });
    
    let expected_events = array![
        (dispatcher.contract_address, expected_tag_added),
        (dispatcher.contract_address, expected_stamp_claimed)
    ];
    
    spy.assert_emitted(@expected_events);
    stop_cheat_block_timestamp(dispatcher.contract_address);
}

#[test]
fn test_multiple_users_can_claim_different_tags() {
    let admin: ContractAddress = ADMIN();
    let user1: ContractAddress = USER1();
    let user2: ContractAddress = USER2();
    let dispatcher = deploy_stamp_rush(admin);
    
    // Admin adds multiple tags
    start_cheat_caller_address(dispatcher.contract_address, admin);
    dispatcher.add_tag(TAG1, 5, START_TIME, END_TIME, URI1);
    dispatcher.add_tag(TAG2, 5, START_TIME, END_TIME, URI2);
    stop_cheat_caller_address(dispatcher.contract_address);
    
    // Set current time within claim window
    start_cheat_block_timestamp(dispatcher.contract_address, CURRENT_TIME);
    
    // User1 claims TAG1
    start_cheat_caller_address(dispatcher.contract_address, user1);
    dispatcher.claim_stamp(TAG1);
    stop_cheat_caller_address(dispatcher.contract_address);
    
    // User2 claims TAG2
    start_cheat_caller_address(dispatcher.contract_address, user2);
    dispatcher.claim_stamp(TAG2);
    stop_cheat_caller_address(dispatcher.contract_address);
    
    // Verify claims
    assert(dispatcher.has_user_claimed(user1, TAG1), 'User1 should have TAG1');
    assert(!dispatcher.has_user_claimed(user1, TAG2), 'User1 should not have TAG2');
    assert(!dispatcher.has_user_claimed(user2, TAG1), 'User2 should not have TAG1');
    assert(dispatcher.has_user_claimed(user2, TAG2), 'User2 should have TAG2');
    
    // Verify total claims per user
    assert(dispatcher.get_user_total_claims(user1) == 1, 'User1 total should be 1');
    assert(dispatcher.get_user_total_claims(user2) == 1, 'User2 total should be 1');
    
    stop_cheat_block_timestamp(dispatcher.contract_address);
}

#[test]
fn test_unlimited_claims_tag() {
    let admin: ContractAddress = ADMIN();
    let user1: ContractAddress = USER1();
    let user2: ContractAddress = USER2();
    let dispatcher = deploy_stamp_rush(admin);
    
    // Admin adds tag with unlimited claims (max_claims = 0)
    start_cheat_caller_address(dispatcher.contract_address, admin);
    dispatcher.add_tag(TAG1, 0, START_TIME, END_TIME, URI1);
    stop_cheat_caller_address(dispatcher.contract_address);
    
    // Set current time within claim window
    start_cheat_block_timestamp(dispatcher.contract_address, CURRENT_TIME);
    
    // Multiple users claim the same tag
    start_cheat_caller_address(dispatcher.contract_address, user1);
    dispatcher.claim_stamp(TAG1);
    stop_cheat_caller_address(dispatcher.contract_address);
    
    start_cheat_caller_address(dispatcher.contract_address, user2);
    dispatcher.claim_stamp(TAG1);
    stop_cheat_caller_address(dispatcher.contract_address);
    
    // Both users should have claimed successfully
    assert(dispatcher.has_user_claimed(user1, TAG1), 'User1 should have claimed');
    assert(dispatcher.has_user_claimed(user2, TAG1), 'User2 should have claimed');
    assert(dispatcher.get_claim_count(TAG1) == 2, 'Total claims should be 2');
    
    stop_cheat_block_timestamp(dispatcher.contract_address);
}