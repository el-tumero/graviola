// SPDX-License-Identifier: MIT
// Source: https://gist.github.com/subhodi/b3b86cc13ad2636420963e692a4d896f
pragma solidity ^0.8.24;

abstract contract Sorter {
    
    function sort(uint[] memory data) public pure returns (uint[] memory) {
        quickSort(data, int(0), int(data.length - 1));
        return data;
    }

    function quickSort(uint[] memory arr, int left, int right) public pure  {
        int i = left;
        int j = right;
        if (i == j) return;
        uint pivot = arr[uint(left + (right - left) / 2)];
        while (i <= j) {
            while (arr[uint(i)] < pivot) i++;
            while (pivot < arr[uint(j)]) j--;
            if (i <= j) {
                (arr[uint(i)], arr[uint(j)]) = (arr[uint(j)], arr[uint(i)]);
                i++;
                j--;
            }
        }
        if (left < j)
            quickSort(arr, left, j);
        if (i < right)
            quickSort(arr, i, right);
    }
}