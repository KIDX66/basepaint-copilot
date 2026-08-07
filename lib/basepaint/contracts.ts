import { getContract, type Address } from "viem";
import { CONTRACTS } from "./constants";

/**
 * IMPORTANT — read before wiring any write transaction:
 *
 * ai.txt gives us verified contract ADDRESSES but does not publish ABIs.
 * The ABI fragments below are draft/best-guess shapes based on the
 * documented behavior (brush pixel budgets, stroke submission, referral
 * routing) and MUST be replaced with the real ABI pulled from
 * https://github.com/BasePaint/basepaint-contracts before this touches
 * mainnet funds. Treat every function name/signature here as a TODO.
 */

export const basePaintAbiDraft = [
  {
    type: "function",
    name: "paint",
    stateMutability: "payable",
    inputs: [
      { name: "day", type: "uint256" },
      { name: "tokenId", type: "uint256" }, // brush token id
      { name: "pixels", type: "bytes" }, // packed 3-byte-per-pixel stroke data
    ],
    outputs: [],
  },
] as const;

export const basePaintBrushAbiDraft = [
  {
    type: "function",
    name: "strength",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }], // pixels-per-day budget
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export const basePaintRewardsAbiDraft = [
  {
    type: "function",
    name: "mintLatest",
    stateMutability: "payable",
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "referrer", type: "address" },
    ],
    outputs: [],
  },
] as const;

export function getBasePaintContract(client: any) {
  return getContract({
    address: CONTRACTS.BasePaint as Address,
    abi: basePaintAbiDraft,
    client,
  });
}

export function getBrushContract(client: any) {
  return getContract({
    address: CONTRACTS.BasePaintBrush as Address,
    abi: basePaintBrushAbiDraft,
    client,
  });
}

export function getRewardsContract(client: any) {
  return getContract({
    address: CONTRACTS.BasePaintRewards as Address,
    abi: basePaintRewardsAbiDraft,
    client,
  });
}
