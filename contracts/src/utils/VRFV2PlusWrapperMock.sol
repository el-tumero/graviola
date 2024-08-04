// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IVRFV2PlusWrapper} from "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFV2PlusWrapper.sol";

contract VRFV2PlusWrapperMock is IVRFV2PlusWrapper {
    uint256 private _lastRequestId = 0;
    uint256 private testValue = 123;

    address private linkAddress = address(1);
    address private linkNativeFeedAddress = address(2);

    event Request(
        uint32 callbackGasLimit,
        uint16 requestConfirmations,
        uint32 numWords,
        bytes extraArgs
    );

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
        bytes calldata extraArgs
    ) external payable override returns (uint256 requestId) {
        emit Request(
            _callbackGasLimit,
            _requestConfirmations,
            _numWords,
            extraArgs
        );
        return _lastRequestId++;
    }

    function link() external view override returns (address) {}

    function linkNativeFeed() external view override returns (address) {}
}
