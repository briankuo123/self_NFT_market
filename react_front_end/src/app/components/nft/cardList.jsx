import { useEthers } from '@usedapp/core';
import NFTCard from './card';

const NFTCardList = ({ ownList }) => {

    const { account } = useEthers()

    return (
        <>
          {
            ownList.map((info, index) => (
                <NFTCard key={account+info.id} imgURL = {info.pic} nftName={info.name} nftId={info.id} description={info.description} />
            ))
          }
        </>
    )
}

export default NFTCardList;