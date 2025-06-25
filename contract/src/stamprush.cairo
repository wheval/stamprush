/// Stamp Rush - A flexible, fast-paced stamp collection game on Starknet
/// 
/// This contract allows users to collect stamps (tags) within specific time windows.
/// Tags can have limited or unlimited claims and are controlled by time-based availability.
/// Features include:
/// - Time-based claiming windows
/// - Maximum claim limits per tag
/// - User claim tracking
/// - Event emission for transparency
/// - Owner-controlled tag management
#[starknet::contract]
pub mod StampRush {
    use starknet::ContractAddress;
    use starknet::storage::{
        Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess,
        StorageMapReadAccess, StorageMapWriteAccess
    };
    use starknet::{get_caller_address, get_block_timestamp};
    use openzeppelin::access::ownable::OwnableComponent;
    use crate::istamprush::IStampRush;

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    // External
    #[abi(embed_v0)]
    impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;

    // Internal
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    /// Represents a collectible tag/stamp with time-based availability and claim limits
    /// 
    /// # Fields
    /// * `max_claims` - Maximum number of users who can claim this tag (0 = unlimited)
    /// * `start_time` - Unix timestamp when claiming becomes available
    /// * `end_time` - Unix timestamp when claiming period ends
    /// * `metadata_uri` - URI pointing to tag metadata (IPFS hash or on-chain reference)
    /// * `current_claims` - Current number of users who have claimed this tag
    #[derive(Copy, Drop, Serde, starknet::Store)]
    pub struct Tag {
        pub max_claims: u32,
        pub start_time: u64,
        pub end_time: u64,
        pub metadata_uri: felt252,
        pub current_claims: u32,
    }

    /// Contract storage structure
    /// 
    /// # Storage Variables
    /// * `ownable` - OpenZeppelin ownable component for access control
    /// * `tags` - Mapping from tag_id to Tag struct containing tag information
    /// * `user_tag_claimed` - Mapping from (user, tag_id) to bool tracking individual claims
    /// * `user_total_claims` - Mapping from user address to total number of tags claimed
    #[storage]
    pub struct Storage {
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        // tag_id => Tag struct
        tags: Map<felt252, Tag>,
        // (user, tag_id) => bool (claimed)
        user_tag_claimed: Map<(ContractAddress, felt252), bool>,
        // user => total claims count
        user_total_claims: Map<ContractAddress, u32>,
    }

