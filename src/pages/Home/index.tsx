import { useEffect, useState } from 'react';

import { Button, Divider, Input, FormGroup, FormControlLabel } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import Table from '../../components/Table';
import TableProblems from '../../components/TableProblems';
import Checkbox from '../../components/Checkbox';

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
  div1: boolean;
  div2: boolean;
  div3: boolean;
  div4: boolean;
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
  const [checkboxDiv1, setCheckboxDiv1] = useState<boolean>(true);
  const [checkboxDiv2, setCheckboxDiv2] = useState<boolean>(true);
  const [checkboxDiv3, setCheckboxDiv3] = useState<boolean>(true);
  const [checkboxDiv4, setCheckboxDiv4] = useState<boolean>(true);

  // handles
  const handleChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHandle(e.target.value);
  };

  const handleDeleteHandle = (index: number) => {
    const newHandles = handles.filter(
      (currentHandle, currentIndex) => currentIndex !== index,
    );

    setLocalStorageData(newHandles, ratings, checkboxDiv1, checkboxDiv2, checkboxDiv3, checkboxDiv4, false);
    setHandles(newHandles);
  };

  const handleAddHandle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (handles.find((element) => element === handle)) {
      // handle already exists
      console.log('Handle already exists');
    } else {
      const newHandles = [handle, ...handles];

      setLocalStorageData(newHandles, ratings, checkboxDiv1, checkboxDiv2, checkboxDiv3, checkboxDiv4, false);
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

    setLocalStorageData(handles, newRatings, checkboxDiv1, checkboxDiv2, checkboxDiv3, checkboxDiv4, false);
    setRatings(newRatings);
  };

  const handleAddRating = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newRatings = [rating, ...ratings];

    setLocalStorageData(handles, newRatings, checkboxDiv1, checkboxDiv2, checkboxDiv3, checkboxDiv4, false);
    setRatings(newRatings);

    setRating('');
  };

  const handleChangeCheckboxDiv1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckboxDiv1(event.target.checked);
    setLocalStorageData(handles, ratings, event.target.checked, checkboxDiv2, checkboxDiv3, checkboxDiv4, false);
  };

  const handleChangeCheckboxDiv2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckboxDiv2(event.target.checked);
    setLocalStorageData(handles, ratings, checkboxDiv1, event.target.checked, checkboxDiv3, checkboxDiv4, false);
  };

  const handleChangeCheckboxDiv3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckboxDiv3(event.target.checked);
    setLocalStorageData(handles, ratings, checkboxDiv1, checkboxDiv2, event.target.checked, checkboxDiv4, false);
  };

  const handleChangeCheckboxDiv4 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckboxDiv4(event.target.checked);
    setLocalStorageData(handles, ratings, checkboxDiv1, checkboxDiv2, checkboxDiv3, event.target.checked, false);
  };

  const handleGenerateProblems = () => {
    setShowRatings(false);
    setLoadingProblems(true);

    generateProblems(handles, ratings, checkboxDiv1, checkboxDiv2, checkboxDiv3, checkboxDiv4)
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
      setCheckboxDiv1(localStorageConfig.div1);
      setCheckboxDiv2(localStorageConfig.div2);
      setCheckboxDiv3(localStorageConfig.div3);
      setCheckboxDiv4(localStorageConfig.div4);
    }
  };

  const setLocalStorageData = (
    handles: string[],
    ratings: string[],
    div1: boolean,
    div2: boolean,
    div3: boolean,
    div4: boolean,
    darkMode: boolean,
  ) => {
    localStorage.setItem(
      'config-mashup-builder',
      JSON.stringify({
        handles,
        ratings,
        div1,
        div2,
        div3,
        div4,
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

        <Content>
          <Title>Settings</Title>

          <div>
            <Checkbox checked={checkboxDiv1} onChange={handleChangeCheckboxDiv1} label="Div. 1" />
            <Checkbox checked={checkboxDiv2} onChange={handleChangeCheckboxDiv2} label="Div. 2" />
            <Checkbox checked={checkboxDiv3} onChange={handleChangeCheckboxDiv3} label="Div. 3" />
            <Checkbox checked={checkboxDiv4} onChange={handleChangeCheckboxDiv4} label="Div. 4" />
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
