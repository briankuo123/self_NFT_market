import { Card, Button } from '@mui/material';
import * as React from 'react';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Web3 from 'web3';
import { contractAddress, ERC721JsonAbi } from 'app/contract/ERC721/ERC721.jsx'
import { useEthers } from '@usedapp/core';
import card from 'app/css/card.css'
import text from 'app/css/text.css'
import flex from 'app/css/flex.css'

const TerapagosMint = ({}) => {

    const web3 = new Web3(window.ethereum)
    const tokenContract = new web3.eth.Contract(ERC721JsonAbi, contractAddress)
    const { account } = useEthers()

    function mintEasy(contract) {
        contract.methods.mintEasy(account).send( { from: account, gasPrice: "250000000000", gas: 210000 } ).then(response => {
            console.log(response)
            alert('交易成功,回到首頁查看新的NFT!')
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <div>
                <Card sx={{ maxWidth: 345 }} className='NFTCard'>
                    <CardMedia
                        sx={{ height: 250 }}
                        image="https://media.52poke.com/wiki/e/ed/1024Terapagos-Terastal.png"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" textAlign='center'>
                            太樂巴戈斯 
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            最基本的卡池，人人都能獲得傳說寶可夢「太樂巴戈斯」!
                        </Typography>
                    </CardContent>
                    <CardActions className='contractButton'>
                        {
                            (account)
                            ?
                            <Tooltip title='發起交易'>
                                <Button size="small" variant='contained' onClick={() => mintEasy(tokenContract)}>抽卡</Button>
                            </Tooltip>                          
                            :
                            <Tooltip title='請連接metamask'>
                                <span>
                                    <Button size="small" variant='contained' onClick={() => mintEasy(tokenContract)} disabled>抽卡</Button>
                                </span>
                            </Tooltip>
                        }
                        <p className='price'>$ 0.000008 ETH</p>
                    </CardActions>
                </Card>
            </div>
    )
}

export default TerapagosMint;