import { useState, useEffect } from 'react';
import { Card, Button } from '@mui/material';
import * as React from 'react';
import TerapagosMint from 'app/components/nft/contractCard/TerapagosMint'
import OgerponMint from 'app/components/nft/contractCard/OgerponMint'
import OgerponMintTest from 'app/components/nft/contractCard/OgerponMintTest'
import card from 'app/css/card.css'
import flex from 'app/css/flex.css'
import { useEthers } from '@usedapp/core';

const Mint = () => {

    const { account } = useEthers();

    return (
        <>
            {console.log(window.ethereum.networkVersion)}
            <h1 className='pageTitle'>智慧合約抽卡</h1>
            <h2 className='pageTitle'>帳戶: { account }</h2>
            <hr />
            <div className='flex-container'>
                <TerapagosMint></TerapagosMint>
                <OgerponMint></OgerponMint>
                <OgerponMintTest></OgerponMintTest>
            </div>
        </>
    )
}

export default Mint;