// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// importing libraries
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// Library

library PriceConverter {
    //functions

    function getPrice(AggregatorV3Interface priceFeed)
        internal
        view
        returns (uint256)
    {
        (, int256 answer, , , ) = priceFeed.latestRoundData();

        return uint256(answer * 10000000000);
    }

    function getConversionRate(uint256 amount, AggregatorV3Interface priceFeed)
        internal
        view
        returns (uint256)
    {
        uint256 price = getPrice(priceFeed);
        uint256 ethAmoutInUSD = (price * amount) / 1000000000000000000;
        return ethAmoutInUSD;
    }
}
