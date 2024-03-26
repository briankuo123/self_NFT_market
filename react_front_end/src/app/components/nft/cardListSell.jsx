import { useEthers } from '@usedapp/core';
import NFTCardSell from './cardSell';

const NFTCardListSell = ({ ownList }) => {

    const { account } = useEthers()

    return (
        <>
          {
            ownList.map((info, index) => (
                <NFTCardSell key={account+info.id} imgURL = {info.pic} nftName={info.name} nftId={info.id} description={info.description} />
            ))
          }
        </>
    )
}

export default NFTCardListSell;