// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IGraviolaSeasonsArchive} from "./seasons/IGraviolaSeasonsArchive.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IGraviolaCollection} from "./IGraviolaCollection.sol";
import {IAIOracle} from "../OAO/IAIOracle.sol";

contract GraviolaGenerator {
    string internal constant PROMPT_BASE =
        "Generate a minimalistic portrait of a fictional character. Use a solid color background. The main features of this character are: ";

    IERC20 private token;
    IGraviolaSeasonsArchive private archive;
    IGraviolaCollection private collection;
    IAIOracle private aiOracle;

    event RequestVRFSent(uint256 requestId);
    event RequestVRFFulfilled(uint256 requestId);
    event RequestOAOSent(uint256 requestId);
    event RequestOAOFulfilled(uint256 requestId);

    error RequestVRFNotFound();
    error RequestSeedNotFound();

    error SenderNotInitiator();

    enum RequestStatus {
        NON_EXISTENT,
        VRF_WAIT,
        VRF_RESPONSE,
        OAO_WAIT,
        OAO_RESPONSE
    }

    struct Request {
        RequestStatus status;
        uint256 seed;
        address initiator;
    }

    mapping(uint256 => Request) requests;

    constructor(
        address tokenAddress,
        address archiveAddress,
        address collectionAddress,
        address aiOracleAddress
    ) {
        token = IERC20(tokenAddress);
        archive = IGraviolaSeasonsArchive(archiveAddress);
        collection = IGraviolaCollection(collectionAddress);
        aiOracle = IAIOracle(aiOracleAddress);
    }

    function prepare() external payable {
        // (uint256 requestId) = requestRandomnessPayInNative()
        uint256 requestId = 1;
        requests[requestId] = Request({
            status: RequestStatus.VRF_WAIT,
            seed: 0,
            initiator: msg.sender
        });
        emit RequestVRFSent(requestId);
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal {
        Request storage request = requests[_requestId];
        if (request.status != RequestStatus.VRF_WAIT) {
            revert RequestVRFNotFound();
        }
        request.seed = _randomWords[0];
        request.status = RequestStatus.VRF_RESPONSE;
        emit RequestVRFFulfilled(_requestId);
    }

    function generate(uint256 requestId) external {
        Request storage request = requests[requestId];
        if (request.status != RequestStatus.VRF_RESPONSE) {
            revert RequestSeedNotFound();
        }
        if (request.initiator != msg.sender) {
            revert SenderNotInitiator();
        }

        // request.seed

        // OAO request
    }
}
