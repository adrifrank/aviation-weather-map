import { ToggleButton, styled, type ToggleButtonProps } from '@mui/material';

export interface StyledToggleButtonProps extends ToggleButtonProps {
  selectedColor: string;
}

export const StyledToggleButton = styled(ToggleButton, {
  shouldForwardProp: (prop) => prop !== 'selectedColor',
})<StyledToggleButtonProps>(
  ({ theme, selectedColor }) => ({
    textTransform: 'none',
    fontWeight: 500,
    padding: '6px 16px',
    '&.MuiToggleButtonGroup-grouped': {
      borderRadius: '50px !important',
      border: `1px solid ${theme.palette.grey[300]} !important`,
      marginRight: theme.spacing(1),
      '&:not(:first-of-type)': {
        marginLeft: theme.spacing(1),
      },
      '&.Mui-selected': {
        border: '1px solid transparent !important',
      },
    },
    '&.Mui-selected': {
      backgroundColor: selectedColor,
      color: '#fff',
      '&:hover': {
        backgroundColor: selectedColor,
      },
    },
  }),
);
