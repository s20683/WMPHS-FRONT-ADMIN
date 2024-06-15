import { ThemeProvider } from '@emotion/react';
import React from 'react';
import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import theme from "./styles/theme";
import MainLayout from "./layouts/MainLayout";
import {Box} from "@mui/material";
import OrdersPanel from "./orders/OrdersPanel";
import ProductsPanel from "./products/ProductsPanel";
import StocksPanel from "./stocks/StocksPanel";
import DestinationsPanel from "./destinations/DestinationsPanel";
import UsersPanel from "./users/UsersPanel";

function App() {
    const pagePadding = 5;
    const pageMargin = 0;
  return (
    <>
      <HashRouter>
          <ThemeProvider theme={theme}>
              <Routes>
                  <Route path="/" element={
                      <MainLayout />
                  }>
                      <Route index element={<Navigate to="/orders" />}/>
                      <Route>
                          <Route path="/orders" element={
                              <Box paddingTop={2} mt={pageMargin} paddingLeft={5} paddingRight={5}>
                                  <OrdersPanel/>
                              </Box>
                          } />
                      </Route>
                      <Route>
                          <Route path="/stock" element={
                              <Box paddingTop={3} mt={pageMargin} paddingLeft={5} paddingRight={5}>
                                  <StocksPanel/>
                              </Box>
                          } />
                      </Route>
                      <Route>
                          <Route path="/products" element={
                              <Box paddingTop={3} mt={pageMargin} paddingLeft={5} paddingRight={5}>
                                  <ProductsPanel/>
                              </Box>
                          } />
                      </Route>
                      <Route>
                          <Route path="/destinations" element={
                              <Box paddingTop={3} mt={pageMargin} paddingLeft={5} paddingRight={5}>
                                  <DestinationsPanel/>
                              </Box>
                          } />
                      </Route>
                      <Route>
                          <Route path="/users" element={
                              <Box paddingTop={3} mt={pageMargin} paddingLeft={5} paddingRight={5}>
                                  <UsersPanel/>
                              </Box>
                          } />
                      </Route>

                  </Route>
              </Routes>
          </ThemeProvider>
      </HashRouter>
    </>
  );
}

export default App;
