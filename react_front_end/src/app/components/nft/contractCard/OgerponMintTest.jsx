import { Card, Button } from '@mui/material';
import * as React from 'react';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Web3 from 'web3';
import {ogerponContractAddress, ogerponAbi} from 'app/contract/ogerponContractValue/ogerpon.jsx';
import { useEthers } from '@usedapp/core';
import card from 'app/css/card.css'
import text from 'app/css/text.css'
import flex from 'app/css/flex.css'

const OgerponMintTest = ({}) => {
    const web3 = new Web3(window.ethereum)
    const tokenContract = new web3.eth.Contract(ogerponAbi, ogerponContractAddress)
    const { account } = useEthers()

    const oracle = "0xD2468df3f3e492605878625E94567Cb7f0Df4834";
    const jobId = "01fff0f0d5074820b2ab985f9f3f3666";

    function mintEasy(contract) {
        console.log(account)
        contract.methods.mintForTest().send( { from: account, gasPrice: "250000000000", gas: 210000, value: 1000000000000000000 } ).then(response => {
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
                        image="https://static1.srcdn.com/wordpress/wp-content/uploads/2023/09/1-which-ogerpon-form-is-best-in-pok-mon-scarlet-violet-s-teal-mask-dlc.jpg?q=50&fit=contain&w=1140&h=&dpr=1.5"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" textAlign='center'>
                            厄鬼椪(測試用) 
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            隨機獲得一種型態，人人都能獲得傳說寶可夢「厄鬼椪」!
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
                        <p className='price'>$ 1 DOCKER</p>
                    </CardActions>
                </Card>
            </div>
    )
}

export default OgerponMintTest;