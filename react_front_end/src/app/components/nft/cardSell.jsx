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

const NFTCardSell = ( { imgURL, nftName, nftId, description } ) => {

  const web3 = new Web3(window.ethereum)
  const tokenContract = new web3.eth.Contract(ogerponAbi, ogerponContractAddress)
  const { account } = useEthers()

  function transaction(tokenId) {
    tokenContract.methods.NFT_Transaction(tokenId).send( { from: account, gasPrice: "250000000000", gas: 210000, value: 1000000000000000000 } ).then(response => {
      console.log(response)
      alert('購買成功!')
      window.location.reload()
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
            <Button size="small" variant='contained' onClick={() => transaction(nftId)}>購買</Button>
          </CardActions>
        </Card>
      );
};

export default NFTCardSell;