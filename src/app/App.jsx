import { CssBaseline } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import { MatxTheme } from './components';
import { AuthProvider } from './contexts/JWTAuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { Mainnet, DAppProvider, useEtherBalance, useEthers, Config, Goerli} from '@usedapp/core';
import { getDefaultProvider } from 'ethers';
import routes from './routes';
import '../fake-db';

const App = () => {
  const content = useRoutes(routes);
  
  const Config= {
    readOnlyChainId: 33,
    readOnlyUrls: {
      [33]: "http://127.0.0.1:8545",
    },
  }

  return (
    <SettingsProvider>
      <AuthProvider>
        <DAppProvider config={Config}>
          <MatxTheme>
            <CssBaseline />
            {content}
          </MatxTheme>
        </DAppProvider>
      </AuthProvider>
    </SettingsProvider>
  );
};

export default App;
