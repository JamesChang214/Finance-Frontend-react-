import React from 'react';
import { Container, Grid } from 'semantic-ui-react';

//import discordLogo from '../../staticAssets/images/discord-logo.svg';

const Footer = () => (
  <div className="footer-wrapper">
    <footer>
      <Container className="footer">
        <Grid>
          <Grid columns={1} centered>
            {/*
            <Grid.Column>
              <h4>Main categories</h4>
              <List link>
                <List.Item as="a">Cryptocurrencies and Blockchain</List.Item>
                <List.Item as="a">Crypto Trading & Investing</List.Item>
                <List.Item as="a">EOS</List.Item>
                <List.Item as="a">Bitcoin BTC</List.Item>
                <List.Item as="a">Ethereum ETH</List.Item>
                <List.Item as="a">Ripple XRP</List.Item>
                <List.Item as="a">Stellar XLM</List.Item>
                <List.Item as="a">Cardano ADA</List.Item>
                <List.Item as="a">Tron TRX</List.Item>
                <List.Item as="a">NEO</List.Item>
                <List.Item as="a">Steem & Steemit</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column>
              <h4>Featured Content</h4>
              <List link>
                <List.Item as="a">How to invest in Cryptocurrency and Bitcoin</List.Item>
                <List.Item as="a">Top Cryptocurrency and Bitcoin Exchanges</List.Item>
                <List.Item as="a">Cryptocurrency Portfolio Trackers</List.Item>
                <List.Item as="a">Buy Bitcoins in Australia</List.Item>
                <List.Item as="a">Buy Cryptocurrency in Australia</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column>
              <h4>Main Menu</h4>
              <List link>
                <List.Item as="a">Crypto & Tech</List.Item>
                <List.Item as="a">General Interest</List.Item>
                <List.Item as="a">Cryptocurrency Portfolio Trackers</List.Item>
                <List.Item as="a">Trybe TV</List.Item>
                <List.Item as="a">Token Sale</List.Item>
              </List>
              <h4>Contact</h4>
              <List link>
                <List.Item as="a">info@trybe.one</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column>
              <h4>Main Menu</h4>
              <Image src={discordLogo} />
              <List link>
                <List.Item as="a">Crypto & Tech</List.Item>
                <List.Item as="a">General Interest</List.Item>
                <List.Item as="a">Cryptocurrency Portfolio Trackers</List.Item>
                <List.Item as="a">Trybe TV</List.Item>
                <List.Item as="a">Token Sale</List.Item>
                <List.Item as="a" href="/sitemap.xml">Sitemap</List.Item>
              </List>
              <Button className="telegram" centered>
                <i className="fab fa-telegram-plane" />
              </Button>
              <Button className="discord">
                <i className="fab fa-discord" />
              </Button>
              <Button color="twitter">
                <i className="fab fa-twitter" />
              </Button>
              <Button color="youtube">
                <i className="fab fa-youtube" />
              </Button>
              <Button color="facebook">
                <i className="fab fa-facebook" />
              </Button>
            </Grid.Column>
            */}
          </Grid>
        </Grid>
      </Container>
    </footer>
  </div>
);

export default Footer;
