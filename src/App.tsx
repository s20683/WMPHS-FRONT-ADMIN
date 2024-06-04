import { ThemeProvider } from '@emotion/react';
import React from 'react';
import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import theme from "./styles/theme";
import MainLayout from "./layouts/MainLayout";
import {Box} from "@mui/material";
import OrdersPanel from "./orders/OrdersPanel";
import ProductsPanel from "./products/ProductsPanel";
import StocksPanel from "./stocks/StocksPanel";

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
                      <Route index element={<Navigate to="/dashboard" />}/>
                      <Route path="/dashboard/*" element={
                          <Box paddingTop={5} mt={pageMargin} paddingLeft={3} paddingRight={3}>
                              {/*<Dashboard />*/}
                          </Box>
                      } />
                      <Route>
                          <Route path="/orders" element={
                              <Box paddingTop={pagePadding} mt={pageMargin} paddingLeft={5} paddingRight={5}>
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

                  </Route>
              </Routes>
          </ThemeProvider>
      </HashRouter>
    </>
  );
}

export default App;
