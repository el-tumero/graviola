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
        [0xd19d4cbaa3093d3040525942f026b6def1d659da33388c4c27581c0795879a1d],
        [0x7ba7d62a1a764ebc9e181c65e5ff9a3304121d6df3119364bfa1972fcf6d234f],
        [0x3a97b46fdc8771cb971e45b7c82c5219e06f526afc00d574e1116868fabc748d],
        [0x8ba0b8415af5382c4cb756922c703f776d5cd2e2fafdd04abe05fa4217dc0a72],
        [0x7effaa320749505d5ffe4a7785756922b49f38bb697cd171cbd941ce1c2c6134],
        [0x3bebfefff2e5221e1caac8c2631d75b09f9b9559004cbec60dcee2009d71c7a1],
        [0x4fd23e8dc1399565bf20ce034ea5a3e0729229ee5c67af1851c251cbef8ed942],
        [0x7d9b7f2b3d8368d97ef49b4bf7eef98b8457e80a02c5c5f23e1545acd4878937],
        [0xaf54f40a79084e1248cf79a6a663506920f0c0474ac9f75b3e773b17dfa2e231],
        [0x362d45a144a64aa16f01ea0e503b71f400deefc8f9e411158557d223bbd78a66],
        [0x9eca7d119bd3bb83a20dfd06c79f65281812d067df999ea48d97ea1e757a0ad1],
        [0x0b2254141875b7eef3337070efc6e32912574190f3e0741a71d406f6a977ad8f],
        [0x06316004405e50ab69c03cb6305f23318a300e5be0fda168e97bde34ba438a07],
        [0x39a444f5d41ea42b607427df6974598571222946e657c4f13b019d727a352de6],
        [0x71ad0e96c8e99c0d49b2dd6c32c25c31cebf83f19ce1f7028663b45b9a780f1d],
        [0xc523ac1c051f074a3b1dbc57cd82bff85c1a58ac6680f426c9ac20d6ee05cc35],
        [0x3e78b95014ac2e9bb1c206ba5333e4cff8442f782de6de85fec56af01114e762],
        [0x5c832b412a1a7d92727e8a90b9d012fe5b2cc65c8cf084323793c12cc0b8d4cc],
        [0x1883db875f663c2a6c4eb508570f080230b35af3cfdd0b6c6fb03784d711dd2f],
        [0x1cbb71d575e3f4504b52bf1f885aab93549a841aae79b4f8c4302d90d0a22b92]
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
