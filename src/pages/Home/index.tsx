import { useCallback, useEffect, useState } from 'react';

import {
  Button,
  Divider,
  Input,
  TableContainer,
  TableHead,
  Table as MaterialTable,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import Table from '../../components/Table';
import TableQuestions from '../../components/TableQuestions';

import {
  Container,
  ContainerButtons,
  ContainerInputs,
  Content,
  Title,
} from './styles';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ShuffleIcon from '@mui/icons-material/Shuffle';

import { generateQuestions, isNumeric, shuffleArray } from '../../utils';

type LocalStorageData = {
  handles: string[];
  ratings: string[];
  darkMode: boolean;
};

type Question = {
  name: string;
  rating: number;
  url: string;
};

const handleTableColumns = [
  { id: 'handle', label: 'Handle', align: 'left' },
  { id: 'handle-delete', label: '', align: 'right' },
];

const ratingTableColumns = [
  { id: 'rating', label: 'Rating', align: 'left' },
  { id: 'rating-delete', label: '', align: 'right' },
];

const questionTableColumns = [
  { id: 'question', label: 'Question', align: 'left' },
  { id: 'rating', label: 'Rating', align: 'right' },
];

const Home = () => {
  const [handles, setHandles] = useState<string[]>([]);
  const [ratings, setRatings] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  // input values
  const [handle, setHandle] = useState<string>('');
  const [rating, setRating] = useState<string>('');
  const [showRatings, setShowRatings] = useState<boolean>(false);

  // handles
  const handleChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHandle(e.target.value);
  };

  const handleDeleteHandle = (index: number) => {
    const newHandles = handles.filter(
      (currentHandle, currentIndex) => currentIndex !== index,
    );

    setLocalStorageData(newHandles, ratings, false);
    setHandles(newHandles);
  };

  const handleAddHandle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (handles.find((element) => element === handle)) {
      // handle already exists
      console.log('Handle already exists');
    } else {
      const newHandles = [handle, ...handles];

      setLocalStorageData(newHandles, ratings, false);
      setHandles(newHandles);
    }

    setHandle('');
  };

  // ratings
  const handleChangeRating = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRating(e.target.value);
  };

  const handleDeleteRating = (index: number) => {
    const newRatings = ratings.filter(
      (currentRating, currentIndex) => currentIndex !== index,
    );

    setLocalStorageData(handles, newRatings, false);
    setRatings(newRatings);
  };

  const handleAddRating = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newRatings = [rating, ...ratings];

    setLocalStorageData(handles, newRatings, false);
    setRatings(newRatings);

    setRating('');
  };

  const handleGenerateQuestions = () => {
    setShowRatings(false);
    setQuestions(generateQuestions(handles, ratings));
  };

  const handleShuffleQuestions = () => {
    setQuestions(state => shuffleArray(state).filter((question) => question.name !== ''));
  }

  // TODO: validar se handle existe na tabela em si... (com check do lado, loading, etc... tem problema ficar batendo na API?)
  // TODO: se ja existe na tabela, ficar vermelho ou não permitir atualizar ou só tremer msm
  // TODO: cores nas handles, não salvar isso no JSON (nunca vai te muitas handles pra bater na API)
  // TODO: botao de copiar...?

  // localStorage
  const getLocalStorageData = () => {
    const localStorageData = localStorage.getItem('config-mashup-builder');

    if (localStorageData) {
      const localStorageConfig: LocalStorageData = JSON.parse(localStorageData);

      setHandles(localStorageConfig.handles);
      setRatings(localStorageConfig.ratings);
    }
  };

  const setLocalStorageData = (
    handles: string[],
    ratings: string[],
    darkMode: boolean,
  ) => {
    localStorage.setItem(
      'config-mashup-builder',
      JSON.stringify({
        handles,
        ratings,
        darkMode,
      }),
    );
  };

  useEffect(() => {
    getLocalStorageData();
  }, []);

  return (
    <Container>
      <ContainerInputs>
        <Content>
          <Title>Handles ({handles.length})</Title>

          <form onSubmit={handleAddHandle}>
            <ContainerButtons>
              <Input
                fullWidth
                placeholder="Handle"
                value={handle}
                onChange={handleChangeHandle}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={handle === ''}
              >
                Add
              </Button>
            </ContainerButtons>
          </form>

          <div>
            <Divider />
            <Table
              columns={handleTableColumns}
              rows={handles}
              handleDelete={handleDeleteHandle}
            />
          </div>
        </Content>

        <Content>
          <Title>Ratings ({ratings.length})</Title>

          <form onSubmit={handleAddRating}>
            <ContainerButtons>
              <Input
                fullWidth
                placeholder="Rating"
                value={rating}
                onChange={handleChangeRating}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={!isNumeric(rating)}
              >
                Add
              </Button>
            </ContainerButtons>
          </form>

          <div>
            <Divider />
            <Table
              columns={ratingTableColumns}
              rows={ratings}
              handleDelete={handleDeleteRating}
            />
          </div>
        </Content>
      </ContainerInputs>

      <Content>
        <Title>Questions ({questions.length})</Title>

        <TableQuestions
          columns={questionTableColumns}
          questions={questions}
          showRatings={showRatings}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            padding: '10px',
          }}
        >
          {showRatings ? (
            <Button
              startIcon={<VisibilityIcon />}
              variant="contained"
              disabled={questions.length === 0}
              onClick={() => setShowRatings(false)}
              sx={{ width: '170px' }}
            >
              Hide Ratings
            </Button>
          ) : (
            <Button
              startIcon={<VisibilityOffIcon />}
              variant="contained"
              disabled={questions.length === 0}
              onClick={() => setShowRatings(true)}
              sx={{ width: '170px' }}
            >
              Show Ratings
            </Button>
          )}

          <Button
            startIcon={<ShuffleIcon />}
            variant="contained"
            disabled={questions.length === 0}
            onClick={() => handleShuffleQuestions()}
          >
            Shuffle
          </Button>

          <Button
            variant="contained"
            disabled={ratings.length === 0}
            onClick={() => handleGenerateQuestions()}
          >
            Generate
          </Button>
        </div>
      </Content>
    </Container>
  );
};

export default Home;
