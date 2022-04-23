import { useEffect, useState } from 'react';

import { Button, Divider, Input } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import Table from '../../components/Table';
import TableProblems from '../../components/TableProblems';

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
import SendIcon from '@mui/icons-material/Send';

import { generateProblems, isNumeric, shuffleArray } from '../../utils';

type LocalStorageData = {
  handles: string[];
  ratings: string[];
  darkMode: boolean;
};

type Problem = {
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

const problemTableColumns = [
  { id: 'problem', label: 'Problem', align: 'left' },
  { id: 'rating', label: 'Rating', align: 'right' },
];

const Home = () => {
  const [handles, setHandles] = useState<string[]>([]);
  const [ratings, setRatings] = useState<string[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);

  // input values
  const [handle, setHandle] = useState<string>('');
  const [rating, setRating] = useState<string>('');
  const [showRatings, setShowRatings] = useState<boolean>(false);
  const [loadingProblems, setLoadingProblems] = useState<boolean>(false);

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

  const handleGenerateProblems = () => {
    setShowRatings(false);
    setLoadingProblems(true);

    generateProblems(handles, ratings)
      .then((generatedProblems) => {
        setProblems(generatedProblems);
        setLoadingProblems(false);

        console.log(generatedProblems);
      })
      .catch((error: any) => {
        console.log('Ocorreu um erro!');
        console.error(error);

        setLoadingProblems(false);
      });
  };

  const handleShuffleProblems = () => {
    setProblems((state) =>
      shuffleArray(state).filter((problem) => problem.name !== ''),
    );
  };

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
        <Title>Problems ({problems.length})</Title>

        <TableProblems
          columns={problemTableColumns}
          problems={problems}
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
              disabled={problems.length === 0}
              onClick={() => setShowRatings(false)}
              sx={{ width: '170px' }}
            >
              Hide Ratings
            </Button>
          ) : (
            <Button
              startIcon={<VisibilityOffIcon />}
              variant="contained"
              disabled={problems.length === 0}
              onClick={() => setShowRatings(true)}
              sx={{ width: '170px' }}
            >
              Show Ratings
            </Button>
          )}

          <Button
            startIcon={<ShuffleIcon />}
            variant="contained"
            disabled={problems.length === 0}
            onClick={() => handleShuffleProblems()}
          >
            Shuffle
          </Button>

          <LoadingButton
            variant="contained"
            disabled={ratings.length === 0}
            onClick={() => handleGenerateProblems()}
            loading={loadingProblems}
            loadingPosition="end"
            endIcon={<SendIcon />}
          >
            Generate
          </LoadingButton>
        </div>
      </Content>
    </Container>
  );
};

export default Home;
