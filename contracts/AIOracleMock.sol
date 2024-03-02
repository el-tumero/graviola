// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "./IAIOracle.sol";

contract AIOracleMock is IAIOracle {

    uint256 public constant fee = 0;
    
    struct AICallbackRequestData{
        address account;
        uint256 requestId;
        uint256 modelId;
        bytes input;
        address callbackContract;
        bytes4 functionSelector;
        uint64 gasLimit;
    }

    mapping(uint256 => AICallbackRequestData) public requests;

    uint256 public requestCounter;


    function requestCallback(uint256 modelId, bytes calldata input, address callbackContract, bytes4 functionSelector, uint64 gasLimit) external payable{
        require(msg.value >= fee, "insuefficient fee");

        AICallbackRequestData storage request = requests[requestCounter];
        request.account = msg.sender;
        request.requestId = requestCounter;
        request.modelId = modelId;
        request.input = input;
        request.callbackContract = callbackContract;
        request.functionSelector = functionSelector;
        request.gasLimit = gasLimit;
        // Emit event
        emit AICallbackRequest(msg.sender, requestCounter, modelId, input, callbackContract, functionSelector, gasLimit);
        requestCounter++;
    }



    function invokeCallback(uint256 requestId, bytes calldata output) public {
        AICallbackRequestData storage request = requests[requestId];

        bytes memory payload = abi.encodeWithSelector(request.functionSelector, request.modelId, request.input, output);
        (bool success, bytes memory data) = request.callbackContract.call{gas: request.gasLimit}(payload);
        require(success, "failed to call selector!");
        if (!success) {
            assembly {
                revert(add(data, 32), mload(data))
            }
        }
        emit AICallbackResult(requestId, output);
    }
}