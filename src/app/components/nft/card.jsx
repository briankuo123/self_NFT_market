import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import card from 'app/css/card.css';
import Web3 from 'web3';
import {ogerponContractAddress, ogerponAbi} from 'app/contract/ogerponContractValue/ogerpon.jsx';
import { useEthers } from '@usedapp/core';
import { useState } from 'react';

const NFTCard = ( { imgURL, nftName, nftId, description, forSell } ) => {

  const web3 = new Web3(window.ethereum)
  const tokenContract = new web3.eth.Contract(ogerponAbi, ogerponContractAddress)
  const { account } = useEthers()
  
  const [forSellStatus, setForSellStatus] = useState(false)
  
  tokenContract.methods._getForSell(nftId).call().then((response) => {
    setForSellStatus(response)
  })

  function setForSell(tokenId) {
    tokenContract.methods._setForSell(tokenId).send( { from: account, gasPrice: "250000000000", gas: 210000 } ).then(response => {
      console.log(response)
      alert('成功!')
      setForSellStatus(!forSellStatus)
      }).catch(err => {
      console.log(err)
      })
  }

    return (
        <Card sx={{ maxWidth: 345 }} className='NFTCard'>
          <CardMedia
            sx={{ height: 200 }}
            image={imgURL}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div" textAlign='center'>
              {nftName}: #{nftId}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </CardContent>
          <CardActions className='contractButton'>
            {
              (forSellStatus) 
              ?
              <Button size="small" variant='contained' onClick={() => setForSell(nftId)}>收回交易</Button>
              :
              <Button size="small" variant='contained' onClick={() => setForSell(nftId)}>放到交易</Button>
            }
          </CardActions>
        </Card>
      );
};

export default NFTCard;