
#[starknet::contract]
pub mod StampTag {
    use starknet::ContractAddress;
    use starknet::storage::{
        Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess,
        Vec, VecTrait,
    };
    use starknet::get_caller_address;
    use openzeppelin::access::ownable::OwnableComponent;
    use crate::istamptag::IStampTag;

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

     // External
     #[abi(embed_v0)]
     impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;
 
     // Internal
     impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[storage]
    pub struct Storage {
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        // tag_id => max_claims (0 = unlimited)
        tag_max_claims: Map<felt252, u32>,
        // tag_id => claim count
        tag_claim_count: Map<felt252, u32>,
        // (user, tag_id) => bool (claimed)
        user_tag_claimed: Map<(ContractAddress, felt252), bool>,
        // tag_id => metadata_uri
        tag_metadata_uri: Map<felt252, felt252>,
    }

    
    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.ownable.initializer(owner);
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        StampClaimed: StampClaimed,
        TagAdded: TagAdded,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
    }

    #[derive(Drop, starknet::Event)]
    pub struct StampClaimed {
        pub user: ContractAddress,
        pub tag_id: felt252,
    }
    #[derive(Drop, starknet::Event)]
    pub struct TagAdded {
        pub tag_id: felt252,
    }

    #[abi(embed_v0)]
    impl StampTagImpl of IStampTag<ContractState> {
        fn mint_stamp(ref self: ContractState, tag_id: felt252) {
            let caller = get_caller_address();
            // Check if tag exists
            let max_claims = self.tag_max_claims.entry(tag_id).read();
            assert(max_claims != 0, 'Tag not registered');
            // Check if user already claimed
            let claimed = self.user_tag_claimed.entry((caller, tag_id)).read();
            assert(!claimed, 'Already claimed');
            // Check claim limit
            let count = self.tag_claim_count.entry(tag_id).read();
            if max_claims > 0 {
                assert(count < max_claims, 'Max claims reached');
            }
            // Mark as claimed
            self.user_tag_claimed.entry((caller, tag_id)).write(true);
            self.tag_claim_count.entry(tag_id).write(count + 1);
            self.emit(Event::StampClaimed(StampClaimed { user: caller, tag_id }));
        }

        fn has_claimed(self: @ContractState, user: ContractAddress, tag_id: felt252) -> bool {
            self.user_tag_claimed.entry((user, tag_id)).read()
        }

        fn get_claim_count(self: @ContractState, tag_id: felt252) -> u32 {
            self.tag_claim_count.entry(tag_id).read()
        }

        fn add_tag(ref self: ContractState, tag_id: felt252, max_claims: u32, metadata_uri: felt252) {
            self.ownable.assert_only_owner();
            // Only allow adding a tag once
            let exists = self.tag_max_claims.entry(tag_id).read();
            assert(exists == 0, 'Tag already exists');
            self.tag_max_claims.entry(tag_id).write(max_claims);
            self.tag_metadata_uri.entry(tag_id).write(metadata_uri);
            self.emit(Event::TagAdded(TagAdded { tag_id }));
        }

        fn get_tag_metadata_uri(self: @ContractState, tag_id: felt252) -> felt252 {
            self.tag_metadata_uri.entry(tag_id).read()
        }
    }
} 