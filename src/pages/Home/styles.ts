import styled from 'styled-components';

import { Paper } from '@mui/material';

export const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  padding: 30px 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;

  @media(max-width: 700px) {
    justify-content: center;
    flex-direction: column;
    gap: 30px;
  }
`;

export const Content = styled(Paper)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
`;

export const Title = styled.h2`
  text-align: center;
  padding: 0;
  margin: 0;
  padding-bottom: 8px;
`;

export const ContainerButtons = styled.div`
  display: flex;
  gap: 18px;
  padding: 0 10px;
`;

export const ContainerInputs = styled.div`
  display: flex;
  gap: 30px;
`;