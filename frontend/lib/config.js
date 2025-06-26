// Starknet Configuration
export const CONTRACT_CONFIG = {
  // Replace with your actual deployed contract address
  CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x06da58930ab1bfd7f808cd4b19a7f25f85e5af6b806e820ceecdb73162edb383",
  
  // Contract ABI from your deployed contract
  CONTRACT_ABI: [
    {
      "type": "impl",
      "name": "StampRushImpl",
      "interface_name": "contract::istamprush::IStampRush"
    },
    {
      "type": "enum",
      "name": "core::bool",
      "variants": [
        {
          "name": "False",
          "type": "()"
        },
        {
          "name": "True",
          "type": "()"
        }
      ]
    },
    {
      "type": "interface",
      "name": "contract::istamprush::IStampRush",
      "items": [
        {
          "type": "function",
          "name": "claim_stamp",
          "inputs": [
            {
              "name": "tag_id",
              "type": "core::felt252"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "get_tag_metadata",
          "inputs": [
            {
              "name": "tag_id",
              "type": "core::felt252"
            }
          ],
          "outputs": [
            {
              "type": "core::felt252"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_claim_count",
          "inputs": [
            {
              "name": "tag_id",
              "type": "core::felt252"
            }
          ],
          "outputs": [
            {
              "type": "core::integer::u32"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "has_user_claimed",
          "inputs": [
            {
              "name": "user",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "tag_id",
              "type": "core::felt252"
            }
          ],
          "outputs": [
            {
              "type": "core::bool"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_user_total_claims",
          "inputs": [
            {
              "name": "user",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::integer::u32"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "add_tag",
          "inputs": [
            {
              "name": "tag_id",
              "type": "core::felt252"
            },
            {
              "name": "max_claims",
              "type": "core::integer::u32"
            },
            {
              "name": "start_time",
              "type": "core::integer::u64"
            },
            {
              "name": "end_time",
              "type": "core::integer::u64"
            },
            {
              "name": "metadata_uri",
              "type": "core::felt252"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "get_tag_info",
          "inputs": [
            {
              "name": "tag_id",
              "type": "core::felt252"
            }
          ],
          "outputs": [
            {
              "type": "(core::integer::u32, core::integer::u64, core::integer::u64, core::felt252, core::integer::u32)"
            }
          ],
          "state_mutability": "view"
        }
      ]
    },
    {
      "type": "impl",
      "name": "OwnableMixinImpl",
      "interface_name": "openzeppelin_access::ownable::interface::OwnableABI"
    },
    {
      "type": "interface",
      "name": "openzeppelin_access::ownable::interface::OwnableABI",
      "items": [
        {
          "type": "function",
          "name": "owner",
          "inputs": [],
          "outputs": [
            {
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "transfer_ownership",
          "inputs": [
            {
              "name": "new_owner",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "renounce_ownership",
          "inputs": [],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "transferOwnership",
          "inputs": [
            {
              "name": "newOwner",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "renounceOwnership",
          "inputs": [],
          "outputs": [],
          "state_mutability": "external"
        }
      ]
    },
    {
      "type": "constructor",
      "name": "constructor",
      "inputs": [
        {
          "name": "owner",
          "type": "core::starknet::contract_address::ContractAddress"
        }
      ]
    },
    {
      "type": "event",
      "name": "contract::stamprush::StampRush::StampClaimed",
      "kind": "struct",
      "members": [
        {
          "name": "user",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "data"
        },
        {
          "name": "tag_id",
          "type": "core::felt252",
          "kind": "data"
        },
        {
          "name": "timestamp",
          "type": "core::integer::u64",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "contract::stamprush::StampRush::TagAdded",
      "kind": "struct",
      "members": [
        {
          "name": "tag_id",
          "type": "core::felt252",
          "kind": "data"
        },
        {
          "name": "max_claims",
          "type": "core::integer::u32",
          "kind": "data"
        },
        {
          "name": "start_time",
          "type": "core::integer::u64",
          "kind": "data"
        },
        {
          "name": "end_time",
          "type": "core::integer::u64",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
      "kind": "struct",
      "members": [
        {
          "name": "previous_owner",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        },
        {
          "name": "new_owner",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
      "kind": "struct",
      "members": [
        {
          "name": "previous_owner",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        },
        {
          "name": "new_owner",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
      "kind": "enum",
      "variants": [
        {
          "name": "OwnershipTransferred",
          "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
          "kind": "nested"
        },
        {
          "name": "OwnershipTransferStarted",
          "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
          "kind": "nested"
        }
      ]
    },
    {
      "type": "event",
      "name": "contract::stamprush::StampRush::Event",
      "kind": "enum",
      "variants": [
        {
          "name": "StampClaimed",
          "type": "contract::stamprush::StampRush::StampClaimed",
          "kind": "nested"
        },
        {
          "name": "TagAdded",
          "type": "contract::stamprush::StampRush::TagAdded",
          "kind": "nested"
        },
        {
          "name": "OwnableEvent",
          "type": "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
          "kind": "flat"
        }
      ]
    }
  ],
  
  // Network configuration
  NETWORK: process.env.NEXT_PUBLIC_STARKNET_NETWORK || "sepolia",
  RPC_URL: process.env.NEXT_PUBLIC_STARKNET_RPC_URL || "https://starknet-sepolia.public.blastapi.io"
}

// Helper function to convert string to felt
export const stringToFelt = (str) => {
  // Convert string to felt252 format for Starknet
  // Limit string length to avoid exceeding felt252 max value
  const maxLength = 31 // felt252 can safely hold ~31 characters
  const truncatedStr = str.slice(0, maxLength)
  
  // Convert to hex and then to BigInt
  const hex = Buffer.from(truncatedStr, 'utf8').toString('hex')
  return BigInt("0x" + hex)
}

// Helper function to convert felt to string  
export const feltToString = (felt) => {
  // Convert felt252 back to string
  const hex = felt.toString(16)
  return Buffer.from(hex, 'hex').toString()
} 