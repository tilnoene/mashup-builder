import { Checkbox as CheckboxMUI } from '@mui/material';

import { Container } from './styles';

const Checkbox = ({ checked, onChange, label }: any) => {
    return (
        <Container>
            <CheckboxMUI checked={checked} onChange={onChange} inputProps={{ 'aria-label': 'controlled' }} />
            <p>{label}</p>
        </Container>
    );
}

export default Checkbox;