    /// Initializes the contract with an owner
    /// 
    /// # Parameters
    /// * `owner` - The address that will have admin privileges over the contract
    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.ownable.initializer(owner);
    }

    /// Contract events for transparency and indexing
    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        StampClaimed: StampClaimed,
        TagAdded: TagAdded,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
    }

    /// Event emitted when a user successfully claims a stamp
    /// 
    /// # Fields
    /// * `user` - Address of the user who claimed the stamp
    /// * `tag_id` - Unique identifier of the claimed tag
    /// * `timestamp` - Unix timestamp when the claim occurred
    #[derive(Drop, starknet::Event)]
    pub struct StampClaimed {
        pub user: ContractAddress,
        pub tag_id: felt252,
        pub timestamp: u64,
    }

    /// Event emitted when an admin adds a new tag to the game
    /// 
    /// # Fields
    /// * `tag_id` - Unique identifier of the new tag
    /// * `max_claims` - Maximum number of claims allowed for this tag
    /// * `start_time` - Unix timestamp when claiming becomes available
    /// * `end_time` - Unix timestamp when claiming period ends
    #[derive(Drop, starknet::Event)]
    pub struct TagAdded {
        pub tag_id: felt252,
        pub max_claims: u32,
        pub start_time: u64,
        pub end_time: u64,
    }

    #[abi(embed_v0)]
    impl StampRushImpl of IStampRush<ContractState> {
        /// Claims a stamp for the calling user
        /// 
        /// Validates all claim conditions before processing:
        /// - Tag must exist
        /// - User must not have already claimed this tag
        /// - Current time must be within the tag's availability window
        /// - Tag must not have reached its maximum claim limit
        /// 
        /// On successful claim:
        /// - Updates tag's current claim count
        /// - Marks tag as claimed by the user
        /// - Increments user's total claim count
        /// - Emits StampClaimed event
        /// 
        /// # Parameters
        /// * `tag_id` - The unique identifier of the tag to claim
        fn claim_stamp(ref self: ContractState, tag_id: felt252) {
            let caller = get_caller_address();
            let current_time = get_block_timestamp();
            
            // Check if tag exists
            let tag = self.tags.entry(tag_id).read();
            assert(tag.metadata_uri != 0, 'Tag does not exist');
            
            // Check if user already claimed this tag
            let already_claimed = self.user_tag_claimed.entry((caller, tag_id)).read();
            assert(!already_claimed, 'Already claimed this tag');
            
            // Check time window
            assert(current_time >= tag.start_time, 'Tag not yet available');
            assert(current_time <= tag.end_time, 'Tag claim period ended');
            
            // Check claim limit
            if tag.max_claims > 0 {
                assert(tag.current_claims < tag.max_claims, 'Max claims reached');
            }
            
            // Update tag claim count
            let mut updated_tag = tag;
            updated_tag.current_claims = tag.current_claims + 1;
            self.tags.entry(tag_id).write(updated_tag);
            
            // Mark as claimed by user
            self.user_tag_claimed.entry((caller, tag_id)).write(true);
            
            // Update user total claims
            let user_claims = self.user_total_claims.entry(caller).read();
            self.user_total_claims.entry(caller).write(user_claims + 1);
            
            // Emit event
            self.emit(Event::StampClaimed(StampClaimed { 
                user: caller, 
                tag_id, 
                timestamp: current_time 
            }));
        }

        /// Retrieves the metadata URI for a specific tag
        /// 
        /// # Parameters
        /// * `tag_id` - The unique identifier of the tag
        /// 
        /// # Returns
        /// * `felt252` - The metadata URI (returns 0 if tag doesn't exist)
        fn get_tag_metadata(self: @ContractState, tag_id: felt252) -> felt252 {
            let tag = self.tags.entry(tag_id).read();
            tag.metadata_uri
        }

        /// Gets the current number of users who have claimed a specific tag
        /// 
        /// # Parameters
        /// * `tag_id` - The unique identifier of the tag
        /// 
        /// # Returns
        /// * `u32` - Number of successful claims for this tag
        fn get_claim_count(self: @ContractState, tag_id: felt252) -> u32 {
            let tag = self.tags.entry(tag_id).read();
            tag.current_claims
        }

        /// Checks if a specific user has claimed a specific tag
        /// 
        /// # Parameters
        /// * `user` - The address of the user to check
        /// * `tag_id` - The unique identifier of the tag
        /// 
        /// # Returns
        /// * `bool` - True if user has claimed the tag, false otherwise
        fn has_user_claimed(self: @ContractState, user: ContractAddress, tag_id: felt252) -> bool {
            self.user_tag_claimed.entry((user, tag_id)).read()
        }

        /// Gets the total number of stamps collected by a user across all tags
        /// 
        /// # Parameters
        /// * `user` - The address of the user
        /// 
        /// # Returns
        /// * `u32` - Total number of different tags claimed by the user
        fn get_user_total_claims(self: @ContractState, user: ContractAddress) -> u32 {
            self.user_total_claims.entry(user).read()
        }

        /// Adds a new collectible tag to the game (owner only)
        /// 
        /// Validates all input parameters before creating the tag:
        /// - Caller must be the contract owner
        /// - Metadata URI must not be zero
        /// - End time must be after start time
        /// - Tag ID must not already exist
        /// 
        /// On successful creation:
        /// - Stores the new tag with all provided parameters
        /// - Sets initial claim count to 0
        /// - Emits TagAdded event
        /// 
        /// # Parameters
        /// * `tag_id` - Unique identifier for the new tag
        /// * `max_claims` - Maximum allowed claims (0 for unlimited)
        /// * `start_time` - Unix timestamp when claiming becomes available
        /// * `end_time` - Unix timestamp when claiming period ends
        /// * `metadata_uri` - URI pointing to tag metadata
        fn add_tag(ref self: ContractState, tag_id: felt252, max_claims: u32, start_time: u64, end_time: u64, metadata_uri: felt252) {
            self.ownable.assert_only_owner();
            
            // Validate inputs
            assert(metadata_uri != 0, 'Metadata URI cannot be zero');
            assert(end_time > start_time, 'End time less than start time');
            
            // Check if tag already exists
            let existing_tag = self.tags.entry(tag_id).read();
            assert(existing_tag.metadata_uri == 0, 'Tag already exists');
            
            // Create new tag
            let new_tag = Tag {
                max_claims,
                start_time,
                end_time,
                metadata_uri,
                current_claims: 0,
            };
            
            self.tags.entry(tag_id).write(new_tag);
            
            // Emit event
            self.emit(Event::TagAdded(TagAdded { 
                tag_id, 
                max_claims, 
                start_time, 
                end_time 
            }));
        }

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
        fn get_tag_info(self: @ContractState, tag_id: felt252) -> (u32, u64, u64, felt252, u32) {
            let tag = self.tags.entry(tag_id).read();
            (tag.max_claims, tag.start_time, tag.end_time, tag.metadata_uri, tag.current_claims)
        }
    }
} 