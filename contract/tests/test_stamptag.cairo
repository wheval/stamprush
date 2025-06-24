use contract::stamptag::StampTag;
use contract::istamptag::{IStampTagDispatcher, IStampTagDispatcherTrait};
use snforge_std::{declare, ContractClassTrait, DeclareResultTrait};
use snforge_std::{EventSpyAssertionsTrait, spy_events};
use snforge_std::{start_cheat_caller_address, stop_cheat_caller_address};
use starknet::{ContractAddress, contract_address_const};
use core::traits::Into;
use contract::stamptag::StampTag::{Event, TagAdded, StampClaimed};

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

fn deploy_stamp_tag(owner: ContractAddress) -> IStampTagDispatcher {
    let contract = declare("StampTag").unwrap().contract_class();
    let (contract_address, _) = contract.deploy(@array![owner.into()]).unwrap();
    IStampTagDispatcher { contract_address }
}

#[test]
fn test_admin_can_add_tag() {
    let admin: ContractAddress = ADMIN();
    let dispatcher = deploy_stamp_tag(admin);
    
    start_cheat_caller_address(dispatcher.contract_address, admin);
    dispatcher.add_tag(TAG1, 5, URI1);
    
    assert(dispatcher.get_tag_metadata_uri(TAG1) == URI1, 'Metadata URI not set');
    
    stop_cheat_caller_address(dispatcher.contract_address);
}

#[test]
#[should_panic(expected: ('Caller is not the owner',))]
fn test_non_admin_cannot_add_tag() {
    let admin: ContractAddress = ADMIN();
    let user: ContractAddress = USER1();
    let dispatcher = deploy_stamp_tag(admin);
    start_cheat_caller_address(dispatcher.contract_address, user);
    dispatcher.add_tag(TAG1, 5, URI1);
    stop_cheat_caller_address(dispatcher.contract_address);
}

#[test]
fn test_user_can_claim_tag_once() {
    let admin: ContractAddress = ADMIN();
    let user: ContractAddress = USER1();
    let dispatcher = deploy_stamp_tag(admin);
    
    // Admin adds tag
    start_cheat_caller_address(dispatcher.contract_address, admin);
    dispatcher.add_tag(TAG1, 2, URI1);
    stop_cheat_caller_address(dispatcher.contract_address);
    
    // User claims tag
    start_cheat_caller_address(dispatcher.contract_address, user);
    dispatcher.mint_stamp(TAG1);
    
    assert(dispatcher.has_claimed(user, TAG1), 'User should have claimed');
    
    stop_cheat_caller_address(dispatcher.contract_address);
}

#[test]
#[should_panic(expected: ('Already claimed',))]
fn test_user_cannot_claim_same_tag_twice() {
    let admin: ContractAddress = ADMIN();
    let user: ContractAddress = USER1();
    let dispatcher = deploy_stamp_tag(admin);
    
    // Admin adds tag
    start_cheat_caller_address(dispatcher.contract_address, admin);
    dispatcher.add_tag(TAG1, 2, URI1);
    stop_cheat_caller_address(dispatcher.contract_address);
    
    // User claims tag twice
    start_cheat_caller_address(dispatcher.contract_address, user);
    dispatcher.mint_stamp(TAG1);
    dispatcher.mint_stamp(TAG1); // Should panic
    stop_cheat_caller_address(dispatcher.contract_address);
}

#[test]
fn test_tag_respects_max_claims() {
    let admin: ContractAddress = ADMIN();
    let user1: ContractAddress = USER1();
    let dispatcher = deploy_stamp_tag(admin);
    
    // Admin adds tag with max claims of 1
    start_cheat_caller_address(dispatcher.contract_address, admin);
    dispatcher.add_tag(TAG1, 1, URI1);
    stop_cheat_caller_address(dispatcher.contract_address);

    // Spy on events
    let mut spy = spy_events();

    // First user claims successfully
    start_cheat_caller_address(dispatcher.contract_address, user1);
    dispatcher.mint_stamp(TAG1);
    stop_cheat_caller_address(dispatcher.contract_address);

    // Check that the first user successfully claimed
    assert(dispatcher.has_claimed(user1, TAG1), 'User1 should have claimed');
    assert(dispatcher.get_claim_count(TAG1) == 1, 'Claim count should be 1');

    // Check that only one StampClaimed event was emitted
    let expected_event = Event::StampClaimed(
        StampClaimed { user: user1, tag_id: TAG1 }
    );
    let expected_events = array![(dispatcher.contract_address, expected_event)];
    spy.assert_emitted(@expected_events);
}

