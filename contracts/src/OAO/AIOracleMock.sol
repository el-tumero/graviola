// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "./IAIOracle.sol";

contract AIOracleMock is IAIOracle {
    uint256 public fee = 0;

    struct AICallbackRequestData {
        address account;
        uint256 requestId;
        uint256 modelId;
        bytes input;
        address callbackContract;
        uint64 gasLimit;
        bytes callbackData;
    }

    mapping(uint256 => AICallbackRequestData) public requests;

    uint256 public requestCounter;

    function callbackFunctionSelector() public pure returns (bytes4) {
        return bytes4(0xb0347814);
    }

    function invokeNextCallback(bytes calldata output) external {
        invokeCallback(requestCounter-1, output);
    }


    function invokeCallback(uint256 requestId, bytes calldata output) public {
        AICallbackRequestData storage request = requests[requestId];
        require(request.account != address(0), "Request does not exist!");

        bytes memory payload = abi.encodeWithSelector(
            callbackFunctionSelector(),
            request.requestId,
            output,
            request.callbackData
        );
        (bool success, bytes memory data) = request.callbackContract.call{gas: request.gasLimit}(payload);
        require(success, "failed to call selector!");
        if (!success) {
            assembly {
                revert(add(data, 32), mload(data))
            }
        }
        emit AICallbackResult(msg.sender, requestId, output);
    }

    function requestCallback(
        uint256 modelId,
        bytes memory input,
        address callbackContract,
        uint64 gasLimit,
        bytes memory callbackData
    ) external payable override returns (uint256) {
        require(msg.value >= fee, "insuefficient fee");

        AICallbackRequestData storage request = requests[requestCounter];
        request.account = msg.sender;
        request.requestId = requestCounter;
        request.modelId = modelId;
        request.input = input;
        request.callbackContract = callbackContract;
        request.gasLimit = gasLimit;
        request.callbackData = callbackData;
        // Emit event
        emit AICallbackRequest(
            msg.sender,
            requestCounter,
            modelId,
            input,
            callbackContract,
            gasLimit,
            callbackData
        );
        return requestCounter++;
    }

    function estimateFee(
        uint256 /*modelId*/,
        uint256 /*gasLimit*/
    ) external view override returns (uint256) {
        return fee;
    }

    function isFinalized(
        uint256 requestId
    ) external view override returns (bool) {}
}
