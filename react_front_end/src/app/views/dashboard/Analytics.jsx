import { Card, Grid, styled, useTheme, Button } from '@mui/material';
import { Fragment, useEffect } from 'react';
import * as React from 'react';
import { useState } from 'react';
import Web3 from 'web3';
import { contractAddress, ERC721JsonAbi } from 'app/contract/ERC721/ERC721.jsx';
import {ogerponContractAddress, ogerponAbi} from 'app/contract/ogerponContractValue/ogerpon.jsx'
import { ethers } from 'ethers';
import { useEthers } from '@usedapp/core';
import NFTCardList from 'app/components/nft/cardList';
import flex from 'app/css/flex.css';
import axios from 'axios'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


const ContentBox = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
}));

const Title = styled('span')(() => ({
  fontSize: '1rem',
  fontWeight: '500',
  marginRight: '.5rem',
  textTransform: 'capitalize',
}));

const SubTitle = styled('span')(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
}));

const H4 = styled('h4')(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: '500',
  marginBottom: '16px',
  textTransform: 'capitalize',
  color: theme.palette.text.secondary,
}));

const Analytics = () => {
  const { palette } = useTheme();

  // return (
  //   <Fragment>
  //     <ContentBox className="analytics">
  //       <Grid container spacing={3}>
  //         <Grid item lg={8} md={8} sm={12} xs={12}>
  //           <StatCards />
  //           <TopSellingTable />
  //           <StatCards2 />

  //           <H4>Ongoing Projects</H4>
  //           <RowCards />
  //         </Grid>

  //         <Grid item lg={4} md={4} sm={12} xs={12}>
  //           <Card sx={{ px: 3, py: 2, mb: 3 }}>
  //             <Title>Traffic Sources</Title>
  //             <SubTitle>Last 30 days</SubTitle>

  //             <DoughnutChart
  //               height="300px"
  //               color={[palette.primary.dark, palette.primary.main, palette.primary.light]}
  //             />
  //           </Card>

  //           <UpgradeCard />
  //           <Campaigns />
  //         </Grid>
  //       </Grid>
  //     </ContentBox>
  //   </Fragment>
  // );

  const [contractName, setContractName] = useState("Null")

  const web3 = new Web3(window.ethereum)
  const tokenContract = new web3.eth.Contract(ogerponAbi, ogerponContractAddress)
  const { account } = useEthers()

  function getName() {
    tokenContract.methods.name().call().then(response => {
      console.log(response)
      setContractName(response)

    });
  }

  function mint() {
    tokenContract.methods.mintEasy(account).send( { from: account, gasPrice: "250000000000", gas: 210000 } ).then(response => {
      console.log(response)
    }).catch(err => {
      console.log(err)
    })
  }

  function getTokenCount() {
    tokenContract.methods._getTokenCount().call().then(response => {
      console.log(response)
      return response
    })
  }

  function ownerOf() {
    tokenContract.methods.ownerOf(2).call().then(response => {
      console.log(response)
    })
  }

  const [tokenOwnerList, setTokenOwnerList] = useState([])
  const [tokenURIList, setTokenURIList] = useState([])
  const [ownList, setOwnList] = useState([])
  const [next, setNext] = useState(false)
  const [load, setload] = useState(true)
  const [a, b] = useState(true)

  function getToken() {
    tokenContract.methods._getTokenCount().call().then(async response => {
      for(var i = 0; i< response; i++) {
        await tokenContract.methods.ownerOf(i).call().then((response2) => {
          console.log(response2)
          tokenOwnerList.push(response2)
        }).catch(err2 => {
          console.log(err2)
        })
      }
    }).catch(err => {
      console.log(err)
    })

  }

  function getURI() {
    tokenContract.methods._getTokenCount().call().then(async response => {
      for(var i = 0; i< response; i++) {
        await tokenContract.methods._getTokenURI(i).call().then((response2) => {
          console.log(response2)
          tokenURIList.push(response2)
          if(i == Number(response)-1) {
            console.log("change next")
            setNext(!next)
          }
        }).catch(err2 => {
          console.log(err2)
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }

  async function getInfo() {
      console.log("in getInfo")
      for(var i = 0; i < tokenOwnerList.length; i++) {
        console.log("length: "+tokenOwnerList.length)
        if(tokenOwnerList[i] == account) {
          const response = await fetch(tokenURIList[i])
          const data = await response.json()
          const inputData = {"id": i, "pic": data.image, "name": data.name, "description": data.description}
          ownList.push(inputData)
        }
        if( i == tokenOwnerList.length-1){
          console.log('hi')
          b(!a)
          setload(!load)
        }
      }   
  }

  useEffect(() => { 
    getToken()
    getURI()
  },[])

  useEffect(() => {
    console.log("in useEffect")
    getInfo()
  },[next])

  useEffect(() => {
    setload(!load)
  },[a])

  const [contract, setContract] = useState('');

  const handleChange = (event) => {
    setContract(event.target.value);
  };

  return (
    <>
      <div>
        <h2 className='pageTitle'>您好 帳戶: { account }</h2>
      </div>
      <Box className='NFTCard' sx={{ minWidth: 120, maxWidth: 300 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">選擇NFT</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={contract}
            label="合約"
            onChange={handleChange}
          >
            <MenuItem value={10}>太樂巴戈斯</MenuItem>
            <MenuItem value={20}>厄鬼椪</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {/* <Button onClick={() => getInfo()}>getInfo</Button>
      <Button onClick={() => console.log(ownList)}>ownList</Button>
      <Button onClick={() => setload(!load)}>Load</Button> */}
      <hr />
      <div className='flex-container'>
        {
          load 
          ?
          <></>
          :
          <NFTCardList ownList={ownList}></NFTCardList> 
        }
        {/* <NFTCardList tokenOwnerList = {tokenOwnerList} tokenURIList = {tokenURIList}></NFTCardList> */}
      </div>
      
    </>
  )
};

export default Analytics;