#[test] 
#[should_panic(expected: ('Max claims reached',))]
fn test_tag_max_claims_exceeded_panics() {
    let admin: ContractAddress = ADMIN();
    let user1: ContractAddress = USER1();
    let user2: ContractAddress = USER2();
    let dispatcher = deploy_stamp_tag(admin);
    
    // Admin adds tag with max claims of 1
    start_cheat_caller_address(dispatcher.contract_address, admin);
    dispatcher.add_tag(TAG1, 1, URI1);
    stop_cheat_caller_address(dispatcher.contract_address);

    // First user claims successfully
    start_cheat_caller_address(dispatcher.contract_address, user1);
    dispatcher.mint_stamp(TAG1);
    stop_cheat_caller_address(dispatcher.contract_address);

    // Second user tries to claim and should panic
    start_cheat_caller_address(dispatcher.contract_address, user2);
    dispatcher.mint_stamp(TAG1); // Should panic with 'Max claims reached'
    stop_cheat_caller_address(dispatcher.contract_address);
}

#[test]
fn test_events_emitted_correctly() {
    let admin: ContractAddress = ADMIN();
    let user: ContractAddress = USER1();
    let dispatcher = deploy_stamp_tag(admin);
    
    let mut spy = spy_events();
    
    // Admin adds tag
    start_cheat_caller_address(dispatcher.contract_address, admin);
    dispatcher.add_tag(TAG2, 3, URI2);
    stop_cheat_caller_address(dispatcher.contract_address);
    
    // User claims stamp
    start_cheat_caller_address(dispatcher.contract_address, user);
    dispatcher.mint_stamp(TAG2);
    stop_cheat_caller_address(dispatcher.contract_address);
    
    // Check TagAdded event
    let expected_tag_added = Event::TagAdded(TagAdded { tag_id: TAG2 });
    
    // Check StampClaimed event  
    let expected_stamp_claimed = Event::StampClaimed(StampClaimed { user, tag_id: TAG2 });
    
    let expected_events = array![
        (dispatcher.contract_address, expected_tag_added),
        (dispatcher.contract_address, expected_stamp_claimed)
    ];
    
    spy.assert_emitted(@expected_events);
}

#[test]
fn test_multiple_users_can_claim_different_tags() {
    let admin: ContractAddress = ADMIN();
    let user1: ContractAddress = USER1();
    let user2: ContractAddress = USER2();
    let dispatcher = deploy_stamp_tag(admin);
    
    // Admin adds multiple tags
    start_cheat_caller_address(dispatcher.contract_address, admin);
    dispatcher.add_tag(TAG1, 5, URI1);
    dispatcher.add_tag(TAG2, 5, URI2);
    stop_cheat_caller_address(dispatcher.contract_address);
    
    // User1 claims TAG1
    start_cheat_caller_address(dispatcher.contract_address, user1);
    dispatcher.mint_stamp(TAG1);
    stop_cheat_caller_address(dispatcher.contract_address);
    
    // User2 claims TAG2
    start_cheat_caller_address(dispatcher.contract_address, user2);
    dispatcher.mint_stamp(TAG2);
    stop_cheat_caller_address(dispatcher.contract_address);
    
    // Verify claims
    assert(dispatcher.has_claimed(user1, TAG1), 'User1 should have TAG1');
    assert(!dispatcher.has_claimed(user1, TAG2), 'User1 should not have TAG2');
    assert(!dispatcher.has_claimed(user2, TAG1), 'User2 should not have TAG1');
    assert(dispatcher.has_claimed(user2, TAG2), 'User2 should have TAG2');
}