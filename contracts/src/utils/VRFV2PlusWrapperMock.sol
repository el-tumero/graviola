// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IVRFV2PlusWrapper} from "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFV2PlusWrapper.sol";
import {VRFV2PlusWrapperConsumerBase} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFV2PlusWrapperConsumerBase.sol";

/// @title VRFV2PlusWrapperMock
/// @notice Mock Chainlink V2.5 VRF wrapper
/// @dev The contract was created for testing purposes only!
contract VRFV2PlusWrapperMock is IVRFV2PlusWrapper {
    uint256 private _lastRequestId = 0;
    uint256 private testValue = 123;

    address private linkAddress = address(1);
    address private linkNativeFeedAddress = address(2);

    uint256[][] private randomWords = [
        [0x277C53DE11311A417F71762C9C21790B2DF973C12BA9303436E6801246BFDD4D],
        [0x1BF7689A00773BFF5D1E8CE5577CE9FD826695D5E58F73BE47308351CF73207D],
        [0x342E26AE4C066F833BD904A9E71A9860C1F5D20106C8521E0340835EFE923C9B],
        [0x277C53DE11311A417F71762C9C21790B2DF973C12BA9303436E6801246BFDD4D],
        [0x1BF7689A00773BFF5D1E8CE5577CE9FD826695D5E58F73BE47308351CF73207D],
        [0x342E26AE4C066F833BD904A9E71A9860C1F5D20106C8521E0340835EFE923C9B]
    ];

    struct Request {
        uint32 callbackGasLimit;
        uint16 requestConfirmations;
        uint32 numWords;
        address target;
    }

    mapping(uint256 => Request) private _requests;

    function lastRequestId() external view override returns (uint256) {
        return _lastRequestId;
    }

    function calculateRequestPrice(
        uint32 _callbackGasLimit,
        uint32 _numWords
    ) external view override returns (uint256) {
        return _callbackGasLimit + 1000 * _numWords + testValue;
    }

    function calculateRequestPriceNative(
        uint32 _callbackGasLimit,
        uint32 _numWords
    ) external view override returns (uint256) {
        return _callbackGasLimit + 1000 * _numWords + testValue;
    }

    function estimateRequestPrice(
        uint32 _callbackGasLimit,
        uint32 _numWords,
        uint256 _requestGasPriceWei
    ) external view override returns (uint256) {
        return
            (_callbackGasLimit + 1000 * _numWords) *
            _requestGasPriceWei +
            testValue;
    }

    function estimateRequestPriceNative(
        uint32 _callbackGasLimit,
        uint32 _numWords,
        uint256 _requestGasPriceWei
    ) external view override returns (uint256) {
        return
            (_callbackGasLimit + 1000 * _numWords) *
            _requestGasPriceWei +
            testValue;
    }

    function requestRandomWordsInNative(
        uint32 _callbackGasLimit,
        uint16 _requestConfirmations,
        uint32 _numWords,
        bytes calldata /* extraArgs */
    ) external payable override returns (uint256 requestId) {
        _requests[_lastRequestId] = Request(
            _callbackGasLimit,
            _requestConfirmations,
            _numWords,
            msg.sender
        );
        return _lastRequestId++;
    }

    function fulfillRandomWords(uint256 _requestId) external {
        Request memory request = _requests[_requestId];

        VRFV2PlusWrapperConsumerBase(request.target).rawFulfillRandomWords(
            _requestId,
            randomWords[_lastRequestId]
        );
    }

    function link() external view override returns (address) {
        return linkAddress;
    }

    function linkNativeFeed() external view override returns (address) {
        return linkNativeFeedAddress;
    }
}
